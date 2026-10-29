import { Router } from 'express';

import { authenticate, requireAuth } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { IntakeController } from './intake.controller';
import {
  createIntakeValidationSchema,
  queryIntakeValidationSchema,
  updateIntakeValidationSchema,
} from './intake.validation';

const intakeRouter = Router();
const controller = new IntakeController();

intakeRouter.use(authenticate);
intakeRouter.use(requireAuth);

intakeRouter.get(
  '/',
  authorize('intake.view.own_branch', 'intake.view.all_branches'),
  validate(queryIntakeValidationSchema),
  controller.getIntakes,
);

intakeRouter.get(
  '/:id',
  authorize('intake.view.own_branch', 'intake.view.all_branches'),
  controller.getIntakeById,
);

intakeRouter.post(
  '/',
  authorize('intake.create.own_branch', 'intake.create.all_branches'),
  validate(createIntakeValidationSchema),
  controller.createIntake,
);

intakeRouter.patch(
  '/:id',
  authorize('intake.edit.own_branch', 'intake.edit.all_branches'),
  validate(updateIntakeValidationSchema),
  controller.updateIntake,
);

intakeRouter.delete(
  '/:id',
  authorize('intake.delete.own_branch', 'intake.delete.all_branches'),
  controller.deleteIntake,
);

export { intakeRouter };
