import type { z } from 'zod';
import type { NextFunction, Response } from 'express';

import { getValidatedInput } from '../../middleware/validate';
import { sendPaginated, sendSuccess } from '../../shared/http/api-response';
import type { AuthenticatedRequest } from '../../types/auth';
import { TuitionService } from './tuition.service';
import type {
  CreateTuitionFeeDto,
  TuitionFeeQueryFilters,
  UpdateTuitionFeeDto,
} from './tuition.types';

import type {
  queryTuitionFeeSchema,
  createTuitionFeeSchema,
  updateTuitionFeeSchema,
} from './tuition.validation';

export class TuitionController {
  public constructor(private readonly service = new TuitionService()) {}

  public getTuitionFees = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const filters = getValidatedInput<z.infer<typeof queryTuitionFeeSchema>>(response)
        .query as unknown as TuitionFeeQueryFilters;
      const page = Number(filters.page ?? 1);
      const limit = Number(filters.limit ?? 20);

      const result = await this.service.getTuitionFees(filters, request.user!);

      sendPaginated(
        response,
        result.data,
        {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit),
        },
        'Tuition fee structures retrieved successfully',
      );
    } catch (error) {
      next(error);
    }
  };

  public getTuitionFeeById = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(request.params.id);
      const fee = await this.service.getTuitionFeeById(id, request.user!);
      sendSuccess(response, fee, 'Tuition fee retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public createTuitionFee = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = getValidatedInput<z.infer<typeof createTuitionFeeSchema>>(response)
        .body as CreateTuitionFeeDto;
      const fee = await this.service.createTuitionFee(dto, request.user!);
      sendSuccess(response, fee, 'Tuition fee structure created successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  public updateTuitionFee = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(request.params.id);
      const dto = getValidatedInput<z.infer<typeof updateTuitionFeeSchema>>(response)
        .body as UpdateTuitionFeeDto;
      const fee = await this.service.updateTuitionFee(id, dto, request.user!);
      sendSuccess(response, fee, 'Tuition fee structure updated successfully');
    } catch (error) {
      next(error);
    }
  };

  public deleteTuitionFee = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(request.params.id);
      await this.service.deleteTuitionFee(id, request.user!);
      sendSuccess(response, null, 'Tuition fee structure deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}
