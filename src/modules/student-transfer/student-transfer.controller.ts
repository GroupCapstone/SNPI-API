import type { z } from 'zod';
import type { NextFunction, Response } from 'express';

import { getValidatedInput } from '../../middleware/validate';
import { sendPaginated, sendSuccess } from '../../shared/http/api-response';
import type { AuthenticatedRequest } from '../../types/auth';
import { StudentTransferService } from './student-transfer.service';
import type {
  CreateStudentTransferDTO,
  ProcessTransferDTO,
  StudentTransferQueryFilters,
} from './student-transfer.types';

import type {
  studentTransferQueryValidationSchema,
  createStudentTransferValidationSchema,
  processTransferValidationSchema,
} from './student-transfer.validation';

export class StudentTransferController {
  public constructor(private readonly service = new StudentTransferService()) {}

  public getTransfers = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const filters = getValidatedInput<z.infer<typeof studentTransferQueryValidationSchema>>(
        response,
      ).query as unknown as StudentTransferQueryFilters;
      const page = Number(filters.page ?? 1);
      const limit = Number(filters.limit ?? 20);

      const result = await this.service.getTransfers(filters, request.user!);

      sendPaginated(
        response,
        result.data,
        {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit) || 1,
        },
        'Student transfers retrieved successfully',
      );
    } catch (error) {
      next(error);
    }
  };

  public getTransferById = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = request.params.id as string;
      const transfer = await this.service.getTransferById(id, request.user!);
      sendSuccess(response, transfer, 'Student transfer retrieved successfully', 200);
    } catch (error) {
      next(error);
    }
  };

  public createTransfer = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = getValidatedInput<z.infer<typeof createStudentTransferValidationSchema>>(response)
        .body as CreateStudentTransferDTO;
      const transfer = await this.service.createTransfer(dto, request.user!);
      sendSuccess(response, transfer, 'Student transfer request initiated successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  public processTransfer = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = request.params.id as string;
      const dto = getValidatedInput<z.infer<typeof processTransferValidationSchema>>(response)
        .body as ProcessTransferDTO;
      const transfer = await this.service.processTransfer(id, dto, request.user!);
      sendSuccess(response, transfer, 'Student transfer status updated successfully', 200);
    } catch (error) {
      next(error);
    }
  };
}
