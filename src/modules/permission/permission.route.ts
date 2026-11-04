import { Router } from 'express';

import { authenticate, requireAuth } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { PermissionController } from './permission.controller';

export const permissionRouter = Router();
const controller = new PermissionController();

permissionRouter.use(authenticate);
permissionRouter.use(requireAuth);

permissionRouter.get('/', authorize('role.view.all_branches'), controller.getPermissions);
permissionRouter.get(
  '/grouped',
  authorize('role.view.all_branches'),
  controller.getGroupedPermissions,
);
