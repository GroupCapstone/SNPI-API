import pinoHttp from 'pino-http';

import { logger } from '../config/logger';

export const requestLogger = pinoHttp({
  logger,
  genReqId(request, response) {
    const suppliedRequestId = request.headers['x-request-id'];
    const rawId = Array.isArray(suppliedRequestId) ? suppliedRequestId[0] : suppliedRequestId;
    const isValidRequestId = typeof rawId === 'string' && /^[a-zA-Z0-9_-]{1,64}$/.test(rawId);
    const id = isValidRequestId ? rawId : crypto.randomUUID();
    response.setHeader('X-Request-ID', id);
    return id;
  },
  serializers: {
    req(request) {
      return {
        id: request.id,
        method: request.method,
        url: request.url.split('?')[0]?.split('#')[0] || '/',
        remoteAddress: request.remoteAddress,
      };
    },
  },
});
