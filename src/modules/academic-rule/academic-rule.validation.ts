import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const objectIdSchema = z.string().regex(objectIdRegex, 'Invalid ObjectId');

const gradeBandSchema = z.object({
  minimum: z.number().min(0).max(100),
  grade: z.enum(['A', 'B', 'C', 'D', 'E', 'F']),
  gpa: z.number().min(0).max(4),
  labelKh: z.string().trim().max(120).optional(),
});

export const academicRuleConfigSchemas = {
  grade_scheme: z
    .object({ bands: z.array(gradeBandSchema).min(2).max(20) })
    .strict()
    .superRefine((config, context) => {
      const minimums = config.bands.map((band) => band.minimum);
      if (!minimums.includes(0)) {
        context.addIssue({
          code: 'custom',
          path: ['bands'],
          message: 'Grade bands must include 0',
        });
      }
      if (new Set(minimums).size !== minimums.length) {
        context.addIssue({
          code: 'custom',
          path: ['bands'],
          message: 'Grade minimums must be unique',
        });
      }
    }),
  assessment_scheme: z.object({ requirePublishedAssessments: z.boolean().default(true) }).strict(),
  attendance_threshold: z.object({ minimumAttendanceRate: z.number().min(0).max(100) }).strict(),
  promotion_rule: z
    .object({
      passingAverage: z.number().min(0).max(100),
      minimumAttendanceRate: z.number().min(0).max(100),
    })
    .strict(),
};

export const validateAcademicRuleConfig = (
  ruleType: keyof typeof academicRuleConfigSchemas,
  config: Record<string, unknown>,
) => {
  const schema = academicRuleConfigSchemas[ruleType] as z.ZodType<Record<string, unknown>>;
  return schema.safeParse(config);
};

export const createAcademicRuleSchema = z.object({
  body: z
    .object({
      ruleType: z.enum([
        'grade_scheme',
        'assessment_scheme',
        'attendance_threshold',
        'promotion_rule',
      ]),
      code: z
        .string()
        .trim()
        .min(2, 'Code must be at least 2 characters')
        .max(50, 'Code cannot exceed 50 characters')
        .toUpperCase(),
      name: z
        .string()
        .trim()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name cannot exceed 100 characters'),
      effectiveFrom: z.string().datetime().or(z.string().date()).optional(),
      effectiveTo: z.string().datetime().or(z.string().date()).optional(),
      schoolId: objectIdSchema,
      branchId: objectIdSchema.optional(),
      academicYearId: objectIdSchema.optional(),
      academicPeriodId: objectIdSchema.optional(),
      programId: objectIdSchema.optional(),
      levelId: objectIdSchema.optional(),
      config: z.record(z.string(), z.unknown()),
      status: z.enum(['draft', 'active', 'archived']).default('draft'),
    })
    .superRefine((data, context) => {
      const result = validateAcademicRuleConfig(data.ruleType, data.config);
      if (!result.success) {
        for (const issue of result.error.issues) {
          context.addIssue({
            code: 'custom',
            path: ['config', ...issue.path],
            message: issue.message,
          });
        }
      }
    }),
});

export const updateAcademicRuleSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z.object({
    name: z.string().trim().min(2).max(100).optional(),
    effectiveTo: z.string().datetime().or(z.string().date()).optional().nullable(),
    status: z.enum(['draft', 'active', 'archived']).optional(),
    config: z.record(z.string(), z.unknown()).optional(),
  }),
});

export const newRuleVersionSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z.object({
    name: z.string().trim().min(2).max(100).optional(),
    effectiveFrom: z.string().datetime().or(z.string().date()),
    effectiveTo: z.string().datetime().or(z.string().date()).optional(),
    config: z.record(z.string(), z.unknown()),
    status: z.enum(['draft', 'active', 'archived']).default('active'),
    reason: z.string().trim().max(500).optional(),
  }),
});

export const queryAcademicRulesSchema = z.object({
  query: z.object({
    ruleType: z
      .enum(['grade_scheme', 'assessment_scheme', 'attendance_threshold', 'promotion_rule'])
      .optional(),
    code: z.string().trim().optional(),
    schoolId: objectIdSchema.optional(),
    branchId: objectIdSchema.optional(),
    academicYearId: objectIdSchema.optional(),
    academicPeriodId: objectIdSchema.optional(),
    programId: objectIdSchema.optional(),
    levelId: objectIdSchema.optional(),
    status: z.enum(['draft', 'active', 'archived']).optional(),
    effectiveAt: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
  }),
});

export const resolveAcademicRuleSchema = z.object({
  query: z.object({
    schoolId: objectIdSchema,
    branchId: objectIdSchema.optional(),
    ruleType: z.enum([
      'grade_scheme',
      'assessment_scheme',
      'attendance_threshold',
      'promotion_rule',
    ]),
    code: z.string().trim().min(2).max(50),
    date: z.string().datetime().or(z.string().date()).optional(),
  }),
});
