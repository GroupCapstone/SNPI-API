import type { z } from 'zod';
import type { NextFunction, Response } from 'express';

import { getValidatedInput } from '../../middleware/validate';
import { sendPaginated, sendSuccess } from '../../shared/http/api-response';
import type { AuthenticatedRequest } from '../../types/auth';
import { AcademicPeriodService } from './academic-period.service';
import type {
  AcademicPeriodQueryFilters,
  CreateAcademicPeriodDto,
  GenerateMonthlyPeriodsDto,
  UpdateAcademicPeriodDto,
  AcademicPeriodTransitionDto,
} from './academic-period.types';

import type {
  queryAcademicPeriodValidationSchema,
  createAcademicPeriodValidationSchema,
  generateMonthlyPeriodsValidationSchema,
  updateAcademicPeriodValidationSchema,
  transitionAcademicPeriodValidationSchema,
} from './academic-period.validation';

export class AcademicPeriodController {
  public constructor(private readonly service = new AcademicPeriodService()) {}

  public getAcademicPeriods = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const filters = getValidatedInput<z.infer<typeof queryAcademicPeriodValidationSchema>>(res)
        .query as unknown as AcademicPeriodQueryFilters;
      const result = await this.service.getAcademicPeriods(filters, req.user!);
      sendPaginated(
        res,
        result.data,
        {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages,
        },
        'Academic periods retrieved successfully',
      );
    } catch (error) {
      next(error);
    }
  };

  public getAcademicPeriodById = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(req.params.id);
      const period = await this.service.getAcademicPeriodById(id, req.user!);
      sendSuccess(res, period, 'Academic period retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public createAcademicPeriod = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = getValidatedInput<z.infer<typeof createAcademicPeriodValidationSchema>>(res)
        .body as CreateAcademicPeriodDto;
      const period = await this.service.createAcademicPeriod(dto, req.user!);
      sendSuccess(res, period, 'Academic period created successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  public updateAcademicPeriod = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(req.params.id);
      const dto = getValidatedInput<z.infer<typeof updateAcademicPeriodValidationSchema>>(res)
        .body as UpdateAcademicPeriodDto;
      const period = await this.service.updateAcademicPeriod(id, dto, req.user!);
      sendSuccess(res, period, 'Academic period updated successfully');
    } catch (error) {
      next(error);
    }
  };

  public deleteAcademicPeriod = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(req.params.id);
      await this.service.deleteAcademicPeriod(id, req.user!);
      sendSuccess(res, null, 'Academic period deleted successfully');
    } catch (error) {
      next(error);
    }
  };

  public getClosingChecklist = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const checklist = await this.service.getClosingChecklist(
        String(req.params.id),
        undefined,
        req.user!,
      );
      sendSuccess(res, checklist, 'Academic period closing checklist retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public transitionAcademicPeriod = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const period = await this.service.transitionAcademicPeriod(
        String(req.params.id),
        getValidatedInput<z.infer<typeof transitionAcademicPeriodValidationSchema>>(res)
          .body as AcademicPeriodTransitionDto,
        req.user!,
      );
      sendSuccess(res, period, 'Academic period lifecycle transitioned successfully');
    } catch (error) {
      next(error);
    }
  };

  public generateMonthlyPeriods = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = getValidatedInput<z.infer<typeof generateMonthlyPeriodsValidationSchema>>(res)
        .body as GenerateMonthlyPeriodsDto;
      const result = await this.service.generateMonthlyPeriods(dto, req.user!);
      sendSuccess(res, result, 'Monthly academic periods generated successfully', 201);
    } catch (error) {
      next(error);
    }
  };
}
