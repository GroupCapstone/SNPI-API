import { z } from 'zod';

export const intakeStatusEnum = z.enum(['planned', 'open', 'closed', 'archived']);

export const createIntakeValidationSchema = z.object({
  body: z.object({
    schoolId: z.string().optional(),
    branchId: z.string().optional(),
    academicYearId: z.string().min(1, 'Academic Year is required'),
    academicPeriodId: z.string().min(1, 'Academic Period is required'),
    programId: z.string().min(1, 'Program is required'),
    levelId: z.string().min(1, 'Level is required'),
    curriculumId: z.string().optional(),
    code: z.string().trim().min(1, 'Offering code is required'),
    name: z.string().trim().min(1, 'Offering name is required'),
    startDate: z.string().or(z.date()).optional(),
    endDate: z.string().or(z.date()).optional(),
    capacity: z.number().int().min(1).default(100),
    status: intakeStatusEnum.default('open'),
  }),
});

export const updateIntakeValidationSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Intake ID is required'),
  }),
  body: z.object({
    branchId: z.string().optional(),
    academicYearId: z.string().optional(),
    academicPeriodId: z.string().optional(),
    programId: z.string().optional(),
    levelId: z.string().optional(),
    curriculumId: z.string().optional(),
    code: z.string().trim().min(1).optional(),
    name: z.string().trim().min(1).optional(),
    startDate: z.string().or(z.date()).optional(),
    endDate: z.string().or(z.date()).optional(),
    capacity: z.number().int().min(1).optional(),
    status: intakeStatusEnum.optional(),
  }),
});

export const queryIntakeValidationSchema = z.object({
  query: z.object({
    branchId: z.string().optional(),
    academicYearId: z.string().optional(),
    academicPeriodId: z.string().optional(),
    programId: z.string().optional(),
    levelId: z.string().optional(),
    status: intakeStatusEnum.optional(),
    search: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(50),
  }),
});
