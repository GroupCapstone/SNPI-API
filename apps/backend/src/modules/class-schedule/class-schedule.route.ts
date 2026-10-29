import { Router } from 'express';

import { authenticate, requireAuth } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { ClassScheduleController } from './class-schedule.controller';
import {
  classScheduleClassValidationSchema,
  classScheduleIdValidationSchema,
  checkClassScheduleConflictValidationSchema,
  createClassScheduleRequestSchema,
  queryClassScheduleRequestSchema,
  studentScheduleConflictValidationSchema,
  todayClassScheduleValidationSchema,
  updateClassScheduleRequestSchema,
} from './class-schedule.validation';

export const classScheduleRouter = Router();
const controller = new ClassScheduleController();

classScheduleRouter.use(authenticate);
classScheduleRouter.use(requireAuth);

// Special Operational & Analytical Views
classScheduleRouter.get(
  '/today',
  authorize('class.view.own_branch', 'class.view.all_branches'),
  validate(todayClassScheduleValidationSchema),
  controller.getTodayClassesView,
);

classScheduleRouter.get(
  '/check-conflicts',
  authorize('class.view.own_branch', 'class.view.all_branches', 'class.create.own_branch'),
  validate(checkClassScheduleConflictValidationSchema),
  controller.checkConflicts,
);

classScheduleRouter.get(
  '/student-conflicts/:studentId',
  authorize('enrollment.view.own_branch', 'enrollment.view.all_branches', 'class.view.own_branch'),
  validate(studentScheduleConflictValidationSchema),
  controller.checkStudentConflicts,
);

classScheduleRouter.get(
  '/class/:classId',
  authorize('class.view.own_branch', 'class.view.all_branches', 'class.view.assigned_class'),
  validate(classScheduleClassValidationSchema),
  controller.getSchedulesByClass,
);

// Standard CRUD
classScheduleRouter.get(
  '/',
  authorize('class.view.own_branch', 'class.view.all_branches', 'class.view.assigned_class'),
  validate(queryClassScheduleRequestSchema),
  controller.getSchedules,
);

classScheduleRouter.get(
  '/:id',
  authorize('class.view.own_branch', 'class.view.all_branches', 'class.view.assigned_class'),
  validate(classScheduleIdValidationSchema),
  controller.getScheduleById,
);

classScheduleRouter.post(
  '/',
  authorize('class.create.own_branch', 'class.create.all_branches'),
  validate(createClassScheduleRequestSchema),
  controller.createSchedule,
);

classScheduleRouter.put(
  '/:id',
  authorize('class.edit.own_branch', 'class.edit.all_branches'),
  validate(updateClassScheduleRequestSchema),
  controller.updateSchedule,
);

classScheduleRouter.delete(
  '/:id',
  authorize('class.delete.own_branch', 'class.delete.all_branches'),
  validate(classScheduleIdValidationSchema),
  controller.deleteSchedule,
);
