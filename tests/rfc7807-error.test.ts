import express from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { errorHandler } from '../src/middleware/error-handler';
import { NotFoundError } from '../src/shared/errors/app-error';

describe('RFC 7807 / RFC 9457 Problem Details Error Formatting', () => {
  const createTestApp = () => {
    const app = express();
    app.get('/api/v1/resource', () => {
      throw new NotFoundError('Target resource not found');
    });
    app.use(errorHandler);
    return app;
  };

  it('formats RFC 7807 problem details when requested via Accept header', async () => {
    const app = createTestApp();
    const res = await request(app)
      .get('/api/v1/resource')
      .set('Accept', 'application/problem+json');

    expect(res.status).toBe(404);
    expect(res.headers['content-type']).toContain('application/problem+json');
    expect(res.headers['x-error-code']).toBe('NOT_FOUND');
    expect(res.body).toMatchObject({
      type: 'https://api.snpis.kesararamwithdigital.tech/errors/not_found',
      title: 'Not Found',
      status: 404,
      detail: 'Target resource not found',
      instance: '/api/v1/resource',
      code: 'NOT_FOUND',
      success: false,
    });
  });

  it('formats RFC 7807 problem details when requested via query parameter', async () => {
    const app = createTestApp();
    const res = await request(app).get('/api/v1/resource?format=rfc7807');

    expect(res.status).toBe(404);
    expect(res.headers['content-type']).toContain('application/problem+json');
    expect(res.body).toMatchObject({
      type: 'https://api.snpis.kesararamwithdigital.tech/errors/not_found',
      title: 'Not Found',
      status: 404,
      detail: 'Target resource not found',
      code: 'NOT_FOUND',
      success: false,
    });
  });

  it('preserves standard legacy JSON error envelope by default', async () => {
    const app = createTestApp();
    const res = await request(app).get('/api/v1/resource');

    expect(res.status).toBe(404);
    expect(res.headers['content-type']).toContain('application/json');
    expect(res.headers['x-error-code']).toBe('NOT_FOUND');
    expect(res.body).toEqual({
      success: false,
      message: 'Target resource not found',
      code: 'NOT_FOUND',
    });
  });
});
