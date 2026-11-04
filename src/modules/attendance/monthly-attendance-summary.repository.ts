import type { Types } from 'mongoose';

import type { IMonthlyAttendanceSummary } from './monthly-attendance-summary.model';
import { MonthlyAttendanceSummaryModel } from './monthly-attendance-summary.model';
import type {
  MonthlyAttendanceSummaryQueryFilters,
  PaginatedMonthlyAttendanceSummaries,
} from './monthly-attendance-summary.types';

export class MonthlyAttendanceSummaryRepository {
  public async findMany(
    filters: MonthlyAttendanceSummaryQueryFilters = {},
  ): Promise<PaginatedMonthlyAttendanceSummaries> {
    const query: Record<string, unknown> = { isDeleted: false };

    if (filters.authorizedBranchIds) {
      query.branchId = { $in: filters.authorizedBranchIds as unknown as Types.ObjectId[] };
    } else if (filters.branchId) {
      query.branchId = filters.branchId as unknown as Types.ObjectId;
    }

    if (filters.authorizedClassIds) {
      query.classId = { $in: filters.authorizedClassIds as unknown as Types.ObjectId[] };
    } else if (filters.classId) {
      query.classId = filters.classId as unknown as Types.ObjectId;
    }

    if (filters.academicYearId)
      query.academicYearId = filters.academicYearId as unknown as Types.ObjectId;
    if (filters.academicPeriodId)
      query.academicPeriodId = filters.academicPeriodId as unknown as Types.ObjectId;
    if (filters.studentId) query.studentId = filters.studentId as unknown as Types.ObjectId;
    if (filters.enrollmentId)
      query.enrollmentId = filters.enrollmentId as unknown as Types.ObjectId;
    if (filters.year) query.year = filters.year;
    if (filters.month) query.month = filters.month;
    if (filters.status) query.status = filters.status;

    const page = Math.max(1, Number(filters.page || 1));
    const limit = Math.min(100, Math.max(1, Number(filters.limit || 50)));
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      MonthlyAttendanceSummaryModel.find(query)
        .populate('studentId', 'studentId khmerName englishName gender photo')
        .populate('classId', 'classCode className')
        .populate('academicYearId', 'code name')
        .populate('academicPeriodId', 'code name type')
        .sort({ year: -1, month: 1, 'studentId.studentId': 1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      MonthlyAttendanceSummaryModel.countDocuments(query).exec(),
    ]);

    return {
      data: data as unknown as IMonthlyAttendanceSummary[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  public async findByClassMonth(
    classId: string,
    year: number,
    month: number,
  ): Promise<IMonthlyAttendanceSummary[]> {
    return MonthlyAttendanceSummaryModel.find({
      classId,
      year,
      month,
      isDeleted: false,
    })
      .populate('studentId', 'studentId khmerName englishName gender photo')
      .sort({ 'studentId.studentId': 1 })
      .lean()
      .exec() as unknown as Promise<IMonthlyAttendanceSummary[]>;
  }

  public async findByStudentYear(
    studentId: string,
    academicYearId?: string,
    year?: number,
  ): Promise<IMonthlyAttendanceSummary[]> {
    const query: Record<string, unknown> = {
      studentId,
      isDeleted: false,
    };
    if (academicYearId) query.academicYearId = academicYearId as unknown as Types.ObjectId;
    if (year) query.year = year;

    return MonthlyAttendanceSummaryModel.find(query)
      .populate('classId', 'classCode className')
      .populate('academicPeriodId', 'code name type')
      .sort({ year: 1, month: 1 })
      .lean()
      .exec() as unknown as Promise<IMonthlyAttendanceSummary[]>;
  }

  public async bulkUpsert(summaries: Array<Partial<IMonthlyAttendanceSummary>>): Promise<void> {
    if (summaries.length === 0) return;

    const operations = summaries.map((summary) => ({
      updateOne: {
        filter: {
          academicYearId: summary.academicYearId,
          year: summary.year,
          month: summary.month,
          classId: summary.classId,
          studentId: summary.studentId,
          isDeleted: false,
        },
        update: {
          $set: {
            ...summary,
            calculatedAt: new Date(),
          },
        },
        upsert: true,
      },
    }));

    await MonthlyAttendanceSummaryModel.bulkWrite(operations);
  }
}
