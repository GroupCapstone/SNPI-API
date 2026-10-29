import type { z } from 'zod';
import type { NextFunction, Response } from 'express';

import { getValidatedInput } from '../../middleware/validate';
import { sendPaginated, sendSuccess } from '../../shared/http/api-response';
import type { AuthenticatedRequest } from '../../types/auth';
import { AssessmentService } from './assessment.service';
import type {
  AssessmentQueryFilters,
  CreateAssessmentDto,
  UpdateAssessmentDto,
} from './assessment.types';

import type {
  queryAssessmentSchema,
  createAssessmentSchema,
  updateAssessmentSchema,
} from './assessment.validation';

export class AssessmentController {
  public constructor(private readonly service = new AssessmentService()) {}

  public getAssessments = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const filters = getValidatedInput<z.infer<typeof queryAssessmentSchema>>(response)
        .query as unknown as AssessmentQueryFilters;
      const page = Number(filters.page ?? 1);
      const limit = Number(filters.limit ?? 20);

      const result = await this.service.getAssessments(filters, request.user!);

      sendPaginated(
        response,
        result.data,
        {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit),
        },
        'Assessments retrieved successfully',
      );
    } catch (error) {
      next(error);
    }
  };

  public getAssessmentById = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(request.params.id);
      const assessment = await this.service.getAssessmentById(id, request.user!);
      sendSuccess(response, assessment, 'Assessment retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public createAssessment = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = getValidatedInput<z.infer<typeof createAssessmentSchema>>(response)
        .body as CreateAssessmentDto;
      const assessment = await this.service.createAssessment(dto, request.user!);
      sendSuccess(response, assessment, 'Assessment created successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  public updateAssessment = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(request.params.id);
      const dto = getValidatedInput<z.infer<typeof updateAssessmentSchema>>(response)
        .body as UpdateAssessmentDto;
      const assessment = await this.service.updateAssessment(id, dto, request.user!);
      sendSuccess(response, assessment, 'Assessment updated successfully');
    } catch (error) {
      next(error);
    }
  };

  public deleteAssessment = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(request.params.id);
      await this.service.deleteAssessment(id, request.user!);
      sendSuccess(response, null, 'Assessment deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}
