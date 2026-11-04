import { checkBranchAccess } from '../../middleware/branch-access';
import { ForbiddenError } from '../../shared/errors/app-error';
import type { AuthUser } from '../../types/auth';
import { DashboardRepository } from './dashboard.repository';
import type {
  AcademicHonorRollFilters,
  AcademicHonorRollResponse,
  DashboardActionItemsFilters,
  DashboardActionItemsResponse,
  FinancePulseResponse,
  HrPulseResponse,
  NearCapacityClassItem,
  OverdueDebtItem,
  PendingApprovalItem,
  StudentAffairsPulseResponse,
  UnmarkedAttendanceItem,
  UnsubmittedScoreItem,
} from './dashboard.types';

export class DashboardService {
  constructor(private readonly repository = new DashboardRepository()) {}

  public async getActionItems(
    currentUser: AuthUser,
    filters: DashboardActionItemsFilters = {},
  ): Promise<DashboardActionItemsResponse> {
    if (filters.branchId && !checkBranchAccess(currentUser.branchAccess, filters.branchId)) {
      throw new ForbiddenError('You do not have access to data in this branch');
    }

    let branchIds: string[] | undefined;
    if (filters.branchId) {
      branchIds = [filters.branchId];
    } else if (currentUser.branchAccess !== 'all' && Array.isArray(currentUser.branchAccess)) {
      branchIds = currentUser.branchAccess;
    }

    const schoolId = currentUser.schoolId;
    const academicYearId = filters.academicYearId;

    const permissions = currentUser.permissions || [];
    const isSuperAdmin = permissions.includes('*');

    const hasAttendanceAccess =
      isSuperAdmin || permissions.some((p) => p.startsWith('attendance.'));

    const hasScoreAccess =
      isSuperAdmin ||
      permissions.some((p) => p.startsWith('assessment.') || p.startsWith('score.'));

    const hasDebtAccess =
      isSuperAdmin ||
      permissions.some(
        (p) =>
          p.startsWith('payment.') || p.startsWith('tuition.') || p.startsWith('report.finance.'),
      );

    const hasApprovalsAccess =
      isSuperAdmin || permissions.some((p) => p.startsWith('historical_correction.'));

    const hasCapacityAccess =
      isSuperAdmin ||
      permissions.some((p) => p.startsWith('class.') || p.startsWith('enrollment.'));

    const now = new Date();

    const [rawAttendance, rawAssessments, rawDebts, rawApprovals, rawCapacityClasses] =
      await Promise.all([
        hasAttendanceAccess
          ? this.repository.findUnmarkedAttendanceClasses({ schoolId, branchIds, academicYearId })
          : Promise.resolve([]),
        hasScoreAccess
          ? this.repository.findUnsubmittedAssessments({ schoolId, branchIds, academicYearId })
          : Promise.resolve([]),
        hasDebtAccess
          ? this.repository.findOverdueDebts({ schoolId, branchIds, academicYearId })
          : Promise.resolve([]),
        hasApprovalsAccess
          ? this.repository.findPendingApprovals({ schoolId, branchIds, academicYearId })
          : Promise.resolve([]),
        hasCapacityAccess
          ? this.repository.findNearCapacityClasses({ schoolId, branchIds, academicYearId })
          : Promise.resolve([]),
      ]);

    const unmarkedAttendance: UnmarkedAttendanceItem[] = rawAttendance.map((cls) => {
      const branch = cls.branchId as { branchNameEn?: string; branchNameKh?: string } | undefined;
      return {
        id: `att-${String(cls._id)}`,
        title: `Unmarked Attendance: ${cls.className}`,
        subtitle: branch?.branchNameEn ? `Branch: ${branch.branchNameEn}` : undefined,
        severity: 'high',
        branchId: cls.branchId
          ? String((cls.branchId as { _id?: unknown })._id ?? cls.branchId)
          : undefined,
        branchName: branch?.branchNameEn,
        classId: String(cls._id),
        className: cls.className,
        actionUrl: `/attendance?classId=${String(cls._id)}`,
      };
    });

    const unsubmittedScores: UnsubmittedScoreItem[] = rawAssessments.map((a) => {
      const cls = a.classId as { className?: string } | undefined;
      const sub = a.subjectId as { nameEn?: string } | undefined;
      const branch = a.branchId as { branchNameEn?: string } | undefined;
      const daysOverdue = Math.floor(
        (now.getTime() - new Date(a.assessmentDate).getTime()) / (1000 * 60 * 60 * 24),
      );
      return {
        id: `score-${String(a._id)}`,
        title: `Pending Scores: ${a.name} (${cls?.className ?? 'Class'})`,
        subtitle: sub?.nameEn ? `Subject: ${sub.nameEn}` : undefined,
        severity: daysOverdue > 3 ? 'high' : 'medium',
        branchId: a.branchId
          ? String((a.branchId as { _id?: unknown })._id ?? a.branchId)
          : undefined,
        branchName: branch?.branchNameEn,
        assessmentId: String(a._id),
        assessmentCode: a.code,
        assessmentName: a.name,
        classId: a.classId ? String((a.classId as { _id?: unknown })._id ?? a.classId) : '',
        className: cls?.className ?? '',
        subjectName: sub?.nameEn,
        assessmentDate: new Date(a.assessmentDate).toISOString().slice(0, 10),
        actionUrl: `/scores?assessmentId=${String(a._id)}`,
      };
    });

    const overdueDebts: OverdueDebtItem[] = rawDebts.map((p) => {
      const student = p.studentId as
        | { studentId?: string; firstName?: string; lastName?: string; khmerName?: string }
        | undefined;
      const branch = p.branchId as { branchNameEn?: string } | undefined;
      const studentName =
        [student?.firstName, student?.lastName].filter(Boolean).join(' ') ||
        student?.khmerName ||
        student?.studentId ||
        'Student';
      const daysOverdue = p.dueDate
        ? Math.floor((now.getTime() - new Date(p.dueDate).getTime()) / (1000 * 60 * 60 * 24))
        : 0;

      return {
        id: `debt-${String(p._id)}`,
        title: `Overdue Payment: ${studentName}`,
        subtitle: `Receipt #${p.receiptNumber} - Due ${p.dueDate ? new Date(p.dueDate).toISOString().slice(0, 10) : 'N/A'}`,
        severity: daysOverdue > 7 ? 'high' : 'medium',
        branchId: p.branchId
          ? String((p.branchId as { _id?: unknown })._id ?? p.branchId)
          : undefined,
        branchName: branch?.branchNameEn,
        paymentId: String(p._id),
        receiptNumber: p.receiptNumber,
        studentId: p.studentId ? String((p.studentId as { _id?: unknown })._id ?? p.studentId) : '',
        studentName,
        amountDue: p.amountDue,
        balanceRemaining: p.balanceRemaining,
        currency: p.currency,
        dueDate: p.dueDate ? new Date(p.dueDate).toISOString().slice(0, 10) : '',
        actionUrl: `/payments?paymentId=${String(p._id)}`,
      };
    });

    const pendingApprovals: PendingApprovalItem[] = rawApprovals.map((appr) => {
      const student = appr.studentId as
        | { studentId?: string; firstName?: string; lastName?: string; khmerName?: string }
        | undefined;
      const branch = appr.branchId as { branchNameEn?: string } | undefined;
      const studentName =
        [student?.firstName, student?.lastName].filter(Boolean).join(' ') ||
        student?.khmerName ||
        undefined;

      return {
        id: `corr-${String(appr._id)}`,
        title: `Pending Approval: #${appr.correctionNumber} (${appr.entityType})`,
        subtitle: appr.reason,
        severity: 'medium',
        branchId: appr.branchId
          ? String((appr.branchId as { _id?: unknown })._id ?? appr.branchId)
          : undefined,
        branchName: branch?.branchNameEn,
        correctionId: String(appr._id),
        correctionNumber: appr.correctionNumber,
        entityType: appr.entityType,
        studentName,
        reason: appr.reason,
        requestedBy: appr.requestedBy ? String(appr.requestedBy) : undefined,
        actionUrl: `/historical-corrections?id=${String(appr._id)}`,
      };
    });

    const nearCapacityClasses: NearCapacityClassItem[] = rawCapacityClasses.map((cls) => {
      const branch = cls.branchId as { branchNameEn?: string } | undefined;
      const currentCount = cls.currentEnrollmentCount ?? 0;
      const capacity = cls.capacity ?? 1;
      const rate = Math.round((currentCount / capacity) * 100);

      return {
        id: `cap-${String(cls._id)}`,
        title: `Capacity Alert: ${cls.className} (${rate}%)`,
        subtitle: `${currentCount} / ${capacity} seats enrolled`,
        severity: currentCount >= capacity ? 'high' : 'medium',
        branchId: cls.branchId
          ? String((cls.branchId as { _id?: unknown })._id ?? cls.branchId)
          : undefined,
        branchName: branch?.branchNameEn,
        classId: String(cls._id),
        className: cls.className,
        capacity,
        currentEnrollmentCount: currentCount,
        occupancyRate: rate,
        actionUrl: `/classes?id=${String(cls._id)}`,
      };
    });

    const totalActionItems =
      unmarkedAttendance.length +
      unsubmittedScores.length +
      overdueDebts.length +
      pendingApprovals.length +
      nearCapacityClasses.length;

    return {
      summary: {
        totalActionItems,
        unmarkedAttendanceCount: unmarkedAttendance.length,
        unsubmittedScoresCount: unsubmittedScores.length,
        overdueDebtsCount: overdueDebts.length,
        pendingApprovalsCount: pendingApprovals.length,
        nearCapacityClassesCount: nearCapacityClasses.length,
      },
      queues: {
        unmarkedAttendance,
        unsubmittedScores,
        overdueDebts,
        pendingApprovals,
        nearCapacityClasses,
      },
    };
  }

