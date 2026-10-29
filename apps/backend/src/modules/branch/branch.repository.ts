import { Types } from 'mongoose';

import { createSafeSearchRegex } from '../../utils/search';

import type { IBranch } from './branch.model';
import { BranchModel } from './branch.model';
import type { BranchQueryFilters, CreateBranchDto, UpdateBranchDto } from './branch.types';

export class BranchRepository {
  public async findWithFilters(
    filters: BranchQueryFilters,
    branchFilter: Record<string, unknown> = {},
  ): Promise<{ data: IBranch[]; total: number }> {
    const query: Record<string, unknown> = {
      isDeleted: false,
      ...branchFilter,
    };

    if (filters.schoolId && Types.ObjectId.isValid(filters.schoolId)) {
      query.schoolId = new Types.ObjectId(filters.schoolId);
    }

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.search) {
      const searchRegex = createSafeSearchRegex(filters.search);
      query.$or = [
        { branchCode: searchRegex },
        { branchNameEn: searchRegex },
        { branchNameKh: searchRegex },
        { phone: searchRegex },
        { email: searchRegex },
        { address: searchRegex },
      ];
    }

    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      BranchModel.find(query)
        .populate('schoolId', 'code nameEn nameKh')
        .sort({ branchCode: 1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      BranchModel.countDocuments(query).exec(),
    ]);

    return { data, total };
  }

  public async findById(id: string): Promise<IBranch | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return BranchModel.findOne({ _id: id, isDeleted: false })
      .populate('schoolId', 'code nameEn nameKh')
      .exec();
  }

  public async findBySchoolAndCode(
    schoolId: string,
    branchCode: string,
    excludeId?: string,
  ): Promise<IBranch | null> {
    if (!Types.ObjectId.isValid(schoolId)) return null;
    const branch = await BranchModel.findOne({
      schoolId: new Types.ObjectId(schoolId),
      branchCode: branchCode.toUpperCase(),
      isDeleted: false,
    }).exec();

    if (!branch) return null;
    if (excludeId && String(branch._id) === String(excludeId)) {
      return null;
    }
    return branch;
  }

  public async create(dto: CreateBranchDto, userId?: string): Promise<IBranch> {
    const docData: Record<string, unknown> = {
      ...dto,
      schoolId: new Types.ObjectId(dto.schoolId),
      branchCode: dto.branchCode.toUpperCase(),
      ...(dto.managerId ? { managerId: new Types.ObjectId(dto.managerId) } : {}),
      ...(dto.openingDate ? { openingDate: new Date(dto.openingDate) } : {}),
    };

    if (userId && Types.ObjectId.isValid(userId)) {
      docData.createdBy = new Types.ObjectId(userId);
      docData.updatedBy = new Types.ObjectId(userId);
    }

    return BranchModel.create(docData);
  }

  public async update(id: string, dto: UpdateBranchDto, userId?: string): Promise<IBranch | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const updateData: Record<string, unknown> = {
      ...dto,
    };

    delete updateData._id;
    delete updateData.id;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    if (userId && Types.ObjectId.isValid(userId)) {
      updateData.updatedBy = new Types.ObjectId(userId);
    } else {
      delete updateData.updatedBy;
    }

    if (dto.schoolId && Types.ObjectId.isValid(dto.schoolId)) {
      updateData.schoolId = new Types.ObjectId(dto.schoolId);
    }
    if (dto.branchCode) {
      updateData.branchCode = dto.branchCode.toUpperCase();
    }
    if (dto.managerId !== undefined) {
      updateData.managerId =
        dto.managerId && Types.ObjectId.isValid(dto.managerId)
          ? new Types.ObjectId(dto.managerId)
          : null;
    }
    if (dto.openingDate !== undefined) {
      updateData.openingDate = dto.openingDate ? new Date(dto.openingDate) : null;
    }

    return BranchModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), isDeleted: false },
      { $set: updateData },
      { returnDocument: 'after' },
    )
      .populate('schoolId', 'code nameEn nameKh')
      .exec();
  }

  public async softDelete(id: string, userId?: string): Promise<IBranch | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const updateData: Record<string, unknown> = {
      isDeleted: true,
      status: 'closed',
    };

    if (userId && Types.ObjectId.isValid(userId)) {
      updateData.updatedBy = new Types.ObjectId(userId);
    }

    return BranchModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), isDeleted: false },
      { $set: updateData },
      { returnDocument: 'after' },
    ).exec();
  }
}
