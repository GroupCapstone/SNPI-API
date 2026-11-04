import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { createApp } from '../src/app';
import { createUserSchema } from '../src/modules/user/user.validation';
import { PasswordUtil } from '../src/utils/password';

describe('OWASP API Security Top 10 Hardening', () => {
  describe('API2 / API8 - Password Hardening & Weak Password Defense', () => {
    it('detects common weak passwords', () => {
      expect(PasswordUtil.isWeakCommonPassword('password123')).toBe(true);
      expect(PasswordUtil.isWeakCommonPassword('Password123!')).toBe(true);
      expect(PasswordUtil.isWeakCommonPassword('Welcome123!')).toBe(true);
      expect(PasswordUtil.isWeakCommonPassword('Admin123456')).toBe(true);
      expect(PasswordUtil.isWeakCommonPassword('aaaaaaaa')).toBe(true);
      expect(PasswordUtil.isWeakCommonPassword('ComplexP@ssw0rd2026!')).toBe(false);
    });

    it('rejects easily guessable passwords in createUserSchema validation', () => {
      const result = createUserSchema.safeParse({
        body: {
          schoolId: '000000000000000000000001',
          username: 'test_user',
          email: 'test@snp.edu.kh',
          password: 'Password123!',
          roles: ['teacher'],
          branchAccess: 'all',
        },
        params: {},
        query: {},
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const errorMessages = result.error.issues.map((i) => i.message);
        expect(errorMessages.some((msg) => msg.includes('too common or easily guessable'))).toBe(
          true,
        );
      }
    });

    it('accepts strong, uncompromised passwords in createUserSchema validation', () => {
      const result = createUserSchema.safeParse({
        body: {
          schoolId: '000000000000000000000001',
          username: 'test_user',
          email: 'test@snp.edu.kh',
          password: 'Un!queSecureP@ssw0rd2026',
          roles: ['teacher'],
          branchAccess: 'all',
        },
        params: {},
        query: {},
      });

      expect(result.success).toBe(true);
    });
  });

  describe('API8 - Server Configuration Hardening Headers', () => {
    it('enforces hardened security response headers', async () => {
      const app = createApp();
      const response = await request(app).get('/api/v1/health').expect(200);

      // Verify Helmet security headers
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['cross-origin-resource-policy']).toBe('same-site');
      expect(response.headers['referrer-policy']).toBe('no-referrer');
      expect(response.headers['x-frame-options']).toBe('SAMEORIGIN');
      expect(response.headers['x-powered-by']).toBeUndefined();
    });
  });
});
