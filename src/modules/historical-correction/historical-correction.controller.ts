import type { z } from 'zod';
import type { NextFunction, Response } from 'express';

import { getValidatedInput } from '../../middleware/validate';
import { sendPaginated, sendSuccess } from '../../shared/http/api-response';
import type { AuthenticatedRequest, AuthUser } from '../../types/auth';
import { HistoricalCorrectionService } from './historical-correction.service';

import type {
  queryHistoricalCorrectionsSchema,
  requestCorrectionSchema,
  reviewCorrectionSchema,
  applyCorrectionSchema,
} from './historical-correction.validation';

export class HistoricalCorrectionController {
  public constructor(private readonly service = new HistoricalCorrectionService()) {}

  public getCorrections = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const user = req.user as AuthUser;
      const result = await this.service.getCorrections(
        getValidatedInput<z.infer<typeof queryHistoricalCorrectionsSchema>>(res).query as never,
        user,
      );
      sendPaginated(
        res,
        result.data,
        result.pagination,
        'Historical corrections retrieved successfully',
      );
    } catch (error) {
      next(error);
    }
  };

  public getCorrectionById = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const user = req.user as AuthUser;
      const correction = await this.service.getCorrectionById(String(req.params.id), user);
      sendSuccess(res, correction, 'Historical correction retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public requestCorrection = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const user = req.user as AuthUser;
      const created = await this.service.requestCorrection(
        getValidatedInput<z.infer<typeof requestCorrectionSchema>>(res).body,
        user,
      );
      sendSuccess(res, created, 'Historical correction requested successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  public reviewCorrection = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const user = req.user as AuthUser;
      const reviewed = await this.service.reviewCorrection(
        String(req.params.id),
        getValidatedInput<z.infer<typeof reviewCorrectionSchema>>(res).body,
        user,
      );
      sendSuccess(res, reviewed, 'Historical correction reviewed successfully');
    } catch (error) {
      next(error);
    }
  };

  public applyCorrection = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const user = req.user as AuthUser;
      const applied = await this.service.applyCorrection(
        String(req.params.id),
        getValidatedInput<z.infer<typeof applyCorrectionSchema>>(res).body,
        user,
      );
      sendSuccess(res, applied, 'Historical correction applied successfully');
    } catch (error) {
      next(error);
    }
  };
}
