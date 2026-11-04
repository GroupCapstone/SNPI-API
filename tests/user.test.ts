import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createApp } from '../src/app';
import { BranchModel } from '../src/modules/branch/branch.model';
import { EmployeeModel } from '../src/modules/employee/employee.model';
import { RoleModel } from '../src/modules/role/role.model';
import { SchoolModel } from '../src/modules/school/school.model';
import { UserModel } from '../src/modules/user/user.model';
import { TEST_PASSWORD } from './fixtures/test-credentials';

vi.mock('../src/modules/role/role.model', () => ({
  RoleModel: {
    find: vi.fn().mockImplementation((query: { code?: { $in?: string[] } }) => {
      const codes = query?.code?.$in || ['staff', 'teacher', 'admin', 'super_admin'];
      return {
        exec: vi.fn().mockResolvedValue(
          codes.map((c: string) => ({
            code: c,
            permissions: [],
            status: 'active',
            isDeleted: false,
          })),
        ),
      };
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

describe('User Management API Tests', () => {
  const app = createApp();

  const schoolId = '507f1f77bcf86cd799439001';
  const employeeId = '507f1f77bcf86cd799439005';
  const userObjectId = '507f1f77bcf86cd799439006';
  const authHeaders = {
    'X-User-Id': '000000000000000000000001',
    'X-School-Id': schoolId,
    'X-Department-Access': 'all',
  };

  const mockUser = {
    _id: userObjectId,
    schoolId: { _id: schoolId, code: 'SNP', nameEn: 'SNP International' },
    employeeId: { _id: employeeId, employeeId: 'EMP-000001', firstName: 'Dara', lastName: 'Sok' },
    username: 'dara.sok',
    email: 'dara.sok@snp.edu.kh',
    roles: ['staff', 'teacher'],
    branchAccess: 'all',
    departmentAccess: 'all',
    status: 'active',
    isDeleted: false,
    toObject: vi.fn().mockReturnValue({ username: 'dara.sok' }),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(RoleModel.find).mockImplementation((query: { code?: { $in?: string[] } }) => {
      const codes = query?.code?.$in ?? [];
      return Promise.resolve(
        codes.map((code) => ({ code, permissions: [], status: 'active', isDeleted: false })),
      ) as never;
    });
  });

  describe('GET /api/v1/users', () => {
    it('returns a paginated list of users', async () => {
      const mockQuery = {
        populate: vi.fn().mockReturnThis(),
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue([mockUser]),
      };

      vi.mocked(UserModel.find).mockReturnValue(mockQuery as never);
      vi.mocked(UserModel.countDocuments).mockReturnValue({
        exec: vi.fn().mockResolvedValue(1),
      } as never);

      const response = await request(app).get('/api/v1/users');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.pagination.total).toBe(1);
    });
  });

  describe('GET /api/v1/users/:id', () => {
    it('returns user details without exposing password hash', async () => {
      const mockQuery = {
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(mockUser),
      };

      vi.mocked(UserModel.findOne).mockReturnValue(mockQuery as never);

      const response = await request(app).get(`/api/v1/users/${userObjectId}`).set(authHeaders);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.username).toBe('dara.sok');
      expect(response.body.data.passwordHash).toBeUndefined();
    });

    it('returns 404 if user not found', async () => {
      const mockQuery = {
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(null),
      };

      vi.mocked(UserModel.findOne).mockReturnValue(mockQuery as never);

      const response = await request(app).get('/api/v1/users/507f1f77bcf86cd799439099');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/users', () => {
    it('creates a user with hashed password', async () => {
      vi.mocked(SchoolModel.findOne).mockResolvedValue({
        _id: schoolId,
        code: 'SNP',
      } as never);

      vi.mocked(EmployeeModel.findOne).mockResolvedValue({
        _id: employeeId,
        employeeId: 'EMP-000001',
        schoolId,
        branchId: '507f1f77bcf86cd799439007',
      } as never);

      vi.spyOn(BranchModel, 'countDocuments').mockResolvedValue(1);

      vi.mocked(UserModel.findOne).mockReturnValue({
        exec: vi.fn().mockResolvedValue(null),
      } as never);

      vi.mocked(UserModel.create).mockResolvedValue(mockUser as never);

      const response = await request(app)
        .post('/api/v1/users')
        .set(authHeaders)
        .send({
          schoolId,
          employeeId,
          username: 'dara.sok',
          email: 'dara.sok@snp.edu.kh',
          password: TEST_PASSWORD,
          roles: ['staff'],
          branchAccess: ['507f1f77bcf86cd799439007'],
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.username).toBe('dara.sok');
    });

    it('rejects creation when username is duplicate', async () => {
      vi.mocked(SchoolModel.findOne).mockResolvedValue({
        _id: schoolId,
        code: 'SNP',
      } as never);

      vi.mocked(UserModel.findOne).mockReturnValue({
        exec: vi.fn().mockResolvedValue(mockUser),
      } as never);

      const response = await request(app)
        .post('/api/v1/users')
        .set(authHeaders)
        .send({
          schoolId,
          username: 'dara.sok',
          email: 'new.email@snp.edu.kh',
          password: TEST_PASSWORD,
          roles: ['staff'],
          branchAccess: 'all',
        });

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
    });

    it('rejects creation when user lacks permission', async () => {
      const response = await request(app)
        .post('/api/v1/users')
        .set('X-User-Id', 'test-user-id')
        .set('X-User-Permissions', 'school.view.all_branches')
        .send({
          schoolId,
          username: 'dara.sok',
          email: 'dara.sok@snp.edu.kh',
          password: TEST_PASSWORD,
          roles: ['staff'],
          branchAccess: 'all',
        });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PATCH /api/v1/users/:id', () => {
    it('updates user roles and status', async () => {
      vi.mocked(EmployeeModel.findOne).mockResolvedValue({
        _id: employeeId,
        schoolId,
        branchId: '507f1f77bcf86cd799439007',
        departmentId: '507f1f77bcf86cd799439008',
      } as never);
      vi.mocked(UserModel.findOne).mockReturnValue({
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(mockUser),
      } as never);

      const updatedMock = {
        ...mockUser,
        status: 'inactive',
        roles: ['branch_manager'],
        toObject: vi.fn().mockReturnValue({ status: 'inactive' }),
      };

      vi.mocked(UserModel.findOneAndUpdate).mockReturnValue({
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(updatedMock),
      } as never);

      const response = await request(app)
        .patch(`/api/v1/users/${userObjectId}`)
        .set(authHeaders)
        .send({ status: 'inactive', roles: ['branch_manager'] });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('blocks users from changing their own protected roles', async () => {
      vi.mocked(UserModel.findOne).mockReturnValue({
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(mockUser),
      } as never);

      const response = await request(app)
        .patch(`/api/v1/users/${userObjectId}`)
        .set('X-User-Id', userObjectId)
        .set('X-School-Id', schoolId)
        .set('X-User-Permissions', 'user.edit.all_branches')
        .set('X-Branch-Access', 'all')
        .set('X-Department-Access', 'all')
        .send({ roles: ['super_admin'] });

      expect(response.status).toBe(403);
      expect(response.body.message).toMatch(/own roles/i);
    });

    it('blocks branch-scope expansion through a crafted payload', async () => {
      const branchA = '507f1f77bcf86cd799439007';
      const branchB = '507f1f77bcf86cd799439099';
      const scopedTarget = {
        ...mockUser,
        employeeId: undefined,
        branchAccess: [branchA],
        departmentAccess: [],
      };
      vi.mocked(UserModel.findOne).mockReturnValue({
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(scopedTarget),
      } as never);

      const response = await request(app)
        .patch(`/api/v1/users/${userObjectId}`)
        .set('X-User-Id', 'scoped-admin')
        .set('X-School-Id', schoolId)
        .set('X-User-Permissions', 'user.edit.own_branch')
        .set('X-Branch-Access', branchA)
        .send({ branchAccess: [branchA, branchB] });

      expect(response.status).toBe(403);
      expect(response.body.message).toMatch(/expand.*branch/i);
    });

    it('blocks assigning super_admin without wildcard authority', async () => {
      vi.mocked(UserModel.findOne).mockReturnValue({
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(mockUser),
      } as never);

      const response = await request(app)
        .patch(`/api/v1/users/${userObjectId}`)
        .set('X-User-Id', 'role-admin')
        .set('X-School-Id', schoolId)
        .set('X-User-Permissions', 'user.edit.all_branches')
        .set('X-Branch-Access', 'all')
        .set('X-Department-Access', 'all')
        .send({ roles: ['super_admin'] });

      expect(response.status).toBe(403);
      expect(response.body.message).toMatch(/wildcard authority/i);
    });
  });

  describe('PATCH /api/v1/users/:id/status', () => {
    it('updates user status quickly as authorized administrator', async () => {
      const mockSave = vi.fn().mockResolvedValue({
        ...mockUser,
        status: 'inactive',
      });
      vi.mocked(UserModel.findOne).mockReturnValue({
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue({
          ...mockUser,
          save: mockSave,
        }),
      } as never);

      const response = await request(app)
        .patch(`/api/v1/users/${userObjectId}/status`)
        .set(authHeaders)
        .set('X-User-Permissions', 'user.edit.all_branches')
        .send({ status: 'inactive' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(mockSave).toHaveBeenCalled();
    });

    it('blocks deactivating the primary Super Administrator account', async () => {
      const superAdminUser = {
        ...mockUser,
        roles: ['super_admin'],
        save: vi.fn(),
      };
      vi.mocked(UserModel.findOne).mockReturnValue({
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(superAdminUser),
      } as never);

      const response = await request(app)
        .patch(`/api/v1/users/${userObjectId}/status`)
        .set(authHeaders)
        .set('X-User-Permissions', '*')
        .send({ status: 'inactive' });

      expect(response.status).toBe(403);
      expect(response.body.message).toMatch(/Super Administrator account cannot be deactivated/i);
    });
  });

  describe('DELETE /api/v1/users/:id', () => {
    it('soft deletes a user record', async () => {
      vi.mocked(UserModel.findOne).mockReturnValue({
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(mockUser),
      } as never);

      vi.mocked(UserModel.findOneAndUpdate).mockReturnValue({
        exec: vi.fn().mockResolvedValue({ ...mockUser, isDeleted: true }),
      } as never);

      const response = await request(app).delete(`/api/v1/users/${userObjectId}`).set(authHeaders);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});
