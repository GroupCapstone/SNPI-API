import { createHmac, timingSafeEqual } from 'node:crypto';
import type { NextFunction, Request, RequestHandler, Response } from 'express';

import { AppError } from '../shared/errors/app-error';

/**
 * Computes an HMAC-SHA256 signature for a string or buffer payload.
 */
export const computeHmacSha256 = (payload: string | Buffer, secret: string): string => {
  return createHmac('sha256', secret).update(payload).digest('hex');
};

/**
 * Validates an incoming HMAC-SHA256 signature using constant-time comparison
 * to eliminate timing side-channel attacks.
 */
export const verifyHmacSha256 = (
  payload: string | Buffer,
  providedSignature: string,
  secret: string,
): boolean => {
  // Strip optional 'sha256=' prefix if present
  const cleanSignature = providedSignature.startsWith('sha256=')
    ? providedSignature.slice(7)
    : providedSignature;

  const expectedSignature = computeHmacSha256(payload, secret);

  const cleanBuffer = Buffer.from(cleanSignature, 'utf-8');
  const expectedBuffer = Buffer.from(expectedSignature, 'utf-8');

  if (cleanBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(cleanBuffer, expectedBuffer);
};

export interface SignatureVerificationOptions {
  secret: string;
  headerName?: string;
}

/**
 * Express middleware to verify cryptographic HMAC signatures on webhooks or event callbacks.
 */
export const createSignatureVerificationMiddleware = (
  options: SignatureVerificationOptions,
): RequestHandler => {
  const headerName = (options.headerName ?? 'x-signature-sha256').toLowerCase();

  return (req: Request, _res: Response, next: NextFunction): void => {
    const signature = req.headers[headerName];

    if (!signature || typeof signature !== 'string') {
      return next(
        new AppError(`Missing required signature header: ${headerName}`, 401, 'MISSING_SIGNATURE'),
      );
    }

    // Determine payload representation
    let payload = '';
    if (typeof req.body === 'string' || Buffer.isBuffer(req.body)) {
      payload = req.body.toString();
    } else if (req.body && typeof req.body === 'object') {
      payload = JSON.stringify(req.body);
    }

    const isValid = verifyHmacSha256(payload, signature, options.secret);
    if (!isValid) {
      return next(
        new AppError(
          'Cryptographic payload signature verification failed',
          401,
          'INVALID_SIGNATURE',
        ),
      );
    }

    next();
  };
};
