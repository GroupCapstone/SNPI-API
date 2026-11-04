import { z } from 'zod';

const idSchema = z.string().min(1, 'Resource ID is required');

export const createPaymentSchema = z.object({
  body: z.object({
    schoolId: idSchema,
    branchId: idSchema,
    academicYearId: idSchema,
    academicPeriodId: idSchema.optional(),
    enrollmentId: idSchema.optional(),
    studentId: idSchema,
    tuitionFeeId: idSchema,
    amountDue: z.number().min(0, 'Amount due cannot be negative'),
    discountAmount: z.number().min(0, 'Discount cannot be negative').default(0),
    discountPolicyId: idSchema.optional(),
    discountReason: z.string().trim().min(3).max(500).optional(),
    amountPaid: z.number().min(0, 'Amount paid cannot be negative'),
    currency: z.enum(['USD', 'KHR']).default('USD'),
    paymentMethod: z.enum(['cash', 'aba_pay', 'bank_transfer', 'credit_card', 'wing']),
    paymentDate: z.string().optional(),
    dueDate: z.string().date().optional(),
    billingYear: z.coerce.number().int().min(2020).max(2050).optional(),
    billingMonth: z.coerce.number().int().min(1).max(12).optional(),
    coveragePeriodLabel: z.string().trim().max(100).optional(),
    paymentType: z
      .enum(['tuition_monthly', 'tuition_term', 'registration_fee', 'uniform', 'books', 'other'])
      .default('tuition_monthly'),
    transactionReference: z.string().trim().optional().or(z.literal('')).nullable(),
    remarks: z.string().trim().optional().or(z.literal('')).nullable(),
  }),
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
});

export const updatePaymentSchema = z.object({
  params: z.object({
    id: idSchema,
  }),
  body: z.object({
    status: z.enum(['paid', 'partial', 'pending']).optional(),
    billingYear: z.coerce.number().int().min(2020).max(2050).optional(),
    billingMonth: z.coerce.number().int().min(1).max(12).optional(),
    coveragePeriodLabel: z.string().trim().max(100).optional(),
    paymentType: z
      .enum(['tuition_monthly', 'tuition_term', 'registration_fee', 'uniform', 'books', 'other'])
      .optional(),
    transactionReference: z.string().trim().optional().or(z.literal('')).nullable(),
    remarks: z.string().trim().optional().or(z.literal('')).nullable(),
  }),
  query: z.object({}).passthrough(),
});

export const voidPaymentSchema = z.object({
  params: z.object({ id: idSchema }),
  body: z.object({ reason: z.string().trim().min(3).max(500) }),
  query: z.object({}).passthrough(),
});

export const generateMonthlyInvoicesSchema = z.object({
  body: z.object({
    schoolId: idSchema,
    branchId: idSchema,
    academicYearId: idSchema,
    year: z.coerce.number().int().min(2020).max(2050),
    month: z.coerce.number().int().min(1).max(12),
    dueDay: z.coerce.number().int().min(1).max(28).default(10),
  }),
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
});

export const queryPaymentSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    schoolId: z.string().optional().or(z.literal('')).or(z.literal('all')),
    branchId: z.string().optional().or(z.literal('')).or(z.literal('all')),
    academicYearId: z.string().optional().or(z.literal('')).or(z.literal('all')),
    studentId: z.string().optional().or(z.literal('')).or(z.literal('all')),
    tuitionFeeId: z.string().optional().or(z.literal('')).or(z.literal('all')),
    status: z
      .enum(['paid', 'partial', 'pending', 'voided'])
      .optional()
      .or(z.literal(''))
      .or(z.literal('all')),
    paymentMethod: z
      .enum(['cash', 'aba_pay', 'bank_transfer', 'credit_card', 'wing'])
      .optional()
      .or(z.literal(''))
      .or(z.literal('all')),
    paymentType: z
      .enum(['tuition_monthly', 'tuition_term', 'registration_fee', 'uniform', 'books', 'other'])
      .optional()
      .or(z.literal(''))
      .or(z.literal('all')),
    billingYear: z.coerce.number().int().min(2020).max(2050).optional(),
    billingMonth: z.coerce.number().int().min(1).max(12).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }),
  params: z.object({}).passthrough(),
  body: z.object({}).passthrough(),
});

export const monthlyFinanceSummarySchema = z.object({
  query: z.object({
    branchId: z.string().optional().or(z.literal('')).or(z.literal('all')),
    year: z.coerce.number().int().min(2020).max(2050).default(new Date().getFullYear()),
    month: z.coerce
      .number()
      .int()
      .min(1)
      .max(12)
      .default(new Date().getMonth() + 1),
  }),
  params: z.object({}).passthrough(),
  body: z.object({}).passthrough(),
});

export const debtAgingQuerySchema = z.object({
  query: z.object({
    branchId: z.string().optional().or(z.literal('')).or(z.literal('all')),
    asOfDate: z.string().optional(),
  }),
  params: z.object({}).passthrough(),
  body: z.object({}).passthrough(),
});
