import type { z } from 'zod';
import type { NextFunction, Response } from 'express';

import { getValidatedInput } from '../../middleware/validate';
import { sendPaginated, sendSuccess } from '../../shared/http/api-response';
import type { AuthenticatedRequest } from '../../types/auth';
import { DepartmentService } from './department.service';
import type {
  CreateDepartmentDto,
  DepartmentQueryFilters,
  UpdateDepartmentDto,
} from './department.types';

import type {
  queryDepartmentSchema,
  createDepartmentSchema,
  updateDepartmentSchema,
} from './department.validation';

export class DepartmentController {
  public constructor(private readonly service = new DepartmentService()) {}

  public getDepartments = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const filters = getValidatedInput<z.infer<typeof queryDepartmentSchema>>(response)
        .query as unknown as DepartmentQueryFilters;
      const page = Number(filters.page ?? 1);
      const limit = Number(filters.limit ?? 20);

      const result = await this.service.getDepartments(filters, request.user!);

      sendPaginated(
        response,
        result.data,
        {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit),
        },
        'Departments retrieved successfully',
      );
    } catch (error) {
      next(error);
    }
  };

  public getDepartmentById = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(request.params.id);
      const department = await this.service.getDepartmentById(id, request.user!);
      sendSuccess(response, department, 'Department retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public createDepartment = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = getValidatedInput<z.infer<typeof createDepartmentSchema>>(response)
        .body as CreateDepartmentDto;
      const department = await this.service.createDepartment(dto, request.user!);
      sendSuccess(response, department, 'Department created successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  public updateDepartment = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(request.params.id);
      const dto = getValidatedInput<z.infer<typeof updateDepartmentSchema>>(response)
        .body as UpdateDepartmentDto;
      const department = await this.service.updateDepartment(id, dto, request.user!);
      sendSuccess(response, department, 'Department updated successfully');
    } catch (error) {
      next(error);
    }
  };

  public deleteDepartment = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(request.params.id);
      await this.service.deleteDepartment(id, request.user!);
      sendSuccess(response, null, 'Department deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}
