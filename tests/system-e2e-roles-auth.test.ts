import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createApp } from '../src/app';
import { DEFAULT_CORE_ROLES } from '../src/constants/permissions';
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
    countDocuments: vi.fn(),
  },
}));

vi.mock('../src/modules/audit-log/audit-log.service', () => ({
  AuditLogService: class {
    public static log = vi.fn().mockResolvedValue(undefined);
    public getAuditLogs = vi.fn().mockResolvedValue({ data: [], total: 0 });
  },
}));

describe('System Security & Multi-Role Authentication Matrix (Non-Destructive)', () => {
  const app = createApp();

  const mockSchoolId = '6a9579f115728cea76ed2bce';
  const defaultPassword = TEST_PASSWORD;
  const defaultHash = PasswordUtil.hash(defaultPassword);

  const mockUsers = DEFAULT_CORE_ROLES.map((r, idx) => ({
    _id: `6a9579f115728cea76ed200${idx}`,
    schoolId: { _id: mockSchoolId, code: 'SNP', nameEn: 'SNP International School' },
    username: `${r.code}.user`,
    email: `${r.code}@snp.edu.kh`,
    passwordHash: defaultHash,
    roles: [r.code],
    branchAccess:
      r.code === 'super_admin' || r.code === 'director' ? 'all' : ['6a9579f115728cea76ed2b01'],
    status: 'active',
    failedLoginAttempts: 0,
    lockedUntil: undefined,
    mustChangePassword: false,
    tokenVersion: 0,
    refreshTokenHash: '',
    isDeleted: false,
    save: vi.fn().mockResolvedValue(true),
  }));

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('1. Dynamic Role Authentication & Token Issue', () => {
    for (const u of mockUsers) {
      it(`should successfully sign in as ${u.roles[0]} (${u.username})`, async () => {
        const queryMock = {
          select: vi.fn().mockReturnThis(),
          populate: vi.fn().mockReturnThis(),
          exec: vi.fn().mockResolvedValue(u),
        };
        (UserModel.findOne as unknown as ReturnType<typeof vi.fn>).mockReturnValue(queryMock);

        const targetRole = DEFAULT_CORE_ROLES.find((r) => r.code === u.roles[0]);
        const rolePermissions = targetRole?.permissions ?? ['school.view.all_branches'];

        (RoleModel.find as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
          exec: vi.fn().mockResolvedValue([
            {
              code: u.roles[0],
              permissions: rolePermissions,
              status: 'active',
              isDeleted: false,
            },
          ]),
        });

        const response = await request(app)
          .post('/api/v1/auth/login')
          .send({ identifier: u.username, password: defaultPassword });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('accessToken');
        expect(response.body.data.user.roles).toContain(u.roles[0]);
        expect(response.body.data.user.permissions).toEqual(
          expect.arrayContaining(rolePermissions),
        );
        expect(response.body.data.user).not.toHaveProperty('passwordHash');
        expect(response.body.data.user).not.toHaveProperty('refreshTokenHash');
        expect(response.body.data.user).toHaveProperty('departmentAccess');
        expect(response.body.data.user).toHaveProperty('assignedClasses');
        expect(response.body.data.user).toHaveProperty('assignedSubjects');
        expect(response.body.data.user).toHaveProperty('defaultBranch');
        expect(response.body.data.user.isSuperAdmin).toBe(u.roles[0] === 'super_admin');
      });
    }
  });

  describe('2. Token Refresh & Security Governance', () => {
    it('should refresh access token when valid refresh cookie is sent', async () => {
      const adminUser = mockUsers[0];
      const refreshToken = TokenUtil.generateRefreshToken({
        userId: adminUser._id,
        tokenVersion: 0,
      });
      const refreshHash = TokenUtil.hashToken(refreshToken);

      const userWithSecret = {
        ...adminUser,
        refreshTokenHash: refreshHash,
      };

      (UserModel.findOne as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(userWithSecret),
      });

      (RoleModel.find as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        exec: vi.fn().mockResolvedValue([
          {
            code: 'super_admin',
            permissions: ['*'],
            status: 'active',
            isDeleted: false,
          },
        ]),
      });

      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .set('Cookie', [`refreshToken=${refreshToken}`]);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('accessToken');
    });

    it('should reject refresh when refresh cookie is missing', async () => {
      const response = await request(app).post('/api/v1/auth/refresh');
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
