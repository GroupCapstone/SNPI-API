import { z } from 'zod';

import { PasswordUtil } from '../../utils/password';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character')
  .refine((val) => !PasswordUtil.isWeakCommonPassword(val), {
    message: 'Password is too common or easily guessable',
  });

export const createUserSchema = z.object({
  body: z.object({
    schoolId: z.string().min(1, 'School ID is required'),
    employeeId: z.string().optional().or(z.literal('')),
    username: z
      .string()
      .trim()
      .min(3, 'Username must be at least 3 characters')
      .max(50, 'Username cannot exceed 50 characters')
      .regex(
        /^[a-zA-Z0-9._-]+$/,
        'Username can only contain alphanumeric characters, dots, underscores, and hyphens',
      ),
    email: z.string().trim().email('Invalid email address'),
    password: passwordSchema,
    roles: z.array(z.string()).min(1, 'At least one role must be assigned'),
    branchAccess: z.union([z.literal('all'), z.array(z.string())]),
    departmentAccess: z.union([z.literal('all'), z.array(z.string())]).optional(),
    directPermissions: z.array(z.string()).optional(),
    status: z.enum(['active', 'inactive', 'locked', 'suspended']).default('active'),
    mustChangePassword: z.boolean().optional(),
  }),
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
});

export const updateUserSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'User ID is required'),
  }),
  body: z.object({
    schoolId: z.string().optional().or(z.literal('')),
    employeeId: z.string().optional().or(z.literal('')),
    username: z
      .string()
      .trim()
      .min(3)
      .max(50)
      .regex(/^[a-zA-Z0-9._-]+$/)
      .optional(),
    email: z.string().trim().email('Invalid email address').optional(),
    password: passwordSchema.optional().or(z.literal('')),
    roles: z.array(z.string()).min(1).optional(),
    branchAccess: z.union([z.literal('all'), z.array(z.string())]).optional(),
    departmentAccess: z.union([z.literal('all'), z.array(z.string())]).optional(),
    directPermissions: z.array(z.string()).optional(),
    status: z.enum(['active', 'inactive', 'locked', 'suspended']).optional(),
    mustChangePassword: z.boolean().optional(),
  }),
  query: z.object({}).passthrough(),
});

export const queryUserSchema = z.object({
  query: z.object({
    search: z.string().trim().optional(),
    schoolId: z.string().optional().or(z.literal('')).or(z.literal('all')),
    branchId: z.string().optional().or(z.literal('')).or(z.literal('all')),
    role: z.string().optional().or(z.literal('')).or(z.literal('all')),
    status: z
      .enum(['active', 'inactive', 'locked', 'suspended'])
      .optional()
      .or(z.literal(''))
      .or(z.literal('all')),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }),
  params: z.object({}).passthrough(),
  body: z.object({}).passthrough(),
});

export const adminResetPasswordSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'User ID is required'),
  }),
  body: z.object({
    temporaryPassword: passwordSchema.optional().or(z.literal('')),
  }),
  query: z.object({}).passthrough(),
});

export const updateUserStatusSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'User ID is required'),
  }),
  body: z.object({
    status: z.enum(['active', 'inactive', 'locked', 'suspended']),
  }),
  query: z.object({}).passthrough(),
});
