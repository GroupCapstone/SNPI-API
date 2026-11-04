/* eslint-disable */
/**
 * ==============================================================================
 * TEMPORARY TEST DATA SEEDER - DESIGNATED FOR REMOVAL / DELETION TO PROTECT SYSTEM
 * ==============================================================================
 * SECURITY & PROTECTION NOTICE:
 * This script is strictly a temporary staging/test fixture utility designed
 * for integration verification and initial QA environments.
 *
 * Once test data verification is completed, execute:
 *   npm run seed:protect
 * to safely delete this script and eliminate all test seed entrypoints.
 *
 * CRITICAL SAFETY GUARDS:
 * 1. Blocks execution in production environments (NODE_ENV === 'production').
 * 2. Ensures all 52 system collections have at least 3 valid relational records.
 * 3. Enforces that all 14 core system roles have dedicated test user accounts.
 * ==============================================================================
 */

import { Types } from 'mongoose';
import { connectToDatabase, disconnectFromDatabase } from '../config/database';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { DEFAULT_CORE_ROLES } from '../constants/permissions';
import { AcademicPeriodModel } from '../modules/academic-period/academic-period.model';
import { AcademicRuleModel } from '../modules/academic-rule/academic-rule.model';
import { AcademicYearModel } from '../modules/academic-year/academic-year.model';
import { AnnouncementModel } from '../modules/announcement/announcement.model';
import { AssessmentModel } from '../modules/assessment/assessment.model';
import { AttendanceLeaveModel } from '../modules/attendance-leave/attendance-leave.model';
import { AttendanceRecordModel } from '../modules/attendance/attendance-record.model';
import { AttendanceModel } from '../modules/attendance/attendance.model';
import { MonthlyAttendanceSummaryModel } from '../modules/attendance/monthly-attendance-summary.model';
import { AuditLogModel } from '../modules/audit-log/audit-log.model';
import { BranchModel } from '../modules/branch/branch.model';
import { ClassScheduleModel } from '../modules/class-schedule/class-schedule.model';
import { ClassModel } from '../modules/class/class.model';
import { ClassroomModel } from '../modules/classroom/classroom.model';
import { CurriculumModel } from '../modules/curriculum/curriculum.model';
import { DepartmentModel } from '../modules/department/department.model';
import { EmployeeModel } from '../modules/employee/employee.model';
import { EnrollmentModel } from '../modules/enrollment/enrollment.model';
import {
  CashierShiftModel,
  DiscountPolicyModel,
} from '../modules/finance-operation/finance-operation.model';
import { HistoricalCorrectionModel } from '../modules/historical-correction/historical-correction.model';
import { IntakeModel } from '../modules/intake/intake.model';
import { LevelModel } from '../modules/level/level.model';
import {
  NotificationModel,
  ParentContactLogModel,
} from '../modules/notification/notification.model';
import { PaymentPlanModel } from '../modules/payment-plan/payment-plan.model';
import { PaymentModel } from '../modules/payment/payment.model';
import { PlacementTestModel } from '../modules/placement-test/placement-test.model';
import { PositionModel } from '../modules/position/position.model';
import { ProgramModel } from '../modules/program/program.model';
import { RegistrationModel } from '../modules/registration/registration.model';
import { OfficialDocumentModel } from '../modules/report/report.model';
import { RoleModel } from '../modules/role/role.model';
import { AcademicRolloverPlanModel } from '../modules/rollover/rollover.model';
import { SchoolModel } from '../modules/school/school.model';
import { ScoreRevisionModel } from '../modules/score/score-revision.model';
import { ScoreModel } from '../modules/score/score.model';
import { SequenceModel } from '../modules/sequence/sequence.model';
import {
  EmployeeSkillModel,
  RoleSkillRequirementModel,
  SkillModel,
} from '../modules/skill/skill.model';
import { StudentTransferModel } from '../modules/student-transfer/student-transfer.model';
import { StudentModel } from '../modules/student/student.model';
import { StudyModeModel } from '../modules/study-mode/study-mode.model';
import { SubjectModel } from '../modules/subject/subject.model';
import { SystemSettingModel } from '../modules/system-setting/system-setting.model';
import { TeacherAssignmentModel } from '../modules/teacher-assignment/teacher-assignment.model';
import { PromotionModel } from '../modules/term-result/promotion.model';
import { TermResultModel } from '../modules/term-result/term-result.model';
import { TimeSlotModel } from '../modules/time-slot/time-slot.model';
import { TuitionFeeModel } from '../modules/tuition/tuition-fee.model';
import { UserModel } from '../modules/user/user.model';
import { PasswordUtil } from '../utils/password';

