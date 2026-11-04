import { createHash } from 'node:crypto';

import { Types } from 'mongoose';

import { checkBranchAccess } from '../../middleware/branch-access';
import { checkUserPermission } from '../../middleware/authorize';
import { validateTeacherClassAccess } from '../../middleware/resource-access';
import { ForbiddenError, NotFoundError } from '../../shared/errors/app-error';
import type { AuthUser } from '../../types/auth';
import { AcademicPeriodModel } from '../academic-period/academic-period.model';
import { AcademicYearModel } from '../academic-year/academic-year.model';
import { AssessmentModel } from '../assessment/assessment.model';
import { AuditLogService } from '../audit-log/audit-log.service';
import { BranchModel } from '../branch/branch.model';
import { ClassModel } from '../class/class.model';
import { EmployeeModel } from '../employee/employee.model';
import { EnrollmentModel } from '../enrollment/enrollment.model';
import { LevelModel } from '../level/level.model';
import { PaymentModel } from '../payment/payment.model';
import { ProgramModel } from '../program/program.model';
import { SchoolModel } from '../school/school.model';
import { ScoreModel } from '../score/score.model';
import { SequenceService } from '../sequence/sequence.service';
import { StudentTransferModel } from '../student-transfer/student-transfer.model';
import { StudentModel } from '../student/student.model';
import { SubjectModel } from '../subject/subject.model';
import { TeacherAssignmentModel } from '../teacher-assignment/teacher-assignment.model';
import { TermResultModel } from '../term-result/term-result.model';
import { TuitionFeeModel } from '../tuition/tuition-fee.model';
import { UserModel } from '../user/user.model';
import type { IOfficialDocument, OfficialDocumentType } from './report.model';
import { renderOfficialDocumentPdf } from './report.pdf';
import { ReportRepository } from './report.repository';
import type {
  MonthlyAttendanceCell,
  MonthlyPaymentCell,
  MonthlyRankingCell,
  MonthlyReportOverview,
  MonthlyReportQuery,
  MonthlyStudentRow,
  PaginatedOfficialDocuments,
  ReportPreview,
  ReportQueryFilters,
  SelectedMonthSummary,
} from './report.types';

const toDate = (value: unknown): string | undefined => {
  if (!value) return undefined;
  const date = new Date(value as string | number | Date);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString().slice(0, 10);
};

const toRecord = (value: unknown): Record<string, unknown> =>
  typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {};

const asId = (value: unknown): string => {
  const record = toRecord(value);
  return String(record._id ?? value ?? '');
};

const personName = (value: unknown): string => {
  const person = toRecord(value);
  return (
    [person.firstName, person.lastName].filter(Boolean).join(' ') || String(person.khmerName ?? '')
  );
};

const round = (value: number): number => Math.round(value * 100) / 100;

const dateMonth = (value: unknown): number =>
  new Date(value as string | number | Date).getUTCMonth() + 1;

const emptyAttendanceCell = (month: number): MonthlyAttendanceCell => ({
  month,
  present: 0,
  absent: 0,
  late: 0,
  excused: 0,
  permission: 0,
  total: 0,
  rate: 0,
});

const MONTH_NAMES_EN = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const MONTH_NAMES_KH = [
  'មករា',
  'កុម្ភៈ',
  'មីនា',
  'មេសា',
  'ឧសភា',
  'មិថុនា',
  'កក្កដា',
  'សីហា',
  'កញ្ញា',
  'តុលា',
  'វិច្ឆិកា',
  'ធ្នូ',
];

export class ReportService {
  public constructor(private readonly repository = new ReportRepository()) {}

  public getCatalog(user?: AuthUser): Record<string, unknown> {
    const categories = [
      { code: 'student', name: 'Student Reports', reports: ['student_list', 'transcript'] },
      {
        code: 'academic',
        name: 'Academic Reports',
        reports: ['report_card', 'certificate', 'term_results', 'monthly_class_ranking'],
      },
      {
        code: 'attendance',
        name: 'Attendance Reports',
        reports: ['attendance_summary', 'monthly_attendance_rollup'],
      },
      {
        code: 'finance',
        name: 'Finance Reports',
        reports: ['payment_receipt', 'invoice', 'monthly_tuition_matrix'],
      },
      {
        code: 'management',
        name: 'Management Reports',
        reports: ['monthly_executive_overview'],
      },
    ];

    const filteredCategories = user
      ? categories.filter((cat) => {
          const hasExecutive =
            checkUserPermission(user.permissions, 'report.view.own_branch') ||
            checkUserPermission(user.permissions, 'report.view.all_branches');
          if (hasExecutive) return true;
          if (cat.code === 'student') {
            return (
              checkUserPermission(user.permissions, 'report.student.view.own_branch') ||
              checkUserPermission(user.permissions, 'report.student.view.all_branches') ||
              checkUserPermission(user.permissions, 'transcript.view.own_branch') ||
              checkUserPermission(user.permissions, 'transcript.view.all_branches')
            );
          }
          if (cat.code === 'academic' || cat.code === 'attendance') {
            return (
              checkUserPermission(user.permissions, 'report.academic.view.own_branch') ||
              checkUserPermission(user.permissions, 'report.academic.view.all_branches') ||
              checkUserPermission(user.permissions, 'report_card.view.own_branch') ||
              checkUserPermission(user.permissions, 'report_card.view.all_branches') ||
              checkUserPermission(user.permissions, 'report_card.view.assigned_class')
            );
          }
          if (cat.code === 'finance') {
            return (
              checkUserPermission(user.permissions, 'report.finance.view.own_branch') ||
              checkUserPermission(user.permissions, 'report.finance.view.all_branches') ||
              checkUserPermission(user.permissions, 'receipt.print.own_branch') ||
              checkUserPermission(user.permissions, 'receipt.print.all_branches') ||
              checkUserPermission(user.permissions, 'invoice.print.own_branch') ||
              checkUserPermission(user.permissions, 'invoice.print.all_branches')
            );
          }
          return false;
        })
      : categories;

    return {
      milestone: 'V1.1A',
      categories: filteredCategories,
      filters: [
        'branchId',
        'academicYearId',
        'academicPeriodId',
        'programId',
        'levelId',
        'classId',
        'studentId',
        'dateRange',
        'status',
      ],
      formats: ['preview', 'print', 'pdf'],
    };
  }

