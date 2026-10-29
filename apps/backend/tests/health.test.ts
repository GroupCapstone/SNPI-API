import request from 'supertest';

import { createApp } from '../src/app';

describe('GET /api/v1/health', () => {
  it('returns the standard success envelope', async () => {
    const response = await request(createApp()).get('/api/v1/health').expect(200);

    expect(response.body).toMatchObject({
      success: true,
      message: 'Service is healthy',
      data: {
        service: 'SNP-SMS API',
        status: 'healthy',
        version: '0.1.0',
      },
    });
    expect(response.body.data.timestamp).toEqual(expect.any(String));
    expect(response.headers).toHaveProperty('x-request-id');
    expect(response.headers).toHaveProperty('x-content-type-options', 'nosniff');
    expect(response.headers).toHaveProperty('cache-control', 'no-store');
  });

  it('allows the configured frontend origin and credentials', async () => {
    const response = await request(createApp())
      .get('/api/v1/health')
      .set('Origin', 'http://localhost:3000')
      .expect(200);

    expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
    expect(response.headers['access-control-allow-credentials']).toBe('true');
  });
});
