import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createApp } from '../src/app';
import { RoleModel } from '../src/modules/role/role.model';
import { UserModel } from '../src/modules/user/user.model';

vi.mock('../src/modules/role/role.model', () => ({
  RoleModel: {
    find: vi.fn(),
    findOne: vi.fn(),
    findOneAndUpdate: vi.fn(),
    create: vi.fn(),
    countDocuments: vi.fn(),
  },
}));

vi.mock('../src/modules/user/user.model', () => ({
  UserModel: {
    countDocuments: vi.fn(),
  },
}));

vi.mock('../src/modules/audit-log/audit-log.service', () => ({
  AuditLogService: class {
    public static log = vi.fn().mockResolvedValue(undefined);
    public getAuditLogs = vi.fn().mockResolvedValue({ data: [], total: 0 });
  },
}));

describe('Role Management API Tests', () => {
  const app = createApp();
  const mockRoleId = '507f1f77bcf86cd799439011';

  const mockRole = {
    _id: mockRoleId,
    code: 'custom_manager',
    nameEn: 'Custom Manager',
    description: 'Branch administrator',
    permissions: ['branch.view.own_branch', 'employee.view.own_branch'],
    isSystem: false,
    status: 'active',
    isDeleted: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/v1/roles', () => {
    it('returns a list of security roles', async () => {
      const mockQuery = {
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue([mockRole]),
      };

      vi.mocked(RoleModel.find).mockReturnValue(mockQuery as never);
      vi.mocked(RoleModel.countDocuments).mockReturnValue({
        exec: vi.fn().mockResolvedValue(1),
      } as never);

      const response = await request(app)
        .get('/api/v1/roles')
        .set('X-User-Id', 'test-user')
        .set('X-User-Permissions', 'role.view.all_branches');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
    });
  });

  describe('GET /api/v1/roles/:id', () => {
    it('returns role by ID', async () => {
      vi.mocked(RoleModel.findOne).mockReturnValue({
        exec: vi.fn().mockResolvedValue(mockRole),
      } as never);

      const response = await request(app)
        .get(`/api/v1/roles/${mockRoleId}`)
        .set('X-User-Id', 'test-user')
        .set('X-User-Permissions', 'role.view.all_branches');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.code).toBe('custom_manager');
    });
  });

  describe('POST /api/v1/roles', () => {
    it('creates a custom role', async () => {
      vi.mocked(RoleModel.findOne).mockReturnValue({
        exec: vi.fn().mockResolvedValue(null),
      } as never);

      vi.mocked(RoleModel.create).mockResolvedValue(mockRole as never);

      const response = await request(app)
        .post('/api/v1/roles')
        .set('X-User-Id', 'test-user')
        .set('X-User-Permissions', 'role.create.all_branches,branch.view.own_branch')
        .send({
          code: 'custom_manager',
          nameEn: 'Custom Manager',
          permissions: ['branch.view.own_branch'],
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.code).toBe('custom_manager');
    });

    it('rejects creation of super_admin role', async () => {
      const response = await request(app)
        .post('/api/v1/roles')
        .set('X-User-Id', 'test-user')
        .set('X-User-Permissions', 'role.create.all_branches')
        .send({
          code: 'super_admin',
          nameEn: 'Fake Super Admin',
          permissions: [],
        });

      expect(response.status).toBe(403);
    });

    it('rejects creation when user lacks permission', async () => {
      const response = await request(app)
        .post('/api/v1/roles')
        .set('X-User-Id', 'test-user')
        .set('X-User-Permissions', 'branch.view.own_branch')
        .send({
          code: 'custom_role',
          nameEn: 'Custom Role',
          permissions: [],
        });

      expect(response.status).toBe(403);
    });
  });

  describe('PATCH /api/v1/roles/:id', () => {
    it('allows Super Administrator metadata edits while retaining the wildcard', async () => {
      const role = { ...mockRole, code: 'super_admin', isSystem: true, permissions: ['*'] };
      vi.mocked(RoleModel.findOne).mockReturnValue({
        exec: vi.fn().mockResolvedValue(role),
      } as never);
      vi.mocked(RoleModel.findOneAndUpdate).mockReturnValue({
        exec: vi.fn().mockResolvedValue(role),
      } as never);
      const response = await request(app)
        .patch(`/api/v1/roles/${mockRoleId}`)
        .set('X-User-Id', 'admin')
        .set('X-User-Permissions', '*')
        .send({ nameEn: 'System Administrator', permissions: ['*'] });
      expect(response.status).toBe(200);
      expect(RoleModel.findOneAndUpdate).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ permissions: ['*'] }),
        expect.anything(),
      );
    });

    it.each([{ permissions: [] }, { status: 'inactive' }])(
      'prevents locking out the Super Administrator role: %j',
      async (body) => {
        vi.mocked(RoleModel.findOne).mockReturnValue({
          exec: vi.fn().mockResolvedValue({
            ...mockRole,
            code: 'super_admin',
            isSystem: true,
            permissions: ['*'],
          }),
        } as never);
        expect(
          (
            await request(app)
              .patch(`/api/v1/roles/${mockRoleId}`)
              .set('X-User-Id', 'admin')
              .set('X-User-Permissions', '*')
              .send(body)
          ).status,
        ).toBe(403);
        expect(RoleModel.findOneAndUpdate).not.toHaveBeenCalled();
      },
    );

    it('updates role properties', async () => {
      vi.mocked(RoleModel.findOne).mockReturnValue({
        exec: vi.fn().mockResolvedValue(mockRole),
      } as never);

      vi.mocked(RoleModel.findOneAndUpdate).mockReturnValue({
        exec: vi.fn().mockResolvedValue({ ...mockRole, nameEn: 'Updated Manager' }),
      } as never);

      const response = await request(app)
        .patch(`/api/v1/roles/${mockRoleId}`)
        .set('X-User-Id', 'test-user')
        .set('X-User-Permissions', 'role.edit.all_branches')
        .send({ nameEn: 'Updated Manager' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('prevents deactivating a system role', async () => {
      const systemRole = { ...mockRole, isSystem: true };
      vi.mocked(RoleModel.findOne).mockReturnValue({
        exec: vi.fn().mockResolvedValue(systemRole),
      } as never);

      const response = await request(app)
        .patch(`/api/v1/roles/${mockRoleId}`)
        .set('X-User-Id', 'test-user')
        .set('X-User-Permissions', 'role.edit.all_branches')
        .send({ status: 'inactive' });

      expect(response.status).toBe(403);
    });
  });

  describe('DELETE /api/v1/roles/:id', () => {
    it('soft deletes a custom role when no users assigned', async () => {
      vi.mocked(RoleModel.findOne).mockReturnValue({
        exec: vi.fn().mockResolvedValue(mockRole),
      } as never);

      vi.mocked(UserModel.countDocuments).mockResolvedValue(0 as never);

      vi.mocked(RoleModel.findOneAndUpdate).mockReturnValue({
        exec: vi.fn().mockResolvedValue({ ...mockRole, isDeleted: true }),
      } as never);

      const response = await request(app)
        .delete(`/api/v1/roles/${mockRoleId}`)
        .set('X-User-Id', 'test-user')
        .set('X-User-Permissions', 'role.delete.all_branches');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('prevents deleting a system role', async () => {
      const systemRole = { ...mockRole, isSystem: true };
      vi.mocked(RoleModel.findOne).mockReturnValue({
        exec: vi.fn().mockResolvedValue(systemRole),
      } as never);

      const response = await request(app)
        .delete(`/api/v1/roles/${mockRoleId}`)
        .set('X-User-Id', 'test-user')
        .set('X-User-Permissions', 'role.delete.all_branches');

      expect(response.status).toBe(403);
    });

    it('prevents deleting a role when users are assigned', async () => {
      vi.mocked(RoleModel.findOne).mockReturnValue({
        exec: vi.fn().mockResolvedValue(mockRole),
      } as never);

      vi.mocked(UserModel.countDocuments).mockResolvedValue(2 as never);

      const response = await request(app)
        .delete(`/api/v1/roles/${mockRoleId}`)
        .set('X-User-Id', 'test-user')
        .set('X-User-Permissions', 'role.delete.all_branches');

      expect(response.status).toBe(403);
    });
  });
});
