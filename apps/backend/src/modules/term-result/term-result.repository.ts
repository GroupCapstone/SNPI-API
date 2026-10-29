import type { Types } from 'mongoose';

import type { ITermResult } from './term-result.model';
import { TermResultModel } from './term-result.model';
import type { PaginatedTermResults, TermResultQueryFilters } from './term-result.types';

export class TermResultRepository {
  public async findById(id: string | Types.ObjectId): Promise<ITermResult | null> {
    return TermResultModel.findOne({ _id: id, isDeleted: false })
      .populate('studentId', 'studentId khmerName englishName gender photo')
      .populate('classId', 'classCode className')
      .populate('academicPeriodId', 'code name type startDate endDate')
      .populate('academicYearId', 'code name')
      .populate('programId', 'code nameEn nameKh')
      .populate('levelId', 'code name sequence')
      .populate('nextLevelId', 'code name sequence')
      .populate('nextPeriodId', 'code name')
      .populate('nextEnrollmentId', 'enrollmentCode status')
      .populate('enrollmentId', 'enrollmentCode status')
      .exec();
  }

  public async findByEnrollment(enrollmentId: string): Promise<ITermResult | null> {
    return TermResultModel.findOne({ enrollmentId, isDeleted: false }).exec();
  }

  public async findMany(filters: TermResultQueryFilters = {}): Promise<PaginatedTermResults> {
    const query: Record<string, unknown> = { isDeleted: false };

    if (filters.authorizedClassIds) query.classId = { $in: filters.authorizedClassIds };

    if (filters.schoolId) query.schoolId = filters.schoolId;
    if (filters.branchId) query.branchId = filters.branchId;
    else if (filters.authorizedBranchIds) query.branchId = { $in: filters.authorizedBranchIds };
    if (filters.academicYearId) query.academicYearId = filters.academicYearId;
    if (filters.academicPeriodId) query.academicPeriodId = filters.academicPeriodId;
    if (filters.programId) query.programId = filters.programId;
    if (filters.levelId) query.levelId = filters.levelId;
    if (filters.classId) query.classId = filters.classId;
    if (filters.studentId) query.studentId = filters.studentId;
    if (filters.resultStatus) query.resultStatus = filters.resultStatus;
    if (filters.promotionStatus) query.promotionStatus = filters.promotionStatus;
    if (filters.isCompleted !== undefined) query.isCompleted = filters.isCompleted;
    if (filters.workflowStatus) query.workflowStatus = filters.workflowStatus;

    const page = Math.max(1, Number(filters.page || 1));
    const limit = Math.min(100, Math.max(1, Number(filters.limit || 50)));
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      TermResultModel.find(query)
        .populate('studentId', 'studentId khmerName englishName gender photo')
        .populate('classId', 'classCode className')
        .populate('academicPeriodId', 'code name type')
        .populate('programId', 'code nameEn')
        .populate('levelId', 'code name sequence')
        .populate('nextLevelId', 'code name sequence')
        .sort({ averageScore: -1, studentId: 1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      TermResultModel.countDocuments(query).exec(),
    ]);

    return {
      data: data as unknown as ITermResult[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  public async upsertResult(data: Partial<ITermResult>, userId?: string): Promise<ITermResult> {
    const existing = await TermResultModel.findOne({
      academicPeriodId: data.academicPeriodId,
      classId: data.classId,
      studentId: data.studentId,
      isDeleted: false,
    });

    if (existing) {
      Object.assign(existing, data, { updatedBy: userId });
      return existing.save();
    }

    const newResult = new TermResultModel({
      ...data,
      createdBy: userId,
      updatedBy: userId,
    });
    return newResult.save();
  }
}
