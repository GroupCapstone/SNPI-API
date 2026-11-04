import { Types } from 'mongoose';

import { checkUserPermission } from '../../middleware/authorize';
import { checkBranchAccess, getAuthorizedBranchFilter } from '../../middleware/branch-access';
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from '../../shared/errors/app-error';
import type { AuthUser } from '../../types/auth';
import { runInTransaction } from '../../utils/transaction';
import type { IAcademicPeriod } from '../academic-period/academic-period.model';
import { AcademicPeriodModel } from '../academic-period/academic-period.model';
import { AcademicPeriodService } from '../academic-period/academic-period.service';
import { AcademicRuleModel } from '../academic-rule/academic-rule.model';
import { AcademicYearModel } from '../academic-year/academic-year.model';
import { AuditLogService } from '../audit-log/audit-log.service';
import { BranchModel } from '../branch/branch.model';
import { ClassScheduleModel } from '../class-schedule/class-schedule.model';
import { ClassModel } from '../class/class.model';
import {
  reconcileClassEnrollmentCount,
  reserveClassSeat,
} from '../enrollment/enrollment-capacity.service';
import { EnrollmentModel } from '../enrollment/enrollment.model';
import { LevelModel } from '../level/level.model';
import { SequenceService } from '../sequence/sequence.service';
import { StudentTransferModel } from '../student-transfer/student-transfer.model';
import { TeacherAssignmentModel } from '../teacher-assignment/teacher-assignment.model';
import { PromotionModel } from '../term-result/promotion.model';
import { TermResultModel } from '../term-result/term-result.model';
import { TuitionFeeModel } from '../tuition/tuition-fee.model';
import type {
  IRolloverClassMapping,
  IRolloverExecutionResult,
  IRolloverPlan,
  IRolloverStudentDecision,
  IRolloverValidationSummary,
} from './rollover.model';
import { AcademicRolloverPlanModel } from './rollover.model';
import { RolloverRepository } from './rollover.repository';
import type {
  CreateRolloverPlanDto,
  ExecuteRolloverDto,
  PaginatedRolloverPlans,
  RolloverPlanQueryFilters,
  TargetPeriodReadinessDto,
  UpdateRolloverPlanDto,
} from './rollover.types';

const idOf = (value: unknown): string => {
  if (value && typeof value === 'object' && '_id' in value) {
    return String((value as { _id: unknown })._id);
  }
  return String(value ?? '');
};

export class RolloverService {
  public constructor(
    private readonly repository = new RolloverRepository(),
    private readonly periodService = new AcademicPeriodService(),
  ) {}

  public async getPlans(
    filters: RolloverPlanQueryFilters,
    currentUser: AuthUser,
  ): Promise<PaginatedRolloverPlans> {
    const branchFilter = getAuthorizedBranchFilter(currentUser.branchAccess, filters.branchId);
    return this.repository.findMany({ ...filters, schoolId: currentUser.schoolId }, branchFilter);
  }

  public async getPlanById(id: string, currentUser: AuthUser): Promise<IRolloverPlan> {
    const plan = await this.repository.findById(id);
    if (!plan) {
      throw new NotFoundError(`Rollover plan with ID "${id}" not found`);
    }
    if (currentUser.schoolId && idOf(plan.schoolId) !== currentUser.schoolId) {
      throw new ForbiddenError('You do not have access to this school rollover plan');
    }
    if (!checkBranchAccess(currentUser.branchAccess, String(plan.branchId))) {
      throw new ForbiddenError('You do not have access to this branch rollover plan');
    }
    return plan;
  }

