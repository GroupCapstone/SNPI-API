import { BadRequestError, ConflictError, NotFoundError } from '../../shared/errors/app-error';
import type { AuthUser } from '../../types/auth';
import { AcademicYearModel } from '../academic-year/academic-year.model';
import { AssessmentModel } from '../assessment/assessment.model';
import { AttendanceRecordModel } from '../attendance/attendance-record.model';
import { AttendanceModel } from '../attendance/attendance.model';
import { AuditLogService } from '../audit-log/audit-log.service';
import { ClassModel } from '../class/class.model';
import { EnrollmentModel } from '../enrollment/enrollment.model';
import { ScoreModel } from '../score/score.model';
import { TermResultModel } from '../term-result/term-result.model';
import type { IAcademicPeriod } from './academic-period.model';
import { AcademicPeriodModel } from './academic-period.model';
import { AcademicPeriodRepository } from './academic-period.repository';
import type {
  AcademicPeriodQueryFilters,
  AcademicPeriodClosingChecklist,
  AcademicPeriodTransitionDto,
  ClosingIssue,
  ClosingWarning,
  CreateAcademicPeriodDto,
  GenerateMonthlyPeriodsDto,
  GeneratedMonthlyPeriodsResult,
  PaginatedAcademicPeriods,
  UpdateAcademicPeriodDto,
} from './academic-period.types';

export class AcademicPeriodService {
  public constructor(private readonly repository = new AcademicPeriodRepository()) {}

  public async getAcademicPeriods(
    filters: AcademicPeriodQueryFilters = {},
    currentUser: AuthUser,
  ): Promise<PaginatedAcademicPeriods> {
    return this.repository.findMany({ ...filters, schoolId: currentUser.schoolId });
  }

  public async getAcademicPeriodById(id: string, currentUser?: AuthUser): Promise<IAcademicPeriod> {
    const period = await this.repository.findById(id, currentUser?.schoolId);
    if (!period) {
      throw new NotFoundError('Academic Period not found');
    }
    return period;
  }

  public async createAcademicPeriod(
    dto: CreateAcademicPeriodDto,
    currentUser: AuthUser,
  ): Promise<IAcademicPeriod> {
    // 1. Verify parent Academic Year exists
    const academicYear = await AcademicYearModel.findOne({
      _id: dto.academicYearId,
      schoolId: currentUser.schoolId,
      isDeleted: false,
    });
    if (!academicYear) {
      throw new NotFoundError('Parent Academic Year does not exist');
    }

    // 2. Validate dates
    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestError('Invalid startDate or endDate provided');
    }
    if (start >= end) {
      throw new BadRequestError('Period startDate must be earlier than endDate');
    }
    if (start < academicYear.startDate || end > academicYear.endDate) {
      throw new BadRequestError('Academic period dates must be within the parent academic year');
    }
    if (dto.status && dto.status !== 'planned') {
      throw new ConflictError('New academic periods must start in planned status');
    }
    if (dto.schoolId && dto.schoolId !== currentUser.schoolId) {
      throw new BadRequestError('Academic period school must match the authenticated school');
    }

    // 3. Ensure code uniqueness within Academic Year
    const existing = await this.repository.findByCode(dto.academicYearId, dto.code);
    if (existing) {
      throw new ConflictError(
        `Academic Period with code "${dto.code.toUpperCase()}" already exists in this Academic Year`,
      );
    }

