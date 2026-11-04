import { z } from 'zod';

export const academicPeriodTypeEnum = z.enum(['TERM', 'SHORT_COURSE', 'MONTHLY', 'CUSTOM']);
export const academicPeriodStatusEnum = z.enum([
  'planned',
  'open',
  'result_processing',
  'finalized',
  'closed',
]);

export const createAcademicPeriodValidationSchema = z.object({
  body: z.object({
    schoolId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .optional(),
    programId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .optional(),
    code: z.string().trim().min(1, 'Period code is required'),
    name: z.string().trim().min(1, 'Period name is required'),
    type: academicPeriodTypeEnum.default('TERM'),
    academicYearId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Academic Year ID'),
    startDate: z.string().or(z.date()),
    endDate: z.string().or(z.date()),
    sequence: z.number().int().min(1).default(1),
    status: academicPeriodStatusEnum.default('planned'),
  }),
});

export const transitionAcademicPeriodValidationSchema = z.object({
  params: z.object({ id: z.string().min(1, 'Period ID is required') }),
  body: z.object({
    status: academicPeriodStatusEnum,
    reason: z.string().trim().min(3).max(500).optional(),
  }),
});

export const updateAcademicPeriodValidationSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Period ID is required'),
  }),
  body: z.object({
    schoolId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .optional(),
    programId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .optional(),
    code: z.string().trim().min(1).optional(),
    name: z.string().trim().min(1).optional(),
    type: academicPeriodTypeEnum.optional(),
    academicYearId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .optional(),
    startDate: z.string().or(z.date()).optional(),
    endDate: z.string().or(z.date()).optional(),
    sequence: z.number().int().min(1).optional(),
    status: academicPeriodStatusEnum.optional(),
  }),
});

export const queryAcademicPeriodValidationSchema = z.object({
  query: z.object({
    programId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .optional(),
    academicYearId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .optional(),
    type: academicPeriodTypeEnum.optional(),
    status: academicPeriodStatusEnum.optional(),
    search: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(50),
  }),
});

export const generateMonthlyPeriodsValidationSchema = z.object({
  body: z.object({
    academicYearId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Academic Year ID'),
    calendarYear: z.number().int().min(2000).max(2100).optional(),
    startMonth: z.number().int().min(1).max(12).default(1),
    monthCount: z.number().int().min(1).max(12).default(12),
    schoolId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .optional(),
    programId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .optional(),
  }),
});
