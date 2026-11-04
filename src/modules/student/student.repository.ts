import { Types } from 'mongoose';

import { createSafeExactRegex, createSafeSearchRegex } from '../../utils/search';

import type { IStudent } from './student.model';
import { StudentModel } from './student.model';
import type { DuplicateCheckCriteria, StudentQueryFilters } from './student.types';

export class StudentRepository {
  public async create(data: Partial<IStudent>): Promise<IStudent> {
    return StudentModel.create(data);
  }

  public async bulkCreate(students: Partial<IStudent>[]): Promise<IStudent[]> {
    return StudentModel.insertMany(students) as unknown as Promise<IStudent[]>;
  }

  public async findById(id: string): Promise<IStudent | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return StudentModel.findOne({ _id: id, isDeleted: false })
      .populate('schoolId', 'nameEn nameKh code')
      .populate('branchId', 'branchNameEn branchNameKh branchCode')
      .exec();
  }

  public async findByStudentId(studentId: string): Promise<IStudent | null> {
    return StudentModel.findOne({
      studentId: studentId.trim().toUpperCase(),
      isDeleted: false,
    }).exec();
  }

  public async findPotentialDuplicates(
    criteria: DuplicateCheckCriteria,
    authorizedBranchIds?: string[],
  ): Promise<IStudent[]> {
    const conditions: Record<string, unknown>[] = [];

    if (criteria.phone && criteria.phone.trim()) {
      conditions.push({ phone: criteria.phone.trim() });
    }

    if (criteria.guardianPhone && criteria.guardianPhone.trim()) {
      conditions.push({ 'guardians.phone': criteria.guardianPhone.trim() });
    }

    if (criteria.khmerName && criteria.khmerName.trim()) {
      const khmerTrimmed = criteria.khmerName.trim();
      if (criteria.dateOfBirth) {
        const dob = new Date(criteria.dateOfBirth);
        if (!isNaN(dob.getTime())) {
          // Exact khmerName + same calendar day
          const startOfDay = new Date(dob);
          startOfDay.setUTCHours(0, 0, 0, 0);
          const endOfDay = new Date(dob);
          endOfDay.setUTCHours(23, 59, 59, 999);

          conditions.push({
            khmerName: khmerTrimmed,
            dateOfBirth: { $gte: startOfDay, $lte: endOfDay },
          });
        }
      } else {
        conditions.push({ khmerName: khmerTrimmed });
      }
    }

    if (criteria.firstName && criteria.lastName && criteria.dateOfBirth) {
      const dob = new Date(criteria.dateOfBirth);
      if (!isNaN(dob.getTime())) {
        const startOfDay = new Date(dob);
        startOfDay.setUTCHours(0, 0, 0, 0);
        const endOfDay = new Date(dob);
        endOfDay.setUTCHours(23, 59, 59, 999);

        conditions.push({
          firstName: createSafeExactRegex(criteria.firstName),
          lastName: createSafeExactRegex(criteria.lastName),
          dateOfBirth: { $gte: startOfDay, $lte: endOfDay },
        });
      }
    }

    if (conditions.length === 0) {
      return [];
    }

    const query: Record<string, unknown> = {
      isDeleted: false,
      $or: conditions,
    };
    if (authorizedBranchIds) {
      query.branchId = {
        $in: authorizedBranchIds
          .filter((id) => Types.ObjectId.isValid(id))
          .map((id) => new Types.ObjectId(id)),
      };
    }

    if (criteria.excludeId && Types.ObjectId.isValid(criteria.excludeId)) {
      query._id = { $ne: new Types.ObjectId(criteria.excludeId) };
    }

    return StudentModel.find(query)
      .populate('schoolId', 'nameEn nameKh code')
      .populate('branchId', 'branchNameEn branchNameKh branchCode')
      .limit(10)
      .exec();
  }

  public async findAll(filters: StudentQueryFilters): Promise<{ data: IStudent[]; total: number }> {
    const page = filters.page && filters.page > 0 ? filters.page : 1;
    const limit = filters.limit && filters.limit > 0 ? filters.limit : 20;
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = { isDeleted: false };

    if (filters.authorizedStudentIds) {
      query._id = {
        $in: filters.authorizedStudentIds
          .filter((id) => Types.ObjectId.isValid(id))
          .map((id) => new Types.ObjectId(id)),
      };
    }
    if (filters.authorizedBranchIds) {
      query.branchId = {
        $in: filters.authorizedBranchIds
          .filter((id) => Types.ObjectId.isValid(id))
          .map((id) => new Types.ObjectId(id)),
      };
    }

    if (filters.branchId && Types.ObjectId.isValid(filters.branchId)) {
      query.branchId = new Types.ObjectId(filters.branchId);
    }

    if (filters.schoolId && Types.ObjectId.isValid(filters.schoolId)) {
      query.schoolId = new Types.ObjectId(filters.schoolId);
    }

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.gender) {
      query.gender = filters.gender;
    }

    if (filters.search) {
      const searchRegex = createSafeSearchRegex(filters.search);
      query.$or = [
        { studentId: searchRegex },
        { firstName: searchRegex },
        { lastName: searchRegex },
        { khmerName: searchRegex },
        { phone: searchRegex },
        { email: searchRegex },
        { 'guardians.fullName': searchRegex },
        { 'guardians.phone': searchRegex },
      ];
    }

    const sortField = filters.sortBy || 'createdAt';
    const sortDirection = filters.sortOrder === 'asc' ? 1 : -1;

    const [data, total] = await Promise.all([
      StudentModel.find(query)
        .populate('schoolId', 'nameEn nameKh code')
        .populate('branchId', 'branchNameEn branchNameKh branchCode')
        .sort({ [sortField]: sortDirection })
        .skip(skip)
        .limit(limit)
        .exec(),
      StudentModel.countDocuments(query).exec(),
    ]);

    return { data, total };
  }

  public async updateById(id: string, updateData: Partial<IStudent>): Promise<IStudent | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return StudentModel.findOneAndUpdate({ _id: id, isDeleted: false }, updateData, {
      new: true,
      runValidators: true,
    })
      .populate('schoolId', 'nameEn nameKh code')
      .populate('branchId', 'branchNameEn branchNameKh branchCode')
      .exec();
  }

  public async softDelete(id: string, deletedBy?: string): Promise<IStudent | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return StudentModel.findOneAndUpdate(
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
