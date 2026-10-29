import express from 'express';
import request from 'supertest';

import { createHttpsOnlyMiddleware } from '../src/middleware/https-only';

describe('production HTTPS transport policy', () => {
  const createTestApp = () => {
    const app = express();
    app.set('trust proxy', 1);
    app.use('/api/v1', createHttpsOnlyMiddleware(true));
    app.get('/api/v1/auth/me', (_request, response) =>
      response.status(200).json({ success: true }),
    );
    app.get('/api/v1/health', (_request, response) => response.status(200).json({ success: true }));
    return app;
  };

  it('rejects an insecure business API request', async () => {
    const response = await request(createTestApp()).get('/api/v1/auth/me').expect(426);
    expect(response.body.code).toBe('HTTPS_REQUIRED');
  });

  it('accepts HTTPS as reported by the trusted reverse proxy', async () => {
    await request(createTestApp())
      .get('/api/v1/auth/me')
      .set('X-Forwarded-Proto', 'https')
      .expect(200);
  });

  it('allows an HTTP health probe without exposing business routes', async () => {
    await request(createTestApp()).get('/api/v1/health').expect(200);
  });
});
