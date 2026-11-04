import { Types } from 'mongoose';

import { createSafeSearchRegex } from '../../utils/search';

import type { IPosition } from './position.model';
import { PositionModel } from './position.model';
import type { CreatePositionDto, PositionQueryFilters, UpdatePositionDto } from './position.types';

export class PositionRepository {
  public async findWithFilters(
    filters: PositionQueryFilters,
    branchFilter: Record<string, unknown> = {},
  ): Promise<{ data: IPosition[]; total: number }> {
    const query: Record<string, unknown> = {
      isDeleted: false,
      ...branchFilter,
    };

    if (filters.schoolId && Types.ObjectId.isValid(filters.schoolId)) {
      query.schoolId = new Types.ObjectId(filters.schoolId);
    }

    if (filters.branchId && Types.ObjectId.isValid(filters.branchId)) {
      query.branchId = new Types.ObjectId(filters.branchId);
    }

    if (filters.departmentId && Types.ObjectId.isValid(filters.departmentId)) {
      query.departmentId = new Types.ObjectId(filters.departmentId);
    }

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.search) {
      const searchRegex = createSafeSearchRegex(filters.search);
      query.$or = [
        { code: searchRegex },
        { nameEn: searchRegex },
        { nameKh: searchRegex },
        { description: searchRegex },
      ];
    }

    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      PositionModel.find(query)
        .populate('schoolId', 'code nameEn nameKh')
        .populate('branchId', 'branchCode branchNameEn branchNameKh')
        .populate('departmentId', 'code nameEn nameKh')
        .sort({ code: 1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      PositionModel.countDocuments(query).exec(),
    ]);

    return { data, total };
  }

  public async findById(id: string): Promise<IPosition | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return PositionModel.findOne({ _id: id, isDeleted: false })
      .populate('schoolId', 'code nameEn nameKh')
      .populate('branchId', 'branchCode branchNameEn branchNameKh')
      .populate('departmentId', 'code nameEn nameKh')
      .exec();
  }

  public async findByDepartmentAndCode(
    departmentId: string,
    code: string,
    excludeId?: string,
  ): Promise<IPosition | null> {
    if (!Types.ObjectId.isValid(departmentId)) return null;
    const query: Record<string, unknown> = {
      departmentId: new Types.ObjectId(departmentId),
      code: code.toUpperCase(),
      isDeleted: false,
    };
    if (excludeId && Types.ObjectId.isValid(excludeId)) {
      query._id = { $ne: excludeId };
    }
    return PositionModel.findOne(query).exec();
  }

  public async create(dto: CreatePositionDto, userId?: string): Promise<IPosition> {
    return PositionModel.create({
      ...dto,
      schoolId: new Types.ObjectId(dto.schoolId),
      branchId: new Types.ObjectId(dto.branchId),
      departmentId: new Types.ObjectId(dto.departmentId),
      code: dto.code.toUpperCase(),
      createdBy: userId,
      updatedBy: userId,
    });
  }

  public async update(
    id: string,
    dto: UpdatePositionDto,
    userId?: string,
  ): Promise<IPosition | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const updateData: Record<string, unknown> = {
      ...dto,
      updatedBy: userId,
    };

    if (dto.schoolId) updateData.schoolId = new Types.ObjectId(dto.schoolId);
    if (dto.branchId) updateData.branchId = new Types.ObjectId(dto.branchId);
    if (dto.departmentId) updateData.departmentId = new Types.ObjectId(dto.departmentId);
    if (dto.code) updateData.code = dto.code.toUpperCase();

    return PositionModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: updateData },
      { new: true },
    )
      .populate('schoolId', 'code nameEn nameKh')
      .populate('branchId', 'branchCode branchNameEn branchNameKh')
      .populate('departmentId', 'code nameEn nameKh')
      .exec();
  }

  public async softDelete(id: string, userId?: string): Promise<IPosition | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return PositionModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      {
        $set: {
          isDeleted: true,
          status: 'inactive',
          updatedBy: userId,
        },
      },
      { new: true },
    ).exec();
  }
}
