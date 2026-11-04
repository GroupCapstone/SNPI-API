import type { z } from 'zod';
import type { NextFunction, Response } from 'express';

import { getValidatedInput } from '../../middleware/validate';
import { sendPaginated, sendSuccess } from '../../shared/http/api-response';
import type { AuthenticatedRequest } from '../../types/auth';
import { TeacherAssignmentService } from './teacher-assignment.service';
import type {
  CreateTeacherAssignmentDTO,
  TeacherAssignmentQueryFilters,
  TeacherRosterQueryFilters,
  UpdateTeacherAssignmentDTO,
} from './teacher-assignment.types';

import type {
  teacherAssignmentQueryValidationSchema,
  createTeacherAssignmentValidationSchema,
  updateTeacherAssignmentValidationSchema,
  teacherRosterQueryValidationSchema,
} from './teacher-assignment.validation';

export class TeacherAssignmentController {
  public constructor(private readonly service = new TeacherAssignmentService()) {}

  public getRosterMatrix = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const filters = getValidatedInput<z.infer<typeof teacherRosterQueryValidationSchema>>(
        response,
      ).query as unknown as TeacherRosterQueryFilters;

      const matrix = await this.service.getRosterMatrix(filters, request.user!);
      sendSuccess(response, matrix, 'Teacher roster matrix retrieved successfully', 200);
    } catch (error) {
      next(error);
    }
  };

  public getTeacherAssignments = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const filters = getValidatedInput<z.infer<typeof teacherAssignmentQueryValidationSchema>>(
        response,
      ).query as unknown as TeacherAssignmentQueryFilters;
      const page = Number(filters.page ?? 1);
      const limit = Number(filters.limit ?? 20);

      const result = await this.service.getTeacherAssignments(filters, request.user!);

      sendPaginated(
        response,
        result.data,
        {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit) || 1,
        },
        'Teacher assignments retrieved successfully',
      );
    } catch (error) {
      next(error);
    }
  };

  public getTeacherAssignmentById = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = request.params.id as string;
      const assignment = await this.service.getTeacherAssignmentById(id, request.user!);
      sendSuccess(response, assignment, 'Teacher assignment details retrieved successfully', 200);
    } catch (error) {
      next(error);
    }
  };

  public createTeacherAssignment = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = getValidatedInput<z.infer<typeof createTeacherAssignmentValidationSchema>>(
        response,
      ).body as CreateTeacherAssignmentDTO;
      const assignment = await this.service.createTeacherAssignment(dto, request.user!);
      sendSuccess(response, assignment, 'Teacher assignment created successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  public updateTeacherAssignment = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = request.params.id as string;
      const dto = getValidatedInput<z.infer<typeof updateTeacherAssignmentValidationSchema>>(
        response,
      ).body as UpdateTeacherAssignmentDTO;
      const assignment = await this.service.updateTeacherAssignment(id, dto, request.user!);
      sendSuccess(response, assignment, 'Teacher assignment updated successfully', 200);
    } catch (error) {
      next(error);
    }
  };

  public deleteTeacherAssignment = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = request.params.id as string;
      await this.service.deleteTeacherAssignment(id, request.user!);
      sendSuccess(response, null, 'Teacher assignment deleted successfully', 200);
    } catch (error) {
      next(error);
    }
  };
}