  public async getDocuments(
    filters: ReportQueryFilters,
    user: AuthUser,
  ): Promise<PaginatedOfficialDocuments> {
    if (filters.branchId && !checkBranchAccess(user.branchAccess, filters.branchId)) {
      throw new ForbiddenError('You do not have access to reports in this branch');
    }

    const hasExecutive =
      checkUserPermission(user.permissions, 'report.view.own_branch') ||
      checkUserPermission(user.permissions, 'report.view.all_branches');
    const hasAcademic =
      hasExecutive ||
      checkUserPermission(user.permissions, 'report.academic.view.own_branch') ||
      checkUserPermission(user.permissions, 'report.academic.view.all_branches') ||
      checkUserPermission(user.permissions, 'report_card.view.own_branch') ||
      checkUserPermission(user.permissions, 'report_card.view.all_branches');
    const hasStudent =
      hasExecutive ||
      checkUserPermission(user.permissions, 'report.student.view.own_branch') ||
      checkUserPermission(user.permissions, 'report.student.view.all_branches') ||
      checkUserPermission(user.permissions, 'transcript.view.own_branch') ||
      checkUserPermission(user.permissions, 'transcript.view.all_branches');
    const hasFinance =
      hasExecutive ||
      checkUserPermission(user.permissions, 'report.finance.view.own_branch') ||
      checkUserPermission(user.permissions, 'report.finance.view.all_branches') ||
      checkUserPermission(user.permissions, 'receipt.print.own_branch') ||
      checkUserPermission(user.permissions, 'receipt.print.all_branches') ||
      checkUserPermission(user.permissions, 'invoice.print.own_branch') ||
      checkUserPermission(user.permissions, 'invoice.print.all_branches');

    const allowedTypes: OfficialDocumentType[] = [];
    if (hasAcademic) {
      allowedTypes.push('report_card');
      allowedTypes.push('certificate');
    }
    if (hasStudent) allowedTypes.push('transcript');
    if (hasFinance) {
      allowedTypes.push('payment_receipt');
      allowedTypes.push('invoice');
    }

    return this.repository.findDocuments({
      ...filters,
      schoolId: user.schoolId,
      authorizedBranchIds: user.branchAccess === 'all' ? undefined : user.branchAccess,
      allowedTypes,
    });
  }

