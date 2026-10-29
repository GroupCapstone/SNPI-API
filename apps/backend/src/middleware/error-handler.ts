import type { ErrorRequestHandler, RequestHandler } from 'express';
import mongoose from 'mongoose';
import { ZodError } from 'zod';

import { env } from '../config/env';
import { logger } from '../config/logger';
import {
  AppError,
  ConflictError,
  NotFoundError,
  ValidationError,
} from '../shared/errors/app-error';

interface MongoDuplicateKeyError extends Error {
  code: number;
  keyPattern?: Record<string, number>;
}

const isDuplicateKeyError = (error: unknown): error is MongoDuplicateKeyError =>
  error instanceof Error && 'code' in error && error.code === 11_000;

const normalizeError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof ZodError) {
    return new ValidationError(
      'Validation failed',
      error.issues.map((issue) => ({ field: issue.path.join('.'), message: issue.message })),
    );
  }

  if (error instanceof mongoose.Error.CastError) {
    return new ValidationError('Invalid resource identifier', [
      { field: error.path, message: 'Invalid identifier' },
    ]);
  }

  if (error instanceof mongoose.Error.ValidationError) {
    const issues = Object.entries(error.errors).map(([field, err]) => ({
      field,
      message: err.message,
    }));
    return new ValidationError('Validation failed', issues);
  }

  if (
    error instanceof SyntaxError &&
    'status' in error &&
    error.status === 400 &&
    'body' in error
  ) {
    return new ValidationError('Malformed JSON in request body', [
      { field: 'body', message: 'Invalid JSON payload' },
    ]);
  }

  if (
    error instanceof Error &&
    (('type' in error && error.type === 'entity.too.large') ||
      ('status' in error && error.status === 413))
  ) {
    return new AppError('Request payload exceeds permitted size limit', 413, 'PAYLOAD_TOO_LARGE');
  }

  if (isDuplicateKeyError(error)) {
    const fields = Object.keys(error.keyPattern ?? {});
    return new ConflictError(
      'A record with the same unique value already exists',
      fields.map((field) => ({
        field,
        message: `${field} must be unique`,
      })),
    );
  }

  return new AppError('Internal server error', 500, 'INTERNAL_SERVER_ERROR');
};

const getRfcTitle = (statusCode: number): string => {
  switch (statusCode) {
    case 400:
      return 'Bad Request';
    case 401:
      return 'Unauthorized';
    case 402:
      return 'Payment Required';
    case 403:
      return 'Forbidden';
    case 404:
      return 'Not Found';
    case 409:
      return 'Conflict';
    case 413:
      return 'Payload Too Large';
    case 422:
      return 'Unprocessable Entity';
    case 429:
      return 'Too Many Requests';
    case 500:
      return 'Internal Server Error';
    case 502:
      return 'Bad Gateway';
    case 503:
      return 'Service Unavailable';
    default:
      return 'HTTP Error';
  }
};

export const notFoundHandler: RequestHandler = (request, _response, next) => {
  next(new NotFoundError(`Route ${request.method} ${request.originalUrl} not found`));
};

export const errorHandler: ErrorRequestHandler = (error, request, response, _next) => {
  const normalizedError = normalizeError(error);

  const logContext = {
    code: normalizedError.code,
    method: request.method,
    path: request.originalUrl,
    requestId: request.id,
    statusCode: normalizedError.statusCode,
  };

  if (normalizedError.statusCode >= 500) {
    logger.error(
      { ...logContext, error: error instanceof Error ? error : new Error('Unknown error') },
      'Unexpected API error',
    );
  } else {
    logger.warn(logContext, 'API request rejected');
  }

  // Response header for programmatic error classification
  response.setHeader('X-Error-Code', normalizedError.code);

  // Check if caller explicitly requested RFC 7807 / RFC 9457 Problem Details
  const isRfcProblemDetails =
    Boolean(request.headers['accept']?.includes('application/problem+json')) ||
    request.query.rfc7807 === 'true' ||
    request.query.format === 'rfc7807' ||
    request.query.format === 'problem';

  if (isRfcProblemDetails) {
    response.setHeader('Content-Type', 'application/problem+json; charset=utf-8');
    const rfcPayload: {
      type: string;
      title: string;
      status: number;
      detail: string;
      instance: string;
      code: string;
      success: false;
      invalidParams?: typeof normalizedError.errors;
      errors?: typeof normalizedError.errors;
      stack?: string;
    } = {
      type: `https://api.snpis.kesararamwithdigital.tech/errors/${normalizedError.code.toLowerCase()}`,
      title: getRfcTitle(normalizedError.statusCode),
      status: normalizedError.statusCode,
      detail: normalizedError.message,
      instance: (request.originalUrl || '').split('?')[0] || '/',
      code: normalizedError.code,
      success: false,
    };

    if (normalizedError.errors) {
      rfcPayload.invalidParams = normalizedError.errors;
      rfcPayload.errors = normalizedError.errors;
    }

    if (env.NODE_ENV === 'development' && error instanceof Error) {
      rfcPayload.stack = error.stack;
    }

    response.status(normalizedError.statusCode).json(rfcPayload);
    return;
  }

  const payload: {
    success: false;
    message: string;
    code: string;
    errors?: typeof normalizedError.errors;
    stack?: string;
  } = {
    success: false,
    message: normalizedError.message,
    code: normalizedError.code,
  };

  if (normalizedError.errors) {
    payload.errors = normalizedError.errors;
  }

  if (env.NODE_ENV === 'development' && error instanceof Error) {
    payload.stack = error.stack;
  }

  response.status(normalizedError.statusCode).json(payload);
};
