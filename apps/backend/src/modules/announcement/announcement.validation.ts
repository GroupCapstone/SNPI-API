import { z } from 'zod';

export const announcementCategoryEnum = z.enum([
  'general',
  'academic',
  'finance',
  'attendance',
  'event',
  'urgent',
]);

export const announcementAudienceEnum = z.enum(['all', 'students', 'parents', 'staff', 'teachers']);

export const createAnnouncementValidationSchema = z.object({
  body: z
    .object({
      schoolId: z.string().optional(),
      branchId: z.string().optional(),
      title: z.string().trim().min(3).max(200),
      content: z.string().trim().min(10).max(5000),
      category: announcementCategoryEnum.default('general'),
      audience: announcementAudienceEnum.default('all'),
      isPublished: z.boolean().default(true),
      isPinned: z.boolean().default(false),
      publishedAt: z.union([z.string(), z.coerce.date()]).optional(),
      expiresAt: z.union([z.string(), z.coerce.date()]).optional(),
    })
    .refine((body) => {
      if (
        body.expiresAt &&
        body.publishedAt &&
        new Date(body.expiresAt) < new Date(body.publishedAt)
      ) {
        return false;
      }
      return true;
    }, 'Expiration date cannot be earlier than the publish date'),
});

export const updateAnnouncementValidationSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Announcement ID is required'),
  }),
  body: z
    .object({
      title: z.string().trim().min(3).max(200).optional(),
      content: z.string().trim().min(10).max(5000).optional(),
      category: announcementCategoryEnum.optional(),
      audience: announcementAudienceEnum.optional(),
      isPublished: z.boolean().optional(),
      isPinned: z.boolean().optional(),
      publishedAt: z.union([z.string(), z.coerce.date()]).optional(),
      expiresAt: z.union([z.string(), z.coerce.date()]).optional(),
    })
    .refine((body) => {
      if (
        body.expiresAt &&
        body.publishedAt &&
        new Date(body.expiresAt) < new Date(body.publishedAt)
      ) {
        return false;
      }
      return true;
    }, 'Expiration date cannot be earlier than the publish date'),
});

export const queryAnnouncementValidationSchema = z.object({
  query: z.object({
    schoolId: z.string().optional(),
    branchId: z.string().optional(),
    category: announcementCategoryEnum.optional(),
    audience: announcementAudienceEnum.optional(),
    isPublished: z.coerce.boolean().optional(),
    search: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
  }),
});
