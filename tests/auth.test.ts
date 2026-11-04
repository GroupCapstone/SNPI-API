import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createApp } from '../src/app';
import { RoleModel } from '../src/modules/role/role.model';
import { UserModel } from '../src/modules/user/user.model';
import { PasswordUtil } from '../src/utils/password';
import { TokenUtil } from '../src/utils/token';
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

describe('Production Authentication & Security API Tests', () => {
  const app = createApp();

  const mockUserId = '507f1f77bcf86cd799439001';
  const mockSchoolId = '507f1f77bcf86cd799439002';
  const plainPassword = TEST_PASSWORD;
  const validPasswordHash = PasswordUtil.hash(plainPassword);

  const mockUserDoc = {
    _id: mockUserId,
    schoolId: { _id: mockSchoolId, code: 'SNP', nameEn: 'SNP International' },
    username: 'admin',
    email: 'admin@snp.edu.kh',
    passwordHash: validPasswordHash,
    roles: ['super_admin'],
    branchAccess: 'all',
    status: 'active',
    failedLoginAttempts: 0,
    lockedUntil: undefined,
    mustChangePassword: false,
    tokenVersion: 0,
    refreshTokenHash: '',
    previousRefreshTokenHash: undefined as string | undefined,
    tokenRotatedAt: undefined as Date | undefined,
    isDeleted: false,
    save: vi.fn().mockResolvedValue(true),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUserDoc.passwordHash = validPasswordHash;
    mockUserDoc.status = 'active';
    mockUserDoc.failedLoginAttempts = 0;
    mockUserDoc.lockedUntil = undefined;
    mockUserDoc.tokenVersion = 0;
    mockUserDoc.refreshTokenHash = '';
    mockUserDoc.previousRefreshTokenHash = undefined;
    mockUserDoc.tokenRotatedAt = undefined;
    vi.mocked(RoleModel.find).mockReturnValue({
      exec: vi
        .fn()
        .mockResolvedValue([
          { code: 'super_admin', permissions: ['*'], status: 'active', isDeleted: false },
        ]),
    } as never);
  });

  describe('POST /api/v1/auth/login', () => {
    it('successfully logs in with valid credentials and sets HttpOnly cookie', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(mockUserDoc),
      };

      vi.mocked(UserModel.findOne).mockReturnValue(mockQuery as never);

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ identifier: 'admin', password: plainPassword });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.username).toBe('admin');
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.user.passwordHash).toBeUndefined();

      const cookies = response.headers['set-cookie'] as unknown as string[];
      expect(cookies).toBeDefined();
      expect(cookies.some((c) => c.includes('refreshToken') && c.includes('HttpOnly'))).toBe(true);
      expect(cookies.some((c) => c.includes('SameSite=Strict'))).toBe(true);
    });

    it('rejects login with incorrect password and increments failed attempts', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(mockUserDoc),
      };

      vi.mocked(UserModel.findOne).mockReturnValue(mockQuery as never);

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ identifier: 'admin', password: 'WrongPassword@999' });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(mockUserDoc.save).toHaveBeenCalled();
    });

    it('rejects login when account is inactive', async () => {
      const inactiveUser = { ...mockUserDoc, status: 'inactive' };
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(inactiveUser),
      };

      vi.mocked(UserModel.findOne).mockReturnValue(mockQuery as never);

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ identifier: 'admin', password: plainPassword });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    it('rejects login when account is temporarily locked', async () => {
      const lockedUser = {
        ...mockUserDoc,
        status: 'locked',
        lockedUntil: new Date(Date.now() + 10 * 60 * 1000),
      };
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(lockedUser),
      };

      vi.mocked(UserModel.findOne).mockReturnValue(mockQuery as never);

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ identifier: 'admin', password: plainPassword });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/refresh', () => {
    it('issues a new access token when valid refresh token is provided', async () => {
      const rawRefreshToken = TokenUtil.generateRefreshToken({ userId: mockUserId });
      const hashed = TokenUtil.hashToken(rawRefreshToken);

      const userWithRefreshToken = {
        ...mockUserDoc,
        refreshTokenHash: hashed,
      };

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(userWithRefreshToken),
      };

      vi.mocked(UserModel.findOne).mockReturnValue(mockQuery as never);

      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .set('Cookie', [`refreshToken=${rawRefreshToken}`])
        .send({});

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.accessToken).toBeDefined();

      const replay = await request(app)
        .post('/api/v1/auth/refresh')
        .set('Cookie', [`refreshToken=${rawRefreshToken}`])
        .send({});
      expect(replay.status).toBe(401);
    });

    it('rejects refresh when refresh token is missing or invalid', async () => {
      const response = await request(app).post('/api/v1/auth/refresh').send({});

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('clears refresh token cookie and invalidates user session', async () => {
      const token = TokenUtil.generateAccessToken({
        userId: mockUserId,
        username: 'admin',
        email: 'admin@snp.edu.kh',
      });

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(mockUserDoc),
      };

      vi.mocked(UserModel.findOne).mockReturnValue(mockQuery as never);

      const response = await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(mockUserDoc.save).toHaveBeenCalled();

      const revokedResponse = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${token}`);
      expect(revokedResponse.status).toBe(401);
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('returns sanitized user profile with dynamic permissions', async () => {
      const token = TokenUtil.generateAccessToken({
        userId: mockUserId,
        username: 'admin',
        email: 'admin@snp.edu.kh',
      });

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(mockUserDoc),
      };

      vi.mocked(UserModel.findOne).mockReturnValue(mockQuery as never);

      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.username).toBe('admin');
      expect(response.body.data.permissions.length).toBeGreaterThan(0);
    });

    it('rejects request without authentication token', async () => {
      const response = await request(app).get('/api/v1/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PATCH /api/v1/auth/change-password', () => {
    it('changes password with valid current password and complexity', async () => {
      const token = TokenUtil.generateAccessToken({
        userId: mockUserId,
        username: 'admin',
        email: 'admin@snp.edu.kh',
      });

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(mockUserDoc),
      };

      vi.mocked(UserModel.findOne).mockReturnValue(mockQuery as never);

      const response = await request(app)
        .patch('/api/v1/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send({
          currentPassword: plainPassword,
          newPassword: 'NewSecurePassword@2026',
          confirmPassword: 'NewSecurePassword@2026',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(mockUserDoc.save).toHaveBeenCalled();
    });

    it('rejects password change when current password is wrong', async () => {
      const token = TokenUtil.generateAccessToken({
        userId: mockUserId,
        username: 'admin',
        email: 'admin@snp.edu.kh',
      });

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(mockUserDoc),
      };

      vi.mocked(UserModel.findOne).mockReturnValue(mockQuery as never);

      const response = await request(app)
        .patch('/api/v1/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send({
          currentPassword: 'WrongPassword@000',
          newPassword: 'NewSecurePassword@2026',
          confirmPassword: 'NewSecurePassword@2026',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
