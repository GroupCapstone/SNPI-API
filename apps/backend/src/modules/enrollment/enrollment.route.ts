import { Router } from 'express';

import { authenticate, requireAuth } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { requireBranchAccess } from '../../middleware/branch-access';
import { validate } from '../../middleware/validate';
import { EnrollmentController } from './enrollment.controller';
import {
  createEnrollmentValidationSchema,
  enrollmentQueryValidationSchema,
  updateEnrollmentValidationSchema,
} from './enrollment.validation';

const enrollmentRouter = Router();
const controller = new EnrollmentController();

enrollmentRouter.use(authenticate);
enrollmentRouter.use(requireAuth);

enrollmentRouter.get(
  '/',
  authorize(
    'enrollment.view.assigned_class',
    'enrollment.view.own_branch',
    'enrollment.view.all_branches',
  ),
  validate(enrollmentQueryValidationSchema),
  controller.getEnrollments,
);

enrollmentRouter.get(
  '/:id',
  authorize(
    'enrollment.view.assigned_class',
    'enrollment.view.own_branch',
    'enrollment.view.all_branches',
  ),
  controller.getEnrollmentById,
);

enrollmentRouter.post(
  '/',
  authorize('enrollment.create.own_branch', 'enrollment.create.all_branches'),
  requireBranchAccess((req) => (req.body as { branchId?: string })?.branchId),
  validate(createEnrollmentValidationSchema),
  controller.createEnrollment,
);

enrollmentRouter.patch(
  '/:id',
  authorize('enrollment.edit.own_branch', 'enrollment.edit.all_branches'),
  validate(updateEnrollmentValidationSchema),
  controller.updateEnrollment,
);

enrollmentRouter.delete(
  '/:id',
  authorize('enrollment.delete.own_branch', 'enrollment.delete.all_branches'),
  controller.deleteEnrollment,
);

export { enrollmentRouter };
