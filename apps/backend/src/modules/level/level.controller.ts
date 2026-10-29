import type { z } from 'zod';
import type { NextFunction, Response } from 'express';

import { getValidatedInput } from '../../middleware/validate';
import { sendPaginated, sendSuccess } from '../../shared/http/api-response';
import type { AuthenticatedRequest } from '../../types/auth';
import { LevelService } from './level.service';
import type { CreateLevelDto, LevelQueryFilters, UpdateLevelDto } from './level.types';

import type { queryLevelSchema, createLevelSchema, updateLevelSchema } from './level.validation';

export class LevelController {
  public constructor(private readonly service = new LevelService()) {}

  public getLevels = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const filters = getValidatedInput<z.infer<typeof queryLevelSchema>>(response)
        .query as unknown as LevelQueryFilters;
      const page = Number(filters.page ?? 1);
      const limit = Number(filters.limit ?? 20);

      const result = await this.service.getLevels(filters, request.user!);

      sendPaginated(
        response,
        result.data,
        {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit),
        },
        'Levels retrieved successfully',
      );
    } catch (error) {
      next(error);
    }
  };

  public getLevelById = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(request.params.id);
      const level = await this.service.getLevelById(id, request.user!);
      sendSuccess(response, level, 'Level retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public createLevel = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = getValidatedInput<z.infer<typeof createLevelSchema>>(response)
        .body as CreateLevelDto;
      const level = await this.service.createLevel(dto, request.user!);
      sendSuccess(response, level, 'Level created successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  public updateLevel = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(request.params.id);
      const dto = getValidatedInput<z.infer<typeof updateLevelSchema>>(response)
        .body as UpdateLevelDto;
      const level = await this.service.updateLevel(id, dto, request.user!);
      sendSuccess(response, level, 'Level updated successfully');
    } catch (error) {
      next(error);
    }
  };

  public deleteLevel = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(request.params.id);
      await this.service.deleteLevel(id, request.user!);
      sendSuccess(response, null, 'Level deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}
