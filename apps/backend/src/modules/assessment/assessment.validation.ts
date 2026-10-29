import { z } from 'zod';

const idSchema = z.string().regex(/^[a-f\d]{24}$/i, 'A valid resource ID is required');
const dateSchema = z
  .string()
  .refine((value) => !Number.isNaN(Date.parse(value)), 'A valid date is required');
const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Time must use HH:mm format');

const assessmentBodySchema = z
  .object({
    schoolId: idSchema,
    branchId: idSchema,
    academicYearId: idSchema,
    academicPeriodId: idSchema.optional(),
    classId: idSchema,
    subjectId: idSchema,
    name: z.string().min(1, 'Assessment name is required').trim(),
    code: z.string().min(1, 'Assessment code is required').trim().toUpperCase(),
    type: z.enum(['quiz', 'assignment', 'monthly_test', 'midterm', 'final']),
    maxScore: z.number().min(1, 'Max score must be at least 1').default(100),
    passingScore: z.number().min(0, 'Passing score must be at least 0').default(50),
    weightPercentage: z
      .number()
      .min(0, 'Weight percentage cannot be negative')
      .max(100, 'Weight percentage cannot exceed 100')
      .default(100),
    assessmentDate: dateSchema,
    startTime: timeSchema.optional(),
    endTime: timeSchema.optional(),
    classroomId: idSchema.optional(),
    proctorIds: z.array(idSchema).max(10).default([]),
    seatCapacity: z.number().int().positive().optional(),
    description: z.string().trim().optional().or(z.literal('')).nullable(),
    status: z.enum(['draft', 'published', 'closed']).default('draft'),
  })
  .superRefine((value, context) => {
    if (value.passingScore > value.maxScore) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['passingScore'],
        message: 'Passing score cannot exceed maximum score',
      });
    }
    if (Boolean(value.startTime) !== Boolean(value.endTime)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endTime'],
        message: 'Start time and end time must be provided together',
      });
    }
    if (value.startTime && value.endTime && value.startTime >= value.endTime) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endTime'],
        message: 'End time must be later than start time',
      });
    }
  });

export const createAssessmentSchema = z.object({
  body: assessmentBodySchema,
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
});

export const updateAssessmentSchema = z.object({
  params: z.object({
    id: idSchema,
  }),
  body: z.object({
    name: z.string().min(1).trim().optional(),
    code: z.string().min(1).trim().toUpperCase().optional(),
    type: z.enum(['quiz', 'assignment', 'monthly_test', 'midterm', 'final']).optional(),
    maxScore: z.number().min(1).optional(),
    passingScore: z.number().min(0).optional(),
    weightPercentage: z.number().min(0).max(100).optional(),
    assessmentDate: dateSchema.optional(),
    startTime: timeSchema.optional(),
    endTime: timeSchema.optional(),
    classroomId: idSchema.optional(),
    proctorIds: z.array(idSchema).max(10).optional(),
    seatCapacity: z.number().int().positive().optional(),
    description: z.string().trim().optional().or(z.literal('')).nullable(),
    status: z.enum(['draft', 'published', 'closed']).optional(),
  }),
  query: z.object({}).passthrough(),
});

export const queryAssessmentSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    schoolId: idSchema.optional().or(z.literal('')).or(z.literal('all')),
    branchId: idSchema.optional().or(z.literal('')).or(z.literal('all')),
    academicYearId: idSchema.optional().or(z.literal('')).or(z.literal('all')),
    academicPeriodId: idSchema.optional().or(z.literal('')).or(z.literal('all')),
    classId: idSchema.optional().or(z.literal('')).or(z.literal('all')),
    subjectId: idSchema.optional().or(z.literal('')).or(z.literal('all')),
    type: z
      .enum(['quiz', 'assignment', 'monthly_test', 'midterm', 'final'])
      .optional()
      .or(z.literal(''))
      .or(z.literal('all')),
    status: z
      .enum(['draft', 'published', 'closed'])
      .optional()
      .or(z.literal(''))
      .or(z.literal('all')),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }),
  params: z.object({}).passthrough(),
  body: z.object({}).passthrough(),
});
