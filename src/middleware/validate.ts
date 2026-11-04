import type { NextFunction, Request, Response } from 'express';
import type { z } from 'zod';

import { ValidationError } from '../shared/errors/app-error';

export interface RequestInput {
  body: unknown;
  params: unknown;
  query: unknown;
}

export const validate =
  <TSchema extends z.ZodType>(schema: TSchema) =>
  (request: Request, response: Response, next: NextFunction): void => {
    const result = schema.safeParse({
      body: request.body ?? {},
      params: request.params ?? {},
      query: request.query ?? {},
    } satisfies RequestInput);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));

      next(new ValidationError('Validation failed', errors));
      return;
    }

    response.locals.validated = result.data;
    next();
  };

export const getValidatedInput = <T>(response: Response): T => {
  if (response.locals.validated === undefined) {
    throw new Error('Validated input is unavailable: attach validation middleware to this route');
  }
  return response.locals.validated as T;
};
