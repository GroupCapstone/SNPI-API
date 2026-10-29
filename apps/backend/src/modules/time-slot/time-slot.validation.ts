import { z } from 'zod';

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const createTimeSlotSchema = z
  .object({
    schoolId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid School ID format')
      .optional(),
    branchId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid Branch ID format')
      .optional(),
    code: z
      .string()
      .min(2, 'Code must be at least 2 characters')
      .max(30, 'Code cannot exceed 30 characters')
      .toUpperCase()
      .trim(),
    name: z.string().min(1, 'Name is required').max(150).trim(),
    sessionType: z.enum(['morning', 'afternoon', 'evening', 'hourly', 'custom']).default('morning'),
    startTime: z
      .string()
      .regex(timeRegex, 'Start time must be in HH:mm 24-hour format (e.g. 07:30)'),
    endTime: z.string().regex(timeRegex, 'End time must be in HH:mm 24-hour format (e.g. 08:25)'),
    durationMinutes: z.number().int().min(1).optional(),
    sortOrder: z.number().int().min(0).default(0),
    isActive: z.boolean().default(true),
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

export const updateTimeSlotSchema = z
  .object({
    name: z.string().min(1).max(150).trim().optional(),
    sessionType: z.enum(['morning', 'afternoon', 'evening', 'hourly', 'custom']).optional(),
    startTime: z.string().regex(timeRegex, 'Start time must be in HH:mm format').optional(),
    endTime: z.string().regex(timeRegex, 'End time must be in HH:mm format').optional(),
    durationMinutes: z.number().int().min(1).optional(),
    sortOrder: z.number().int().min(0).optional(),
    isActive: z.boolean().optional(),
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

export const queryTimeSlotSchema = z.object({
  schoolId: z.string().optional(),
  branchId: z.string().optional(),
  sessionType: z.enum(['morning', 'afternoon', 'evening', 'hourly', 'custom']).optional(),
  search: z.string().optional(),
  isActive: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

const emptyBody = z.object({}).passthrough();
const emptyQuery = z.object({}).passthrough();
const idParams = z.object({ id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Time Slot ID') });

export const createTimeSlotRequestSchema = z.object({
  body: createTimeSlotSchema,
  params: z.object({}).passthrough(),
  query: emptyQuery,
});
export const updateTimeSlotRequestSchema = z.object({
  body: updateTimeSlotSchema,
  params: idParams,
  query: emptyQuery,
});
export const queryTimeSlotRequestSchema = z.object({
  body: emptyBody,
  params: z.object({}).passthrough(),
  query: queryTimeSlotSchema,
});
export const timeSlotIdRequestSchema = z.object({
  body: emptyBody,
  params: idParams,
  query: emptyQuery,
});
