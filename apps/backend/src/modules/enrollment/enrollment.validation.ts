import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createEnrollmentBodySchema = z.object({
  enrollmentCode: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^ENR-\d{6}$/, 'Enrollment code must follow pattern ENR-XXXXXX')
    .optional(),
  studentId: z.string().regex(objectIdRegex, 'Invalid Student ID'),
  schoolId: z.string().regex(objectIdRegex, 'Invalid School ID'),
  branchId: z.string().regex(objectIdRegex, 'Invalid Branch ID'),
  academicYearId: z.string().regex(objectIdRegex, 'Invalid Academic Year ID'),
  academicPeriodId: z.string().regex(objectIdRegex, 'Invalid Academic Period ID').optional(),
  programId: z.string().regex(objectIdRegex, 'Invalid Program ID'),
  levelId: z.string().regex(objectIdRegex, 'Invalid Level ID'),
  classId: z.string().regex(objectIdRegex, 'Invalid Class ID'),
  studyModeId: z.string().regex(objectIdRegex, 'Invalid Study Mode ID').optional(),
  enrollmentDate: z
    .string()
    .refine((d) => !isNaN(Date.parse(d)), 'Invalid enrollment date format')
    .optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z
    .enum([
      'pending',
      'enrolled',
      'active',
      'completed',
      'promoted',
      'repeated',
      'suspended',
      'withdrawn',
      'dropped',
      'transferred',
      'cancelled',
    ])
    .default('active'),
  tuitionStatus: z.enum(['pending', 'partially_paid', 'paid', 'waived']).default('pending'),
  remarks: z.string().trim().max(500).optional(),
});

export const createEnrollmentValidationSchema = z.object({
  body: createEnrollmentBodySchema,
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
});

export const updateEnrollmentBodySchema = createEnrollmentBodySchema.partial().omit({
  enrollmentCode: true,
});

export const updateEnrollmentValidationSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, 'Invalid Enrollment ID'),
  }),
  body: updateEnrollmentBodySchema,
  query: z.object({}).passthrough(),
});

export const enrollmentQueryValidationSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    search: z.string().trim().optional(),
    studentId: z.string().regex(objectIdRegex, 'Invalid Student ID').optional().or(z.literal('')),
    schoolId: z.string().regex(objectIdRegex, 'Invalid School ID').optional().or(z.literal('')),
    branchId: z
      .string()
      .regex(objectIdRegex, 'Invalid Branch ID')
      .optional()
      .or(z.literal(''))
      .or(z.literal('all')),
    academicYearId: z
      .string()
      .regex(objectIdRegex, 'Invalid Academic Year ID')
      .optional()
      .or(z.literal('')),
    academicPeriodId: z
      .string()
      .regex(objectIdRegex, 'Invalid Academic Period ID')
      .optional()
      .or(z.literal('')),
    programId: z.string().regex(objectIdRegex, 'Invalid Program ID').optional().or(z.literal('')),
    levelId: z.string().regex(objectIdRegex, 'Invalid Level ID').optional().or(z.literal('')),
    classId: z.string().regex(objectIdRegex, 'Invalid Class ID').optional().or(z.literal('')),
    status: z
      .enum([
        'pending',
        'enrolled',
        'active',
        'completed',
        'promoted',
        'repeated',
        'suspended',
        'withdrawn',
        'dropped',
        'transferred',
        'cancelled',
      ])
      .optional()
      .or(z.literal('')),
    statusGroup: z
      .enum(['continuing', 'completed', 'dropped', 'transferred', 'all'])
      .optional()
      .or(z.literal('')),
    tuitionStatus: z
      .enum(['pending', 'partially_paid', 'paid', 'waived'])
      .optional()
      .or(z.literal('')),
    month: z.coerce.number().int().min(1).max(12).optional(),
    year: z.coerce.number().int().min(2000).max(2100).optional(),
    startDate: z.string().optional().or(z.literal('')),
    endDate: z.string().optional().or(z.literal('')),
    sortBy: z.string().trim().optional().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  }),
  params: z.object({}).passthrough(),
  body: z.object({}).passthrough(),
});

export type CreateEnrollmentInput = z.infer<typeof createEnrollmentBodySchema>;
export type UpdateEnrollmentInput = z.infer<typeof updateEnrollmentBodySchema>;
