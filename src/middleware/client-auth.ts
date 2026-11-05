import { timingSafeEqual } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';

import { env } from '../config/env';
import { UnauthorizedError } from '../shared/errors/app-error';
import { verifyHmacSha256 } from './signature';

/**
 * Compares two secret strings in constant time to prevent timing side-channel attacks.
 */
export const safeCompareSecrets = (provided: string, expected: string): boolean => {
  const providedBuf = Buffer.from(provided, 'utf-8');
  const expectedBuf = Buffer.from(expected, 'utf-8');

  if (providedBuf.length !== expectedBuf.length) {
    return false;
  }

  return timingSafeEqual(providedBuf, expectedBuf);
};

/**
 * Checks whether the current path is exempt from client authentication.
 */
export const isExemptClientPath = (pathname: string): boolean => {
  const normalized = pathname.replace(/\/$/, '').toLowerCase();
  return (
    normalized === '' ||
    normalized === '/health' ||
    normalized === '/docs' ||
    normalized === '/docs/openapi.json' ||
    normalized === '/openapi.json'
  );
};

/**
 * Zero-Trust Layer 1 Middleware: Verifies the calling client application
 * using either a timing-safe pre-shared API key or an HMAC-SHA256 payload signature.
 */
export const verifyTrustedClient = (req: Request, _res: Response, next: NextFunction): void => {
  // Always permit public health checks and OpenAPI docs
  if (isExemptClientPath(req.path)) {
    return next();
  }

  // Allow bypass in test mode unless ENFORCE_CLIENT_AUTH is set to 'true'
  if (env.NODE_ENV === 'test' && env.ENFORCE_CLIENT_AUTH !== 'true') {
    return next();
  }

  // In non-production environments when enforcement is disabled, allow unless client key is sent
  if (env.ENFORCE_CLIENT_AUTH === 'false' && env.NODE_ENV !== 'production') {
    const providedKey = req.header('X-Client-Api-Key');
    if (!providedKey) {
      return next();
    }
  }

  const expectedKey = env.CLIENT_API_KEY;
  const providedKey = req.header('X-Client-Api-Key');
  const providedSignature = req.header('X-Signature-SHA256');

  // Check 1: Direct M2M Client API Key
  if (providedKey && expectedKey) {
    if (safeCompareSecrets(providedKey, expectedKey)) {
      return next();
    }
    return next(new UnauthorizedError('Invalid client API key'));
  }

  // Check 2: Cryptographic Request Signature (HMAC-SHA256)
  if (providedSignature && expectedKey) {
    let payload = '';
    if (typeof req.body === 'string' || Buffer.isBuffer(req.body)) {
      payload = req.body.toString();
    } else if (req.body && typeof req.body === 'object') {
      payload = JSON.stringify(req.body);
    }

    if (verifyHmacSha256(payload, providedSignature, expectedKey)) {
      return next();
    }
    return next(new UnauthorizedError('Invalid request signature'));
  }

  return next(new UnauthorizedError('Missing required X-Client-Api-Key header'));
};
