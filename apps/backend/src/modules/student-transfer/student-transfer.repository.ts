import type { ClientSession } from 'mongoose';
import { Types } from 'mongoose';

import { createSafeSearchRegex } from '../../utils/search';

import type { IStudentTransfer } from './student-transfer.model';
import { StudentTransferModel } from './student-transfer.model';
import type { StudentTransferQueryFilters } from './student-transfer.types';

export class StudentTransferRepository {
  public async create(data: Partial<IStudentTransfer>): Promise<IStudentTransfer> {
    return StudentTransferModel.create(data);
  }

  public async findById(id: string): Promise<IStudentTransfer | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return StudentTransferModel.findOne({ _id: id, isDeleted: false })
      .populate('studentId', 'studentId firstName lastName khmerName phone')
      .populate('fromSchoolId', 'nameEn nameKh code')
      .populate('toSchoolId', 'nameEn nameKh code')
      .populate('fromBranchId', 'branchNameEn branchNameKh branchCode')
      .populate('toBranchId', 'branchNameEn branchNameKh branchCode')
      .populate('fromClassId', 'className classCode shift')
      .populate('toClassId', 'className classCode shift')
      .populate('approvedBy', 'username email')
      .exec();
  }

  public async findByTransferNumber(transferNumber: string): Promise<IStudentTransfer | null> {
    return StudentTransferModel.findOne({
      transferNumber: transferNumber.trim().toUpperCase(),
      isDeleted: false,
    }).exec();
  }

  public async findAll(
    filters: StudentTransferQueryFilters,
  ): Promise<{ data: IStudentTransfer[]; total: number }> {
    const page = filters.page && filters.page > 0 ? filters.page : 1;
    const limit = filters.limit && filters.limit > 0 ? filters.limit : 20;
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = { isDeleted: false };
    const andClauses: Record<string, unknown>[] = [];

    if (filters.authorizedBranchIds) {
      andClauses.push({
        fromBranchId: { $in: filters.authorizedBranchIds },
        toBranchId: { $in: filters.authorizedBranchIds },
      });
    }

    if (filters.studentId && Types.ObjectId.isValid(filters.studentId)) {
      query.studentId = new Types.ObjectId(filters.studentId);
    }
    if (filters.schoolId && Types.ObjectId.isValid(filters.schoolId)) {
      query.fromSchoolId = new Types.ObjectId(filters.schoolId);
      query.toSchoolId = new Types.ObjectId(filters.schoolId);
    }
    if (filters.fromBranchId && Types.ObjectId.isValid(filters.fromBranchId)) {
      query.fromBranchId = new Types.ObjectId(filters.fromBranchId);
    }
    if (filters.toBranchId && Types.ObjectId.isValid(filters.toBranchId)) {
      query.toBranchId = new Types.ObjectId(filters.toBranchId);
    }
    if (filters.status) {
      query.status = filters.status;
    }
    if (filters.search) {
      const searchRegex = createSafeSearchRegex(filters.search);
      andClauses.push({ $or: [{ transferNumber: searchRegex }, { reason: searchRegex }] });
    }
    if (andClauses.length > 0) query.$and = andClauses;

    const sortField = filters.sortBy || 'createdAt';
    const sortDirection = filters.sortOrder === 'asc' ? 1 : -1;

    const [data, total] = await Promise.all([
      StudentTransferModel.find(query)
        .populate('studentId', 'studentId firstName lastName khmerName phone')
        .populate('fromSchoolId', 'nameEn nameKh code')
        .populate('toSchoolId', 'nameEn nameKh code')
        .populate('fromBranchId', 'branchNameEn branchNameKh branchCode')
        .populate('toBranchId', 'branchNameEn branchNameKh branchCode')
        .populate('fromClassId', 'className classCode shift')
        .populate('toClassId', 'className classCode shift')
        .populate('approvedBy', 'username email')
        .sort({ [sortField]: sortDirection })
        .skip(skip)
        .limit(limit)
        .exec(),
      StudentTransferModel.countDocuments(query).exec(),
    ]);

    return { data, total };
  }

  public async updateById(
    id: string,
    updateData: Partial<IStudentTransfer>,
    session?: ClientSession,
  ): Promise<IStudentTransfer | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const query = StudentTransferModel.findOneAndUpdate({ _id: id, isDeleted: false }, updateData, {
      new: true,
      runValidators: true,
    })
      .populate('studentId', 'studentId firstName lastName khmerName phone')
      .populate('fromSchoolId', 'nameEn nameKh code')
      .populate('toSchoolId', 'nameEn nameKh code')
      .populate('fromBranchId', 'branchNameEn branchNameKh branchCode')
      .populate('toBranchId', 'branchNameEn branchNameKh branchCode')
      .populate('fromClassId', 'className classCode shift')
      .populate('toClassId', 'className classCode shift')
      .populate('approvedBy', 'username email');
    if (session) query.session(session);
    return query.exec();
  }

  public async softDelete(id: string, deletedBy?: string): Promise<IStudentTransfer | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return StudentTransferModel.findOneAndUpdate(
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
