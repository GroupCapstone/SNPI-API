import { Types } from 'mongoose';

import { createSafeSearchRegex } from '../../utils/search';

import type { IRegistration } from './registration.model';
import { RegistrationModel } from './registration.model';
import type { RegistrationQueryFilters } from './registration.types';

export class RegistrationRepository {
  public async create(data: Partial<IRegistration>): Promise<IRegistration> {
    return RegistrationModel.create(data);
  }

  public async findById(id: string): Promise<IRegistration | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return RegistrationModel.findOne({ _id: id, isDeleted: false })
      .populate('schoolId', 'nameEn nameKh code')
      .populate('branchId', 'branchNameEn branchNameKh branchCode')
      .populate('academicYearId', 'name code isCurrent')
      .populate('programId', 'nameEn nameKh code')
      .exec();
  }

  public async findByRegistrationNumber(registrationNumber: string): Promise<IRegistration | null> {
    return RegistrationModel.findOne({
      registrationNumber: registrationNumber.trim().toUpperCase(),
      isDeleted: false,
    }).exec();
  }

  public async findAll(
    filters: RegistrationQueryFilters,
  ): Promise<{ data: IRegistration[]; total: number }> {
    const page = filters.page && filters.page > 0 ? filters.page : 1;
    const limit = filters.limit && filters.limit > 0 ? filters.limit : 20;
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = { isDeleted: false };
    if (filters.authorizedBranchIds) {
      query.branchId = {
        $in: filters.authorizedBranchIds
          .filter((id) => Types.ObjectId.isValid(id))
          .map((id) => new Types.ObjectId(id)),
      };
    }

    if (filters.schoolId && Types.ObjectId.isValid(filters.schoolId)) {
      query.schoolId = new Types.ObjectId(filters.schoolId);
    }
    if (filters.branchId && Types.ObjectId.isValid(filters.branchId)) {
      query.branchId = new Types.ObjectId(filters.branchId);
    }
    if (filters.academicYearId && Types.ObjectId.isValid(filters.academicYearId)) {
      query.academicYearId = new Types.ObjectId(filters.academicYearId);
    }
    if (filters.programId && Types.ObjectId.isValid(filters.programId)) {
      query.programId = new Types.ObjectId(filters.programId);
    }
    if (filters.status) {
      query.status = filters.status;
    }
    if (filters.search) {
      const searchRegex = createSafeSearchRegex(filters.search);
      query.$or = [
        { registrationNumber: searchRegex },
        { firstName: searchRegex },
        { lastName: searchRegex },
        { khmerName: searchRegex },
        { phone: searchRegex },
        { guardianName: searchRegex },
        { guardianPhone: searchRegex },
      ];
    }

    const sortField = filters.sortBy || 'createdAt';
    const sortDirection = filters.sortOrder === 'asc' ? 1 : -1;

    const [data, total] = await Promise.all([
      RegistrationModel.find(query)
        .populate('schoolId', 'nameEn nameKh code')
        .populate('branchId', 'branchNameEn branchNameKh branchCode')
        .populate('academicYearId', 'name code isCurrent')
        .populate('programId', 'nameEn nameKh code')
        .sort({ [sortField]: sortDirection })
        .skip(skip)
        .limit(limit)
        .exec(),
      RegistrationModel.countDocuments(query).exec(),
    ]);

    return { data, total };
  }

  public async updateById(
    id: string,
    updateData: Partial<IRegistration>,
  ): Promise<IRegistration | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return RegistrationModel.findOneAndUpdate({ _id: id, isDeleted: false }, updateData, {
      new: true,
      runValidators: true,
    })
      .populate('schoolId', 'nameEn nameKh code')
      .populate('branchId', 'branchNameEn branchNameKh branchCode')
      .populate('academicYearId', 'name code isCurrent')
      .populate('programId', 'nameEn nameKh code')
      .exec();
  }

  public async softDelete(id: string, deletedBy?: string): Promise<IRegistration | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return RegistrationModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      {
        isDeleted: true,
        deletedAt: new Date(),
        updatedBy: deletedBy ? new Types.ObjectId(deletedBy) : undefined,
      },
      { new: true },
    ).exec();
  }
}
