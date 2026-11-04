import { z } from 'zod';

export const createProgramSchema = z.object({
  body: z.object({
    schoolId: z.string().optional(),
    branchId: z.string().optional(),
    branchAvailability: z
      .union([z.literal('all'), z.array(z.string())])
      .default('all')
      .optional(),
    code: z
      .string()
      .min(1, 'Program code cannot be empty')
      .max(20, 'Program code cannot exceed 20 characters')
      .trim()
      .toUpperCase(),
    nameKh: z.string().min(1, 'Khmer name is required').trim(),
    nameEn: z.string().min(1, 'English name is required').trim(),
    shortName: z.string().trim().optional(),
    description: z.string().optional(),
    displayOrder: z.coerce.number().int().default(0).optional(),
    resultCalculationType: z
      .enum(['total_score', 'average', 'percentage', 'letter_grade', 'gpa', 'credit_gpa'])
      .default('average')
      .optional(),
    status: z.enum(['active', 'inactive', 'archived']).default('active'),
  }),
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
});

export const updateProgramSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Program ID is required'),
  }),
  body: z.object({
    branchId: z.string().optional(),
    branchAvailability: z.union([z.literal('all'), z.array(z.string())]).optional(),
    code: z.string().min(1).max(20).trim().toUpperCase().optional(),
    nameKh: z.string().min(1).trim().optional(),
    nameEn: z.string().min(1).trim().optional(),
    shortName: z.string().trim().optional(),
    description: z.string().optional(),
    displayOrder: z.coerce.number().int().optional(),
    resultCalculationType: z
      .enum(['total_score', 'average', 'percentage', 'letter_grade', 'gpa', 'credit_gpa'])
      .optional(),
    status: z.enum(['active', 'inactive', 'archived']).optional(),
  }),
  query: z.object({}).passthrough(),
});

export const queryProgramSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    branchId: z.string().optional(),
    status: z.enum(['active', 'inactive', 'archived']).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }),
  params: z.object({}).passthrough(),
  body: z.object({}).passthrough(),
});
