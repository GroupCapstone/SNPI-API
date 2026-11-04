import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createPlacementTestBodySchema = z
  .object({
    testNumber: z
      .string()
      .trim()
      .toUpperCase()
      .regex(/^TEST-\d{6}$/, 'Test number must follow format TEST-XXXXXX')
      .optional(),
    registrationId: z.string().regex(objectIdRegex, 'Invalid Registration ID').optional(),
    studentId: z.string().regex(objectIdRegex, 'Invalid Student ID').optional(),
    studentName: z.string().trim().min(1, 'Student name is required').max(150),
    schoolId: z.string().regex(objectIdRegex, 'Invalid School ID'),
    branchId: z.string().regex(objectIdRegex, 'Invalid Branch ID'),
    programId: z.string().regex(objectIdRegex, 'Invalid Program ID'),
    recommendedLevelId: z.string().regex(objectIdRegex, 'Invalid Level ID'),
    testDate: z
      .string()
      .refine((d) => !isNaN(Date.parse(d)), 'Invalid test date format')
      .optional(),
    score: z.coerce.number().min(0, 'Score cannot be negative'),
    maxScore: z.coerce.number().min(1, 'Max score must be at least 1').default(100),
    examinerName: z.string().trim().max(100).optional(),
    status: z.enum(['scheduled', 'completed', 'passed', 'failed']).default('completed'),
    comments: z.string().trim().max(500).optional(),
  })
  .refine((data) => data.score <= data.maxScore, {
    message: 'Score cannot exceed maximum score',
    path: ['score'],
  });

export const createPlacementTestValidationSchema = z.object({
  body: createPlacementTestBodySchema,
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
});

export const updatePlacementTestBodySchema = z
  .object({
    registrationId: z.string().regex(objectIdRegex, 'Invalid Registration ID').optional(),
    studentId: z.string().regex(objectIdRegex, 'Invalid Student ID').optional(),
    studentName: z.string().trim().min(1, 'Student name is required').max(150).optional(),
    schoolId: z.string().regex(objectIdRegex, 'Invalid School ID').optional(),
    branchId: z.string().regex(objectIdRegex, 'Invalid Branch ID').optional(),
    programId: z.string().regex(objectIdRegex, 'Invalid Program ID').optional(),
    recommendedLevelId: z.string().regex(objectIdRegex, 'Invalid Level ID').optional(),
    testDate: z
      .string()
      .refine((d) => !isNaN(Date.parse(d)), 'Invalid test date format')
      .optional(),
    score: z.coerce.number().min(0, 'Score cannot be negative').optional(),
    maxScore: z.coerce.number().min(1, 'Max score must be at least 1').optional(),
    examinerName: z.string().trim().max(100).optional(),
    status: z.enum(['scheduled', 'completed', 'passed', 'failed']).optional(),
    comments: z.string().trim().max(500).optional(),
  })
  .refine(
    (data) =>
      !(data.score !== undefined && data.maxScore !== undefined && data.score > data.maxScore),
    {
      message: 'Score cannot exceed maximum score',
      path: ['score'],
    },
  );

export const updatePlacementTestValidationSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, 'Invalid Placement Test ID'),
  }),
  body: updatePlacementTestBodySchema,
  query: z.object({}).passthrough(),
});

export const placementTestQueryValidationSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    search: z.string().trim().optional(),
    registrationId: z
      .string()
      .regex(objectIdRegex, 'Invalid Registration ID')
      .optional()
      .or(z.literal('')),
    studentId: z.string().regex(objectIdRegex, 'Invalid Student ID').optional().or(z.literal('')),
    schoolId: z.string().regex(objectIdRegex, 'Invalid School ID').optional().or(z.literal('')),
    branchId: z
      .string()
      .regex(objectIdRegex, 'Invalid Branch ID')
      .optional()
      .or(z.literal(''))
      .or(z.literal('all')),
    programId: z.string().regex(objectIdRegex, 'Invalid Program ID').optional().or(z.literal('')),
    recommendedLevelId: z
      .string()
      .regex(objectIdRegex, 'Invalid Level ID')
      .optional()
      .or(z.literal('')),
    status: z.enum(['scheduled', 'completed', 'passed', 'failed']).optional().or(z.literal('')),
    sortBy: z.string().trim().optional().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  }),
  params: z.object({}).passthrough(),
  body: z.object({}).passthrough(),
});

export type CreatePlacementTestInput = z.infer<typeof createPlacementTestBodySchema>;
export type UpdatePlacementTestInput = z.infer<typeof updatePlacementTestBodySchema>;
