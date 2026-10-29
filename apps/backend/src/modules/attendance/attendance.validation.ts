import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const attendanceRecordItemSchema = z.object({
  studentId: z.string().regex(objectIdRegex, 'Invalid Student ID'),
  status: z.enum(['present', 'absent', 'excused', 'late', 'half_day', 'sick', 'permission']),
  remarks: z.string().trim().max(200).optional(),
});

export const markAttendanceBodySchema = z.object({
  schoolId: z.string().regex(objectIdRegex, 'Invalid School ID'),
  branchId: z.string().regex(objectIdRegex, 'Invalid Branch ID'),
  academicYearId: z.string().regex(objectIdRegex, 'Invalid Academic Year ID'),
  academicPeriodId: z.string().regex(objectIdRegex, 'Invalid Academic Period ID').optional(),
  classId: z.string().regex(objectIdRegex, 'Invalid Class ID'),
  scheduleId: z.string().regex(objectIdRegex, 'Invalid Schedule ID').optional(),
  teacherId: z.string().regex(objectIdRegex, 'Invalid Teacher ID').optional(),
  sessionType: z.enum(['morning', 'afternoon', 'evening', 'hourly', 'custom']).default('morning'),
  date: z
    .string()
    .refine((d) => !isNaN(Date.parse(d)), 'Invalid date format (expected YYYY-MM-DD)'),
  records: z
    .array(attendanceRecordItemSchema)
    .min(1, 'At least one student attendance record is required'),
});

export const markAttendanceValidationSchema = z.object({
  body: markAttendanceBodySchema,
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
});

export const attendanceQueryValidationSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
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
    scheduleId: z.string().regex(objectIdRegex, 'Invalid Schedule ID').optional().or(z.literal('')),
    sessionType: z
      .enum(['morning', 'afternoon', 'evening', 'hourly', 'custom'])
      .optional()
      .or(z.literal('')),
    date: z
      .string()
      .refine((d) => !isNaN(Date.parse(d)), 'Invalid date format')
      .optional()
      .or(z.literal('')),
    startDate: z
      .string()
      .refine((d) => !isNaN(Date.parse(d)), 'Invalid start date format')
      .optional()
      .or(z.literal('')),
    endDate: z
      .string()
      .refine((d) => !isNaN(Date.parse(d)), 'Invalid end date format')
      .optional()
      .or(z.literal('')),
    studentId: z.string().regex(objectIdRegex, 'Invalid Student ID').optional().or(z.literal('')),
    status: z
      .enum(['present', 'absent', 'late', 'excused', 'permission', 'half_day', 'sick'])
      .optional()
      .or(z.literal('')),
  }),
  params: z.object({}).passthrough(),
  body: z.object({}).passthrough(),
});

export const classRosterQueryValidationSchema = z.object({
  params: z.object({
    classId: z.string().regex(objectIdRegex, 'Invalid Class ID'),
  }),
  query: z.object({
    date: z
      .string()
      .refine((d) => !isNaN(Date.parse(d)), 'Invalid date format (expected YYYY-MM-DD)')
      .optional(),
    sessionType: z.enum(['morning', 'afternoon', 'evening', 'hourly', 'custom']).optional(),
  }),
  body: z.object({}).passthrough(),
});

export type MarkAttendanceInput = z.infer<typeof markAttendanceBodySchema>;
export type ClassRosterQueryInput = z.infer<typeof classRosterQueryValidationSchema>;