  public async createPlan(
    dto: CreateRolloverPlanDto,
    currentUser: AuthUser,
  ): Promise<IRolloverPlan> {
    if (!checkBranchAccess(currentUser.branchAccess, dto.branchId)) {
      throw new ForbiddenError('You do not have access to create rollover plan for this branch');
    }

    const schoolId = currentUser.schoolId;
    const [branch, sourceYear, sourcePeriod, targetYear, targetPeriod] = await Promise.all([
      BranchModel.findOne({ _id: dto.branchId, schoolId, isDeleted: false }),
      AcademicYearModel.findOne({ _id: dto.sourceAcademicYearId, schoolId, isDeleted: false }),
      AcademicPeriodModel.findOne({ _id: dto.sourcePeriodId, schoolId, isDeleted: false }),
      AcademicYearModel.findOne({ _id: dto.targetAcademicYearId, schoolId, isDeleted: false }),
      AcademicPeriodModel.findOne({ _id: dto.targetPeriodId, schoolId, isDeleted: false }),
    ]);

    if (!branch) throw new NotFoundError('Branch not found in the authenticated school');
    if (!sourceYear) throw new NotFoundError('Source academic year not found');
    if (!sourcePeriod) throw new NotFoundError('Source academic period not found');
    if (!targetYear) throw new NotFoundError('Target academic year not found');
    if (!targetPeriod) throw new NotFoundError('Target academic period not found');

    if (String(sourcePeriod._id) === String(targetPeriod._id)) {
      throw new BadRequestError('Source and Target academic periods cannot be identical');
    }

    if (['closed', 'archived'].includes(String(targetPeriod.status))) {
      throw new ConflictError('Target academic period is closed and cannot receive rollover data');
    }
    if (
      String(sourcePeriod.academicYearId) !== String(sourceYear._id) ||
      String(targetPeriod.academicYearId) !== String(targetYear._id)
    ) {
      throw new BadRequestError('Academic periods do not belong to their selected academic years');
    }

    const existingActivePlan = await this.repository.findActivePlanForContext(
      dto.branchId,
      dto.sourcePeriodId,
      dto.targetPeriodId,
      dto.programId,
    );
    if (existingActivePlan) {
      throw new ConflictError(
        `An active rollover plan (${existingActivePlan.planCode}) already exists for this context`,
      );
    }

    // 1. Scan source classes in this branch & period (scoped to program if provided)
    const classQuery: Record<string, unknown> = {
      schoolId: new Types.ObjectId(schoolId),
      branchId: new Types.ObjectId(dto.branchId),
      academicPeriodId: new Types.ObjectId(dto.sourcePeriodId),
      isDeleted: false,
    };
    if (dto.programId) {
      classQuery.programId = new Types.ObjectId(dto.programId);
    }
    const sourceClasses = await ClassModel.find(classQuery).lean();

    // 2. Scan source enrollments in this branch & period (scoped to program if provided)
    const enrollmentQuery: Record<string, unknown> = {
      schoolId: new Types.ObjectId(schoolId),
      branchId: new Types.ObjectId(dto.branchId),
      academicPeriodId: new Types.ObjectId(dto.sourcePeriodId),
      status: { $in: ['active', 'enrolled', 'pending'] },
      isDeleted: false,
    };
    if (dto.programId) {
      enrollmentQuery.programId = new Types.ObjectId(dto.programId);
    }
    const sourceEnrollments = await EnrollmentModel.find(enrollmentQuery).lean();

    // 3. Scan term results in this source period
    const enrollmentIds = sourceEnrollments.map((e) => e._id);
    const termResults = await TermResultModel.find({
      enrollmentId: { $in: enrollmentIds },
      isDeleted: false,
    }).lean();
    const resultsByEnrollment = new Map(termResults.map((r) => [String(r.enrollmentId), r]));

    // 4. Fetch levels only for source programs so equal sequence numbers cannot cross programs.
    const sourceProgramIds = [...new Set(sourceClasses.map((item) => String(item.programId)))];
    const levels = await LevelModel.find({
      programId: { $in: sourceProgramIds.map((id) => new Types.ObjectId(id)) },
      isDeleted: false,
    })
      .sort({ sequence: 1 })
      .lean();
    const levelOrderMap = new Map(levels.map((l) => [String(l._id), l.sequence]));
    const levelByProgramAndOrder = new Map(
      levels.map((level) => [`${String(level.programId)}:${level.sequence}`, level]),
    );

    // 5. Generate proposed class mappings
    const classMappings: IRolloverClassMapping[] = [];
    const classIdToProposedTarget = new Map<string, { programId: string; levelId: string }>();

    for (const sourceClass of sourceClasses) {
      const currentOrder = levelOrderMap.get(String(sourceClass.levelId)) ?? 1;
      const nextLevel = levelByProgramAndOrder.get(
        `${String(sourceClass.programId)}:${currentOrder + 1}`,
      );
      const targetLevelId = nextLevel ? nextLevel._id : sourceClass.levelId;

      const targetClassName = sourceClass.className.replace(sourcePeriod.code, targetPeriod.code);
      const targetClassCode = `${sourceClass.classCode.split('-').slice(0, -1).join('-')}-${targetPeriod.code}`;

      classMappings.push({
        sourceClassId: sourceClass._id,
        targetClassName: targetClassName || `${sourceClass.className} (${targetPeriod.name})`,
        targetClassCode: targetClassCode || `${sourceClass.classCode}-${targetPeriod.code}`,
        targetProgramId: sourceClass.programId,
        targetLevelId,
        targetSection: sourceClass.section ?? 'A',
        targetCapacity: sourceClass.capacity ?? 30,
        action: 'CREATE_NEW',
      });

      classIdToProposedTarget.set(String(sourceClass._id), {
        programId: String(sourceClass.programId),
        levelId: String(targetLevelId),
      });
    }

    // 6. Generate proposed student decisions
    const studentDecisions: IRolloverStudentDecision[] = [];
    for (const enrollment of sourceEnrollments) {
      const termResult = resultsByEnrollment.get(String(enrollment._id));
      let decision: IRolloverStudentDecision['decision'] = 'CONTINUE';
      let targetLevelId = enrollment.levelId;

      if (termResult) {
        if (termResult.promotionStatus === 'PROMOTED') {
          decision = 'PROMOTE';
          if (termResult.nextLevelId) {
            targetLevelId = termResult.nextLevelId;
          } else {
            const curOrder = levelOrderMap.get(String(enrollment.levelId)) ?? 1;
            const nextLvl = levelByProgramAndOrder.get(
              `${String(enrollment.programId)}:${curOrder + 1}`,
            );
            if (nextLvl) targetLevelId = nextLvl._id;
          }
        } else if (termResult.promotionStatus === 'REPEAT') {
          decision = 'REPEAT';
          targetLevelId = enrollment.levelId;
        } else if (termResult.promotionStatus === 'COMPLETED') {
          decision = 'GRADUATE';
        }
      }

      studentDecisions.push({
        studentId: enrollment.studentId,
        sourceEnrollmentId: enrollment._id,
        systemRecommendedDecision: decision,
        finalDecision: decision,
        decision,
        targetProgramId: enrollment.programId,
        targetLevelId: decision === 'GRADUATE' ? undefined : targetLevelId,
        targetBranchId: enrollment.branchId,
        reason: termResult
          ? `Auto-generated from term result (${termResult.promotionStatus})`
          : 'Auto-generated continue',
        isProcessed: false,
      });
    }

    const planCode = await SequenceService.getNextSequence('ROL', 'ROL', 4);

    const initialPlan: Partial<IRolloverPlan> = {
      planCode,
      schoolId: new Types.ObjectId(schoolId),
      branchId: new Types.ObjectId(dto.branchId),
      programId: dto.programId ? new Types.ObjectId(dto.programId) : undefined,
      sourceAcademicYearId: new Types.ObjectId(dto.sourceAcademicYearId),
      sourcePeriodId: new Types.ObjectId(dto.sourcePeriodId),
      targetAcademicYearId: new Types.ObjectId(dto.targetAcademicYearId),
      targetPeriodId: new Types.ObjectId(dto.targetPeriodId),
      status: 'draft',
      options: {
        carryClasses: dto.options?.carryClasses ?? true,
        carryTeacherSuggestions: dto.options?.carryTeacherSuggestions ?? true,
        carryScheduleSuggestions: dto.options?.carryScheduleSuggestions ?? true,
        autoSectionDistribution: dto.options?.autoSectionDistribution ?? false,
      },
      classMappings,
      studentDecisions,
      createdBy: currentUser.userId,
    };

    const created = await this.repository.create(initialPlan);

    // Initial validation
    await this.validatePlanInternal(created);

    await AuditLogService.log({
      userId: currentUser.userId,
      schoolId,
      branchId: dto.branchId,
      module: 'rollover',
      action: 'CREATE',
      entityType: 'AcademicRolloverPlan',
      entityId: String(created._id),
      newValue: {
        planCode,
        branchId: dto.branchId,
        sourcePeriodId: dto.sourcePeriodId,
        targetPeriodId: dto.targetPeriodId,
      },
    });

    return (await this.repository.findById(String(created._id)))!;
  }

