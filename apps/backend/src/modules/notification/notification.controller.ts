import type { NextFunction, Response } from 'express';
import type { z } from 'zod';

import { getValidatedInput } from '../../middleware/validate';
import { sendPaginated, sendSuccess } from '../../shared/http/api-response';
import type { AuthenticatedRequest, AuthUser } from '../../types/auth';
import { NotificationService } from './notification.service';
import type {
  createParentContactLogValidationSchema,
  queryNotificationValidationSchema,
  queryParentContactLogValidationSchema,
  sendNotificationValidationSchema,
  testTelegramValidationSchema,
  triggerAbsenceAlertValidationSchema,
  triggerTuitionReminderValidationSchema,
} from './notification.validation';

export class NotificationController {
  constructor(private readonly service: NotificationService = new NotificationService()) {}

  public getNotifications = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const user = req.user as AuthUser;
      const validated = getValidatedInput<z.infer<typeof queryNotificationValidationSchema>>(res);
      const filters = validated.query;

      const result = await this.service.getNotifications(filters, user);
      sendPaginated(
        res,
        result.data,
        {
          page: result.page,
          limit: filters.limit,
          total: result.total,
          totalPages: result.totalPages,
        },
        'Notifications retrieved successfully',
      );
    } catch (error) {
      next(error);
    }
  };

  public getStats = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const user = req.user as AuthUser;
      const branchId = req.query.branchId as string | undefined;

      const stats = await this.service.getStats(user, branchId);
      sendSuccess(res, stats, 'Notification statistics retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public sendNotification = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const user = req.user as AuthUser;
      const validated = getValidatedInput<z.infer<typeof sendNotificationValidationSchema>>(res);
      const payload = validated.body;

      const created = await this.service.sendNotification(payload, user);
      sendSuccess(res, created, 'Notification dispatched successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  public triggerAbsenceAlert = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const user = req.user as AuthUser;
      const validated = getValidatedInput<z.infer<typeof triggerAbsenceAlertValidationSchema>>(res);
      const payload = validated.body;

      const result = await this.service.triggerAbsenceAlert(payload, user);
      sendSuccess(res, result, 'Absence outreach alert dispatched successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  public triggerTuitionReminder = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const validated =
        getValidatedInput<z.infer<typeof triggerTuitionReminderValidationSchema>>(res);
      const result = await this.service.triggerTuitionReminder(
        validated.body,
        req.user as AuthUser,
      );
      sendSuccess(res, result, 'Tuition payment reminder dispatched successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  public testTelegram = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const validated = getValidatedInput<z.infer<typeof testTelegramValidationSchema>>(res);
      const payload = validated.body;

      const result = await this.service.testTelegram(
        payload.chatId,
        payload.message,
        req.user!.schoolId,
      );
      sendSuccess(res, result, 'Telegram connectivity test executed');
    } catch (error) {
      next(error);
    }
  };

  public getParentContactLogs = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const user = req.user as AuthUser;
      const validated =
        getValidatedInput<z.infer<typeof queryParentContactLogValidationSchema>>(res);
      const filters = validated.query;

      const result = await this.service.getParentContactLogs(filters, user);
      sendPaginated(
        res,
        result.data,
        {
          page: result.page,
          limit: filters.limit,
          total: result.total,
          totalPages: result.totalPages,
        },
        'Parent contact logs retrieved successfully',
      );
    } catch (error) {
      next(error);
    }
  };

  public createParentContactLog = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const user = req.user as AuthUser;
      const validated =
        getValidatedInput<z.infer<typeof createParentContactLogValidationSchema>>(res);
      const payload = validated.body;

      const created = await this.service.createParentContactLog(payload, user);
      sendSuccess(res, created, 'Parent contact log recorded successfully', 201);
    } catch (error) {
      next(error);
    }
  };
}
