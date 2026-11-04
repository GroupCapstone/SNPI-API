import { z } from 'zod';

export const createPositionSchema = z.object({
  body: z.object({
    schoolId: z.string().min(1, 'School ID is required'),
    branchId: z.string().min(1, 'Branch ID is required'),
    departmentId: z.string().min(1, 'Department ID is required'),
    code: z
      .string()
      .min(1, 'Position code is required')
      .max(20, 'Position code cannot exceed 20 characters')
      .trim()
      .toUpperCase(),
    nameEn: z.string().min(1, 'English name is required').trim(),
    nameKh: z.string().min(1, 'Khmer name is required').trim(),
    description: z.string().optional(),
    status: z.enum(['active', 'inactive']).default('active'),
  }),
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
});

export const updatePositionSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Position ID is required'),
  }),
  body: z.object({
    schoolId: z.string().optional(),
    branchId: z.string().optional(),
    departmentId: z.string().optional(),
    code: z.string().min(1).max(20).trim().toUpperCase().optional(),
    nameEn: z.string().min(1).trim().optional(),
    nameKh: z.string().min(1).trim().optional(),
    description: z.string().optional(),
    status: z.enum(['active', 'inactive']).optional(),
  }),
  query: z.object({}).passthrough(),
});

export const queryPositionSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    schoolId: z.string().optional().or(z.literal('')).or(z.literal('all')),
    branchId: z.string().optional().or(z.literal('')).or(z.literal('all')),
    departmentId: z.string().optional().or(z.literal('')).or(z.literal('all')),
    status: z.enum(['active', 'inactive']).optional().or(z.literal('')).or(z.literal('all')),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(500).default(20),
  }),
  params: z.object({}).passthrough(),
  body: z.object({}).passthrough(),
});
