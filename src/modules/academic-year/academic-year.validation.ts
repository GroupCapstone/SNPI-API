import { z } from 'zod';

const academicYearStatus = z.enum(['planned', 'active', 'closing', 'closed', 'archived']);

export const createAcademicYearSchema = z.object({
  body: z
    .object({
      schoolId: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .optional()
        .or(z.literal('')),
      name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
      code: z.string().trim().min(2, 'Code must be at least 2 characters').max(30),
      startDate: z.string().min(1, 'Start date is required'),
      endDate: z.string().min(1, 'End date is required'),
      isCurrent: z.boolean().optional().default(false),
      status: academicYearStatus.optional().default('planned'),
    })
    .refine((data) => new Date(data.startDate) < new Date(data.endDate), {
      message: 'Start date must be before end date',
      path: ['endDate'],
    }),
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
});

export const updateAcademicYearSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Academic Year ID is required'),
  }),
  body: z
    .object({
      schoolId: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .optional()
        .or(z.literal('')),
      name: z.string().trim().min(2).max(100).optional(),
      code: z.string().trim().min(2).max(30).optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      isCurrent: z.boolean().optional(),
      status: academicYearStatus.optional(),
    })
    .refine(
      (data) => {
        if (data.startDate && data.endDate) {
          return new Date(data.startDate) < new Date(data.endDate);
        }
        return true;
      },
      {
        message: 'Start date must be before end date',
        path: ['endDate'],
      },
    ),
  query: z.object({}).passthrough(),
});

export const queryAcademicYearSchema = z.object({
  query: z.object({
    search: z.string().trim().optional(),
    schoolId: z.string().optional().or(z.literal('all')),
    status: academicYearStatus.optional().or(z.literal('all')),
    isCurrent: z
      .union([z.boolean(), z.enum(['true', 'false'])])
      .optional()
      .transform((val) => {
        if (val === 'true' || val === true) return true;
        if (val === 'false' || val === false) return false;
        return undefined;
      }),
  }),
  params: z.object({}).passthrough(),
  body: z.object({}).passthrough(),
});

export const transitionAcademicYearSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    status: academicYearStatus,
    reason: z.string().trim().min(3).max(500).optional(),
  }),
});
