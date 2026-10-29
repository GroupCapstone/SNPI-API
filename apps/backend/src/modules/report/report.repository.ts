import type { IOfficialDocument, OfficialDocumentType } from './report.model';
import { OfficialDocumentModel } from './report.model';
import { AssessmentModel } from '../assessment/assessment.model';
import { AttendanceRecordModel } from '../attendance/attendance-record.model';
import { AttendanceModel } from '../attendance/attendance.model';
import { EnrollmentModel } from '../enrollment/enrollment.model';
import { PaymentModel } from '../payment/payment.model';
import { ScoreModel } from '../score/score.model';
import { StudentTransferModel } from '../student-transfer/student-transfer.model';
import { StudentModel } from '../student/student.model';
import { TuitionFeeModel } from '../tuition/tuition-fee.model';
import { BranchModel } from '../branch/branch.model';
import { TermResultModel } from '../term-result/term-result.model';
import type {
  MonthlyReportQuery,
  PaginatedOfficialDocuments,
  ReportQueryFilters,
} from './report.types';

export class ReportRepository {
  public async getMonthlySources(filters: MonthlyReportQuery) {
    const start = new Date(Date.UTC(filters.year, 0, 1));
    const end = new Date(Date.UTC(filters.year + 1, 0, 1));
    const branchMatch = filters.branchId
      ? filters.branchId
      : filters.authorizedBranchIds
        ? { $in: filters.authorizedBranchIds }
        : undefined;
    const schoolBranchBase: Record<string, unknown> = {
      schoolId: filters.schoolId,
      isDeleted: false,
    };
    if (branchMatch) schoolBranchBase.branchId = branchMatch;
    const base: Record<string, unknown> = { ...schoolBranchBase };
    if (filters.academicYearId) base.academicYearId = filters.academicYearId;

    const enrollmentQuery: Record<string, unknown> = {
      ...base,
      enrollmentDate: { $lt: end },
      status: { $nin: ['cancelled'] },
      $or: [{ endDate: { $exists: false } }, { endDate: null }, { endDate: { $gte: start } }],
    };
    if (filters.classId) enrollmentQuery.classId = filters.classId;
    const enrollments = await EnrollmentModel.find(enrollmentQuery)
      .select(
        'studentId branchId academicYearId programId levelId classId enrollmentDate endDate status',
      )
      .sort({ enrollmentDate: 1 })
      .lean()
      .exec();
    const allStudentIds = [...new Set(enrollments.map((item) => String(item.studentId)))];
    let studentIds = allStudentIds;
    if (filters.search && filters.search.trim()) {
      const searchRegex = new RegExp(
        filters.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        'i',
      );
      const matchingStudents = await StudentModel.find({
        _id: { $in: allStudentIds },
        isDeleted: false,
        $or: [
          { studentId: searchRegex },
          { firstName: searchRegex },
          { lastName: searchRegex },
          { khmerName: searchRegex },
        ],
      })
        .select('_id')
        .lean()
        .exec();
      const matchingIdSet = new Set(matchingStudents.map((s) => String(s._id)));
      studentIds = allStudentIds.filter((id) => matchingIdSet.has(id));
    }
    const page = Math.max(1, filters.page ?? 1);
    const limit = Math.min(200, Math.max(1, filters.limit ?? 100));
    const visibleStudentIds = studentIds.slice((page - 1) * limit, page * limit);

    const sessionQuery: Record<string, unknown> = {
      ...base,
      date: { $gte: start, $lt: end },
    };
    if (filters.classId) sessionQuery.classId = filters.classId;
    const assessmentQuery: Record<string, unknown> = {
      ...base,
      assessmentDate: { $gte: start, $lt: end },
      type: 'monthly_test',
      status: { $in: ['published', 'closed'] },
    };
    if (filters.classId) assessmentQuery.classId = filters.classId;
    const transferScopes: Array<Record<string, unknown>> = [];
    if (filters.branchId) {
      transferScopes.push({
        $or: [{ fromBranchId: filters.branchId }, { toBranchId: filters.branchId }],
      });
    } else if (filters.authorizedBranchIds) {
      transferScopes.push({
        $or: [
          { fromBranchId: { $in: filters.authorizedBranchIds } },
          { toBranchId: { $in: filters.authorizedBranchIds } },
        ],
      });
    }
    if (filters.classId) {
      transferScopes.push({
        $or: [{ fromClassId: filters.classId }, { toClassId: filters.classId }],
      });
    }

    const [
      students,
      sessions,
      assessments,
      payments,
      tuitionFees,
      admissions,
      newEnrollments,
      transfers,
      dropouts,
    ] = await Promise.all([
      StudentModel.find({ _id: { $in: visibleStudentIds }, isDeleted: false })
        .sort({ firstName: 1, lastName: 1 })
        .lean()
        .exec(),
      AttendanceModel.find(sessionQuery).select('_id date').lean().exec(),
      AssessmentModel.find(assessmentQuery).select('_id assessmentDate').lean().exec(),
      PaymentModel.find({
        ...base,
        ...(filters.classId ? { studentId: { $in: studentIds } } : {}),
        $or: [{ paymentDate: { $gte: start, $lt: end } }, { dueDate: { $gte: start, $lt: end } }],
        status: { $ne: 'voided' },
      })
        .select(
          'studentId enrollmentId tuitionFeeId paymentDate dueDate amountPaid discountAmount receiptNumber currency status',
        )
        .lean()
        .exec(),
      TuitionFeeModel.find({
        ...base,
        billingCycle: 'monthly',
        status: 'active',
      })
        .lean()
        .exec(),
      StudentModel.find({
        ...schoolBranchBase,
        admissionDate: { $gte: start, $lt: end },
      })
        .select('admissionDate')
        .lean()
        .exec(),
      EnrollmentModel.find({
        ...base,
        enrollmentDate: { $gte: start, $lt: end },
        status: { $ne: 'cancelled' },
        ...(filters.classId ? { classId: filters.classId } : {}),
      })
        .select('enrollmentDate')
        .lean()
        .exec(),
      StudentTransferModel.find({
        schoolId: filters.schoolId,
        isDeleted: false,
        status: { $in: ['approved', 'completed'] },
        transferDate: { $gte: start, $lt: end },
        ...(transferScopes.length ? { $and: transferScopes } : {}),
      })
        .select('transferDate')
        .lean()
        .exec(),
      EnrollmentModel.find({
        ...base,
        status: { $in: ['dropped', 'withdrawn'] },
        endDate: { $gte: start, $lt: end },
        ...(filters.classId ? { classId: filters.classId } : {}),
      })
        .select('endDate')
        .lean()
        .exec(),
    ]);

    const [attendanceRecords, scores] = await Promise.all([
      AttendanceRecordModel.find({
        attendanceSessionId: { $in: sessions.map((item) => item._id) },
        isDeleted: false,
      })
        .select('attendanceSessionId studentId status')
        .lean()
        .exec(),
      ScoreModel.find({
        assessmentId: { $in: assessments.map((item) => item._id) },
        isDeleted: false,
      })
        .select('assessmentId studentId percentage isAbsent')
        .lean()
        .exec(),
    ]);

    return {
      start,
      end,
      studentIds,
      page,
      limit,
      enrollments,
      students,
      sessions,
      attendanceRecords,
      assessments,
      scores,
      payments,
      tuitionFees,
      admissions,
      newEnrollments,
      transfers,
      dropouts,
    };
  }

