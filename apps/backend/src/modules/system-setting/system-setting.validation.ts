import { z } from 'zod';

export const settingCategoryEnum = z.enum([
  'general',
  'academic',
  'finance',
  'student',
  'employee',
  'security',
  'notification',
  'document',
  'sequence',
]);

export const settingTypeEnum = z.enum(['string', 'number', 'boolean', 'json']);

export const createSystemSettingValidationSchema = z.object({
  body: z.object({
    key: z.string().min(1, 'Setting key is required').max(100),
    value: z.unknown(),
    type: settingTypeEnum.default('string'),
    category: settingCategoryEnum.default('general'),
    schoolId: z.string().optional(),
    branchId: z.string().optional(),
    description: z.string().max(500).optional(),
    isEditable: z.boolean().default(true),
  }),
});

export const updateSystemSettingValidationSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Setting ID is required'),
  }),
  body: z.object({
    value: z.unknown(),
    description: z.string().max(500).optional(),
  }),
});

export const querySystemSettingValidationSchema = z.object({
  query: z.object({
    category: settingCategoryEnum.optional(),
    branchId: z.string().optional(),
    schoolId: z.string().optional(),
    search: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(50),
  }),
});
