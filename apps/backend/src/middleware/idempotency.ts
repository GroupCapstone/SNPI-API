import type { NextFunction, Request, RequestHandler, Response } from 'express';

import { ConflictError, ValidationError } from '../shared/errors/app-error';

interface CachedResponse {
  status: 'PENDING' | 'RESOLVED';
  statusCode?: number;
  headers?: Record<string, string>;
  body?: unknown;
  timestamp: number;
}

// In-memory idempotency cache (keyed by tenant/path/idempotencyKey)
const idempotencyStore = new Map<string, CachedResponse>();
const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes retention

/**
 * Periodically prunes expired idempotency entries to maintain memory efficiency.
 */
const pruneExpiredEntries = (): void => {
  const now = Date.now();
  for (const [key, entry] of idempotencyStore.entries()) {
    if (now - entry.timestamp > DEFAULT_TTL_MS) {
      idempotencyStore.delete(key);
    }
  }
};

// Periodic background cleanup every 2 minutes
const cleanupTimer = setInterval(pruneExpiredEntries, 2 * 60 * 1000);
if (cleanupTimer.unref) {
  cleanupTimer.unref();
}

/**
 * Validates Idempotency-Key format.
 * Expects UUIDv4 or 16-128 characters alphanumeric string.
 */
export const isValidIdempotencyKey = (key: string): boolean => {
  return /^[a-zA-Z0-9_-]{16,128}$/.test(key);
};

export interface IdempotencyOptions {
  ttlMs?: number;
  headerName?: string;
}

/**
 * Idempotency Key Middleware for mutating HTTP operations (POST, PUT, PATCH).
 * Enforces RFC-compliant duplicate submission prevention and safe replays.
 */
export const createIdempotencyMiddleware = (options: IdempotencyOptions = {}): RequestHandler => {
  const ttlMs = options.ttlMs ?? DEFAULT_TTL_MS;
  const headerName = (options.headerName ?? 'idempotency-key').toLowerCase();

  return (req: Request, res: Response, next: NextFunction): void => {
    // Only mutating requests need idempotency guards
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      return next();
    }

    const rawKey = req.headers[headerName];
    if (!rawKey) {
      // Idempotency key is optional; pass through if omitted
      return next();
    }

    const key = Array.isArray(rawKey) ? rawKey[0] : rawKey;
    if (typeof key !== 'string' || !isValidIdempotencyKey(key)) {
      return next(
        new ValidationError('Invalid Idempotency-Key header format', [
          {
            field: headerName,
            message: 'Idempotency-Key must be 16-128 alphanumeric characters or UUID',
          },
        ]),
      );
    }

    // Tenancy-isolated cache key
    const tenantScope =
      (req as unknown as { user?: { schoolId?: string } }).user?.schoolId || 'global';
    const storeKey = `${tenantScope}:${req.method}:${req.originalUrl.split('?')[0]}:${key}`;

    const existing = idempotencyStore.get(storeKey);
    const now = Date.now();

    if (existing && now - existing.timestamp <= ttlMs) {
      if (existing.status === 'PENDING') {
        // Concurrent duplicate request in progress
        return next(
          new ConflictError(
            'A request with this Idempotency-Key is currently in progress. Please retry shortly.',
            [{ field: headerName, message: 'Concurrent request conflict' }],
          ),
        );
      }

      if (existing.status === 'RESOLVED' && existing.statusCode) {
        // Safe idempotent replay of previously completed execution
        res.setHeader('Idempotent-Replay', 'true');
        res.setHeader('Idempotency-Key', key);
        if (existing.headers) {
          for (const [hName, hVal] of Object.entries(existing.headers)) {
            res.setHeader(hName, hVal);
          }
        }
        res.status(existing.statusCode).json(existing.body);
        return;
      }
    }

    // Register pending request state
    idempotencyStore.set(storeKey, {
      status: 'PENDING',
      timestamp: now,
    });

    // Intercept json() response to record resolved outcome
    const originalJson = res.json.bind(res);
    res.json = (body: unknown): Response => {
      // Record resolved state for future replays
      idempotencyStore.set(storeKey, {
        status: 'RESOLVED',
        statusCode: res.statusCode,
        body,
        timestamp: Date.now(),
      });
      res.setHeader('Idempotency-Key', key);
      return originalJson(body);
    };

    next();
  };
};

export const idempotencyMiddleware = createIdempotencyMiddleware();

// Helper to clear store in unit tests
export const _clearIdempotencyStore = (): void => {
  idempotencyStore.clear();
};
