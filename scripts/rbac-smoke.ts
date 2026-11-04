import assert from 'node:assert/strict';
import type { Express } from 'express';
import request from 'supertest';

import { env } from '../src/config/env';

/** Runs only as part of rebuild-smoke, against its guarded isolated database. */
export const verifyRbacSmoke = async (
  app: Express,
  adminToken: string,
  scope: { schoolId: string; branchId: string },
  suffix: string,
) => {
  const send = async (
    method: 'get' | 'post' | 'patch',
    url: string,
    token: string,
    body: unknown = undefined,
    status = 200,
  ) => {
    const requestForMethod = request(app)[method];
    const response = await requestForMethod(`/api/v1${url}`)
      .auth(token, { type: 'bearer' })
      .send(body);
    assert.equal(response.status, status, `${method} ${url}: ${JSON.stringify(response.body)}`);
    return response.body.data;
  };
  const login = async (username: string, password = env.SUPER_ADMIN_PASSWORD) => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ identifier: username, password });
    assert.equal(response.status, 200, `Smoke role login failed: ${response.status}`);
    return response.body.data.accessToken as string;
  };
  const role = await send(
    'post',
    '/roles',
    adminToken,
    {
      code: `smoke_manager_${suffix}`,
      nameEn: 'Smoke scoped user manager',
      permissions: [
        'user.view.own_branch',
        'user.create.own_branch',
        'user.edit.own_branch',
        'user.reset_password.own_branch',
      ],
    },
    201,
  );
  const elevated = await send(
    'post',
    '/roles',
    adminToken,
    {
      code: `smoke_privileged_${suffix}`,
      nameEn: 'Smoke privileged custom role',
      permissions: ['role.edit.all_branches'],
    },
    201,
  );
  const createUser = async (name: string, roles: string[]) =>
    send(
      'post',
      '/users',
      adminToken,
      {
        schoolId: scope.schoolId,
        username: `${name}_${suffix}`,
        email: `${name}_${suffix}@example.test`,
        password: env.SUPER_ADMIN_PASSWORD,
        roles,
        branchAccess: [scope.branchId],
        mustChangePassword: false,
      },
      201,
    );
  const manager = await createUser('smoke_manager', [role.code]);
  const target = await createUser('smoke_target', ['staff']);
  const managerId = String(manager._id ?? manager.id);
  const targetId = String(target._id ?? target.id);
  const managerToken = await login(manager.username);
  const users = await send('get', `/users?branchId=${scope.branchId}&limit=100`, managerToken);
  assert.ok(
    users.some(
      (entry: { _id?: string; id?: string }) => String(entry._id ?? entry.id) === managerId,
    ),
  );
  for (const entry of users as Array<{
    branchAccess: string[] | 'all';
    schoolId: { _id: string };
  }>) {
    assert.equal(entry.schoolId._id, scope.schoolId);
    assert.ok(
      Array.isArray(entry.branchAccess) &&
        entry.branchAccess.every((branch) => branch === scope.branchId),
    );
  }
  await send('patch', `/users/${targetId}`, managerToken, { roles: [elevated.code] }, 403);
  await send('get', '/roles', managerToken, undefined, 403);
  await send('patch', `/users/${managerId}/status`, adminToken, { status: 'inactive' });
  await send('get', '/users', managerToken, undefined, 401);
  await send('patch', `/users/${managerId}/status`, adminToken, { status: 'active' });
  await send('get', '/users', managerToken, undefined, 401);
  const resumedToken = await login(manager.username);
  const temporaryPassword = `Temporary@${suffix}`;
  await send('patch', `/users/${managerId}`, adminToken, { password: temporaryPassword });
  await send('get', '/users', resumedToken, undefined, 401);
  const recoveryToken = await login(manager.username, temporaryPassword);
  await send('get', '/users', recoveryToken, undefined, 403);
  const me = await send('get', '/auth/me', recoveryToken);
  assert.equal(me.mustChangePassword, true);
  const changedPassword = `Changed@${suffix}`;
  await send('patch', '/auth/change-password', recoveryToken, {
    currentPassword: temporaryPassword,
    newPassword: changedPassword,
    confirmPassword: changedPassword,
  });
  await send('get', '/users', recoveryToken, undefined, 401);
  const restoredToken = await login(manager.username, changedPassword);
  await send('get', '/users', restoredToken);
  process.stdout.write(
    'PASS: real role delegation, scoped user queries, deactivation, token revocation and required password recovery\n',
  );
};
