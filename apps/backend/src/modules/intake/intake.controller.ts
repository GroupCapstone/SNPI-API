import type { z } from 'zod';
import type { NextFunction, Response } from 'express';

import { getValidatedInput } from '../../middleware/validate';
import { sendPaginated, sendSuccess } from '../../shared/http/api-response';
import type { AuthenticatedRequest } from '../../types/auth';
import { IntakeService } from './intake.service';
import type { CreateIntakeDto, IntakeQueryFilters, UpdateIntakeDto } from './intake.types';

import type {
  queryIntakeValidationSchema,
  createIntakeValidationSchema,
  updateIntakeValidationSchema,
} from './intake.validation';

export class IntakeController {
  public constructor(private readonly service = new IntakeService()) {}

  public getIntakes = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const filters = getValidatedInput<z.infer<typeof queryIntakeValidationSchema>>(res)
        .query as unknown as IntakeQueryFilters;
      const result = await this.service.getIntakes(filters);
      sendPaginated(
        res,
        result.data,
        {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages,
        },
        'Offerings retrieved successfully',
      );
    } catch (error) {
      next(error);
    }
  };

  public getIntakeById = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(req.params.id);
      const intake = await this.service.getIntakeById(id);
      sendSuccess(res, intake, 'Offering retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public createIntake = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = getValidatedInput<z.infer<typeof createIntakeValidationSchema>>(res)
        .body as CreateIntakeDto;
      const intake = await this.service.createIntake(dto, req.user!);
      sendSuccess(res, intake, 'Offering created successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  public updateIntake = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(req.params.id);
      const dto = getValidatedInput<z.infer<typeof updateIntakeValidationSchema>>(res)
        .body as UpdateIntakeDto;
      const intake = await this.service.updateIntake(id, dto, req.user!);
      sendSuccess(res, intake, 'Offering updated successfully');
    } catch (error) {
      next(error);
    }
  };

  public deleteIntake = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(req.params.id);
      await this.service.deleteIntake(id, req.user!);
      sendSuccess(res, null, 'Offering deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}
