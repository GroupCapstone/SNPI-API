import { z } from 'zod';

const optionalId = () =>
  z
    .string()
    .optional()
    .nullable()
    .transform((val) =>
      val && typeof val === 'string' && val.trim() !== '' ? val.trim() : undefined,
    );

const optionalString = () =>
  z
    .string()
    .optional()
    .nullable()
    .transform((val) =>
      val && typeof val === 'string' && val.trim() !== '' ? val.trim() : undefined,
    );

export const createClassSchema = z.object({
  body: z
    .object({
      schoolId: optionalId(),
      branchId: z.string().min(1, 'Branch is required'),
      academicYearId: z.string().min(1, 'Academic Year is required'),
      academicPeriodId: optionalId(),
      offeringId: optionalId(),
      programId: z.string().min(1, 'Program is required'),
      levelId: z.string().min(1, 'Level is required'),
      studyModeId: optionalId(),
      section: z.string().max(10).trim().toUpperCase().default('A'),
      curriculumId: optionalId(),
      classroomId: optionalId(),
      defaultClassroomId: optionalId(),
      classTeacherId: optionalId(),
      classCode: z
        .string()
        .max(30, 'Class code cannot exceed 30 characters')
        .trim()
        .toUpperCase()
        .optional(),
      className: z.string().max(150).trim().optional(),
      capacity: z.coerce.number().int().min(1, 'Capacity must be at least 1').default(30),
      shift: z
        .enum(['morning', 'afternoon', 'evening', 'weekend', 'hourly', 'custom'])
        .default('morning')
        .optional(),
      daysPattern: z
        .enum(['MON_FRI', 'MON_WED_FRI', 'TUE_THU_SAT', 'SAT_SUN', 'CUSTOM'])
        .default('MON_FRI')
        .optional(),
      selectedDays: z.array(z.number().min(1).max(7)).optional(),
      startTime: optionalString(),
      endTime: optionalString(),
      startDate: optionalString(),
      endDate: optionalString(),
      status: z.enum(['planned', 'active', 'completed', 'cancelled']).default('planned'),
    })
    .refine(
      (data) => {
        if (data.startDate && data.endDate) {
          return new Date(data.startDate) <= new Date(data.endDate);
        }
        return true;
      },
      {
        message: 'Start date cannot be later than end date',
        path: ['endDate'],
      },
    ),
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
});

export const updateClassSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Class ID is required'),
  }),
  body: z
    .object({
      branchId: z.string().optional(),
      academicYearId: z.string().optional(),
      academicPeriodId: optionalId(),
      offeringId: optionalId(),
      programId: z.string().optional(),
      levelId: z.string().optional(),
      studyModeId: optionalId(),
      section: z.string().max(10).trim().toUpperCase().optional(),
      curriculumId: optionalId(),
      classroomId: optionalId(),
      defaultClassroomId: optionalId(),
      classTeacherId: optionalId(),
      classCode: z.string().min(1).max(30).trim().toUpperCase().optional(),
      className: z.string().min(1).trim().optional(),
      capacity: z.coerce.number().int().min(1).optional(),
      shift: z.enum(['morning', 'afternoon', 'evening', 'weekend', 'hourly', 'custom']).optional(),
      daysPattern: z
        .enum(['MON_FRI', 'MON_WED_FRI', 'TUE_THU_SAT', 'SAT_SUN', 'CUSTOM'])
        .optional(),
      selectedDays: z.array(z.number().min(1).max(7)).optional(),
      startTime: optionalString(),
      endTime: optionalString(),
      startDate: optionalString(),
      endDate: optionalString(),
      status: z.enum(['planned', 'active', 'completed', 'cancelled']).optional(),
    })
    .refine(
      (data) => {
        if (data.startDate && data.endDate) {
          return new Date(data.startDate) <= new Date(data.endDate);
        }
        return true;
      },
      {
        message: 'Start date cannot be later than end date',
        path: ['endDate'],
      },
    ),
  query: z.object({}).passthrough(),
});

export const queryClassSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    branchId: z.string().optional().or(z.literal('')).or(z.literal('all')),
    academicYearId: z.string().optional().or(z.literal('')).or(z.literal('all')),
    academicPeriodId: z.string().optional().or(z.literal('')).or(z.literal('all')),
    offeringId: z.string().optional().or(z.literal('')).or(z.literal('all')),
    programId: z.string().optional().or(z.literal('')).or(z.literal('all')),
    levelId: z.string().optional().or(z.literal('')).or(z.literal('all')),
    studyModeId: z.string().optional().or(z.literal('')).or(z.literal('all')),
    classTeacherId: z.string().optional().or(z.literal('')).or(z.literal('all')),
    curriculumId: z.string().optional().or(z.literal('')).or(z.literal('all')),
    status: z
      .enum(['planned', 'active', 'completed', 'cancelled'])
      .optional()
      .or(z.literal(''))
      .or(z.literal('all')),
    availability: z
      .enum(['all', 'available', 'near_capacity', 'full', 'closed'])
      .optional()
      .or(z.literal('')),
    shift: z
      .enum(['morning', 'afternoon', 'evening', 'weekend', 'hourly', 'custom'])
      .optional()
      .or(z.literal(''))
      .or(z.literal('all')),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }),
  params: z.object({}).passthrough(),
  body: z.object({}).passthrough(),
});

export const queryClassSummarySchema = z.object({
  query: z.object({
    branchId: z.string().optional().or(z.literal('')).or(z.literal('all')),
    academicYearId: z.string().optional().or(z.literal('')).or(z.literal('all')),
    academicPeriodId: z.string().optional().or(z.literal('')).or(z.literal('all')),
    offeringId: z.string().optional().or(z.literal('')).or(z.literal('all')),
    programId: z.string().optional().or(z.literal('')).or(z.literal('all')),
    levelId: z.string().optional().or(z.literal('')).or(z.literal('all')),
    studyModeId: z.string().optional().or(z.literal('')).or(z.literal('all')),
    shift: z
      .enum(['morning', 'afternoon', 'evening', 'weekend', 'hourly', 'custom'])
      .optional()
      .or(z.literal(''))
      .or(z.literal('all')),
    status: z
      .enum(['planned', 'active', 'completed', 'cancelled'])
      .optional()
      .or(z.literal(''))
      .or(z.literal('all')),
  }),
  params: z.object({}).passthrough(),
  body: z.object({}).passthrough(),
});

export const classIdRequestSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Class ID format'),
  }),
  body: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
});
