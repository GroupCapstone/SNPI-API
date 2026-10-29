import type { z } from 'zod';
import type { NextFunction, Response } from 'express';

import { getValidatedInput } from '../../middleware/validate';
import { sendPaginated, sendSuccess } from '../../shared/http/api-response';
import type { AuthenticatedRequest } from '../../types/auth';
import { EmployeeService } from './employee.service';
import type { CreateEmployeeDto, EmployeeQueryFilters, UpdateEmployeeDto } from './employee.types';

import type {
  queryEmployeeSchema,
  createEmployeeSchema,
  updateEmployeeSchema,
} from './employee.validation';

export class EmployeeController {
  public constructor(private readonly service = new EmployeeService()) {}

  public getEmployees = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const filters = getValidatedInput<z.infer<typeof queryEmployeeSchema>>(response)
        .query as unknown as EmployeeQueryFilters;
      const page = Number(filters.page ?? 1);
      const limit = Number(filters.limit ?? 20);

      const result = await this.service.getEmployees(filters, request.user!);

      sendPaginated(
        response,
        result.data,
        {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit),
        },
        'Employees retrieved successfully',
      );
    } catch (error) {
      next(error);
    }
  };

  public getEmployeeById = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = request.params.id as string;
      const user = request.user!;
      const employee = await this.service.getEmployeeById(id, user);
      sendSuccess(response, employee, 'Employee retrieved successfully', 200);
    } catch (error) {
      next(error);
    }
  };

  public createEmployee = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = getValidatedInput<z.infer<typeof createEmployeeSchema>>(response)
        .body as CreateEmployeeDto;
      const user = request.user!;
      const employee = await this.service.createEmployee(dto, user);
      sendSuccess(response, employee, 'Employee created successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  public updateEmployee = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = request.params.id as string;
      const dto = getValidatedInput<z.infer<typeof updateEmployeeSchema>>(response)
        .body as UpdateEmployeeDto;
      const user = request.user!;
      const employee = await this.service.updateEmployee(id, dto, user);
      sendSuccess(response, employee, 'Employee updated successfully', 200);
    } catch (error) {
      next(error);
    }
  };

  public deleteEmployee = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = request.params.id as string;
      const user = request.user!;
      await this.service.deleteEmployee(id, user);
      sendSuccess(response, null, 'Employee deleted successfully', 200);
    } catch (error) {
      next(error);
    }
  };
}
