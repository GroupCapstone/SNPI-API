import { Router } from 'express';

import { authenticate, requireAuth } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { AcademicYearController } from './academic-year.controller';
import {
  createAcademicYearSchema,
  queryAcademicYearSchema,
  updateAcademicYearSchema,
  transitionAcademicYearSchema,
} from './academic-year.validation';

const router = Router();
const controller = new AcademicYearController();

router.use(authenticate);
router.use(requireAuth);

router.get(
  '/',
  authorize('academic_year.view.own_branch', 'academic_year.view.all_branches'),
  validate(queryAcademicYearSchema),
  controller.getAcademicYears,
);

router.get(
  '/:id/closing-checklist',
  authorize('academic_year.view.own_branch', 'academic_year.view.all_branches'),
  controller.getClosingChecklist,
);

router.post(
  '/:id/transition',
  authorize('academic_year.edit.all_branches'),
  validate(transitionAcademicYearSchema),
  controller.transitionAcademicYear,
);

router.get(
  '/:id',
  authorize('academic_year.view.own_branch', 'academic_year.view.all_branches'),
  controller.getAcademicYearById,
);

router.post(
  '/',
  authorize('academic_year.create.all_branches'),
  validate(createAcademicYearSchema),
  controller.createAcademicYear,
);

router.patch(
  '/:id',
  authorize('academic_year.edit.all_branches'),
  validate(updateAcademicYearSchema),
  controller.updateAcademicYear,
);

router.delete(
  '/:id',
  authorize('academic_year.delete.all_branches'),
  controller.deleteAcademicYear,
);

export const academicYearRouter = router;
