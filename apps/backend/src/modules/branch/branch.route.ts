import { Router } from 'express';

import { authenticate, requireAuth } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { requireBranchAccess } from '../../middleware/branch-access';
import { validate } from '../../middleware/validate';
import { BranchController } from './branch.controller';
import { createBranchSchema, queryBranchSchema, updateBranchSchema } from './branch.validation';

export const branchRouter = Router();
const controller = new BranchController();

branchRouter.use(authenticate);
branchRouter.use(requireAuth);

branchRouter.get(
  '/',
  authorize('branch.view.own_branch', 'branch.view.all_branches'),
  validate(queryBranchSchema),
  controller.getBranches,
);

branchRouter.get(
  '/:id',
  authorize('branch.view.own_branch', 'branch.view.all_branches'),
  requireBranchAccess((req) => String(req.params.id)),
  controller.getBranchById,
);

branchRouter.post(
  '/',
  authorize('branch.create.all_branches'),
  validate(createBranchSchema),
  controller.createBranch,
);

branchRouter.patch(
  '/:id',
  authorize('branch.edit.own_branch', 'branch.edit.all_branches'),
  requireBranchAccess((req) => String(req.params.id)),
  validate(updateBranchSchema),
  controller.updateBranch,
);

branchRouter.delete(
  '/:id',
  authorize('branch.delete.all_branches'),
  requireBranchAccess((req) => String(req.params.id)),
  controller.deleteBranch,
);
