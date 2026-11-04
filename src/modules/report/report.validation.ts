import { z } from 'zod';

import { OFFICIAL_DOCUMENT_TYPES } from './report.model';

const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid resource ID');

export const reportResourceValidationSchema = z.object({
  params: z.object({ id: objectIdSchema }),
});

export const reportDocumentValidationSchema = z.object({
  params: z.object({ id: objectIdSchema }),
});

export const certificateVerificationValidationSchema = z.object({
  params: z.object({
    code: z
      .string()
      .trim()
      .toUpperCase()
      .regex(/^CRT-\d{8}$/, 'Invalid certificate code'),
  }),
});

export const reportQueryValidationSchema = z.object({
  query: z.object({
    type: z.enum(OFFICIAL_DOCUMENT_TYPES).optional(),
    branchId: objectIdSchema.optional(),
    studentId: objectIdSchema.optional(),
    status: z.enum(['active', 'voided']).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
  }),
});

export const monthlyReportQueryValidationSchema = z.object({
  query: z.object({
    paymentCurrency: z.enum(['USD', 'KHR']).default('USD'),
    year: z.coerce
      .number()
      .int()
      .min(2000)
      .max(2100)
      .default(() => new Date().getFullYear()),
    month: z.coerce.number().int().min(1).max(12).optional(),
    search: z.string().trim().optional(),
    branchId: objectIdSchema.optional(),
    academicYearId: objectIdSchema.optional(),
    classId: objectIdSchema.optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(200).default(100),
  }),
});
