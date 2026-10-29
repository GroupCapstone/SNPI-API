import { z } from 'zod';

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const createClassScheduleSchema = z
  .object({
    classId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Class ID format'),
    branchId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid Branch ID format')
      .optional(),
    academicYearId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid Academic Year ID format')
      .optional(),
    academicPeriodId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid Academic Period ID format')
      .optional(),
    dayOfWeek: z.number().int().min(1).max(7),
    timeSlotId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid Time Slot ID format')
      .optional(),
    sessionType: z.enum(['morning', 'afternoon', 'evening', 'hourly', 'custom']).optional(),
    startTime: z.string().regex(timeRegex, 'Start time must be in HH:mm 24h format (e.g. 07:30)'),
    endTime: z.string().regex(timeRegex, 'End time must be in HH:mm 24h format (e.g. 08:25)'),
    subjectId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid Subject ID format')
      .optional(),
    teacherId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid Teacher ID format')
      .optional(),
    teacherAssignmentId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid Teacher Assignment ID format')
      .optional(),
    classroomId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid Classroom ID format')
      .optional(),
    effectiveFrom: z.string().datetime().optional(),
    effectiveTo: z.string().datetime().optional(),
    status: z.enum(['active', 'cancelled']).default('active'),
  })
  .refine(
    (data) => {
      const [startH = 0, startM = 0] = data.startTime.split(':').map(Number);
      const [endH = 0, endM = 0] = data.endTime.split(':').map(Number);
      return startH * 60 + startM < endH * 60 + endM;
    },
    {
      message: 'Start time must be strictly before end time',
      path: ['endTime'],
    },
  );

export const updateClassScheduleSchema = z
  .object({
    dayOfWeek: z.number().int().min(1).max(7).optional(),
    timeSlotId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .optional(),
    sessionType: z.enum(['morning', 'afternoon', 'evening', 'hourly', 'custom']).optional(),
    startTime: z.string().regex(timeRegex).optional(),
    endTime: z.string().regex(timeRegex).optional(),
    subjectId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .optional(),
    teacherId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .optional(),
    teacherAssignmentId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .optional(),
    classroomId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .optional(),
    effectiveFrom: z.string().datetime().optional(),
    effectiveTo: z.string().datetime().optional(),
    status: z.enum(['active', 'cancelled']).optional(),
  })
  .refine(
    (data) => {
      if (data.startTime && data.endTime) {
        const [startH = 0, startM = 0] = data.startTime.split(':').map(Number);
        const [endH = 0, endM = 0] = data.endTime.split(':').map(Number);
        return startH * 60 + startM < endH * 60 + endM;
      }
      return true;
    },
    {
      message: 'Start time must be strictly before end time',
      path: ['endTime'],
    },
  );

export const queryClassScheduleSchema = z.object({
  classId: z.string().optional(),
  branchId: z.string().optional(),
  academicYearId: z.string().optional(),
  academicPeriodId: z.string().optional(),
  dayOfWeek: z.coerce.number().int().min(1).max(7).optional(),
  sessionType: z.enum(['morning', 'afternoon', 'evening', 'hourly', 'custom']).optional(),
  teacherId: z.string().optional(),
  classroomId: z.string().optional(),
  status: z.enum(['active', 'cancelled']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid resource ID format');
const emptyBody = z.object({}).passthrough();
const emptyParams = z.object({}).passthrough();
const emptyQuery = z.object({}).passthrough();

export const createClassScheduleRequestSchema = z.object({
  body: createClassScheduleSchema,
  params: emptyParams,
  query: emptyQuery,
});

export const updateClassScheduleRequestSchema = z.object({
  body: updateClassScheduleSchema,
  params: z.object({ id: objectIdSchema }),
  query: emptyQuery,
});

export const queryClassScheduleRequestSchema = z.object({
  body: emptyBody,
  params: emptyParams,
  query: queryClassScheduleSchema,
});

export const classScheduleIdValidationSchema = z.object({
  body: emptyBody,
  params: z.object({ id: objectIdSchema }),
  query: emptyQuery,
});

export const classScheduleClassValidationSchema = z.object({
  body: emptyBody,
  params: z.object({ classId: objectIdSchema }),
  query: emptyQuery,
});

export const todayClassScheduleValidationSchema = z.object({
  body: emptyBody,
  params: emptyParams,
  query: z.object({
    branchId: objectIdSchema.optional(),
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must use YYYY-MM-DD format')
      .optional(),
  }),
});

export const checkClassScheduleConflictValidationSchema = z.object({
  query: z
    .object({
      branchId: objectIdSchema.optional(),
      academicYearId: objectIdSchema.optional(),
      academicPeriodId: objectIdSchema.optional(),
      dayOfWeek: z.coerce.number().int().min(1).max(7),
      startTime: z.string().regex(timeRegex),
      endTime: z.string().regex(timeRegex),
      effectiveFrom: z.string().datetime().optional(),
      effectiveTo: z.string().datetime().optional(),
      teacherId: objectIdSchema.optional(),
      classroomId: objectIdSchema.optional(),
      classId: objectIdSchema.optional(),
      excludeScheduleId: objectIdSchema.optional(),
    })
    .refine((data) => Boolean(data.classId || data.branchId), {
      message: 'A class or branch is required for conflict checking',
      path: ['branchId'],
    })
    .refine((data) => data.startTime < data.endTime, {
      message: 'Start time must be strictly before end time',
      path: ['endTime'],
    }),
  body: z.object({}).passthrough(),
  params: z.object({}).passthrough(),
});

export const studentScheduleConflictValidationSchema = z.object({
  params: z.object({ studentId: objectIdSchema }),
  body: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
});
