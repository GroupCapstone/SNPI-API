import { Types } from 'mongoose';

import { createSafeSearchRegex } from '../../utils/search';

import type { IPlacementTest } from './placement-test.model';
import { PlacementTestModel } from './placement-test.model';
import type { PlacementTestQueryFilters } from './placement-test.types';

export class PlacementTestRepository {
  public async create(data: Partial<IPlacementTest>): Promise<IPlacementTest> {
    return PlacementTestModel.create(data);
  }

  public async findById(id: string): Promise<IPlacementTest | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return PlacementTestModel.findOne({ _id: id, isDeleted: false })
      .populate('registrationId', 'registrationNumber firstName lastName khmerName phone status')
      .populate('studentId', 'studentId firstName lastName khmerName phone')
      .populate('schoolId', 'nameEn nameKh code')
      .populate('branchId', 'branchNameEn branchNameKh branchCode')
      .populate('programId', 'nameEn nameKh code')
      .populate('recommendedLevelId', 'name code sequence')
      .exec();
  }

  public async findByTestNumber(testNumber: string): Promise<IPlacementTest | null> {
    return PlacementTestModel.findOne({
      testNumber: testNumber.trim().toUpperCase(),
      isDeleted: false,
    }).exec();
  }

  public async findAll(
    filters: PlacementTestQueryFilters,
  ): Promise<{ data: IPlacementTest[]; total: number }> {
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

    if (filters.registrationId && Types.ObjectId.isValid(filters.registrationId)) {
      query.registrationId = new Types.ObjectId(filters.registrationId);
    }
    if (filters.studentId && Types.ObjectId.isValid(filters.studentId)) {
      query.studentId = new Types.ObjectId(filters.studentId);
    }
    if (filters.schoolId && Types.ObjectId.isValid(filters.schoolId)) {
      query.schoolId = new Types.ObjectId(filters.schoolId);
    }
    if (filters.branchId && Types.ObjectId.isValid(filters.branchId)) {
      query.branchId = new Types.ObjectId(filters.branchId);
    }
    if (filters.programId && Types.ObjectId.isValid(filters.programId)) {
      query.programId = new Types.ObjectId(filters.programId);
    }
    if (filters.recommendedLevelId && Types.ObjectId.isValid(filters.recommendedLevelId)) {
      query.recommendedLevelId = new Types.ObjectId(filters.recommendedLevelId);
    }
    if (filters.status) {
      query.status = filters.status;
    }
    if (filters.search) {
      const searchRegex = createSafeSearchRegex(filters.search);
      query.$or = [
        { testNumber: searchRegex },
        { studentName: searchRegex },
        { examinerName: searchRegex },
      ];
    }

    const sortField = filters.sortBy || 'createdAt';
    const sortDirection = filters.sortOrder === 'asc' ? 1 : -1;

    const [data, total] = await Promise.all([
      PlacementTestModel.find(query)
        .populate('registrationId', 'registrationNumber firstName lastName khmerName phone status')
        .populate('studentId', 'studentId firstName lastName khmerName phone')
        .populate('schoolId', 'nameEn nameKh code')
        .populate('branchId', 'branchNameEn branchNameKh branchCode')
        .populate('programId', 'nameEn nameKh code')
        .populate('recommendedLevelId', 'name code sequence')
        .sort({ [sortField]: sortDirection })
        .skip(skip)
        .limit(limit)
        .exec(),
      PlacementTestModel.countDocuments(query).exec(),
    ]);

    return { data, total };
  }

  public async updateById(
    id: string,
    updateData: Partial<IPlacementTest>,
  ): Promise<IPlacementTest | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return PlacementTestModel.findOneAndUpdate({ _id: id, isDeleted: false }, updateData, {
      new: true,
      runValidators: true,
    })
      .populate('registrationId', 'registrationNumber firstName lastName khmerName phone status')
      .populate('studentId', 'studentId firstName lastName khmerName phone')
      .populate('schoolId', 'nameEn nameKh code')
      .populate('branchId', 'branchNameEn branchNameKh branchCode')
      .populate('programId', 'nameEn nameKh code')
      .populate('recommendedLevelId', 'name code sequence')
      .exec();
  }

  public async softDelete(id: string, deletedBy?: string): Promise<IPlacementTest | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return PlacementTestModel.findOneAndUpdate(
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
