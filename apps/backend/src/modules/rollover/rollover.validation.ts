import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const objectIdSchema = z.string().regex(objectIdRegex, 'Invalid ObjectId');

export const createRolloverPlanSchema = z.object({
  body: z.object({
    schoolId: objectIdSchema.optional(),
    branchId: objectIdSchema,
    programId: objectIdSchema.optional(),
    sourceAcademicYearId: objectIdSchema,
    sourcePeriodId: objectIdSchema,
    targetAcademicYearId: objectIdSchema,
    targetPeriodId: objectIdSchema,
    options: z
      .object({
        carryClasses: z.boolean().default(true),
        carryTeacherSuggestions: z.boolean().default(true),
        carryScheduleSuggestions: z.boolean().default(true),
        autoSectionDistribution: z.boolean().default(false),
      })
      .optional(),
  }),
});

export const updateRolloverPlanSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z.object({
    options: z
      .object({
        carryClasses: z.boolean().optional(),
        carryTeacherSuggestions: z.boolean().optional(),
        carryScheduleSuggestions: z.boolean().optional(),
        autoSectionDistribution: z.boolean().optional(),
      })
      .optional(),
    classMappings: z
      .array(
        z.object({
          sourceClassId: objectIdSchema,
          targetClassId: objectIdSchema.optional(),
          targetClassName: z.string().trim().min(1).max(100),
          targetClassCode: z.string().trim().min(1).max(50).toUpperCase(),
          targetProgramId: objectIdSchema,
          targetLevelId: objectIdSchema,
          targetSection: z.string().trim().min(1).max(10).toUpperCase(),
          targetCapacity: z.number().int().min(1).max(200).optional(),
          action: z.enum(['CREATE_NEW', 'MAP_EXISTING', 'SKIP']).default('CREATE_NEW'),
        }),
      )
      .optional(),
    studentDecisions: z
      .array(
        z.object({
          studentId: objectIdSchema,
          sourceEnrollmentId: objectIdSchema.optional(),
          systemRecommendedDecision: z
            .enum([
              'PROMOTE',
              'CONTINUE',
              'REPEAT',
              'TRANSFER',
              'GRADUATE',
              'WITHDRAW',
              'HOLD',
              'NO_ACTION',
            ])
            .optional(),
          finalDecision: z
            .enum([
              'PROMOTE',
              'CONTINUE',
              'REPEAT',
              'TRANSFER',
              'GRADUATE',
              'WITHDRAW',
              'HOLD',
              'NO_ACTION',
            ])
            .optional(),
          decision: z
            .enum([
              'PROMOTE',
              'CONTINUE',
              'REPEAT',
              'TRANSFER',
              'GRADUATE',
              'WITHDRAW',
              'HOLD',
              'NO_ACTION',
            ])
            .optional(),
          targetClassId: objectIdSchema.optional(),
          targetLevelId: objectIdSchema.optional(),
          targetProgramId: objectIdSchema.optional(),
          targetBranchId: objectIdSchema.optional(),
          reason: z.string().trim().max(500).optional(),
        }),
      )
      .optional(),
  }),
});

export const executeRolloverPlanSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z.object({
    idempotencyKey: z.string().trim().min(1).max(100).optional(),
    closeSourcePeriod: z.boolean().default(true),
  }),
});

export const queryRolloverPlansSchema = z.object({
  query: z.object({
    schoolId: objectIdSchema.optional(),
    branchId: objectIdSchema.optional(),
    programId: objectIdSchema.optional(),
    sourcePeriodId: objectIdSchema.optional(),
    targetPeriodId: objectIdSchema.optional(),
    status: z
      .enum(['draft', 'validated', 'approved', 'executing', 'completed', 'failed', 'cancelled'])
      .optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }),
});
