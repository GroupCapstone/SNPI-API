import { z } from 'zod';

export const curriculumSubjectSchema = z.object({
  subjectId: z.string().min(1, 'Subject ID is required'),
  weeklyHours: z.coerce.number().min(0.5, 'Weekly hours must be at least 0.5').default(2),
  totalHours: z.coerce.number().min(1).optional().default(40),
  sequence: z.coerce.number().int().min(1).default(1),
  passingScore: z.coerce.number().min(0).max(100).default(50),
  isRequired: z.boolean().default(true),
});

export const createCurriculumSchema = z.object({
  body: z.object({
    schoolId: z.string().optional(),
    branchId: z.string().optional(),
    programId: z.string().min(1, 'Program ID is required'),
    levelId: z.string().min(1, 'Level ID is required'),
    academicYearId: z.string().min(1, 'Academic Year ID is required'),
    name: z.string().min(1, 'Curriculum name is required').trim(),
    code: z
      .string()
      .min(1, 'Curriculum code cannot be empty')
      .max(30, 'Curriculum code cannot exceed 30 characters')
      .trim()
      .toUpperCase(),
    description: z.string().optional(),
    subjects: z.array(curriculumSubjectSchema).default([]),
    status: z.enum(['active', 'inactive', 'archived']).default('active'),
  }),
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
});

export const updateCurriculumSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Curriculum ID is required'),
  }),
  body: z.object({
    branchId: z.string().optional(),
    programId: z.string().optional(),
    levelId: z.string().optional(),
    academicYearId: z.string().optional(),
    name: z.string().min(1).trim().optional(),
    code: z.string().min(1).max(30).trim().toUpperCase().optional(),
    description: z.string().optional(),
    subjects: z.array(curriculumSubjectSchema).optional(),
    status: z.enum(['active', 'inactive', 'archived']).optional(),
  }),
  query: z.object({}).passthrough(),
});

export const queryCurriculumSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    schoolId: z.string().optional().or(z.literal('')).or(z.literal('all')),
    branchId: z.string().optional().or(z.literal('')).or(z.literal('all')),
    programId: z.string().optional().or(z.literal('')).or(z.literal('all')),
    levelId: z.string().optional().or(z.literal('')).or(z.literal('all')),
    academicYearId: z.string().optional().or(z.literal('')).or(z.literal('all')),
    status: z
      .enum(['active', 'inactive', 'archived'])
      .optional()
      .or(z.literal(''))
      .or(z.literal('all')),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }),
  params: z.object({}).passthrough(),
  body: z.object({}).passthrough(),
});
