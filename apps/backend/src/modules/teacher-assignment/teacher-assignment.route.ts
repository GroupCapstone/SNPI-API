import { Router } from 'express';

import { authenticate, requireAuth } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { requireBranchAccess } from '../../middleware/branch-access';
import { validate } from '../../middleware/validate';
import { TeacherAssignmentController } from './teacher-assignment.controller';
import {
  createTeacherAssignmentValidationSchema,
  teacherAssignmentQueryValidationSchema,
  teacherRosterQueryValidationSchema,
  updateTeacherAssignmentValidationSchema,
} from './teacher-assignment.validation';

const teacherAssignmentRouter = Router();
const controller = new TeacherAssignmentController();

teacherAssignmentRouter.use(authenticate);
teacherAssignmentRouter.use(requireAuth);

teacherAssignmentRouter.get(
  '/roster-matrix',
  authorize('teacher_assignment.view.own_branch', 'teacher_assignment.view.all_branches'),
  validate(teacherRosterQueryValidationSchema),
  controller.getRosterMatrix,
);

teacherAssignmentRouter.get(
  '/',
  authorize('teacher_assignment.view.own_branch', 'teacher_assignment.view.all_branches'),
  validate(teacherAssignmentQueryValidationSchema),
  controller.getTeacherAssignments,
);

teacherAssignmentRouter.get(
  '/:id',
  authorize('teacher_assignment.view.own_branch', 'teacher_assignment.view.all_branches'),
  controller.getTeacherAssignmentById,
);

teacherAssignmentRouter.post(
  '/',
  authorize('teacher_assignment.create.own_branch', 'teacher_assignment.create.all_branches'),
  requireBranchAccess((req) => (req.body as { branchId?: string })?.branchId),
  validate(createTeacherAssignmentValidationSchema),
  controller.createTeacherAssignment,
);

teacherAssignmentRouter.patch(
  '/:id',
  authorize('teacher_assignment.edit.own_branch', 'teacher_assignment.edit.all_branches'),
  validate(updateTeacherAssignmentValidationSchema),
  controller.updateTeacherAssignment,
);

teacherAssignmentRouter.delete(
  '/:id',
  authorize('teacher_assignment.delete.own_branch', 'teacher_assignment.delete.all_branches'),
  controller.deleteTeacherAssignment,
);

export { teacherAssignmentRouter };
