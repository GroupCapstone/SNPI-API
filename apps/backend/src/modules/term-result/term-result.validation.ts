import { z } from 'zod';

export const termResultStatusEnum = z.enum(['PASSED', 'FAILED']);
export const promotionStatusEnum = z.enum(['PROMOTED', 'REPEAT', 'CONTINUE', 'COMPLETED']);
export const termResultWorkflowStatusEnum = z.enum([
  'CALCULATED',
  'SUBMITTED',
  'REVIEWED',
  'APPROVED',
  'FINALIZED',
  'CORRECTED',
]);

export const generateTermResultValidationSchema = z.object({
  body: z.object({
    enrollmentId: z.string().min(1, 'Enrollment ID is required'),
  }),
});

export const calculateClassTermResultsValidationSchema = z.object({
  body: z.object({
    classId: z.string().min(1, 'Class ID is required'),
  }),
});

export const completeTermValidationSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Term Result ID is required'),
  }),
  body: z
    .object({
      nextPeriodId: z.string().optional(),
      nextClassId: z.string().optional(),
      remarks: z.string().optional(),
    })
    .refine((data) => Boolean(data.nextPeriodId) === Boolean(data.nextClassId), {
      message: 'nextPeriodId and nextClassId must be provided together',
      path: ['nextClassId'],
    }),
});

export const transitionTermResultValidationSchema = z.object({
  params: z.object({ id: z.string().min(1, 'Term Result ID is required') }),
  body: z.object({
    status: z.enum(['SUBMITTED', 'REVIEWED', 'APPROVED']),
    reason: z.string().trim().min(3).max(500).optional(),
  }),
});

export const queryTermResultValidationSchema = z.object({
  query: z.object({
    branchId: z.string().optional(),
    academicYearId: z.string().optional(),
    academicPeriodId: z.string().optional(),
    programId: z.string().optional(),
    levelId: z.string().optional(),
    classId: z.string().optional(),
    studentId: z.string().optional(),
    resultStatus: termResultStatusEnum.optional(),
    promotionStatus: promotionStatusEnum.optional(),
    workflowStatus: termResultWorkflowStatusEnum.optional(),
    isCompleted: z.preprocess(
      (val) =>
        val === 'true' || val === true
          ? true
          : val === 'false' || val === false
            ? false
            : undefined,
      z.boolean().optional(),
    ),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(50),
  }),
});