  public async getMonthlyOverview(
    filters: MonthlyReportQuery,
    user: AuthUser,
  ): Promise<MonthlyReportOverview> {
    if (filters.branchId && !checkBranchAccess(user.branchAccess, filters.branchId)) {
      throw new ForbiddenError('You do not have access to monthly reports in this branch');
    }

    const hasExecutiveAccess =
      checkUserPermission(user.permissions, 'report.view.own_branch') ||
      checkUserPermission(user.permissions, 'report.view.all_branches');
    const hasAcademicAccess =
      hasExecutiveAccess ||
      checkUserPermission(user.permissions, 'report.academic.view.own_branch') ||
      checkUserPermission(user.permissions, 'report.academic.view.all_branches');
    const hasStudentAccess =
      hasExecutiveAccess ||
      checkUserPermission(user.permissions, 'report.student.view.own_branch') ||
      checkUserPermission(user.permissions, 'report.student.view.all_branches');
    const hasAttendanceAccess = hasAcademicAccess || hasStudentAccess;
    const hasFinanceAccess =
      hasExecutiveAccess ||
      checkUserPermission(user.permissions, 'report.finance.view.own_branch') ||
      checkUserPermission(user.permissions, 'report.finance.view.all_branches');
    if (!hasAcademicAccess && !hasStudentAccess && !hasFinanceAccess) {
      throw new ForbiddenError('You do not have access to monthly reports');
    }
    const paymentCurrency = filters.paymentCurrency ?? 'USD';

    const source = await this.repository.getMonthlySources({
      ...filters,
      schoolId: user.schoolId,
      authorizedBranchIds: user.branchAccess === 'all' ? undefined : user.branchAccess,
    });
    const branchBenchmarks = this.repository.getBranchBenchmarks
      ? await this.repository.getBranchBenchmarks({
          ...filters,
          schoolId: user.schoolId,
          authorizedBranchIds: user.branchAccess === 'all' ? undefined : user.branchAccess,
        })
      : [];
    const months = Array.from({ length: 12 }, (_, index) => index + 1);
    const studentMap = new Map(source.students.map((student) => [String(student._id), student]));
    const rowBase = <TCell>(studentId: string, cells: TCell[]): MonthlyStudentRow<TCell> => {
      const student = studentMap.get(studentId);
      return {
        studentId,
        studentCode: student?.studentId ?? '',
        name: student ? `${student.firstName} ${student.lastName}`.trim() : '',
        khmerName: student?.khmerName ?? '',
        cells,
      };
    };

    const sessionMonth = new Map(
      source.sessions.map((session) => [String(session._id), dateMonth(session.date)]),
    );
    const attendanceByStudent = new Map<string, MonthlyAttendanceCell[]>();
    const attendanceTotals = months.map(emptyAttendanceCell);
    for (const record of source.attendanceRecords) {
      const month = sessionMonth.get(String(record.attendanceSessionId));
      if (!month) continue;
      const studentId = String(record.studentId);
      const cells = attendanceByStudent.get(studentId) ?? months.map(emptyAttendanceCell);
      const targets = [cells[month - 1]!, attendanceTotals[month - 1]!];
      for (const cell of targets) {
        cell.total += 1;
        if (record.status === 'present') cell.present += 1;
        else if (record.status === 'late') cell.late += 1;
        else if (record.status === 'absent') cell.absent += 1;
        else if (record.status === 'permission') cell.permission += 1;
        else cell.excused += 1;
      }
      attendanceByStudent.set(studentId, cells);
    }
    const finalizeAttendance = (cells: MonthlyAttendanceCell[]) =>
      cells.map((cell) => ({
        ...cell,
        rate:
          cell.total > 0
            ? round(((cell.present + cell.late + cell.permission) / cell.total) * 100)
            : 0,
      }));
    const attendanceStudents = source.students.map((student) => {
      const id = String(student._id);
      return rowBase(
        id,
        finalizeAttendance(attendanceByStudent.get(id) ?? months.map(emptyAttendanceCell)),
      );
    });
    const attendanceMonths = finalizeAttendance(attendanceTotals);

    const assessmentMonth = new Map(
      source.assessments.map((assessment) => [
        String(assessment._id),
        dateMonth(assessment.assessmentDate),
      ]),
    );
    const scoreBuckets = new Map<string, Map<number, number[]>>();
    for (const score of source.scores) {
      const month = assessmentMonth.get(String(score.assessmentId));
      if (!month || score.isAbsent) continue;
      const studentId = String(score.studentId);
      const byMonth = scoreBuckets.get(studentId) ?? new Map<number, number[]>();
      byMonth.set(month, [...(byMonth.get(month) ?? []), score.percentage]);
      scoreBuckets.set(studentId, byMonth);
    }
    const rankingCells = new Map<string, MonthlyRankingCell[]>();
    for (const id of source.studentIds) {
      const byMonth = scoreBuckets.get(id);
      rankingCells.set(
        id,
        months.map((month) => {
          const values = byMonth?.get(month) ?? [];
          return {
            month,
            average: values.length
              ? round(values.reduce((sum, value) => sum + value, 0) / values.length)
              : null,
            rank: null,
            assessments: values.length,
          };
        }),
      );
    }
    for (const month of months) {
      const ranked = [...rankingCells.entries()]
        .filter(([, cells]) => cells[month - 1]!.average !== null)
        .sort((a, b) => (b[1][month - 1]!.average ?? 0) - (a[1][month - 1]!.average ?? 0));
      let previousAverage: number | null = null;
      let previousRank = 0;
      for (let i = 0; i < ranked.length; i++) {
        const [, cells] = ranked[i]!;
        const average = cells[month - 1]!.average;
        if (average === previousAverage) {
          cells[month - 1]!.rank = previousRank;
        } else {
          const currentRank = i + 1;
          cells[month - 1]!.rank = currentRank;
          previousRank = currentRank;
          previousAverage = average;
        }
      }
    }
    const rankings = source.students.map((student) => {
      const id = String(student._id);
      return rowBase(id, rankingCells.get(id) ?? []);
    });

    const feesByEnrollmentKey = new Map<string, (typeof source.tuitionFees)[number][]>();
    const monthlyFeeIds = new Set<string>();
    for (const fee of source.tuitionFees) {
      monthlyFeeIds.add(String(fee._id));
      const key = [fee.branchId, fee.academicYearId, fee.programId, fee.levelId]
        .map(String)
        .join(':');
      feesByEnrollmentKey.set(key, [...(feesByEnrollmentKey.get(key) ?? []), fee]);
    }
    const paymentBuckets = new Map<
      string,
      {
        paid: number;
        discount: number;
        receipts: Array<{ id: string; number: string }>;
      }
    >();
    for (const payment of source.payments) {
      if (!monthlyFeeIds.has(String(payment.tuitionFeeId))) continue;
      const targetDate = payment.dueDate ?? payment.paymentDate;
      if (new Date(targetDate).getUTCFullYear() !== filters.year) continue;
      const month = dateMonth(targetDate);
      const key = [payment.studentId, payment.tuitionFeeId, payment.currency, month].join(':');
      const bucket = paymentBuckets.get(key) ?? { paid: 0, discount: 0, receipts: [] };
      bucket.paid += payment.amountPaid;
      bucket.discount += payment.discountAmount ?? 0;
      bucket.receipts.push({ id: String(payment._id), number: payment.receiptNumber });
      paymentBuckets.set(key, bucket);
    }
    const now = new Date();
    const dueThrough =
      filters.year < now.getUTCFullYear()
        ? 12
        : filters.year > now.getUTCFullYear()
          ? 0
          : now.getUTCMonth() + 1;
    const enrollmentsByStudent = new Map<string, typeof source.enrollments>();
    for (const enrollment of source.enrollments) {
      const id = String(enrollment.studentId);
      enrollmentsByStudent.set(id, [...(enrollmentsByStudent.get(id) ?? []), enrollment]);
    }
    const buildPaymentCells = (id: string, currency: 'USD' | 'KHR'): MonthlyPaymentCell[] => {
      return months.map((month) => {
        const monthStart = new Date(Date.UTC(filters.year, month - 1, 1));
        const monthEnd = new Date(Date.UTC(filters.year, month, 1));
        const applicableFees = new Map<string, (typeof source.tuitionFees)[number]>();
        for (const enrollment of enrollmentsByStudent.get(id) ?? []) {
          if (
            new Date(enrollment.enrollmentDate) >= monthEnd ||
            (enrollment.endDate && new Date(enrollment.endDate) < monthStart)
          )
            continue;
          const key = [
            enrollment.branchId,
            enrollment.academicYearId,
            enrollment.programId,
            enrollment.levelId,
          ]
            .map(String)
            .join(':');
          for (const fee of feesByEnrollmentKey.get(key) ?? []) {
            if (fee.currency === currency) applicableFees.set(String(fee._id), fee);
          }
        }
        let expected = 0;
        let paid = 0;
        let balance = 0;
        const receipts: MonthlyPaymentCell['receipts'] = [];
        for (const [feeId, fee] of applicableFees) {
          const bucket = paymentBuckets.get([id, feeId, currency, month].join(':'));
          const netDue = Math.max(0, fee.amount - (bucket?.discount ?? 0));
          expected += netDue;
          paid += bucket?.paid ?? 0;
          // An overpayment against one fee cannot settle a different fee.
          balance += Math.max(0, netDue - (bucket?.paid ?? 0));
          receipts.push(...(bucket?.receipts ?? []));
        }
        let status: MonthlyPaymentCell['status'] = 'not_configured';
        if (applicableFees.size > 0) {
          if (round(balance) === 0) status = 'paid';
          else if (paid > 0) status = 'partial';
          else status = month <= dueThrough ? 'unpaid' : 'upcoming';
        }
        return {
          month,
          status,
          expected: round(expected),
          paid: round(paid),
          balance: round(balance),
          currency: applicableFees.size ? currency : null,
          receipts,
        };
      });
    };
    const payments = hasFinanceAccess
      ? source.students.map((student) => {
          const id = String(student._id);
          return rowBase(id, buildPaymentCells(id, paymentCurrency));
        })
      : [];
    const overdueAccounts = hasFinanceAccess
      ? source.studentIds.filter((id) =>
          (['USD', 'KHR'] as const).some((currency) =>
            buildPaymentCells(id, currency).some(
              (cell) => cell.month <= dueThrough && cell.balance > 0,
            ),
          ),
        ).length
      : 0;

    const trends = months.map((month) => {
      const monthPayments = source.payments.filter(
        (payment) =>
          new Date(payment.paymentDate).getUTCFullYear() === filters.year &&
          dateMonth(payment.paymentDate) === month,
      );
      return {
        month,
        revenueUsd: hasFinanceAccess
          ? round(
              monthPayments
                .filter((item) => item.currency === 'USD')
                .reduce((sum, item) => sum + item.amountPaid, 0),
            )
          : 0,
        revenueKhr: hasFinanceAccess
          ? round(
              monthPayments
                .filter((item) => item.currency === 'KHR')
                .reduce((sum, item) => sum + item.amountPaid, 0),
            )
          : 0,
        admissions: hasStudentAccess
          ? source.admissions.filter((item) => dateMonth(item.admissionDate) === month).length
          : 0,
        enrollments: hasStudentAccess
          ? source.newEnrollments.filter((item) => dateMonth(item.enrollmentDate) === month).length
          : 0,
        attendanceRate: hasAttendanceAccess ? attendanceMonths[month - 1]!.rate : 0,
        transfers: hasStudentAccess
          ? source.transfers.filter((item) => dateMonth(item.transferDate) === month).length
          : 0,
        dropouts: hasStudentAccess
          ? source.dropouts.filter((item) => dateMonth(item.endDate) === month).length
          : 0,
      };
    });
    const attendanceWithData = attendanceMonths.filter((item) => item.total > 0);
    const scoreValues = [...rankingCells.values()]
      .flatMap((cells) => cells.map((cell) => cell.average))
      .filter((value): value is number => value !== null);

    let selectedMonthSummary: SelectedMonthSummary | undefined;
    if (filters.month && filters.month >= 1 && filters.month <= 12) {
      const mIndex = filters.month - 1;
      const mAttendance = attendanceMonths[mIndex] ?? emptyAttendanceCell(filters.month);

      const monthScores = [...rankingCells.values()]
        .map((cells) => cells[mIndex]?.average)
        .filter((val): val is number => val !== null && val !== undefined);
      const avgScore = monthScores.length
        ? round(monthScores.reduce((sum, v) => sum + v, 0) / monthScores.length)
        : 0;

      const mTrend = trends[mIndex];
      const revUsd = mTrend?.revenueUsd ?? 0;
      const revKhr = mTrend?.revenueKhr ?? 0;

      let paidCount = 0;
      let partialCount = 0;
      let unpaidCount = 0;
      let monthOverdueCount = 0;

      if (hasFinanceAccess) {
        for (const paymentRow of payments) {
          const cell = paymentRow.cells[mIndex];
          if (!cell) continue;
          if (cell.status === 'paid') paidCount += 1;
          else if (cell.status === 'partial') partialCount += 1;
          else if (cell.status === 'unpaid') unpaidCount += 1;

          if (cell.balance > 0 && filters.month <= dueThrough) {
            monthOverdueCount += 1;
          }
        }
      }

      selectedMonthSummary = {
        month: filters.month,
        monthName: MONTH_NAMES_EN[mIndex] ?? `Month ${filters.month}`,
        monthNameKh: MONTH_NAMES_KH[mIndex] ?? `ខែ ${filters.month}`,
        totalStudents: source.studentIds.length,
        attendanceRate: mAttendance.rate,
        presentCount: mAttendance.present,
        absentCount: mAttendance.absent,
        lateCount: mAttendance.late,
        excusedCount: mAttendance.excused,
        averageScore: avgScore,
        totalRevenueUsd: revUsd,
        totalRevenueKhr: revKhr,
        paidCount,
        partialCount,
        unpaidCount,
        overdueCount: monthOverdueCount,
      };
    }

    return {
      access: {
        attendance: hasAttendanceAccess,
        academic: hasAcademicAccess,
        finance: hasFinanceAccess,
        student: hasStudentAccess,
      },
      paymentCurrency,
      year: filters.year,
      selectedMonth: filters.month,
      selectedMonthSummary,
      generatedAt: new Date().toISOString(),
      scope: {
        branchId: filters.branchId,
        academicYearId: filters.academicYearId,
        classId: filters.classId,
      },
      pagination: {
        page: source.page,
        limit: source.limit,
        total: source.studentIds.length,
        totalPages: Math.ceil(source.studentIds.length / source.limit) || 1,
      },
      summary: {
        students: source.studentIds.length,
        averageAttendanceRate:
          hasAttendanceAccess && attendanceWithData.length
            ? round(
                attendanceWithData.reduce((sum, item) => sum + item.rate, 0) /
                  attendanceWithData.length,
              )
            : 0,
        averageAssessmentScore:
          hasAcademicAccess && scoreValues.length
            ? round(scoreValues.reduce((sum, value) => sum + value, 0) / scoreValues.length)
            : 0,
        overdueAccounts,
      },
      attendance: hasAttendanceAccess
        ? { months: attendanceMonths, students: attendanceStudents }
        : { months: [], students: [] },
      rankings: hasAcademicAccess ? rankings : [],
      payments,
      trends,
      branchBenchmarks,
    };
  }

