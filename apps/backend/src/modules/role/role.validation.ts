import { z } from 'zod';

export const createRoleSchema = z.object({
  body: z.object({
    code: z
      .string()
      .trim()
      .min(2, 'Role code must be at least 2 characters')
      .max(50, 'Role code cannot exceed 50 characters')
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        'Role code can only contain alphanumeric characters, underscores, and hyphens',
      ),
    nameEn: z.string().trim().min(2, 'English role name must be at least 2 characters').max(100),
    nameKh: z.string().trim().max(100).optional(),
    description: z.string().trim().max(500).optional(),
    permissions: z.array(z.string()).default([]),
    status: z.enum(['active', 'inactive']).default('active'),
  }),
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
});

export const updateRoleSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Role ID is required'),
  }),
  body: z.object({
    nameEn: z.string().trim().min(2).max(100).optional(),
    nameKh: z.string().trim().max(100).optional(),
    description: z.string().trim().max(500).optional(),
    permissions: z.array(z.string()).optional(),
    status: z.enum(['active', 'inactive']).optional(),
  }),
  query: z.object({}).passthrough(),
});

export const queryRoleSchema = z.object({
  query: z.object({
    search: z.string().trim().optional(),
    status: z.enum(['active', 'inactive']).optional(),
    isSystem: z
      .string()
      .optional()
      .transform((val) => (val === 'true' ? true : val === 'false' ? false : undefined)),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(50),
  }),
  params: z.object({}).passthrough(),
  body: z.object({}).passthrough(),
});
