import type { z } from 'zod';
import type { NextFunction, Response } from 'express';

import { getValidatedInput } from '../../middleware/validate';
import { sendPaginated, sendSuccess } from '../../shared/http/api-response';
import type { AuthenticatedRequest } from '../../types/auth';
import { SchoolService } from './school.service';
import type { CreateSchoolDto, SchoolQueryFilters, UpdateSchoolDto } from './school.types';

import type { querySchoolSchema, updateSchoolSchema } from './school.validation';

export class SchoolController {
  public constructor(private readonly service = new SchoolService()) {}

  public getSchools = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const filters = getValidatedInput<z.infer<typeof querySchoolSchema>>(response)
        .query as unknown as SchoolQueryFilters;
      const page = Number(filters.page ?? 1);
      const limit = Number(filters.limit ?? 20);

      const result = await this.service.getSchools(filters);

      sendPaginated(
        response,
        result.data,
        {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit),
        },
        'Schools retrieved successfully',
      );
    } catch (error) {
      next(error);
    }
  };

  public getSchoolById = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(request.params.id);
      const school = await this.service.getSchoolById(id);
      sendSuccess(response, school, 'School retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public createSchool = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = getValidatedInput<{ body: CreateSchoolDto }>(response).body;
      const school = await this.service.createSchool(dto, request.user!);
      sendSuccess(response, school, 'School created successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  public updateSchool = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(request.params.id);
      const dto = getValidatedInput<z.infer<typeof updateSchoolSchema>>(response)
        .body as UpdateSchoolDto;
      const school = await this.service.updateSchool(id, dto, request.user!);
      sendSuccess(response, school, 'School updated successfully');
    } catch (error) {
      next(error);
    }
  };

  public deleteSchool = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(request.params.id);
      await this.service.deleteSchool(id, request.user!);
      sendSuccess(response, null, 'School deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}
