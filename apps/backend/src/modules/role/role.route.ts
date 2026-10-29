import { Router } from 'express';

import { authenticate, requireAuth } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { RoleController } from './role.controller';
import { createRoleSchema, queryRoleSchema, updateRoleSchema } from './role.validation';

export const roleRouter = Router();
const controller = new RoleController();

roleRouter.use(authenticate);
roleRouter.use(requireAuth);

roleRouter.get(
  '/',
  authorize('role.view.all_branches'),
  validate(queryRoleSchema),
  controller.getRoles,
);

roleRouter.get('/:id', authorize('role.view.all_branches'), controller.getRoleById);

roleRouter.post(
  '/',
  authorize('role.create.all_branches'),
  validate(createRoleSchema),
  controller.createRole,
);

roleRouter.patch(
  '/:id',
  authorize('role.edit.all_branches'),
  validate(updateRoleSchema),
  controller.updateRole,
);

roleRouter.delete('/:id', authorize('role.delete.all_branches'), controller.deleteRole);
