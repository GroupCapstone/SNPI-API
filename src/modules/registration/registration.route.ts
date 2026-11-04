import { Router } from 'express';

import { authenticate, requireAuth } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { requireBranchAccess } from '../../middleware/branch-access';
import { validate } from '../../middleware/validate';
import { RegistrationController } from './registration.controller';
import {
  createRegistrationValidationSchema,
  registrationQueryValidationSchema,
  updateRegistrationValidationSchema,
} from './registration.validation';

const registrationRouter = Router();
const controller = new RegistrationController();

registrationRouter.use(authenticate);
registrationRouter.use(requireAuth);

registrationRouter.get(
  '/',
  authorize('registration.view.own_branch', 'registration.view.all_branches'),
  validate(registrationQueryValidationSchema),
  controller.getRegistrations,
);

registrationRouter.get(
  '/:id',
  authorize('registration.view.own_branch', 'registration.view.all_branches'),
  controller.getRegistrationById,
);

registrationRouter.post(
  '/',
  authorize('registration.create.own_branch', 'registration.create.all_branches'),
  requireBranchAccess((req) => (req.body as { branchId?: string })?.branchId),
  validate(createRegistrationValidationSchema),
  controller.createRegistration,
);

registrationRouter.patch(
  '/:id',
  authorize('registration.edit.own_branch', 'registration.edit.all_branches'),
  validate(updateRegistrationValidationSchema),
  controller.updateRegistration,
);

registrationRouter.delete(
  '/:id',
  authorize('registration.delete.own_branch', 'registration.delete.all_branches'),
  controller.deleteRegistration,
);

export { registrationRouter };
