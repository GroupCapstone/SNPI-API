import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const guardianValidationSchema = z.object({
  fullName: z.string().trim().min(2, 'Guardian full name must be at least 2 characters'),
  khmerName: z.string().trim().optional().or(z.literal('')),
  relationship: z.enum(['father', 'mother', 'guardian', 'other'], {
    message: 'Relationship must be father, mother, guardian, or other',
  }),
  phone: z.string().trim().min(6, 'Valid phone number is required'),
  email: z.string().trim().email('Invalid email address').optional().or(z.literal('')),
  occupation: z.string().trim().optional().or(z.literal('')),
  address: z.string().trim().optional().or(z.literal('')),
  isPrimary: z.boolean().default(false),
  isEmergencyContact: z.boolean().default(false),
});

const birthplaceValidationSchema = z.object({
  province: z.string().trim().optional().or(z.literal('')),
  district: z.string().trim().optional().or(z.literal('')),
  commune: z.string().trim().optional().or(z.literal('')),
  village: z.string().trim().optional().or(z.literal('')),
});

const currentAddressValidationSchema = z.object({
  province: z.string().trim().optional().or(z.literal('')),
  district: z.string().trim().optional().or(z.literal('')),
  commune: z.string().trim().optional().or(z.literal('')),
  village: z.string().trim().optional().or(z.literal('')),
  street: z.string().trim().optional().or(z.literal('')),
  houseNumber: z.string().trim().optional().or(z.literal('')),
  sameAsBirthplace: z.boolean().default(false),
});

export const createStudentBodySchema = z.object({
  studentId: z
    .string()
    .trim()
    .transform((val) => (val === '' ? undefined : val.toUpperCase()))
    .pipe(
      z
        .string()
        .min(3, 'Custom Student ID must be at least 3 characters')
        .max(30, 'Custom Student ID cannot exceed 30 characters')
        .regex(
          /^[A-Z0-9_-]+$/,
          'Custom Student ID can only contain letters, numbers, hyphens, and underscores',
        )
        .optional(),
    )
    .optional()
    .nullable(),
  schoolId: z.string().regex(objectIdRegex, 'Invalid School ID'),
  branchId: z.string().regex(objectIdRegex, 'Invalid Branch ID'),
  firstName: z.string().trim().min(1, 'First name is required').max(100),
  lastName: z.string().trim().min(1, 'Last name is required').max(100),
  khmerName: z.string().trim().min(1, 'Khmer name is required').max(150),
  gender: z.enum(['male', 'female', 'other'], {
    message: 'Gender must be male, female, or other',
  }),
  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine((date) => !isNaN(Date.parse(date)), 'Invalid date format'),
  placeOfBirth: z
    .string()
    .trim()
    .max(250)
    .transform((val) => (val === '' ? undefined : val))
    .optional(),
  birthplace: birthplaceValidationSchema.optional(),
  nationality: z.string().trim().max(100).default('Cambodian'),
  phone: z
    .string()
    .trim()
    .transform((val) => (val === '' ? undefined : val))
    .optional(),
  email: z
    .string()
    .trim()
    .transform((val) => (val === '' ? undefined : val))
    .pipe(z.string().email('Invalid email address').optional())
    .optional(),
  address: z
    .string()
    .trim()
    .max(500)
    .transform((val) => (val === '' ? undefined : val))
    .optional(),
  currentAddress: currentAddressValidationSchema.optional(),
  photo: z
    .string()
    .trim()
    .transform((val) => (val === '' ? undefined : val))
    .optional(),
  nationalId: z
    .string()
    .trim()
    .transform((val) => (val === '' ? undefined : val))
    .optional(),
  admissionDate: z
    .string()
    .trim()
    .transform((val) => (val === '' ? undefined : val))
    .pipe(
      z
        .string()
        .refine((date) => !isNaN(Date.parse(date)), 'Invalid date format')
        .optional(),
    )
    .optional(),
  status: z
    .enum(['active', 'inactive', 'suspended', 'graduated', 'withdrawn', 'transferred'])
    .default('active'),
  guardians: z
    .array(guardianValidationSchema)
    .optional()
    .transform((arr) =>
      arr ? arr.filter((g) => g.fullName?.trim() && g.phone?.trim()) : undefined,
    ),
});

export const createStudentValidationSchema = z.object({
  body: createStudentBodySchema,
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
});

export const updateStudentBodySchema = createStudentBodySchema.partial().omit({
  studentId: true,
});

export const updateStudentValidationSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, 'Invalid Student ID'),
  }),
  body: updateStudentBodySchema,
  query: z.object({}).passthrough(),
});

export const studentQueryValidationSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    search: z.string().trim().optional(),
    branchId: z
      .string()
      .regex(objectIdRegex, 'Invalid Branch ID')
      .optional()
      .or(z.literal(''))
      .or(z.literal('all')),
    schoolId: z.string().regex(objectIdRegex, 'Invalid School ID').optional().or(z.literal('')),
    status: z
      .enum(['active', 'inactive', 'suspended', 'graduated', 'withdrawn', 'transferred'])
      .optional()
      .or(z.literal('')),
    gender: z.enum(['male', 'female', 'other']).optional().or(z.literal('')),
    sortBy: z.string().trim().optional().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  }),
  params: z.object({}).passthrough(),
  body: z.object({}).passthrough(),
});

export const checkDuplicatesValidationSchema = z.object({
  body: z.object({
    khmerName: z.string().trim().optional().or(z.literal('')),
    firstName: z.string().trim().optional().or(z.literal('')),
    lastName: z.string().trim().optional().or(z.literal('')),
    dateOfBirth: z.string().optional().or(z.literal('')),
    phone: z.string().trim().optional().or(z.literal('')),
    guardianPhone: z.string().trim().optional().or(z.literal('')),
    excludeId: z.string().regex(objectIdRegex, 'Invalid Student ID to exclude').optional(),
  }),
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
});

export const previewImportValidationSchema = z.object({
  body: z.object({
    schoolId: z.string().regex(objectIdRegex, 'Invalid School ID'),
    branchId: z.string().regex(objectIdRegex, 'Invalid Branch ID'),
    rows: z
      .array(z.record(z.string(), z.any()))
      .min(1, 'At least 1 row required for import preview'),
  }),
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
});

export const confirmImportValidationSchema = z.object({
  body: z.object({
    schoolId: z.string().regex(objectIdRegex, 'Invalid School ID'),
    branchId: z.string().regex(objectIdRegex, 'Invalid Branch ID'),
    rows: z
      .array(createStudentBodySchema.omit({ schoolId: true, branchId: true }))
      .min(1, 'At least 1 student row required'),
    skipDuplicates: z.boolean().default(true),
  }),
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
});

export type CreateStudentInput = z.infer<typeof createStudentBodySchema>;
export type UpdateStudentInput = z.infer<typeof updateStudentBodySchema>;
