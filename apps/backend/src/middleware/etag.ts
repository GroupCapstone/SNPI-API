import { createHash } from 'node:crypto';
import type { NextFunction, Request, RequestHandler, Response } from 'express';

/**
 * Generates a weak ETag digest for a response body.
 */
export const generateEtag = (body: string | Buffer): string => {
  const hash = createHash('sha256').update(body).digest('hex').slice(0, 24);
  return `W/"${hash}"`;
};

/**
 * Middleware providing RFC 7232 conditional caching for GET and HEAD requests.
 * Evaluates If-None-Match headers and emits 304 Not Modified when contents match.
 */
export const createEtagMiddleware = (): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      return next();
    }

    const originalJson = res.json.bind(res);

    res.json = (body: unknown): Response => {
      try {
        const bodyStr = JSON.stringify(body);
        const etag = generateEtag(bodyStr);

        res.setHeader('ETag', etag);

        const clientEtag = req.headers['if-none-match'];
        if (clientEtag && (clientEtag === etag || clientEtag === '*')) {
          return res.status(304).end();
        }
      } catch {
        // Fallback safely if body cannot be serialized
      }

      return originalJson(body);
    };

    next();
  };
};

export const etagMiddleware = createEtagMiddleware();
