import { Router } from 'express';

import { authenticate, requireAuth } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { AssessmentController } from './assessment.controller';
import {
  createAssessmentSchema,
  queryAssessmentSchema,
  updateAssessmentSchema,
} from './assessment.validation';

export const assessmentRouter = Router();
const controller = new AssessmentController();

assessmentRouter.use(authenticate);
assessmentRouter.use(requireAuth);

assessmentRouter.get(
  '/',
  authorize(
    'assessment.view.assigned_subject',
    'assessment.view.own_branch',
    'assessment.view.all_branches',
  ),
  validate(queryAssessmentSchema),
  controller.getAssessments,
);

assessmentRouter.get(
  '/:id',
  authorize(
    'assessment.view.assigned_subject',
    'assessment.view.own_branch',
    'assessment.view.all_branches',
  ),
  controller.getAssessmentById,
);

assessmentRouter.post(
  '/',
  authorize('assessment.create.own_branch', 'assessment.create.all_branches'),
  validate(createAssessmentSchema),
  controller.createAssessment,
);

assessmentRouter.patch(
  '/:id',
  authorize('assessment.edit.own_branch', 'assessment.edit.all_branches'),
  validate(updateAssessmentSchema),
  controller.updateAssessment,
);

assessmentRouter.delete(
  '/:id',
  authorize('assessment.delete.own_branch', 'assessment.delete.all_branches'),
  controller.deleteAssessment,
);
