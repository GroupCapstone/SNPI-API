import { Router } from 'express';

import { authenticate, requireAuth } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { MonthlyAttendanceSummaryController } from './monthly-attendance-summary.controller';
import {
  classMonthlySummaryQuerySchema,
  queryMonthlyAttendanceSummarySchema,
  recalculateMonthlyAttendanceSchema,
  studentMonthlySummaryQuerySchema,
} from './monthly-attendance-summary.validation';

const monthlyAttendanceSummaryRouter = Router();
const controller = new MonthlyAttendanceSummaryController();

monthlyAttendanceSummaryRouter.use(authenticate);
monthlyAttendanceSummaryRouter.use(requireAuth);

monthlyAttendanceSummaryRouter.get(
  '/',
  authorize('attendance.view.own_branch', 'attendance.view.all_branches'),
  validate(queryMonthlyAttendanceSummarySchema),
  controller.getSummaries,
);

monthlyAttendanceSummaryRouter.get(
  '/class/:classId',
  authorize('attendance.view.own_branch', 'attendance.view.all_branches'),
  validate(classMonthlySummaryQuerySchema),
  controller.getClassMonthlySummary,
);

monthlyAttendanceSummaryRouter.get(
  '/student/:studentId',
  authorize('attendance.view.own_branch', 'attendance.view.all_branches'),
  validate(studentMonthlySummaryQuerySchema),
  controller.getStudentMonthlyLedger,
);

monthlyAttendanceSummaryRouter.post(
  '/recalculate',
  authorize(
    'attendance.edit.own_branch',
    'attendance.edit.all_branches',
    'attendance.create.own_branch',
    'attendance.create.all_branches',
  ),
  validate(recalculateMonthlyAttendanceSchema),
  controller.recalculateClassMonth,
);

export { monthlyAttendanceSummaryRouter };