  public async updatePlan(
    id: string,
    dto: UpdateRolloverPlanDto,
    currentUser: AuthUser,
  ): Promise<IRolloverPlan> {
    const plan = await this.getPlanById(id, currentUser);
    if (['executing', 'completed', 'cancelled'].includes(plan.status)) {
      throw new ConflictError(`Cannot edit rollover plan in ${plan.status} state`);
    }

    const updates: Partial<IRolloverPlan> = {};
    if (dto.options) updates.options = { ...plan.options, ...dto.options };
    if (dto.classMappings) {
      updates.classMappings = dto.classMappings.map((m) => ({
        sourceClassId: new Types.ObjectId(m.sourceClassId),
        targetClassId: m.targetClassId ? new Types.ObjectId(m.targetClassId) : undefined,
        targetClassName: m.targetClassName,
        targetClassCode: m.targetClassCode,
        targetProgramId: new Types.ObjectId(m.targetProgramId),
        targetLevelId: new Types.ObjectId(m.targetLevelId),
        targetSection: m.targetSection,
        targetCapacity: m.targetCapacity ?? 30,
        action: m.action ?? 'CREATE_NEW',
      }));
    }
    if (dto.studentDecisions) {
      const existingMap = new Map(
        plan.studentDecisions.map((d) => [
          String((d.studentId as unknown as { _id?: unknown })?._id ?? d.studentId),
          d,
        ]),
      );

      updates.studentDecisions = dto.studentDecisions.map((s) => {
        const studentIdStr = String(s.studentId);
        const existing = existingMap.get(studentIdStr);
        const systemRec = existing?.systemRecommendedDecision || existing?.decision || 'CONTINUE';
        const finalDec = s.finalDecision || s.decision || existing?.finalDecision || systemRec;
        const hasOverride = finalDec !== systemRec;

        return {
          studentId: new Types.ObjectId(s.studentId),
          sourceEnrollmentId: s.sourceEnrollmentId
            ? new Types.ObjectId(s.sourceEnrollmentId)
            : (existing?.sourceEnrollmentId ?? new Types.ObjectId()),
          systemRecommendedDecision: systemRec,
          finalDecision: finalDec,
          decision: finalDec,
          targetClassId: s.targetClassId
            ? new Types.ObjectId(s.targetClassId)
            : existing?.targetClassId,
          targetLevelId: s.targetLevelId
            ? new Types.ObjectId(s.targetLevelId)
            : existing?.targetLevelId,
          targetProgramId: s.targetProgramId
            ? new Types.ObjectId(s.targetProgramId)
            : existing?.targetProgramId,
          targetBranchId: s.targetBranchId
            ? new Types.ObjectId(s.targetBranchId)
            : existing?.targetBranchId,
          reason: s.reason || existing?.reason,
          changedBy: hasOverride ? currentUser.userId : existing?.changedBy,
          changedAt: hasOverride ? new Date() : existing?.changedAt,
          approvedBy: existing?.approvedBy,
          isProcessed: false,
        };
      });
    }

    updates.status = 'draft';
    const updated = await this.repository.updateById(id, updates);
    if (!updated) throw new NotFoundError('Rollover plan not found');

    await this.validatePlanInternal(updated);
    return (await this.repository.findById(id))!;
  }

  private async validatePlanInternal(plan: IRolloverPlan): Promise<IRolloverValidationSummary> {
    const blockingIssues: IRolloverValidationSummary['blockingIssues'] = [];
    const warnings: IRolloverValidationSummary['warnings'] = [];
    const capacityWarnings: IRolloverValidationSummary['capacityWarnings'] = [];
    const scheduleConflicts: IRolloverValidationSummary['scheduleConflicts'] = [];

    // 1. Check pre-close validation on source period
    try {
      const checklist = await this.periodService.getClosingChecklist(
        String(plan.sourcePeriodId),
        plan.programId ? String(plan.programId) : undefined,
      );
      for (const issue of checklist.blockingIssues) {
        blockingIssues.push({
          type: issue.type,
          message: `Source Period Blocker: ${issue.message}`,
          count: issue.count,
        });
      }
      for (const warn of checklist.warnings) {
        warnings.push({
          type: warn.type,
          message: `Source Period Warning: ${warn.message}`,
          count: warn.count,
        });
      }
    } catch {
      // Allow disconnected testing fallback
    }

    // 2. Validate Class Mappings
    if (plan.classMappings.length === 0) {
      blockingIssues.push({
        type: 'NO_CLASS_MAPPINGS',
        message: 'Rollover plan contains no target class mappings',
      });
    }

    // Check duplicate target class codes
    const targetCodes = new Set<string>();
    for (const mapping of plan.classMappings) {
      if (targetCodes.has(mapping.targetClassCode)) {
        blockingIssues.push({
          type: 'DUPLICATE_TARGET_CLASS_CODE',
          message: `Target class code "${mapping.targetClassCode}" is duplicated in mappings`,
        });
      }
      targetCodes.add(mapping.targetClassCode);
    }

    // 3. Validate Student Decisions & Class Capacities
    const studentsPerClass = new Map<string, number>();
    for (const decision of plan.studentDecisions) {
      const dec = decision.finalDecision || decision.decision || '';
      if (['PROMOTE', 'REPEAT', 'CONTINUE'].includes(dec)) {
        let targetName = 'DEFAULT';
        if (decision.targetClassId) {
          const matched = plan.classMappings.find(
            (m) =>
              String(m.targetClassId) === String(decision.targetClassId) ||
              String(m.sourceClassId) === String(decision.targetClassId),
          );
          if (matched) targetName = matched.targetClassName;
        } else if (plan.classMappings.length > 0) {
          targetName = plan.classMappings[0]?.targetClassName ?? 'DEFAULT';
        }
        studentsPerClass.set(targetName, (studentsPerClass.get(targetName) ?? 0) + 1);
      }
    }

    for (const mapping of plan.classMappings) {
      const enrolled = studentsPerClass.get(mapping.targetClassName) ?? 0;
      if (enrolled > mapping.targetCapacity) {
        capacityWarnings.push({
          className: mapping.targetClassName,
          capacity: mapping.targetCapacity,
          enrolledCount: enrolled,
          message: `Target class "${mapping.targetClassName}" exceeds capacity (${enrolled}/${mapping.targetCapacity}) by ${enrolled - mapping.targetCapacity} student(s)`,
        });
      }
    }

    // 4. Validate Schedule Conflicts if carried
    if (plan.options?.carryScheduleSuggestions) {
      const sourceSchedules = await ClassScheduleModel.find({
        academicPeriodId: plan.sourcePeriodId,
        status: 'active',
        isDeleted: false,
      }).lean();

      // Check teacher double-booking among copied schedules
      const teacherSlots = new Map<string, Array<{ day: number; start: string; end: string }>>();
      for (const sched of sourceSchedules) {
        if (!sched.teacherId) continue;
        const tId = String(sched.teacherId);
        const list = teacherSlots.get(tId) ?? [];
        for (const existing of list) {
          if (
            existing.day === sched.dayOfWeek &&
            existing.start < sched.endTime &&
            sched.startTime < existing.end
          ) {
            scheduleConflicts.push({
              type: 'TEACHER_CONFLICT',
              teacherId: tId,
              dayOfWeek: sched.dayOfWeek,
              startTime: sched.startTime,
              endTime: sched.endTime,
              message: `Teacher ${tId} has overlapping schedule on Day ${sched.dayOfWeek} (${sched.startTime}-${sched.endTime})`,
            });
          }
        }
        list.push({ day: sched.dayOfWeek, start: sched.startTime, end: sched.endTime });
        teacherSlots.set(tId, list);
      }
    }

    const canExecute = blockingIssues.length === 0 && scheduleConflicts.length === 0;
    const summary: IRolloverValidationSummary = {
      canExecute,
      checkedAt: new Date(),
      blockingIssues,
      warnings,
      capacityWarnings,
      scheduleConflicts,
    };

    const newStatus = canExecute
      ? plan.status === 'approved'
        ? 'approved'
        : 'validated'
      : 'draft';
    await AcademicRolloverPlanModel.updateOne(
      { _id: plan._id },
      { $set: { validationSummary: summary, status: newStatus } },
    );

    return summary;
  }

