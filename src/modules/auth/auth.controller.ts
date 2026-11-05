import type { z } from 'zod';
import type { CookieOptions, NextFunction, Request, Response } from 'express';

import { getValidatedInput } from '../../middleware/validate';
import { env } from '../../config/env';
import type { AuthenticatedRequest } from '../../types/auth';
import { AuthService } from './auth.service';

const REFRESH_COOKIE_NAME = 'refreshToken';

const DEFAULT_REFRESH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

const refreshTokenMaxAge = (expiresIn: string): number => {
  const normalized = expiresIn.trim();
  const numericSeconds = Number(normalized);
  if (Number.isFinite(numericSeconds) && numericSeconds > 0) {
    return numericSeconds * 1000;
  }

  const match = /^(\d+(?:\.\d+)?)(s|m|h|d|w)$/i.exec(normalized);
  if (!match) {
    return DEFAULT_REFRESH_COOKIE_MAX_AGE;
  }

  const amount = Number(match[1]);
  const unit = match[2]?.toLowerCase() ?? '';
  const multiplier = (
    {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
      w: 7 * 24 * 60 * 60 * 1000,
    } as Record<string, number>
  )[unit];

  return multiplier ? amount * multiplier : DEFAULT_REFRESH_COOKIE_MAX_AGE;
};

const getRefreshCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: refreshTokenMaxAge(env.JWT_REFRESH_EXPIRES_IN),
  path: '/',
});

import type {
  changePasswordSchema,
  disable2FaSchema,
  enable2FaSchema,
  linkTelegramSchema,
  loginSchema,
  requestTelegramOtpSchema,
  verify2FaSchema,
} from './auth.validation';

export class AuthController {
  public constructor(private readonly service = new AuthService()) {}

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.service.login(
        getValidatedInput<z.infer<typeof loginSchema>>(res).body,
        {
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
        },
      );

      if ('mfaToken' in result) {
        res.status(200).json({
          success: true,
          message: 'Two-factor authentication required',
          data: {
            mfaRequired: true,
            mfaToken: result.mfaToken,
            telegramAvailable: result.telegramAvailable,
          },
        });
        return;
      }

      res.cookie(REFRESH_COOKIE_NAME, result.refreshToken, getRefreshCookieOptions());

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const rawRefreshToken =
        (req.cookies as Record<string, string> | undefined)?.[REFRESH_COOKIE_NAME] || '';

      const result = await this.service.refreshToken(rawRefreshToken, {
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      });

      res.cookie(REFRESH_COOKIE_NAME, result.refreshToken, getRefreshCookieOptions());

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public logout = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (req.user?.userId) {
        await this.service.logout(req.user.userId, {
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
        });
      }

      res.clearCookie(REFRESH_COOKIE_NAME, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      });

      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  public getMe = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const user = await this.service.getCurrentUser(req.user!.userId);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  public changePassword = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      await this.service.changePassword(
        req.user!.userId,
        getValidatedInput<z.infer<typeof changePasswordSchema>>(res).body,
        {
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
        },
      );

      res.clearCookie(REFRESH_COOKIE_NAME, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      });

      res.status(200).json({
        success: true,
        message: 'Password changed successfully. Please sign in with your new password.',
      });
    } catch (error) {
      next(error);
    }
  };

  public setup2Fa = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.service.setup2Fa(req.user!.userId);

      res.status(200).json({
        success: true,
        message: 'Two-factor authentication setup initialized',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  public enable2Fa = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.service.enable2Fa(
        req.user!.userId,
        getValidatedInput<z.infer<typeof enable2FaSchema>>(res).body.code,
        {
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
        },
      );

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  };

  public verify2Fa = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.service.verify2Fa(
        getValidatedInput<z.infer<typeof verify2FaSchema>>(res).body,
        {
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
        },
      );

      res.cookie(REFRESH_COOKIE_NAME, result.refreshToken, getRefreshCookieOptions());

      res.status(200).json({
        success: true,
        message: 'Two-factor verification successful',
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public disable2Fa = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.service.disable2Fa(
        req.user!.userId,
        getValidatedInput<z.infer<typeof disable2FaSchema>>(res).body,
        {
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
        },
      );

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  };

  public resetUser2Fa = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const targetUserId = req.params.id as string;
      const result = await this.service.resetUser2Fa(targetUserId, req.user!.userId, {
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      });

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  };

  public requestTelegramOtp = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.service.requestTelegram2FaOtp(
        getValidatedInput<z.infer<typeof requestTelegramOtpSchema>>(res).body,
        {
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
        },
      );

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  };

  public linkTelegram = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.service.linkTelegram(
        req.user!.userId,
        getValidatedInput<z.infer<typeof linkTelegramSchema>>(res).body.telegramChatId,
      );

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  };

  public unlinkTelegram = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.service.unlinkTelegram(req.user!.userId);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  };
}
