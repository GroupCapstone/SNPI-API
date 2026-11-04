import { z } from 'zod';

export const sendNotificationValidationSchema = z.object({
  body: z.object({
    branchId: z.string().optional(),
    channel: z.enum(['telegram', 'sms', 'in_app']).default('telegram'),
    type: z
      .enum([
        'absence_alert',
        'unmarked_attendance_digest',
        'payment_receipt',
        'tuition_reminder',
        'announcement',
        'custom',
      ])
      .default('custom'),
    recipientType: z
      .enum(['guardian', 'student', 'teacher', 'staff', 'broadcast'])
      .default('guardian'),
    recipientId: z.string().optional(),
    recipientName: z.string().optional(),
    recipientPhone: z.string().optional(),
    recipientChatId: z.string().optional(),
    title: z.string().min(1, 'Title is required').max(300),
    body: z.string().min(1, 'Body content is required').max(5000),
    metadata: z.record(z.string(), z.unknown()).optional(),
  }),
});

export const queryNotificationValidationSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    branchId: z.string().optional(),
    channel: z.enum(['telegram', 'sms', 'in_app']).optional(),
    type: z
      .enum([
        'absence_alert',
        'unmarked_attendance_digest',
        'payment_receipt',
        'tuition_reminder',
        'announcement',
        'custom',
      ])
      .optional(),
    status: z.enum(['pending', 'sent', 'failed']).optional(),
    search: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }),
});

export const triggerAbsenceAlertValidationSchema = z.object({
  body: z.object({
    studentId: z.string().min(1, 'Student ID is required'),
    guardianPhone: z.string().optional(),
    consecutiveDays: z.coerce.number().int().positive().default(3),
    channel: z.enum(['telegram', 'sms', 'in_app']).default('telegram'),
    notes: z.string().optional(),
  }),
});

export const triggerTuitionReminderValidationSchema = z.object({
  body: z.object({
    paymentId: z.string().regex(/^[a-f\d]{24}$/i, 'A valid payment ID is required'),
    channel: z.enum(['telegram', 'sms', 'in_app']).default('telegram'),
    notes: z.string().trim().max(1000).optional(),
  }),
});

export const testTelegramValidationSchema = z.object({
  body: z.object({
    chatId: z.string().optional(),
    message: z.string().max(1000).optional(),
  }),
});

export const createParentContactLogValidationSchema = z.object({
  body: z.object({
    studentId: z.string().min(1, 'Student ID is required'),
    guardianName: z.string().min(1, 'Guardian name is required'),
    guardianPhone: z.string().optional(),
    contactType: z.enum(['phone_call', 'telegram', 'sms', 'in_person']).default('phone_call'),
    purpose: z.enum(['absence', 'tuition', 'behavior', 'academic', 'general']).default('absence'),
    outcome: z
      .enum(['reached', 'no_answer', 'left_message', 'callback_requested', 'resolved'])
      .default('reached'),
    notes: z.string().min(1, 'Contact notes are required').max(3000),
    contactDate: z.string().optional(),
  }),
});

export const queryParentContactLogValidationSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    studentId: z.string().optional(),
    branchId: z.string().optional(),
    contactType: z.enum(['phone_call', 'telegram', 'sms', 'in_person']).optional(),
    purpose: z.enum(['absence', 'tuition', 'behavior', 'academic', 'general']).optional(),
    search: z.string().optional(),
  }),
});
