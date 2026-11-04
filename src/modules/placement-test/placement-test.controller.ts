import type { z } from 'zod';
import type { NextFunction, Response } from 'express';

import { getValidatedInput } from '../../middleware/validate';
import { sendPaginated, sendSuccess } from '../../shared/http/api-response';
import type { AuthenticatedRequest } from '../../types/auth';
import { PlacementTestService } from './placement-test.service';
import type {
  CreatePlacementTestDTO,
  PlacementTestQueryFilters,
  UpdatePlacementTestDTO,
} from './placement-test.types';

import type {
  placementTestQueryValidationSchema,
  createPlacementTestValidationSchema,
  updatePlacementTestValidationSchema,
} from './placement-test.validation';

export class PlacementTestController {
  public constructor(private readonly service = new PlacementTestService()) {}

  public getPlacementTests = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const filters = getValidatedInput<z.infer<typeof placementTestQueryValidationSchema>>(
        response,
      ).query as unknown as PlacementTestQueryFilters;
      const page = Number(filters.page ?? 1);
      const limit = Number(filters.limit ?? 20);

      const result = await this.service.getPlacementTests(filters, request.user!);

      sendPaginated(
        response,
        result.data,
        {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit) || 1,
        },
        'Placement tests retrieved successfully',
      );
    } catch (error) {
      next(error);
    }
  };

  public getPlacementTestById = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = request.params.id as string;
      const test = await this.service.getPlacementTestById(id, request.user!);
      sendSuccess(response, test, 'Placement test retrieved successfully', 200);
    } catch (error) {
      next(error);
    }
  };

  public createPlacementTest = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = getValidatedInput<z.infer<typeof createPlacementTestValidationSchema>>(response)
        .body as CreatePlacementTestDTO;
      const test = await this.service.createPlacementTest(dto, request.user!);
      sendSuccess(response, test, 'Placement test recorded successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  public updatePlacementTest = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = request.params.id as string;
      const dto = getValidatedInput<z.infer<typeof updatePlacementTestValidationSchema>>(response)
        .body as UpdatePlacementTestDTO;
      const test = await this.service.updatePlacementTest(id, dto, request.user!);
      sendSuccess(response, test, 'Placement test updated successfully', 200);
    } catch (error) {
      next(error);
    }
  };

  public deletePlacementTest = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = request.params.id as string;
      await this.service.deletePlacementTest(id, request.user!);
      sendSuccess(response, null, 'Placement test deleted successfully', 200);
    } catch (error) {
      next(error);
    }
  };
}
