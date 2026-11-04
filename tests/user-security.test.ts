import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createApp } from '../src/app';
import { DEFAULT_CORE_ROLES } from '../src/constants/permissions';
import { BranchModel } from '../src/modules/branch/branch.model';
import { RoleModel } from '../src/modules/role/role.model';
import { SchoolModel } from '../src/modules/school/school.model';
import { UserModel } from '../src/modules/user/user.model';
import { PasswordUtil } from '../src/utils/password';
import { TEST_PASSWORD } from './fixtures/test-credentials';

vi.mock('../src/modules/user/user.model', () => ({
  UserModel: {
    findOne: vi.fn(),
    find: vi.fn(),
    countDocuments: vi.fn(),
    findOneAndUpdate: vi.fn(),
    create: vi.fn(),
  },
}));
vi.mock('../src/modules/role/role.model', () => ({ RoleModel: { find: vi.fn() } }));
vi.mock('../src/modules/school/school.model', () => ({ SchoolModel: { findOne: vi.fn() } }));
vi.mock('../src/modules/branch/branch.model', () => ({ BranchModel: { countDocuments: vi.fn() } }));
vi.mock('../src/modules/audit-log/audit-log.service', () => ({
  AuditLogService: class {
    public static log = vi.fn().mockResolvedValue(undefined);
    public log = vi.fn().mockResolvedValue(undefined);
  },
}));

const schoolId = '507f1f77bcf86cd799439001';
const userId = '507f1f77bcf86cd799439002';
const branchId = '507f1f77bcf86cd799439003';
const actorId = '507f1f77bcf86cd799439004';
const headers = {
  'X-User-Id': actorId,
  'X-School-Id': schoolId,
  'X-Branch-Access': branchId,
  'X-User-Permissions':
    'user.view.own_branch,user.create.own_branch,user.edit.own_branch,user.reset_password.own_branch,user.delete.own_branch',
};
const chain = (result: unknown) => ({
  select: vi.fn().mockReturnThis(),
  populate: vi.fn().mockReturnThis(),
  sort: vi.fn().mockReturnThis(),
  skip: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  exec: vi.fn().mockResolvedValue(result),
});