  public async getFinancePulse(
    currentUser: AuthUser,
    filters: DashboardActionItemsFilters = {},
  ): Promise<FinancePulseResponse> {
    if (filters.branchId && !checkBranchAccess(currentUser.branchAccess, filters.branchId)) {
      throw new ForbiddenError('You do not have access to financial data in this branch');
    }

    let branchIds: string[] | undefined;
    if (filters.branchId) {
      branchIds = [filters.branchId];
    } else if (currentUser.branchAccess !== 'all' && Array.isArray(currentUser.branchAccess)) {
      branchIds = currentUser.branchAccess;
    }

    const schoolId = currentUser.schoolId;
    const academicYearId = filters.academicYearId;
    const year = filters.year;
    const month = filters.month;

    return this.repository.getFinancePulse({
      schoolId,
      branchIds,
      academicYearId,
      year,
      month,
    });
  }

  public async getStudentAffairsPulse(
    currentUser: AuthUser,
    filters: DashboardActionItemsFilters = {},
  ): Promise<StudentAffairsPulseResponse> {
    if (filters.branchId && !checkBranchAccess(currentUser.branchAccess, filters.branchId)) {
      throw new ForbiddenError('You do not have access to student data in this branch');
    }

    let branchIds: string[] | undefined;
    if (filters.branchId) {
      branchIds = [filters.branchId];
    } else if (currentUser.branchAccess !== 'all' && Array.isArray(currentUser.branchAccess)) {
      branchIds = currentUser.branchAccess;
    }

    const schoolId = currentUser.schoolId;
    const academicYearId = filters.academicYearId;

    return this.repository.getStudentAffairsPulse({
      schoolId,
      branchIds,
      academicYearId,
    });
  }

