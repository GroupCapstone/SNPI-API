import { Router } from 'express';

import { authenticate, requireAuth } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { TermResultController } from './term-result.controller';
import {
  calculateClassTermResultsValidationSchema,
  completeTermValidationSchema,
  generateTermResultValidationSchema,
  queryTermResultValidationSchema,
  transitionTermResultValidationSchema,
} from './term-result.validation';

const termResultRouter = Router();
const controller = new TermResultController();

termResultRouter.use(authenticate);
termResultRouter.use(requireAuth);

termResultRouter.get(
  '/',
  authorize(
    'term_result.view.assigned_class',
    'term_result.view.own_branch',
    'term_result.view.all_branches',
  ),
  validate(queryTermResultValidationSchema),
  controller.getTermResults,
);

termResultRouter.get(
  '/:id',
  authorize(
    'term_result.view.assigned_class',
    'term_result.view.own_branch',
    'term_result.view.all_branches',
  ),
  controller.getTermResultById,
);

termResultRouter.post(
  '/calculate-student',
  authorize('term_result.create.own_branch', 'term_result.create.all_branches'),
  validate(generateTermResultValidationSchema),
  controller.calculateStudentResult,
);

termResultRouter.post(
  '/calculate-class',
  authorize('term_result.create.own_branch', 'term_result.create.all_branches'),
  validate(calculateClassTermResultsValidationSchema),
  controller.calculateClassResults,
);

termResultRouter.post(
  '/:id/workflow-transition',
  authorize(
    'term_result.submit.own_branch',
    'term_result.submit.all_branches',
    'term_result.review.own_branch',
    'term_result.review.all_branches',
    'term_result.approve.own_branch',
    'term_result.approve.all_branches',
  ),
  validate(transitionTermResultValidationSchema),
  controller.transitionWorkflow,
);

termResultRouter.post(
  '/:id/complete',
  authorize('term_result.finalize.own_branch', 'term_result.finalize.all_branches'),
  validate(completeTermValidationSchema),
  controller.completeTerm,
);

export { termResultRouter };
