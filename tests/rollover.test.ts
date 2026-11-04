import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Types } from 'mongoose';

import { createApp } from '../src/app';
import { AcademicPeriodModel } from '../src/modules/academic-period/academic-period.model';
import { AcademicPeriodService } from '../src/modules/academic-period/academic-period.service';
import { assertAcademicContextWritable } from '../src/modules/academic-period/academic-context-lock.service';
import { AcademicRuleModel } from '../src/modules/academic-rule/academic-rule.model';
import { AcademicYearModel } from '../src/modules/academic-year/academic-year.model';
import { BranchModel } from '../src/modules/branch/branch.model';
import { ClassModel } from '../src/modules/class/class.model';
import { ClassScheduleModel } from '../src/modules/class-schedule/class-schedule.model';
import { EnrollmentModel } from '../src/modules/enrollment/enrollment.model';
import { LevelModel } from '../src/modules/level/level.model';
import { AcademicRolloverPlanModel } from '../src/modules/rollover/rollover.model';
import { SequenceService } from '../src/modules/sequence/sequence.service';
import { TeacherAssignmentModel } from '../src/modules/teacher-assignment/teacher-assignment.model';
import { PromotionModel } from '../src/modules/term-result/promotion.model';
import { TermResultModel } from '../src/modules/term-result/term-result.model';
import { TuitionFeeModel } from '../src/modules/tuition/tuition-fee.model';
import { DEFAULT_CORE_ROLES } from '../src/constants/permissions';

vi.mock('../src/modules/audit-log/audit-log.service', () => ({
  AuditLogService: class {
    public static log = vi.fn().mockResolvedValue(undefined);
  },
}));

const app = createApp();

