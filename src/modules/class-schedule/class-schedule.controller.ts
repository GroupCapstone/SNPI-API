import type { z } from 'zod';
import type { NextFunction, Response } from 'express';

import { getValidatedInput } from '../../middleware/validate';
import { sendPaginated, sendSuccess } from '../../shared/http/api-response';
import type { AuthenticatedRequest } from '../../types/auth';
import { ClassScheduleService } from './class-schedule.service';
import {
  createClassScheduleSchema,
  queryClassScheduleSchema,
  updateClassScheduleSchema,
} from './class-schedule.validation';

import type { checkClassScheduleConflictValidationSchema } from './class-schedule.validation';

export class ClassScheduleController {
  public constructor(private readonly service = new ClassScheduleService()) {}

  public getSchedules = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const filters = queryClassScheduleSchema.parse(req.query);
      const result = await this.service.getSchedules(filters, req.user!);
      const page = filters.page ?? 1;
      const limit = filters.limit ?? 20;

      sendPaginated(
        res,
        result.data,
        {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit),
        },
        'Class schedules retrieved successfully',
      );
    } catch (error) {
      next(error);
    }
  };

  public getScheduleById = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const schedule = await this.service.getScheduleById(id, req.user!);
      sendSuccess(res, schedule, 'Class schedule retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public getSchedulesByClass = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { classId } = req.params as { classId: string };
      const schedules = await this.service.getSchedulesByClass(classId, req.user!);
      sendSuccess(res, schedules, 'Class schedules retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public createSchedule = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = createClassScheduleSchema.parse(req.body);
      const schedule = await this.service.createSchedule(dto, req.user!);
      sendSuccess(res, schedule, 'Class schedule created successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  public updateSchedule = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const dto = updateClassScheduleSchema.parse(req.body);
      const schedule = await this.service.updateSchedule(id, dto, req.user!);
      sendSuccess(res, schedule, 'Class schedule updated successfully');
    } catch (error) {
      next(error);
    }
  };

  public deleteSchedule = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      await this.service.deleteSchedule(id, req.user!);
      sendSuccess(res, null, 'Class schedule deleted successfully');
    } catch (error) {
      next(error);
    }
  };

  public checkConflicts = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const {
        branchId,
        academicYearId,
        academicPeriodId,
        dayOfWeek,
        startTime,
        endTime,
        effectiveFrom,
        effectiveTo,
        teacherId,
        classroomId,
        classId,
        excludeScheduleId,
      } = getValidatedInput<z.infer<typeof checkClassScheduleConflictValidationSchema>>(res).query;

      const result = await this.service.checkConflicts(
        {
          branchId,
          academicYearId,
          academicPeriodId,
          dayOfWeek: Number(dayOfWeek),
          startTime: startTime ?? '',
          endTime: endTime ?? '',
          effectiveFrom,
          effectiveTo,
          teacherId,
          classroomId,
          classId,
          excludeScheduleId,
        },
        req.user!,
      );

      sendSuccess(res, result, 'Conflict check completed');
    } catch (error) {
      next(error);
    }
  };

  public checkStudentConflicts = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { studentId } = req.params as { studentId: string };
      const result = await this.service.checkStudentConflicts(studentId, req.user!);
      sendSuccess(res, result, 'Student schedule conflict check completed');
    } catch (error) {
      next(error);
    }
  };

  public getTodayClassesView = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { branchId, date } = req.query as { branchId?: string; date?: string };
      const effectiveBranchId =
        branchId ||
        (Array.isArray(req.user?.branchAccess) && req.user?.branchAccess.length > 0
          ? req.user?.branchAccess[0]
          : '');

      if (!effectiveBranchId) {
        sendSuccess(res, { sessions: {}, totalClasses: 0 }, 'Please select a branch');
        return;
      }

      const result = await this.service.getTodayClassesView(
        effectiveBranchId,
        date ?? '',
        req.user!,
      );
      sendSuccess(res, result, "Today's classes view retrieved successfully");
    } catch (error) {
      next(error);
    }
  };
}
