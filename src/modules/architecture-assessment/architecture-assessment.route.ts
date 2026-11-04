import { Router } from 'express';

import { authenticate, requireAuth } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { ArchitectureAssessmentController } from './architecture-assessment.controller';
import {
  evaluationIdParamSchema,
  queryEvaluationsSchema,
  triggerEvaluationSchema,
  updateCheckItemSchema,
} from './architecture-assessment.validation';

const architectureAssessmentRouter = Router();
const controller = new ArchitectureAssessmentController();

architectureAssessmentRouter.use(authenticate);
architectureAssessmentRouter.use(requireAuth);

architectureAssessmentRouter.get(
  '/metrics/radar',
  authorize('audit.view.own_branch', 'audit.view.all_branches'),
  controller.getRadarMetrics,
);

architectureAssessmentRouter.post(
  '/evaluations',
  authorize('audit.view.all_branches'),
  validate(triggerEvaluationSchema),
  controller.triggerEvaluation,
);

architectureAssessmentRouter.get(
  '/evaluations',
  authorize('audit.view.own_branch', 'audit.view.all_branches'),
  validate(queryEvaluationsSchema),
  controller.getEvaluations,
);

architectureAssessmentRouter.get(
  '/evaluations/:id',
  authorize('audit.view.own_branch', 'audit.view.all_branches'),
  validate(evaluationIdParamSchema),
  controller.getEvaluationById,
);

architectureAssessmentRouter.patch(
  '/evaluations/:id/items/:checkId',
  authorize('audit.view.all_branches'),
  validate(updateCheckItemSchema),
  controller.updateCheckItem,
);

export { architectureAssessmentRouter };
