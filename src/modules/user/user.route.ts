import { Router } from 'express';

import { authenticate, requireAuth } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { UserController } from './user.controller';
import {
  adminResetPasswordSchema,
  createUserSchema,
  queryUserSchema,
  updateUserSchema,
  updateUserStatusSchema,
} from './user.validation';

const userRouter = Router();
const controller = new UserController();

userRouter.use(authenticate);
userRouter.use(requireAuth);

userRouter.get(
  '/',
  authorize('user.view.own_branch', 'user.view.all_branches'),
  validate(queryUserSchema),
  controller.getUsers,
);

userRouter.get(
  '/:id',
  authorize('user.view.own_branch', 'user.view.all_branches'),
  controller.getUserById,
);

userRouter.post(
  '/',
  authorize('user.create.own_branch', 'user.create.all_branches'),
  validate(createUserSchema),
  controller.createUser,
);

userRouter.patch(
  '/:id/status',
  authorize('user.edit.own_branch', 'user.edit.all_branches'),
  validate(updateUserStatusSchema),
  controller.updateUserStatus,
);

userRouter.patch(
  '/:id',
  authorize('user.edit.own_branch', 'user.edit.all_branches'),
  validate(updateUserSchema),
  controller.updateUser,
);

userRouter.post(
  '/:id/reset-password',
  authorize('user.reset_password.own_branch', 'user.reset_password.all_branches'),
  validate(adminResetPasswordSchema),
  controller.resetPassword,
);

userRouter.delete(
  '/:id',
  authorize('user.delete.own_branch', 'user.delete.all_branches'),
  controller.deleteUser,
);

export { userRouter };
