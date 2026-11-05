import path from 'node:path';
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({ quiet: true });
dotenv.config({ path: path.resolve(__dirname, '../../.env'), quiet: true });

const placeholderSecretPattern =
  /(?:replace[-_ ]with|change[-_ ]me|placeholder|example|generated|secure_random|minimum\d+|your[-_ ])/i;

export const environmentSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().max(65_535).default(4000),
    MONGODB_URI: z.string().min(1).default('mongodb://localhost:27017/snp_sms'),
    FRONTEND_URL: z
      .string()
      .min(1)
      .default(
        process.env.NODE_ENV === 'production'
          ? 'https://app.kesararamwithdigital.tech,https://snp-sms.vercel.app'
          : 'http://localhost:3000',
      ),
    LOG_LEVEL: z
      .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
      .default('info'),
    RATE_LIMIT_WINDOW_MS: z.coerce
      .number()
      .int()
      .positive()
      .default(15 * 60 * 1000),
    RATE_LIMIT_MAX: z.coerce.number().int().positive().default(200),
    LOGIN_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
    LOGIN_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(10),
    JWT_ACCESS_SECRET: z
      .string()
      .min(32)
      .default('***REMOVED***'),
    JWT_REFRESH_SECRET: z
      .string()
      .min(32)
      .default('***REMOVED***'),
    JWT_ACCESS_EXPIRES_IN: z.string().min(1).default('15m'),
    JWT_REFRESH_EXPIRES_IN: z.string().min(1).default('7d'),
    SUPER_ADMIN_USERNAME: z.string().min(1).default('admin_local'),
    SUPER_ADMIN_EMAIL: z.string().email().default('admin@snpsms.local'),
    SUPER_ADMIN_PASSWORD: z.string().min(12).default('***REMOVED***'),
    COOKIE_SECRET: z
      .string()
      .min(32)
      .default('***REMOVED***'),
    CLIENT_API_KEY: z.string().min(16).default('***REMOVED***'),
    ENFORCE_CLIENT_AUTH: z.enum(['true', 'false']).default('false'),
  })
  .superRefine((configuration, context) => {
    const secrets = [
      ['JWT_ACCESS_SECRET', configuration.JWT_ACCESS_SECRET],
      ['JWT_REFRESH_SECRET', configuration.JWT_REFRESH_SECRET],
      ['COOKIE_SECRET', configuration.COOKIE_SECRET],
      ['SUPER_ADMIN_PASSWORD', configuration.SUPER_ADMIN_PASSWORD],
    ] as const;

    for (const [field, value] of secrets) {
      if (placeholderSecretPattern.test(value)) {
        context.addIssue({
          code: 'custom',
          path: [field],
          message: `${field} must be replaced with a private value`,
        });
      }
    }

    if (new Set(secrets.slice(0, 3).map(([, value]) => value)).size !== 3) {
      context.addIssue({
        code: 'custom',
        path: ['COOKIE_SECRET'],
        message: 'JWT signing and cookie secrets must all be different',
      });
    }

    if (
      configuration.SUPER_ADMIN_PASSWORD.toLowerCase() ===
        configuration.SUPER_ADMIN_USERNAME.toLowerCase() ||
      configuration.SUPER_ADMIN_PASSWORD.toLowerCase() ===
        configuration.SUPER_ADMIN_EMAIL.toLowerCase()
    ) {
      context.addIssue({
        code: 'custom',
        path: ['SUPER_ADMIN_PASSWORD'],
        message: 'The super administrator password must differ from the username and email',
      });
    }

    if (configuration.NODE_ENV !== 'production') return;

    if (configuration.SUPER_ADMIN_PASSWORD.length < 16) {
      context.addIssue({
        code: 'custom',
        path: ['SUPER_ADMIN_PASSWORD'],
        message: 'SUPER_ADMIN_PASSWORD must contain at least 16 characters in production',
      });
    }

    const frontendOrigins = configuration.FRONTEND_URL.split(',').map((origin) => origin.trim());
    for (const origin of frontendOrigins) {
      if (origin === '*') continue;
      try {
        const parsedOrigin = new URL(origin);
        if (
          parsedOrigin.protocol !== 'https:' ||
          parsedOrigin.origin !== origin ||
          parsedOrigin.username ||
          parsedOrigin.password
        ) {
          throw new Error('invalid origin');
        }
      } catch {
        context.addIssue({
          code: 'custom',
          path: ['FRONTEND_URL'],
          message: 'Every production frontend origin must be an HTTPS origin without a path',
        });
        break;
      }
    }

    try {
      const mongoUrl = new URL(configuration.MONGODB_URI);
      const tlsOption = mongoUrl.searchParams.get('tls')?.toLowerCase();
      const sslOption = mongoUrl.searchParams.get('ssl')?.toLowerCase();
      const tlsDisabled =
        ['false', '0'].includes(tlsOption ?? '') || ['false', '0'].includes(sslOption ?? '');
      const tlsEnabled =
        mongoUrl.protocol === 'mongodb+srv:'
          ? !tlsDisabled
          : tlsOption === 'true' || tlsOption === '1' || sslOption === 'true' || sslOption === '1';

      if (!['mongodb:', 'mongodb+srv:'].includes(mongoUrl.protocol) || !tlsEnabled) {
        throw new Error('TLS is required');
      }
    } catch {
      context.addIssue({
        code: 'custom',
        path: ['MONGODB_URI'],
        message: 'Production MongoDB connections must use TLS',
      });
    }
  });

const parsedEnvironment = environmentSchema.safeParse(process.env);

if (!parsedEnvironment.success) {
  const issues = parsedEnvironment.error.issues
    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    .join(', ');

  throw new Error(`Invalid environment configuration: ${issues}`);
}

export const env = parsedEnvironment.data;

export const allowedFrontendOrigins = env.FRONTEND_URL.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
