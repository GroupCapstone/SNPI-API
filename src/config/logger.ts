import pino from 'pino';

import { env } from './env';

export const logger = pino({
  level: env.LOG_LEVEL,
  base: {
    service: 'snp-sms-api',
    environment: env.NODE_ENV,
  },
  redact: {
    paths: [
      'password',
      'passwordHash',
      '*.password',
      '*.passwordHash',
      '*.accessToken',
      '*.refreshToken',
      '*.token',
      '*.authorization',
      '*.cookie',
      '*.refreshTokenHash',
      '*.previousRefreshTokenHash',
      '*.apiKey',
      '*.api_key',
      '*.clientSecret',
      '*.secret',
      'accessToken',
      'refreshToken',
      'req.headers.authorization',
      'req.headers.cookie',
    ],
    censor: '[REDACTED]',
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});
