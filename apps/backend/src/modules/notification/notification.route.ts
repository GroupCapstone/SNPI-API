import { Router } from 'express';

import { authenticate, requireAuth } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { NotificationController } from './notification.controller';
import {
  createParentContactLogValidationSchema,
  queryNotificationValidationSchema,
  queryParentContactLogValidationSchema,
  sendNotificationValidationSchema,
  testTelegramValidationSchema,
  triggerAbsenceAlertValidationSchema,
  triggerTuitionReminderValidationSchema,
} from './notification.validation';

const router = Router();
const controller = new NotificationController();

router.use(authenticate);
router.use(requireAuth);

router.get(
  '/',
  authorize('notification.view.own_branch', 'notification.view.all_branches'),
  validate(queryNotificationValidationSchema),
  controller.getNotifications,
);

router.get(
  '/stats',
  authorize('notification.view.own_branch', 'notification.view.all_branches'),
  controller.getStats,
);

router.post(
  '/send',
  authorize('notification.create.own_branch', 'notification.create.all_branches'),
  validate(sendNotificationValidationSchema),
  controller.sendNotification,
);

router.post(
  '/absence-alert',
  authorize(
    'attendance.edit.own_branch',
    'attendance.edit.all_branches',
    'student.edit.own_branch',
    'student.edit.all_branches',
  ),
  validate(triggerAbsenceAlertValidationSchema),
  controller.triggerAbsenceAlert,
);

router.post(
  '/tuition-reminder',
  authorize(
    'payment.edit.own_branch',
    'payment.edit.all_branches',
    'notification.create.own_branch',
    'notification.create.all_branches',
  ),
  validate(triggerTuitionReminderValidationSchema),
  controller.triggerTuitionReminder,
);

router.post(
  '/test-telegram',
  authorize('setting.edit.all_branches', 'notification.create.all_branches'),
  validate(testTelegramValidationSchema),
  controller.testTelegram,
);

router.get(
  '/parent-contact-logs',
  authorize('student.view.own_branch', 'student.view.all_branches'),
  validate(queryParentContactLogValidationSchema),
  controller.getParentContactLogs,
);

router.post(
  '/parent-contact-logs',
  authorize('student.edit.own_branch', 'student.edit.all_branches'),
  validate(createParentContactLogValidationSchema),
  controller.createParentContactLog,
);

export const notificationRouter = router;
