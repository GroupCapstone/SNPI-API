import { randomBytes } from 'node:crypto';

import { environmentSchema } from '../src/config/env';

const privateValue = () => randomBytes(48).toString('base64url');

const productionEnvironment = (overrides: Record<string, string> = {}) => ({
  NODE_ENV: 'production',
  MONGODB_URI: 'mongodb://localhost:27017/snp_sms?tls=true',
  FRONTEND_URL: 'https://frontend.example.test',
  JWT_ACCESS_SECRET: privateValue(),
  JWT_REFRESH_SECRET: privateValue(),
  COOKIE_SECRET: privateValue(),
  SUPER_ADMIN_USERNAME: 'bootstrap-admin',
  SUPER_ADMIN_EMAIL: 'bootstrap@example.test',
  SUPER_ADMIN_PASSWORD: privateValue(),
  ...overrides,
});

describe('environment security validation', () => {
  it('accepts production secrets and TLS origins supplied at runtime', () => {
    expect(environmentSchema.safeParse(productionEnvironment()).success).toBe(true);
  });

  it('rejects short, placeholder, or reused signing secrets without echoing their values', () => {
    const secret = 'replace-with-a-placeholder-secret-value';
    const result = environmentSchema.safeParse(
      productionEnvironment({
        JWT_ACCESS_SECRET: secret,
        JWT_REFRESH_SECRET: secret,
        COOKIE_SECRET: 'short',
      }),
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      const diagnostics = JSON.stringify(result.error.issues);
      expect(diagnostics).not.toContain(secret);
      expect(diagnostics).not.toContain('short');
    }
  });

  it('rejects a cookie signing secret reused as a JWT signing secret', () => {
    const reusedSecret = privateValue();
    const result = environmentSchema.safeParse(
      productionEnvironment({
        JWT_ACCESS_SECRET: reusedSecret,
        COOKIE_SECRET: reusedSecret,
      }),
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.path[0])).toContain('COOKIE_SECRET');
    }
  });

  it('rejects non-HTTPS frontend origins and MongoDB connections without TLS', () => {
    const result = environmentSchema.safeParse(
      productionEnvironment({
        FRONTEND_URL: 'http://frontend.example.test',
        MONGODB_URI: 'mongodb://localhost:27017/snp_sms',
      }),
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.path[0])).toEqual(
        expect.arrayContaining(['FRONTEND_URL', 'MONGODB_URI']),
      );
    }
  });
});
