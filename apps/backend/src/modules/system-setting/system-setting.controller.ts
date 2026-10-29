import type { z } from 'zod';
import type { NextFunction, Response } from 'express';

import { getValidatedInput } from '../../middleware/validate';
import { sendPaginated, sendSuccess } from '../../shared/http/api-response';
import type { AuthenticatedRequest } from '../../types/auth';
import { SystemSettingService } from './system-setting.service';
import type {
  CreateSystemSettingDTO,
  SystemSettingQueryFilters,
  UpdateSystemSettingDTO,
} from './system-setting.types';

import type {
  querySystemSettingValidationSchema,
  updateSystemSettingValidationSchema,
} from './system-setting.validation';

export class SystemSettingController {
  public constructor(private readonly service = new SystemSettingService()) {}

  public getSettings = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const filters = getValidatedInput<z.infer<typeof querySystemSettingValidationSchema>>(res)
        .query as unknown as SystemSettingQueryFilters;
      const result = await this.service.getSettings(filters, req.user!);
      sendPaginated(
        res,
        result.data,
        {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages,
        },
        'System settings retrieved successfully',
      );
    } catch (error) {
      next(error);
    }
  };

  public getSettingById = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(req.params.id);
      const result = await this.service.getSettingById(id, req.user!);
      sendSuccess(res, result, 'System setting retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public createSetting = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = getValidatedInput<{ body: CreateSystemSettingDTO }>(res).body;
      const result = await this.service.createSetting(dto, req.user!);
      sendSuccess(res, result, 'System setting created successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  public updateSetting = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(req.params.id);
      const dto = getValidatedInput<z.infer<typeof updateSystemSettingValidationSchema>>(res)
        .body as UpdateSystemSettingDTO;
      const result = await this.service.updateSetting(id, dto, req.user!);
      sendSuccess(res, result, 'System setting updated successfully');
    } catch (error) {
      next(error);
    }
  };

  public deleteSetting = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(req.params.id);
      await this.service.deleteSetting(id, req.user!);
      sendSuccess(res, null, 'System setting deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}
