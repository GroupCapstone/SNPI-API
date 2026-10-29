import type { ClientSession } from 'mongoose';
import { Types } from 'mongoose';

import { createSafeSearchRegex } from '../../utils/search';

import type { IEnrollment } from './enrollment.model';
import { EnrollmentModel } from './enrollment.model';
import type { EnrollmentQueryFilters } from './enrollment.types';
import { StudentModel } from '../student/student.model';

export class EnrollmentRepository {
  public async create(data: Partial<IEnrollment>, session?: ClientSession): Promise<IEnrollment> {
    if (session) {
      const [doc] = await EnrollmentModel.create([data], { session });
      return doc!;
    }
    return EnrollmentModel.create(data);
  }

  public async findById(id: string): Promise<IEnrollment | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return EnrollmentModel.findOne({ _id: id, isDeleted: false })
      .populate('studentId', 'studentId firstName lastName khmerName gender photo phone email')
      .populate('schoolId', 'nameEn nameKh code')
      .populate('branchId', 'branchNameEn branchNameKh branchCode')
      .populate('academicYearId', 'name code isCurrent')
      .populate('academicPeriodId', 'name code type startDate endDate')
      .populate('programId', 'nameEn nameKh code')
      .populate('levelId', 'name code sequence')
      .populate('classId', 'classCode className room capacity shift')
      .exec();
  }

  public async findByEnrollmentCode(
    enrollmentCode: string,
    session?: ClientSession,
  ): Promise<IEnrollment | null> {
    return EnrollmentModel.findOne(
      {
        enrollmentCode: enrollmentCode.trim().toUpperCase(),
        isDeleted: false,
      },
      null,
      { session },
    ).exec();
  }

  public async findExistingStudentEnrollment(
    studentId: string,
    academicYearId: string,
    classId: string,
  ): Promise<IEnrollment | null> {
    if (
      !Types.ObjectId.isValid(studentId) ||
      !Types.ObjectId.isValid(academicYearId) ||
      !Types.ObjectId.isValid(classId)
    ) {
      return null;
    }
    return EnrollmentModel.findOne({
      studentId: new Types.ObjectId(studentId),
      academicYearId: new Types.ObjectId(academicYearId),
      classId: new Types.ObjectId(classId),
      status: { $in: ['enrolled', 'active'] },
      isDeleted: false,
    }).exec();
  }

  public async findAll(
    filters: EnrollmentQueryFilters,
  ): Promise<{ data: IEnrollment[]; total: number }> {
    const page = filters.page && filters.page > 0 ? filters.page : 1;
    const limit = filters.limit && filters.limit > 0 ? filters.limit : 20;
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = { isDeleted: false };

    if (filters.authorizedClassIds) {
      query.classId = {
        $in: filters.authorizedClassIds
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

    if (filters.studentId && Types.ObjectId.isValid(filters.studentId)) {
      query.studentId = new Types.ObjectId(filters.studentId);
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
    if (filters.academicPeriodId && Types.ObjectId.isValid(filters.academicPeriodId)) {
      query.academicPeriodId = new Types.ObjectId(filters.academicPeriodId);
    }
    if (filters.programId && Types.ObjectId.isValid(filters.programId)) {
      query.programId = new Types.ObjectId(filters.programId);
    }
    if (filters.levelId && Types.ObjectId.isValid(filters.levelId)) {
      query.levelId = new Types.ObjectId(filters.levelId);
    }
    if (filters.classId && Types.ObjectId.isValid(filters.classId)) {
      query.classId = new Types.ObjectId(filters.classId);
    }
    if (filters.status) {
      query.status = filters.status;
    } else if (filters.statusGroup && filters.statusGroup !== 'all') {
      if (filters.statusGroup === 'continuing') {
        query.status = { $in: ['active', 'enrolled'] };
      } else if (filters.statusGroup === 'completed') {
        query.status = { $in: ['completed', 'promoted'] };
      } else if (filters.statusGroup === 'dropped') {
        query.status = { $in: ['dropped', 'suspended', 'withdrawn', 'cancelled'] };
      } else if (filters.statusGroup === 'transferred') {
        query.status = 'transferred';
      }
    }

    if (filters.tuitionStatus) {
      query.tuitionStatus = filters.tuitionStatus;
    }

    if (filters.startDate || filters.endDate) {
      const dateRange: Record<string, unknown> = {};
      if (filters.startDate) dateRange.$gte = new Date(filters.startDate);
      if (filters.endDate) dateRange.$lte = new Date(filters.endDate);
      query.enrollmentDate = dateRange;
    } else if (filters.year) {
      const y = Number(filters.year);
      const m = filters.month ? Number(filters.month) : undefined;
      const start = m !== undefined ? new Date(y, m - 1, 1) : new Date(y, 0, 1);
      const end =
        m !== undefined ? new Date(y, m, 0, 23, 59, 59, 999) : new Date(y, 11, 31, 23, 59, 59, 999);
      query.enrollmentDate = { $gte: start, $lte: end };
    }

    if (filters.search) {
      const regex = createSafeSearchRegex(filters.search);
      const matchedStudents = await StudentModel.find({
        isDeleted: false,
        $or: [
          { studentId: regex },
          { firstName: regex },
          { lastName: regex },
          { khmerName: regex },
        ],
      })
        .select('_id')
        .limit(200)
        .exec();

      const matchedStudentIds = matchedStudents.map((s) => s._id);

      query.$or = [{ enrollmentCode: regex }, { studentId: { $in: matchedStudentIds } }];
    }

    const sortField = filters.sortBy || 'createdAt';
    const sortDirection = filters.sortOrder === 'asc' ? 1 : -1;

    const [data, total] = await Promise.all([
      EnrollmentModel.find(query)
        .populate('studentId', 'studentId firstName lastName khmerName gender photo phone email')
        .populate('schoolId', 'nameEn nameKh code')
        .populate('branchId', 'branchNameEn branchNameKh branchCode')
        .populate('academicYearId', 'name code isCurrent')
        .populate('academicPeriodId', 'name code type startDate endDate')
        .populate('programId', 'nameEn nameKh code')
        .populate('levelId', 'name code sequence')
        .populate('classId', 'classCode className room capacity shift')
        .sort({ [sortField]: sortDirection })
        .skip(skip)
        .limit(limit)
        .exec(),
      EnrollmentModel.countDocuments(query).exec(),
    ]);

    return { data, total };
  }

  public async updateById(
    id: string,
    updateData: Partial<IEnrollment>,
    session?: ClientSession,
    expectedStatuses?: IEnrollment['status'][],
  ): Promise<IEnrollment | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return EnrollmentModel.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
        ...(expectedStatuses ? { status: { $in: expectedStatuses } } : {}),
      },
      updateData,
      {
        new: true,
        runValidators: true,
        session,
      },
    )
      .populate('studentId', 'studentId firstName lastName khmerName gender photo phone email')
      .populate('schoolId', 'nameEn nameKh code')
      .populate('branchId', 'branchNameEn branchNameKh branchCode')
      .populate('academicYearId', 'name code isCurrent')
      .populate('academicPeriodId', 'name code type startDate endDate')
      .populate('programId', 'nameEn nameKh code')
      .populate('levelId', 'name code sequence')
      .populate('classId', 'classCode className room capacity shift')
      .exec();
  }

  public async softDelete(id: string, deletedBy?: string): Promise<IEnrollment | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return EnrollmentModel.findOneAndUpdate(
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
