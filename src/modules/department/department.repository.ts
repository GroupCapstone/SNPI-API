import { Types } from 'mongoose';

import { createSafeSearchRegex } from '../../utils/search';

import type { IDepartment } from './department.model';
import { DepartmentModel } from './department.model';
import type {
  CreateDepartmentDto,
  DepartmentQueryFilters,
  UpdateDepartmentDto,
} from './department.types';

export class DepartmentRepository {
  public async findWithFilters(
    filters: DepartmentQueryFilters,
    branchFilter: Record<string, unknown> = {},
  ): Promise<{ data: IDepartment[]; total: number }> {
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
      DepartmentModel.find(query)
        .populate('schoolId', 'code nameEn nameKh')
        .populate('branchId', 'branchCode branchNameEn branchNameKh')
        .sort({ code: 1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      DepartmentModel.countDocuments(query).exec(),
    ]);

    return { data, total };
  }

  public async findById(id: string): Promise<IDepartment | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return DepartmentModel.findOne({ _id: id, isDeleted: false })
      .populate('schoolId', 'code nameEn nameKh')
      .populate('branchId', 'branchCode branchNameEn branchNameKh')
      .exec();
  }

  public async findByBranchAndCode(
    branchId: string,
    code: string,
    excludeId?: string,
  ): Promise<IDepartment | null> {
    if (!Types.ObjectId.isValid(branchId)) return null;
    const query: Record<string, unknown> = {
      branchId: new Types.ObjectId(branchId),
      code: code.toUpperCase(),
      isDeleted: false,
    };
    if (excludeId && Types.ObjectId.isValid(excludeId)) {
      query._id = { $ne: excludeId };
    }
    return DepartmentModel.findOne(query).exec();
  }

  public async create(dto: CreateDepartmentDto, userId?: string): Promise<IDepartment> {
    return DepartmentModel.create({
      ...dto,
      schoolId: new Types.ObjectId(dto.schoolId),
      branchId: new Types.ObjectId(dto.branchId),
      code: dto.code.toUpperCase(),
      ...(dto.managerId ? { managerId: new Types.ObjectId(dto.managerId) } : {}),
      createdBy: userId,
      updatedBy: userId,
    });
  }

  public async update(
    id: string,
    dto: UpdateDepartmentDto,
    userId?: string,
  ): Promise<IDepartment | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const updateData: Record<string, unknown> = {
      ...dto,
      updatedBy: userId,
    };

    if (dto.schoolId) updateData.schoolId = new Types.ObjectId(dto.schoolId);
    if (dto.branchId) updateData.branchId = new Types.ObjectId(dto.branchId);
    if (dto.code) updateData.code = dto.code.toUpperCase();
    if (dto.managerId !== undefined) {
      updateData.managerId = dto.managerId ? new Types.ObjectId(dto.managerId) : null;
    }

    return DepartmentModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: updateData },
      { new: true },
    )
      .populate('schoolId', 'code nameEn nameKh')
      .populate('branchId', 'branchCode branchNameEn branchNameKh')
      .exec();
  }

  public async softDelete(id: string, userId?: string): Promise<IDepartment | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return DepartmentModel.findOneAndUpdate(
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
