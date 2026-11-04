import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const objectIdSchema = z.string().regex(objectIdRegex, 'Invalid ObjectId');

const remarks = z.string().trim().max(500).optional();
const nonNegative = z.number().finite().nonnegative();
export const correctionValueSchemas = {
  score: z
    .object({
      scoreObtained: nonNegative.optional(),
      isAbsent: z.boolean().optional(),
      remarks,
    })
    .strict(),
  attendance: z
    .object({
      status: z.enum(['present', 'absent', 'late', 'excused', 'permission']).optional(),
      remarks,
    })
    .strict(),
  term_result: z
    .object({
      totalScore: nonNegative.optional(),
      averageScore: nonNegative.max(100).optional(),
      gpa: nonNegative.max(4).optional(),
      letterGrade: z.enum(['A', 'B', 'C', 'D', 'E', 'F']).optional(),
      resultStatus: z.enum(['PASSED', 'FAILED']).optional(),
      promotionStatus: z.enum(['PROMOTED', 'REPEAT', 'CONTINUE', 'COMPLETED']).optional(),
      remarks,
    })
    .strict(),
};

export function validateCorrectionValue(
  entityType: keyof typeof correctionValueSchemas,
  value: Record<string, unknown>,
) {
  const schema = correctionValueSchemas[entityType] as z.ZodObject<z.ZodRawShape>;
  return schema
    .refine(
      (data: Record<string, unknown>) => Object.values(data).some((item) => item !== undefined),
      {
        message: 'At least one supported correction field is required',
      },
    )
    .safeParse(value);
}

export const requestCorrectionSchema = z.object({
  body: z
    .object({
      entityType: z.enum(['score', 'term_result', 'attendance']),
      entityId: objectIdSchema,
      reason: z
        .string()
        .trim()
        .min(10, 'Reason must be at least 10 characters')
        .max(500, 'Reason cannot exceed 500 characters'),
      proposedValue: z.record(z.string(), z.unknown()),
    })
    .superRefine((data, context) => {
      const result = validateCorrectionValue(data.entityType, data.proposedValue);
      if (!result.success) {
        for (const issue of result.error.issues) {
          context.addIssue({
            code: 'custom',
            path: ['proposedValue', ...issue.path],
            message: issue.message,
          });
        }
      }
    }),
});

export const reviewCorrectionSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z.object({
    status: z.enum(['approved', 'rejected', 'cancelled']),
    reviewRemarks: z.string().trim().max(1000).optional(),
    unlockDurationMinutes: z.coerce.number().int().min(5).max(1440).default(60),
  }),
});

export const applyCorrectionSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z.object({
    unlockToken: z.string().min(10, 'Valid unlock token is required'),
    correctedValue: z.record(z.string(), z.unknown()),
    remarks: z.string().trim().max(1000).optional(),
  }),
});

export const queryHistoricalCorrectionsSchema = z.object({
  query: z.object({
    entityType: z.enum(['score', 'term_result', 'attendance']).optional(),
    entityId: objectIdSchema.optional(),
    studentId: objectIdSchema.optional(),
    branchId: objectIdSchema.optional(),
    academicYearId: objectIdSchema.optional(),
    academicPeriodId: objectIdSchema.optional(),
    status: z.enum(['pending', 'approved', 'rejected', 'applied', 'cancelled']).optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
  }),
});