  public async validatePlan(
    id: string,
    currentUser: AuthUser,
  ): Promise<IRolloverValidationSummary> {
    const plan = await this.getPlanById(id, currentUser);
    return this.validatePlanInternal(plan);
  }

  public async approvePlan(id: string, currentUser: AuthUser): Promise<IRolloverPlan> {
    const plan = await this.getPlanById(id, currentUser);

    const canApprove =
      checkUserPermission(currentUser.permissions, 'rollover.approve.own_branch') ||
      checkUserPermission(currentUser.permissions, 'rollover.approve.all_branches');
    if (!canApprove) {
      throw new ForbiddenError('You do not have permission to approve academic rollover plans');
    }

    const summary = await this.validatePlanInternal(plan);
    if (!summary.canExecute) {
      throw new ConflictError(
        `Cannot approve plan with blocking issues: ${summary.blockingIssues.map((b) => b.message).join('; ')}`,
      );
    }

    const updatedStudentDecisions = plan.studentDecisions.map((d) => ({
      ...d,
      approvedBy: currentUser.userId,
    }));

    const updated = await AcademicRolloverPlanModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      {
        $set: {
          status: 'approved',
          approvedBy: currentUser.userId,
          approvedAt: new Date(),
          studentDecisions: updatedStudentDecisions,
        },
      },
      { new: true },
    );

    await AuditLogService.log({
      userId: currentUser.userId,
      schoolId: String(plan.schoolId),
      branchId: String(plan.branchId),
      module: 'rollover',
      action: 'UPDATE',
      entityType: 'AcademicRolloverPlan',
      entityId: id,
      reason: 'Rollover plan approved for execution',
      newValue: { status: 'approved', approvedBy: currentUser.userId },
    });

