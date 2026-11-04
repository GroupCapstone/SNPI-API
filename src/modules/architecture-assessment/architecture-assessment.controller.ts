import type { NextFunction, Response } from 'express';
import type { z } from 'zod';

import { getValidatedInput } from '../../middleware/validate';
import { sendPaginated, sendSuccess } from '../../shared/http/api-response';
import type { AuthenticatedRequest } from '../../types/auth';
import { ArchitectureAssessmentService } from './architecture-assessment.service';
import type {
  AssessmentCheckItem,
  EvaluationFilters,
  TriggerEvaluationDto,
} from './architecture-assessment.types';
import type {
  queryEvaluationsSchema,
  triggerEvaluationSchema,
  updateCheckItemSchema,
} from './architecture-assessment.validation';

export class ArchitectureAssessmentController {
  public constructor(private readonly service = new ArchitectureAssessmentService()) {}

  public triggerEvaluation = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const input = getValidatedInput<z.infer<typeof triggerEvaluationSchema>>(response);
      const dto = input.body as TriggerEvaluationDto;
      const userId = request.user?.userId;

      const evaluation = await this.service.triggerEvaluation(dto, userId);

      sendSuccess(
        response,
        evaluation,
        'Architecture assessment evaluation completed successfully',
        201,
      );
    } catch (error) {
      next(error);
    }
  };

  public getEvaluations = async (
    _request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const input = getValidatedInput<z.infer<typeof queryEvaluationsSchema>>(response);
      const filters = input.query as unknown as EvaluationFilters;
      const page = Number(filters.page ?? 1);
      const limit = Number(filters.limit ?? 20);

      const result = await this.service.getEvaluations(filters);

      sendPaginated(
        response,
        result.data,
        {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit),
        },
        'Architecture evaluations retrieved successfully',
      );
    } catch (error) {
      next(error);
    }
  };

  public getEvaluationById = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(request.params.id);
      const evaluation = await this.service.getEvaluationById(id);

      if (!evaluation) {
        response.status(404).json({
          success: false,
          message: 'Architecture evaluation not found',
        });
        return;
      }

      sendSuccess(response, evaluation, 'Architecture evaluation retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public updateCheckItem = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(request.params.id);
      const checkId = String(request.params.checkId);
      const input = getValidatedInput<z.infer<typeof updateCheckItemSchema>>(response);
      const update = input.body as Partial<AssessmentCheckItem>;

      const evaluation = await this.service.updateCheckItem(id, checkId, update);

      if (!evaluation) {
        response.status(404).json({
          success: false,
          message: 'Evaluation or check item not found',
        });
        return;
      }

      sendSuccess(response, evaluation, 'Check item attested successfully');
    } catch (error) {
      next(error);
    }
  };

  public getRadarMetrics = async (
    _request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const metrics = await this.service.getLatestRadarMetrics();

      sendSuccess(response, metrics, 'Latest architecture radar metrics retrieved successfully');
    } catch (error) {
      next(error);
    }
  };
}
