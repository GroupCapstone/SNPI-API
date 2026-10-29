import type { z } from 'zod';
import type { NextFunction, Response } from 'express';

import { getValidatedInput } from '../../middleware/validate';
import { sendPaginated, sendSuccess } from '../../shared/http/api-response';
import type { AuthenticatedRequest } from '../../types/auth';
import { ProgramService } from './program.service';
import type { CreateProgramDto, ProgramQueryFilters, UpdateProgramDto } from './program.types';

import type {
  queryProgramSchema,
  createProgramSchema,
  updateProgramSchema,
} from './program.validation';

export class ProgramController {
  public constructor(private readonly service = new ProgramService()) {}

  public getPrograms = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const filters = getValidatedInput<z.infer<typeof queryProgramSchema>>(response)
        .query as unknown as ProgramQueryFilters;
      const page = Number(filters.page ?? 1);
      const limit = Number(filters.limit ?? 20);

      const result = await this.service.getPrograms(filters, request.user!);

      sendPaginated(
        response,
        result.data,
        {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit),
        },
        'Programs retrieved successfully',
      );
    } catch (error) {
      next(error);
    }
  };

  public getProgramById = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(request.params.id);
      const program = await this.service.getProgramById(id, request.user!);
      sendSuccess(response, program, 'Program retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public createProgram = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = getValidatedInput<z.infer<typeof createProgramSchema>>(response)
        .body as CreateProgramDto;
      const program = await this.service.createProgram(dto, request.user!);
      sendSuccess(response, program, 'Program created successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  public updateProgram = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(request.params.id);
      const dto = getValidatedInput<z.infer<typeof updateProgramSchema>>(response)
        .body as UpdateProgramDto;
      const program = await this.service.updateProgram(id, dto, request.user!);
      sendSuccess(response, program, 'Program updated successfully');
    } catch (error) {
      next(error);
    }
  };

  public deleteProgram = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(request.params.id);
      await this.service.deleteProgram(id, request.user!);
      sendSuccess(response, null, 'Program deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}