    return this.repository.create(
      { ...dto, schoolId: currentUser.schoolId, status: 'planned' },
      currentUser.userId,
    );
  }

  public async updateAcademicPeriod(
    id: string,
    dto: UpdateAcademicPeriodDto,
    currentUser: AuthUser,
  ): Promise<IAcademicPeriod> {
    const period = await this.repository.findById(id, currentUser.schoolId);
    if (!period) {
      throw new NotFoundError('Academic Period not found');
    }

    if (dto.academicYearId && dto.academicYearId !== String(period.academicYearId)) {
      const academicYear = await AcademicYearModel.findOne({
        _id: dto.academicYearId,
        schoolId: currentUser.schoolId,
        isDeleted: false,
      });
      if (!academicYear) {
        throw new NotFoundError('Target Academic Year does not exist');
      }
    }

    if (dto.schoolId && dto.schoolId !== currentUser.schoolId) {
      throw new BadRequestError('Academic period school cannot be changed');
    }
    delete dto.schoolId;

    const targetYearId = dto.academicYearId || String(period.academicYearId);
    const targetYear = await AcademicYearModel.findOne({
      _id: targetYearId,
      schoolId: currentUser.schoolId,
      isDeleted: false,
    });
    if (!targetYear) {
      throw new NotFoundError('Target Academic Year does not exist');
    }

    const start = dto.startDate ? new Date(dto.startDate) : period.startDate;
    const end = dto.endDate ? new Date(dto.endDate) : period.endDate;
    if (start >= end) {
      throw new BadRequestError('Period startDate must be earlier than endDate');
    }
    if (start < targetYear.startDate || end > targetYear.endDate) {
      throw new BadRequestError('Academic period dates must be within the parent academic year');
    }

    if (dto.code && dto.code.toUpperCase().trim() !== period.code) {
      const duplicate = await this.repository.findByCode(targetYearId, dto.code);
      if (duplicate && String(duplicate._id) !== id) {
        throw new ConflictError(
          `Academic Period with code "${dto.code.toUpperCase()}" already exists in this Academic Year`,
        );
      }
    }

    if (dto.status && dto.status !== period.status) {
      await this.transitionAcademicPeriod(id, { status: dto.status }, currentUser);
      const remaining = { ...dto };
      delete remaining.status;
      if (Object.keys(remaining).length === 0) {
        return this.getAcademicPeriodById(id, currentUser);
      }
      dto = remaining;
    }

    const updated = await this.repository.update(id, dto, currentUser.userId);
    if (!updated) {
      throw new NotFoundError('Academic Period not found');
    }
    return updated;
  }

  public async getClosingChecklist(
    id: string,
    programId?: string,
    currentUser?: AuthUser,
  ): Promise<AcademicPeriodClosingChecklist> {
    const period = await AcademicPeriodModel.findOne({
      _id: id,
      ...(currentUser ? { schoolId: currentUser.schoolId } : {}),
      isDeleted: false,
    });
    if (!period) throw new NotFoundError('Academic Period not found');

    const effectiveProgramId =
      programId || (period.programId ? String(period.programId) : undefined);

    const classQuery: Record<string, unknown> = { academicPeriodId: id, isDeleted: false };
    if (effectiveProgramId) {
      classQuery.programId = effectiveProgramId;
    }

    const classes = await ClassModel.find(classQuery).select('_id').lean();
    const classIds = classes.map((item) => item._id);

    const enrollmentQuery: Record<string, unknown> = {
      $or: [{ academicPeriodId: id }, { classId: { $in: classIds } }],
      status: { $in: ['pending', 'enrolled', 'active'] },
      isDeleted: false,
    };
    if (effectiveProgramId) {
      enrollmentQuery.programId = effectiveProgramId;
    }

    const termResultQuery: Record<string, unknown> = { academicPeriodId: id, isDeleted: false };
    if (effectiveProgramId) {
      termResultQuery.programId = effectiveProgramId;
    }

    const attendanceQuery: Record<string, unknown> = {
      academicPeriodId: id,
      classId: { $in: classIds },
      isDeleted: false,
    };

    const [enrollments, assessments, attendanceSessions, termResults] = await Promise.all([
      EnrollmentModel.find(enrollmentQuery).select('_id classId').lean(),
      AssessmentModel.find({ classId: { $in: classIds }, isDeleted: false })
        .select('_id classId status')
        .lean(),
      AttendanceModel.countDocuments(attendanceQuery),
      TermResultModel.find(termResultQuery)
        .select('enrollmentId workflowStatus promotionStatus isCompleted')
        .lean(),
    ]);

    const enrollmentCountByClass = new Map<string, number>();
    for (const enrollment of enrollments) {
      const classId = String(enrollment.classId);
      enrollmentCountByClass.set(classId, (enrollmentCountByClass.get(classId) ?? 0) + 1);
    }
    const expectedScores = assessments.reduce(
      (sum, assessment) => sum + (enrollmentCountByClass.get(String(assessment.classId)) ?? 0),
      0,
    );
    const [recordedScores, attendedEnrollmentIds] = await Promise.all([
      ScoreModel.countDocuments({
        assessmentId: { $in: assessments.map((item) => item._id) },
        isDeleted: false,
      }),
      AttendanceRecordModel.distinct('enrollmentId', {
        academicPeriodId: id,
        classId: { $in: classIds },
        isDeleted: false,
      }),
    ]);
    const attended = new Set(attendedEnrollmentIds.map(String));
    const studentsWithoutAttendance =
      attendanceSessions === 0
        ? enrollments.length
        : enrollments.filter((item) => !attended.has(String(item._id))).length;
    const missingScores = Math.max(0, expectedScores - recordedScores);
    const draftAssessments = assessments.filter((item) => item.status === 'draft').length;
    const resultEnrollmentIds = new Set(termResults.map((item) => String(item.enrollmentId)));
    const missingResults = enrollments.filter(
      (item) => !resultEnrollmentIds.has(String(item._id)),
    ).length;
    const unapprovedResults =
      missingResults +
      termResults.filter((item) => !['APPROVED', 'FINALIZED'].includes(item.workflowStatus)).length;
    const unresolvedPromotions = termResults.filter((item) => !item.isCompleted).length;

    const blockingIssues: ClosingIssue[] = [];
    const warnings: ClosingWarning[] = [];

    if (draftAssessments > 0) {
      blockingIssues.push({
        type: 'DRAFT_ASSESSMENT',
        message: `${draftAssessments} assessment(s) are still in draft state`,
        count: draftAssessments,
      });
    }
    if (missingScores > 0) {
      blockingIssues.push({
        type: 'MISSING_SCORE',
        message: `${missingScores} required score(s) have not been submitted`,
        count: missingScores,
      });
    }
    if (unapprovedResults > 0) {
      blockingIssues.push({
        type: 'UNAPPROVED_RESULT',
        message: `${unapprovedResults} term result(s) are missing or not approved`,
        count: unapprovedResults,
      });
    }
    if (unresolvedPromotions > 0) {
      blockingIssues.push({
        type: 'UNRESOLVED_PROMOTION',
        message: `${unresolvedPromotions} student promotion/repeat decision(s) are unresolved`,
        count: unresolvedPromotions,
      });
    }

    if (studentsWithoutAttendance > 0) {
      warnings.push({
        type: 'ATTENDANCE_COMPLETENESS',
        message: `${studentsWithoutAttendance} enrollment(s) have incomplete attendance records`,
        count: studentsWithoutAttendance,
      });
    }

    const promotedCount = termResults.filter((r) => r.promotionStatus === 'PROMOTED').length;
    const repeatedCount = termResults.filter((r) => r.promotionStatus === 'REPEAT').length;
    const continuedCount = termResults.filter(
      (r) => r.promotionStatus === 'CONTINUE' || (!r.promotionStatus && r.isCompleted),
    ).length;
    const graduatedCount = termResults.filter((r) => r.promotionStatus === 'COMPLETED').length;
    const withdrawnCount = enrollments.filter(
      (e) => (e as unknown as { status?: string }).status === 'withdrawn',
    ).length;

    const preview = {
      classesCount: classes.length,
      activeEnrollmentsCount: enrollments.length,
      promotedCount,
      repeatedCount,
      continuedCount,
      graduatedCount,
      withdrawnCount,
      unresolvedCount: unresolvedPromotions,
      projectedTargetEnrollmentsCount: promotedCount + repeatedCount + continuedCount,
    };

    const problems = blockingIssues.map((item) => item.message);
    const canFinalize = blockingIssues.length === 0;

    return {
      academicPeriodId: id,
      canFinalize,
      canClose: canFinalize && termResults.every((item) => item.workflowStatus === 'FINALIZED'),
      checkedAt: new Date(),
      counts: {
        classes: classes.length,
        activeEnrollments: enrollments.length,
        assessments: assessments.length,
        draftAssessments,
        expectedScores,
        recordedScores,
        missingScores,
        attendanceSessions,
        studentsWithoutAttendance,
        termResults: termResults.length,
        unapprovedResults,
        unresolvedPromotions,
      },
      problems,
      blockingIssues,
      warnings,
      preview,
    };
  }

  public async transitionAcademicPeriod(
    id: string,
    dto: AcademicPeriodTransitionDto,
    currentUser: AuthUser,
  ): Promise<IAcademicPeriod> {
    const period = await AcademicPeriodModel.findOne({
      _id: id,
      schoolId: currentUser.schoolId,
      isDeleted: false,
    });
    if (!period) throw new NotFoundError('Academic Period not found');
    const legacyStatus =
      period.status === ('active' as never)
        ? 'open'
        : period.status === ('inactive' as never)
          ? 'planned'
          : period.status;
    if (legacyStatus === dto.status) return period;
    const allowed: Record<string, string> = {
      planned: 'open',
      open: 'result_processing',
      result_processing: 'finalized',
      finalized: 'closed',
    };
    if (allowed[legacyStatus] !== dto.status) {
      throw new ConflictError(
        `Cannot transition academic period from ${legacyStatus} to ${dto.status}`,
      );
    }
    if (dto.status === 'finalized' || dto.status === 'closed') {
      const checklist = await this.getClosingChecklist(id, undefined, currentUser);
      const allowedByChecklist =
        dto.status === 'finalized' ? checklist.canFinalize : checklist.canClose;
      if (!allowedByChecklist) {
        throw new ConflictError(
          `Cannot ${dto.status === 'closed' ? 'close' : 'finalize'} ${period.name}. Problems: ${checklist.problems.join('; ')}`,
        );
      }
    }

    const now = new Date();
    const metadata: Record<string, unknown> = {};
    if (dto.status === 'open')
      Object.assign(metadata, { openedAt: now, openedBy: currentUser.userId });
    if (dto.status === 'finalized')
      Object.assign(metadata, { finalizedAt: now, finalizedBy: currentUser.userId });
    if (dto.status === 'closed')
      Object.assign(metadata, { closedAt: now, closedBy: currentUser.userId });
    const updated = await AcademicPeriodModel.findOneAndUpdate(
      { _id: id, status: period.status, isDeleted: false },
      { $set: { status: dto.status, ...metadata, updatedBy: currentUser.userId } },
      { new: true, runValidators: true },
    );
    if (!updated) throw new ConflictError('Academic period changed while transitioning');
    await AuditLogService.log({
      userId: currentUser.userId,
      schoolId: period.schoolId ? String(period.schoolId) : currentUser.schoolId,
      module: 'academic_period',
      action: 'WORKFLOW_TRANSITION',
      entityType: 'AcademicPeriod',
      entityId: id,
      reason: dto.reason,
      oldValue: { status: legacyStatus },
      newValue: { status: dto.status, ...metadata },
    });
    return updated;
  }

  public async deleteAcademicPeriod(id: string, currentUser: AuthUser): Promise<void> {
    const period = await this.repository.findById(id, currentUser.schoolId);
    if (!period) {
      throw new NotFoundError('Academic Period not found');
    }
    if (['closed', 'finalized'].includes(String(period.status))) {
      throw new ConflictError('Finalized or closed academic periods cannot be deleted');
    }

    // Soft delete protection: Block deleting if active classes reference this period
    const dependentClasses = await ClassModel.countDocuments({
      academicPeriodId: id,
      isDeleted: false,
    });
    if (dependentClasses > 0) {
      throw new BadRequestError(
        `Cannot delete Academic Period because ${dependentClasses} active Class(es) depend on it`,
      );
    }

    const deleted = await this.repository.softDelete(id, currentUser.userId, currentUser.schoolId);
    if (!deleted) {
      throw new NotFoundError('Academic Period not found');
    }
  }

  public async generateMonthlyPeriods(
    dto: GenerateMonthlyPeriodsDto,
    currentUser: AuthUser,
  ): Promise<GeneratedMonthlyPeriodsResult> {
    const academicYear = await AcademicYearModel.findOne({
      _id: dto.academicYearId,
      schoolId: currentUser.schoolId,
      isDeleted: false,
    });
    if (!academicYear) {
      throw new NotFoundError('Parent Academic Year does not exist');
    }

    const baseYear =
      dto.calendarYear ??
      (academicYear.startDate
        ? new Date(academicYear.startDate).getUTCFullYear()
        : new Date().getUTCFullYear());
    const startMonth = dto.startMonth ?? 1;
    const monthCount = dto.monthCount ?? 12;

    const monthNamesEn = [
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
    const monthNamesKh = [
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

    const generatedPeriods: IAcademicPeriod[] = [];
    let createdCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < monthCount; i++) {
      const currentMonthIndex = (startMonth - 1 + i) % 12;
      const yearOffset = Math.floor((startMonth - 1 + i) / 12);
      const year = baseYear + yearOffset;
      const monthNumber = currentMonthIndex + 1;
      const monthCode = `${year}-M${String(monthNumber).padStart(2, '0')}`;
      const sequence = i + 1;

      const existing = await this.repository.findByCode(dto.academicYearId, monthCode);
      if (existing) {
        skippedCount++;
        generatedPeriods.push(existing);
        continue;
      }

      const startDate = new Date(Date.UTC(year, currentMonthIndex, 1, 0, 0, 0));
      const nextMonth = new Date(Date.UTC(year, currentMonthIndex + 1, 1, 0, 0, 0));
      const endDate = new Date(nextMonth.getTime() - 1);
      const name = `${monthNamesKh[currentMonthIndex]} (${monthNamesEn[currentMonthIndex]} ${year})`;

      const period = await this.repository.create(
        {
          schoolId: currentUser.schoolId,
          programId: dto.programId,
          code: monthCode,
          name,
          type: 'MONTHLY',
          academicYearId: dto.academicYearId,
          startDate,
          endDate,
          sequence,
          status: 'planned',
        },
        currentUser.userId,
      );

      createdCount++;
      generatedPeriods.push(period);
    }

    await AuditLogService.log({
      userId: currentUser.userId,
      schoolId: dto.schoolId || currentUser.schoolId,
      module: 'academic_period',
      action: 'CREATE',
      entityType: 'AcademicPeriod',
      entityId: dto.academicYearId,
      newValue: {
        academicYearId: dto.academicYearId,
        createdCount,
        skippedCount,
        periods: generatedPeriods.map((p) => p.code),
      },
    });

    return {
      createdCount,
      skippedCount,
      periods: generatedPeriods,
    };
  }
}
