import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createApp } from '../src/app';
import { UserModel } from '../src/modules/user/user.model';
import { PasswordUtil } from '../src/utils/password';

vi.mock('../src/modules/role/role.model', () => ({
  RoleModel: {
    find: vi.fn().mockImplementation((query: { code?: { $in?: string[] } }) => {
      const codes = query?.code?.$in || ['staff', 'teacher', 'admin', 'super_admin'];
      return Promise.resolve(
        codes.map((c: string) => ({
          code: c,
          permissions: [],
          status: 'active',
          isDeleted: false,
        })),
      );
    }),
    findOne: vi.fn(),
  },
}));

vi.mock('../src/modules/school/school.model', () => ({
  SchoolModel: {
    findOne: vi.fn(),
  },
}));

vi.mock('../src/modules/employee/employee.model', () => ({
  EmployeeModel: {
    findOne: vi.fn(),
  },
}));

vi.mock('../src/modules/user/user.model', () => ({
  UserModel: {
    find: vi.fn(),
    findOne: vi.fn(),
    findOneAndUpdate: vi.fn(),
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

describe('User Reset Password API Tests', () => {
  const app = createApp();

  const schoolId = '507f1f77bcf86cd799439001';
  const branchId = '507f1f77bcf86cd799439007';
  const userObjectId = '507f1f77bcf86cd799439006';

  const mockTargetStaffUser = {
    _id: userObjectId,
    schoolId: { _id: schoolId, code: 'SNP', nameEn: 'SNP International' },
    username: 'sok.teacher',
    email: 'sok.teacher@snp.edu.kh',
    roles: ['teacher'],
    branchAccess: [branchId],
    status: 'active',
    isDeleted: false,
    tokenVersion: 1,
    mustChangePassword: false,
    save: vi.fn().mockResolvedValue(true),
  };

  const mockTargetDirectorUser = {
    _id: '507f1f77bcf86cd799439008',
    schoolId: { _id: schoolId, code: 'SNP', nameEn: 'SNP International' },
    username: 'director.user',
    email: 'director@snp.edu.kh',
    roles: ['director'],
    branchAccess: 'all',
    status: 'active',
    isDeleted: false,
    tokenVersion: 1,
    mustChangePassword: false,
    save: vi.fn().mockResolvedValue(true),
  };

  const mockTargetSuperAdminUser = {
    _id: '507f1f77bcf86cd799439009',
    schoolId: { _id: schoolId, code: 'SNP', nameEn: 'SNP International' },
    username: 'super.admin',
    email: 'superadmin@snp.edu.kh',
    roles: ['super_admin'],
    branchAccess: 'all',
    status: 'active',
    isDeleted: false,
    tokenVersion: 1,
    mustChangePassword: false,
    save: vi.fn().mockResolvedValue(true),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/v1/users/:id/reset-password', () => {
    it('successfully resets password with auto-generated temporary password as Super Admin', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(mockTargetStaffUser),
      };
      vi.mocked(UserModel.findOne).mockReturnValue(mockQuery as never);

      const response = await request(app)
        .post(`/api/v1/users/${userObjectId}/reset-password`)
        .set({
          'X-User-Id': '000000000000000000000001',
          'X-School-Id': schoolId,
          'X-User-Roles': 'super_admin',
          'X-User-Permissions': '*',
          'X-Branch-Access': 'all',
        })
        .send({});

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.mustChangePassword).toBe(true);
      expect(response.body.data.temporaryPassword).toBeDefined();
      expect(typeof response.body.data.temporaryPassword).toBe('string');
      expect(response.body.data.temporaryPassword.length).toBeGreaterThanOrEqual(8);

      expect(mockTargetStaffUser.mustChangePassword).toBe(true);
      expect(mockTargetStaffUser.tokenVersion).toBe(2);
      expect(mockTargetStaffUser.save).toHaveBeenCalled();
    });

    it('successfully resets password with provided custom temporary password', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(mockTargetStaffUser),
      };
      vi.mocked(UserModel.findOne).mockReturnValue(mockQuery as never);

      const customPass = 'TempPass@2026';
      const response = await request(app)
        .post(`/api/v1/users/${userObjectId}/reset-password`)
        .set({
          'X-User-Id': '000000000000000000000001',
          'X-School-Id': schoolId,
          'X-User-Roles': 'super_admin',
          'X-User-Permissions': '*',
          'X-Branch-Access': 'all',
        })
        .send({ temporaryPassword: customPass });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.temporaryPassword).toBe(customPass);
      expect(PasswordUtil.compare(customPass, mockTargetStaffUser.passwordHash)).toBe(true);
    });

    it('rejects reset password if custom password does not meet complexity requirements', async () => {
      const response = await request(app)
        .post(`/api/v1/users/${userObjectId}/reset-password`)
        .set({
          'X-User-Id': '000000000000000000000001',
          'X-School-Id': schoolId,
          'X-User-Roles': 'super_admin',
          'X-User-Permissions': '*',
        })
        .send({ temporaryPassword: 'weak' });

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
    });

    it('allows Branch Manager to reset password for a staff member in their branch', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(mockTargetStaffUser),
      };
      vi.mocked(UserModel.findOne).mockReturnValue(mockQuery as never);

      const response = await request(app)
        .post(`/api/v1/users/${userObjectId}/reset-password`)
        .set({
          'X-User-Id': '000000000000000000000002',
          'X-School-Id': schoolId,
          'X-User-Roles': 'branch_manager',
          'X-User-Permissions': 'user.reset_password.own_branch,user.view.own_branch',
          'X-Branch-Access': branchId,
        })
        .send({});

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.mustChangePassword).toBe(true);
    });

    it('forbids Branch Manager from resetting a Super Admin password', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(mockTargetSuperAdminUser),
      };
      vi.mocked(UserModel.findOne).mockReturnValue(mockQuery as never);

      const response = await request(app)
        .post('/api/v1/users/507f1f77bcf86cd799439009/reset-password')
        .set({
          'X-User-Id': '000000000000000000000002',
          'X-School-Id': schoolId,
          'X-User-Roles': 'branch_manager',
          'X-User-Permissions': 'user.reset_password.own_branch',
          'X-Branch-Access': branchId,
        })
        .send({});

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    it('forbids Branch Manager from resetting a Director password', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(mockTargetDirectorUser),
      };
      vi.mocked(UserModel.findOne).mockReturnValue(mockQuery as never);

      const response = await request(app)
        .post('/api/v1/users/507f1f77bcf86cd799439008/reset-password')
        .set({
          'X-User-Id': '000000000000000000000002',
          'X-School-Id': schoolId,
          'X-User-Roles': 'branch_manager',
          'X-User-Permissions': 'user.reset_password.own_branch',
          'X-Branch-Access': branchId,
        })
        .send({});

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    it('forbids Branch Manager from resetting a user in another branch', async () => {
      const userOtherBranch = {
        ...mockTargetStaffUser,
        branchAccess: ['507f1f77bcf86cd799439099'], // different branch
      };
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(userOtherBranch),
      };
      vi.mocked(UserModel.findOne).mockReturnValue(mockQuery as never);

      const response = await request(app)
        .post(`/api/v1/users/${userObjectId}/reset-password`)
        .set({
          'X-User-Id': '000000000000000000000002',
          'X-School-Id': schoolId,
          'X-User-Roles': 'branch_manager',
          'X-User-Permissions': 'user.reset_password.own_branch',
          'X-Branch-Access': branchId,
        })
        .send({});

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });
});
