import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createTeacherAssignmentBodySchema = z
  .object({
    schoolId: z.string().regex(objectIdRegex, 'Invalid School ID'),
    branchId: z.string().regex(objectIdRegex, 'Invalid Branch ID'),
    academicYearId: z.string().regex(objectIdRegex, 'Invalid Academic Year ID'),
    academicPeriodId: z
      .string()
      .regex(objectIdRegex, 'Invalid Academic Period ID')
      .optional()
      .or(z.literal('')),
    employeeId: z.string().regex(objectIdRegex, 'Invalid Employee ID'),
    classId: z.string().regex(objectIdRegex, 'Invalid Class ID'),
    subjectId: z.string().regex(objectIdRegex, 'Invalid Subject ID').optional().or(z.literal('')),
    timeSlotId: z
      .string()
      .regex(objectIdRegex, 'Invalid Time Slot ID')
      .optional()
      .or(z.literal('')),
    roleInClass: z
      .enum(['class_teacher', 'primary_teacher', 'assistant_teacher', 'subject_teacher'])
      .default('subject_teacher'),
    status: z.enum(['active', 'inactive']).default('active'),
    startDate: z
      .string()
      .refine((d) => !isNaN(Date.parse(d)), 'Invalid start date format')
      .optional(),
    endDate: z
      .string()
      .refine((d) => !isNaN(Date.parse(d)), 'Invalid end date format')
      .optional()
      .or(z.literal('')),
    remarks: z.string().trim().max(500).optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.startDate) <= new Date(data.endDate);
      }
      return true;
    },
    {
      message: 'End date must be after or equal to start date',
      path: ['endDate'],
    },
  );

export const createTeacherAssignmentValidationSchema = z.object({
  body: createTeacherAssignmentBodySchema,
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
});

export const updateTeacherAssignmentBodySchema = z
  .object({
    schoolId: z.string().regex(objectIdRegex, 'Invalid School ID').optional(),
    branchId: z.string().regex(objectIdRegex, 'Invalid Branch ID').optional(),
    academicYearId: z.string().regex(objectIdRegex, 'Invalid Academic Year ID').optional(),
    academicPeriodId: z
      .string()
      .regex(objectIdRegex, 'Invalid Academic Period ID')
      .optional()
      .or(z.literal('')),
    employeeId: z.string().regex(objectIdRegex, 'Invalid Employee ID').optional(),
    classId: z.string().regex(objectIdRegex, 'Invalid Class ID').optional(),
    subjectId: z.string().regex(objectIdRegex, 'Invalid Subject ID').optional().or(z.literal('')),
    timeSlotId: z
      .string()
      .regex(objectIdRegex, 'Invalid Time Slot ID')
      .optional()
      .or(z.literal('')),
    roleInClass: z
      .enum(['class_teacher', 'primary_teacher', 'assistant_teacher', 'subject_teacher'])
      .optional(),
    status: z.enum(['active', 'inactive']).optional(),
    startDate: z
      .string()
      .refine((d) => !isNaN(Date.parse(d)), 'Invalid start date format')
      .optional(),
    endDate: z
      .string()
      .refine((d) => !isNaN(Date.parse(d)), 'Invalid end date format')
      .optional()
      .or(z.literal('')),
    remarks: z.string().trim().max(500).optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.startDate) <= new Date(data.endDate);
      }
      return true;
    },
    {
      message: 'End date must be after or equal to start date',
      path: ['endDate'],
    },
  );

export const updateTeacherAssignmentValidationSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, 'Invalid Teacher Assignment ID'),
  }),
  body: updateTeacherAssignmentBodySchema,
  query: z.object({}).passthrough(),
});

export const teacherAssignmentQueryValidationSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    search: z.string().trim().optional(),
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
    employeeId: z.string().regex(objectIdRegex, 'Invalid Employee ID').optional().or(z.literal('')),
    classId: z.string().regex(objectIdRegex, 'Invalid Class ID').optional().or(z.literal('')),
    subjectId: z.string().regex(objectIdRegex, 'Invalid Subject ID').optional().or(z.literal('')),
    timeSlotId: z
      .string()
      .regex(objectIdRegex, 'Invalid Time Slot ID')
      .optional()
      .or(z.literal('')),
    roleInClass: z
      .enum(['class_teacher', 'primary_teacher', 'assistant_teacher', 'subject_teacher'])
      .optional()
      .or(z.literal('')),
    status: z.enum(['active', 'inactive']).optional().or(z.literal('')),
    sortBy: z.string().trim().optional().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  }),
  params: z.object({}).passthrough(),
  body: z.object({}).passthrough(),
});

export type CreateTeacherAssignmentInput = z.infer<typeof createTeacherAssignmentBodySchema>;
export type UpdateTeacherAssignmentInput = z.infer<typeof updateTeacherAssignmentBodySchema>;

export const teacherRosterQueryValidationSchema = z.object({
  query: z.object({
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
    employeeId: z.string().regex(objectIdRegex, 'Invalid Employee ID').optional().or(z.literal('')),
    search: z.string().trim().optional(),
  }),
  params: z.object({}).passthrough(),
  body: z.object({}).passthrough(),
});
