import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const objectIdSchema = z.string().regex(objectIdRegex, 'Invalid ObjectId');

export const createSkillSchema = z.object({
  code: z
    .string()
    .trim()
    .min(2, 'Skill code must be at least 2 characters')
    .max(50, 'Skill code cannot exceed 50 characters')
    .toUpperCase(),
  name: z
    .string()
    .trim()
    .min(2, 'Skill name must be at least 2 characters')
    .max(150, 'Skill name cannot exceed 150 characters'),
  category: z.enum([
    'pedagogy',
    'technical',
    'leadership',
    'administration',
    'communication',
    'language',
    'domain',
    'general',
  ]),
  description: z.string().trim().max(500, 'Description cannot exceed 500 characters').optional(),
  isActive: z.boolean().default(true),
  schoolId: objectIdSchema.optional(),
});

export const updateSkillSchema = createSkillSchema.partial();

export const skillQuerySchema = z.object({
  search: z.string().optional(),
  category: z
    .enum([
      'pedagogy',
      'technical',
      'leadership',
      'administration',
      'communication',
      'language',
      'domain',
      'general',
    ])
    .optional(),
  isActive: z
    .enum(['true', 'false'])
    .transform((val) => val === 'true')
    .optional(),
  schoolId: objectIdSchema.optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const createRoleSkillRequirementSchema = z.object({
  roleId: objectIdSchema,
  skillId: objectIdSchema,
  requiredLevel: z.coerce.number().int().min(1).max(5),
  isRequired: z.boolean().default(true),
  notes: z.string().trim().max(500).optional(),
});

export const updateRoleSkillRequirementSchema = z.object({
  requiredLevel: z.coerce.number().int().min(1).max(5).optional(),
  isRequired: z.boolean().optional(),
  notes: z.string().trim().max(500).optional(),
});

export const batchRoleSkillRequirementsSchema = z.object({
  requirements: z
    .array(
      z.object({
        skillId: objectIdSchema,
        requiredLevel: z.coerce.number().int().min(1).max(5),
        isRequired: z.boolean().default(true),
        notes: z.string().trim().max(500).optional(),
      }),
    )
    .min(1, 'At least one skill requirement is required'),
});

export const createEmployeeSkillSchema = z.object({
  employeeId: objectIdSchema,
  skillId: objectIdSchema,
  proficiencyLevel: z.coerce.number().int().min(1).max(5),
  yearsExperience: z.coerce.number().min(0).max(60).default(0),
  evidenceDocument: z.string().trim().max(200).optional(),
  evidenceUrl: z.string().trim().url('Invalid URL format').or(z.literal('')).optional(),
  expiryDate: z.string().datetime().or(z.string().date()).optional().nullable(),
  notes: z.string().trim().max(500).optional(),
});

export const updateEmployeeSkillSchema = z.object({
  proficiencyLevel: z.coerce.number().int().min(1).max(5).optional(),
  yearsExperience: z.coerce.number().min(0).max(60).optional(),
  evidenceDocument: z.string().trim().max(200).optional(),
  evidenceUrl: z.string().trim().url('Invalid URL format').or(z.literal('')).optional(),
  expiryDate: z.string().datetime().or(z.string().date()).optional().nullable(),
  notes: z.string().trim().max(500).optional(),
});

export const verifyEmployeeSkillSchema = z.object({
  status: z.enum(['verified', 'rejected', 'pending']),
  notes: z.string().trim().max(500).optional(),
});

export const employeeSkillQuerySchema = z.object({
  employeeId: objectIdSchema.optional(),
  skillId: objectIdSchema.optional(),
  status: z.enum(['pending', 'verified', 'expired', 'rejected']).optional(),
  branchId: objectIdSchema.optional(),
  departmentId: objectIdSchema.optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export const skillGapQuerySchema = z.object({
  branchId: objectIdSchema.optional(),
  departmentId: objectIdSchema.optional(),
  roleId: objectIdSchema.optional(),
  employeeId: objectIdSchema.optional(),
  category: z
    .enum([
      'pedagogy',
      'technical',
      'leadership',
      'administration',
      'communication',
      'language',
      'domain',
      'general',
    ])
    .optional(),
  hasGapOnly: z
    .enum(['true', 'false'])
    .transform((val) => val === 'true')
    .optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});