  public async getBranchBenchmarks(filters: MonthlyReportQuery) {
    const start = new Date(Date.UTC(filters.year, 0, 1));
    const end = new Date(Date.UTC(filters.year + 1, 0, 1));
    const branchQuery: Record<string, unknown> = {
      schoolId: filters.schoolId,
      status: 'active',
      isDeleted: false,
    };
    if (filters.branchId) branchQuery._id = filters.branchId;
    else if (filters.authorizedBranchIds) branchQuery._id = { $in: filters.authorizedBranchIds };
    const branches = await BranchModel.find(branchQuery)
      .select('branchCode branchNameEn')
      .sort({ branchCode: 1 })
      .lean();
    return Promise.all(
      branches.map(async (branch) => {
        const branchId = branch._id;
        const resultQuery: Record<string, unknown> = {
          schoolId: filters.schoolId,
          branchId,
          workflowStatus: { $in: ['APPROVED', 'FINALIZED'] },
          isDeleted: false,
        };
        if (filters.academicYearId) resultQuery.academicYearId = filters.academicYearId;
        const [enrollments, assessments, sessions, results] = await Promise.all([
          EnrollmentModel.find({
            schoolId: filters.schoolId,
            branchId,
            enrollmentDate: { $lt: end },
            status: { $nin: ['cancelled'] },
            isDeleted: false,
          })
            .select('studentId')
            .lean(),
          AssessmentModel.find({
            schoolId: filters.schoolId,
            branchId,
            assessmentDate: { $gte: start, $lt: end },
            status: { $in: ['published', 'closed'] },
            isDeleted: false,
          })
            .select('_id')
            .lean(),
          AttendanceModel.find({
            schoolId: filters.schoolId,
            branchId,
            date: { $gte: start, $lt: end },
            isDeleted: false,
          })
            .select('_id')
            .lean(),
          TermResultModel.find(resultQuery).select('resultStatus').lean(),
        ]);
        const [scores, attendanceRecords] = await Promise.all([
          ScoreModel.find({
            assessmentId: { $in: assessments.map((item) => item._id) },
            isDeleted: false,
          })
            .select('percentage isAbsent')
            .lean(),
          AttendanceRecordModel.find({
            attendanceSessionId: { $in: sessions.map((item) => item._id) },
            isDeleted: false,
          })
            .select('status')
            .lean(),
        ]);
        const validScores = scores.filter((score) => !score.isAbsent);
        const attended = attendanceRecords.filter((record) =>
          ['present', 'late', 'permission', 'excused', 'sick'].includes(record.status),
        ).length;
        return {
          branchId: String(branchId),
          branchCode: branch.branchCode,
          branchName: branch.branchNameEn,
          students: new Set(enrollments.map((item) => String(item.studentId))).size,
          passRate:
            results.length > 0
              ? Math.round(
                  (results.filter((result) => result.resultStatus === 'PASSED').length /
                    results.length) *
                    10000,
                ) / 100
              : 0,
          averageScore:
            validScores.length > 0
              ? Math.round(
                  (validScores.reduce((sum, score) => sum + score.percentage, 0) /
                    validScores.length) *
                    100,
                ) / 100
              : 0,
          attendanceRate:
            attendanceRecords.length > 0
              ? Math.round((attended / attendanceRecords.length) * 10000) / 100
              : 0,
        };
      }),
    );
  }

