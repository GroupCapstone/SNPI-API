import type { NextFunction, Response } from 'express';
import type { z } from 'zod';

import { getValidatedInput } from '../../middleware/validate';
import { sendSuccess } from '../../shared/http/api-response';
import type { AuthenticatedRequest, AuthUser } from '../../types/auth';
import { DashboardService } from './dashboard.service';
import type {
  academicHonorRollQuerySchema,
  dashboardActionItemsQuerySchema,
  dashboardPulseQuerySchema,
} from './dashboard.validation';

export class DashboardController {
  public constructor(private readonly service = new DashboardService()) {}

  public getActionItems = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const user = req.user as AuthUser;
      const validated = getValidatedInput<z.infer<typeof dashboardActionItemsQuerySchema>>(res);
      const filters = validated.query;

      const result = await this.service.getActionItems(user, filters);
      sendSuccess(res, result, 'Dashboard action items retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public getFinancePulse = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const user = req.user as AuthUser;
      const validated = getValidatedInput<z.infer<typeof dashboardPulseQuerySchema>>(res);
      const filters = validated.query;

      const result = await this.service.getFinancePulse(user, filters);
      sendSuccess(res, result, 'Finance pulse retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public getStudentAffairsPulse = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const user = req.user as AuthUser;
      const validated = getValidatedInput<z.infer<typeof dashboardPulseQuerySchema>>(res);
      const filters = validated.query;

      const result = await this.service.getStudentAffairsPulse(user, filters);
      sendSuccess(res, result, 'Student affairs pulse retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public getHrPulse = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const user = req.user as AuthUser;
      const validated = getValidatedInput<z.infer<typeof dashboardPulseQuerySchema>>(res);
      const filters = validated.query;

      const result = await this.service.getHrPulse(user, filters);
      sendSuccess(res, result, 'HR pulse retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public getAcademicHonorRoll = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const user = req.user as AuthUser;
      const validated = getValidatedInput<z.infer<typeof academicHonorRollQuerySchema>>(res);
      const filters = validated.query;

      const result = await this.service.getAcademicHonorRoll(user, filters);
      sendSuccess(res, result, 'Academic honor roll retrieved successfully');
    } catch (error) {
      next(error);
    }
  };
}
