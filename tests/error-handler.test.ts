import express from 'express';
import request from 'supertest';
import { z } from 'zod';

import { createApp } from '../src/app';
import { errorHandler } from '../src/middleware/error-handler';
import { getValidatedInput, validate } from '../src/middleware/validate';
import { sendSuccess } from '../src/shared/http/api-response';

describe('API error and validation foundation', () => {
  it('returns the standard 404 error envelope', async () => {
    const response = await request(createApp()).get('/api/v1/missing').expect(404);

    expect(response.body).toEqual({
      success: false,
      message: 'Route GET /api/v1/missing not found',
      code: 'NOT_FOUND',
    });
  });

  it('formats Zod validation failures without exposing internals', async () => {
    const app = express();
    app.use(express.json());
    const schema = z.object({
      body: z.object({ email: z.email() }),
      params: z.object({}),
      query: z.object({}),
    });

    app.post('/validation-test', validate(schema), (_request, response) => {
      const input = getValidatedInput<z.infer<typeof schema>>(response);
      sendSuccess(response, input.body);
    });
    app.use(errorHandler);

    const response = await request(app)
      .post('/validation-test')
      .send({ email: 'not-an-email' })
      .expect(422);

    expect(response.body).toMatchObject({
      success: false,
      message: 'Validation failed',
      code: 'VALIDATION_ERROR',
      errors: [{ field: 'body.email' }],
    });
    expect(response.body).not.toHaveProperty('stack');
  });

  it('safely handles malformed JSON without leaking server internals', async () => {
    const app = createApp();
    const response = await request(app)
      .post('/api/v1/auth/login')
      .set('Content-Type', 'application/json')
      .send('{"badJson": }');

    expect(response.status).toBe(422);
    expect(response.body).toMatchObject({
      success: false,
      message: 'Malformed JSON in request body',
      code: 'VALIDATION_ERROR',
      errors: [{ field: 'body', message: 'Invalid JSON payload' }],
    });
    expect(response.body).not.toHaveProperty('stack');
  });

  it('sanitizes unsafe client X-Request-ID headers', async () => {
    const app = createApp();
    const response = await request(app)
      .get('/api/v1/health')
      .set('X-Request-ID', '<script>alert(1)</script>');

    expect(response.status).toBe(200);
    const returnedId = response.headers['x-request-id'];
    expect(returnedId).not.toContain('<script>');
    // Must be sanitized to a valid UUID format
    expect(returnedId).toMatch(/^[0-9a-f-]{36}$/i);
  });
});
