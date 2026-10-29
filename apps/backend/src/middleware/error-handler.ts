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