  public async getHrPulse(
    currentUser: AuthUser,
    filters: DashboardActionItemsFilters = {},
  ): Promise<HrPulseResponse> {
    if (filters.branchId && !checkBranchAccess(currentUser.branchAccess, filters.branchId)) {
      throw new ForbiddenError('You do not have access to HR data in this branch');
    }

    let branchIds: string[] | undefined;
    if (filters.branchId) {
      branchIds = [filters.branchId];
    } else if (currentUser.branchAccess !== 'all' && Array.isArray(currentUser.branchAccess)) {
      branchIds = currentUser.branchAccess;
    }

    const schoolId = currentUser.schoolId;

    return this.repository.getHrPulse({
      schoolId,
      branchIds,
    });
  }

  public async getAcademicHonorRoll(
    currentUser: AuthUser,
    filters: AcademicHonorRollFilters = {},
  ): Promise<AcademicHonorRollResponse> {
    if (filters.branchId && !checkBranchAccess(currentUser.branchAccess, filters.branchId)) {
      throw new ForbiddenError('You do not have access to academic data in this branch');
    }

    let branchIds: string[] | undefined;
    if (filters.branchId) {
      branchIds = [filters.branchId];
    } else if (currentUser.branchAccess !== 'all' && Array.isArray(currentUser.branchAccess)) {
      branchIds = currentUser.branchAccess;
    }

    const schoolId = currentUser.schoolId;

    return this.repository.getAcademicHonorRoll({
      schoolId,
      branchIds,
      academicYearId: filters.academicYearId,
      academicPeriodId: filters.academicPeriodId,
      classId: filters.classId,
      limit: filters.limit,
    });
  }
}
