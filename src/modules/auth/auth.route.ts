import { Router } from 'express';

import { authenticate, requireAuth } from '../../middleware/authenticate';
import { createAuthRateLimiter, createLoginRateLimiter } from '../../middleware/security';
import { validate } from '../../middleware/validate';
import { AuthController } from './auth.controller';
import { changePasswordSchema, loginSchema, refreshTokenSchema } from './auth.validation';

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
