import { z } from 'zod';

export const createSubjectSchema = z.object({
  body: z.object({
    schoolId: z.string().optional(),
    branchId: z.string().optional(),
    code: z
      .string()
      .min(1, 'Subject code cannot be empty')
      .max(20, 'Subject code cannot exceed 20 characters')
      .trim()
      .toUpperCase(),
    name: z.string().min(1, 'Subject name is required').trim(),
    category: z.enum(['english', 'computer', 'general', 'other']).default('general').optional(),
    description: z.string().optional(),
    status: z.enum(['active', 'inactive', 'archived']).default('active'),
  }),
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
});

export const updateSubjectSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Subject ID is required'),
  }),
  body: z.object({
    branchId: z.string().optional(),
    code: z.string().min(1).max(20).trim().toUpperCase().optional(),
    name: z.string().min(1).trim().optional(),
    category: z.enum(['english', 'computer', 'general', 'other']).optional(),
    description: z.string().optional(),
    status: z.enum(['active', 'inactive', 'archived']).optional(),
  }),
  query: z.object({}).passthrough(),
});

export const querySubjectSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    branchId: z.string().optional(),
    category: z.enum(['english', 'computer', 'general', 'other']).optional(),
    status: z.enum(['active', 'inactive', 'archived']).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }),
  params: z.object({}).passthrough(),
  body: z.object({}).passthrough(),
});
