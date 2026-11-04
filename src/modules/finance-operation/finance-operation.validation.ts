import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'A valid resource ID is required');
const currencyTotals = z.object({ USD: z.number().min(0), KHR: z.number().min(0) });

export const createDiscountPolicySchema = z.object({
  body: z
    .object({
      branchId: objectId,
      code: z.string().trim().min(2).max(30).toUpperCase(),
      name: z.string().trim().min(2).max(150),
      type: z.enum(['sibling', 'merit', 'early_payment', 'scholarship']),
      calculationType: z.enum(['percentage', 'fixed']),
      value: z.number().positive(),
      maximumAmount: z.number().positive().optional(),
      minimumGpa: z.number().min(0).max(4).optional(),
      minimumSiblingCount: z.number().int().min(2).optional(),
      paymentDaysBeforeDue: z.number().int().min(0).optional(),
      effectiveFrom: z.string().date(),
      effectiveTo: z.string().date().optional(),
    })
    .superRefine((value, context) => {
      if (value.calculationType === 'percentage' && value.value > 100) {
        context.addIssue({
          code: 'custom',
          path: ['value'],
          message: 'Percentage cannot exceed 100',
        });
      }
      if (value.effectiveTo && value.effectiveTo < value.effectiveFrom) {
        context.addIssue({
          code: 'custom',
          path: ['effectiveTo'],
          message: 'Effective end cannot be before start',
        });
      }
    }),
});

export const financeOperationQuerySchema = z.object({
  query: z.object({
    branchId: objectId.optional(),
    status: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
  }),
});

export const openCashierShiftSchema = z.object({
  body: z.object({
    branchId: objectId,
    openingCash: currencyTotals,
    notes: z.string().trim().max(1000).optional(),
  }),
});

export const closeCashierShiftSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    declaredCash: currencyTotals,
    declaredDigital: currencyTotals,
    notes: z.string().trim().max(1000).optional(),
  }),
});

export const approveCashierShiftSchema = z.object({ params: z.object({ id: objectId }) });
