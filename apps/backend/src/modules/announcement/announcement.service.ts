import { Types } from 'mongoose';

import { getAuthorizedBranchFilter, checkBranchAccess } from '../../middleware/branch-access';
import { BadRequestError, ForbiddenError, NotFoundError } from '../../shared/errors/app-error';
import type { AuthUser } from '../../types/auth';
import { AuditLogService } from '../audit-log/audit-log.service';
import { BranchModel } from '../branch/branch.model';
import { SchoolModel } from '../school/school.model';
import { AnnouncementRepository } from './announcement.repository';
import type { IAnnouncement } from './announcement.model';
import type {
  AnnouncementQueryFilters,
  CreateAnnouncementDTO,
  PaginatedAnnouncements,
  UpdateAnnouncementDTO,
} from './announcement.types';

export class AnnouncementService {
  public constructor(private readonly repository = new AnnouncementRepository()) {}

  public async getAnnouncements(
    filters: AnnouncementQueryFilters = {},
    user: AuthUser,
  ): Promise<PaginatedAnnouncements> {
    if (filters.branchId && !checkBranchAccess(user.branchAccess, filters.branchId)) {
      throw new ForbiddenError('You do not have access to announcements for this branch');
    }

    const schoolId = filters.schoolId || user.schoolId;
    const branchFilter = getAuthorizedBranchFilter(user.branchAccess, filters.branchId);

    return this.repository.findMany({
      ...filters,
      schoolId,
      branchFilter,
    });
  }

  public async getAnnouncementById(id: string, user: AuthUser): Promise<IAnnouncement> {
    const announcement = await this.repository.findById(id);
    if (!announcement) {
      throw new NotFoundError('Announcement not found');
    }

    if (
      announcement.branchId &&
      !checkBranchAccess(user.branchAccess, String(announcement.branchId))
    ) {
      throw new ForbiddenError('You do not have access to this announcement');
    }

    return announcement;
  }

  public async createAnnouncement(
    dto: CreateAnnouncementDTO,
    user: AuthUser,
  ): Promise<IAnnouncement> {
    const title = dto.title.trim();
    const content = dto.content.trim();

    if (!title || !content) {
      throw new BadRequestError('Announcement title and content are required');
    }

    const schoolId = dto.schoolId || user.schoolId;
    const school = await SchoolModel.findOne({ _id: schoolId, isDeleted: false }).exec();
    if (!school) {
      throw new NotFoundError('School not found');
    }

    if (dto.branchId) {
      if (!checkBranchAccess(user.branchAccess, dto.branchId)) {
        throw new ForbiddenError('You do not have access to create announcements for this branch');
      }

      const branch = await BranchModel.findOne({
        _id: dto.branchId,
        schoolId,
        isDeleted: false,
      }).exec();
      if (!branch) {
        throw new NotFoundError('Branch not found');
      }
    }

    const announcement = await this.repository.create({
      schoolId: new Types.ObjectId(schoolId),
      branchId: dto.branchId ? new Types.ObjectId(dto.branchId) : undefined,
      title,
      content,
      category: dto.category || 'general',
      audience: dto.audience || 'all',
      isPublished: dto.isPublished !== undefined ? dto.isPublished : true,
      isPinned: dto.isPinned ?? false,
      publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : new Date(),
      expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
      createdBy: user.userId,
      updatedBy: user.userId,
    });

    await AuditLogService.log({
      userId: user.userId,
      schoolId: String(schoolId),
      branchId: dto.branchId ? String(dto.branchId) : undefined,
      module: 'announcement',
      action: 'CREATE',
      entityType: 'Announcement',
      entityId: String(announcement._id),
      newValue: {
        title: announcement.title,
        category: announcement.category,
        audience: announcement.audience,
      },
    });

    return announcement;
  }

  public async updateAnnouncement(
    id: string,
    dto: UpdateAnnouncementDTO,
    user: AuthUser,
  ): Promise<IAnnouncement> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError('Announcement not found');
    }

    if (existing.branchId && !checkBranchAccess(user.branchAccess, String(existing.branchId))) {
      throw new ForbiddenError('You do not have access to update this announcement');
    }

    const updates: Partial<IAnnouncement> = {};

    if (dto.title !== undefined) {
      const nextTitle = dto.title.trim();
      if (!nextTitle) {
        throw new BadRequestError('Announcement title is required');
      }
      updates.title = nextTitle;
    }

    if (dto.content !== undefined) {
      const nextContent = dto.content.trim();
      if (!nextContent) {
        throw new BadRequestError('Announcement content is required');
      }
      updates.content = nextContent;
    }

    if (dto.category) updates.category = dto.category;
    if (dto.audience) updates.audience = dto.audience;
    if (dto.isPublished !== undefined) {
      updates.isPublished = dto.isPublished;
      updates.publishedAt = dto.isPublished
        ? (existing.publishedAt ?? new Date())
        : existing.publishedAt;
    }
    if (dto.isPinned !== undefined) updates.isPinned = dto.isPinned;
    if (dto.publishedAt !== undefined) updates.publishedAt = new Date(dto.publishedAt);
    if (dto.expiresAt !== undefined) updates.expiresAt = new Date(dto.expiresAt);

    updates.updatedBy = user.userId;

    const updated = await this.repository.updateById(id, updates);
    if (!updated) {
      throw new NotFoundError('Announcement not found');
    }

    await AuditLogService.log({
      userId: user.userId,
      schoolId: String(existing.schoolId),
      branchId: existing.branchId ? String(existing.branchId) : undefined,
      module: 'announcement',
      action: 'UPDATE',
      entityType: 'Announcement',
      entityId: id,
      oldValue: { title: existing.title, content: existing.content },
      newValue: { title: updated.title, content: updated.content },
    });

    return updated;
  }

  public async deleteAnnouncement(id: string, user: AuthUser): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError('Announcement not found');
    }

    if (existing.branchId && !checkBranchAccess(user.branchAccess, String(existing.branchId))) {
      throw new ForbiddenError('You do not have access to delete this announcement');
    }

    await this.repository.softDelete(id, user.userId);

    await AuditLogService.log({
      userId: user.userId,
      schoolId: String(existing.schoolId),
      branchId: existing.branchId ? String(existing.branchId) : undefined,
      module: 'announcement',
      action: 'DELETE',
      entityType: 'Announcement',
      entityId: id,
      oldValue: { title: existing.title },
    });
  }
}
