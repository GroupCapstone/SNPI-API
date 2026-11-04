import { z } from 'zod';

const websiteSchema = z.preprocess(
  (v) => (typeof v === 'string' ? v.trim() : v),
  z
    .string()
    .refine(
      (val) =>
        !val ||
        /^https?:\/\/.+/i.test(val) ||
        /^[a-zA-Z0-9][-a-zA-Z0-9]*(\.[a-zA-Z0-9][-a-zA-Z0-9]*)+/i.test(val),
      'Invalid website URL format',
    )
    .optional()
    .or(z.literal(''))
    .nullable(),
);

const emailSchema = z.preprocess(
  (v) => (typeof v === 'string' ? v.trim() : v),
  z.string().email('Invalid email address').optional().or(z.literal('')).nullable(),
);

export const createSchoolSchema = z.object({
  body: z.object({
    code: z
      .string()
      .min(1, 'School code is required')
      .max(20, 'School code cannot exceed 20 characters')
      .trim()
      .toUpperCase(),
    nameEn: z.string().min(1, 'English name is required').trim(),
    nameKh: z.string().min(1, 'Khmer name is required').trim(),
    logo: z.string().optional().or(z.literal('')).nullable(),
    phone: z.string().trim().optional().or(z.literal('')).nullable(),
    email: emailSchema,
    address: z.string().trim().optional().or(z.literal('')).nullable(),
    website: websiteSchema,
    status: z.enum(['active', 'inactive']).default('active'),
  }),
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
});

export const updateSchoolSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'School ID is required'),
  }),
  body: z.object({
    code: z.string().min(1).max(20).trim().toUpperCase().optional(),
    nameEn: z.string().min(1).trim().optional(),
    nameKh: z.string().min(1).trim().optional(),
    logo: z.string().optional().or(z.literal('')).nullable(),
    phone: z.string().trim().optional().or(z.literal('')).nullable(),
    email: emailSchema,
    address: z.string().trim().optional().or(z.literal('')).nullable(),
    website: websiteSchema,
    status: z.enum(['active', 'inactive']).optional(),
  }),
  query: z.object({}).passthrough(),
});

export const querySchoolSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    status: z.enum(['active', 'inactive']).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(500).default(20),
  }),
  params: z.object({}).passthrough(),
  body: z.object({}).passthrough(),
});
