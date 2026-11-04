import { Router } from 'express';

import { authenticate, requireAuth } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { requireBranchAccess } from '../../middleware/branch-access';
import { validate } from '../../middleware/validate';
import { StudentController } from './student.controller';
import {
  checkDuplicatesValidationSchema,
  confirmImportValidationSchema,
  createStudentValidationSchema,
  previewImportValidationSchema,
  studentQueryValidationSchema,
  updateStudentValidationSchema,
} from './student.validation';

const studentRouter = Router();
const controller = new StudentController();

studentRouter.use(authenticate);
studentRouter.use(requireAuth);

studentRouter.get(
  '/',
  authorize('student.view.assigned_class', 'student.view.own_branch', 'student.view.all_branches'),
  validate(studentQueryValidationSchema),
  controller.getStudents,
);

studentRouter.post(
  '/check-duplicates',
  authorize('student.view.own_branch', 'student.view.all_branches', 'student.create.own_branch'),
  validate(checkDuplicatesValidationSchema),
  controller.checkDuplicates,
);

studentRouter.post(
  '/import/preview',
  authorize('student.create.own_branch', 'student.create.all_branches'),
  requireBranchAccess((req) => (req.body as { branchId?: string })?.branchId),
  validate(previewImportValidationSchema),
  controller.previewImport,
);

studentRouter.post(
  '/import/confirm',
  authorize('student.create.own_branch', 'student.create.all_branches'),
  requireBranchAccess((req) => (req.body as { branchId?: string })?.branchId),
  validate(confirmImportValidationSchema),
  controller.confirmImport,
);

studentRouter.get(
  '/:id',
  authorize('student.view.assigned_class', 'student.view.own_branch', 'student.view.all_branches'),
  controller.getStudentById,
);

studentRouter.post(
  '/',
  authorize('student.create.own_branch', 'student.create.all_branches'),
  requireBranchAccess((req) => (req.body as { branchId?: string })?.branchId),
  validate(createStudentValidationSchema),
  controller.createStudent,
);

studentRouter.patch(
  '/:id',
  authorize('student.edit.own_branch', 'student.edit.all_branches'),
  validate(updateStudentValidationSchema),
  controller.updateStudent,
);

studentRouter.delete(
  '/:id',
  authorize('student.delete.own_branch', 'student.delete.all_branches'),
  controller.deleteStudent,
);

export { studentRouter };
