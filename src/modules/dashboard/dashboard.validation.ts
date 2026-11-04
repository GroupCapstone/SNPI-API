import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const dashboardActionItemsQuerySchema = z.object({
  body: z.object({}).passthrough(),
  params: z.object({}).passthrough(),
  query: z.object({
    branchId: z.string().regex(objectIdRegex, 'Invalid Branch ID').optional(),
    academicYearId: z.string().regex(objectIdRegex, 'Invalid Academic Year ID').optional(),
  }),
});

export const dashboardPulseQuerySchema = z.object({
  body: z.object({}).passthrough(),
  params: z.object({}).passthrough(),
  query: z.object({
    branchId: z
      .string()
      .regex(objectIdRegex, 'Invalid Branch ID')
      .optional()
      .or(z.literal(''))
      .or(z.literal('all')),
    academicYearId: z
      .string()
      .regex(objectIdRegex, 'Invalid Academic Year ID')
      .optional()
      .or(z.literal('')),
    year: z.coerce.number().int().min(2000).max(2100).optional(),
    month: z.coerce.number().int().min(1).max(12).optional(),
  }),
});

export const academicHonorRollQuerySchema = z.object({
  body: z.object({}).passthrough(),
  params: z.object({}).passthrough(),
  query: z.object({
    branchId: z
      .string()
      .regex(objectIdRegex, 'Invalid Branch ID')
      .optional()
      .or(z.literal(''))
      .or(z.literal('all')),
    academicYearId: z
      .string()
      .regex(objectIdRegex, 'Invalid Academic Year ID')
      .optional()
      .or(z.literal('')),
    academicPeriodId: z
      .string()
      .regex(objectIdRegex, 'Invalid Academic Period ID')
      .optional()
      .or(z.literal('')),
    classId: z.string().regex(objectIdRegex, 'Invalid Class ID').optional().or(z.literal('')),
    limit: z.coerce.number().int().min(1).max(50).optional(),
  }),
});
