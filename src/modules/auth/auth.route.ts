import { Router } from 'express';

import { authenticate, requireAuth } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { createAuthRateLimiter, createLoginRateLimiter } from '../../middleware/security';
import { validate } from '../../middleware/validate';
import { AuthController } from './auth.controller';
import {
  changePasswordSchema,
  disable2FaSchema,
  enable2FaSchema,
  loginSchema,
  refreshTokenSchema,
  resetUser2FaSchema,
  verify2FaSchema,
} from './auth.validation';

export const authRouter = Router();
const controller = new AuthController();
const authRateLimiter = createAuthRateLimiter();

authRouter.post('/login', createLoginRateLimiter(), validate(loginSchema), controller.login);
authRouter.post('/refresh', authRateLimiter, validate(refreshTokenSchema), controller.refresh);
authRouter.post('/logout', authenticate, requireAuth, controller.logout);
authRouter.get('/me', authenticate, requireAuth, controller.getMe);
authRouter.patch(
  '/change-password',
  authRateLimiter,
  authenticate,
  requireAuth,
  validate(changePasswordSchema),
  controller.changePassword,
);

// Two-Factor Authentication (2FA) Routes
authRouter.post(
  '/2fa/verify',
  createLoginRateLimiter(),
  validate(verify2FaSchema),
  controller.verify2Fa,
);
authRouter.post('/2fa/setup', authRateLimiter, authenticate, requireAuth, controller.setup2Fa);
authRouter.post(
  '/2fa/enable',
  authRateLimiter,
  authenticate,
  requireAuth,
  validate(enable2FaSchema),
  controller.enable2Fa,
);
authRouter.post(
  '/2fa/disable',
  authRateLimiter,
  authenticate,
  requireAuth,
  validate(disable2FaSchema),
  controller.disable2Fa,
);
authRouter.post(
  '/2fa/reset-user/:id',
  authRateLimiter,
  authenticate,
  requireAuth,
  authorize('user.edit.own_branch', 'user.edit.all_branches'),
  validate(resetUser2FaSchema),
  controller.resetUser2Fa,
);
