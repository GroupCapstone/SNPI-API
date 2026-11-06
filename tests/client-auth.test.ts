import express from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { env } from '../src/config/env';
import {
  isExemptClientPath,
  safeCompareSecrets,
  verifyTrustedClient,
} from '../src/middleware/client-auth';
import { errorHandler } from '../src/middleware/error-handler';
import { apiRateLimiter } from '../src/middleware/security';
import { computeHmacSha256 } from '../src/middleware/signature';

describe('Zero-Trust Client Authentication Middleware', () => {
  const testClientKey = 'snpi_test_trusted_client_secret_2026';

  beforeEach(() => {
    vi.stubEnv('ENFORCE_CLIENT_AUTH', 'true');
    vi.stubEnv('CLIENT_API_KEY', testClientKey);
    (env as unknown as { ENFORCE_CLIENT_AUTH: string }).ENFORCE_CLIENT_AUTH = 'true';
    (env as unknown as { CLIENT_API_KEY: string }).CLIENT_API_KEY = testClientKey;
  });

  const createTestApp = () => {
    const app = express();
    app.use(express.json());
    app.use(apiRateLimiter);
    app.use('/api/v1', verifyTrustedClient);
    app.get('/api/v1/health', (_req, res) => {
      res.status(200).json({ status: 'ok' });
    });
    app.get('/api/v1/docs', (_req, res) => {
      res.status(200).json({ docs: 'openapi' });
    });
    app.post('/api/v1/students', (req, res) => {
      res.status(200).json({ success: true, body: req.body });
    });
    app.use(errorHandler);
    return app;
  };

  describe('safeCompareSecrets', () => {
    it('returns true for matching secrets', () => {
      expect(safeCompareSecrets(testClientKey, testClientKey)).toBe(true);
    });

    it('returns false for mismatched secrets of equal length', () => {
      const tampered = testClientKey.slice(0, -1) + 'X';
      expect(safeCompareSecrets(tampered, testClientKey)).toBe(false);
    });

    it('returns false for mismatched secrets of different lengths without error', () => {
      expect(safeCompareSecrets('short_key', testClientKey)).toBe(false);
      expect(safeCompareSecrets(testClientKey + '_extra', testClientKey)).toBe(false);
    });
  });

  describe('isExemptClientPath', () => {
    it('identifies public health and documentation endpoints', () => {
      expect(isExemptClientPath('/health')).toBe(true);
      expect(isExemptClientPath('/health/')).toBe(true);
      expect(isExemptClientPath('/docs')).toBe(true);
      expect(isExemptClientPath('/docs/openapi.json')).toBe(true);
      expect(isExemptClientPath('/openapi.json')).toBe(true);
    });

    it('identifies protected domain endpoints as non-exempt', () => {
      expect(isExemptClientPath('/students')).toBe(false);
      expect(isExemptClientPath('/auth/login')).toBe(false);
      expect(isExemptClientPath('/finance')).toBe(false);
    });
  });

  describe('verifyTrustedClient Middleware Flow', () => {
    it('permits requests to exempt paths without client API key', async () => {
      const app = createTestApp();
      const res = await request(app).get('/api/v1/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });

    it('rejects protected routes when X-Client-Api-Key is missing', async () => {
      const app = createTestApp();
      const res = await request(app).post('/api/v1/students').send({ name: 'Chan Dara' });

      expect(res.status).toBe(401);
      expect(res.body.message).toContain('Missing required X-Client-Api-Key header');
    });

    it('rejects protected routes when X-Client-Api-Key is invalid', async () => {
      const app = createTestApp();
      const res = await request(app)
        .post('/api/v1/students')
        .set('X-Client-Api-Key', 'invalid_untrusted_client_key')
        .send({ name: 'Chan Dara' });

      expect(res.status).toBe(401);
      expect(res.body.message).toContain('Invalid client API key');
    });

    it('accepts protected routes when valid X-Client-Api-Key is provided', async () => {
      const app = createTestApp();
      const res = await request(app)
        .post('/api/v1/students')
        .set('X-Client-Api-Key', testClientKey)
        .send({ name: 'Chan Dara' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.body.name).toBe('Chan Dara');
    });

    it('accepts protected routes when valid X-Signature-SHA256 payload HMAC is provided', async () => {
      const app = createTestApp();
      const payload = { name: 'Chan Dara' };
      const signature = computeHmacSha256(JSON.stringify(payload), testClientKey);

      const res = await request(app)
        .post('/api/v1/students')
        .set('Content-Type', 'application/json')
        .set('X-Signature-SHA256', signature)
        .send(payload);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
