import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { createApp } from '../src/app';

describe('Permission Query API Tests', () => {
  const app = createApp();

  describe('GET /api/v1/permissions', () => {
    it('returns all system permission definitions when user has permission', async () => {
      const response = await request(app)
        .get('/api/v1/permissions')
        .set('X-User-Id', 'test-user')
        .set('X-User-Permissions', 'role.view.all_branches');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(10);
    });
  });

  describe('GET /api/v1/permissions/grouped', () => {
    it('returns system permissions grouped by module', async () => {
      const response = await request(app)
        .get('/api/v1/permissions/grouped')
        .set('X-User-Id', 'test-user')
        .set('X-User-Permissions', 'role.view.all_branches');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data[0]).toHaveProperty('module');
      expect(response.body.data[0]).toHaveProperty('permissions');
    });
  });
});
