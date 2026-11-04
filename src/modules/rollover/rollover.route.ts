import { Router } from 'express';

import { authenticate, requireAuth } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { requireBranchAccess } from '../../middleware/branch-access';
import { validate } from '../../middleware/validate';
import { RolloverController } from './rollover.controller';
import {
  createRolloverPlanSchema,
  executeRolloverPlanSchema,
  queryRolloverPlansSchema,
  updateRolloverPlanSchema,
} from './rollover.validation';

const router = Router();
const controller = new RolloverController();

router.use(authenticate, requireAuth, requireBranchAccess());

router.get(
  '/',
  authorize('rollover.view.own_branch', 'rollover.view.all_branches'),
  validate(queryRolloverPlansSchema),
  controller.getPlans,
);

router.get(
  '/target-readiness/:targetPeriodId',
  authorize('rollover.view.own_branch', 'rollover.view.all_branches'),
  controller.getTargetPeriodReadiness,
);

router.post(
  '/target-readiness/:targetPeriodId/approve',
  authorize('rollover.approve.own_branch', 'rollover.approve.all_branches'),
  controller.approveTargetPeriodReadiness,
);

router.post(
  '/target-readiness/:targetPeriodId/open',
  authorize(
    'rollover.execute.own_branch',
    'rollover.execute.all_branches',
    'academic_period.edit.own_branch',
  ),
  controller.openTargetPeriod,
);

router.get(
  '/:id',
  authorize('rollover.view.own_branch', 'rollover.view.all_branches'),
  controller.getPlanById,
);

router.post(
  '/',
  authorize('rollover.create.own_branch', 'rollover.create.all_branches'),
  validate(createRolloverPlanSchema),
  controller.createPlan,
);

router.put(
  '/:id',
  authorize('rollover.create.own_branch', 'rollover.create.all_branches'),
  validate(updateRolloverPlanSchema),
  controller.updatePlan,
);

router.patch(
  '/:id',
  authorize('rollover.create.own_branch', 'rollover.create.all_branches'),
  validate(updateRolloverPlanSchema),
  controller.updatePlan,
);

router.post(
  '/:id/validate',
  authorize('rollover.validate.own_branch', 'rollover.validate.all_branches'),
  controller.validatePlan,
);

router.post(
  '/:id/approve',
  authorize('rollover.approve.own_branch', 'rollover.approve.all_branches'),
  controller.approvePlan,
);

router.post(
  '/:id/execute',
  authorize('rollover.execute.own_branch', 'rollover.execute.all_branches'),
  validate(executeRolloverPlanSchema),
  controller.executePlan,
);

export const rolloverRouter = router;
