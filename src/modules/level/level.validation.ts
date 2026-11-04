import { z } from 'zod';

export const createLevelSchema = z.object({
  body: z.object({
    schoolId: z.string().optional(),
    branchId: z.string().optional(),
    programId: z.string().min(1, 'Program ID is required'),
    code: z
      .string()
      .min(1, 'Level code cannot be empty')
      .max(20, 'Level code cannot exceed 20 characters')
      .trim()
      .toUpperCase(),
    name: z.string().min(1, 'Level name is required').trim(),
    description: z.string().optional(),
    sequence: z.coerce.number().int().min(1, 'Sequence must be at least 1').default(1),
    status: z.enum(['active', 'inactive', 'archived']).default('active'),
  }),
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
});

export const updateLevelSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Level ID is required'),
  }),
  body: z.object({
    programId: z.string().optional(),
    branchId: z.string().optional(),
    code: z.string().min(1).max(20).trim().toUpperCase().optional(),
    name: z.string().min(1).trim().optional(),
    description: z.string().optional(),
    sequence: z.coerce.number().int().min(1).optional(),
    status: z.enum(['active', 'inactive', 'archived']).optional(),
  }),
  query: z.object({}).passthrough(),
});

export const queryLevelSchema = z.object({
  query: z.object({
    programId: z.string().optional(),
    search: z.string().optional(),
    branchId: z.string().optional(),
    status: z.enum(['active', 'inactive', 'archived']).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }),
  params: z.object({}).passthrough(),
  body: z.object({}).passthrough(),
});