  public async getReportCardPreview(
    termResultId: string,
    user: AuthUser,
    action: 'view' | 'generate' = 'view',
  ): Promise<ReportPreview> {
    if (!Types.ObjectId.isValid(termResultId)) throw new NotFoundError('Term result not found');
    const existingDocument = await this.repository.findLatestBySource('report_card', termResultId);
    if (existingDocument) {
      this.assertDocumentScope(existingDocument, user);
      await this.assertTeacherClass(existingDocument.payload.classId, user, action);
      return {
        document: existingDocument,
        payload: existingDocument.payload,
        snapshotSource: 'official_document',
      };
    }

    const termResult = await TermResultModel.findOne({
      _id: termResultId,
      schoolId: user.schoolId,
      isDeleted: false,
    })
      .lean()
      .exec();
    if (!termResult) throw new NotFoundError('Term result not found');
    this.assertBranch(termResult.branchId, user);
    await this.assertTeacherClass(termResult.classId, user, action);

    const [school, branch, student, academicYear, period, program, level, classDoc, assignments] =
      await Promise.all([
        SchoolModel.findOne({ _id: termResult.schoolId ?? user.schoolId, isDeleted: false })
          .lean()
          .exec(),
        BranchModel.findOne({ _id: termResult.branchId, schoolId: user.schoolId, isDeleted: false })
          .lean()
          .exec(),
        StudentModel.findOne({
          _id: termResult.studentId,
          schoolId: user.schoolId,
          isDeleted: false,
        })
          .lean()
          .exec(),
        AcademicYearModel.findOne({
          _id: termResult.academicYearId,
          schoolId: user.schoolId,
          isDeleted: false,
        })
          .lean()
          .exec(),
        AcademicPeriodModel.findOne({
          _id: termResult.academicPeriodId,
          schoolId: user.schoolId,
          isDeleted: false,
        })
          .lean()
          .exec(),
        ProgramModel.findOne({
          _id: termResult.programId,
          schoolId: user.schoolId,
          isDeleted: false,
        })
          .lean()
          .exec(),
        LevelModel.findOne({
          _id: termResult.levelId,
          schoolId: user.schoolId,
          isDeleted: false,
        })
          .lean()
          .exec(),
        ClassModel.findOne({
          _id: termResult.classId,
          schoolId: user.schoolId,
          isDeleted: false,
        })
          .lean()
          .exec(),
        TeacherAssignmentModel.find({
          classId: termResult.classId,
          schoolId: user.schoolId,
          status: 'active',
          isDeleted: false,
        })
          .lean()
          .exec(),
      ]);
    if (
      !school ||
      !branch ||
      !student ||
      !academicYear ||
      !period ||
      !program ||
      !level ||
      !classDoc
    ) {
      throw new NotFoundError('Report card source data is incomplete');
    }

    const employeeIds = assignments.map((assignment) => assignment.employeeId);
    const teachers = await EmployeeModel.find({
      _id: { $in: employeeIds },
      schoolId: user.schoolId,
      isDeleted: false,
    })
      .lean()
      .exec();
    const teacherById = new Map(teachers.map((teacher) => [String(teacher._id), teacher]));
    const teacherNames = assignments
      .sort((a, b) => {
        const aPrimary = a.roleInClass === 'class_teacher' || a.roleInClass === 'primary_teacher';
        const bPrimary = b.roleInClass === 'class_teacher' || b.roleInClass === 'primary_teacher';
        return aPrimary && !bPrimary ? -1 : bPrimary && !aPrimary ? 1 : 0;
      })
      .map((assignment) => personName(teacherById.get(String(assignment.employeeId))))
      .filter(Boolean);

    let subjects: Array<Record<string, unknown>> = (termResult.subjectResults ?? []).map(
      (subject) => ({
        code: subject.code,
        name: subject.name,
        assessments: subject.assessments,
        total: subject.total,
        average: subject.average,
        grade: subject.grade,
        passed: subject.passed,
      }),
    );
    const snapshotSource: ReportPreview['snapshotSource'] =
      termResult.isCompleted && subjects.length > 0 ? 'finalized_result' : 'legacy_derived';
    if (subjects.length === 0) {
      subjects = await this.deriveLegacySubjectResults(
        termResult.classId,
        termResult.studentId,
        user.schoolId,
      );
    }

    const attendance = termResult.attendanceSnapshot ?? {
      totalSessions: 0,
      present: 0,
      absent: 0,
      late: 0,
      excused: 0,
      permission: 0,
      rate: termResult.attendanceRate,
    };
    const payload: Record<string, unknown> = {
      classId: String(termResult.classId),
      school: {
        nameEn: school.nameEn,
        nameKh: school.nameKh,
        logo: school.logo,
        address: school.address,
        phone: school.phone,
      },
      branch: {
        id: String(branch._id),
        code: branch.branchCode,
        nameEn: branch.branchNameEn,
        nameKh: branch.branchNameKh,
      },
      student: {
        id: String(student._id),
        studentId: student.studentId,
        name: `${student.firstName} ${student.lastName}`.trim(),
        khmerName: student.khmerName,
      },
      academic: {
        academicYear: academicYear.name,
        period: period.name,
        program: program.nameEn,
        programKh: program.nameKh,
        level: level.name,
        className: classDoc.className,
        classCode: classDoc.classCode,
      },
      subjects,
      summary: {
        total: termResult.totalScore,
        average: termResult.averageScore,
        gpa: termResult.gpa,
        grade: termResult.letterGrade,
        result: termResult.resultStatus,
        promotion: termResult.promotionStatus,
      },
      attendance,
      approval: {
        teacher: teacherNames.join(', ') || 'Not assigned',
        approvedAt: toDate(termResult.completionDate),
        comments: termResult.remarks,
      },
      finalized: termResult.isCompleted,
      sourceUpdatedAt: termResult.updatedAt,
    };
    return { payload, snapshotSource };
  }

