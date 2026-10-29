import { Router } from 'express';

import { authenticate, requireAuth } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { requireBranchAccess } from '../../middleware/branch-access';
import { validate } from '../../middleware/validate';
import { PlacementTestController } from './placement-test.controller';
import {
  createPlacementTestValidationSchema,
  placementTestQueryValidationSchema,
  updatePlacementTestValidationSchema,
} from './placement-test.validation';

const placementTestRouter = Router();
const controller = new PlacementTestController();

placementTestRouter.use(authenticate);
placementTestRouter.use(requireAuth);

placementTestRouter.get(
  '/',
  authorize('placement_test.view.own_branch', 'placement_test.view.all_branches'),
  validate(placementTestQueryValidationSchema),
  controller.getPlacementTests,
);

placementTestRouter.get(
  '/:id',
  authorize('placement_test.view.own_branch', 'placement_test.view.all_branches'),
  controller.getPlacementTestById,
);

placementTestRouter.post(
  '/',
  authorize('placement_test.create.own_branch', 'placement_test.create.all_branches'),
  requireBranchAccess((req) => (req.body as { branchId?: string })?.branchId),
  validate(createPlacementTestValidationSchema),
  controller.createPlacementTest,
);

placementTestRouter.patch(
  '/:id',
  authorize('placement_test.edit.own_branch', 'placement_test.edit.all_branches'),
  validate(updatePlacementTestValidationSchema),
  controller.updatePlacementTest,
);

placementTestRouter.delete(
  '/:id',
  authorize('placement_test.delete.own_branch', 'placement_test.delete.all_branches'),
  controller.deletePlacementTest,
);

export { placementTestRouter };
