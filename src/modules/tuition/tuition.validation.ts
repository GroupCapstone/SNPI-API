import { z } from 'zod';

const idSchema = z.string().min(1, 'Resource ID is required');

export const createTuitionFeeSchema = z.object({
  body: z.object({
    schoolId: idSchema,
    branchId: idSchema,
    academicYearId: idSchema,
    programId: idSchema,
    levelId: idSchema,
    feeName: z.string().min(1, 'Fee name is required').trim(),
    feeCode: z.string().min(1, 'Fee code is required').trim().toUpperCase(),
    amount: z.number().min(0, 'Amount cannot be negative'),
    currency: z.enum(['USD', 'KHR']).default('USD'),
    billingCycle: z.enum(['monthly', 'term', 'semester', 'annual']).default('term'),
    description: z.string().trim().optional().or(z.literal('')).nullable(),
    status: z.enum(['active', 'inactive']).default('active'),
  }),
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
});

export const updateTuitionFeeSchema = z.object({
  params: z.object({
    id: idSchema,
  }),
  body: z.object({
    feeName: z.string().min(1).trim().optional(),
    feeCode: z.string().min(1).trim().toUpperCase().optional(),
    amount: z.number().min(0).optional(),
    currency: z.enum(['USD', 'KHR']).optional(),
    billingCycle: z.enum(['monthly', 'term', 'semester', 'annual']).optional(),
    description: z.string().trim().optional().or(z.literal('')).nullable(),
    status: z.enum(['active', 'inactive']).optional(),
  }),
  query: z.object({}).passthrough(),
});

export const queryTuitionFeeSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    schoolId: z.string().optional().or(z.literal('')).or(z.literal('all')),
    branchId: z.string().optional().or(z.literal('')).or(z.literal('all')),
    academicYearId: z.string().optional().or(z.literal('')).or(z.literal('all')),
    programId: z.string().optional().or(z.literal('')).or(z.literal('all')),
    levelId: z.string().optional().or(z.literal('')).or(z.literal('all')),
    status: z.enum(['active', 'inactive']).optional().or(z.literal('')).or(z.literal('all')),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }),
  params: z.object({}).passthrough(),
  body: z.object({}).passthrough(),
});
