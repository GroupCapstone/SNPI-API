import express from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';

import { errorHandler } from '../src/middleware/error-handler';
import { _clearIdempotencyStore, createIdempotencyMiddleware } from '../src/middleware/idempotency';

describe('Idempotency Key Middleware', () => {
  beforeEach(() => {
    _clearIdempotencyStore();
  });

  const createTestApp = () => {
    const app = express();
    app.use(express.json());
    app.use(createIdempotencyMiddleware());

    let count = 0;
    app.post('/api/v1/payments', (_req, res) => {
      count += 1;
      res.status(201).json({ success: true, count, transactionId: `tx-${count}` });
    });

    app.use(errorHandler);
    return app;
  };

  it('passes through transparently when no Idempotency-Key header is supplied', async () => {
    const app = createTestApp();

    const res1 = await request(app).post('/api/v1/payments').send({ amount: 100 });
    expect(res1.status).toBe(201);
    expect(res1.body.count).toBe(1);
    expect(res1.headers['idempotent-replay']).toBeUndefined();

    const res2 = await request(app).post('/api/v1/payments').send({ amount: 100 });
    expect(res2.status).toBe(201);
    expect(res2.body.count).toBe(2);
  });

  it('rejects an invalid Idempotency-Key header format', async () => {
    const app = createTestApp();

    const res = await request(app)
      .post('/api/v1/payments')
      .set('Idempotency-Key', 'short')
      .send({ amount: 100 });

    expect(res.status).toBe(422);
    expect(res.body.code).toBe('VALIDATION_ERROR');
  });

  it('safely replays cached response when the same Idempotency-Key is submitted', async () => {
    const app = createTestApp();
    const idempotencyKey = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

    const res1 = await request(app)
      .post('/api/v1/payments')
      .set('Idempotency-Key', idempotencyKey)
      .send({ amount: 50 });

    expect(res1.status).toBe(201);
    expect(res1.body.count).toBe(1);
    expect(res1.headers['idempotency-key']).toBe(idempotencyKey);
    expect(res1.headers['idempotent-replay']).toBeUndefined();

    // Replayed request with same key
    const res2 = await request(app)
      .post('/api/v1/payments')
      .set('Idempotency-Key', idempotencyKey)
      .send({ amount: 50 });

    expect(res2.status).toBe(201);
    expect(res2.body.count).toBe(1); // Not incremented, served from cache
    expect(res2.headers['idempotent-replay']).toBe('true');
    expect(res2.headers['idempotency-key']).toBe(idempotencyKey);
  });
});
