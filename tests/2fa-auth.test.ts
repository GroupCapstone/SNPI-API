import { createHash } from 'node:crypto';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createApp } from '../src/app';
import { RoleModel } from '../src/modules/role/role.model';
import { UserModel } from '../src/modules/user/user.model';
import { PasswordUtil } from '../src/utils/password';
import { decryptTotpSecret } from '../src/utils/secret-crypto';
import { TokenUtil } from '../src/utils/token';
import { generateBackupCodes, generateTotpCode, generateTotpSecret } from '../src/utils/totp';
import { TEST_PASSWORD } from './fixtures/test-credentials';

vi.mock('../src/modules/user/user.model', () => ({
  UserModel: {
    find: vi.fn(),
    findOne: vi.fn(),
    findOneAndUpdate: vi.fn(),
    create: vi.fn(),
    countDocuments: vi.fn(),
  },
}));

vi.mock('../src/modules/role/role.model', () => ({
  RoleModel: {
    find: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock('../src/modules/audit-log/audit-log.service', () => ({
  AuditLogService: class {
    public static log = vi.fn().mockResolvedValue(undefined);
    public getAuditLogs = vi.fn().mockResolvedValue({ data: [], total: 0 });
  },
}));

describe('Two-Factor Authentication (2FA) & Recovery API Tests', () => {
  const app = createApp();

  const mockUserId = '507f1f77bcf86cd799439001';
  const mockAdminId = '507f1f77bcf86cd799439003';
  const mockSchoolId = '507f1f77bcf86cd799439002';
  const plainPassword = TEST_PASSWORD;
  const validPasswordHash = PasswordUtil.hash(plainPassword);

  const totpSecret = generateTotpSecret(20);
  const backupCodesData = generateBackupCodes(8);

  const mockUserDoc = {
    _id: mockUserId,
    schoolId: { _id: mockSchoolId, code: 'SNP', nameEn: 'SNP International' },
    username: 'testuser',
    email: 'user@snp.edu.kh',
    passwordHash: validPasswordHash,
    roles: ['teacher'],
    branchAccess: 'all',
    status: 'active',
    failedLoginAttempts: 0,
    lockedUntil: undefined as Date | undefined,
    mustChangePassword: false,
    tokenVersion: 0,
    refreshTokenHash: '',
    previousRefreshTokenHash: undefined as string | undefined,
    tokenRotatedAt: undefined as Date | undefined,
    isDeleted: false,
    twoFactor: {
      enabled: false,
      secret: undefined as string | undefined,
      confirmedAt: null as Date | null,
      tempSecret: undefined as string | undefined,
      tempBackupCodes: undefined as Array<{ codeHash: string; usedAt: Date | null }> | undefined,
      backupCodes: [] as Array<{ codeHash: string; usedAt: Date | null }>,
    },
    save: vi.fn().mockResolvedValue(true),
    markModified: vi.fn(),
  };

  const mockAdminDoc = {
    _id: mockAdminId,
    schoolId: { _id: mockSchoolId, code: 'SNP', nameEn: 'SNP International' },
    username: 'admin',
    email: 'admin@snp.edu.kh',
    passwordHash: validPasswordHash,
    roles: ['super_admin'],
    branchAccess: 'all',
    status: 'active',
    failedLoginAttempts: 0,
    lockedUntil: undefined as Date | undefined,
    mustChangePassword: false,
    tokenVersion: 0,
    refreshTokenHash: '',
    isDeleted: false,
    save: vi.fn().mockResolvedValue(true),
    markModified: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUserDoc.passwordHash = validPasswordHash;
    mockUserDoc.status = 'active';
    mockUserDoc.failedLoginAttempts = 0;
    mockUserDoc.lockedUntil = undefined;
    mockUserDoc.tokenVersion = 0;
    mockUserDoc.twoFactor = {
      enabled: false,
      secret: undefined,
      confirmedAt: null,
      tempSecret: undefined,
      tempBackupCodes: undefined,
      backupCodes: [],
    };

    vi.mocked(RoleModel.find).mockReturnValue({
      exec: vi.fn().mockResolvedValue([
        { code: 'super_admin', permissions: ['*'], status: 'active', isDeleted: false },
        { code: 'teacher', permissions: ['attendance.mark'], status: 'active', isDeleted: false },
      ]),
    } as never);
  });

  describe('Login with 2FA Challenge', () => {
    it('returns mfaRequired and mfaToken when 2FA is enabled', async () => {
      mockUserDoc.twoFactor = {
        enabled: true,
        secret: totpSecret,
        confirmedAt: new Date(),
        tempSecret: undefined,
        tempBackupCodes: undefined,
        backupCodes: backupCodesData.hashedCodes,
      };

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(mockUserDoc),
      };
      vi.mocked(UserModel.findOne).mockReturnValue(mockQuery as never);

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ identifier: 'testuser', password: plainPassword });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.mfaRequired).toBe(true);
      expect(response.body.data.mfaToken).toBeDefined();
      expect(response.body.data.accessToken).toBeUndefined();

      // Ensure no refreshToken cookie is issued during MFA challenge phase
      const cookies = response.headers['set-cookie'] as unknown as string[] | undefined;
      expect(cookies).toBeUndefined();
    });
  });

  describe('POST /api/v1/auth/2fa/verify', () => {
    it('successfully verifies with a valid 6-digit TOTP code and issues tokens', async () => {
      mockUserDoc.twoFactor = {
        enabled: true,
        secret: totpSecret,
        confirmedAt: new Date(),
        tempSecret: undefined,
        tempBackupCodes: undefined,
        backupCodes: backupCodesData.hashedCodes,
      };

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(mockUserDoc),
      };
      vi.mocked(UserModel.findOne).mockReturnValue(mockQuery as never);

      const mfaToken = TokenUtil.generateMfaToken({ userId: mockUserId });
      const validCode = generateTotpCode(totpSecret);

      const response = await request(app)
        .post('/api/v1/auth/2fa/verify')
        .send({ mfaToken, code: validCode });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.user.username).toBe('testuser');

      const cookies = response.headers['set-cookie'] as unknown as string[];
      expect(cookies).toBeDefined();
      expect(cookies.some((c) => c.includes('refreshToken'))).toBe(true);
    });

    it('successfully verifies with a single-use backup recovery code and burns it', async () => {
      // Deep clone hashed codes so we can check mutation
      const codes = backupCodesData.hashedCodes.map((c) => ({ ...c }));
      mockUserDoc.twoFactor = {
        enabled: true,
        secret: totpSecret,
        confirmedAt: new Date(),
        tempSecret: undefined,
        tempBackupCodes: undefined,
        backupCodes: codes,
      };

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(mockUserDoc),
      };
      vi.mocked(UserModel.findOne).mockReturnValue(mockQuery as never);

      const mfaToken = TokenUtil.generateMfaToken({ userId: mockUserId });
      const firstBackupCode = backupCodesData.plainCodes[0]!;

      const response = await request(app)
        .post('/api/v1/auth/2fa/verify')
        .send({ mfaToken, code: firstBackupCode });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.accessToken).toBeDefined();

      // Verify code was marked as used
      expect(codes[0]!.usedAt).not.toBeNull();
      expect(mockUserDoc.markModified).toHaveBeenCalledWith('twoFactor.backupCodes');
    });

    it('rejects an already-used backup recovery code', async () => {
      const codes = backupCodesData.hashedCodes.map((c) => ({ ...c, usedAt: new Date() }));
      mockUserDoc.twoFactor = {
        enabled: true,
        secret: totpSecret,
        confirmedAt: new Date(),
        tempSecret: undefined,
        tempBackupCodes: undefined,
        backupCodes: codes,
      };

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(mockUserDoc),
      };
      vi.mocked(UserModel.findOne).mockReturnValue(mockQuery as never);

      const mfaToken = TokenUtil.generateMfaToken({ userId: mockUserId });
      const usedBackupCode = backupCodesData.plainCodes[0]!;

      const response = await request(app)
        .post('/api/v1/auth/2fa/verify')
        .send({ mfaToken, code: usedBackupCode });

      expect(response.status).toBe(401);
      expect(response.body.message).toContain('Invalid 2FA verification code');
    });

    it('rejects an invalid TOTP code and increments failedLoginAttempts', async () => {
      mockUserDoc.twoFactor = {
        enabled: true,
        secret: totpSecret,
        confirmedAt: new Date(),
        tempSecret: undefined,
        tempBackupCodes: undefined,
        backupCodes: backupCodesData.hashedCodes,
      };

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(mockUserDoc),
      };
      vi.mocked(UserModel.findOne).mockReturnValue(mockQuery as never);

      const mfaToken = TokenUtil.generateMfaToken({ userId: mockUserId });

      const response = await request(app)
        .post('/api/v1/auth/2fa/verify')
        .send({ mfaToken, code: '000000' });

      expect(response.status).toBe(401);
      expect(response.body.message).toContain('Invalid 2FA verification code');
      expect(mockUserDoc.failedLoginAttempts).toBe(1);
    });

    it('rejects with 401 when mfaToken is malformed or forged', async () => {
      const response = await request(app)
        .post('/api/v1/auth/2fa/verify')
        .send({ mfaToken: 'invalid.token.here', code: '123456' });

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/v1/auth/2fa/setup', () => {
    it('generates secret, QR data URL, and 8 backup codes for authenticated user', async () => {
      const accessToken = TokenUtil.generateAccessToken({
        userId: mockUserId,
        username: 'testuser',
        email: 'user@snp.edu.kh',
      });

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(mockUserDoc),
      };
      vi.mocked(UserModel.findOne).mockReturnValue(mockQuery as never);

      const response = await request(app)
        .post('/api/v1/auth/2fa/setup')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.secret).toBeDefined();
      expect(response.body.data.otpauthUri).toContain('otpauth://totp/');
      expect(response.body.data.qrCodeDataUrl).toContain('data:image/png;base64');
      expect(response.body.data.backupCodes).toHaveLength(8);

      expect(mockUserDoc.twoFactor.tempSecret).toBeDefined();
      expect(mockUserDoc.twoFactor.tempSecret).not.toBe(response.body.data.secret);
      expect(decryptTotpSecret(mockUserDoc.twoFactor.tempSecret ?? '')).toBe(
        response.body.data.secret,
      );
      expect(mockUserDoc.twoFactor.tempBackupCodes).toHaveLength(8);
      expect(mockUserDoc.save).toHaveBeenCalled();
    });
  });

  describe('POST /api/v1/auth/2fa/enable', () => {
    it('confirms setup with a valid TOTP code and activates 2FA', async () => {
      const accessToken = TokenUtil.generateAccessToken({
        userId: mockUserId,
        username: 'testuser',
        email: 'user@snp.edu.kh',
      });

      mockUserDoc.twoFactor = {
        enabled: false,
        secret: undefined,
        confirmedAt: null,
        tempSecret: totpSecret,
        tempBackupCodes: backupCodesData.hashedCodes,
        backupCodes: [],
      };

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(mockUserDoc),
      };
      vi.mocked(UserModel.findOne).mockReturnValue(mockQuery as never);

      const validCode = generateTotpCode(totpSecret);

      const response = await request(app)
        .post('/api/v1/auth/2fa/enable')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ code: validCode });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(mockUserDoc.twoFactor.enabled).toBe(true);
      expect(mockUserDoc.twoFactor.secret).toBe(totpSecret);
      expect(mockUserDoc.twoFactor.backupCodes).toHaveLength(8);
      expect(mockUserDoc.twoFactor.tempSecret).toBeUndefined();
    });

    it('rejects enable with invalid TOTP code', async () => {
      const accessToken = TokenUtil.generateAccessToken({
        userId: mockUserId,
        username: 'testuser',
        email: 'user@snp.edu.kh',
      });

      mockUserDoc.twoFactor = {
        enabled: false,
        secret: undefined,
        confirmedAt: null,
        tempSecret: totpSecret,
        tempBackupCodes: backupCodesData.hashedCodes,
        backupCodes: [],
      };

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(mockUserDoc),
      };
      vi.mocked(UserModel.findOne).mockReturnValue(mockQuery as never);

      const response = await request(app)
        .post('/api/v1/auth/2fa/enable')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ code: '999999' });

      expect(response.status).toBe(401);
      expect(mockUserDoc.twoFactor.enabled).toBe(false);
    });
  });

  describe('POST /api/v1/auth/2fa/disable', () => {
    it('disables 2FA when valid password and TOTP code are provided', async () => {
      const accessToken = TokenUtil.generateAccessToken({
        userId: mockUserId,
        username: 'testuser',
        email: 'user@snp.edu.kh',
      });

      mockUserDoc.twoFactor = {
        enabled: true,
        secret: totpSecret,
        confirmedAt: new Date(),
        tempSecret: undefined,
        tempBackupCodes: undefined,
        backupCodes: backupCodesData.hashedCodes,
      };

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(mockUserDoc),
      };
      vi.mocked(UserModel.findOne).mockReturnValue(mockQuery as never);

      const validCode = generateTotpCode(totpSecret);

      const response = await request(app)
        .post('/api/v1/auth/2fa/disable')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ password: plainPassword, code: validCode });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(mockUserDoc.twoFactor.enabled).toBe(false);
      expect(mockUserDoc.twoFactor.secret).toBeUndefined();
      expect(mockUserDoc.twoFactor.backupCodes).toHaveLength(0);
    });

    it('rejects disable when password is wrong', async () => {
      const accessToken = TokenUtil.generateAccessToken({
        userId: mockUserId,
        username: 'testuser',
        email: 'user@snp.edu.kh',
      });

      mockUserDoc.twoFactor = {
        enabled: true,
        secret: totpSecret,
        confirmedAt: new Date(),
        tempSecret: undefined,
        tempBackupCodes: undefined,
        backupCodes: backupCodesData.hashedCodes,
      };

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(mockUserDoc),
      };
      vi.mocked(UserModel.findOne).mockReturnValue(mockQuery as never);

      const validCode = generateTotpCode(totpSecret);

      const response = await request(app)
        .post('/api/v1/auth/2fa/disable')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ password: 'WrongPassword!', code: validCode });

      expect(response.status).toBe(401);
      expect(mockUserDoc.twoFactor.enabled).toBe(true);
    });
  });

  describe('POST /api/v1/auth/2fa/reset-user/:id (Break-Glass Admin Reset)', () => {
    it('allows administrator to reset a locked-out user 2FA configuration', async () => {
      const adminToken = TokenUtil.generateAccessToken({
        userId: mockAdminId,
        username: 'admin',
        email: 'admin@snp.edu.kh',
      });

      mockUserDoc.twoFactor = {
        enabled: true,
        secret: totpSecret,
        confirmedAt: new Date(),
        tempSecret: undefined,
        tempBackupCodes: undefined,
        backupCodes: backupCodesData.hashedCodes,
      };

      // Mock findOne for authenticate middleware (admin) and then findByIdWithSecrets (user)
      vi.mocked(UserModel.findOne).mockImplementation(((query: { _id?: string }) => {
        const queryId = query._id?.toString();
        const doc = queryId === mockAdminId ? mockAdminDoc : mockUserDoc;
        return {
          select: vi.fn().mockReturnThis(),
          populate: vi.fn().mockReturnThis(),
          exec: vi.fn().mockResolvedValue(doc),
        };
      }) as never);

      const response = await request(app)
        .post(`/api/v1/auth/2fa/reset-user/${mockUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(mockUserDoc.twoFactor.enabled).toBe(false);
      expect(mockUserDoc.twoFactor.secret).toBeUndefined();
      expect(mockUserDoc.twoFactor.backupCodes).toHaveLength(0);
      expect(mockUserDoc.tokenVersion).toBe(1); // Revokes active tokens
    });
  });

  describe('Telegram Fallback 2FA (Solution 2)', () => {
    it('allows authenticated user to link their Telegram account', async () => {
      const accessToken = TokenUtil.generateAccessToken({
        userId: mockUserId,
        username: 'testuser',
        email: 'user@snp.edu.kh',
      });

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(mockUserDoc),
      };
      vi.mocked(UserModel.findOne).mockReturnValue(mockQuery as never);

      const response = await request(app)
        .post('/api/v1/auth/2fa/telegram/link')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ telegramChatId: '987654321' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(mockUserDoc.twoFactor.telegramChatId).toBe('987654321');
      expect(mockUserDoc.save).toHaveBeenCalled();
    });

    it('dispatches a 6-digit OTP to Telegram when requested with mfaToken', async () => {
      mockUserDoc.twoFactor = {
        enabled: true,
        secret: totpSecret,
        confirmedAt: new Date(),
        tempSecret: undefined,
        tempBackupCodes: undefined,
        backupCodes: backupCodesData.hashedCodes,
        telegramChatId: '987654321',
      };

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(mockUserDoc),
      };
      vi.mocked(UserModel.findOne).mockReturnValue(mockQuery as never);

      const mfaToken = TokenUtil.generateMfaToken({ userId: mockUserId });

      const response = await request(app)
        .post('/api/v1/auth/2fa/telegram/request-otp')
        .send({ mfaToken });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(mockUserDoc.twoFactor.telegramOtpHash).toBeDefined();
      expect(mockUserDoc.twoFactor.telegramOtpExpiresAt).toBeInstanceOf(Date);
    });

    it('successfully verifies login using the Telegram OTP code', async () => {
      const telegramOtpCode = '582914';
      const telegramOtpHash = createHash('sha256').update(telegramOtpCode).digest('hex');

      mockUserDoc.twoFactor = {
        enabled: true,
        secret: totpSecret,
        confirmedAt: new Date(),
        tempSecret: undefined,
        tempBackupCodes: undefined,
        backupCodes: backupCodesData.hashedCodes,
        telegramChatId: '987654321',
        telegramOtpHash,
        telegramOtpExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
      };

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(mockUserDoc),
      };
      vi.mocked(UserModel.findOne).mockReturnValue(mockQuery as never);

      const mfaToken = TokenUtil.generateMfaToken({ userId: mockUserId });

      const response = await request(app)
        .post('/api/v1/auth/2fa/verify')
        .send({ mfaToken, code: telegramOtpCode });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.accessToken).toBeDefined();
      // Verifies OTP was burned
      expect(mockUserDoc.twoFactor.telegramOtpHash).toBeUndefined();
      expect(mockUserDoc.twoFactor.telegramOtpExpiresAt).toBeNull();
    });

    it('allows authenticated user to unlink their Telegram account', async () => {
      const accessToken = TokenUtil.generateAccessToken({
        userId: mockUserId,
        username: 'testuser',
        email: 'user@snp.edu.kh',
      });

      mockUserDoc.twoFactor.telegramChatId = '987654321';

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(mockUserDoc),
      };
      vi.mocked(UserModel.findOne).mockReturnValue(mockQuery as never);

      const response = await request(app)
        .post('/api/v1/auth/2fa/telegram/unlink')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({});

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(mockUserDoc.twoFactor.telegramChatId).toBeNull();
    });
  });
});
