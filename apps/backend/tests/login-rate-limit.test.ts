import express from 'express';
import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createApp } from '../src/app';
import { env } from '../src/config/env';
import { createLoginRateLimiter } from '../src/middleware/security';
import { AuthService } from '../src/modules/auth/auth.service';
import { UnauthorizedError } from '../src/shared/errors/app-error';

describe('dedicated login request limit', () => {
  afterEach(() => vi.restoreAllMocks());

  it('limits failed attempts across account names on the actual login route', async () => {
    const login = vi
      .spyOn(AuthService.prototype, 'login')
      .mockRejectedValue(new UnauthorizedError('Invalid credentials'));
    const app = createApp();
    for (let attempt = 0; attempt < env.LOGIN_RATE_LIMIT_MAX; attempt += 1) {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ identifier: `account-${attempt}`, password: 'wrong' });
      expect(response.status).toBe(401);
    }
    const blocked = await request(app)
      .post('/api/v1/auth/login')
      .send({ identifier: 'another-account', password: 'wrong' });
    expect(blocked.status).toBe(429);
    expect(blocked.body.code).toBe('LOGIN_RATE_LIMIT_EXCEEDED');
    expect(Number(blocked.headers['retry-after'])).toBeGreaterThan(0);
    expect(blocked.headers.ratelimit).toBeDefined();
    expect(login).toHaveBeenCalledTimes(env.LOGIN_RATE_LIMIT_MAX);
    expect((await request(app).get('/api/v1/health')).status).toBe(200);
  });

  it('does not consume the failed-attempt budget for successful logins', async () => {
    const app = express();
    app.post('/login', createLoginRateLimiter(), (_req, res) => {
      res.status(200).json({ success: true });
    });
    for (let attempt = 0; attempt <= env.LOGIN_RATE_LIMIT_MAX; attempt += 1) {
      expect((await request(app).post('/login')).status).toBe(200);
    }
  });

  it('counts malformed requests when mounted before validation', async () => {
    const { validate } = await import('../src/middleware/validate');
    const { loginSchema } = await import('../src/modules/auth/auth.validation');
    const { errorHandler } = await import('../src/middleware/error-handler');
    const app = express();
    app.use(express.json());
    const handler = vi.fn((_req: express.Request, res: express.Response) => {
      res.sendStatus(200);
    });
    app.post('/login', createLoginRateLimiter(), validate(loginSchema), handler);
    app.use(errorHandler);
    for (let attempt = 0; attempt < env.LOGIN_RATE_LIMIT_MAX; attempt += 1) {
      expect(
        (
          await request(app)
            .post('/login')
            .send({ identifier: { $ne: null } })
        ).status,
      ).toBe(422);
    }
    expect((await request(app).post('/login').send({})).status).toBe(429);
    expect(handler).not.toHaveBeenCalled();
  });
});
