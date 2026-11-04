import { Router } from 'express';

import { authenticate, requireAuth } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { requireBranchAccess } from '../../middleware/branch-access';
import { validate } from '../../middleware/validate';
import { PositionController } from './position.controller';
import {
  createPositionSchema,
  queryPositionSchema,
  updatePositionSchema,
} from './position.validation';

export const positionRouter = Router();
const controller = new PositionController();

positionRouter.use(authenticate);
positionRouter.use(requireAuth);

positionRouter.get(
  '/',
  authorize('position.view.own_branch', 'position.view.all_branches'),
  validate(queryPositionSchema),
  controller.getPositions,
);

positionRouter.get(
  '/:id',
  authorize('position.view.own_branch', 'position.view.all_branches'),
  controller.getPositionById,
);

positionRouter.post(
  '/',
  authorize('position.create.own_branch', 'position.create.all_branches'),
  requireBranchAccess((req) => (req.body as { branchId?: string })?.branchId),
  validate(createPositionSchema),
  controller.createPosition,
);

positionRouter.patch(
  '/:id',
  authorize('position.edit.own_branch', 'position.edit.all_branches'),
  validate(updatePositionSchema),
  controller.updatePosition,
);

positionRouter.delete(
  '/:id',
  authorize('position.delete.own_branch', 'position.delete.all_branches'),
  controller.deletePosition,
);
