import { z } from 'zod';

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
  additionalAddress: z.string().trim().optional().or(z.literal('')),
});

const familyMemberValidationSchema = z.object({
  name: z.string().trim().optional().or(z.literal('')),
  age: z.coerce.number().int().min(0).max(150).optional(),
  nationality: z.string().trim().optional().or(z.literal('')),
  ethnicity: z.string().trim().optional().or(z.literal('')),
  livingStatus: z.enum(['living', 'deceased']).optional().default('living'),
  occupation: z.string().trim().optional().or(z.literal('')),
});

const employeeDocumentValidationSchema = z.object({
  documentType: z.string().trim().min(1, 'Document type is required'),
  fileName: z.string().trim().min(1, 'File name is required'),
  fileUrl: z.string().trim().min(1, 'File URL is required'),
  uploadedAt: z.string().optional(),
  uploadedBy: z.string().optional(),
  description: z.string().trim().optional().or(z.literal('')),
  status: z.enum(['active', 'archived']).default('active'),
});

export const createEmployeeBodySchema = z.object({
  schoolId: z.string().min(1, 'School ID is required'),
  branchId: z.string().min(1, 'Branch ID is required'),
  departmentId: z.string().min(1, 'Department ID is required'),
  positionId: z.string().min(1, 'Position ID is required'),
  employeeId: z
    .string()
    .trim()
    .transform((val) => (val === '' ? undefined : val.toUpperCase()))
    .pipe(
      z
        .string()
        .min(3, 'Employee ID must be at least 3 characters')
        .max(30, 'Employee ID cannot exceed 30 characters')
        .regex(
          /^[A-Z0-9_-]+$/,
          'Employee ID can only contain letters, numbers, hyphens, and underscores',
        )
        .optional(),
    )
    .optional()
    .nullable(),
  legacyEmployeeNumber: z
    .string()
    .trim()
    .transform((val) => (val === '' ? undefined : val))
    .optional(),

  // Personal Identity
  firstName: z.string().trim().min(1, 'First name is required').max(100),
  lastName: z.string().trim().min(1, 'Last name is required').max(100),
  khmerName: z.string().trim().min(1, 'Khmer name is required').max(150),
  gender: z.enum(['male', 'female', 'other'], {
    message: 'Gender must be male, female, or other',
  }),
  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine((date) => !isNaN(Date.parse(date)), 'Invalid date of birth format'),
  nationality: z.string().trim().max(100).default('Cambodian'),
  ethnicity: z.string().trim().max(100).default('Khmer'),
  nationalIdNumber: z
    .string()
    .trim()
    .transform((val) => (val === '' ? undefined : val))
    .optional(),
  photo: z
    .string()
    .trim()
    .transform((val) => (val === '' ? undefined : val))
    .optional(),
  maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed']).default('single'),
  numberOfChildren: z.coerce.number().int().min(0).default(0),

  // Addresses
  birthplace: birthplaceValidationSchema.optional(),
  currentAddress: currentAddressValidationSchema.optional(),
  address: z
    .string()
    .trim()
    .max(500)
    .transform((val) => (val === '' ? undefined : val))
    .optional(),

  // Contact
  phone: z
    .string()
    .trim()
    .max(30)
    .transform((val) => (val === '' ? undefined : val))
    .optional(),
  primaryPhone: z
    .string()
    .trim()
    .max(30)
    .transform((val) => (val === '' ? undefined : val))
    .optional(),
  secondaryPhone: z
    .string()
    .trim()
    .max(30)
    .transform((val) => (val === '' ? undefined : val))
    .optional(),
  email: z
    .string()
    .trim()
    .transform((val) => (val === '' ? undefined : val.toLowerCase()))
    .pipe(z.string().email('Invalid email address').optional())
    .optional(),

  // Education & Skills
  educationLevel: z
    .enum(['high_school', 'associate', 'bachelor', 'master', 'doctorate', 'other'])
    .default('bachelor'),
  major: z
    .string()
    .trim()
    .transform((val) => (val === '' ? undefined : val))
    .optional(),
  foreignLanguages: z.array(z.string().trim()).optional().default([]),
  otherSkills: z.array(z.string().trim()).optional().default([]),
  workExperienceSummary: z
    .string()
    .trim()
    .transform((val) => (val === '' ? undefined : val))
    .optional(),

  // Family
  father: familyMemberValidationSchema.optional(),
  mother: familyMemberValidationSchema.optional(),

  // Documents
  documents: z.array(employeeDocumentValidationSchema).optional().default([]),

  // Employment
  employmentType: z
    .enum(['full_time', 'part_time', 'contract', 'intern', 'temporary', 'probation'])
    .default('full_time'),
  joiningDate: z
    .string()
    .min(1, 'Joining date is required')
    .refine((date) => !isNaN(Date.parse(date)), 'Invalid joining date format'),
  status: z
    .enum(['active', 'inactive', 'on_leave', 'suspended', 'resigned', 'terminated'])
    .default('active'),
});

export const createEmployeeSchema = z.object({
  body: createEmployeeBodySchema,
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
});

export const updateEmployeeBodySchema = createEmployeeBodySchema.partial();

export const updateEmployeeSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Employee ID is required'),
  }),
  body: updateEmployeeBodySchema,
  query: z.object({}).passthrough(),
});

export const queryEmployeeSchema = z.object({
  query: z.object({
    search: z.string().trim().optional(),
    schoolId: z.string().optional().or(z.literal('')).or(z.literal('all')),
    branchId: z.string().optional().or(z.literal('')).or(z.literal('all')),
    departmentId: z.string().optional().or(z.literal('')).or(z.literal('all')),
    positionId: z.string().optional().or(z.literal('')).or(z.literal('all')),
    status: z
      .enum(['active', 'inactive', 'on_leave', 'suspended', 'resigned', 'terminated'])
      .optional()
      .or(z.literal(''))
      .or(z.literal('all')),
    employmentType: z
      .enum(['full_time', 'part_time', 'contract', 'intern', 'temporary', 'probation'])
      .optional()
      .or(z.literal(''))
      .or(z.literal('all')),
    educationLevel: z
      .enum(['high_school', 'associate', 'bachelor', 'master', 'doctorate', 'other'])
      .optional()
      .or(z.literal(''))
      .or(z.literal('all')),
    gender: z.enum(['male', 'female', 'other']).optional().or(z.literal('')).or(z.literal('all')),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(500).default(20),
    sortBy: z.string().trim().optional().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  }),
  params: z.object({}).passthrough(),
  body: z.object({}).passthrough(),
});
