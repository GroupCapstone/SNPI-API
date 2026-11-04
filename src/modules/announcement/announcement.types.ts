import type { IAnnouncement } from './announcement.model';

export type AnnouncementCategory =
  'general' | 'academic' | 'finance' | 'attendance' | 'event' | 'urgent';

export type AnnouncementAudience = 'all' | 'students' | 'parents' | 'staff' | 'teachers';

export interface AnnouncementQueryFilters {
  schoolId?: string;
  branchId?: string;
  category?: AnnouncementCategory;
  audience?: AnnouncementAudience;
  isPublished?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  branchFilter?: Record<string, unknown>;
}

export interface CreateAnnouncementDTO {
  schoolId?: string;
  branchId?: string;
  title: string;
  content: string;
  category?: AnnouncementCategory;
  audience?: AnnouncementAudience;
  isPublished?: boolean;
  isPinned?: boolean;
  publishedAt?: Date | string;
  expiresAt?: Date | string;
}

export interface UpdateAnnouncementDTO {
  title?: string;
  content?: string;
  category?: AnnouncementCategory;
  audience?: AnnouncementAudience;
  isPublished?: boolean;
  isPinned?: boolean;
  publishedAt?: Date | string;
  expiresAt?: Date | string;
}

export interface PaginatedAnnouncements {
  data: IAnnouncement[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