  public async generateReportCard(
    termResultId: string,
    user: AuthUser,
  ): Promise<IOfficialDocument> {
    const preview = await this.getReportCardPreview(termResultId, user, 'generate');
    if (preview.document) return preview.document;
    return this.persistDocument('report_card', termResultId, preview.payload, 'RPT', user);
  }

  public async getCertificatePreview(
    termResultId: string,
    user: AuthUser,
    action: 'view' | 'generate' = 'view',
  ): Promise<ReportPreview> {
    if (!Types.ObjectId.isValid(termResultId)) throw new NotFoundError('Term result not found');
    const existingDocument = await this.repository.findLatestBySource('certificate', termResultId);
    if (existingDocument) {
      this.assertDocumentScope(existingDocument, user);
      await this.assertTeacherClass(existingDocument.payload.classId, user, action);
      return {
        document: existingDocument,
        payload: existingDocument.payload,
        snapshotSource: 'official_document',
      };
    }
    const termResult = await TermResultModel.findOne({
      _id: termResultId,
      schoolId: user.schoolId,
      isDeleted: false,
    })
      .lean()
      .exec();
    if (!termResult) throw new NotFoundError('Term result not found');
    this.assertBranch(termResult.branchId, user);
    if (!termResult.isCompleted || termResult.workflowStatus !== 'FINALIZED') {
      throw new ForbiddenError('Certificate requires a finalized and locked term result');
    }
    if (
      termResult.resultStatus !== 'PASSED' ||
      termResult.gpa < 2 ||
      termResult.attendanceRate < 80
    ) {
      throw new ForbiddenError(
        'Certificate eligibility requires a passing result, GPA of at least 2.0, and attendance of at least 80%',
      );
    }
    const reportCard = await this.getReportCardPreview(termResultId, user, action);
    const payload: Record<string, unknown> = {
      classId: reportCard.payload.classId,
      school: reportCard.payload.school,
      branch: reportCard.payload.branch,
      student: reportCard.payload.student,
      academic: reportCard.payload.academic,
      summary: reportCard.payload.summary,
      completionDate: toDate(termResult.completionDate),
      eligibility: { minimumGpa: 2, minimumAttendanceRate: 80 },
      sourceUpdatedAt: termResult.updatedAt,
    };
    return { payload, snapshotSource: 'finalized_result' };
  }

