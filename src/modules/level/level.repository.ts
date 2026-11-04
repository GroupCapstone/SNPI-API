import { Types } from 'mongoose';

import { createSafeSearchRegex } from '../../utils/search';

import type { ILevel } from './level.model';
import { LevelModel } from './level.model';
import type { CreateLevelDto, LevelQueryFilters, UpdateLevelDto } from './level.types';

export class LevelRepository {
  public async findWithFilters(
    filters: LevelQueryFilters,
    branchFilter: Record<string, unknown> = {},
  ): Promise<{ data: ILevel[]; total: number }> {
    const query: Record<string, unknown> = {
      isDeleted: false,
      ...branchFilter,
    };

    if (filters.schoolId && Types.ObjectId.isValid(filters.schoolId)) {
      query.schoolId = new Types.ObjectId(filters.schoolId);
    }

    if (filters.programId && Types.ObjectId.isValid(filters.programId)) {
      query.programId = new Types.ObjectId(filters.programId);
    }

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.search) {
      const searchRegex = createSafeSearchRegex(filters.search);
      const searchFilter = { $or: [{ code: searchRegex }, { name: searchRegex }] };
      if (query.$or) {
        const scopeFilter = { $or: query.$or };
        delete query.$or;
        query.$and = [scopeFilter, searchFilter];
      } else {
        Object.assign(query, searchFilter);
      }
    }

    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      LevelModel.find(query)
        .populate('programId', 'code nameEn nameKh')
        .sort({ sequence: 1, createdAt: 1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      LevelModel.countDocuments(query).exec(),
    ]);

    return { data, total };
  }

  public async findById(id: string, schoolId?: string): Promise<ILevel | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return LevelModel.findOne({ _id: id, ...(schoolId ? { schoolId } : {}), isDeleted: false })
      .populate('programId', 'code nameEn nameKh')
      .exec();
  }

  public async findByProgramAndCode(
    programId: string,
    code: string,
    excludeId?: string,
    schoolId?: string,
  ): Promise<ILevel | null> {
    if (!Types.ObjectId.isValid(programId)) return null;
    const query: Record<string, unknown> = {
      programId: new Types.ObjectId(programId),
      code: code.toUpperCase(),
      ...(schoolId ? { schoolId } : {}),
      isDeleted: false,
    };
    if (excludeId && Types.ObjectId.isValid(excludeId)) {
      query._id = { $ne: excludeId };
    }
    return LevelModel.findOne(query).exec();
  }

  public async create(dto: CreateLevelDto, userId?: string): Promise<ILevel> {
    return LevelModel.create({
      ...dto,
      programId: new Types.ObjectId(dto.programId),
      code: dto.code.toUpperCase(),
      createdBy: userId,
      updatedBy: userId,
    });
  }

  public async update(
    id: string,
    dto: UpdateLevelDto,
    userId?: string,
    schoolId?: string,
  ): Promise<ILevel | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const updateData: Record<string, unknown> = {
      ...dto,
      updatedBy: userId,
    };
    if (dto.programId) {
      updateData.programId = new Types.ObjectId(dto.programId);
    }
    if (dto.code) {
      updateData.code = dto.code.toUpperCase();
    }

    return LevelModel.findOneAndUpdate(
      { _id: id, ...(schoolId ? { schoolId } : {}), isDeleted: false },
      { $set: updateData },
      { new: true },
    )
      .populate('programId', 'code nameEn nameKh')
      .exec();
  }

  public async softDelete(id: string, userId?: string, schoolId?: string): Promise<ILevel | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return LevelModel.findOneAndUpdate(
      { _id: id, ...(schoolId ? { schoolId } : {}), isDeleted: false },
      {
        $set: {
          isDeleted: true,
          status: 'archived',
          updatedBy: userId,
        },
      },
      { new: true },
    ).exec();
  }
}
