import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { createApp } from '../src/app';
import { isExemptClientPath } from '../src/middleware/client-auth';

describe('API Documentation & OpenAPI Endpoints', () => {
  const app = createApp();

  it('exempts documentation endpoints from client key requirements', () => {
    expect(isExemptClientPath('/docs')).toBe(true);
    expect(isExemptClientPath('/docs/')).toBe(true);
    expect(isExemptClientPath('/docs/openapi.json')).toBe(true);
    expect(isExemptClientPath('/openapi.json')).toBe(true);
  });

  it('serves the Interactive REST API Explorer at GET /api/v1/docs', async () => {
    const res = await request(app).get('/api/v1/docs');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/html');
    expect(res.text).toContain('API Explorer');
  });

  it('serves the OpenAPI 3.1 specification at GET /api/v1/docs/openapi.json', async () => {
    const res = await request(app).get('/api/v1/docs/openapi.json');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('application/json');
    expect(res.body.openapi).toBe('3.1.0');
    expect(res.body.info.title).toContain('SNP-SMS');
  });

  it('serves root endpoint metadata with documentation links', async () => {
    const res = await request(app).get('/');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.docs).toBe('/docs');
    expect(res.body.openapi).toBe('/api/v1/docs/openapi.json');
  });
});