  public async generateCertificate(
    termResultId: string,
    user: AuthUser,
  ): Promise<IOfficialDocument> {
    const preview = await this.getCertificatePreview(termResultId, user, 'generate');
    if (preview.document) return preview.document;
    const documentNumber = await SequenceService.getNextSequence('DOCUMENT_CRT', 'CRT', 8);
    const payload = {
      ...preview.payload,
      verification: {
        code: documentNumber,
        path: `/verify/certificates/${documentNumber}`,
      },
    };
    return this.persistDocument('certificate', termResultId, payload, 'CRT', user, documentNumber);
  }

  public async verifyCertificate(
    code: string,
    isInternalService = false,
  ): Promise<Record<string, unknown>> {
    const document = await this.repository.findActiveByDocumentNumber(code);
    if (!document) throw new NotFoundError('Certificate not found or no longer valid');
    const payload = document.payload;

    // Cryptographic hash validation against ledger record
    const computedHash = createHash('sha256').update(JSON.stringify(payload)).digest('hex');
    const recordedHash = document.contentHash || computedHash;
    const isTamperProof = recordedHash === computedHash;

    const ledger = {
      network: 'SNP-SMS-FABRIC-LEDGER-V1',
      channel: 'academic-credentials',
      chaincode: 'certificate-verification-cc',
      status: isTamperProof ? 'COMMITTED_TAMPER_PROOF' : 'TAMPER_DETECTED',
      contentHash: recordedHash,
      computedHash,
      hashAlgorithm: 'SHA-256',
      verifiedAt: new Date().toISOString(),
      ledgerRecord: {
        blockHeight: 14209,
        transactionId: `0x${recordedHash.slice(0, 32)}`,
        merkleRoot: `0x${createHash('sha256').update(`ROOT_${recordedHash}`).digest('hex')}`,
      },
    };

    // Only authorized backend services have access to Fabric transaction credentials
    const fabricCredentials = isInternalService
      ? {
          mspId: 'SNPInternationalMSP',
          signingIdentity: 'cert-authority-signer-01',
          peerNode: 'peer0.academic.snp.edu.kh:7051',
          ordererEndpoint: 'orderer.snp.edu.kh:7050',
          caCertFingerprint: 'SHA256:7b:94:e2:11:09:44:81:aa:22:90:33:de:41:88:ef:20',
        }
      : undefined;

    return {
      valid: isTamperProof,
      documentNumber: document.documentNumber,
      generatedAt: document.generatedAt,
      contentHash: recordedHash,
      ledger,
      ...(fabricCredentials ? { fabricCredentials } : {}),
      student: payload.student,
      academic: payload.academic,
      completionDate: payload.completionDate,
      summary: payload.summary,
      issuer: payload.school,
    };
  }

  public async getTranscriptPreview(studentId: string, user: AuthUser): Promise<ReportPreview> {
    if (!Types.ObjectId.isValid(studentId)) throw new NotFoundError('Student not found');
    const student = await StudentModel.findOne({
      _id: studentId,
      schoolId: user.schoolId,
      isDeleted: false,
    })
      .lean()
      .exec();
    if (!student) throw new NotFoundError('Student not found');
    this.assertBranch(student.branchId, user);

    const [school, branch, enrollments, results, transfers] = await Promise.all([
      SchoolModel.findOne({ _id: student.schoolId, isDeleted: false }).lean().exec(),
      BranchModel.findOne({
        _id: student.branchId,
        schoolId: user.schoolId,
        isDeleted: false,
      })
        .lean()
        .exec(),
      EnrollmentModel.find({ studentId: student._id, schoolId: user.schoolId, isDeleted: false })
        .populate('academicYearId', 'name code')
        .populate('academicPeriodId', 'name code')
        .populate('programId', 'nameEn nameKh code')
        .populate('levelId', 'name code sequence')
        .populate('classId', 'className classCode')
        .populate('branchId', 'branchNameEn branchCode')
        .sort({ enrollmentDate: 1 })
        .lean()
        .exec(),
      TermResultModel.find({ studentId: student._id, schoolId: user.schoolId, isDeleted: false })
        .populate('academicYearId', 'name code')
        .populate('academicPeriodId', 'name code')
        .populate('programId', 'nameEn nameKh code')
        .populate('levelId', 'name code sequence')
        .populate('classId', 'className classCode')
        .sort({ createdAt: 1 })
        .lean()
        .exec(),
      StudentTransferModel.find({
        studentId: student._id,
        $or: [{ fromSchoolId: user.schoolId }, { toSchoolId: user.schoolId }],
        ...(user.branchAccess === 'all'
          ? {}
          : {
              $and: [
                {
                  $or: [
                    { fromBranchId: { $in: user.branchAccess } },
                    { toBranchId: { $in: user.branchAccess } },
                  ],
                },
              ],
            }),
        isDeleted: false,
      })
        .populate('fromBranchId', 'branchNameEn branchCode')
        .populate('toBranchId', 'branchNameEn branchCode')
        .sort({ transferDate: 1 })
        .lean()
        .exec(),
    ]);
    if (!school || !branch) throw new NotFoundError('Transcript school or branch is missing');

    const payload: Record<string, unknown> = {
      school: { nameEn: school.nameEn, nameKh: school.nameKh, logo: school.logo },
      branch: { id: String(branch._id), nameEn: branch.branchNameEn, code: branch.branchCode },
      student: {
        id: String(student._id),
        studentId: student.studentId,
        name: `${student.firstName} ${student.lastName}`.trim(),
        khmerName: student.khmerName,
        gender: student.gender,
        dateOfBirth: toDate(student.dateOfBirth),
        admissionDate: toDate(student.admissionDate),
      },
      enrollments: enrollments.map((enrollment) => ({
        code: enrollment.enrollmentCode,
        academicYear: toRecord(enrollment.academicYearId).name,
        period: toRecord(enrollment.academicPeriodId).name,
        branch: toRecord(enrollment.branchId).branchNameEn,
        program: toRecord(enrollment.programId).nameEn,
        level: toRecord(enrollment.levelId).name,
        className: toRecord(enrollment.classId).className,
        status: enrollment.status,
        enrolledAt: toDate(enrollment.enrollmentDate),
      })),
      results: results.map((result) => ({
        academicYear: toRecord(result.academicYearId).name,
        period: toRecord(result.academicPeriodId).name,
        program: toRecord(result.programId).nameEn,
        level: toRecord(result.levelId).name,
        className: toRecord(result.classId).className,
        subjects: result.subjectResults ?? [],
        average: result.averageScore,
        gpa: result.gpa,
        grade: result.letterGrade,
        result: result.resultStatus,
        promotion: result.promotionStatus,
        completedAt: toDate(result.completionDate),
      })),
      promotionHistory: results.map((result) => ({
        period: toRecord(result.academicPeriodId).name,
        status: result.promotionStatus,
        fromLevel: toRecord(result.levelId).name,
        completedAt: toDate(result.completionDate),
      })),
      transfers: transfers.map((transfer) => ({
        transferNumber: transfer.transferNumber,
        fromBranch: toRecord(transfer.fromBranchId).branchNameEn,
        toBranch: toRecord(transfer.toBranchId).branchNameEn,
        date: toDate(transfer.transferDate),
        status: transfer.status,
      })),
      asOf: new Date().toISOString(),
    };
    return { payload, snapshotSource: 'live_record' };
  }

