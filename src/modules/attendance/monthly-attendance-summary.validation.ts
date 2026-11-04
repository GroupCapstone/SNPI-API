import { z } from 'zod';

export const monthlyAttendanceStatusEnum = z.enum(['open', 'closed']);

export const queryMonthlyAttendanceSummarySchema = z.object({
  query: z.object({
    branchId: z.string().optional(),
    academicYearId: z.string().optional(),
    academicPeriodId: z.string().optional(),
    classId: z.string().optional(),
    studentId: z.string().optional(),
    enrollmentId: z.string().optional(),
    year: z.coerce.number().int().min(2000).max(2100).optional(),
    month: z.coerce.number().int().min(1).max(12).optional(),
    status: monthlyAttendanceStatusEnum.optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(50),
  }),
});

export const recalculateMonthlyAttendanceSchema = z.object({
  body: z.object({
    classId: z.string().min(1, 'Class ID is required'),
    year: z.coerce.number().int().min(2000).max(2100),
    month: z.coerce.number().int().min(1).max(12),
    academicYearId: z.string().optional(),
  }),
});

export const classMonthlySummaryQuerySchema = z.object({
  params: z.object({
    classId: z.string().min(1, 'Class ID is required'),
  }),
  query: z.object({
    year: z.coerce.number().int().min(2000).max(2100),
    month: z.coerce.number().int().min(1).max(12),
  }),
});

export const studentMonthlySummaryQuerySchema = z.object({
  params: z.object({
    studentId: z.string().min(1, 'Student ID is required'),
  }),
  query: z.object({
    academicYearId: z.string().optional(),
    year: z.coerce.number().int().min(2000).max(2100).optional(),
  }),
});
