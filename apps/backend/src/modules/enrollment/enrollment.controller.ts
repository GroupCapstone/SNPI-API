import type { z } from 'zod';
import type { NextFunction, Response } from 'express';

import { getValidatedInput } from '../../middleware/validate';
import { sendPaginated, sendSuccess } from '../../shared/http/api-response';
import type { AuthenticatedRequest } from '../../types/auth';
import { EnrollmentService } from './enrollment.service';
import type {
  CreateEnrollmentDTO,
  EnrollmentQueryFilters,
  UpdateEnrollmentDTO,
} from './enrollment.types';

import type {
  enrollmentQueryValidationSchema,
  createEnrollmentValidationSchema,
  updateEnrollmentValidationSchema,
} from './enrollment.validation';

export class EnrollmentController {
  public constructor(private readonly service = new EnrollmentService()) {}

  public getEnrollments = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const filters = getValidatedInput<z.infer<typeof enrollmentQueryValidationSchema>>(response)
        .query as unknown as EnrollmentQueryFilters;
      const page = Number(filters.page ?? 1);
      const limit = Number(filters.limit ?? 20);

      const result = await this.service.getEnrollments(filters, request.user!);

      sendPaginated(
        response,
        result.data,
        {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit) || 1,
        },
        'Student enrollments retrieved successfully',
      );
    } catch (error) {
      next(error);
    }
  };

  public getEnrollmentById = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = request.params.id as string;
      const enrollment = await this.service.getEnrollmentById(id, request.user!);
      sendSuccess(response, enrollment, 'Enrollment details retrieved successfully', 200);
    } catch (error) {
      next(error);
    }
  };

  public createEnrollment = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = getValidatedInput<z.infer<typeof createEnrollmentValidationSchema>>(response)
        .body as CreateEnrollmentDTO;
      const enrollment = await this.service.createEnrollment(dto, request.user!);
      sendSuccess(response, enrollment, 'Student enrolled into class successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  public updateEnrollment = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = request.params.id as string;
      const dto = getValidatedInput<z.infer<typeof updateEnrollmentValidationSchema>>(response)
        .body as UpdateEnrollmentDTO;
      const enrollment = await this.service.updateEnrollment(id, dto, request.user!);
      sendSuccess(response, enrollment, 'Student enrollment updated successfully', 200);
    } catch (error) {
      next(error);
    }
  };

  public deleteEnrollment = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = request.params.id as string;
      await this.service.deleteEnrollment(id, request.user!);
      sendSuccess(response, null, 'Student enrollment record cancelled successfully', 200);
    } catch (error) {
      next(error);
    }
  };
}
