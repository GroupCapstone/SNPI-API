import { Types } from 'mongoose';
import mongoose from 'mongoose';

import { checkBranchAccess } from '../../middleware/branch-access';
import { checkUserPermission } from '../../middleware/authorize';
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from '../../shared/errors/app-error';
import type { AuthUser } from '../../types/auth';
import { runInTransaction } from '../../utils/transaction';
import { AcademicPeriodModel } from '../academic-period/academic-period.model';
import type { IAcademicRule } from '../academic-rule/academic-rule.model';
import { AcademicRuleRepository } from '../academic-rule/academic-rule.repository';
import { validateAcademicRuleConfig } from '../academic-rule/academic-rule.validation';
import { AttendanceRecordModel } from '../attendance/attendance-record.model';
import { AssessmentModel } from '../assessment/assessment.model';
import { AttendanceModel } from '../attendance/attendance.model';
import { AuditLogService } from '../audit-log/audit-log.service';
import { ClassModel } from '../class/class.model';
import {
  type ClassCapacityContext,
  reconcileClassEnrollmentCount,
  reserveClassSeat,
} from '../enrollment/enrollment-capacity.service';
import { EnrollmentModel } from '../enrollment/enrollment.model';
import { LevelModel } from '../level/level.model';
import { PromotionModel } from './promotion.model';
import { ScoreModel } from '../score/score.model';
import { SequenceService } from '../sequence/sequence.service';
import { SubjectModel } from '../subject/subject.model';
import type { ITermResult, PromotionStatus, TermResultStatus } from './term-result.model';
import { TermResultModel } from './term-result.model';
import { TermResultRepository } from './term-result.repository';
import type {
  CompleteTermDto,
  PaginatedTermResults,
  TermResultQueryFilters,
  TransitionTermResultDto,
} from './term-result.types';

export class TermResultService {
  public constructor(
    private readonly repository = new TermResultRepository(),
    private readonly academicRuleRepository = new AcademicRuleRepository(),
  ) {}

  private selectRule(
    rules: IAcademicRule[],
    type: IAcademicRule['ruleType'],
  ): IAcademicRule | undefined {
    const specificity = (rule: IAcademicRule) =>
      [
        rule.branchId,
        rule.academicPeriodId,
        rule.academicYearId,
        rule.programId,
        rule.levelId,
      ].filter(Boolean).length;
    return rules
      .filter((rule) => rule.ruleType === type)
      .sort((left, right) => specificity(right) - specificity(left))[0];
  }

  private assertWorkflowPermission(
    action: 'submit' | 'review' | 'approve' | 'finalize',
    currentUser: AuthUser,
  ): void {
    if (
      !checkUserPermission(
        currentUser.permissions,
        `term_result.${action}.own_branch`,
        currentUser.roles,
      )
    ) {
      throw new ForbiddenError(`You do not have permission to ${action} this term result`);
    }
  }

  public async getTermResults(
    filters: TermResultQueryFilters = {},
    currentUser: AuthUser,
  ): Promise<PaginatedTermResults> {
    if (filters.branchId && !checkBranchAccess(currentUser.branchAccess, filters.branchId)) {
      throw new ForbiddenError('You do not have access to term results in this branch');
    }
    const scopedFilters = { ...filters, schoolId: currentUser.schoolId };
    if (!checkUserPermission(currentUser.permissions, 'term_result.view.own_branch')) {
      const assignedClasses = currentUser.assignedClasses ?? [];
      if (scopedFilters.classId && !assignedClasses.includes(scopedFilters.classId)) {
        throw new ForbiddenError('You are not assigned to the requested class');
      }
      scopedFilters.authorizedClassIds = assignedClasses;
    }
    if (!scopedFilters.branchId && currentUser.branchAccess !== 'all') {
      scopedFilters.authorizedBranchIds = currentUser.branchAccess;
    }
    return this.repository.findMany(scopedFilters);
  }

