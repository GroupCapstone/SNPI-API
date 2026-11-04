import type { z } from 'zod';
import type { NextFunction, Response } from 'express';

import { getValidatedInput } from '../../middleware/validate';
import { sendPaginated, sendSuccess } from '../../shared/http/api-response';
import type { AuthenticatedRequest } from '../../types/auth';
import { AttendanceService } from './attendance.service';
import type { AttendanceQueryFilters, MarkAttendanceDTO } from './attendance.types';

import type {
  attendanceQueryValidationSchema,
  classRosterQueryValidationSchema,
  markAttendanceValidationSchema,
} from './attendance.validation';

export class AttendanceController {
  public constructor(private readonly service = new AttendanceService()) {}

  public getAttendance = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const filters = getValidatedInput<z.infer<typeof attendanceQueryValidationSchema>>(response)
        .query as unknown as AttendanceQueryFilters;
      const page = Number(filters.page ?? 1);
      const limit = Number(filters.limit ?? 20);

      const result = await this.service.getAttendance(filters, request.user!);

      sendPaginated(
        response,
        result.data,
        {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit) || 1,
        },
        'Attendance records retrieved successfully',
      );
    } catch (error) {
      next(error);
    }
  };

  public getClassRosterByDate = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const classId = String(request.params.classId);
      const dateStr = String(
        getValidatedInput<z.infer<typeof classRosterQueryValidationSchema>>(response).query.date ||
          new Date().toISOString().split('T')[0],
      );
      const sessionType = String(
        getValidatedInput<z.infer<typeof classRosterQueryValidationSchema>>(response).query
          .sessionType || 'morning',
      );

      const result = await this.service.getClassAttendanceByDate(
        classId,
        dateStr,
        request.user!,
        sessionType,
      );
      sendSuccess(response, result, 'Class attendance roster retrieved successfully', 200);
    } catch (error) {
      next(error);
    }
  };

  public markAttendance = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = getValidatedInput<z.infer<typeof markAttendanceValidationSchema>>(response)
        .body as MarkAttendanceDTO;
      const attendance = await this.service.markAttendance(dto, request.user!);
      sendSuccess(response, attendance, 'Class attendance roll-call submitted successfully', 200);
    } catch (error) {
      next(error);
    }
  };
}
