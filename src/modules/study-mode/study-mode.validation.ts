import { z } from 'zod';

export const createStudyModeSchema = z.object({
  schoolId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid School ID format')
    .optional(),
  code: z
    .string()
    .min(2, 'Code must be at least 2 characters')
    .max(20, 'Code cannot exceed 20 characters')
    .toUpperCase()
    .trim(),
  nameEn: z.string().min(1, 'English name is required').max(100).trim(),
  nameKh: z.string().min(1, 'Khmer name is required').max(100).trim(),
  description: z.string().max(500).optional(),
  sortOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const updateStudyModeSchema = z.object({
  nameEn: z.string().min(1).max(100).trim().optional(),
  nameKh: z.string().min(1).max(100).trim().optional(),
  description: z.string().max(500).optional(),
  sortOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export const queryStudyModeSchema = z.object({
  schoolId: z.string().optional(),
  search: z.string().optional(),
  isActive: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

const emptyBody = z.object({}).passthrough();
const emptyQuery = z.object({}).passthrough();
const idParams = z.object({ id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Study Mode ID') });

export const createStudyModeRequestSchema = z.object({
  body: createStudyModeSchema,
  params: z.object({}).passthrough(),
  query: emptyQuery,
});
export const updateStudyModeRequestSchema = z.object({
  body: updateStudyModeSchema,
  params: idParams,
  query: emptyQuery,
});
export const queryStudyModeRequestSchema = z.object({
  body: emptyBody,
  params: z.object({}).passthrough(),
  query: queryStudyModeSchema,
});
export const studyModeIdRequestSchema = z.object({
  body: emptyBody,
  params: idParams,
  query: emptyQuery,
});
