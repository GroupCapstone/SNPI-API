import type { z } from 'zod';
import type { NextFunction, Response } from 'express';

import { getValidatedInput } from '../../middleware/validate';
import { sendPaginated, sendSuccess } from '../../shared/http/api-response';
import type { AuthenticatedRequest } from '../../types/auth';
import { BranchService } from './branch.service';
import type { BranchQueryFilters, CreateBranchDto, UpdateBranchDto } from './branch.types';

import type {
  queryBranchSchema,
  createBranchSchema,
  updateBranchSchema,
} from './branch.validation';

export class BranchController {
  public constructor(private readonly service = new BranchService()) {}

  public getBranches = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const filters = getValidatedInput<z.infer<typeof queryBranchSchema>>(response)
        .query as unknown as BranchQueryFilters;
      const page = Number(filters.page ?? 1);
      const limit = Number(filters.limit ?? 20);

      const result = await this.service.getBranches(filters, request.user!);

      sendPaginated(
        response,
        result.data,
        {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit),
        },
        'Branches retrieved successfully',
      );
    } catch (error) {
      next(error);
    }
  };

  public getBranchById = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(request.params.id);
      const branch = await this.service.getBranchById(id, request.user!);
      sendSuccess(response, branch, 'Branch retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public createBranch = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = getValidatedInput<z.infer<typeof createBranchSchema>>(response)
        .body as CreateBranchDto;
      const branch = await this.service.createBranch(dto, request.user!);
      sendSuccess(response, branch, 'Branch created successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  public updateBranch = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(request.params.id);
      const dto = getValidatedInput<z.infer<typeof updateBranchSchema>>(response)
        .body as UpdateBranchDto;
      const branch = await this.service.updateBranch(id, dto, request.user!);
      sendSuccess(response, branch, 'Branch updated successfully');
    } catch (error) {
      next(error);
    }
  };

  public deleteBranch = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(request.params.id);
      await this.service.deleteBranch(id, request.user!);
      sendSuccess(response, null, 'Branch deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}
