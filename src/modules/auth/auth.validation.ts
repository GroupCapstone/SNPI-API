import { z } from 'zod';
import { loginPayloadSchema } from '../../contracts';

import { PasswordUtil } from '../../utils/password';

export const loginSchema = z.object({
  body: loginPayloadSchema,
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
});

export const changePasswordSchema = z.object({
  body: z
    .object({
      currentPassword: z.string().min(1, 'Current password is required'),
      newPassword: z
        .string()
        .min(8, 'New password must be at least 8 characters long')
        .regex(/[A-Z]/, 'New password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'New password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'New password must contain at least one number')
        .regex(/[^a-zA-Z0-9]/, 'New password must contain at least one special character')
        .refine((val) => !PasswordUtil.isWeakCommonPassword(val), {
          message: 'Password is too common or easily guessable',
        }),
      confirmPassword: z.string().min(1, 'Confirm password is required'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: 'New password and confirm password do not match',
      path: ['confirmPassword'],
    }),
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
});

export const refreshTokenSchema = z.object({
  body: z.object({}).strict(),
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
});

export const verify2FaSchema = z.object({
  body: z.object({
    mfaToken: z.string().min(1, 'MFA token is required'),
    code: z.string().min(6, 'Verification code or backup code is required'),
  }),
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
});

export const enable2FaSchema = z.object({
  body: z.object({
    code: z.string().length(6, '6-digit TOTP verification code is required'),
  }),
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
});

export const disable2FaSchema = z.object({
  body: z.object({
    password: z.string().min(1, 'Password is required to disable 2FA'),
    code: z.string().min(6, 'Current 2FA code or backup code is required'),
  }),
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
});

export const resetUser2FaSchema = z.object({
  body: z.object({}).passthrough(),
  params: z.object({
    id: z.string().min(1, 'Target user ID is required'),
  }),
  query: z.object({}).passthrough(),
});

export const requestTelegramOtpSchema = z.object({
  body: z.object({
    mfaToken: z.string().min(1, 'MFA token is required'),
  }),
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
});

export const linkTelegramSchema = z.object({
  body: z.object({
    telegramChatId: z.string().min(1, 'Telegram Chat ID is required'),
  }),
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
});
