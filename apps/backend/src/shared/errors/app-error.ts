export type ErrorDetails = Array<{
  field?: string;
  message: string;
}>;

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly errors?: ErrorDetails;
  public readonly isOperational: boolean;

  public constructor(message: string, statusCode: number, code: string, errors?: ErrorDetails) {
    super(message);
    this.name = new.target.name;
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
    this.isOperational = true;
    Error.captureStackTrace(this, new.target);
  }
}

export class BadRequestError extends AppError {
  public constructor(message = 'Bad request', errors?: ErrorDetails) {
    super(message, 400, 'BAD_REQUEST', errors);
  }
}

export class UnauthorizedError extends AppError {
  public constructor(message = 'Authentication required') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends AppError {
  public constructor(message = 'You do not have permission to perform this action') {
    super(message, 403, 'FORBIDDEN');
  }
}

export class NotFoundError extends AppError {
  public constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class ConflictError extends AppError {
  public constructor(message = 'Resource already exists', errors?: ErrorDetails) {
    super(message, 409, 'CONFLICT', errors);
  }
}

export class ValidationError extends AppError {
  public constructor(message = 'Validation failed', errors?: ErrorDetails) {
    super(message, 422, 'VALIDATION_ERROR', errors);
  }
}
