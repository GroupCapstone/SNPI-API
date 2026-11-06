import express from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { errorHandler } from '../src/middleware/error-handler';
import { apiRateLimiter } from '../src/middleware/security';
import {
  computeHmacSha256,
  createSignatureVerificationMiddleware,
  verifyHmacSha256,
} from '../src/middleware/signature';

describe('HMAC-SHA256 Payload Signature Middleware', () => {
  const secret = 'super-secret-webhook-key-2026';

  const createTestApp = () => {
    const app = express();
    app.use(express.json());
    app.use(apiRateLimiter);
    app.use(
      '/webhooks/ledger',
      createSignatureVerificationMiddleware({ secret, headerName: 'x-signature-sha256' }),
      (req, res) => {
        res.status(200).json({ received: true, event: req.body });
      },
    );
    app.use(errorHandler);
    return app;
  };

  it('computes and verifies HMAC-SHA256 correctly', () => {
    const payload = JSON.stringify({ event: 'BLOCK_COMMITTED', blockNumber: 42 });
    const signature = computeHmacSha256(payload, secret);

    expect(verifyHmacSha256(payload, signature, secret)).toBe(true);
    expect(verifyHmacSha256(payload, `sha256=${signature}`, secret)).toBe(true);
    expect(verifyHmacSha256(payload, 'wrong-signature', secret)).toBe(false);
  });

  it('accepts requests with valid cryptographic signatures', async () => {
    const app = createTestApp();
    const body = { event: 'BLOCK_COMMITTED', blockNumber: 100 };
    const payload = JSON.stringify(body);
    const signature = computeHmacSha256(payload, secret);

    const res = await request(app)
      .post('/webhooks/ledger')
      .set('Content-Type', 'application/json')
      .set('X-Signature-SHA256', signature)
      .send(body);

    expect(res.status).toBe(200);
    expect(res.body.received).toBe(true);
  });

  it('rejects requests with missing or tampered signatures', async () => {
    const app = createTestApp();
    const body = { event: 'BLOCK_COMMITTED', blockNumber: 100 };

    // Missing signature
    const resNoSig = await request(app)
      .post('/webhooks/ledger')
      .set('Content-Type', 'application/json')
      .send(body);

    expect(resNoSig.status).toBe(401);
    expect(resNoSig.body.code).toBe('MISSING_SIGNATURE');

    // Tampered payload with old signature
    const signature = computeHmacSha256(JSON.stringify(body), secret);
    const resTampered = await request(app)
      .post('/webhooks/ledger')
      .set('Content-Type', 'application/json')
      .set('X-Signature-SHA256', signature)
      .send({ ...body, blockNumber: 999 });

    expect(resTampered.status).toBe(401);
    expect(resTampered.body.code).toBe('INVALID_SIGNATURE');
  });
});
