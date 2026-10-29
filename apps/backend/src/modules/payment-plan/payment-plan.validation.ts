import { z } from 'zod';

const id = z.string().regex(/^[a-f\d]{24}$/i, 'A valid resource ID is required');
const installment = z.object({
  dueDate: z.string().date(),
  amount: z.number().positive(),
});

export const createPaymentPlanSchema = z.object({
  body: z.object({
    schoolId: id,
    branchId: id,
    academicYearId: id,
    academicPeriodId: id.optional(),
    enrollmentId: id,
    studentId: id,
    tuitionFeeId: id,
    totalAmount: z.number().positive(),
    currency: z.enum(['USD', 'KHR']),
    installments: z.array(installment).min(2).max(24),
    notes: z.string().trim().max(1000).optional(),
  }),
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
});

export const queryPaymentPlanSchema = z.object({
  query: z.object({
    search: z.string().trim().max(100).optional(),
    branchId: id.optional().or(z.literal('all')),
    academicYearId: id.optional().or(z.literal('all')),
    studentId: id.optional().or(z.literal('all')),
    enrollmentId: id.optional().or(z.literal('all')),
    status: z.enum(['active', 'completed', 'cancelled']).optional().or(z.literal('all')),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }),
  params: z.object({}).passthrough(),
  body: z.object({}).passthrough(),
});

export const cancelPaymentPlanSchema = z.object({
  params: z.object({ id }),
  body: z.object({ reason: z.string().trim().min(3).max(500) }),
  query: z.object({}).passthrough(),
});

export const payInstallmentSchema = z.object({
  params: z.object({ id, sequence: z.coerce.number().int().min(1).max(24) }),
  body: z.object({
    paymentMethod: z.enum(['cash', 'aba_pay', 'bank_transfer', 'credit_card', 'wing']),
    paymentDate: z.string().date(),
    transactionReference: z.string().trim().max(200).optional(),
  }),
});
