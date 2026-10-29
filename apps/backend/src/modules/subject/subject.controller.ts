import type { z } from 'zod';
import type { NextFunction, Response } from 'express';

import { getValidatedInput } from '../../middleware/validate';
import { sendPaginated, sendSuccess } from '../../shared/http/api-response';
import type { AuthenticatedRequest } from '../../types/auth';
import { SubjectService } from './subject.service';
import type { CreateSubjectDto, SubjectQueryFilters, UpdateSubjectDto } from './subject.types';

import type {
  querySubjectSchema,
  createSubjectSchema,
  updateSubjectSchema,
} from './subject.validation';

export class SubjectController {
  public constructor(private readonly service = new SubjectService()) {}

  public getSubjects = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const filters = getValidatedInput<z.infer<typeof querySubjectSchema>>(response)
        .query as unknown as SubjectQueryFilters;
      const page = Number(filters.page ?? 1);
      const limit = Number(filters.limit ?? 20);

      const result = await this.service.getSubjects(filters, request.user!);

      sendPaginated(
        response,
        result.data,
        {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit),
        },
        'Subjects retrieved successfully',
      );
    } catch (error) {
      next(error);
    }
  };

  public getSubjectById = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(request.params.id);
      const subject = await this.service.getSubjectById(id, request.user!);
      sendSuccess(response, subject, 'Subject retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public createSubject = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = getValidatedInput<z.infer<typeof createSubjectSchema>>(response)
        .body as CreateSubjectDto;
      const subject = await this.service.createSubject(dto, request.user!);
      sendSuccess(response, subject, 'Subject created successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  public updateSubject = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(request.params.id);
      const dto = getValidatedInput<z.infer<typeof updateSubjectSchema>>(response)
        .body as UpdateSubjectDto;
      const subject = await this.service.updateSubject(id, dto, request.user!);
      sendSuccess(response, subject, 'Subject updated successfully');
    } catch (error) {
      next(error);
    }
  };

  public deleteSubject = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(request.params.id);
      await this.service.deleteSubject(id, request.user!);
      sendSuccess(response, null, 'Subject deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}