  public async getTermResultById(id: string, currentUser: AuthUser): Promise<ITermResult> {
    const result = await this.repository.findById(id);
    if (!result) {
      throw new NotFoundError('Term Result not found');
    }
    if (currentUser.schoolId && String(result.schoolId) !== currentUser.schoolId) {
      throw new ForbiddenError('You do not have access to this term result');
    }
    if (!checkBranchAccess(currentUser.branchAccess, String(result.branchId))) {
      throw new ForbiddenError('You do not have access to this term result');
    }
    if (
      !checkUserPermission(currentUser.permissions, 'term_result.view.own_branch') &&
      !(currentUser.assignedClasses ?? []).includes(String(result.classId))
    ) {
      throw new ForbiddenError('You are not assigned to this term result class');
    }
    return result;
  }

  public async calculateStudentTermResult(
    enrollmentId: string,
    currentUser: AuthUser,
  ): Promise<ITermResult> {
    const enrollment = await EnrollmentModel.findOne({
      _id: enrollmentId,
      schoolId: new Types.ObjectId(currentUser.schoolId),
      isDeleted: false,
    });
    if (!enrollment) {
      throw new NotFoundError('Enrollment record not found');
    }
    if (!checkBranchAccess(currentUser.branchAccess, String(enrollment.branchId))) {
      throw new ForbiddenError('You do not have access to calculate this term result');
    }

    const existingResult = await this.repository.findByEnrollment(enrollmentId);
    if (existingResult?.isCompleted) {
      throw new ConflictError('A completed term result is immutable and cannot be recalculated');
    }

    const classDoc = await ClassModel.findOne({
      _id: enrollment.classId,
      schoolId: new Types.ObjectId(currentUser.schoolId),
      isDeleted: false,
    });
    if (!classDoc) {
      throw new NotFoundError('Class record not found');
    }

    const periodId = enrollment.academicPeriodId || classDoc.academicPeriodId;
    if (!periodId) {
      throw new BadRequestError('Enrollment and class must have an academic period');
    }
    const applicableRules =
      mongoose.connection.readyState === 1
        ? await this.academicRuleRepository.findApplicableRules({
            schoolId: String(enrollment.schoolId),
            branchId: String(enrollment.branchId),
            academicYearId: String(enrollment.academicYearId),
            academicPeriodId: String(periodId),
            programId: String(enrollment.programId),
            levelId: String(enrollment.levelId),
            effectiveAt: classDoc.endDate ?? new Date(),
          })
        : [];
    const gradeRule = this.selectRule(applicableRules, 'grade_scheme');
    const attendanceRule = this.selectRule(applicableRules, 'attendance_threshold');
    const promotionRule = this.selectRule(applicableRules, 'promotion_rule');
    const assessmentRule = this.selectRule(applicableRules, 'assessment_scheme');
    const parsedGradeRule = gradeRule
      ? validateAcademicRuleConfig('grade_scheme', gradeRule.config)
      : undefined;
    const parsedAttendanceRule = attendanceRule
      ? validateAcademicRuleConfig('attendance_threshold', attendanceRule.config)
      : undefined;
    const parsedPromotionRule = promotionRule
      ? validateAcademicRuleConfig('promotion_rule', promotionRule.config)
      : undefined;
    const gradeBands =
      parsedGradeRule?.success && 'bands' in parsedGradeRule.data
        ? (
            parsedGradeRule.data.bands as Array<{
              minimum: number;
              grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
              gpa: number;
            }>
          ).sort((left, right) => right.minimum - left.minimum)
        : [
            { minimum: 90, grade: 'A' as const, gpa: 4 },
            { minimum: 80, grade: 'B' as const, gpa: 3 },
            { minimum: 70, grade: 'C' as const, gpa: 2 },
            { minimum: 60, grade: 'D' as const, gpa: 1.5 },
            { minimum: 50, grade: 'E' as const, gpa: 1 },
            { minimum: 0, grade: 'F' as const, gpa: 0 },
          ];
    const promotionConfig =
      parsedPromotionRule?.success && 'passingAverage' in parsedPromotionRule.data
        ? (parsedPromotionRule.data as {
            passingAverage: number;
            minimumAttendanceRate: number;
          })
        : undefined;
    const attendanceConfig =
      parsedAttendanceRule?.success && 'minimumAttendanceRate' in parsedAttendanceRule.data
        ? (parsedAttendanceRule.data as { minimumAttendanceRate: number })
        : undefined;
    const passingAverage = promotionConfig?.passingAverage ?? 50;
    const minimumAttendanceRate =
      promotionConfig?.minimumAttendanceRate ?? attendanceConfig?.minimumAttendanceRate ?? 70;

    // 1. Calculate Score average
    const scores = await ScoreModel.find({
      schoolId: new Types.ObjectId(currentUser.schoolId),
      classId: enrollment.classId,
      studentId: enrollment.studentId,
      academicYearId: enrollment.academicYearId,
      ...(enrollment.academicPeriodId ? { academicPeriodId: enrollment.academicPeriodId } : {}),
      isDeleted: false,
    });

    const expectedAssessments = await AssessmentModel.find({
      schoolId: new Types.ObjectId(currentUser.schoolId),
      classId: enrollment.classId,
      academicPeriodId: periodId,
      isDeleted: false,
    })
      .select('_id status')
      .lean()
      .exec();
    if (expectedAssessments.length === 0) {
      throw new ConflictError('Cannot calculate a term result without assessments');
    }
    const openAssessments = expectedAssessments.filter(
      (assessment) => assessment.status !== 'closed',
    );
    if (openAssessments.length > 0) {
      throw new ConflictError('All assessments must be closed before calculating term results');
    }
    const recordedIds = new Set(scores.map((score) => String(score.assessmentId)));
    const missingCount = expectedAssessments.filter(
      (assessment) => !recordedIds.has(String(assessment._id)),
    ).length;
    if (missingCount > 0) {
      throw new ConflictError(
        `Cannot calculate a term result because ${missingCount} assessment score(s) are missing`,
      );
    }
    const assessmentIds = scores.map((score) => score.assessmentId);
    const subjectIds = scores.map((score) => score.subjectId);
    const [assessments, subjects] = await Promise.all([
      AssessmentModel.find({
        _id: { $in: assessmentIds },
        schoolId: new Types.ObjectId(currentUser.schoolId),
        isDeleted: false,
      })
        .lean()
        .exec(),
      SubjectModel.find({
        _id: { $in: subjectIds },
        schoolId: new Types.ObjectId(currentUser.schoolId),
        isDeleted: false,
      })
        .lean()
        .exec(),
    ]);
    const assessmentById = new Map(assessments.map((item) => [String(item._id), item]));
    const subjectById = new Map(subjects.map((item) => [String(item._id), item]));

    const gradeFor = (score: number): { grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F'; gpa: number } => {
      const band = gradeBands.find((item) => score >= item.minimum) ?? gradeBands.at(-1)!;
      return { grade: band.grade, gpa: band.gpa };
    };

    const groupedScores = new Map<string, typeof scores>();
    for (const score of scores) {
      const subjectId = String(score.subjectId);
      groupedScores.set(subjectId, [...(groupedScores.get(subjectId) ?? []), score]);
    }

    const subjectResults = Array.from(groupedScores.entries()).map(([subjectId, items]) => {
      const subject = subjectById.get(subjectId);
      const snapshots = items.map((score) => {
        const assessment = assessmentById.get(String(score.assessmentId));
        return {
          assessmentId: score.assessmentId,
          code: assessment?.code ?? String(score.assessmentId),
          name: assessment?.name ?? 'Assessment',
          scoreObtained: score.scoreObtained,
          maxScore: assessment?.maxScore ?? 100,
          percentage: score.percentage,
          weightPercentage: assessment?.weightPercentage ?? 1,
          isAbsent: score.isAbsent,
        };
      });
      const totalWeight = snapshots.reduce((sum, item) => sum + item.weightPercentage, 0);
      const average =
        totalWeight > 0
          ? Math.round(
              (snapshots.reduce((sum, item) => sum + item.percentage * item.weightPercentage, 0) /
                totalWeight) *
                10,
            ) / 10
          : 0;
      return {
        subjectId: new Types.ObjectId(subjectId),
        code: subject?.code ?? subjectId,
        name: subject?.name ?? 'Subject',
        assessments: snapshots,
        total: Math.round(snapshots.reduce((sum, item) => sum + item.scoreObtained, 0) * 10) / 10,
        average,
        grade: gradeFor(average).grade,
        passed: average >= passingAverage,
      };
    });

    const totalScore =
      Math.round(subjectResults.reduce((sum, subject) => sum + subject.average, 0) * 10) / 10;
    const averageScore =
      subjectResults.length > 0 ? Math.round((totalScore / subjectResults.length) * 10) / 10 : 0;
    const { grade: letterGrade, gpa } = gradeFor(averageScore);

    // 3. Calculate Attendance Rate
    const attendanceRecords =
      mongoose.connection.readyState === 1
        ? await AttendanceRecordModel.find({
            enrollmentId: enrollment._id,
            schoolId: new Types.ObjectId(currentUser.schoolId),
            isDeleted: false,
          }).lean()
        : [];
    const attendances =
      attendanceRecords.length === 0
        ? await AttendanceModel.find({
            classId: enrollment.classId,
            schoolId: new Types.ObjectId(currentUser.schoolId),
            'records.studentId': enrollment.studentId,
            isDeleted: false,
          })
        : [];

    const attendanceSnapshot = {
      totalSessions: 0,
      present: 0,
      absent: 0,
      late: 0,
      halfDay: 0,
      excused: 0,
      permission: 0,
      rate: 100,
    };
    for (const record of attendanceRecords) {
      attendanceSnapshot.totalSessions++;
      if (record.status === 'sick') attendanceSnapshot.excused++;
      else if (record.status === 'half_day') attendanceSnapshot.halfDay++;
      else attendanceSnapshot[record.status]++;
    }
    for (const att of attendances) {
      const record = att.records.find(
        (item) => String(item.studentId) === String(enrollment.studentId),
      );
      if (!record) continue;
      attendanceSnapshot.totalSessions++;
      if (record.status === 'sick') attendanceSnapshot.excused++;
      else if (record.status === 'half_day') attendanceSnapshot.halfDay++;
      else attendanceSnapshot[record.status]++;
    }

    const attendedSessions =
      attendanceSnapshot.present +
      attendanceSnapshot.late +
      attendanceSnapshot.permission +
      attendanceSnapshot.halfDay * 0.5;
    const attendanceRate =
      attendanceSnapshot.totalSessions > 0
        ? Math.round((attendedSessions / attendanceSnapshot.totalSessions) * 100)
        : 100;
    attendanceSnapshot.rate = attendanceRate;

    // 4. Pass / Fail evaluation
    const isPassed = averageScore >= passingAverage && attendanceRate >= minimumAttendanceRate;
    const resultStatus: TermResultStatus = isPassed ? 'PASSED' : 'FAILED';

    // 5. Progression & Promotion logic
    const currentLevel = await LevelModel.findOne({
      _id: enrollment.levelId,
      schoolId: new Types.ObjectId(currentUser.schoolId),
      isDeleted: false,
    });
    let promotionStatus: PromotionStatus = 'PROMOTED';
    let nextLevelId: string | undefined;

    if (isPassed && currentLevel) {
      const nextLevel = await LevelModel.findOne({
        programId: enrollment.programId,
        sequence: currentLevel.sequence + 1,
        schoolId: new Types.ObjectId(currentUser.schoolId),
        isDeleted: false,
      });

      if (nextLevel) {
        promotionStatus = 'PROMOTED';
        nextLevelId = String(nextLevel._id);
      } else {
        promotionStatus = 'COMPLETED';
      }
    } else {
      promotionStatus = 'REPEAT';
      nextLevelId = String(enrollment.levelId);
    }

    // 6. Upsert Term Result
    const termResult = await this.repository.upsertResult(
      {
        schoolId: enrollment.schoolId,
        branchId: enrollment.branchId,
        academicYearId: enrollment.academicYearId,
        academicPeriodId: periodId,
        programId: enrollment.programId,
        levelId: enrollment.levelId,
        classId: enrollment.classId,
        studentId: enrollment.studentId,
        enrollmentId: enrollment._id as Types.ObjectId,
        totalScore,
        averageScore,
        gpa,
        letterGrade,
        attendanceRate,
        subjectResults,
        attendanceSnapshot,
        calculationPolicy: { passingAverage, minimumAttendanceRate, gpaScale: 4 },
        gradingRuleSnapshot: {
          version: gradeRule?.version ?? 1,
          source: gradeRule?.code ?? 'system-default',
          bands: gradeBands,
        },
        assessmentSchemeSnapshot: {
          version: assessmentRule?.version ?? 1,
          source: assessmentRule?.code ?? 'assessment-records',
          config: assessmentRule?.config,
          subjects: subjectResults.map((subject) => ({
            subjectId: subject.subjectId,
            assessments: subject.assessments.map((assessment) => ({
              assessmentId: assessment.assessmentId,
              weightPercentage: assessment.weightPercentage,
              maxScore: assessment.maxScore,
            })),
          })),
        },
        attendanceRuleSnapshot: {
          version: attendanceRule?.version ?? 1,
          source: attendanceRule?.code ?? 'system-default',
          minimumAttendanceRate,
          attendedStatuses: ['present', 'late', 'permission'],
        },
        promotionRuleSnapshot: {
          version: promotionRule?.version ?? 1,
          source: promotionRule?.code ?? 'system-default',
          passingAverage,
          minimumAttendanceRate,
        },
        snapshotVersion: 1,
        workflowStatus: 'CALCULATED',
        resultStatus,
        promotionStatus,
        nextLevelId: nextLevelId ? new Types.ObjectId(nextLevelId) : undefined,
      },
      currentUser.userId,
    );

    await AuditLogService.log({
      userId: currentUser.userId,
      schoolId: String(enrollment.schoolId),
      branchId: String(enrollment.branchId),
      module: 'term_result',
      action: 'UPDATE',
      entityType: 'TermResult',
      entityId: String(termResult._id),
      newValue: termResult.toObject(),
    });

    return termResult;
  }

