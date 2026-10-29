import { Router } from 'express';

import { authenticate, requireAuth } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { AttendanceLeaveController } from './attendance-leave.controller';
import {
  createAttendanceLeaveSchema,
  queryAttendanceLeaveSchema,
  reviewAttendanceLeaveSchema,
} from './attendance-leave.validation';

export const attendanceLeaveRouter = Router();
const controller = new AttendanceLeaveController();

attendanceLeaveRouter.use(authenticate, requireAuth);
attendanceLeaveRouter.get(
  '/',
  authorize(
    'attendance.view.assigned_class',
    'attendance.view.own_branch',
    'attendance.view.all_branches',
  ),
  validate(queryAttendanceLeaveSchema),
  controller.list,
);
attendanceLeaveRouter.post(
  '/',
  authorize(
    'attendance.create.assigned_class',
    'attendance.create.own_branch',
    'attendance.create.all_branches',
  ),
  validate(createAttendanceLeaveSchema),
  controller.create,
);
attendanceLeaveRouter.patch(
  '/:id/review',
  authorize(
    'attendance.edit.assigned_class',
    'attendance.edit.own_branch',
    'attendance.edit.all_branches',
  ),
  validate(reviewAttendanceLeaveSchema),
  controller.review,
);
