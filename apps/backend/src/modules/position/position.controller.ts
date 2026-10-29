import type { z } from 'zod';
import type { NextFunction, Response } from 'express';

import { getValidatedInput } from '../../middleware/validate';
import { sendPaginated, sendSuccess } from '../../shared/http/api-response';
import type { AuthenticatedRequest } from '../../types/auth';
import { PositionService } from './position.service';
import type { CreatePositionDto, PositionQueryFilters, UpdatePositionDto } from './position.types';

import type {
  queryPositionSchema,
  createPositionSchema,
  updatePositionSchema,
} from './position.validation';

export class PositionController {
  public constructor(private readonly service = new PositionService()) {}

  public getPositions = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const filters = getValidatedInput<z.infer<typeof queryPositionSchema>>(response)
        .query as unknown as PositionQueryFilters;
      const page = Number(filters.page ?? 1);
      const limit = Number(filters.limit ?? 20);

      const result = await this.service.getPositions(filters, request.user!);

      sendPaginated(
        response,
        result.data,
        {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit),
        },
        'Positions retrieved successfully',
      );
    } catch (error) {
      next(error);
    }
  };

  public getPositionById = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(request.params.id);
      const position = await this.service.getPositionById(id, request.user!);
      sendSuccess(response, position, 'Position retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public createPosition = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = getValidatedInput<z.infer<typeof createPositionSchema>>(response)
        .body as CreatePositionDto;
      const position = await this.service.createPosition(dto, request.user!);
      sendSuccess(response, position, 'Position created successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  public updatePosition = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(request.params.id);
      const dto = getValidatedInput<z.infer<typeof updatePositionSchema>>(response)
        .body as UpdatePositionDto;
      const position = await this.service.updatePosition(id, dto, request.user!);
      sendSuccess(response, position, 'Position updated successfully');
    } catch (error) {
      next(error);
    }
  };

  public deletePosition = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(request.params.id);
      await this.service.deletePosition(id, request.user!);
      sendSuccess(response, null, 'Position deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}