  public async transitionWorkflow(
    id: string,
    dto: TransitionTermResultDto,
    currentUser: AuthUser,
  ): Promise<ITermResult> {
    const result = await TermResultModel.findOne({
      _id: id,
      schoolId: new Types.ObjectId(currentUser.schoolId),
      isDeleted: false,
    });
    if (!result) throw new NotFoundError('Term Result record not found');
    if (!checkBranchAccess(currentUser.branchAccess, String(result.branchId))) {
      throw new ForbiddenError('You do not have access to this term result');
    }
    const requiredAction =
      dto.status === 'SUBMITTED' ? 'submit' : dto.status === 'REVIEWED' ? 'review' : 'approve';
    this.assertWorkflowPermission(requiredAction, currentUser);
    if (result.isCompleted || result.lockedAt) {
      throw new ConflictError('Finalized term results are immutable');
    }
    const allowed: Record<string, string> = {
      CALCULATED: 'SUBMITTED',
      SUBMITTED: 'REVIEWED',
      REVIEWED: 'APPROVED',
      CORRECTED: 'SUBMITTED',
    };
    if (result.workflowStatus === dto.status) return result;
    if (allowed[result.workflowStatus ?? 'CALCULATED'] !== dto.status) {
      throw new ConflictError(
        `Cannot transition term result from ${result.workflowStatus ?? 'CALCULATED'} to ${dto.status}`,
      );
    }
    if (
      dto.status === 'REVIEWED' &&
      result.submittedBy &&
      String(result.submittedBy) === currentUser.userId
    ) {
      throw new ForbiddenError('The submitter cannot review the same term result');
    }
    if (
      dto.status === 'APPROVED' &&
      result.reviewedBy &&
      String(result.reviewedBy) === currentUser.userId
    ) {
      throw new ForbiddenError('The reviewer cannot approve the same term result');
    }
    const now = new Date();
    result.workflowStatus = dto.status;
    if (dto.status === 'SUBMITTED') {
      result.submittedAt = now;
      result.submittedBy = currentUser.userId;
    } else if (dto.status === 'REVIEWED') {
      result.reviewedAt = now;
      result.reviewedBy = currentUser.userId;
    } else {
      result.approvedAt = now;
      result.approvedBy = currentUser.userId;
    }
    result.updatedBy = currentUser.userId;
    await result.save();
    await AuditLogService.log({
      userId: currentUser.userId,
      schoolId: result.schoolId ? String(result.schoolId) : currentUser.schoolId,
      branchId: String(result.branchId),
      module: 'term_result',
      action: 'WORKFLOW_TRANSITION',
      entityType: 'TermResult',
      entityId: String(result._id),
      reason: dto.reason,
      newValue: { workflowStatus: dto.status },
    });
    return result;
  }

