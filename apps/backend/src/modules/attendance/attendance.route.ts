import { Router } from 'express';

import { authenticate, requireAuth } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { requireBranchAccess } from '../../middleware/branch-access';
import { validate } from '../../middleware/validate';
import { AttendanceController } from './attendance.controller';
import { monthlyAttendanceSummaryRouter } from './monthly-attendance-summary.route';
import {
  attendanceQueryValidationSchema,
  classRosterQueryValidationSchema,
  markAttendanceValidationSchema,
} from './attendance.validation';

const attendanceRouter = Router();
const controller = new AttendanceController();

attendanceRouter.use(authenticate);
attendanceRouter.use(requireAuth);

attendanceRouter.use('/monthly-summary', monthlyAttendanceSummaryRouter);

attendanceRouter.get(
  '/',
  authorize(
    'attendance.view.assigned_class',
    'attendance.view.own_branch',
    'attendance.view.all_branches',
  ),
  validate(attendanceQueryValidationSchema),
  controller.getAttendance,
);

attendanceRouter.get(
  '/roster/:classId',
  authorize(
    'attendance.view.assigned_class',
    'attendance.view.own_branch',
    'attendance.view.all_branches',
  ),
  validate(classRosterQueryValidationSchema),
  controller.getClassRosterByDate,
);

attendanceRouter.post(
  '/',
  authorize(
    'attendance.create.assigned_class',
    'attendance.create.own_branch',
    'attendance.create.all_branches',
  ),
  requireBranchAccess((req) => (req.body as { branchId?: string })?.branchId),
  validate(markAttendanceValidationSchema),
  controller.markAttendance,
);

export { attendanceRouter };
