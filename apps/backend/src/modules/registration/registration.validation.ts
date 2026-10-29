import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const phoneRegex = /^(\+855|0)[0-9]{8,9}$/;

export const createRegistrationBodySchema = z.object({
  registrationNumber: z
    .string()
    .trim()
    .transform((val) => (val === '' ? undefined : val.toUpperCase()))
    .pipe(
      z
        .string()
        .min(3, 'Registration number must be at least 3 characters')
        .max(30, 'Registration number cannot exceed 30 characters')
        .regex(
          /^[A-Z0-9_-]+$/,
          'Registration number can only contain letters, numbers, hyphens, and underscores',
        )
        .optional(),
    )
    .optional()
    .nullable(),
  schoolId: z.string().regex(objectIdRegex, 'Invalid School ID'),
  branchId: z.string().regex(objectIdRegex, 'Invalid Branch ID'),
  academicYearId: z.string().regex(objectIdRegex, 'Invalid Academic Year ID'),
  programId: z.string().regex(objectIdRegex, 'Invalid Program ID'),
  firstName: z.string().trim().min(1, 'First name is required').max(100),
  lastName: z.string().trim().min(1, 'Last name is required').max(100),
  khmerName: z.string().trim().min(1, 'Khmer name is required').max(100),
  gender: z.enum(['male', 'female', 'other']),
  dateOfBirth: z
    .string()
    .refine((d) => !isNaN(Date.parse(d)), 'Invalid date of birth')
    .refine((d) => new Date(d) < new Date(), 'Date of birth must be in the past'),
  phone: z.string().trim().regex(phoneRegex, 'Invalid Cambodian phone number format'),
  email: z
    .string()
    .trim()
    .transform((val) => (val === '' ? undefined : val))
    .pipe(z.string().email('Invalid email address').optional())
    .optional(),
  address: z
    .string()
    .trim()
    .max(300)
    .transform((val) => (val === '' ? undefined : val))
    .optional(),
  guardianName: z.string().trim().min(1, 'Guardian name is required').max(100),
  guardianRelationship: z.string().trim().min(1, 'Guardian relationship is required'),
  guardianPhone: z.string().trim().regex(phoneRegex, 'Invalid guardian phone number format'),
  status: z
    .enum([
      'draft',
      'registered',
      'placement_pending',
      'placement_completed',
      'enrollment_pending',
      'enrolled',
      'cancelled',
    ])
    .default('registered'),
  registrationDate: z
    .string()
    .trim()
    .transform((val) => (val === '' ? undefined : val))
    .pipe(
      z
        .string()
        .refine((d) => !isNaN(Date.parse(d)), 'Invalid registration date format')
        .optional(),
    )
    .optional(),
  remarks: z
    .string()
    .trim()
    .max(500)
    .transform((val) => (val === '' ? undefined : val))
    .optional(),
});

export const createRegistrationValidationSchema = z.object({
  body: createRegistrationBodySchema,
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
});

export const updateRegistrationBodySchema = createRegistrationBodySchema.partial().omit({
  registrationNumber: true,
});

export const updateRegistrationValidationSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, 'Invalid Registration ID'),
  }),
  body: updateRegistrationBodySchema,
  query: z.object({}).passthrough(),
});

export const registrationQueryValidationSchema = z.object({
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
    programId: z.string().regex(objectIdRegex, 'Invalid Program ID').optional().or(z.literal('')),
    status: z
      .enum([
        'draft',
        'registered',
        'placement_pending',
        'placement_completed',
        'enrollment_pending',
        'enrolled',
        'cancelled',
      ])
      .optional()
      .or(z.literal('')),
    sortBy: z.string().trim().optional().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  }),
  params: z.object({}).passthrough(),
  body: z.object({}).passthrough(),
});

export type CreateRegistrationInput = z.infer<typeof createRegistrationBodySchema>;
export type UpdateRegistrationInput = z.infer<typeof updateRegistrationBodySchema>;