  public async calculateClassTermResults(
    classId: string,
    currentUser: AuthUser,
  ): Promise<{ calculatedCount: number }> {
    const classDoc = await ClassModel.findOne({
      _id: classId,
      schoolId: new Types.ObjectId(currentUser.schoolId),
      isDeleted: false,
    });
    if (!classDoc) {
      throw new NotFoundError('Class not found');
    }
    if (!checkBranchAccess(currentUser.branchAccess, String(classDoc.branchId))) {
      throw new ForbiddenError('You do not have access to calculate results for this class');
    }

    const enrollments = await EnrollmentModel.find({
      classId,
      schoolId: new Types.ObjectId(currentUser.schoolId),
      status: { $in: ['enrolled', 'active'] },
      isDeleted: false,
    });

    let calculatedCount = 0;
    for (const enr of enrollments) {
      await this.calculateStudentTermResult(String(enr._id), currentUser);
      calculatedCount++;
    }

    return { calculatedCount };
  }

  public async completeTerm(dto: CompleteTermDto, currentUser: AuthUser): Promise<ITermResult> {
    const termResult = await TermResultModel.findOne({
      _id: dto.termResultId,
      schoolId: new Types.ObjectId(currentUser.schoolId),
      isDeleted: false,
    });
    if (!termResult) {
      throw new NotFoundError('Term Result record not found');
    }

    if (!checkBranchAccess(currentUser.branchAccess, String(termResult.branchId))) {
      throw new ForbiddenError('You do not have access to complete this term result');
    }
    this.assertWorkflowPermission('finalize', currentUser);

    if (termResult.isCompleted) {
      throw new BadRequestError('This Term Result has already been completed and processed');
    }
    if (termResult.workflowStatus && termResult.workflowStatus !== 'APPROVED') {
      throw new ConflictError('Term result must be approved before it can be finalized');
    }

    if (Boolean(dto.nextPeriodId) !== Boolean(dto.nextClassId)) {
      throw new BadRequestError('nextPeriodId and nextClassId must be provided together');
    }

    const currentEnrollment = await EnrollmentModel.findOne({
      _id: termResult.enrollmentId,
      schoolId: new Types.ObjectId(currentUser.schoolId),
      isDeleted: false,
    });
    if (!currentEnrollment) {
      throw new NotFoundError('Current enrollment for this term result no longer exists');
    }
    if (!['enrolled', 'active'].includes(currentEnrollment.status)) {
      throw new ConflictError(
        `Current enrollment is ${currentEnrollment.status} and cannot be completed again`,
      );
    }

    let nextEnrollmentData: Record<string, unknown> | undefined;
    let nextClassCapacity: ClassCapacityContext | undefined;

    // 2. If next period and next class are provided, generate next period enrollment
    if (dto.nextPeriodId && dto.nextClassId) {
      if (termResult.promotionStatus === 'COMPLETED') {
        throw new BadRequestError(
          'A completed final level cannot be auto-enrolled to another class',
        );
      }
      const nextPeriod = await AcademicPeriodModel.findOne({
        _id: dto.nextPeriodId,
        schoolId: new Types.ObjectId(currentUser.schoolId),
        isDeleted: false,
      });
      const nextClass = await ClassModel.findOne({
        _id: dto.nextClassId,
        schoolId: new Types.ObjectId(currentUser.schoolId),
        isDeleted: false,
      });

      if (!nextPeriod || !nextClass) {
        throw new BadRequestError('Invalid next Period or Class selected for re-enrollment');
      }

      if (!checkBranchAccess(currentUser.branchAccess, String(nextClass.branchId))) {
        throw new ForbiddenError('You do not have access to the selected next class branch');
      }
      if (String(nextClass.branchId) !== String(termResult.branchId)) {
        throw new BadRequestError(
          'Term completion cannot move a student across branches; use the transfer workflow',
        );
      }
      if (
        String(nextClass.academicPeriodId) !== String(nextPeriod._id) ||
        String(nextClass.programId) !== String(termResult.programId) ||
        String(nextClass.academicYearId) !== String(nextPeriod.academicYearId)
      ) {
        throw new BadRequestError(
          'Next class must match the selected academic period and current program',
        );
      }
      const expectedLevelId = termResult.nextLevelId ?? termResult.levelId;
      if (String(nextClass.levelId) !== String(expectedLevelId)) {
        throw new BadRequestError('Next class does not match the promotion/repeat level');
      }

      const duplicateEnrollment = await EnrollmentModel.exists({
        studentId: termResult.studentId,
        academicPeriodId: nextPeriod._id,
        classId: nextClass._id,
        status: { $in: ['enrolled', 'active'] },
        isDeleted: false,
      });
      if (duplicateEnrollment) {
        throw new ConflictError('Student already has an active enrollment in the next class');
      }

      nextEnrollmentData = {
        studentId: termResult.studentId,
        schoolId: termResult.schoolId || nextClass.schoolId,
        branchId: nextClass.branchId,
        academicYearId: nextPeriod.academicYearId,
        academicPeriodId: nextPeriod._id,
        programId: nextClass.programId,
        levelId: nextClass.levelId,
        classId: nextClass._id,
        enrollmentDate: new Date(),
        status: 'enrolled',
        studyModeId: currentEnrollment.studyModeId,
        attemptNumber: (currentEnrollment.attemptNumber ?? 1) + 1,
        previousEnrollmentId: currentEnrollment._id,
        tuitionStatus: 'pending',
        remarks: `Auto-enrolled from term completion (${termResult.promotionStatus})`,
        createdBy: currentUser.userId,
        updatedBy: currentUser.userId,
      };
      nextClassCapacity = {
        classId: nextClass._id,
        className: nextClass.className,
        capacity: nextClass.capacity,
        schoolId: nextClass.schoolId,
        branchId: nextClass.branchId,
      };
    }

    return runInTransaction(async (session) => {
      let nextEnrollmentId: string | undefined;
      if (nextEnrollmentData) {
        if (nextClassCapacity) {
          await reserveClassSeat(nextClassCapacity, session);
        }
        const enrollmentCode = await SequenceService.getNextSequence('ENR', 'ENR', 6, session);
        const data = { ...nextEnrollmentData, enrollmentCode };
        const rawCreated = session
          ? await EnrollmentModel.create([data], { session })
          : await EnrollmentModel.create(data);
        const newEnrollment = Array.isArray(rawCreated) ? rawCreated[0] : rawCreated;
        if (!newEnrollment) throw new Error('Next enrollment was not created');
        nextEnrollmentId = String(newEnrollment._id);
      }

      const completedEnrollmentStatus =
        termResult.promotionStatus === 'PROMOTED'
          ? 'promoted'
          : termResult.promotionStatus === 'REPEAT'
            ? 'repeated'
            : 'completed';
      const enrollmentUpdate = await EnrollmentModel.updateOne(
        { _id: termResult.enrollmentId, isDeleted: false, status: currentEnrollment.status },
        {
          $set: {
            status: completedEnrollmentStatus,
            completionReason: completedEnrollmentStatus,
            endDate: new Date(),
            updatedBy: currentUser.userId,
          },
        },
        session ? { session } : undefined,
      );
      if (enrollmentUpdate.matchedCount === 0) {
        throw new ConflictError('Current enrollment changed while term completion was processing');
      }
      await reconcileClassEnrollmentCount(currentEnrollment.classId, session);

      termResult.isCompleted = true;
      termResult.completionDate = new Date();
      termResult.workflowStatus = 'FINALIZED';
      termResult.finalizedAt = termResult.completionDate;
      termResult.finalizedBy = currentUser.userId;
      termResult.lockedAt = termResult.completionDate;
      termResult.lockedBy = currentUser.userId;
      if (dto.nextPeriodId) termResult.nextPeriodId = new Types.ObjectId(dto.nextPeriodId);
      if (nextEnrollmentId) termResult.nextEnrollmentId = new Types.ObjectId(nextEnrollmentId);
      if (dto.remarks) termResult.remarks = dto.remarks;
      termResult.updatedBy = currentUser.userId;
      await termResult.save(session ? { session } : undefined);

      const decision =
        termResult.promotionStatus === 'PROMOTED'
          ? 'promoted'
          : termResult.promotionStatus === 'REPEAT'
            ? 'repeated'
            : termResult.promotionStatus === 'CONTINUE'
              ? 'continued'
              : 'completed';
      const promotionData = {
        studentId: termResult.studentId,
        schoolId: termResult.schoolId ?? currentEnrollment.schoolId,
        branchId: termResult.branchId,
        academicYearId: termResult.academicYearId,
        academicPeriodId: termResult.academicPeriodId,
        termResultId: termResult._id,
        fromEnrollmentId: currentEnrollment._id,
        toEnrollmentId: nextEnrollmentId ? new Types.ObjectId(nextEnrollmentId) : undefined,
        fromLevelId: termResult.levelId,
        toLevelId: termResult.nextLevelId,
        decision,
        decisionReason: dto.remarks,
        processedBy: currentUser.userId,
        processedAt: termResult.completionDate,
        isDeleted: false,
      } as const;
      if (session) await PromotionModel.create([promotionData], { session });
      else await PromotionModel.create(promotionData);

      await AuditLogService.log({
        userId: currentUser.userId,
        schoolId: termResult.schoolId ? String(termResult.schoolId) : currentUser.schoolId,
        branchId: String(termResult.branchId),
        module: 'term_result',
        action: 'UPDATE',
        entityType: 'TermResult',
        entityId: String(termResult._id),
        newValue: {
          isCompleted: true,
          completionDate: termResult.completionDate,
          nextPeriodId: termResult.nextPeriodId,
          nextEnrollmentId: termResult.nextEnrollmentId,
        },
        reason: dto.remarks,
        session,
        required: true,
      });
      return termResult;
    });
  }
}