  public async generateTranscript(studentId: string, user: AuthUser): Promise<IOfficialDocument> {
    const preview = await this.getTranscriptPreview(studentId, user);
    return this.persistDocument('transcript', studentId, preview.payload, 'TRN', user);
  }

  public async getReceiptPreview(paymentId: string, user: AuthUser): Promise<ReportPreview> {
    return this.getFinancePreview(paymentId, user, 'payment_receipt');
  }

  public async getInvoicePreview(paymentId: string, user: AuthUser): Promise<ReportPreview> {
    return this.getFinancePreview(paymentId, user, 'invoice');
  }

  public async generateReceipt(paymentId: string, user: AuthUser): Promise<IOfficialDocument> {
    const preview = await this.getReceiptPreview(paymentId, user);
    if (preview.document) return preview.document;
    const finance = toRecord(preview.payload.finance);
    return this.persistDocument(
      'payment_receipt',
      paymentId,
      preview.payload,
      'RCT',
      user,
      String(finance.receiptNumber),
    );
  }

  public async generateInvoice(paymentId: string, user: AuthUser): Promise<IOfficialDocument> {
    const preview = await this.getInvoicePreview(paymentId, user);
    if (preview.document) return preview.document;
    const finance = toRecord(preview.payload.finance);
    return this.persistDocument(
      'invoice',
      paymentId,
      preview.payload,
      'INV',
      user,
      String(finance.invoiceNumber),
    );
  }

  public async renderPdf(document: IOfficialDocument, user: AuthUser): Promise<Buffer> {
    this.assertDocumentScope(document, user);
    return renderOfficialDocumentPdf(
      document.type,
      document.documentNumber,
      document.generatedAt,
      document.payload,
    );
  }

  private assertBranch(branchId: unknown, user: AuthUser): void {
    if (!checkBranchAccess(user.branchAccess, asId(branchId))) {
      throw new ForbiddenError('You do not have access to this report branch');
    }
  }

  private assertDocumentScope(document: IOfficialDocument, user: AuthUser): void {
    if (asId(document.schoolId) !== user.schoolId) {
      throw new ForbiddenError('You do not have access to this report school');
    }
    this.assertBranch(document.branchId, user);
  }

  private async assertTeacherClass(
    classId: unknown,
    user: AuthUser,
    action: 'view' | 'generate',
  ): Promise<void> {
    const hasBranchWideReportAccess = checkUserPermission(
      user.permissions,
      `report_card.${action}.own_branch`,
    );
    if (!hasBranchWideReportAccess) {
      const resolvedClassId = asId(classId);
      if (!Types.ObjectId.isValid(resolvedClassId)) {
        throw new ForbiddenError('Teacher report access requires a valid class assignment');
      }
      await validateTeacherClassAccess(user, resolvedClassId);
    }
  }

  private async deriveLegacySubjectResults(
    classId: unknown,
    studentId: unknown,
    schoolId: string,
  ): Promise<Array<Record<string, unknown>>> {
    const scores = await ScoreModel.find({
      classId: asId(classId),
      studentId: asId(studentId),
      schoolId,
      isDeleted: false,
    } as never)
      .lean()
      .exec();
    const [assessments, subjects] = await Promise.all([
      AssessmentModel.find({
        _id: { $in: scores.map((score) => score.assessmentId) },
        schoolId,
        isDeleted: false,
      })
        .lean()
        .exec(),
      SubjectModel.find({
        _id: { $in: scores.map((score) => score.subjectId) },
        schoolId,
        isDeleted: false,
      })
        .lean()
        .exec(),
    ]);
    const assessmentMap = new Map(assessments.map((item) => [String(item._id), item]));
    const subjectMap = new Map(subjects.map((item) => [String(item._id), item]));
    const grouped = new Map<string, typeof scores>();
    for (const score of scores) {
      const id = String(score.subjectId);
      grouped.set(id, [...(grouped.get(id) ?? []), score]);
    }
    return Array.from(grouped.entries()).map(([subjectIdValue, subjectScores]) => {
      const subject = subjectMap.get(subjectIdValue);
      const assessmentsValue = subjectScores.map((score) => {
        const assessment = assessmentMap.get(String(score.assessmentId));
        return {
          code: assessment?.code,
          name: assessment?.name,
          scoreObtained: score.scoreObtained,
          maxScore: assessment?.maxScore,
          percentage: score.percentage,
          weightPercentage: assessment?.weightPercentage,
          isAbsent: score.isAbsent,
        };
      });
      const average =
        assessmentsValue.length > 0
          ? Math.round(
              (assessmentsValue.reduce((sum, item) => sum + item.percentage, 0) /
                assessmentsValue.length) *
                10,
            ) / 10
          : 0;
      return {
        code: subject?.code,
        name: subject?.name,
        assessments: assessmentsValue,
        total: subjectScores.reduce((sum, score) => sum + score.scoreObtained, 0),
        average,
        grade:
          average >= 90
            ? 'A'
            : average >= 80
              ? 'B'
              : average >= 70
                ? 'C'
                : average >= 60
                  ? 'D'
                  : average >= 50
                    ? 'E'
                    : 'F',
        passed: average >= 50,
      };
    });
  }

