import express from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { createEtagMiddleware } from '../src/middleware/etag';

describe('HTTP ETag / Conditional GET Middleware', () => {
  const createTestApp = () => {
    const app = express();
    app.use(createEtagMiddleware());

    app.get('/api/v1/levels', (_req, res) => {
      res.status(200).json({ success: true, data: [{ id: 'lvl-1', name: 'Grade 10' }] });
    });

    return app;
  };

  it('generates a weak ETag header for GET responses', async () => {
    const app = createTestApp();
    const res = await request(app).get('/api/v1/levels');

    expect(res.status).toBe(200);
    expect(res.headers['etag']).toBeDefined();
    expect(res.headers['etag']).toMatch(/^W\/"[a-f0-9]{24}"$/);
  });

  it('returns 304 Not Modified when client If-None-Match matches ETag', async () => {
    const app = createTestApp();

    const res1 = await request(app).get('/api/v1/levels');
    expect(res1.status).toBe(200);
    const etag = res1.headers['etag'];

    const res2 = await request(app).get('/api/v1/levels').set('If-None-Match', etag);
    expect(res2.status).toBe(304);
    expect(res2.text).toBe('');
  });

  it('returns 200 with new data when client If-None-Match differs', async () => {
    const app = createTestApp();

    const res = await request(app).get('/api/v1/levels').set('If-None-Match', 'W/"different-etag"');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
