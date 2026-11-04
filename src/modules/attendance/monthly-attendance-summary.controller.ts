import type { NextFunction, Response } from 'express';
import type { z } from 'zod';

import { getValidatedInput } from '../../middleware/validate';
import { sendPaginated, sendSuccess } from '../../shared/http/api-response';
import type { AuthenticatedRequest } from '../../types/auth';
import { MonthlyAttendanceSummaryService } from './monthly-attendance-summary.service';
import type {
  MonthlyAttendanceSummaryQueryFilters,
  RecalculateMonthlyAttendanceDto,
} from './monthly-attendance-summary.types';
import type {
  classMonthlySummaryQuerySchema,
  queryMonthlyAttendanceSummarySchema,
  recalculateMonthlyAttendanceSchema,
  studentMonthlySummaryQuerySchema,
} from './monthly-attendance-summary.validation';

export class MonthlyAttendanceSummaryController {
  public constructor(private readonly service = new MonthlyAttendanceSummaryService()) {}

  public getSummaries = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const filters = getValidatedInput<z.infer<typeof queryMonthlyAttendanceSummarySchema>>(res)
        .query as unknown as MonthlyAttendanceSummaryQueryFilters;
      const result = await this.service.getSummaries(filters, req.user!);
      sendPaginated(
        res,
        result.data,
        {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages,
        },
        'Monthly attendance summaries retrieved successfully',
      );
    } catch (error) {
      next(error);
    }
  };

  public getClassMonthlySummary = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { params, query } =
        getValidatedInput<z.infer<typeof classMonthlySummaryQuerySchema>>(res);
      const result = await this.service.getClassMonthlySummary(
        params.classId,
        query.year,
        query.month,
        req.user!,
      );
      sendSuccess(res, result, 'Class monthly attendance summary retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public getStudentMonthlyLedger = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { params, query } =
        getValidatedInput<z.infer<typeof studentMonthlySummaryQuerySchema>>(res);
      const result = await this.service.getStudentMonthlyLedger(
        params.studentId,
        query.academicYearId,
        query.year,
        req.user!,
      );
      sendSuccess(res, result, 'Student monthly attendance ledger retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public recalculateClassMonth = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { body } = getValidatedInput<z.infer<typeof recalculateMonthlyAttendanceSchema>>(res);
      const dto = body as RecalculateMonthlyAttendanceDto;
      const count = await this.service.recalculateClassMonth(
        dto.classId,
        dto.year,
        dto.month,
        req.user!,
      );
      sendSuccess(
        res,
        { classId: dto.classId, year: dto.year, month: dto.month, updatedCount: count },
        'Monthly attendance summary recalculated successfully',
      );
    } catch (error) {
      next(error);
    }
  };
}
