import type { z } from 'zod';
import type { NextFunction, Response } from 'express';

import { getValidatedInput } from '../../middleware/validate';
import { sendPaginated, sendSuccess } from '../../shared/http/api-response';
import type { AuthenticatedRequest } from '../../types/auth';
import { TermResultService } from './term-result.service';
import type {
  CalculateClassTermResultsDto,
  CompleteTermDto,
  GenerateTermResultDto,
  TermResultQueryFilters,
  TransitionTermResultDto,
} from './term-result.types';

import type {
  queryTermResultValidationSchema,
  generateTermResultValidationSchema,
  calculateClassTermResultsValidationSchema,
  completeTermValidationSchema,
  transitionTermResultValidationSchema,
} from './term-result.validation';

export class TermResultController {
  public constructor(private readonly service = new TermResultService()) {}

  public getTermResults = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const filters = getValidatedInput<z.infer<typeof queryTermResultValidationSchema>>(res)
        .query as unknown as TermResultQueryFilters;
      const result = await this.service.getTermResults(filters, req.user!);
      sendPaginated(
        res,
        result.data,
        {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages,
        },
        'Term results retrieved successfully',
      );
    } catch (error) {
      next(error);
    }
  };

  public getTermResultById = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(req.params.id);
      const result = await this.service.getTermResultById(id, req.user!);
      sendSuccess(res, result, 'Term result retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public calculateStudentResult = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { enrollmentId } = getValidatedInput<
        z.infer<typeof generateTermResultValidationSchema>
      >(res).body as GenerateTermResultDto;
      const result = await this.service.calculateStudentTermResult(enrollmentId, req.user!);
      sendSuccess(res, result, 'Student term result calculated successfully');
    } catch (error) {
      next(error);
    }
  };

  public calculateClassResults = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { classId } = getValidatedInput<
        z.infer<typeof calculateClassTermResultsValidationSchema>
      >(res).body as CalculateClassTermResultsDto;
      const result = await this.service.calculateClassTermResults(classId, req.user!);
      sendSuccess(res, result, 'Class term results calculated successfully');
    } catch (error) {
      next(error);
    }
  };

  public completeTerm = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(req.params.id);
      const dto = {
        ...getValidatedInput<z.infer<typeof completeTermValidationSchema>>(res).body,
        termResultId: id,
      } as CompleteTermDto;
      const result = await this.service.completeTerm(dto, req.user!);
      sendSuccess(res, result, 'Term completed and student progressed successfully');
    } catch (error) {
      next(error);
    }
  };

  public transitionWorkflow = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.service.transitionWorkflow(
        String(req.params.id),
        getValidatedInput<z.infer<typeof transitionTermResultValidationSchema>>(res)
          .body as TransitionTermResultDto,
        req.user!,
      );
      sendSuccess(res, result, 'Term result workflow status updated successfully');
    } catch (error) {
      next(error);
    }
  };
}
