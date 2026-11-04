import type { NextFunction, Response } from 'express';

import { getValidatedInput } from '../../middleware/validate';
import { sendPaginated, sendSuccess } from '../../shared/http/api-response';
import type { AuthenticatedRequest } from '../../types/auth';
import { AttendanceLeaveService } from './attendance-leave.service';
import type {
  AttendanceLeaveFilters,
  CreateAttendanceLeaveDto,
  ReviewAttendanceLeaveDto,
} from './attendance-leave.types';

export class AttendanceLeaveController {
  public constructor(private readonly service = new AttendanceLeaveService()) {}

  public list = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.getLeaves(
        getValidatedInput<{ query: AttendanceLeaveFilters }>(res).query,
        req.user!,
      );
      sendPaginated(res, result.data, {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / result.limit) || 1,
      });
    } catch (error) {
      next(error);
    }
  };

  public create = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.createLeave(
        getValidatedInput<{ body: CreateAttendanceLeaveDto }>(res).body,
        req.user!,
      );
      sendSuccess(res, result, 'Attendance leave request created successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  public review = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.reviewLeave(
        String(req.params.id),
        getValidatedInput<{ body: ReviewAttendanceLeaveDto }>(res).body,
        req.user!,
      );
      sendSuccess(res, result, 'Attendance leave request updated successfully');
    } catch (error) {
      next(error);
    }
  };
}