describe('Academic Rollover Engine & Closing Lifecycle', () => {
  const mockSchoolId = '000000000000000000000001';
  const mockBranchId = new Types.ObjectId().toString();
  const mockSourceYearId = new Types.ObjectId().toString();
  const mockSourcePeriodId = new Types.ObjectId().toString();
  const mockTargetYearId = new Types.ObjectId().toString();
  const mockTargetPeriodId = new Types.ObjectId().toString();
  const mockProgramId = new Types.ObjectId().toString();
  const mockLevel1Id = new Types.ObjectId().toString();
  const mockLevel2Id = new Types.ObjectId().toString();

  const mockChecklist = {
    academicPeriodId: mockSourcePeriodId,
    canFinalize: true,
    canClose: true,
    checkedAt: new Date(),
    counts: {
      classes: 1,
      activeEnrollments: 1,
      assessments: 1,
      draftAssessments: 0,
      expectedScores: 1,
      recordedScores: 1,
      missingScores: 0,
      attendanceSessions: 1,
      studentsWithoutAttendance: 0,
      termResults: 1,
      unapprovedResults: 0,
      unresolvedPromotions: 0,
    },
    problems: [],
    blockingIssues: [],
    warnings: [],
    preview: {
      classesCount: 1,
      activeEnrollmentsCount: 1,
      promotedCount: 1,
      repeatedCount: 0,
      continuedCount: 0,
      graduatedCount: 0,
      withdrawnCount: 0,
      unresolvedCount: 0,
      projectedTargetEnrollmentsCount: 1,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(BranchModel, 'findOne').mockResolvedValue({
      _id: mockBranchId,
      schoolId: mockSchoolId,
      isDeleted: false,
    } as never);
    vi.spyOn(AcademicPeriodService.prototype, 'getClosingChecklist').mockResolvedValue(
      mockChecklist,
    );
    vi.spyOn(ClassScheduleModel, 'find').mockReturnValue({
      lean: vi.fn().mockResolvedValue([]),
    } as never);
    vi.spyOn(AcademicRuleModel, 'find').mockReturnValue({
      lean: vi
        .fn()
        .mockResolvedValue([{ _id: new Types.ObjectId(), name: 'Standard Grade Scheme' }]),
    } as never);
    vi.spyOn(TuitionFeeModel, 'find').mockReturnValue({
      lean: vi
        .fn()
        .mockResolvedValue([{ _id: new Types.ObjectId(), name: 'Standard Tuition Fee' }]),
    } as never);
  });

  it('POST /api/v1/rollovers creates a new draft rollover plan with auto-generated mappings', async () => {
    vi.spyOn(AcademicYearModel, 'findOne')
      .mockResolvedValueOnce({ _id: mockSourceYearId, name: '2025-2026', code: 'AY2526' } as never)
      .mockResolvedValueOnce({ _id: mockTargetYearId, name: '2026-2027', code: 'AY2627' } as never);

    vi.spyOn(AcademicPeriodModel, 'findOne')
      .mockResolvedValueOnce({
        _id: mockSourcePeriodId,
        name: 'Term 1',
        code: 'T1',
        status: 'finalized',
        academicYearId: mockSourceYearId,
      } as never)
      .mockResolvedValueOnce({
        _id: mockTargetPeriodId,
        name: 'Term 2',
        code: 'T2',
        status: 'planned',
        academicYearId: mockTargetYearId,
      } as never);

    const sourceClassId = new Types.ObjectId();
    vi.spyOn(ClassModel, 'find').mockReturnValue({
      lean: vi.fn().mockResolvedValue([
        {
          _id: sourceClassId,
          className: 'Level 1 A (Term 1)',
          classCode: 'ENG-L1-T1-A',
          programId: mockProgramId,
          levelId: mockLevel1Id,
          section: 'A',
          capacity: 25,
        },
      ]),
    } as never);

    const studentId = new Types.ObjectId();
    const enrollmentId = new Types.ObjectId();
    vi.spyOn(EnrollmentModel, 'find').mockReturnValue({
      lean: vi.fn().mockResolvedValue([
        {
          _id: enrollmentId,
          studentId,
          classId: sourceClassId,
          programId: mockProgramId,
          levelId: mockLevel1Id,
          branchId: mockBranchId,
          status: 'active',
        },
      ]),
    } as never);

    vi.spyOn(TermResultModel, 'find').mockReturnValue({
      lean: vi.fn().mockResolvedValue([
        {
          enrollmentId,
          promotionStatus: 'PROMOTED',
          nextLevelId: mockLevel2Id,
          workflowStatus: 'FINALIZED',
          isCompleted: true,
        },
      ]),
    } as never);

    vi.spyOn(LevelModel, 'find').mockReturnValue({
      sort: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue([
          { _id: mockLevel1Id, programId: mockProgramId, sequence: 1 },
          { _id: mockLevel2Id, programId: mockProgramId, sequence: 2 },
        ]),
      }),
    } as never);

    vi.spyOn(SequenceService, 'getNextSequence').mockResolvedValue('ROL-0001');

    const createdPlanDoc = {
      _id: new Types.ObjectId(),
      planCode: 'ROL-0001',
      schoolId: mockSchoolId,
      branchId: mockBranchId,
      sourceAcademicYearId: mockSourceYearId,
      sourcePeriodId: mockSourcePeriodId,
      targetAcademicYearId: mockTargetYearId,
      targetPeriodId: mockTargetPeriodId,
      status: 'draft',
      options: {
        carryClasses: true,
        carryTeacherSuggestions: true,
        carryScheduleSuggestions: true,
      },
      classMappings: [
        {
          sourceClassId,
          targetClassName: 'Level 1 A (Term 2)',
          targetClassCode: 'ENG-L1-T2-A',
          targetProgramId: mockProgramId,
          targetLevelId: mockLevel2Id,
          targetSection: 'A',
          targetCapacity: 25,
          action: 'CREATE_NEW',
        },
      ],
      studentDecisions: [
        {
          studentId,
          sourceEnrollmentId: enrollmentId,
          decision: 'PROMOTE',
          targetProgramId: mockProgramId,
          targetLevelId: mockLevel2Id,
          isProcessed: false,
        },
      ],
      createdBy: 'test-user',
    };

    vi.spyOn(AcademicRolloverPlanModel, 'findOne').mockImplementation((filter: unknown) => {
      const q = filter as Record<string, unknown>;
      if (q && q.status) {
        // active plan check -> return null
        return null as never;
      }
      return {
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(createdPlanDoc),
      } as never;
    });

    vi.spyOn(AcademicRolloverPlanModel, 'create').mockResolvedValue(createdPlanDoc as never);
    vi.spyOn(AcademicRolloverPlanModel, 'updateOne').mockResolvedValue({
      acknowledged: true,
    } as never);

    const res = await request(app).post('/api/v1/rollovers').send({
      branchId: mockBranchId,
      sourceAcademicYearId: mockSourceYearId,
      sourcePeriodId: mockSourcePeriodId,
      targetAcademicYearId: mockTargetYearId,
      targetPeriodId: mockTargetPeriodId,
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.planCode).toBe('ROL-0001');
    expect(res.body.data.classMappings).toHaveLength(1);
    expect(res.body.data.studentDecisions).toHaveLength(1);
    expect(res.body.data.studentDecisions[0].decision).toBe('PROMOTE');
  });

  it('GET /api/v1/rollovers returns paginated list of rollover plans', async () => {
    vi.spyOn(AcademicRolloverPlanModel, 'find').mockReturnValue({
      populate: vi.fn().mockReturnThis(),
      sort: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([
        {
          _id: new Types.ObjectId(),
          planCode: 'ROL-0001',
          branchId: mockBranchId,
          status: 'draft',
        },
      ]),
    } as never);

    vi.spyOn(AcademicRolloverPlanModel, 'countDocuments').mockReturnValue({
      exec: vi.fn().mockResolvedValue(1),
    } as never);

    const res = await request(app).get('/api/v1/rollovers');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].planCode).toBe('ROL-0001');
  });

  it('POST /api/v1/rollovers/:id/validate verifies capacities and draft schedule conflicts', async () => {
    const planId = new Types.ObjectId().toString();
    const sourceClassId = new Types.ObjectId();

    const plan = {
      _id: planId,
      planCode: 'ROL-0001',
      schoolId: mockSchoolId,
      branchId: mockBranchId,
      sourcePeriodId: mockSourcePeriodId,
      status: 'draft',
      options: { carryClasses: true, carryScheduleSuggestions: true },
      classMappings: [
        {
          sourceClassId,
          targetClassName: 'Class Alpha',
          targetClassCode: 'ALPHA-T2',
          targetCapacity: 2,
        },
      ],
      studentDecisions: [
        { decision: 'PROMOTE' },
        { decision: 'PROMOTE' },
        { decision: 'PROMOTE' }, // 3 students into capacity 2 -> warning
      ],
    };

    vi.spyOn(AcademicRolloverPlanModel, 'findOne').mockReturnValue({
      populate: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue(plan),
    } as never);

    vi.spyOn(AcademicRolloverPlanModel, 'updateOne').mockResolvedValue({
      acknowledged: true,
    } as never);

    const res = await request(app).post(`/api/v1/rollovers/${planId}/validate`).send({});
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.capacityWarnings).toHaveLength(1);
    expect(res.body.data.capacityWarnings[0].enrolledCount).toBe(3);
  });

  it('POST /api/v1/rollovers/:id/approve transitions plan status to approved', async () => {
    const planId = new Types.ObjectId().toString();

    const plan = {
      _id: planId,
      planCode: 'ROL-0001',
      schoolId: mockSchoolId,
      branchId: mockBranchId,
      sourcePeriodId: mockSourcePeriodId,
      status: 'validated',
      options: { carryClasses: true },
      classMappings: [
        { targetClassName: 'Class Alpha', targetClassCode: 'ALPHA-T2', targetCapacity: 30 },
      ],
      studentDecisions: [],
    };

    vi.spyOn(AcademicRolloverPlanModel, 'findOne').mockReturnValue({
      populate: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue(plan),
    } as never);

    vi.spyOn(AcademicRolloverPlanModel, 'updateOne').mockResolvedValue({
      acknowledged: true,
    } as never);
    vi.spyOn(AcademicRolloverPlanModel, 'findOneAndUpdate').mockResolvedValue({
      ...plan,
      status: 'approved',
      approvedBy: 'test-admin',
    } as never);

    const res = await request(app).post(`/api/v1/rollovers/${planId}/approve`).send({});
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('approved');
  });

  it('POST /api/v1/rollovers/:id/execute runs atomic execution and is idempotent', async () => {
    const planId = new Types.ObjectId().toString();
    const sourceClassId = new Types.ObjectId();
    const targetClassId = new Types.ObjectId();
    const studentId = new Types.ObjectId();
    const sourceEnrollmentId = new Types.ObjectId();

    const plan = {
      _id: planId,
      planCode: 'ROL-0001',
      schoolId: mockSchoolId,
      branchId: mockBranchId,
      sourceAcademicYearId: mockSourceYearId,
      sourcePeriodId: mockSourcePeriodId,
      targetAcademicYearId: mockTargetYearId,
      targetPeriodId: mockTargetPeriodId,
      status: 'approved',
      options: {
        carryClasses: true,
        carryTeacherSuggestions: false,
        carryScheduleSuggestions: false,
      },
      classMappings: [
        {
          sourceClassId,
          targetClassName: 'Class Alpha T2',
          targetClassCode: 'ALPHA-T2',
          targetProgramId: mockProgramId,
          targetLevelId: mockLevel2Id,
          targetSection: 'A',
          targetCapacity: 30,
          action: 'CREATE_NEW',
        },
      ],
      studentDecisions: [
        {
          studentId,
          sourceEnrollmentId,
          decision: 'PROMOTE',
          isProcessed: false,
        },
      ],
    };

    vi.spyOn(AcademicRolloverPlanModel, 'findOne').mockReturnValue({
      populate: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue(plan),
    } as never);

    vi.spyOn(ClassModel, 'findOne').mockResolvedValue(null);
    vi.spyOn(ClassModel, 'create').mockResolvedValue({ _id: targetClassId } as never);
    vi.spyOn(ClassModel, 'findById').mockResolvedValue({
      _id: targetClassId,
      schoolId: mockSchoolId,
      branchId: mockBranchId,
      academicYearId: mockTargetYearId,
      academicPeriodId: mockTargetPeriodId,
      programId: mockProgramId,
      levelId: mockLevel2Id,
    } as never);
    vi.spyOn(ClassModel, 'findOneAndUpdate').mockResolvedValue({
      _id: targetClassId,
      capacity: 30,
      currentEnrollmentCount: 0,
    } as never);
    vi.spyOn(ClassModel, 'updateOne').mockResolvedValue({ acknowledged: true } as never);
    vi.spyOn(EnrollmentModel, 'countDocuments').mockResolvedValue(0 as never);
    vi.spyOn(TermResultModel, 'findOne').mockResolvedValue({
      _id: new Types.ObjectId(),
      isCompleted: true,
      workflowStatus: 'FINALIZED',
    } as never);

    vi.spyOn(EnrollmentModel, 'findOne')
      .mockResolvedValueOnce({
        _id: sourceEnrollmentId,
        studentId,
        classId: sourceClassId,
        programId: mockProgramId,
        levelId: mockLevel1Id,
        attemptNumber: 1,
      } as never)
      .mockResolvedValueOnce(null); // not already enrolled in target

    vi.spyOn(EnrollmentModel, 'updateOne').mockResolvedValue({
      acknowledged: true,
      matchedCount: 1,
    } as never);
    vi.spyOn(SequenceService, 'getNextSequence').mockResolvedValue('ENR-000001');
    vi.spyOn(EnrollmentModel, 'create').mockResolvedValue({ _id: new Types.ObjectId() } as never);
    vi.spyOn(PromotionModel, 'create').mockResolvedValue([{ _id: new Types.ObjectId() }] as never);
    vi.spyOn(AcademicPeriodModel, 'updateOne').mockResolvedValue({ acknowledged: true } as never);

    vi.spyOn(AcademicRolloverPlanModel, 'findOneAndUpdate').mockResolvedValue({
      ...plan,
      status: 'completed',
      executionResult: {
        classesCreated: 1,
        enrollmentsCreated: 1,
        studentsPromoted: 1,
        studentsRepeated: 0,
        studentsContinued: 0,
        studentsGraduated: 0,
        studentsWithdrawn: 0,
        studentsTransferred: 0,
        teacherAssignmentsCreated: 0,
        schedulesCreated: 0,
        errors: [],
      },
    } as never);

    // First execution
    const res = await request(app).post(`/api/v1/rollovers/${planId}/execute`).send({});
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.executionResult.classesCreated).toBe(1);
    expect(res.body.executionResult.studentsPromoted).toBe(1);

    // IDEMPOTENCY CHECK: executing again on completed plan returns success with prior result
    const completedPlan = {
      ...plan,
      status: 'completed',
      executionResult: res.body.executionResult,
    };
    vi.spyOn(AcademicRolloverPlanModel, 'findOne').mockReturnValue({
      populate: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue(completedPlan),
    } as never);

    const secondRes = await request(app).post(`/api/v1/rollovers/${planId}/execute`).send({});
    expect(secondRes.status).toBe(200);
    expect(secondRes.body.message).toContain('already been executed');
    expect(secondRes.body.executionResult.classesCreated).toBe(1);
  });

  it('GET /api/v1/rollovers/target-readiness/:targetPeriodId verifies 7-category target period readiness', async () => {
    vi.spyOn(AcademicPeriodModel, 'findOne').mockResolvedValue({
      _id: mockTargetPeriodId,
      name: 'Term 2',
      status: 'planned',
    } as never);

    vi.spyOn(ClassModel, 'find').mockReturnValue({
      lean: vi
        .fn()
        .mockResolvedValue([{ _id: new Types.ObjectId(), className: 'Class 1', capacity: 30 }]),
    } as never);

    vi.spyOn(EnrollmentModel, 'find').mockReturnValue({
      lean: vi
        .fn()
        .mockResolvedValue([{ _id: new Types.ObjectId(), classId: new Types.ObjectId() }]),
    } as never);

    vi.spyOn(TeacherAssignmentModel, 'find').mockReturnValue({
      lean: vi.fn().mockResolvedValue([]),
    } as never);

    vi.spyOn(ClassScheduleModel, 'find').mockReturnValue({
      lean: vi.fn().mockResolvedValue([]),
    } as never);

    const res = await request(app).get(`/api/v1/rollovers/target-readiness/${mockTargetPeriodId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.isReadyToOpen).toBe(true);
    expect(res.body.data.checks.classes.passed).toBe(true);
    expect(res.body.data.checks.academicRules.passed).toBe(true);
    expect(res.body.data.checks.feeSetup.passed).toBe(true);
  });

  // AREA 1: ROLE MAPPING & AUTHORIZATION
  describe('Area 1: Role Mapping and Rollover Authorization', () => {
    it('verifies academic_officer has create/validate permissions and no outdated school_admin exists', () => {
      const roleCodes = DEFAULT_CORE_ROLES.map((r) => r.code);
      expect(roleCodes).not.toContain('school_admin');
      expect(roleCodes).toContain('academic_officer');
      expect(roleCodes).toContain('branch_manager');
      expect(roleCodes).toContain('director');
      expect(roleCodes).toContain('super_admin');

      const aoRole = DEFAULT_CORE_ROLES.find((r) => r.code === 'academic_officer')!;
      expect(aoRole.permissions).toContain('rollover.view.own_branch');
      expect(aoRole.permissions).toContain('rollover.create.own_branch');
      expect(aoRole.permissions).toContain('rollover.validate.own_branch');
      expect(aoRole.permissions).not.toContain('rollover.approve.own_branch');
      expect(aoRole.permissions).not.toContain('rollover.approve.all_branches');

      const bmRole = DEFAULT_CORE_ROLES.find((r) => r.code === 'branch_manager')!;
      expect(bmRole.permissions).toContain('rollover.approve.own_branch');

      const dirRole = DEFAULT_CORE_ROLES.find((r) => r.code === 'director')!;
      expect(dirRole.permissions).toContain('rollover.approve.all_branches');
    });

    it('rejects plan approval if user lacks rollover.approve permissions (e.g. academic_officer)', async () => {
      const planId = new Types.ObjectId().toString();
      const res = await request(app)
        .post(`/api/v1/rollovers/${planId}/approve`)
        .set('X-User-Id', new Types.ObjectId().toString())
        .set(
          'X-User-Permissions',
          'rollover.view.own_branch,rollover.create.own_branch,rollover.validate.own_branch',
        )
        .set('X-Branch-Access', mockBranchId)
        .send({});

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });

  // AREA 2: PROGRAM-SPECIFIC ACADEMIC CONTEXT
  describe('Area 2: Program-Specific Academic Context Scoping', () => {
    it('scopes rollover class and enrollment queries by programId when provided', async () => {
      vi.spyOn(AcademicYearModel, 'findOne')
        .mockResolvedValueOnce({
          _id: mockSourceYearId,
          name: '2025-2026',
          code: 'AY2526',
        } as never)
        .mockResolvedValueOnce({
          _id: mockTargetYearId,
          name: '2026-2027',
          code: 'AY2627',
        } as never);

      vi.spyOn(AcademicPeriodModel, 'findOne')
        .mockResolvedValueOnce({
          _id: mockSourcePeriodId,
          name: 'Term 1',
          code: 'T1',
          status: 'finalized',
          programId: mockProgramId,
          academicYearId: mockSourceYearId,
        } as never)
        .mockResolvedValueOnce({
          _id: mockTargetPeriodId,
          name: 'Term 2',
          code: 'T2',
          status: 'planned',
          programId: mockProgramId,
          academicYearId: mockTargetYearId,
        } as never);

      vi.spyOn(AcademicRolloverPlanModel, 'findOne').mockResolvedValue(null);

      const classFindSpy = vi.spyOn(ClassModel, 'find').mockReturnValue({
        lean: vi.fn().mockResolvedValue([]),
      } as never);

      const enrollmentFindSpy = vi.spyOn(EnrollmentModel, 'find').mockReturnValue({
        lean: vi.fn().mockResolvedValue([]),
      } as never);

      vi.spyOn(TermResultModel, 'find').mockReturnValue({
        lean: vi.fn().mockResolvedValue([]),
      } as never);

      vi.spyOn(LevelModel, 'find').mockReturnValue({
        sort: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue([]),
      } as never);

      vi.spyOn(SequenceService, 'getNextSequence').mockResolvedValue('ROL-0002');
      const createSpy = vi.spyOn(AcademicRolloverPlanModel, 'create').mockResolvedValue({
        _id: new Types.ObjectId(),
        planCode: 'ROL-0002',
        programId: new Types.ObjectId(mockProgramId),
        studentDecisions: [],
        classMappings: [],
      } as never);

      vi.spyOn(AcademicRolloverPlanModel, 'updateOne').mockResolvedValue({
        acknowledged: true,
      } as never);

      await request(app).post('/api/v1/rollovers').send({
        branchId: mockBranchId,
        programId: mockProgramId,
        sourceAcademicYearId: mockSourceYearId,
        sourcePeriodId: mockSourcePeriodId,
        targetAcademicYearId: mockTargetYearId,
        targetPeriodId: mockTargetPeriodId,
      });

      expect(classFindSpy).toHaveBeenCalledWith(
        expect.objectContaining({ programId: new Types.ObjectId(mockProgramId) }),
      );
      expect(enrollmentFindSpy).toHaveBeenCalledWith(
        expect.objectContaining({ programId: new Types.ObjectId(mockProgramId) }),
      );
      expect(createSpy).toHaveBeenCalledWith(
        expect.objectContaining({ programId: new Types.ObjectId(mockProgramId) }),
      );
    });
  });

  // AREA 3: SCOPED PERIOD CLOSING LOCK PROTECTION
  describe('Area 3: Scoped Period Write Lock Protection', () => {
    it('does not lock unrelated active program when a specific program period is closed', async () => {
      const englishProgramId = new Types.ObjectId().toString();
      const computerProgramId = new Types.ObjectId().toString();
      const closedEnglishPeriodId = new Types.ObjectId().toString();

      vi.spyOn(AcademicPeriodModel, 'findOne').mockResolvedValue({
        _id: closedEnglishPeriodId,
        name: 'English Term 1',
        status: 'closed',
        programId: new Types.ObjectId(englishProgramId),
        academicYearId: mockSourceYearId,
      } as never);

      vi.spyOn(AcademicYearModel, 'findOne').mockResolvedValue({
        _id: mockSourceYearId,
        name: '2025-2026',
        status: 'active',
      } as never);

      // Operation on computer program should SUCCEED even if English period is closed
      await expect(
        assertAcademicContextWritable({
          academicPeriodId: closedEnglishPeriodId,
          programId: computerProgramId,
          operation: 'enter scores',
        }),
      ).resolves.toBeUndefined();

      // Operation on English program should be BLOCKED with ConflictError
      await expect(
        assertAcademicContextWritable({
          academicPeriodId: closedEnglishPeriodId,
          programId: englishProgramId,
          operation: 'enter scores',
        }),
      ).rejects.toThrow(/read-only/i);
    });
  });

  // AREA 4: STUDENT ROLLOVER DECISION OVERRIDE
  describe('Area 4: Student Rollover Decision Override', () => {
    it('preserves systemRecommendedDecision when an authorized officer overrides decision to HOLD', async () => {
      const planId = new Types.ObjectId().toString();
      const studentId = new Types.ObjectId();
      const enrollmentId = new Types.ObjectId();

      const existingPlan = {
        _id: planId,
        planCode: 'ROL-0003',
        schoolId: mockSchoolId,
        branchId: mockBranchId,
        sourcePeriodId: mockSourcePeriodId,
        status: 'draft',
        classMappings: [],
        studentDecisions: [
          {
            studentId,
            sourceEnrollmentId: enrollmentId,
            systemRecommendedDecision: 'PROMOTE',
            finalDecision: 'PROMOTE',
            decision: 'PROMOTE',
            reason: 'Auto-promoted',
            isProcessed: false,
          },
        ],
      };

      vi.spyOn(AcademicRolloverPlanModel, 'findOne').mockReturnValue({
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(existingPlan),
      } as never);

      let capturedUpdate: { studentDecisions?: Array<Record<string, unknown>> } | null = null;
      vi.spyOn(AcademicRolloverPlanModel, 'findOneAndUpdate').mockImplementation(((
        _query: unknown,
        updates: unknown,
      ) => {
        const u = updates as { $set?: { studentDecisions?: Array<Record<string, unknown>> } };
        capturedUpdate =
          u.$set ?? (updates as { studentDecisions?: Array<Record<string, unknown>> });
        return {
          ...existingPlan,
          ...capturedUpdate,
        };
      }) as never);

      vi.spyOn(AcademicRolloverPlanModel, 'updateOne').mockResolvedValue({
        acknowledged: true,
      } as never);

      const updateRes = await request(app)
        .put(`/api/v1/rollovers/${planId}`)
        .set('X-User-Id', 'officer-123')
        .send({
          studentDecisions: [
            {
              studentId: studentId.toString(),
              sourceEnrollmentId: enrollmentId.toString(),
              finalDecision: 'HOLD',
              reason: 'Academic retention requested by parents and officer',
            },
          ],
        });

      expect(updateRes.status).toBe(200);
      expect(capturedUpdate).not.toBeNull();
      const updatedDecision = capturedUpdate?.studentDecisions?.[0] as Record<string, unknown>;
      // Crucial requirement: systemRecommendedDecision is NOT overwritten
      expect(updatedDecision.systemRecommendedDecision).toBe('PROMOTE');
      expect(updatedDecision.finalDecision).toBe('HOLD');
      expect(updatedDecision.decision).toBe('HOLD');
      expect(updatedDecision.changedBy).toBe('officer-123');
      expect(updatedDecision.changedAt).toBeInstanceOf(Date);
      expect(updatedDecision.reason).toBe('Academic retention requested by parents and officer');
    });
  });

  // AREA 5: TARGET PERIOD READINESS LIFECYCLE
  describe('Area 5: Target Period Readiness Lifecycle (Check -> Approve -> Open)', () => {
    it('POST /target-readiness/:targetPeriodId/approve approves readiness before opening', async () => {
      vi.spyOn(AcademicPeriodModel, 'findOne').mockResolvedValue({
        _id: mockTargetPeriodId,
        schoolId: mockSchoolId,
        name: 'Term 2',
        status: 'planned',
      } as never);

      vi.spyOn(ClassModel, 'find').mockReturnValue({
        lean: vi.fn().mockResolvedValue([{ _id: new Types.ObjectId(), className: 'Class 1' }]),
      } as never);

      vi.spyOn(EnrollmentModel, 'find').mockReturnValue({
        lean: vi.fn().mockResolvedValue([{ _id: new Types.ObjectId() }]),
      } as never);

      vi.spyOn(TeacherAssignmentModel, 'find').mockReturnValue({
        lean: vi.fn().mockResolvedValue([]),
      } as never);

      vi.spyOn(ClassScheduleModel, 'find').mockReturnValue({
        lean: vi.fn().mockResolvedValue([]),
      } as never);

      const updateSpy = vi
        .spyOn(AcademicPeriodModel, 'updateOne')
        .mockResolvedValue({ acknowledged: true } as never);

      const approveRes = await request(app)
        .post(`/api/v1/rollovers/target-readiness/${mockTargetPeriodId}/approve`)
        .set('X-User-Id', 'manager-123')
        .set('X-User-Permissions', 'rollover.approve.own_branch')
        .send({});

      expect(approveRes.status).toBe(200);
      expect(approveRes.body.success).toBe(true);
      expect(updateSpy).toHaveBeenCalledWith(
        { _id: mockTargetPeriodId },
        expect.objectContaining({
          $set: expect.objectContaining({
            readinessApprovedBy: 'manager-123',
          }),
        }),
      );
    });

    it('POST /target-readiness/:targetPeriodId/open opens target period only when in planned status', async () => {
      vi.spyOn(AcademicPeriodModel, 'findOne').mockResolvedValue({
        _id: mockTargetPeriodId,
        schoolId: mockSchoolId,
        name: 'Term 2',
        status: 'planned',
        readinessApprovedBy: 'manager-123',
      } as never);

      vi.spyOn(ClassModel, 'find').mockReturnValue({
        lean: vi.fn().mockResolvedValue([{ _id: new Types.ObjectId(), className: 'Class 1' }]),
      } as never);

      vi.spyOn(EnrollmentModel, 'find').mockReturnValue({
        lean: vi.fn().mockResolvedValue([{ _id: new Types.ObjectId() }]),
      } as never);

      vi.spyOn(TeacherAssignmentModel, 'find').mockReturnValue({
        lean: vi.fn().mockResolvedValue([]),
      } as never);

      vi.spyOn(ClassScheduleModel, 'find').mockReturnValue({
        lean: vi.fn().mockResolvedValue([]),
      } as never);

      vi.spyOn(AcademicPeriodModel, 'findOneAndUpdate').mockResolvedValue({
        _id: mockTargetPeriodId,
        name: 'Term 2',
        status: 'open',
        openedBy: 'manager-123',
      } as never);

      const openRes = await request(app)
        .post(`/api/v1/rollovers/target-readiness/${mockTargetPeriodId}/open`)
        .set('X-User-Id', 'manager-123')
        .set('X-User-Permissions', 'rollover.execute.own_branch')
        .send({});

      expect(openRes.status).toBe(200);
      expect(openRes.body.success).toBe(true);
      expect(openRes.body.data.status).toBe('open');
    });
  });
});