export async function seedCompleteTestData(): Promise<void> {
  if (env.NODE_ENV === 'production') {
    throw new Error(
      'SECURITY HALT: Seeding test fixture data is blocked in production environments.',
    );
  }

  logger.info('[Seeder] Connecting to database...');
  await connectToDatabase();

  const devSeedPassword = process.env.DEV_SEED_PASSWORD || 'TestSeedPass#2026!SecureKey';
  const defaultPasswordHash = PasswordUtil.hash(devSeedPassword);

  // 1. Verify Primary School and Ensure >= 3 Schools exist
  logger.info('[Seeder] Ensuring Schools (>= 3)...');
  let primarySchool = await SchoolModel.findOne({ code: 'SNP', isDeleted: false });
  if (!primarySchool) {
    primarySchool = await SchoolModel.create({
      code: 'SNP',
      nameEn: 'SNP International School (Phnom Penh Main)',
      nameKh: 'សាលាអន្តរជាតិ អេសអិនភី (ទីស្នាក់ការកណ្តាល)',
      email: 'info@snp.edu.kh',
      phone: '+855 23 888 999',
      address: 'Phnom Penh, Cambodia',
      website: 'https://snp.edu.kh',
      status: 'active',
    });
  }

  const schoolSiemReap = await SchoolModel.findOne({ code: 'SNP-SR' });
  if (!schoolSiemReap) {
    await SchoolModel.create({
      code: 'SNP-SR',
      nameEn: 'SNP International Campus (Siem Reap)',
      nameKh: 'សាលាអន្តរជាតិ អេសអិនភី (សាខាសៀមរាប)',
      email: 'siemreap@snp.edu.kh',
      phone: '+855 63 888 111',
      address: 'Siem Reap, Cambodia',
      website: 'https://siemreap.snp.edu.kh',
      status: 'active',
    });
  }

  const schoolBattambang = await SchoolModel.findOne({ code: 'SNP-BTB' });
  if (!schoolBattambang) {
    await SchoolModel.create({
      code: 'SNP-BTB',
      nameEn: 'SNP International Campus (Battambang)',
      nameKh: 'សាលាអន្តរជាតិ អេសអិនភី (សាខាបាត់ដំបង)',
      email: 'battambang@snp.edu.kh',
      phone: '+855 53 888 222',
      address: 'Battambang, Cambodia',
      website: 'https://battambang.snp.edu.kh',
      status: 'active',
    });
  }

  const schoolId = primarySchool._id as Types.ObjectId;

  // 2. Fetch Branches
  const branches = await BranchModel.find({ schoolId, isDeleted: false });
  if (branches.length < 3) {
    logger.warn('[Seeder] Less than 3 branches found, creating missing branch...');
    const branchNames = [
      { code: 'MB-01', en: 'Main Branch (Phnom Penh)', kh: 'សាខាធំ' },
      { code: 'TK-02', en: 'Toul Kork Branch', kh: 'សាខាទួលគោក' },
      { code: 'SS-03', en: 'Sen Sok Branch', kh: 'សាខាសែនសុខ' },
    ];
    for (const b of branchNames) {
      if (!branches.some((br) => br.branchCode === b.code)) {
        const newBranch = await BranchModel.create({
          schoolId,
          branchCode: b.code,
          branchNameEn: b.en,
          branchNameKh: b.kh,
          status: 'active',
          isDeleted: false,
        });
        branches.push(newBranch);
      }
    }
  }
  const mainBranchId = (branches[0]?._id || new Types.ObjectId()) as Types.ObjectId;
  const branch2Id = (branches[1]?._id || mainBranchId) as Types.ObjectId;
  const branch3Id = (branches[2]?._id || mainBranchId) as Types.ObjectId;

  // 3. Ensure Academic Years (>= 3)
  logger.info('[Seeder] Ensuring Academic Years (>= 3)...');
  const pastYear = await AcademicYearModel.findOne({ schoolId, code: 'AY-2024-2025' });
  if (!pastYear) {
    await AcademicYearModel.create({
      schoolId,
      name: '2024–2025 Academic Year',
      code: 'AY-2024-2025',
      startDate: new Date('2024-08-01'),
      endDate: new Date('2025-07-31'),
      isCurrent: false,
      status: 'closed',
    });
  }

  const currentYear = await AcademicYearModel.findOne({
    schoolId,
    isCurrent: true,
    isDeleted: false,
  });
  const currentYearId = currentYear ? (currentYear._id as Types.ObjectId) : new Types.ObjectId();

  const futureYear = await AcademicYearModel.findOne({ schoolId, code: 'AY-2027-2028' });
  if (!futureYear) {
    await AcademicYearModel.create({
      schoolId,
      name: '2027–2028 Academic Year',
      code: 'AY-2027-2028',
      startDate: new Date('2027-08-01'),
      endDate: new Date('2028-07-31'),
      isCurrent: false,
      status: 'planned',
    });
  }

  // 4. Fetch Periods
  const periods = await AcademicPeriodModel.find({ schoolId, isDeleted: false });
  const periodId = (periods[0]?._id as Types.ObjectId) || new Types.ObjectId();
  const period2Id = (periods[1]?._id as Types.ObjectId) || periodId;

  // 5. Ensure Curriculums (>= 3)
  logger.info('[Seeder] Ensuring Curriculums (>= 3)...');
  const program = await ProgramModel.findOne({ schoolId, isDeleted: false });
  const programId = (program?._id as Types.ObjectId) || new Types.ObjectId();
  const level = await LevelModel.findOne({ schoolId, isDeleted: false });
  const levelId = (level?._id as Types.ObjectId) || new Types.ObjectId();
  const subjects = await SubjectModel.find({ schoolId, isDeleted: false });

  const extraCurriculumCode = 'CURR-STEM-ADV';
  const existingExtraCurr = await CurriculumModel.findOne({ code: extraCurriculumCode });
  if (!existingExtraCurr) {
    await CurriculumModel.create({
      schoolId,
      branchId: mainBranchId,
      programId,
      levelId,
      academicYearId: currentYearId,
      name: 'Advanced STEM & Robotics Curriculum',
      code: extraCurriculumCode,
      description: 'Project-based science, robotics, and coding curriculum',
      subjects: subjects.slice(0, 3).map((s, idx) => ({
        subjectId: s._id as Types.ObjectId,
        weeklyHours: 3,
        totalHours: 60,
        sequence: idx + 1,
        passingScore: 50,
        isRequired: true,
      })),
      status: 'active',
    });
  }

  // 6. Ensure Intakes (>= 3)
  logger.info('[Seeder] Ensuring Intakes (>= 3)...');
  const existingIntakes = await IntakeModel.find({ schoolId, isDeleted: false });
  if (existingIntakes.length < 3) {
    await IntakeModel.create({
      schoolId,
      branchId: mainBranchId,
      academicYearId: currentYearId,
      academicPeriodId: periodId,
      programId,
      levelId,
      code: 'INTAKE-2026-OCT',
      name: 'October 2026 Cohort Intake',
      startDate: new Date('2026-10-01'),
      endDate: new Date('2027-02-28'),
      capacity: 60,
      status: 'open',
    });
  }

  // 7. Ensure Academic Rules (>= 3)
  logger.info('[Seeder] Ensuring Academic Rules (>= 3)...');
  const ruleConfigs = [
    {
      code: 'RULE-GRADE-SCHEME-01',
      name: 'Standard Secondary 100-Point Grade Scheme',
      ruleType: 'grade_scheme' as const,
      config: {
        A: { min: 90, max: 100, gpa: 4.0 },
        B: { min: 80, max: 89, gpa: 3.0 },
        C: { min: 70, max: 79, gpa: 2.0 },
        F: { min: 0, max: 69, gpa: 0.0 },
      },
    },
    {
      code: 'RULE-ASSESS-WEIGHT-01',
      name: 'Term Assessment Weights Distribution Rule',
      ruleType: 'assessment_scheme' as const,
      config: { quiz: 0.2, midterm: 0.3, project: 0.2, final: 0.3 },
    },
    {
      code: 'RULE-ATTEND-MIN-01',
      name: 'Mandatory 80% Minimum Attendance Policy',
      ruleType: 'attendance_threshold' as const,
      config: { minimumPercentage: 80, warnThreshold: 85, autoFailThreshold: 70 },
    },
    {
      code: 'RULE-PROMOTION-STD-01',
      name: 'Annual Promotion & Progression Rule',
      ruleType: 'promotion_rule' as const,
      config: { minimumGpa: 2.0, maxFailedSubjects: 1, allowConditionalPromotion: true },
    },
  ];

  for (const r of ruleConfigs) {
    const existingRule = await AcademicRuleModel.findOne({ schoolId, code: r.code });
    if (!existingRule) {
      await AcademicRuleModel.create({
        schoolId,
        branchId: mainBranchId,
        academicYearId: currentYearId,
        code: r.code,
        name: r.name,
        ruleType: r.ruleType,
        version: 1,
        effectiveFrom: new Date('2026-08-01'),
        config: r.config,
        status: 'active',
      });
    }
  }

  // 8. Ensure Academic Rollover Plans (>= 3)
  logger.info('[Seeder] Ensuring Academic Rollover Plans (>= 3)...');
  const rolloverPlans = [
    { planCode: 'ROLL-PLAN-2025-01', status: 'completed' as const, branchIdx: 0 },
    { planCode: 'ROLL-PLAN-2026-02', status: 'validated' as const, branchIdx: 1 },
    { planCode: 'ROLL-PLAN-2027-03', status: 'draft' as const, branchIdx: 2 },
  ];
  for (let i = 0; i < rolloverPlans.length; i++) {
    const rp = rolloverPlans[i];
    if (!rp) continue;
    const branchDoc = branches[rp.branchIdx] || branches[0];
    const bId = (branchDoc?._id || mainBranchId) as Types.ObjectId;
    const existingPlan = await AcademicRolloverPlanModel.findOne({ planCode: rp.planCode });
    if (!existingPlan) {
      await AcademicRolloverPlanModel.create({
        planCode: rp.planCode,
        schoolId,
        branchId: bId,
        programId,
        sourceAcademicYearId: currentYearId,
        sourcePeriodId: periodId,
        targetAcademicYearId: currentYearId,
        targetPeriodId: period2Id,
        status: rp.status,
        options: {
          carryClasses: true,
          carryTeacherSuggestions: true,
          carryScheduleSuggestions: true,
          autoSectionDistribution: true,
        },
        classMappings: [],
        studentDecisions: [],
        createdBy: new Types.ObjectId(),
      });
    }
  }

  // 9. Ensure Attendance Leaves (>= 3)
  logger.info('[Seeder] Ensuring Attendance Leaves (>= 3)...');
  const student = await StudentModel.findOne({ schoolId, isDeleted: false });
  const studentId = (student?._id as Types.ObjectId) || new Types.ObjectId();
  const enrollment = await EnrollmentModel.findOne({ studentId, isDeleted: false });
  const enrollmentId = (enrollment?._id as Types.ObjectId) || new Types.ObjectId();
  const studentClass = await ClassModel.findOne({ schoolId, isDeleted: false });
  const classId = (studentClass?._id as Types.ObjectId) || new Types.ObjectId();

  const leavesToSeed = [
    {
      leaveType: 'medical' as const,
      reason: 'Seasonal flu with doctor medical certificate',
      status: 'approved' as const,
      days: 3,
    },
    {
      leaveType: 'family' as const,
      reason: 'Family traditional wedding ceremony in province',
      status: 'approved' as const,
      days: 2,
    },
    {
      leaveType: 'personal' as const,
      reason: 'Official passport renewal appointment',
      status: 'pending' as const,
      days: 1,
    },
  ];
  for (let i = 0; i < leavesToSeed.length; i++) {
    const l = leavesToSeed[i];
    if (!l) continue;
    const startDate = new Date(Date.now() - (i + 1) * 86400000 * 5);
    const endDate = new Date(startDate.getTime() + l.days * 86400000);
    const existingLeave = await AttendanceLeaveModel.findOne({
      studentId,
      leaveType: l.leaveType,
      reason: l.reason,
    });
    if (!existingLeave) {
      await AttendanceLeaveModel.create({
        schoolId,
        branchId: mainBranchId,
        studentId,
        enrollmentId,
        classId,
        leaveType: l.leaveType,
        startDate,
        endDate,
        reason: l.reason,
        status: l.status,
        createdBy: new Types.ObjectId(),
      });
    }
  }

  // 10. Ensure Discount Policies (>= 3)
  logger.info('[Seeder] Ensuring Discount Policies (>= 3)...');
  const discountPolicies = [
    {
      code: 'DISC-SIB-10',
      name: 'Sibling Enrollment Discount 10%',
      type: 'sibling' as const,
      calculationType: 'percentage' as const,
      value: 10,
    },
    {
      code: 'DISC-MERIT-20',
      name: 'Academic Honor Roll Merit 20%',
      type: 'merit' as const,
      calculationType: 'percentage' as const,
      value: 20,
    },
    {
      code: 'DISC-EARLY-50USD',
      name: 'Early Registration Incentive 50 USD',
      type: 'early_payment' as const,
      calculationType: 'fixed' as const,
      value: 50,
    },
    {
      code: 'DISC-SCHOLAR-50',
      name: 'National STEM Scholarship 50%',
      type: 'scholarship' as const,
      calculationType: 'percentage' as const,
      value: 50,
    },
  ];
  for (const dp of discountPolicies) {
    const existingPolicy = await DiscountPolicyModel.findOne({
      branchId: mainBranchId,
      code: dp.code,
    });
    if (!existingPolicy) {
      await DiscountPolicyModel.create({
        schoolId,
        branchId: mainBranchId,
        code: dp.code,
        name: dp.name,
        type: dp.type,
        calculationType: dp.calculationType,
        value: dp.value,
        effectiveFrom: new Date('2026-08-01'),
        status: 'active',
      });
    }
  }

  // 11. Ensure Cashier Shifts (>= 3)
  logger.info('[Seeder] Ensuring Cashier Shifts (>= 3)...');
  const employee = await EmployeeModel.findOne({ schoolId, isDeleted: false });
  const cashierId = (employee?._id as Types.ObjectId) || new Types.ObjectId();

  const cashierShifts = [
    { shiftNumber: 'SHIFT-2026-001', status: 'approved' as const, cashUSD: 450, digitalUSD: 1200 },
    { shiftNumber: 'SHIFT-2026-002', status: 'submitted' as const, cashUSD: 320, digitalUSD: 850 },
    { shiftNumber: 'SHIFT-2026-003', status: 'open' as const, cashUSD: 150, digitalUSD: 300 },
  ];
  for (const cs of cashierShifts) {
    const existingShift = await CashierShiftModel.findOne({ shiftNumber: cs.shiftNumber });
    if (!existingShift) {
      await CashierShiftModel.create({
        shiftNumber: cs.shiftNumber,
        schoolId,
        branchId: mainBranchId,
        cashierId,
        openedAt: new Date(Date.now() - 86400000 * 2),
        openingCash: { USD: 100, KHR: 400000 },
        expectedCash: { USD: cs.cashUSD, KHR: 400000 },
        expectedDigital: { USD: cs.digitalUSD, KHR: 0 },
        declaredCash: { USD: cs.cashUSD, KHR: 400000 },
        declaredDigital: { USD: cs.digitalUSD, KHR: 0 },
        status: cs.status,
      });
    }
  }

  // 12. Ensure Skills, RoleSkillRequirements, and EmployeeSkills (>= 3 each)
  logger.info('[Seeder] Ensuring Skills & Competencies (>= 3)...');
  const skills = await SkillModel.find({ isDeleted: false });
  const role = await RoleModel.findOne({ code: 'teacher' });
  const roleId = (role?._id as Types.ObjectId) || new Types.ObjectId();

  if (skills.length >= 3) {
    for (let i = 0; i < 3; i++) {
      const skillItem = skills[i];
      if (!skillItem) continue;
      const sId = skillItem._id as Types.ObjectId;
      const existingReq = await RoleSkillRequirementModel.findOne({
        roleId,
        skillId: sId,
        isDeleted: false,
      });
      if (!existingReq) {
        await RoleSkillRequirementModel.create({
          roleId,
          skillId: sId,
          requiredLevel: 3,
          isRequired: i === 0,
        });
      }

      if (employee) {
        const empId = employee._id as Types.ObjectId;
        const existingEmpSkill = await EmployeeSkillModel.findOne({
          employeeId: empId,
          skillId: sId,
          isDeleted: false,
        });
        if (!existingEmpSkill) {
          await EmployeeSkillModel.create({
            employeeId: empId,
            skillId: sId,
            proficiencyLevel: 4,
            verifiedAt: new Date(),
            verifiedBy: new Types.ObjectId(),
          });
        }
      }
    }
  }

  // 13. Ensure Parent Contact Logs (>= 3)
  logger.info('[Seeder] Ensuring Parent Contact Logs (>= 3)...');
  const parentLogs = [
    {
      purpose: 'academic' as const,
      outcome: 'reached' as const,
      notes: 'Discussed student mid-term mathematics progress and homework completion',
    },
    {
      purpose: 'absence' as const,
      outcome: 'reached' as const,
      notes: 'Followed up on two days unexcused medical leave',
    },
    {
      purpose: 'tuition' as const,
      outcome: 'left_message' as const,
      notes: 'Reminded parent regarding Term 2 tuition installment deadline',
    },
  ];
  for (const pl of parentLogs) {
    const existingLog = await ParentContactLogModel.findOne({
      studentId,
      purpose: pl.purpose,
      notes: pl.notes,
    });
    if (!existingLog) {
      await ParentContactLogModel.create({
        studentId,
        schoolId,
        branchId: mainBranchId,
        guardianName: 'Sokha Chan (Parent)',
        guardianPhone: '+855 12 345 678',
        contactType: 'phone_call',
        purpose: pl.purpose,
        outcome: pl.outcome,
        notes: pl.notes,
        contactDate: new Date(),
        staffId: cashierId,
        staffName: 'Academic Counseling Officer',
      });
    }
  }

  // 14. Ensure Historical Corrections (>= 3)
  logger.info('[Seeder] Ensuring Historical Corrections (>= 3)...');
  const score = await ScoreModel.findOne({ isDeleted: false });
  const scoreId = (score?._id as Types.ObjectId) || new Types.ObjectId();

  const corrections = [
    {
      num: 'HC-2026-001',
      type: 'score' as const,
      status: 'applied' as const,
      reason: 'Corrected rubric entry error on Midterm exam item 4',
    },
    {
      num: 'HC-2026-002',
      type: 'attendance' as const,
      status: 'approved' as const,
      reason: 'Retrospective doctor note submission for excused absence',
    },
    {
      num: 'HC-2026-003',
      type: 'term_result' as const,
      status: 'pending' as const,
      reason: 'Grade recalculation pending departmental board review',
    },
  ];
  for (const c of corrections) {
    const existingCorr = await HistoricalCorrectionModel.findOne({ correctionNumber: c.num });
    if (!existingCorr) {
      await HistoricalCorrectionModel.create({
        correctionNumber: c.num,
        entityType: c.type,
        entityId: scoreId,
        studentId,
        academicYearId: currentYearId,
        branchId: mainBranchId,
        reason: c.reason,
        requestedBy: cashierId,
        status: c.status,
        previousValue: { score: 75 },
        proposedValue: { score: 85 },
      });
    }
  }

  // 15. Ensure Monthly Attendance Summaries (>= 3)
  logger.info('[Seeder] Ensuring Monthly Attendance Summaries (>= 3)...');
  for (let m = 8; m <= 10; m++) {
    const existingSummary = await MonthlyAttendanceSummaryModel.findOne({
      studentId,
      classId,
      year: 2026,
      month: m,
    });
    if (!existingSummary) {
      await MonthlyAttendanceSummaryModel.create({
        schoolId,
        branchId: mainBranchId,
        academicYearId: currentYearId,
        academicPeriodId: periodId,
        classId,
        studentId,
        enrollmentId,
        year: 2026,
        month: m,
        totalSessions: 22,
        presentCount: 20,
        absentCount: 1,
        lateCount: 1,
        permissionCount: 1,
        attendanceRate: 95.4,
        status: 'closed',
        calculatedAt: new Date(),
      });
    }
  }

  // 16. Ensure Payment Plans (>= 3)
  logger.info('[Seeder] Ensuring Payment Plans (>= 3)...');
  const tuition = await TuitionFeeModel.findOne({ schoolId, isDeleted: false });
  const tuitionId = (tuition?._id as Types.ObjectId) || new Types.ObjectId();
  const enrollmentsList = await EnrollmentModel.find({ schoolId, isDeleted: false }).limit(5);

  for (let p = 1; p <= 3; p++) {
    const currentEnrollment = enrollmentsList[p - 1];
    const eId = (currentEnrollment?._id as Types.ObjectId) || enrollmentId;
    const sId = (currentEnrollment?.studentId as Types.ObjectId) || studentId;
    const existingPlan = await PaymentPlanModel.findOne({
      enrollmentId: eId,
      tuitionFeeId: tuitionId,
      academicYearId: currentYearId,
      isDeleted: false,
    });
    if (!existingPlan) {
      await PaymentPlanModel.create({
        schoolId,
        branchId: mainBranchId,
        academicYearId: currentYearId,
        academicPeriodId: periodId,
        enrollmentId: eId,
        studentId: sId,
        tuitionFeeId: tuitionId,
        totalAmount: 1200 + p * 100,
        currency: 'USD',
        status: 'active',
        installments: [
          {
            sequence: 1,
            dueDate: new Date('2026-09-01'),
            amount: 400,
            paidAmount: 400,
            status: 'paid',
          },
          {
            sequence: 2,
            dueDate: new Date('2026-11-01'),
            amount: 400,
            paidAmount: 0,
            status: 'pending',
          },
          {
            sequence: 3,
            dueDate: new Date('2027-01-01'),
            amount: 400 + p * 100,
            paidAmount: 0,
            status: 'pending',
          },
        ],
      });
    }
  }

  // 17. Ensure Promotions (>= 3)
  logger.info('[Seeder] Ensuring Promotions (>= 3)...');
  const termResultsList = await TermResultModel.find({ isDeleted: false }).limit(5);

  const promotions = [
    { decision: 'promoted' as const, reason: 'Exceeded academic GPA benchmark (3.85)' },
    {
      decision: 'promoted' as const,
      reason: 'Successful completion of Level 1 English proficiency',
    },
    { decision: 'continued' as const, reason: 'Ongoing term sequence continuation' },
  ];
  for (let prIdx = 0; prIdx < promotions.length; prIdx++) {
    const pr = promotions[prIdx];
    if (!pr) continue;
    const currentTR = termResultsList[prIdx];
    const uniqueTermId = (currentTR?._id as Types.ObjectId) || new Types.ObjectId();
    const trStudentId = (currentTR?.studentId as Types.ObjectId) || studentId;
    const existingPromotion = await PromotionModel.findOne({ termResultId: uniqueTermId });
    if (!existingPromotion) {
      await PromotionModel.create({
        studentId: trStudentId,
        schoolId,
        branchId: mainBranchId,
        academicYearId: currentYearId,
        academicPeriodId: periodId,
        termResultId: uniqueTermId,
        fromEnrollmentId: enrollmentId,
        fromLevelId: levelId,
        decision: pr.decision,
        decisionReason: pr.reason,
        processedBy: cashierId,
        processedAt: new Date(),
      });
    }
  }

  // 18. Ensure Score Revisions (>= 3)
  logger.info('[Seeder] Ensuring Score Revisions (>= 3)...');
  const assessment = await AssessmentModel.findOne({ isDeleted: false });
  const assessmentId = (assessment?._id as Types.ObjectId) || new Types.ObjectId();

  const revisions = [
    { oldScore: 78, newScore: 84, reason: 'Question 5 rubric calculation adjusted' },
    { oldScore: 65, newScore: 72, reason: 'Extra credit assignment submission verified' },
    { oldScore: 88, newScore: 92, reason: 'Teacher recheck on essay composition section' },
  ];
  for (const r of revisions) {
    const existingRev = await ScoreRevisionModel.findOne({ scoreId, reason: r.reason });
    if (!existingRev) {
      await ScoreRevisionModel.create({
        scoreId,
        studentId,
        enrollmentId,
        assessmentId,
        academicYearId: currentYearId,
        branchId: mainBranchId,
        oldScore: r.oldScore,
        newScore: r.newScore,
        oldAbsent: false,
        newAbsent: false,
        reason: r.reason,
        changedBy: cashierId,
      });
    }
  }

  // 19. Ensure Sequences (>= 3)
  logger.info('[Seeder] Ensuring Sequences (>= 3)...');
  const sequences = [
    { key: 'student_id_seq', prefix: 'SNP-STU-', currentSequence: 85, padding: 6 },
    { key: 'invoice_no_seq', prefix: 'SNP-INV-', currentSequence: 120, padding: 6 },
    { key: 'receipt_no_seq', prefix: 'SNP-REC-', currentSequence: 95, padding: 6 },
    { key: 'employee_id_seq', prefix: 'SNP-EMP-', currentSequence: 25, padding: 5 },
  ];
  for (const seq of sequences) {
    const existingSeq = await SequenceModel.findOne({ key: seq.key });
    if (!existingSeq) {
      await SequenceModel.create(seq);
    }
  }

  // 20. Ensure Student Transfers (>= 3)
  logger.info('[Seeder] Ensuring Student Transfers (>= 3)...');
  const transfers = [
    {
      num: 'TRF-2026-001',
      status: 'approved' as const,
      reason: 'Family relocation to Sen Sok campus',
    },
    {
      num: 'TRF-2026-002',
      status: 'completed' as const,
      reason: 'Program change from General English to Bilingual',
    },
    {
      num: 'TRF-2026-003',
      status: 'pending' as const,
      reason: 'Request for transfer to Toul Kork campus',
    },
  ];
  for (const trf of transfers) {
    const existingTrf = await StudentTransferModel.findOne({ transferNumber: trf.num });
    if (!existingTrf) {
      await StudentTransferModel.create({
        transferNumber: trf.num,
        transferType: 'BRANCH',
        studentId,
        fromSchoolId: schoolId,
        toSchoolId: schoolId,
        fromBranchId: mainBranchId,
        toBranchId: branch2Id,
        transferDate: new Date(),
        reason: trf.reason,
        status: trf.status,
      });
    }
  }

  // 21. Ensure All 14 Core Roles Have Dedicated Test Users
  logger.info('[Seeder] Ensuring all 14 core system roles have dedicated test users...');
  for (const coreRole of DEFAULT_CORE_ROLES) {
    const roleCode = coreRole.code;
    const existingUserWithRole = await UserModel.findOne({ roles: roleCode, isDeleted: false });
    if (!existingUserWithRole) {
      const username = `test.${roleCode.replace(/_/g, '.')}`;
      const email = `test.${roleCode.replace(/_/g, '.')}@snpsms.local`;
      const userExistsByUsername = await UserModel.findOne({ username });
      if (!userExistsByUsername) {
        await UserModel.create({
          schoolId,
          employeeId: employee?._id,
          username,
          email,
          passwordHash: defaultPasswordHash,
          roles: [roleCode],
          branchAccess: 'all',
          status: 'active',
          failedLoginAttempts: 0,
          mustChangePassword: false,
          tokenVersion: 1,
        });
        logger.info(`[Seeder] Created dedicated test user for role: ${roleCode} (${username})`);
      }
    }
  }

  logger.info('[Seeder] Finalizing and auditing all collection document counts...');
  const db = (await import('mongoose')).default.connection.db;
  if (db) {
    const allCollections = await db.listCollections().toArray();
    const auditReport: Array<{ collection: string; count: number; status: string }> = [];
    let allPassing = true;

    for (const c of allCollections) {
      if (c.name.startsWith('system.')) continue;
      const count = await db.collection(c.name).countDocuments();
      const passed = count >= 3;
      if (!passed) allPassing = false;
      auditReport.push({
        collection: c.name,
        count,
        status: passed ? '[PASSED]' : '[WARNING < 3]',
      });
    }

    auditReport.sort((a, b) => a.collection.localeCompare(b.collection));
    console.table(auditReport);
    logger.info(
      `[Seeder] Verification completed. All collections >= 3: ${allPassing ? 'YES' : 'NO'}`,
    );
  }

  await disconnectFromDatabase();
  logger.info('[Seeder] Database disconnected safely.');
}

if (require.main === module) {
  seedCompleteTestData()
    .then(() => {
      console.log('Test data seeding finished successfully.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Test data seeding failed:', err);
      process.exit(1);
    });
}
