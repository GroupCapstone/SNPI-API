import type { Types } from 'mongoose';

import { createSafeSearchRegex } from '../../utils/search';
import type { AnnouncementQueryFilters, PaginatedAnnouncements } from './announcement.types';
import { AnnouncementModel } from './announcement.model';
import type { IAnnouncement } from './announcement.model';

export class AnnouncementRepository {
  public async findById(id: string | Types.ObjectId): Promise<IAnnouncement | null> {
    return AnnouncementModel.findOne({ _id: id, isDeleted: false })
      .populate('schoolId', 'code nameEn nameKh')
      .populate('branchId', 'branchCode branchNameEn')
      .exec();
  }

  public async findMany(filters: AnnouncementQueryFilters = {}): Promise<PaginatedAnnouncements> {
    const query: Record<string, unknown> = { isDeleted: false, ...(filters.branchFilter ?? {}) };

    if (filters.schoolId) query.schoolId = filters.schoolId;
    if (filters.branchId) query.branchId = filters.branchId;
    if (filters.category) query.category = filters.category;
    if (filters.audience) query.audience = filters.audience;
    if (filters.isPublished !== undefined) query.isPublished = filters.isPublished;

    if (filters.search) {
      const searchRegex = createSafeSearchRegex(filters.search);
      query.$or = [{ title: { $regex: searchRegex } }, { content: { $regex: searchRegex } }];
    }

    const page = Math.max(1, Number(filters.page || 1));
    const limit = Math.min(100, Math.max(1, Number(filters.limit || 20)));
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      AnnouncementModel.find(query)
        .populate('schoolId', 'code nameEn')
        .populate('branchId', 'branchCode branchNameEn')
        .sort({ isPinned: -1, publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      AnnouncementModel.countDocuments(query).exec(),
    ]);

    return {
      data: data as unknown as IAnnouncement[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  public async create(data: Partial<IAnnouncement>): Promise<IAnnouncement> {
    return AnnouncementModel.create(data);
  }

  public async updateById(
    id: string | Types.ObjectId,
    data: Partial<IAnnouncement>,
  ): Promise<IAnnouncement | null> {
    return AnnouncementModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: data },
      { new: true },
    ).exec();
  }

  public async softDelete(
    id: string | Types.ObjectId,
    userId?: string,
  ): Promise<IAnnouncement | null> {
    return AnnouncementModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: { isDeleted: true, updatedBy: userId } },
      { new: true },
    ).exec();
  }
}