describe('user administration privilege and scope boundaries', () => {
  const app = createApp();
  let target: {
    _id: string;
    schoolId: string;
    username: string;
    email: string;
    roles: string[];
    branchAccess: string[] | 'all';
    departmentAccess: string[];
    directPermissions: string[];
    status: string;
    tokenVersion: number;
    save: ReturnType<typeof vi.fn>;
  };
  beforeEach(() => {
    vi.clearAllMocks();
    target = {
      _id: userId,
      schoolId,
      username: 'staff',
      email: 'staff@example.test',
      roles: ['staff'],
      branchAccess: [branchId],
      departmentAccess: [],
      directPermissions: [],
      status: 'active',
      tokenVersion: 2,
      save: vi.fn().mockResolvedValue({}),
    };
    vi.mocked(UserModel.findOne).mockReturnValue(chain(target) as never);
    vi.mocked(UserModel.findOneAndUpdate).mockReturnValue(chain(target) as never);
    vi.mocked(UserModel.find).mockReturnValue(chain([]) as never);
    vi.mocked(UserModel.countDocuments).mockReturnValue(chain(0) as never);
    vi.mocked(SchoolModel.findOne).mockResolvedValue({ _id: schoolId } as never);
    vi.mocked(BranchModel.countDocuments).mockResolvedValue(1);
    vi.mocked(RoleModel.find).mockImplementation(
      (filter: { code?: { $in?: string[] } }) =>
        Promise.resolve(
          DEFAULT_CORE_ROLES.filter((role) => filter.code?.$in?.includes(role.code)),
        ) as never,
    );
  });

  it.each(['', `?branchId=${branchId}`, '?branchId=all'])(
    'scopes user searches to school and the full allowed branch subset: %s',
    async (query) => {
      const response = await request(app).get(`/api/v1/users${query}`).set(headers);
      expect(response.status).toBe(200);
      expect(UserModel.find).toHaveBeenCalledWith({
        $and: expect.arrayContaining([
          { schoolId: expect.objectContaining({}) },
          { branchAccess: { $type: 'array' } },
          {
            $expr: {
              $cond: [
                { $isArray: '$branchAccess' },
                { $setIsSubset: ['$branchAccess', [branchId]] },
                false,
              ],
            },
          },
        ]),
      });
      const filter = vi.mocked(UserModel.find).mock.calls[0][0] as unknown as {
        $and: Array<{ schoolId?: unknown }>;
      };
      expect(String(filter.$and.find((clause) => clause.schoolId)?.schoolId)).toBe(schoolId);
    },
  );

  it('rejects reading a user from another school even with matching branch IDs', async () => {
    target.schoolId = '507f1f77bcf86cd799439099';
    expect((await request(app).get(`/api/v1/users/${userId}`).set(headers)).status).toBe(403);
  });

  it('rejects a custom privileged role during account creation', async () => {
    vi.mocked(RoleModel.find).mockResolvedValue([
      { code: 'custom_admin', permissions: ['role.edit.all_branches'], isSystem: false },
    ] as never);
    const response = await request(app)
      .post('/api/v1/users')
      .set(headers)
      .send({
        schoolId,
        username: 'new.user',
        email: 'new@example.test',
        password: TEST_PASSWORD,
        roles: ['custom_admin'],
        branchAccess: [branchId],
      });
    expect(response.status).toBe(403);
    expect(response.body.message).toMatch(/cannot assign role/);
    expect(UserModel.create).not.toHaveBeenCalled();
  });

  it('rejects assigning a custom role with authority the actor does not have', async () => {
    vi.mocked(RoleModel.find).mockImplementation(
      (filter: { code?: { $in?: string[] } }) =>
        Promise.resolve(
          filter.code?.$in?.includes('custom_admin')
            ? [{ code: 'custom_admin', permissions: ['role.edit.all_branches'] }]
            : [DEFAULT_CORE_ROLES.find((role) => role.code === 'staff')],
        ) as never,
    );
    const response = await request(app)
      .patch(`/api/v1/users/${userId}`)
      .set(headers)
      .send({ roles: ['custom_admin'] });
    expect(response.status).toBe(403);
    expect(UserModel.findOneAndUpdate).not.toHaveBeenCalled();
  });

  it('allows a custom role whose permissions the actor can grant', async () => {
    vi.mocked(RoleModel.find).mockResolvedValue([
      { code: 'custom_viewer', permissions: ['user.view.own_branch'] },
    ] as never);
    const response = await request(app)
      .patch(`/api/v1/users/${userId}`)
      .set(headers)
      .send({ roles: ['custom_viewer'] });
    expect(response.status).toBe(200);
  });

  it('preserves delegation of the canonical teacher role to branch user managers', async () => {
    const response = await request(app)
      .patch(`/api/v1/users/${userId}`)
      .set(headers)
      .send({ roles: ['teacher'] });
    expect(response.status).toBe(200);
  });

  it('rejects elevated permissions added to an otherwise canonical role', async () => {
    const staff = DEFAULT_CORE_ROLES.find((role) => role.code === 'staff')!;
    vi.mocked(RoleModel.find).mockResolvedValue([
      { ...staff, permissions: [...staff.permissions, 'role.edit.all_branches'] },
    ] as never);
    expect(
      (
        await request(app)
          .patch(`/api/v1/users/${userId}`)
          .set(headers)
          .send({ roles: ['staff'] })
      ).status,
    ).toBe(403);
  });

  it.each(['reset-password', 'status', 'delete'])(
    'blocks control of a more privileged custom account through %s',
    async (action) => {
      target.roles = ['custom_admin'];
      vi.mocked(RoleModel.find).mockResolvedValue([
        { code: 'custom_admin', permissions: ['role.edit.all_branches'] },
      ] as never);
      const response =
        action === 'reset-password'
          ? await request(app).post(`/api/v1/users/${userId}/reset-password`).set(headers).send({})
          : action === 'status'
            ? await request(app)
                .patch(`/api/v1/users/${userId}/status`)
                .set(headers)
                .send({ status: 'inactive' })
            : await request(app).delete(`/api/v1/users/${userId}`).set(headers);
      expect(response.status).toBe(403);
      expect(target.save).not.toHaveBeenCalled();
      expect(UserModel.findOneAndUpdate).not.toHaveBeenCalled();
    },
  );

  it('requires reset-password permission on the generic update endpoint', async () => {
    const response = await request(app)
      .patch(`/api/v1/users/${userId}`)
      .set(headers)
      .set('X-User-Permissions', 'user.edit.own_branch')
      .send({ password: TEST_PASSWORD });
    expect(response.status).toBe(403);
    expect(response.body.message).toMatch(/reset-password permission/);
  });

  it('atomically revokes sessions and requires recovery when a password is updated', async () => {
    const response = await request(app)
      .patch(`/api/v1/users/${userId}`)
      .set(headers)
      .send({ password: TEST_PASSWORD });
    expect(response.status).toBe(200);
    const update = vi.mocked(UserModel.findOneAndUpdate).mock.calls[0][1] as unknown as {
      $set: { passwordHash: string; mustChangePassword: boolean };
      $inc: unknown;
      $unset: unknown;
    };
    expect(PasswordUtil.compare(TEST_PASSWORD, update.$set.passwordHash)).toBe(true);
    expect(update.$set.mustChangePassword).toBe(true);
    expect(update.$set).not.toHaveProperty('password');
    expect(update.$inc).toEqual({ tokenVersion: 1 });
    expect(update.$unset).toEqual({
      refreshTokenHash: 1,
      previousRefreshTokenHash: 1,
      tokenRotatedAt: 1,
    });
  });

  it('revokes sessions on account deactivation', async () => {
    expect(
      (
        await request(app)
          .patch(`/api/v1/users/${userId}/status`)
          .set(headers)
          .send({ status: 'inactive' })
      ).status,
    ).toBe(200);
    expect(target.tokenVersion).toBe(3);
  });

  it.each([
    { mustChangePassword: false },
    { employeeId: '507f1f77bcf86cd799439099' },
    { schoolId },
  ])('rejects self-modification of authorization links or recovery state: %j', async (body) => {
    expect(
      (
        await request(app)
          .patch(`/api/v1/users/${userId}`)
          .set(headers)
          .set('X-User-Id', userId)
          .send(body)
      ).status,
    ).toBe(403);
  });

  it('does not let an administrator bypass another user’s required password change', async () => {
    expect(
      (
        await request(app)
          .patch(`/api/v1/users/${userId}`)
          .set(headers)
          .send({ mustChangePassword: false })
      ).status,
    ).toBe(403);
  });

  it('protects the director password from non-wildcard user managers', async () => {
    target.roles = ['director'];
    target.branchAccess = 'all';
    expect(
      (
        await request(app)
          .post(`/api/v1/users/${userId}/reset-password`)
          .set(headers)
          .set('X-Branch-Access', 'all')
          .set('X-User-Permissions', 'user.reset_password.all_branches')
          .send({})
      ).status,
    ).toBe(403);
  });
});
