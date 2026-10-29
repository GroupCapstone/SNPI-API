import type { z } from 'zod';
import type { NextFunction, Response } from 'express';

import { getValidatedInput } from '../../middleware/validate';
import { sendPaginated, sendSuccess } from '../../shared/http/api-response';
import type { AuthenticatedRequest } from '../../types/auth';
import { StudentService } from './student.service';
import type {
  ConfirmImportPayload,
  CreateStudentDTO,
  DuplicateCheckCriteria,
  RawImportStudentRow,
  StudentQueryFilters,
  UpdateStudentDTO,
} from './student.types';

import type {
  studentQueryValidationSchema,
  createStudentValidationSchema,
  updateStudentValidationSchema,
  checkDuplicatesValidationSchema,
  previewImportValidationSchema,
  confirmImportValidationSchema,
} from './student.validation';

export class StudentController {
  public constructor(private readonly service = new StudentService()) {}

  public getStudents = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const filters = getValidatedInput<z.infer<typeof studentQueryValidationSchema>>(response)
        .query as unknown as StudentQueryFilters;
      const page = Number(filters.page ?? 1);
      const limit = Number(filters.limit ?? 20);

      const result = await this.service.getStudents(filters, request.user!);

      sendPaginated(
        response,
        result.data,
        {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit) || 1,
        },
        'Students retrieved successfully',
      );
    } catch (error) {
      next(error);
    }
  };

  public getStudentById = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = request.params.id as string;
      const student = await this.service.getStudentById(id, request.user!);
      sendSuccess(response, student, 'Student retrieved successfully', 200);
    } catch (error) {
      next(error);
    }
  };

  public createStudent = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = getValidatedInput<z.infer<typeof createStudentValidationSchema>>(response)
        .body as CreateStudentDTO;
      const student = await this.service.createStudent(dto, request.user!);
      sendSuccess(response, student, 'Student admitted and created successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  public updateStudent = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = request.params.id as string;
      const dto = getValidatedInput<z.infer<typeof updateStudentValidationSchema>>(response)
        .body as UpdateStudentDTO;
      const student = await this.service.updateStudent(id, dto, request.user!);
      sendSuccess(response, student, 'Student profile updated successfully', 200);
    } catch (error) {
      next(error);
    }
  };

  public deleteStudent = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = request.params.id as string;
      await this.service.deleteStudent(id, request.user!);
      sendSuccess(response, null, 'Student record deleted successfully', 200);
    } catch (error) {
      next(error);
    }
  };

  public checkDuplicates = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const criteria = getValidatedInput<z.infer<typeof checkDuplicatesValidationSchema>>(response)
        .body as DuplicateCheckCriteria;
      const result = await this.service.checkDuplicates(criteria, request.user!);
      sendSuccess(response, result, 'Duplicate check completed successfully', 200);
    } catch (error) {
      next(error);
    }
  };

  public previewImport = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const payload = getValidatedInput<z.infer<typeof previewImportValidationSchema>>(response)
        .body as {
        schoolId: string;
        branchId: string;
        rows: RawImportStudentRow[];
      };
      const result = await this.service.previewImport(payload, request.user!);
      sendSuccess(response, result, 'Import preview generated successfully', 200);
    } catch (error) {
      next(error);
    }
  };

  public confirmImport = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const payload = getValidatedInput<z.infer<typeof confirmImportValidationSchema>>(response)
        .body as ConfirmImportPayload;
      const result = await this.service.confirmImport(payload, request.user!);
      sendSuccess(response, result, 'Student batch import completed successfully', 201);
    } catch (error) {
      next(error);
    }
  };
}
