import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { checkBranchAccess, getAuthorizedBranchFilter } from '../src/middleware/branch-access';
import { createApp } from '../src/app';

describe('Route authentication, authorization, and branch isolation', () => {
  const app = createApp();
  const branchA = '507f1f77bcf86cd799439011';
  const branchB = '507f1f77bcf86cd799439012';

  it.each([
    '/api/v1/academic-years',
    '/api/v1/classrooms',
    '/api/v1/programs',
    '/api/v1/levels',
    '/api/v1/subjects',
    '/api/v1/classes',
  ])('returns 401 for an unauthenticated protected route: %s', async (path) => {
    const response = await request(app).get(path).set('X-No-Auth', 'true');

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it('returns 403 when authenticated without the route permission', async () => {
    const response = await request(app)
      .get('/api/v1/academic-years')
      .set('X-User-Id', '000000000000000000000001')
      .set('X-User-Permissions', 'student.view.own_branch');

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
  });

  it('returns 403 when an own-branch user requests classrooms from another branch', async () => {
    const response = await request(app)
      .get(`/api/v1/classrooms?branchId=${branchB}`)
      .set('X-User-Id', '000000000000000000000001')
      .set('X-User-Permissions', 'classroom.view.own_branch')
      .set('X-Branch-Access', branchA);

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
  });

  it('returns 403 when a user submits the literal all-branches value as a branch ID', async () => {
    const response = await request(app)
      .get('/api/v1/classrooms?branchId=all')
      .set('X-User-Id', '000000000000000000000001')
      .set('X-User-Permissions', 'classroom.view.all_branches')
      .set('X-Branch-Access', 'all');

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
  });

  it('rejects reserved branch contexts even when the user has all-branch access', () => {
    expect(checkBranchAccess('all', 'all')).toBe(false);
    expect(checkBranchAccess('all', 'all_branches')).toBe(false);
    expect(checkBranchAccess('all', 'all-branches')).toBe(false);

    expect(() => getAuthorizedBranchFilter('all', 'all')).toThrow(/All Branches/);
  });
});
