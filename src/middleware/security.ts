import type { CorsOptions } from 'cors';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

import { allowedFrontendOrigins, env } from '../config/env';
import { ForbiddenError } from '../shared/errors/app-error';

const isAllowedOrigin = (origin: string): boolean => {
  if (allowedFrontendOrigins.includes('*') || allowedFrontendOrigins.includes(origin)) {
    return true;
  }
  // Local development / testing (localhost, 127.0.0.1, or local snpi.edu.kh subdomains)
  if (/^https?:\/\/(localhost|127\.0\.0\.1|([a-z0-9-]+\.)*snpi\.edu\.kh)(:\d+)?$/.test(origin)) {
    return true;
  }
  // All Vercel deployments and preview URLs
  if (/^https:\/\/[a-z0-9-]+(\.[a-z0-9-]+)*\.vercel\.app$/.test(origin)) {
    return true;
  }
  // Temporary testing domains (kesararamwithdigital.tech and any subdomain)
  if (/^https:\/\/[a-z0-9-.]*kesararamwithdigital\.tech$/.test(origin)) {
    return true;
  }
  return false;
};

export const corsOptions: CorsOptions = {
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Request-ID',
    'X-Branch-ID',
    'Idempotency-Key',
    'Accept',
    'X-Requested-With',
    'X-Client-Api-Key',
    'X-Signature-SHA256',
  ],
  exposedHeaders: [
    'RateLimit',
    'RateLimit-Policy',
    'X-Request-ID',
    'X-Error-Code',
    'Location',
    'Retry-After',
    'ETag',
  ],
  origin: (origin, callback) => {
    if (!origin || isAllowedOrigin(origin)) {
      callback(null, true);
      return;
    }

    callback(new ForbiddenError('Origin is not allowed by CORS'));
  },
};

export const corsMiddleware = cors(corsOptions);

export const createLoginRateLimiter = () =>
  rateLimit({
    windowMs: env.LOGIN_RATE_LIMIT_WINDOW_MS,
    limit: env.LOGIN_RATE_LIMIT_MAX,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    message: {
      success: false,
      message: 'Too many login attempts. Please try again later.',
      code: 'LOGIN_RATE_LIMIT_EXCEEDED',
      errors: [],
    },
  });

export const apiRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: env.NODE_ENV === 'production' ? env.RATE_LIMIT_MAX : Math.max(env.RATE_LIMIT_MAX, 2000),
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
    code: 'RATE_LIMIT_EXCEEDED',
    errors: [],
  },
});

export const createAuthRateLimiter = (options?: { limit?: number; windowMs?: number }) =>
  rateLimit({
    windowMs: options?.windowMs ?? env.LOGIN_RATE_LIMIT_WINDOW_MS,
    limit: options?.limit ?? 30,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    skip: () => env.NODE_ENV === 'test',
    message: {
      success: false,
      message: 'Too many authentication requests. Please try again later.',
      code: 'AUTH_RATE_LIMIT_EXCEEDED',
      errors: [],
    },
  });

export const mutationRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: env.NODE_ENV === 'production' ? Math.floor(env.RATE_LIMIT_MAX * 0.75) : 3000,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  skip: (request) => env.NODE_ENV === 'test' || ['GET', 'HEAD', 'OPTIONS'].includes(request.method),
  validate: {
    keyGeneratorIpFallback: false,
  },
  keyGenerator: (request) => {
    const user = (request as { user?: { userId?: string } }).user;
    return user?.userId ?? request.ip ?? 'unknown';
  },
  message: {
    success: false,
    message: 'Too many modification requests. Please slow down and try again later.',
    code: 'MUTATION_RATE_LIMIT_EXCEEDED',
    errors: [],
  },
});

export const publicVerificationRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: env.NODE_ENV === 'test' ? 1000 : 60,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  skip: () => env.NODE_ENV === 'test',
  message: {
    success: false,
    message: 'Too many certificate verification requests. Please try again later.',
    code: 'VERIFICATION_RATE_LIMIT_EXCEEDED',
    errors: [],
  },
});
