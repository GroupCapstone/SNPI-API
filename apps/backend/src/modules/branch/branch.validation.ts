import { z } from 'zod';

const emailSchema = z.preprocess(
  (v) => (typeof v === 'string' ? v.trim() : v),
  z.string().email('Invalid email address').optional().or(z.literal('')).nullable(),
);

export const createBranchSchema = z.object({
  body: z.object({
    schoolId: z.string().min(1, 'School ID is required'),
    branchCode: z
      .string()
      .min(1, 'Branch code is required')
      .max(20, 'Branch code cannot exceed 20 characters')
      .trim()
      .toUpperCase(),
    branchNameEn: z.string().min(1, 'English name is required').trim(),
    branchNameKh: z.string().min(1, 'Khmer name is required').trim(),
    address: z.string().trim().optional().or(z.literal('')).nullable(),
    phone: z.string().trim().optional().or(z.literal('')).nullable(),
    email: emailSchema,
    managerId: z.string().optional().or(z.literal('')).nullable(),
    openingDate: z.string().optional().or(z.literal('')).nullable(),
    status: z.enum(['active', 'inactive', 'closed']).default('active'),
  }),
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
});

export const updateBranchSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Branch ID is required'),
  }),
  body: z.object({
    schoolId: z.string().optional(),
    branchCode: z.string().min(1).max(20).trim().toUpperCase().optional(),
    branchNameEn: z.string().min(1).trim().optional(),
    branchNameKh: z.string().min(1).trim().optional(),
    address: z.string().trim().optional().or(z.literal('')).nullable(),
    phone: z.string().trim().optional().or(z.literal('')).nullable(),
    email: emailSchema,
    managerId: z.string().nullable().optional().or(z.literal('')),
    openingDate: z.string().nullable().optional().or(z.literal('')),
    status: z.enum(['active', 'inactive', 'closed']).optional(),
  }),
  query: z.object({}).passthrough(),
});

export const queryBranchSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    schoolId: z.string().optional().or(z.literal('')).or(z.literal('all')),
    status: z
      .enum(['active', 'inactive', 'closed'])
      .optional()
      .or(z.literal(''))
      .or(z.literal('all')),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(500).default(20),
  }),
  params: z.object({}).passthrough(),
  body: z.object({}).passthrough(),
});
