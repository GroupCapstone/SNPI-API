import { z } from 'zod';

const idSchema = z.string().regex(/^[a-f\d]{24}$/i, 'A valid resource ID is required');

const scoresSchema = z
  .array(
    z
      .object({
        studentId: idSchema,
        scoreObtained: z.number().min(0, 'Score cannot be negative'),
        isAbsent: z.boolean().default(false),
        remarks: z.string().trim().optional().or(z.literal('')).nullable(),
      })
      .superRefine((value, context) => {
        if (value.isAbsent && value.scoreObtained !== 0) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['scoreObtained'],
            message: 'An absent student must have a score of zero',
          });
        }
      }),
  )
  .min(1, 'At least one student score is required')
  .superRefine((scores, context) => {
    const seen = new Set<string>();
    scores.forEach((score, index) => {
      if (seen.has(score.studentId)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: [index, 'studentId'],
          message: 'Each student may appear only once in a score batch',
        });
      }
      seen.add(score.studentId);
    });
  });

export const batchScoreEntrySchema = z.object({
  body: z.object({
    assessmentId: idSchema,
    scores: scoresSchema,
    reason: z.string().trim().min(3).max(500).optional(),
    correctionRequestId: idSchema.optional(),
  }),
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
});

export const queryScoreSchema = z.object({
  query: z.object({
    assessmentId: idSchema.optional(),
    classId: idSchema.optional(),
    subjectId: idSchema.optional(),
    studentId: idSchema.optional(),
    academicYearId: idSchema.optional(),
    academicPeriodId: idSchema.optional(),
    branchId: idSchema.optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(50),
  }),
  params: z.object({}).passthrough(),
  body: z.object({}).passthrough(),
});