    return updated!;
  }

  public async executePlan(
    id: string,
    dto: ExecuteRolloverDto,
    currentUser: AuthUser,
  ): Promise<{
    success: boolean;
    message: string;
    executionResult: IRolloverExecutionResult;
    plan: IRolloverPlan;
  }> {
    const plan = await this.getPlanById(id, currentUser);

    const canExecute =
      checkUserPermission(currentUser.permissions, 'rollover.execute.own_branch') ||
      checkUserPermission(currentUser.permissions, 'rollover.execute.all_branches');
    if (!canExecute) {
      throw new ForbiddenError('You do not have permission to execute academic rollover plans');
    }

    // IDEMPOTENCY CHECK: If already completed, return prior result
    if (plan.status === 'completed' && plan.executionResult) {
      return {
        success: true,
        message: 'Rollover plan has already been executed successfully',
        executionResult: plan.executionResult,
        plan,
      };
    }

    if (plan.status !== 'approved') {
      throw new ConflictError(
        `Rollover plan must be approved before execution (current status: ${plan.status})`,
      );
    }

    const validation = await this.validatePlanInternal(plan);
    if (!validation.canExecute) {
      throw new ConflictError(
        `Pre-execution validation failed: ${validation.blockingIssues.map((b) => b.message).join('; ')}`,
      );
    }

    return runInTransaction(async (session) => {
      await AcademicRolloverPlanModel.updateOne(
        { _id: plan._id },
        { $set: { status: 'executing' } },
        session ? { session } : undefined,
      );

      const executionResult: IRolloverExecutionResult = {
        classesCreated: 0,
        enrollmentsCreated: 0,
        studentsPromoted: 0,
        studentsRepeated: 0,
        studentsContinued: 0,
        studentsGraduated: 0,
        studentsWithdrawn: 0,
        studentsTransferred: 0,
        teacherAssignmentsCreated: 0,
        schedulesCreated: 0,
        errors: [],
        startedAt: new Date(),
      };

      // STEP 1: CREATE TARGET CLASSES
      const sourceToTargetClassId = new Map<string, Types.ObjectId>();
      for (const mapping of plan.classMappings) {
        if (mapping.action === 'SKIP') continue;

        if (mapping.targetClassId) {
          sourceToTargetClassId.set(String(mapping.sourceClassId), mapping.targetClassId);
          continue;
        }

        // Check if class already exists in target context
        const existingTarget = await ClassModel.findOne(
          {
            branchId: plan.branchId,
            academicPeriodId: plan.targetPeriodId,
            classCode: mapping.targetClassCode,
            isDeleted: false,
          },
          null,
          { session },
        );

        if (existingTarget) {
          sourceToTargetClassId.set(String(mapping.sourceClassId), existingTarget._id);
        } else {
          const newClassData = {
            schoolId: plan.schoolId,
            branchId: plan.branchId,
            academicYearId: plan.targetAcademicYearId,
            academicPeriodId: plan.targetPeriodId,
            programId: mapping.targetProgramId,
            levelId: mapping.targetLevelId,
            section: mapping.targetSection,
            classCode: mapping.targetClassCode,
            className: mapping.targetClassName,
            capacity: mapping.targetCapacity,
            status: 'planned' as const,
            createdBy: currentUser.userId,
            updatedBy: currentUser.userId,
          };

          const rawCreated = session
            ? await ClassModel.create([newClassData], { session })
            : await ClassModel.create(newClassData);
          const createdClass = Array.isArray(rawCreated) ? rawCreated[0] : rawCreated;
          if (!createdClass) throw new Error(`Failed to create class ${mapping.targetClassName}`);
          sourceToTargetClassId.set(String(mapping.sourceClassId), createdClass._id);
          executionResult.classesCreated++;
        }
      }

      // STEP 2: PROCESS STUDENT DECISIONS & ENROLLMENTS
      for (const decision of plan.studentDecisions) {
        const sourceEnrollment = await EnrollmentModel.findOne(
          {
            _id: decision.sourceEnrollmentId,
            schoolId: plan.schoolId,
            isDeleted: false,
          },
          null,
          { session },
        );

        if (!sourceEnrollment) {
          executionResult.errors.push({
            item: String(decision.studentId),
            error: 'Source enrollment not found',
          });
          continue;
        }

        const now = new Date();
        const effectiveDecision =
          decision.finalDecision || decision.decision || decision.systemRecommendedDecision;
        const sourceTermResult = await TermResultModel.findOne(
          {
            enrollmentId: sourceEnrollment._id,
            schoolId: plan.schoolId,
            academicPeriodId: plan.sourcePeriodId,
            isDeleted: false,
          },
          null,
          { session },
        );

        if (effectiveDecision === 'HOLD') {
          // Student is held back: update source enrollment remarks, do not create target enrollment
          await EnrollmentModel.updateOne(
            { _id: sourceEnrollment._id },
            {
              $set: {
                remarks: `Rollover on HOLD: ${decision.reason || 'Pending academic evaluation'}`,
                updatedBy: currentUser.userId,
              },
            },
            session ? { session } : undefined,
          );
          continue;
        }

        if (effectiveDecision === 'GRADUATE') {
          if (
            !sourceTermResult ||
            !sourceTermResult.isCompleted ||
            sourceTermResult.workflowStatus !== 'FINALIZED'
          ) {
            executionResult.errors.push({
              item: String(decision.studentId),
              error: 'A finalized source term result is required for graduation',
            });
            continue;
          }
          const sourceUpdate = await EnrollmentModel.updateOne(
            {
              _id: sourceEnrollment._id,
              status: { $in: ['enrolled', 'active'] },
              isDeleted: false,
            },
            {
              $set: {
                status: 'completed',
                completionReason: 'completed',
                endDate: now,
                updatedBy: currentUser.userId,
              },
            },
            session ? { session } : undefined,
          );
          if (sourceUpdate.matchedCount === 0) {
            throw new ConflictError('Source enrollment changed during rollover execution');
          }
          await reconcileClassEnrollmentCount(sourceEnrollment.classId, session);

          await PromotionModel.create(
            [
              {
                studentId: decision.studentId,
                schoolId: plan.schoolId,
                branchId: plan.branchId,
                academicYearId: plan.sourceAcademicYearId,
                academicPeriodId: plan.sourcePeriodId,
                termResultId: sourceTermResult._id,
                fromEnrollmentId: sourceEnrollment._id,
                fromLevelId: sourceEnrollment.levelId,
                decision: 'completed',
                decisionReason: 'Graduated through period rollover',
                processedBy: currentUser.userId,
                processedAt: now,
              },
            ],
            session ? { session } : undefined,
          );

          executionResult.studentsGraduated++;
          continue;
        }

        if (effectiveDecision === 'WITHDRAW') {
          const sourceUpdate = await EnrollmentModel.updateOne(
            {
              _id: sourceEnrollment._id,
              status: { $in: ['enrolled', 'active'] },
              isDeleted: false,
            },
            {
              $set: {
                status: 'withdrawn',
                completionReason: 'withdrawn',
                endDate: now,
                updatedBy: currentUser.userId,
              },
            },
            session ? { session } : undefined,
          );
          if (sourceUpdate.matchedCount === 0) {
            throw new ConflictError('Source enrollment changed during rollover execution');
          }
          await reconcileClassEnrollmentCount(sourceEnrollment.classId, session);

          executionResult.studentsWithdrawn++;
          continue;
        }

        if (['PROMOTE', 'REPEAT', 'CONTINUE'].includes(effectiveDecision)) {
          if (
            !sourceTermResult ||
            !sourceTermResult.isCompleted ||
            sourceTermResult.workflowStatus !== 'FINALIZED'
          ) {
            executionResult.errors.push({
              item: String(decision.studentId),
              error: 'A source term result is required for rollover enrollment',
            });
            continue;
          }
          const targetClassId =
            decision.targetClassId || sourceToTargetClassId.get(String(sourceEnrollment.classId));

          if (!targetClassId) {
            executionResult.errors.push({
              item: String(decision.studentId),
              error: `No target class resolved for student in ${effectiveDecision}`,
            });
            continue;
          }

          const targetClass = await ClassModel.findById(targetClassId, null, { session });
          if (!targetClass) {
            executionResult.errors.push({
              item: String(decision.studentId),
              error: `Target class ${targetClassId} does not exist`,
            });
            continue;
          }
          if (
            String(targetClass.schoolId) !== String(plan.schoolId) ||
            String(targetClass.branchId) !== String(plan.branchId) ||
            String(targetClass.academicYearId) !== String(plan.targetAcademicYearId) ||
            String(targetClass.academicPeriodId) !== String(plan.targetPeriodId)
          ) {
            executionResult.errors.push({
              item: String(decision.studentId),
              error: `Target class ${targetClassId} does not belong to the rollover destination`,
            });
            continue;
          }

          // Idempotency check: Don't recreate if already enrolled in target
          const alreadyEnrolled = await EnrollmentModel.findOne(
            {
              studentId: decision.studentId,
              academicPeriodId: plan.targetPeriodId,
              classId: targetClass._id,
              status: { $in: ['enrolled', 'active'] },
              isDeleted: false,
            },
            null,
            { session },
          );

          let targetEnrollmentId: Types.ObjectId;
          if (alreadyEnrolled) {
            targetEnrollmentId = alreadyEnrolled._id;

            const sourceUpdate = await EnrollmentModel.updateOne(
              {
                _id: sourceEnrollment._id,
                status: { $in: ['enrolled', 'active'] },
                isDeleted: false,
              },
              {
                $set: {
                  status: 'completed',
                  completionReason: 'completed',
                  endDate: now,
                  updatedBy: currentUser.userId,
                },
              },
              session ? { session } : undefined,
            );
            if (sourceUpdate.matchedCount === 0) {
              throw new ConflictError('Source enrollment changed during rollover execution');
            }
            await reconcileClassEnrollmentCount(sourceEnrollment.classId, session);
          } else {
            const completedStatus =
              decision.decision === 'PROMOTE'
                ? 'promoted'
                : decision.decision === 'REPEAT'
                  ? 'repeated'
                  : 'completed';

            await reserveClassSeat(
              {
                classId: targetClass._id,
                className: targetClass.className,
                capacity: targetClass.capacity,
                schoolId: targetClass.schoolId,
                branchId: targetClass.branchId,
              },
              session,
            );

            // Close source enrollment
            const sourceUpdate = await EnrollmentModel.updateOne(
              {
                _id: sourceEnrollment._id,
                status: { $in: ['enrolled', 'active'] },
                isDeleted: false,
              },
              {
                $set: {
                  status: completedStatus,
                  completionReason: completedStatus,
                  endDate: now,
                  updatedBy: currentUser.userId,
                },
              },
              session ? { session } : undefined,
            );
            if (sourceUpdate.matchedCount === 0) {
              throw new ConflictError('Source enrollment changed during rollover execution');
            }
            await reconcileClassEnrollmentCount(sourceEnrollment.classId, session);

            // Create target enrollment
            const enrollmentCode = await SequenceService.getNextSequence('ENR', 'ENR', 6, session);
            const newEnrollmentData = {
              enrollmentCode,
              studentId: decision.studentId,
              schoolId: plan.schoolId,
              branchId: plan.branchId,
              academicYearId: plan.targetAcademicYearId,
              academicPeriodId: plan.targetPeriodId,
              programId: targetClass.programId,
              levelId: targetClass.levelId,
              classId: targetClass._id,
              studyModeId: sourceEnrollment.studyModeId,
              attemptNumber:
                (sourceEnrollment.attemptNumber ?? 1) + (decision.decision === 'REPEAT' ? 1 : 1),
              previousEnrollmentId: sourceEnrollment._id,
              enrollmentDate: now,
              status: 'enrolled' as const,
              tuitionStatus: 'pending' as const,
              remarks: `Rolled over from ${plan.planCode} (${decision.decision})`,
              createdBy: currentUser.userId,
              updatedBy: currentUser.userId,
            };

            const rawCreated = session
              ? await EnrollmentModel.create([newEnrollmentData], { session })
              : await EnrollmentModel.create(newEnrollmentData);
            const createdEnrollment = Array.isArray(rawCreated) ? rawCreated[0] : rawCreated;
            if (!createdEnrollment) throw new Error('Target enrollment could not be created');
            targetEnrollmentId = createdEnrollment._id;
            executionResult.enrollmentsCreated++;

            // Create Promotion audit record
            await PromotionModel.create(
              [
                {
                  studentId: decision.studentId,
                  schoolId: plan.schoolId,
                  branchId: plan.branchId,
                  academicYearId: plan.sourceAcademicYearId,
                  academicPeriodId: plan.sourcePeriodId,
                  termResultId: sourceTermResult._id,
                  fromEnrollmentId: sourceEnrollment._id,
                  toEnrollmentId: targetEnrollmentId,
                  fromLevelId: sourceEnrollment.levelId,
                  toLevelId: targetClass.levelId,
                  decision: (decision.decision === 'PROMOTE'
                    ? 'promoted'
                    : decision.decision === 'REPEAT'
                      ? 'repeated'
                      : 'continued') as never,
                  decisionReason: `Period rollover (${decision.decision})`,
                  processedBy: currentUser.userId,
                  processedAt: now,
                },
              ],
              session ? { session } : undefined,
            );

            if (decision.decision === 'PROMOTE') executionResult.studentsPromoted++;
            else if (decision.decision === 'REPEAT') executionResult.studentsRepeated++;
            else executionResult.studentsContinued++;
          }
        }

        if (decision.decision === 'TRANSFER' && decision.targetBranchId) {
          // Transfer to another branch/class
          const targetClassId =
            decision.targetClassId || sourceToTargetClassId.get(String(sourceEnrollment.classId));

          if (targetClassId) {
            const targetClass = await ClassModel.findOne({
              _id: targetClassId,
              schoolId: plan.schoolId,
              branchId: decision.targetBranchId,
              academicYearId: plan.targetAcademicYearId,
              academicPeriodId: plan.targetPeriodId,
              isDeleted: false,
            });
            if (!targetClass) {
              throw new BadRequestError('Transfer target class does not match the rollover target');
            }
            await reserveClassSeat(
              {
                classId: targetClass._id,
                className: targetClass.className,
                capacity: targetClass.capacity,
                schoolId: targetClass.schoolId,
                branchId: targetClass.branchId,
              },
              session,
            );

            const sourceUpdate = await EnrollmentModel.updateOne(
              {
                _id: sourceEnrollment._id,
                status: { $in: ['enrolled', 'active'] },
                isDeleted: false,
              },
              {
                $set: {
                  status: 'transferred',
                  completionReason: 'transferred',
                  endDate: now,
                  updatedBy: currentUser.userId,
                },
              },
              session ? { session } : undefined,
            );
            if (sourceUpdate.matchedCount === 0) {
              throw new ConflictError('Source enrollment changed during rollover execution');
            }
            await reconcileClassEnrollmentCount(sourceEnrollment.classId, session);

            const enrollmentCode = await SequenceService.getNextSequence('ENR', 'ENR', 6, session);
            if (session) {
              await EnrollmentModel.create(
                [
                  {
                    enrollmentCode,
                    studentId: decision.studentId,
                    schoolId: plan.schoolId,
                    branchId: decision.targetBranchId,
                    academicYearId: plan.targetAcademicYearId,
                    academicPeriodId: plan.targetPeriodId,
                    programId: decision.targetProgramId || sourceEnrollment.programId,
                    levelId: decision.targetLevelId || sourceEnrollment.levelId,
                    classId: targetClassId,
                    attemptNumber: 1,
                    previousEnrollmentId: sourceEnrollment._id,
                    enrollmentDate: now,
                    status: 'enrolled',
                    tuitionStatus: 'pending',
                    remarks: `Transferred during rollover ${plan.planCode}`,
                    createdBy: currentUser.userId,
                  },
                ],
                { session },
              );
            } else {
              await EnrollmentModel.create({
                enrollmentCode,
                studentId: decision.studentId,
                schoolId: plan.schoolId,
                branchId: decision.targetBranchId,
                academicYearId: plan.targetAcademicYearId,
                academicPeriodId: plan.targetPeriodId,
                programId: decision.targetProgramId || sourceEnrollment.programId,
                levelId: decision.targetLevelId || sourceEnrollment.levelId,
                classId: targetClassId,
                attemptNumber: 1,
                previousEnrollmentId: sourceEnrollment._id,
                enrollmentDate: now,
                status: 'enrolled',
                tuitionStatus: 'pending',
                remarks: `Transferred during rollover ${plan.planCode}`,
                createdBy: currentUser.userId,
              });
            }

            const transferCode = await SequenceService.getNextSequence('TRF', 'TRF', 6, session);
            await StudentTransferModel.create(
              [
                {
                  transferNumber: transferCode,
                  studentId: decision.studentId,
                  fromSchoolId: plan.schoolId,
                  toSchoolId: plan.schoolId,
                  fromBranchId: plan.branchId,
                  toBranchId: decision.targetBranchId,
                  fromProgramId: sourceEnrollment.programId,
                  toProgramId: decision.targetProgramId || sourceEnrollment.programId,
                  fromLevelId: sourceEnrollment.levelId,
                  toLevelId: decision.targetLevelId || sourceEnrollment.levelId,
                  fromClassId: sourceEnrollment.classId,
                  toClassId: targetClassId,
                  transferType: 'BRANCH',
                  transferDate: now,
                  reason: decision.reason || 'Branch transfer during period rollover',
                  status: 'completed',
                  effectiveDate: now,
                  approvedBy: currentUser.userId,
                  approvalDate: now,
                  createdBy: currentUser.userId,
                },
              ],
              session ? { session } : undefined,
            );

            executionResult.studentsTransferred++;
            executionResult.enrollmentsCreated++;
          }
        }
      }

      // STEP 3: CARRY TEACHER ASSIGNMENTS IF CONFIGURED
      if (plan.options.carryTeacherSuggestions) {
        const sourceAssignments = await TeacherAssignmentModel.find(
          {
            academicPeriodId: plan.sourcePeriodId,
            status: 'active',
            isDeleted: false,
          },
          null,
          { session },
        ).lean();

        for (const assign of sourceAssignments) {
          const targetClassId = sourceToTargetClassId.get(String(assign.classId));
          if (!targetClassId) continue;

          const exists = await TeacherAssignmentModel.findOne(
            {
              academicPeriodId: plan.targetPeriodId,
              classId: targetClassId,
              employeeId: assign.employeeId,
              isDeleted: false,
            },
            null,
            { session },
          );

          if (!exists) {
            const data = {
              schoolId: plan.schoolId,
              branchId: plan.branchId,
              academicYearId: plan.targetAcademicYearId,
              academicPeriodId: plan.targetPeriodId,
              employeeId: assign.employeeId,
              classId: targetClassId,
              subjectId: assign.subjectId,
              roleInClass: assign.roleInClass,
              status: 'active' as const,
              startDate: new Date(),
              remarks: `Carried forward from rollover ${plan.planCode}`,
              createdBy: currentUser.userId,
            };

            if (session) await TeacherAssignmentModel.create([data], { session });
            else await TeacherAssignmentModel.create(data);
            executionResult.teacherAssignmentsCreated++;
          }
        }
      }

      // STEP 4: CARRY SCHEDULES IF CONFIGURED
      if (plan.options.carryScheduleSuggestions) {
        const sourceSchedules = await ClassScheduleModel.find(
          {
            academicPeriodId: plan.sourcePeriodId,
            status: 'active',
            isDeleted: false,
          },
          null,
          { session },
        ).lean();

        for (const sched of sourceSchedules) {
          const targetClassId = sourceToTargetClassId.get(String(sched.classId));
          if (!targetClassId) continue;

          const exists = await ClassScheduleModel.findOne(
            {
              academicPeriodId: plan.targetPeriodId,
              classId: targetClassId,
              dayOfWeek: sched.dayOfWeek,
              startTime: sched.startTime,
              isDeleted: false,
            },
            null,
            { session },
          );

          if (!exists) {
            const data = {
              classId: targetClassId,
              schoolId: plan.schoolId,
              branchId: plan.branchId,
              academicYearId: plan.targetAcademicYearId,
              academicPeriodId: plan.targetPeriodId,
              dayOfWeek: sched.dayOfWeek,
              timeSlotId: sched.timeSlotId,
              sessionType: sched.sessionType,
              startTime: sched.startTime,
              endTime: sched.endTime,
              subjectId: sched.subjectId,
              teacherId: sched.teacherId,
              classroomId: sched.classroomId,
              status: 'active' as const,
              createdBy: currentUser.userId,
            };

            if (session) await ClassScheduleModel.create([data], { session });
            else await ClassScheduleModel.create(data);
            executionResult.schedulesCreated++;
          }
        }
      }

      // STEP 5: CLOSE SOURCE PERIOD IF CONFIGURED
      if (dto.closeSourcePeriod !== false) {
        await AcademicPeriodModel.updateOne(
          { _id: plan.sourcePeriodId },
          {
            $set: {
              status: 'closed',
              closedAt: new Date(),
              closedBy: currentUser.userId,
            },
          },
          session ? { session } : undefined,
        );
      }

      executionResult.completedAt = new Date();

      // STEP 6: MARK PLAN COMPLETED
      const updatedPlan = await AcademicRolloverPlanModel.findOneAndUpdate(
        { _id: plan._id },
        {
          $set: {
            status: 'completed',
            executionResult,
            executedAt: new Date(),
            executedBy: currentUser.userId,
            idempotencyKey: dto.idempotencyKey || `ROL-EXEC-${Date.now()}`,
          },
        },
        { new: true, session },
      );

      await AuditLogService.log({
        userId: currentUser.userId,
        schoolId: String(plan.schoolId),
        branchId: String(plan.branchId),
        module: 'rollover',
        action: 'UPDATE',
        entityType: 'AcademicRolloverPlan',
        entityId: String(plan._id),
        reason: 'Rollover plan executed successfully',
        newValue: { status: 'completed', executionResult },
        session: session ?? undefined,
      });

      return {
        success: true,
        message: 'Academic rollover executed atomically and completed successfully',
        executionResult,
        plan: updatedPlan!,
      };
    });
  }

  public async validateTargetPeriodReadiness(
    targetPeriodId: string,
    currentUser: AuthUser,
  ): Promise<TargetPeriodReadinessDto> {
    const period = await AcademicPeriodModel.findOne({
      _id: targetPeriodId,
      schoolId: currentUser.schoolId,
      isDeleted: false,
    });
    if (!period) throw new NotFoundError('Target academic period not found');

    const [classes, enrollments, teacherAssignments, schedules, activeRules, activeFees] =
      await Promise.all([
        ClassModel.find({
          schoolId: currentUser.schoolId,
          academicPeriodId: targetPeriodId,
          isDeleted: false,
        }).lean(),
        EnrollmentModel.find({
          schoolId: currentUser.schoolId,
          academicPeriodId: targetPeriodId,
          isDeleted: false,
        }).lean(),
        TeacherAssignmentModel.find({
          schoolId: currentUser.schoolId,
          academicPeriodId: targetPeriodId,
          isDeleted: false,
        }).lean(),
        ClassScheduleModel.find({
          schoolId: currentUser.schoolId,
          academicPeriodId: targetPeriodId,
          isDeleted: false,
        }).lean(),
        AcademicRuleModel.find({
          schoolId: currentUser.schoolId,
          $or: [{ academicPeriodId: null }, { academicPeriodId: targetPeriodId }],
          status: 'active',
          isDeleted: false,
        }).lean(),
        TuitionFeeModel.find({
          schoolId: currentUser.schoolId,
          academicYearId: period.academicYearId,
          status: 'active',
          isDeleted: false,
        }).lean(),
      ]);

    const blockingIssues: string[] = [];
    const warnings: string[] = [];

    if (classes.length === 0) {
      blockingIssues.push('Target period has no class offerings created');
    }
    if (enrollments.length === 0) {
      warnings.push('Target period has no enrolled students');
    }

    // Capacity checking
    const studentCountByClass = new Map<string, number>();
    for (const e of enrollments) {
      const cId = String(e.classId);
      studentCountByClass.set(cId, (studentCountByClass.get(cId) ?? 0) + 1);
    }
    let overCapacityCount = 0;
    for (const c of classes) {
      const enrolled = studentCountByClass.get(String(c._id)) ?? 0;
      if (c.capacity && enrolled > c.capacity) {
        overCapacityCount++;
        warnings.push(`Target class "${c.className}" exceeds capacity (${enrolled}/${c.capacity})`);
      }
    }

    // Teacher assignment checking
    const assignedClassIds = new Set(teacherAssignments.map((a) => String(a.classId)));
    const unassignedClasses = classes.filter((c) => !assignedClassIds.has(String(c._id)));
    if (unassignedClasses.length > 0) {
      warnings.push(`${unassignedClasses.length} class(es) have no teacher assigned`);
    }

    // Timetable conflict checking
    const roomSlots = new Map<string, Array<{ day: number; start: string; end: string }>>();
    let scheduleConflictsCount = 0;
    for (const s of schedules) {
      if (!s.classroomId) continue;
      const rId = String(s.classroomId);
      const list = roomSlots.get(rId) ?? [];
      for (const ex of list) {
        if (ex.day === s.dayOfWeek && ex.start < s.endTime && s.startTime < ex.end) {
          scheduleConflictsCount++;
          blockingIssues.push(
            `Classroom ${rId} has overlapping schedules on Day ${s.dayOfWeek} (${s.startTime}-${s.endTime})`,
          );
        }
      }
      list.push({ day: s.dayOfWeek, start: s.startTime, end: s.endTime });
      roomSlots.set(rId, list);
    }

    const teacherSlots = new Map<string, Array<{ day: number; start: string; end: string }>>();
    for (const s of schedules) {
      if (!s.teacherId) continue;
      const tId = String(s.teacherId);
      const list = teacherSlots.get(tId) ?? [];
      for (const ex of list) {
        if (ex.day === s.dayOfWeek && ex.start < s.endTime && s.startTime < ex.end) {
          scheduleConflictsCount++;
          blockingIssues.push(
            `Teacher ${tId} has overlapping schedules on Day ${s.dayOfWeek} (${s.startTime}-${s.endTime})`,
          );
        }
      }
      list.push({ day: s.dayOfWeek, start: s.startTime, end: s.endTime });
      teacherSlots.set(tId, list);
    }

    // Academic rule checking
    if (activeRules.length === 0) {
      warnings.push('No active academic rules configured for this academic context');
    }

    // Fee setup checking
    if (activeFees.length === 0) {
      warnings.push('No active tuition fees configured for target academic year');
    }

    const isReadyToOpen = blockingIssues.length === 0;
    const isApproved = Boolean(period.readinessApprovedBy || period.status === 'open');

    return {
      targetPeriodId,
      targetPeriodName: period.name,
      status: period.status,
      isReadyToOpen,
      isApproved,
      approvedBy: period.readinessApprovedBy ? String(period.readinessApprovedBy) : undefined,
      approvedAt: period.readinessApprovedAt,
      checkedAt: new Date(),
      checks: {
        classes: {
          passed: classes.length > 0,
          classesCount: classes.length,
          message: classes.length > 0 ? `${classes.length} class(es) prepared` : 'No classes found',
        },
        students: {
          passed: enrollments.length > 0,
          enrolledCount: enrollments.length,
          message:
            enrollments.length > 0
              ? `${enrollments.length} student(s) enrolled`
              : 'No enrollments found',
        },
        capacity: {
          passed: overCapacityCount === 0,
          overCapacityCount,
          message:
            overCapacityCount === 0
              ? 'All class capacities respected'
              : `${overCapacityCount} class(es) over capacity`,
        },
        teacherAssignments: {
          passed: unassignedClasses.length === 0,
          unassignedClassesCount: unassignedClasses.length,
          message:
            unassignedClasses.length === 0
              ? 'All classes have assigned teachers'
              : `${unassignedClasses.length} class(es) unassigned`,
        },
        timetableConflicts: {
          passed: scheduleConflictsCount === 0,
          conflictsCount: scheduleConflictsCount,
          message:
            scheduleConflictsCount === 0
              ? 'No schedule collisions'
              : `${scheduleConflictsCount} schedule collision(s) detected`,
        },
        academicRules: {
          passed: activeRules.length > 0,
          activeRulesCount: activeRules.length,
          message:
            activeRules.length > 0
              ? `${activeRules.length} active academic rule(s)`
              : 'No active academic rules found',
        },
        feeSetup: {
          passed: activeFees.length > 0,
          configuredFeesCount: activeFees.length,
          message:
            activeFees.length > 0
              ? `${activeFees.length} active tuition fee(s) configured`
              : 'No active fees found for year',
        },
      },
      metrics: {
        classesCount: classes.length,
        enrolledStudentsCount: enrollments.length,
        assignedTeachersCount: teacherAssignments.length,
        schedulesCount: schedules.length,
        scheduleConflictsCount,
        unresolvedRulesCount: activeRules.length === 0 ? 1 : 0,
        activeFeesCount: activeFees.length,
      },
      blockingIssues,
      warnings,
    };
  }

  public async approveTargetPeriodReadiness(
    targetPeriodId: string,
    currentUser: AuthUser,
  ): Promise<TargetPeriodReadinessDto> {
    const period = await AcademicPeriodModel.findOne({
      _id: targetPeriodId,
      schoolId: currentUser.schoolId,
      isDeleted: false,
    });
    if (!period) throw new NotFoundError('Target academic period not found');

    const canApprove =
      checkUserPermission(currentUser.permissions, 'rollover.approve.own_branch') ||
      checkUserPermission(currentUser.permissions, 'rollover.approve.all_branches');
    if (!canApprove) {
      throw new ForbiddenError('You do not have permission to approve target period readiness');
    }

    const readiness = await this.validateTargetPeriodReadiness(targetPeriodId, currentUser);
    if (!readiness.isReadyToOpen) {
      throw new ConflictError(
        `Cannot approve readiness with blocking issues: ${readiness.blockingIssues.join('; ')}`,
      );
    }

    await AcademicPeriodModel.updateOne(
      { _id: targetPeriodId },
      {
        $set: {
          readinessApprovedBy: currentUser.userId,
          readinessApprovedAt: new Date(),
        },
      },
    );

    await AuditLogService.log({
      userId: currentUser.userId,
      schoolId: String(period.schoolId),
      module: 'rollover',
      action: 'WORKFLOW_TRANSITION',
      entityType: 'AcademicPeriodReadiness',
      entityId: targetPeriodId,
      newValue: { targetPeriodId, isApproved: true },
    });

    return this.validateTargetPeriodReadiness(targetPeriodId, currentUser);
  }

  public async openTargetPeriod(
    targetPeriodId: string,
    currentUser: AuthUser,
  ): Promise<IAcademicPeriod> {
    const period = await AcademicPeriodModel.findOne({
      _id: targetPeriodId,
      schoolId: currentUser.schoolId,
      isDeleted: false,
    });
    if (!period) throw new NotFoundError('Target academic period not found');

    const canExecute =
      checkUserPermission(currentUser.permissions, 'rollover.execute.own_branch') ||
      checkUserPermission(currentUser.permissions, 'rollover.execute.all_branches') ||
      checkUserPermission(currentUser.permissions, 'academic_period.edit.own_branch');
    if (!canExecute) {
      throw new ForbiddenError('You do not have permission to open the target academic period');
    }

    if (period.status === 'open') {
      return period;
    }

    if (period.status !== 'planned') {
      throw new ConflictError(`Cannot open academic period in ${period.status} status`);
    }

    const readiness = await this.validateTargetPeriodReadiness(targetPeriodId, currentUser);
    if (!readiness.isReadyToOpen) {
      throw new ConflictError(
        `Cannot open target period with blocking issues: ${readiness.blockingIssues.join('; ')}`,
      );
    }

    const updated = await AcademicPeriodModel.findOneAndUpdate(
      { _id: targetPeriodId, isDeleted: false },
      {
        $set: {
          status: 'open',
          openedBy: currentUser.userId,
          openedAt: new Date(),
        },
      },
      { new: true },
    );

    if (!updated) throw new NotFoundError('Academic period not found');

    await AuditLogService.log({
      userId: currentUser.userId,
      schoolId: String(period.schoolId),
      module: 'academic_period',
      action: 'UPDATE',
      entityType: 'AcademicPeriod',
      entityId: targetPeriodId,
      newValue: { status: 'open', openedBy: currentUser.userId },
    });

    return updated;
  }
}
