import type { Types } from 'mongoose';

import type { ISystemSetting } from './system-setting.model';
import { SystemSettingModel } from './system-setting.model';
import type { PaginatedSystemSettings, SystemSettingQueryFilters } from './system-setting.types';

export class SystemSettingRepository {
  public async findById(id: string | Types.ObjectId): Promise<ISystemSetting | null> {
    return SystemSettingModel.findOne({ _id: id, isDeleted: false })
      .populate('schoolId', 'code nameEn nameKh')
      .populate('branchId', 'branchCode branchNameEn')
      .exec();
  }

  public async findByKey(
    schoolId: string | Types.ObjectId,
    key: string,
    branchId?: string | Types.ObjectId,
  ): Promise<ISystemSetting | null> {
    const query: Record<string, unknown> = {
      schoolId,
      key: key.trim().toUpperCase(),
      isDeleted: false,
    };
    if (branchId && branchId !== 'central' && branchId !== 'null') {
      query.branchId = branchId;
    } else {
      query.branchId = null;
    }
    return SystemSettingModel.findOne(query).exec();
  }

  public async resolveEffectiveSetting(
    schoolId: string | Types.ObjectId,
    key: string,
    branchId?: string | Types.ObjectId,
  ): Promise<ISystemSetting | null> {
    const keyUpper = key.trim().toUpperCase();
    if (branchId && branchId !== 'central' && branchId !== 'null') {
      const branchSetting = await SystemSettingModel.findOne({
        schoolId,
        key: keyUpper,
        branchId,
        isDeleted: false,
      })
        .lean()
        .exec();
      if (branchSetting) return branchSetting as unknown as ISystemSetting;
    }
    const schoolSetting = await SystemSettingModel.findOne({
      schoolId,
      key: keyUpper,
      branchId: null,
      isDeleted: false,
    })
      .lean()
      .exec();
    return schoolSetting as unknown as ISystemSetting | null;
  }

  public async findMany(filters: SystemSettingQueryFilters = {}): Promise<PaginatedSystemSettings> {
    const query: Record<string, unknown> = { isDeleted: false };

    if (filters.schoolId) query.schoolId = filters.schoolId;
    if (filters.branchId === 'central' || filters.branchId === 'null') {
      query.branchId = null;
    } else if (filters.branchId) {
      query.branchId = filters.branchId;
    }
    if (filters.category) query.category = filters.category;
    if (filters.search) {
      query.$or = [
        { key: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const page = Math.max(1, Number(filters.page || 1));
    const limit = Math.min(100, Math.max(1, Number(filters.limit || 50)));
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      SystemSettingModel.find(query)
        .populate('schoolId', 'code nameEn')
        .populate('branchId', 'branchCode branchNameEn')
        .sort({ category: 1, key: 1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      SystemSettingModel.countDocuments(query).exec(),
    ]);

    return {
      data: data as unknown as ISystemSetting[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  public async create(data: Partial<ISystemSetting>): Promise<ISystemSetting> {
    return SystemSettingModel.create(data);
  }

  public async updateById(
    id: string | Types.ObjectId,
    data: Partial<ISystemSetting>,
  ): Promise<ISystemSetting | null> {
    return SystemSettingModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: data },
      { new: true },
    ).exec();
  }

  public async softDelete(
    id: string | Types.ObjectId,
    userId?: string,
  ): Promise<ISystemSetting | null> {
    return this.softDeleteById(id, userId);
  }

  public async softDeleteById(
    id: string | Types.ObjectId,
    userId?: string,
  ): Promise<ISystemSetting | null> {
    return SystemSettingModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: { isDeleted: true, updatedBy: userId } },
      { new: true },
    ).exec();
  }
}
