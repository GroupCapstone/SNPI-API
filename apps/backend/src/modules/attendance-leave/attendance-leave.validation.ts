import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'A valid resource ID is required');
const date = z.string().date();

export const createAttendanceLeaveSchema = z.object({
  body: z
    .object({
      branchId: objectId,
      studentId: objectId,
      enrollmentId: objectId,
      classId: objectId,
      leaveType: z.enum(['medical', 'family', 'personal', 'school_activity', 'other']),
      startDate: date,
      endDate: date,
      reason: z.string().trim().min(3).max(1000),
      documentUrl: z.string().url().optional().or(z.literal('')),
      documentName: z.string().trim().max(255).optional().or(z.literal('')),
    })
    .refine((value) => value.startDate <= value.endDate, {
      path: ['endDate'],
      message: 'End date cannot be before start date',
    }),
});

export const reviewAttendanceLeaveSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    status: z.enum(['approved', 'rejected', 'cancelled']),
    reviewNotes: z.string().trim().min(3).max(1000).optional(),
  }),
});

export const queryAttendanceLeaveSchema = z.object({
  query: z.object({
    branchId: objectId.optional(),
    studentId: objectId.optional(),
    classId: objectId.optional(),
    status: z.enum(['pending', 'approved', 'rejected', 'cancelled']).optional(),
    leaveType: z.enum(['medical', 'family', 'personal', 'school_activity', 'other']).optional(),
    startDate: date.optional(),
    endDate: date.optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
  }),
});
