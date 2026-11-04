import type { NextFunction, Response } from 'express';

import { sendPaginated, sendSuccess } from '../../shared/http/api-response';
import type { AuthenticatedRequest } from '../../types/auth';
import { StudyModeService } from './study-mode.service';
import {
  createStudyModeSchema,
  queryStudyModeSchema,
  updateStudyModeSchema,
} from './study-mode.validation';

export class StudyModeController {
  public constructor(private readonly service = new StudyModeService()) {}

  public getStudyModes = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const filters = queryStudyModeSchema.parse(req.query);
      const result = await this.service.getStudyModes(filters, req.user!);
      const page = filters.page ?? 1;
      const limit = filters.limit ?? 20;

      sendPaginated(
        res,
        result.data,
        {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit),
        },
        'Study modes retrieved successfully',
      );
    } catch (error) {
      next(error);
    }
  };

  public getStudyModeById = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const studyMode = await this.service.getStudyModeById(id, req.user!);
      sendSuccess(res, studyMode, 'Study mode retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public createStudyMode = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = createStudyModeSchema.parse(req.body);
      const studyMode = await this.service.createStudyMode(dto, req.user!);
      sendSuccess(res, studyMode, 'Study mode created successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  public updateStudyMode = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const dto = updateStudyModeSchema.parse(req.body);
      const studyMode = await this.service.updateStudyMode(id, dto, req.user!);
      sendSuccess(res, studyMode, 'Study mode updated successfully');
    } catch (error) {
      next(error);
    }
  };

  public deleteStudyMode = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      await this.service.deleteStudyMode(id, req.user!);
      sendSuccess(res, null, 'Study mode deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}
