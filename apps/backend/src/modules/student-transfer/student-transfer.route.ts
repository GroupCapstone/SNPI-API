import { Router } from 'express';

import { authenticate, requireAuth } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { requireBranchAccess } from '../../middleware/branch-access';
import { validate } from '../../middleware/validate';
import { StudentTransferController } from './student-transfer.controller';
import {
  createStudentTransferValidationSchema,
  processTransferValidationSchema,
  studentTransferQueryValidationSchema,
} from './student-transfer.validation';

const studentTransferRouter = Router();
const controller = new StudentTransferController();

studentTransferRouter.use(authenticate);
studentTransferRouter.use(requireAuth);

studentTransferRouter.get(
  '/',
  authorize('student_transfer.view.own_branch', 'student_transfer.view.all_branches'),
  validate(studentTransferQueryValidationSchema),
  controller.getTransfers,
);

studentTransferRouter.get(
  '/:id',
  authorize('student_transfer.view.own_branch', 'student_transfer.view.all_branches'),
  controller.getTransferById,
);

studentTransferRouter.post(
  '/',
  authorize('student_transfer.create.own_branch', 'student_transfer.create.all_branches'),
  requireBranchAccess((req) => (req.body as { fromBranchId?: string })?.fromBranchId),
  validate(createStudentTransferValidationSchema),
  controller.createTransfer,
);

studentTransferRouter.patch(
  '/:id/process',
  authorize('student_transfer.edit.own_branch', 'student_transfer.edit.all_branches'),
  validate(processTransferValidationSchema),
  controller.processTransfer,
);

export { studentTransferRouter };
