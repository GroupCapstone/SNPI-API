import type { z } from 'zod';
import type { NextFunction, Response } from 'express';

import { getValidatedInput } from '../../middleware/validate';
import { sendPaginated, sendSuccess } from '../../shared/http/api-response';
import type { AuthenticatedRequest } from '../../types/auth';
import { CurriculumService } from './curriculum.service';
import type {
  CreateCurriculumDto,
  CurriculumQueryFilters,
  UpdateCurriculumDto,
} from './curriculum.types';

import type {
  queryCurriculumSchema,
  createCurriculumSchema,
  updateCurriculumSchema,
} from './curriculum.validation';

export class CurriculumController {
  public constructor(private readonly service = new CurriculumService()) {}

  public getCurricula = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const filters = getValidatedInput<z.infer<typeof queryCurriculumSchema>>(response)
        .query as unknown as CurriculumQueryFilters;
      const page = Number(filters.page ?? 1);
      const limit = Number(filters.limit ?? 20);

      const result = await this.service.getCurricula(filters, request.user!);

      sendPaginated(
        response,
        result.data,
        {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit),
        },
        'Curricula retrieved successfully',
      );
    } catch (error) {
      next(error);
    }
  };

  public getCurriculumById = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(request.params.id);
      const curriculum = await this.service.getCurriculumById(id, request.user!);
      sendSuccess(response, curriculum, 'Curriculum retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public createCurriculum = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = getValidatedInput<z.infer<typeof createCurriculumSchema>>(response)
        .body as CreateCurriculumDto;
      const curriculum = await this.service.createCurriculum(dto, request.user!);
      sendSuccess(response, curriculum, 'Curriculum created successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  public updateCurriculum = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(request.params.id);
      const dto = getValidatedInput<z.infer<typeof updateCurriculumSchema>>(response)
        .body as UpdateCurriculumDto;
      const curriculum = await this.service.updateCurriculum(id, dto, request.user!);
      sendSuccess(response, curriculum, 'Curriculum updated successfully');
    } catch (error) {
      next(error);
    }
  };

  public deleteCurriculum = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(request.params.id);
      await this.service.deleteCurriculum(id, request.user!);
      sendSuccess(response, null, 'Curriculum deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}