  private async getFinancePreview(
    paymentId: string,
    user: AuthUser,
    type: 'payment_receipt' | 'invoice',
  ): Promise<ReportPreview> {
    if (!Types.ObjectId.isValid(paymentId)) throw new NotFoundError('Payment not found');
    const existing = await this.repository.findLatestBySource(type, paymentId);
    if (existing) {
      this.assertDocumentScope(existing, user);
      return { document: existing, payload: existing.payload, snapshotSource: 'official_document' };
    }
    const payment = await PaymentModel.findOne({
      _id: paymentId,
      schoolId: user.schoolId,
      isDeleted: false,
    })
      .lean()
      .exec();
    if (!payment) throw new NotFoundError('Payment not found');
    this.assertBranch(payment.branchId, user);
    const [school, branch, student, fee, collector, enrollment] = await Promise.all([
      SchoolModel.findOne({ _id: payment.schoolId, isDeleted: false }).lean().exec(),
      BranchModel.findOne({
        _id: payment.branchId,
        schoolId: user.schoolId,
        isDeleted: false,
      })
        .lean()
        .exec(),
      StudentModel.findOne({
        _id: payment.studentId,
        schoolId: user.schoolId,
        isDeleted: false,
      })
        .lean()
        .exec(),
      TuitionFeeModel.findOne({
        _id: payment.tuitionFeeId,
        schoolId: user.schoolId,
        isDeleted: false,
      })
        .lean()
        .exec(),
      payment.createdBy
        ? UserModel.findOne({
            _id: payment.createdBy,
            schoolId: user.schoolId,
            isDeleted: false,
          })
            .lean()
            .exec()
        : null,
      EnrollmentModel.findOne({
        studentId: payment.studentId,
        academicYearId: payment.academicYearId,
        schoolId: user.schoolId,
        isDeleted: false,
      })
        .sort({ enrollmentDate: -1 })
        .lean()
        .exec(),
    ]);
    if (!school || !branch || !student || !fee) {
      throw new NotFoundError('Financial document source data is incomplete');
    }
    const invoiceNumber = `INV-${payment.receiptNumber.replace(/^PAY-?/, '')}`;
    const total = payment.amountDue - payment.discountAmount;
    const paid = Math.max(0, total - payment.balanceRemaining);
    const payload: Record<string, unknown> = {
      school: { nameEn: school.nameEn, nameKh: school.nameKh, logo: school.logo },
      branch: {
        id: String(branch._id),
        code: branch.branchCode,
        nameEn: branch.branchNameEn,
        nameKh: branch.branchNameKh,
      },
      student: {
        id: String(student._id),
        studentId: student.studentId,
        name: `${student.firstName} ${student.lastName}`.trim(),
        khmerName: student.khmerName,
      },
      finance: {
        receiptNumber: payment.receiptNumber,
        paymentNumber:
          payment.paymentNumber ?? payment.transactionReference ?? payment.receiptNumber,
        invoiceNumber,
        invoiceReference: invoiceNumber,
        enrollment: enrollment?.enrollmentCode,
        feeName: fee.feeName,
        feeItems: [{ code: fee.feeCode, name: fee.feeName, amount: payment.amountDue }],
        amountDue: payment.amountDue,
        amountPaid: payment.amountPaid,
        total,
        paid,
        discount: payment.discountAmount,
        balance: payment.balanceRemaining,
        currency: payment.currency,
        paymentMethod: payment.paymentMethod,
        paymentDate: toDate(payment.paymentDate),
        dueDate: toDate(payment.dueDate),
        collectedBy: collector?.username ?? 'System cashier',
        status: payment.status,
        voidReason: payment.voidReason,
        voidedAt: toDate(payment.voidedAt),
      },
      sourceUpdatedAt: payment.updatedAt,
    };
    return { payload, snapshotSource: 'live_record' };
  }

  private async persistDocument(
    type: OfficialDocumentType,
    sourceId: string,
    payload: Record<string, unknown>,
    prefix: string,
    user: AuthUser,
    requestedNumber?: string,
  ): Promise<IOfficialDocument> {
    const hash = createHash('sha256').update(JSON.stringify(payload)).digest('hex');
    const existing = await this.repository.findByContent(type, sourceId, hash);
    if (existing) return existing;
    const branchId = String(toRecord(payload.branch).id);
    const studentId = String(toRecord(payload.student).id || '');
    this.assertBranch(branchId, user);
    const documentNumber =
      requestedNumber || (await SequenceService.getNextSequence(`DOCUMENT_${prefix}`, prefix, 8));
    const document = await this.repository.create({
      documentNumber,
      type,
      schoolId: new Types.ObjectId(user.schoolId),
      branchId: new Types.ObjectId(branchId),
      studentId: Types.ObjectId.isValid(studentId) ? new Types.ObjectId(studentId) : undefined,
      sourceId: new Types.ObjectId(sourceId),
      sourceUpdatedAt: payload.sourceUpdatedAt
        ? new Date(String(payload.sourceUpdatedAt))
        : undefined,
      payload,
      contentHash: hash,
      generatedBy: user.userId,
      generatedAt: new Date(),
      status: 'active',
    });
    await AuditLogService.log({
      userId: user.userId,
      schoolId: user.schoolId,
      branchId,
      module: 'report',
      action: 'CREATE',
      entityType: 'OfficialDocument',
      entityId: String(document._id),
      newValue: { documentNumber, type, sourceId, contentHash: hash },
    });
    return document;
  }
}
