import type { NextFunction, Request, RequestHandler, Response } from 'express';

export const createHttpsOnlyMiddleware =
  (enabled: boolean): RequestHandler =>
  (request: Request, response: Response, next: NextFunction): void => {
    const requestPath = request.originalUrl.split('?')[0]?.split('#')[0] ?? request.path;
    const isHealthProbe = /^\/(?:api\/v1\/)?health(?:\/|$)/.test(requestPath);
    if (!enabled || request.secure || isHealthProbe) {
      next();
      return;
    }

    response.status(426).json({
      success: false,
      message: 'HTTPS is required for this API endpoint',
      code: 'HTTPS_REQUIRED',
      errors: [],
    });
  };
