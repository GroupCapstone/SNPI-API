import { Router } from 'express';

import { authenticate, requireAuth } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { AcademicPeriodController } from './academic-period.controller';
import {
  createAcademicPeriodValidationSchema,
  generateMonthlyPeriodsValidationSchema,
  queryAcademicPeriodValidationSchema,
  updateAcademicPeriodValidationSchema,
  transitionAcademicPeriodValidationSchema,
} from './academic-period.validation';

const academicPeriodRouter = Router();
const controller = new AcademicPeriodController();

academicPeriodRouter.use(authenticate);
academicPeriodRouter.use(requireAuth);

academicPeriodRouter.get(
  '/',
  authorize('academic_period.view.own_branch', 'academic_period.view.all_branches'),
  validate(queryAcademicPeriodValidationSchema),
  controller.getAcademicPeriods,
);

academicPeriodRouter.post(
  '/generate-monthly',
  authorize('academic_period.create.own_branch', 'academic_period.create.all_branches'),
  validate(generateMonthlyPeriodsValidationSchema),
  controller.generateMonthlyPeriods,
);

academicPeriodRouter.get(
  '/:id/closing-checklist',
  authorize('academic_period.view.own_branch', 'academic_period.view.all_branches'),
  controller.getClosingChecklist,
);

academicPeriodRouter.post(
  '/:id/transition',
  authorize('academic_period.edit.own_branch', 'academic_period.edit.all_branches'),
  validate(transitionAcademicPeriodValidationSchema),
  controller.transitionAcademicPeriod,
);

academicPeriodRouter.get(
  '/:id',
  authorize('academic_period.view.own_branch', 'academic_period.view.all_branches'),
  controller.getAcademicPeriodById,
);

academicPeriodRouter.post(
  '/',
  authorize('academic_period.create.own_branch', 'academic_period.create.all_branches'),
  validate(createAcademicPeriodValidationSchema),
  controller.createAcademicPeriod,
);

academicPeriodRouter.patch(
  '/:id',
  authorize('academic_period.edit.own_branch', 'academic_period.edit.all_branches'),
  validate(updateAcademicPeriodValidationSchema),
  controller.updateAcademicPeriod,
);

academicPeriodRouter.delete(
  '/:id',
  authorize('academic_period.delete.own_branch', 'academic_period.delete.all_branches'),
  controller.deleteAcademicPeriod,
);

export { academicPeriodRouter };
