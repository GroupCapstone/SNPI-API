import type { z } from 'zod';
import type { NextFunction, Response } from 'express';

import { getValidatedInput } from '../../middleware/validate';
import { sendPaginated, sendSuccess } from '../../shared/http/api-response';
import type { AuthenticatedRequest } from '../../types/auth';
import { ClassService } from './class.service';
import type { ClassQueryFilters, CreateClassDto, UpdateClassDto } from './class.types';

import type {
  queryClassSchema,
  queryClassSummarySchema,
  createClassSchema,
  updateClassSchema,
} from './class.validation';

export class ClassController {
  public constructor(private readonly service = new ClassService()) {}

  public getClassSummary = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const filters = getValidatedInput<z.infer<typeof queryClassSummarySchema>>(response)
        .query as unknown as ClassQueryFilters;
      const summary = await this.service.getClassSummary(filters, request.user!);
      sendSuccess(response, summary, 'Class availability summary retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public getClasses = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const filters = getValidatedInput<z.infer<typeof queryClassSchema>>(response)
        .query as unknown as ClassQueryFilters;
      const page = Number(filters.page ?? 1);
      const limit = Number(filters.limit ?? 20);

      const result = await this.service.getClasses(filters, request.user!);

      sendPaginated(
        response,
        result.data,
        {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit),
        },
        'Classes retrieved successfully',
      );
    } catch (error) {
      next(error);
    }
  };

  public getClassById = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(request.params.id);
      const classEntity = await this.service.getClassById(id, request.user!);
      sendSuccess(response, classEntity, 'Class retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public createClass = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = getValidatedInput<z.infer<typeof createClassSchema>>(response)
        .body as CreateClassDto;
      const classEntity = await this.service.createClass(dto, request.user!);
      sendSuccess(response, classEntity, 'Class created successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  public updateClass = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(request.params.id);
      const dto = getValidatedInput<z.infer<typeof updateClassSchema>>(response)
        .body as UpdateClassDto;
      const classEntity = await this.service.updateClass(id, dto, request.user!);
      sendSuccess(response, classEntity, 'Class updated successfully');
    } catch (error) {
      next(error);
    }
  };

  public deleteClass = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(request.params.id);
      await this.service.deleteClass(id, request.user!);
      sendSuccess(response, null, 'Class deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}