  public async findDocuments(filters: ReportQueryFilters): Promise<PaginatedOfficialDocuments> {
    const query: Record<string, unknown> = { isDeleted: false };
    if (filters.schoolId) query.schoolId = filters.schoolId;
    if (filters.type && filters.allowedTypes) {
      query.type = filters.allowedTypes.includes(filters.type) ? filters.type : '__disallowed__';
    } else if (filters.type) {
      query.type = filters.type;
    } else if (filters.allowedTypes) {
      query.type = { $in: filters.allowedTypes };
    }
    if (filters.branchId) query.branchId = filters.branchId;
    else if (filters.authorizedBranchIds) query.branchId = { $in: filters.authorizedBranchIds };
    if (filters.studentId) query.studentId = filters.studentId;
    if (filters.status) query.status = filters.status;
    if (filters.startDate || filters.endDate) {
      query.generatedAt = {};
      if (filters.startDate) {
        (query.generatedAt as Record<string, unknown>).$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        (query.generatedAt as Record<string, unknown>).$lte = new Date(filters.endDate);
      }
    }

    const page = Math.max(1, Number(filters.page ?? 1));
    const limit = Math.min(100, Math.max(1, Number(filters.limit ?? 20)));
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      OfficialDocumentModel.find(query)
        .populate('studentId', 'studentId firstName lastName khmerName')
        .populate('branchId', 'branchCode branchNameEn branchNameKh')
        .sort({ generatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      OfficialDocumentModel.countDocuments(query).exec(),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) || 1 };
  }

  public async findById(id: string): Promise<IOfficialDocument | null> {
    return OfficialDocumentModel.findOne({ _id: id, isDeleted: false }).exec();
  }

  public async findActiveByDocumentNumber(
    documentNumber: string,
  ): Promise<IOfficialDocument | null> {
    return OfficialDocumentModel.findOne({
      documentNumber: documentNumber.toUpperCase(),
      type: 'certificate',
      status: 'active',
      isDeleted: false,
    })
      .select('documentNumber type payload generatedAt status')
      .lean<IOfficialDocument>()
      .exec();
  }

  public async findLatestBySource(
    type: OfficialDocumentType,
    sourceId: string,
  ): Promise<IOfficialDocument | null> {
    return OfficialDocumentModel.findOne({ type, sourceId, isDeleted: false })
      .sort({ generatedAt: -1 })
      .exec();
  }

  public async findByContent(
    type: OfficialDocumentType,
    sourceId: string,
    contentHash: string,
  ): Promise<IOfficialDocument | null> {
    return OfficialDocumentModel.findOne({ type, sourceId, contentHash, isDeleted: false }).exec();
  }

  public async create(data: Partial<IOfficialDocument>): Promise<IOfficialDocument> {
    return OfficialDocumentModel.create(data);
  }
}
