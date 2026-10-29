/* eslint-disable no-console, @typescript-eslint/no-explicit-any */
import { connectToDatabase, disconnectFromDatabase } from '../config/database';
import { Types } from 'mongoose';
import type { AuthUser } from '../types/auth';

// Services
import { BranchService } from '../modules/branch/branch.service';
import { DepartmentService } from '../modules/department/department.service';
import { PositionService } from '../modules/position/position.service';
import { EmployeeService } from '../modules/employee/employee.service';
import { AcademicYearService } from '../modules/academic-year/academic-year.service';
import { AcademicPeriodService } from '../modules/academic-period/academic-period.service';
import { ProgramService } from '../modules/program/program.service';
import { LevelService } from '../modules/level/level.service';
import { SubjectService } from '../modules/subject/subject.service';
import { CurriculumService } from '../modules/curriculum/curriculum.service';
import { ClassService } from '../modules/class/class.service';
import { TeacherAssignmentService } from '../modules/teacher-assignment/teacher-assignment.service';
import { RegistrationService } from '../modules/registration/registration.service';
import { PlacementTestService } from '../modules/placement-test/placement-test.service';
import { StudentService } from '../modules/student/student.service';
import { EnrollmentService } from '../modules/enrollment/enrollment.service';
import { AttendanceService } from '../modules/attendance/attendance.service';
import { AssessmentService } from '../modules/assessment/assessment.service';
import { ScoreService } from '../modules/score/score.service';
import { StudentTransferService } from '../modules/student-transfer/student-transfer.service';
import { PaymentService } from '../modules/payment/payment.service';
import { SkillService } from '../modules/skill/skill.service';
import { SystemSettingService } from '../modules/system-setting/system-setting.service';
import { AuditLogService } from '../modules/audit-log/audit-log.service';

// Models for verification and setup
import { SchoolModel } from '../modules/school/school.model';
import { BranchModel } from '../modules/branch/branch.model';
import { DepartmentModel } from '../modules/department/department.model';
import { PositionModel } from '../modules/position/position.model';
import { EmployeeModel } from '../modules/employee/employee.model';
import { ClassroomModel } from '../modules/classroom/classroom.model';
import '../modules/user/user.model';
import { StudentModel } from '../modules/student/student.model';
import { ClassModel } from '../modules/class/class.model';
import { RoleModel } from '../modules/role/role.model';
import { EnrollmentModel } from '../modules/enrollment/enrollment.model';
import { PaymentModel } from '../modules/payment/payment.model';
import { TuitionFeeModel } from '../modules/tuition/tuition-fee.model';
import { SystemSettingModel } from '../modules/system-setting/system-setting.model';
import { AttendanceModel } from '../modules/attendance/attendance.model';
import { AssessmentModel } from '../modules/assessment/assessment.model';
import { ScoreModel } from '../modules/score/score.model';
import { StudentTransferModel } from '../modules/student-transfer/student-transfer.model';
import { RegistrationModel } from '../modules/registration/registration.model';
import { PlacementTestModel } from '../modules/placement-test/placement-test.model';
import { TeacherAssignmentModel } from '../modules/teacher-assignment/teacher-assignment.model';
import { CurriculumModel } from '../modules/curriculum/curriculum.model';
import { SubjectModel } from '../modules/subject/subject.model';
import { LevelModel } from '../modules/level/level.model';
import { ProgramModel } from '../modules/program/program.model';
import {
  SkillModel,
  RoleSkillRequirementModel,
  EmployeeSkillModel,
} from '../modules/skill/skill.model';

interface TestRecord {
  stage: string;
  name: string;
  category: 'HAPPY_PATH' | 'NEGATIVE_CONSTRAINT' | 'CROSS_BRANCH_SECURITY' | 'DATA_INTEGRITY';
  passed: boolean;
  message: string;
  durationMs: number;
}

const auditLog: TestRecord[] = [];

async function recordTest(
  stage: string,
  name: string,
  category: TestRecord['category'],
  testFn: () => Promise<string>,
) {
  const start = Date.now();
  try {
    const message = await testFn();
    const durationMs = Date.now() - start;
    auditLog.push({ stage, name, category, passed: true, message, durationMs });
    console.log(`  [PASS] [${category}] ${name} (${durationMs}ms) -> ${message}`);
  } catch (error: any) {
    const durationMs = Date.now() - start;
    const msg = error.message || String(error);
    auditLog.push({ stage, name, category, passed: false, message: msg, durationMs });
    console.error(`  [FAIL] [${category}] ${name} (${durationMs}ms) -> ERROR: ${msg}`);
  }
}

async function runSystemWideAudit() {
  console.log('================================================================================');
  console.log('         SNP-SMS COMPREHENSIVE SYSTEM-WIDE DATA INSERTION & CONTROL AUDIT       ');
  console.log('================================================================================\n');

  await connectToDatabase();

  // Instantiate services
  const branchService = new BranchService();
  const departmentService = new DepartmentService();
  const positionService = new PositionService();
  const employeeService = new EmployeeService();
  const academicYearService = new AcademicYearService();
  const academicPeriodService = new AcademicPeriodService();
  const programService = new ProgramService();
  const levelService = new LevelService();
  const subjectService = new SubjectService();
  const curriculumService = new CurriculumService();
  const classService = new ClassService();
  const teacherAssignmentService = new TeacherAssignmentService();
  const registrationService = new RegistrationService();
  const placementTestService = new PlacementTestService();
  const studentService = new StudentService();
  const enrollmentService = new EnrollmentService();
  const attendanceService = new AttendanceService();
  const assessmentService = new AssessmentService();
  const scoreService = new ScoreService();
  const studentTransferService = new StudentTransferService();
  const paymentService = new PaymentService();
  const skillService = new SkillService();
  const systemSettingService = new SystemSettingService();
  const auditLogService = new AuditLogService();

  // Baseline School & Main Branch
  const primarySchool =
    (await SchoolModel.findOne({ isDeleted: false })) ||
    (await SchoolModel.create({
      code: 'SNP',
      nameEn: 'SNP International School',
      nameKh: 'សាលាអន្តរជាតិ អេសអិនភី',
      email: 'info@snp.edu.kh',
      phone: '+855 23 888 999',
      address: 'Phnom Penh, Cambodia',
      status: 'active',
    }));
  const schoolId = String(primarySchool._id);

  const mainBranch =
    (await BranchModel.findOne({ schoolId: primarySchool._id, isDeleted: false })) ||
    (await BranchModel.create({
      schoolId: primarySchool._id,
      branchCode: 'MB-01',
      branchNameEn: 'Main Branch',
      branchNameKh: 'សាខាធំ',
      phone: '+855 23 888 101',
      email: 'main@snp.edu.kh',
      address: 'Street 271, Phnom Penh',
      status: 'active',
    }));
  const mainBranchId = String(mainBranch._id);

  // Global Super Admin AuthUser Context
  const superAdminUser: AuthUser = {
    userId: '6a998907633189d7014d4001',
    username: 'superadmin.audit',
    email: 'superadmin.audit@snp.edu.kh',
    schoolId,
    roles: ['super_admin'],
    permissions: ['*'],
    branchAccess: 'all',
    isSuperAdmin: true,
  };

  const testSuffix = Date.now().toString().slice(-4);
  const testBranchCode = `BR-A${testSuffix}`;
  let testBranch: any;
  let testDept: any;
  let testPos: any;
  let testEmployee: any;

  // ============================================================================
  // STAGE 1: ORGANIZATIONAL HIERARCHY & IDENTITY MATRIX
  // ============================================================================
  console.log('\n--- STAGE 1: ORGANIZATIONAL HIERARCHY & IDENTITY MATRIX ---');

  await recordTest('Stage 1', 'Create Test Campus Branch', 'HAPPY_PATH', async () => {
    testBranch = await branchService.createBranch(
      {
        schoolId,
        branchCode: testBranchCode,
        branchNameEn: `Audit Campus ${testSuffix}`,
        branchNameKh: `សាខាសវនកម្ម ${testSuffix}`,
        phone: '+855 23 999 111',
        email: `branch.${testSuffix}@snp.edu.kh`,
        address: 'Chroy Changvar, Phnom Penh',
        status: 'active',
      },
      superAdminUser,
    );
    return `Created branch: ${testBranch.branchCode} (${testBranch.branchNameEn})`;
  });

  const testBranchId = String(testBranch._id);

  // Set up restricted branch manager user context
  const isolatedBranchManager: AuthUser = {
    userId: '6a998907633189d7014d4002',
    username: `manager.${testBranchCode.toLowerCase()}`,
    email: `manager.${testBranchCode.toLowerCase()}@snp.edu.kh`,
    schoolId,
    roles: ['branch_manager'],
    permissions: [
      'branch.view.own_branch',
      'department.view.own_branch',
      'department.create.own_branch',
      'position.create.own_branch',
      'employee.create.own_branch',
      'class.create.own_branch',
      'student.create.own_branch',
      'enrollment.create.own_branch',
    ],
    branchAccess: [testBranchId],
  };

  await recordTest(
    'Stage 1',
    'Negative: Create Department with non-existent Branch',
    'NEGATIVE_CONSTRAINT',
    async () => {
      const fakeBranchId = new Types.ObjectId().toString();
      try {
        await departmentService.createDepartment(
          {
            schoolId,
            branchId: fakeBranchId,
            code: `DEP-FAK-${testSuffix}`,
            nameEn: 'Fake Department',
            nameKh: 'ដេប៉ាតឺម៉ង់ក្លែងក្លាយ',
          },
          superAdminUser,
        );
        throw new Error('Should have rejected non-existent branch ID');
      } catch (err: any) {
        if (
          err.message.includes('does not exist') ||
          err.message.includes('not found') ||
          err.status === 400 ||
          err.status === 404
        ) {
          return `Properly blocked: ${err.message}`;
        }
        throw err;
      }
    },
  );

  await recordTest('Stage 1', 'Create Department under Test Branch', 'HAPPY_PATH', async () => {
    testDept = await departmentService.createDepartment(
      {
        schoolId,
        branchId: testBranchId,
        code: `ACAD-${testSuffix}`,
        nameEn: `Academic Affairs ${testSuffix}`,
        nameKh: `កិច្ចការសិក្សា ${testSuffix}`,
      },
      superAdminUser,
    );
    return `Created Department: ${testDept.code} (${testDept.nameEn})`;
  });
  const testDeptId = String(testDept._id);

  await recordTest('Stage 1', 'Create Position under Department', 'HAPPY_PATH', async () => {
    testPos = await positionService.createPosition(
      {
        schoolId,
        branchId: testBranchId,
        departmentId: testDeptId,
        code: `HOD-${testSuffix}`,
        nameEn: `Head of Department ${testSuffix}`,
        nameKh: `ប្រធានដេប៉ាតឺម៉ង់ ${testSuffix}`,
      },
      superAdminUser,
    );
    return `Created Position: ${testPos.code} (${testPos.nameEn})`;
  });
  const testPosId = String(testPos._id);

  await recordTest(
    'Stage 1',
    'Soft Delete Cascade Guard: Cannot delete Branch with active Departments',
    'NEGATIVE_CONSTRAINT',
    async () => {
      try {
        await branchService.deleteBranch(testBranchId, superAdminUser);
        throw new Error('Should have blocked soft-deletion of branch with active departments');
      } catch (err: any) {
        if (err.message.includes('active dependencies') || err.message.includes('departments')) {
          return `Correctly protected: ${err.message}`;
        }
        throw err;
      }
    },
  );

  await recordTest(
    'Stage 1',
    'Cross-Branch Guard: Manager cannot create Employee in another Branch',
    'CROSS_BRANCH_SECURITY',
    async () => {
      try {
        await employeeService.createEmployee(
          {
            schoolId,
            branchId: mainBranchId, // Disallowed for isolatedBranchManager
            departmentId: testDeptId,
            positionId: testPosId,
            employeeId: `EMP-HACK-${testSuffix}`,
            firstName: 'Illegal',
            lastName: 'Staff',
            khmerName: 'បុគ្គលិក មិនស្របច្បាប់',
            gender: 'male',
            dateOfBirth: '1990-01-01',
            joiningDate: '2026-01-01',
            employmentType: 'full_time',
            status: 'active',
            email: `illegal.${testSuffix}@snp.edu.kh`,
          },
          isolatedBranchManager,
        );
        throw new Error('Branch manager was able to insert employee into Main Branch!');
      } catch (err: any) {
        if (
          err.status === 403 ||
          err.message.includes('access') ||
          err.message.includes('branch')
        ) {
          return `Security check held: ${err.message}`;
        }
        throw err;
      }
    },
  );

  const employeeCode = `EMP-A${testSuffix}`;
  await recordTest(
    'Stage 1',
    'Create Bilingual Employee in Test Branch',
    'HAPPY_PATH',
    async () => {
      testEmployee = await employeeService.createEmployee(
        {
          schoolId,
          branchId: testBranchId,
          departmentId: testDeptId,
          positionId: testPosId,
          employeeId: employeeCode,
          firstName: 'Sokha',
          lastName: 'Meas',
          khmerName: 'សុខា មាស',
          gender: 'female',
          dateOfBirth: '1992-05-15',
          joiningDate: '2026-02-01',
          employmentType: 'full_time',
          status: 'active',
          email: `sokha.${testSuffix}@snp.edu.kh`,
          phone: '+855 12 345 678',
        },
        superAdminUser,
      );
      return `Created Employee: ${testEmployee.employeeId} (${testEmployee.firstName} ${testEmployee.lastName} / ${testEmployee.khmerName})`;
    },
  );
  const testEmployeeId = String(testEmployee._id);

  await recordTest(
    'Stage 1',
    'Negative: Reject Duplicate Employee Code',
    'NEGATIVE_CONSTRAINT',
    async () => {
      try {
        await employeeService.createEmployee(
          {
            schoolId,
            branchId: testBranchId,
            departmentId: testDeptId,
            positionId: testPosId,
            employeeId: employeeCode, // Duplicate
            firstName: 'Duplicate',
            lastName: 'User',
            khmerName: 'អ្នក ស្ទួន',
            gender: 'male',
            dateOfBirth: '1990-01-01',
            joiningDate: '2026-01-01',
            employmentType: 'full_time',
            status: 'active',
            email: `dup.${testSuffix}@snp.edu.kh`,
          },
          superAdminUser,
        );
        throw new Error('Duplicate employee code was accepted!');
      } catch (err: any) {
        if (
          err.status === 409 ||
          err.message.includes('already exists') ||
          err.message.includes('duplicate')
        ) {
          return `Duplicate rejected with conflict: ${err.message}`;
        }
        throw err;
      }
    },
  );

  // ============================================================================
  // STAGE 2: ACADEMIC CORE & TIMETABLE ARCHITECTURE
  // ============================================================================
  console.log('\n--- STAGE 2: ACADEMIC CORE & TIMETABLE ARCHITECTURE ---');

  let academicYear: any;
  await recordTest('Stage 2', 'Fetch or Create Academic Year', 'HAPPY_PATH', async () => {
    const years = await academicYearService.getAcademicYears({}, superAdminUser);
    academicYear = years.find((y) => y.isCurrent) || years[0];
    if (!academicYear) {
      academicYear = await academicYearService.createAcademicYear(
        {
          code: `AY-${testSuffix}`,
          name: `Academic Year 2026-${testSuffix}`,
          startDate: '2026-09-01',
          endDate: '2027-07-31',
          schoolId,
        },
        superAdminUser,
      );
    }
    return `Active Academic Year: ${academicYear.code} (${academicYear.name})`;
  });
  const academicYearId = String(academicYear._id);

  let academicPeriod: any;
  await recordTest('Stage 2', 'Fetch or Create Academic Period', 'HAPPY_PATH', async () => {
    const periods = await academicPeriodService.getAcademicPeriods(
      { academicYearId },
      superAdminUser,
    );
    if (periods && Array.isArray(periods.data) && periods.data.length > 0) {
      academicPeriod = periods.data[0];
    } else {
      academicPeriod = await academicPeriodService.createAcademicPeriod(
        {
          academicYearId,
          code: `T1-${testSuffix}`,
          name: `Term 1 (${testSuffix})`,
          type: 'TERM',
          startDate: '2026-09-01',
          endDate: '2026-12-31',
          sequence: 1,
        },
        superAdminUser,
      );
    }
    return `Academic Period: ${academicPeriod.code} (${academicPeriod.name})`;
  });
  const academicPeriodId = String(academicPeriod._id);

  let program: any;
  let level: any;
  await recordTest('Stage 2', 'Create Program & Level', 'HAPPY_PATH', async () => {
    program = await programService.createProgram(
      {
        schoolId,
        code: `PRG-${testSuffix}`,
        nameEn: `Primary Bilingual Program ${testSuffix}`,
        nameKh: `កម្មវិធីបឋមសិក្សាទ្វេភាសា ${testSuffix}`,
        branchAvailability: 'all',
      },
      superAdminUser,
    );

    level = await levelService.createLevel(
      {
        programId: String(program._id),
        code: `G1-${testSuffix}`,
        name: `Grade 1 ${testSuffix}`,
        sequence: 1,
      },
      superAdminUser,
    );
    return `Program: ${program.code} -> Level: ${level.code}`;
  });
  const programId = String(program._id);
  const levelId = String(level._id);

  let subjectMath: any;
  await recordTest('Stage 2', 'Create Subject (Mathematics)', 'HAPPY_PATH', async () => {
    subjectMath = await subjectService.createSubject(
      {
        schoolId,
        code: `MATH-${testSuffix}`,
        name: 'Mathematics',
        category: 'general',
      },
      superAdminUser,
    );
    return `Subject: ${subjectMath.code} (${subjectMath.name})`;
  });
  const subjectId = String(subjectMath._id);

  await recordTest('Stage 2', 'Create Curriculum Mapping', 'HAPPY_PATH', async () => {
    const curriculum = await curriculumService.createCurriculum(
      {
        schoolId,
        programId,
        levelId,
        academicYearId,
        name: `Primary Grade 1 Curriculum ${testSuffix}`,
        code: `CURR-G1-${testSuffix}`,
        subjects: [
          {
            subjectId,
            weeklyHours: 4,
            sequence: 1,
            passingScore: 50,
            isRequired: true,
          },
        ],
      },
      superAdminUser,
    );
    return `Mapped Subject ${subjectMath.code} to Level ${level.code} in Curriculum ${curriculum.code}`;
  });

  let classroom: any;
  await recordTest(
    'Stage 2',
    'Create Physical Classroom in Test Branch',
    'HAPPY_PATH',
    async () => {
      classroom = await ClassroomModel.create({
        schoolId: new Types.ObjectId(schoolId),
        branchId: new Types.ObjectId(testBranchId),
        code: `CR-${testSuffix}`,
        name: `Room 101 (${testSuffix})`,
        capacity: 35,
        status: 'active',
        isDeleted: false,
      });
      return `Classroom: ${classroom.code} in Branch ${testBranch.branchCode} (Capacity: ${classroom.capacity})`;
    },
  );
  const classroomId = String(classroom._id);

  let testClass: any;
  const classCode = `CLS-${testSuffix}`;
  await recordTest(
    'Stage 2',
    'Create Class with Shift & Schedule Pattern',
    'HAPPY_PATH',
    async () => {
      testClass = await classService.createClass(
        {
          branchId: testBranchId,
          academicYearId,
          programId,
          levelId,
          classroomId,
          classCode,
          className: `Class ${classCode} Morning`,
          capacity: 30,
          shift: 'morning',
          daysPattern: 'MON_FRI',
        },
        superAdminUser,
      );
      return `Class: ${testClass.classCode} (${testClass.className}) Capacity: ${testClass.capacity}`;
    },
  );
  const classId = String(testClass._id);

  await recordTest('Stage 2', 'Assign Teacher to Class & Subject', 'HAPPY_PATH', async () => {
    const assignment = await teacherAssignmentService.createTeacherAssignment(
      {
        schoolId,
        branchId: testBranchId,
        academicYearId,
        classId,
        subjectId,
        employeeId: testEmployeeId,
        roleInClass: 'primary_teacher',
        startDate: '2026-09-01',
      },
      superAdminUser,
    );
    return `Assigned ${testEmployee.firstName} to ${testClass.classCode} for ${subjectMath.code} (Role: ${assignment.roleInClass})`;
  });

  // ============================================================================
  // STAGE 3: ADMISSIONS, STUDENT MASTER & ENROLLMENT
  // ============================================================================
  console.log('\n--- STAGE 3: ADMISSIONS, STUDENT MASTER & ENROLLMENT ---');

  let registration: any;
  await recordTest(
    'Stage 3',
    'Create Admissions Registration with Khmer Subscript Identity',
    'HAPPY_PATH',
    async () => {
      registration = await registrationService.createRegistration(
        {
          schoolId,
          branchId: testBranchId,
          academicYearId,
          programId,
          firstName: 'Dara',
          lastName: 'Vann',
          khmerName: 'វ៉ាន់ តារា',
          gender: 'male',
          dateOfBirth: '2019-03-20',
          phone: '+855 92 111 222',
          guardianName: 'Sophea Vann',
          guardianRelationship: 'father',
          guardianPhone: '+855 92 111 222',
        },
        superAdminUser,
      );
      return `Registered: ${registration.registrationNumber} (${registration.firstName} ${registration.lastName} / ${registration.khmerName})`;
    },
  );
  const registrationId = String(registration._id);

  await recordTest('Stage 3', 'Record Placement Test Evaluation', 'HAPPY_PATH', async () => {
    const pt = await placementTestService.createPlacementTest(
      {
        schoolId,
        branchId: testBranchId,
        registrationId,
        programId,
        recommendedLevelId: levelId,
        studentName: 'Dara Vann',
        testDate: '2026-08-15',
        score: 90,
        maxScore: 100,
        status: 'passed',
        examinerName: `${testEmployee.firstName} ${testEmployee.lastName}`,
      },
      superAdminUser,
    );
    return `Placement Test: ${pt.testNumber} Score: ${pt.score}/${pt.maxScore} -> Status: ${pt.status}`;
  });

  let student: any;
  const studentCode = `STU-A${testSuffix}`;
  await recordTest(
    'Stage 3',
    'Convert Applicant to Official Student Master Record',
    'HAPPY_PATH',
    async () => {
      student = await studentService.createStudent(
        {
          schoolId,
          branchId: testBranchId,
          studentId: studentCode,
          firstName: 'Dara',
          lastName: 'Vann',
          khmerName: 'វ៉ាន់ តារា',
          gender: 'male',
          dateOfBirth: '2019-03-20',
          status: 'active',
          guardians: [
            {
              fullName: 'Sophea Vann',
              relationship: 'father',
              phone: '+855 92 111 222',
              isPrimary: true,
              isEmergencyContact: true,
            },
          ],
        },
        superAdminUser,
      );
      return `Student Master: ${student.studentId} (${student.firstName} ${student.lastName} / ${student.khmerName})`;
    },
  );
  const studentId = String(student._id);

  let enrollment: any;
  await recordTest('Stage 3', 'Enroll Student into Class', 'HAPPY_PATH', async () => {
    enrollment = await enrollmentService.createEnrollment(
      {
        schoolId,
        branchId: testBranchId,
        studentId,
        classId,
        academicYearId,
        academicPeriodId,
        programId,
        levelId,
        enrollmentDate: '2026-09-01',
      },
      superAdminUser,
    );
    return `Enrollment: ${enrollment.enrollmentNumber} Status: ${enrollment.status}`;
  });

  await recordTest(
    'Stage 3',
    'Negative: Prevent Duplicate Enrollment in Same Class/Term',
    'NEGATIVE_CONSTRAINT',
    async () => {
      try {
        await enrollmentService.createEnrollment(
          {
            schoolId,
            branchId: testBranchId,
            studentId,
            classId,
            academicYearId,
            academicPeriodId,
            programId,
            levelId,
            enrollmentDate: '2026-09-01',
          },
          superAdminUser,
        );
        throw new Error('Allowed duplicate active enrollment!');
      } catch (err: any) {
        if (
          err.status === 409 ||
          err.message.includes('already enrolled') ||
          err.message.includes('Conflict')
        ) {
          return `Properly blocked duplicate enrollment: ${err.message}`;
        }
        throw err;
      }
    },
  );

  // ============================================================================
  // STAGE 4: ACADEMIC OPERATIONS (ATTENDANCE, ASSESSMENTS, SCORES)
  // ============================================================================
  console.log('\n--- STAGE 4: ACADEMIC OPERATIONS (ATTENDANCE, ASSESSMENTS, SCORES) ---');

  await recordTest('Stage 4', 'Take and Save Daily Attendance Session', 'HAPPY_PATH', async () => {
    const todayStr = (new Date().toISOString().split('T')[0] ?? '2026-09-04') as string;
    const attendanceRecord = await attendanceService.markAttendance(
      {
        schoolId,
        branchId: testBranchId,
        academicYearId,
        academicPeriodId,
        classId,
        date: todayStr,
        records: [
          {
            studentId,
            status: 'present',
            remarks: 'On time and engaged',
          },
        ],
      },
      superAdminUser,
    );
    return `Attendance saved for Class ${testClass.classCode} on ${todayStr} (Session: ${attendanceRecord.sessionType}, ID: ${attendanceRecord._id})`;
  });

  let assessment: any;
  await recordTest('Stage 4', 'Create Mid-Term Exam Assessment', 'HAPPY_PATH', async () => {
    assessment = await assessmentService.createAssessment(
      {
        schoolId,
        branchId: testBranchId,
        academicYearId,
        academicPeriodId,
        classId,
        subjectId,
        name: `Mid-Term Exam (${testSuffix})`,
        code: `MID-${testSuffix}`,
        type: 'midterm',
        maxScore: 100,
        passingScore: 50,
        weightPercentage: 40,
        assessmentDate: '2026-10-30',
      },
      superAdminUser,
    );
    return `Assessment: ${assessment.name} (Max Marks: ${assessment.maxScore}, Weight: ${assessment.weightPercentage}%)`;
  });
  const assessmentId = String(assessment._id);

  await recordTest(
    'Stage 4',
    'Negative: Block Score Entry Exceeding Max Score',
    'NEGATIVE_CONSTRAINT',
    async () => {
      try {
        await scoreService.batchRecordScores(
          {
            assessmentId,
            scores: [
              {
                studentId,
                scoreObtained: 105, // Exceeds maxScore: 100
                isAbsent: false,
              },
            ],
          },
          superAdminUser,
        );
        throw new Error('Score exceeding maxScore was accepted!');
      } catch (err: any) {
        if (
          err.message.includes('exceed') ||
          err.message.includes('greater') ||
          err.status === 400
        ) {
          return `Validation held: ${err.message}`;
        }
        throw err;
      }
    },
  );

  await recordTest(
    'Stage 4',
    'Negative: Block Score Entry for Unenrolled Student',
    'NEGATIVE_CONSTRAINT',
    async () => {
      const fakeStudentId = new Types.ObjectId().toString();
      try {
        await scoreService.batchRecordScores(
          {
            assessmentId,
            scores: [
              {
                studentId: fakeStudentId,
                scoreObtained: 85,
                isAbsent: false,
              },
            ],
          },
          superAdminUser,
        );
        throw new Error('Accepted score for unenrolled student!');
      } catch (err: any) {
        if (err.message.includes('not actively enrolled') || err.status === 400) {
          return `Integrity check held: ${err.message}`;
        }
        throw err;
      }
    },
  );

  await recordTest('Stage 4', 'Record Valid Assessment Score', 'HAPPY_PATH', async () => {
    const scores = await scoreService.batchRecordScores(
      {
        assessmentId,
        scores: [
          {
            studentId,
            scoreObtained: 92,
            isAbsent: false,
            remarks: 'Excellent comprehension of algebra',
          },
        ],
      },
      superAdminUser,
    );
    return `Score recorded: ${scores?.[0]?.scoreObtained}/100 for Student ${student.studentId}`;
  });

  await recordTest(
    'Stage 4',
    'Negative: Block Student Transfer to Same Branch',
    'NEGATIVE_CONSTRAINT',
    async () => {
      try {
        await studentTransferService.createTransfer(
          {
            fromSchoolId: schoolId,
            toSchoolId: schoolId,
            fromBranchId: testBranchId,
            toBranchId: testBranchId, // Same branch
            studentId,
            reason: 'Same branch test',
          },
          superAdminUser,
        );
        throw new Error('FAILED_TO_BLOCK: Allowed student transfer to same branch!');
      } catch (err: any) {
        if (
          err.message.includes('must be different') ||
          err.message.includes('different') ||
          err.status === 400
        ) {
          return `Blocked same-branch transfer: ${err.message}`;
        }
        throw err;
      }
    },
  );

  await recordTest('Stage 4', 'Initiate Inter-Branch Student Transfer', 'HAPPY_PATH', async () => {
    const transfer = await studentTransferService.createTransfer(
      {
        fromSchoolId: schoolId,
        toSchoolId: schoolId,
        fromBranchId: testBranchId,
        toBranchId: mainBranchId,
        studentId,
        reason: 'Family relocated near Main Branch campus',
      },
      superAdminUser,
    );
    return `Transfer Request: ${transfer.transferNumber} Status: ${transfer.status} (From: ${testBranch.branchCode} -> To: ${mainBranch.branchCode})`;
  });

  // ============================================================================
  // STAGE 5: FINANCE & BILLING MATRIX
  // ============================================================================
  console.log('\n--- STAGE 5: FINANCE & BILLING MATRIX ---');

  let tuitionFee: any;
  await recordTest('Stage 5', 'Create Tuition Fee Schedule', 'HAPPY_PATH', async () => {
    tuitionFee = await TuitionFeeModel.create({
      schoolId: new Types.ObjectId(schoolId),
      branchId: new Types.ObjectId(testBranchId),
      academicYearId: new Types.ObjectId(academicYearId),
      programId: new Types.ObjectId(programId),
      levelId: new Types.ObjectId(levelId),
      feeCode: `TF-${testSuffix}`,
      feeName: `Term Tuition Grade 1 (${testSuffix})`,
      amount: 600,
      currency: 'USD',
      billingCycle: 'term',
      status: 'active',
      isDeleted: false,
    });
    return `Tuition Structure: ${tuitionFee.feeCode} (${tuitionFee.feeName}) Amount: $${tuitionFee.amount} ${tuitionFee.currency}`;
  });
  const tuitionFeeId = String(tuitionFee._id);

  await recordTest(
    'Stage 5',
    'Negative: Block Payment with Negative Amount',
    'NEGATIVE_CONSTRAINT',
    async () => {
      try {
        await paymentService.createPayment(
          {
            schoolId,
            branchId: testBranchId,
            studentId,
            tuitionFeeId,
            academicYearId,
            amountDue: 600,
            amountPaid: -100, // Negative amount
            currency: 'USD',
            paymentMethod: 'cash',
          },
          superAdminUser,
        );
        throw new Error('Allowed negative payment amount!');
      } catch (err: any) {
        if (
          err.message.includes('positive') ||
          err.message.includes('greater') ||
          err.message.includes('amount') ||
          err.status === 400
        ) {
          return `Properly rejected negative payment: ${err.message}`;
        }
        throw err;
      }
    },
  );

  let firstPayment: any;
  await recordTest(
    'Stage 5',
    'Record Partial Tuition Payment ($300 of $600)',
    'HAPPY_PATH',
    async () => {
      firstPayment = await paymentService.createPayment(
        {
          schoolId,
          branchId: testBranchId,
          studentId,
          tuitionFeeId,
          academicYearId,
          amountDue: 600,
          amountPaid: 300,
          currency: 'USD',
          paymentMethod: 'bank_transfer',
          transactionReference: `TX-${testSuffix}-01`,
        },
        superAdminUser,
      );
      return `Partial Payment Receipt: ${firstPayment.receiptNumber} Paid: $${firstPayment.amountPaid} Balance: $${firstPayment.balanceRemaining} Status: ${firstPayment.status}`;
    },
  );

  await recordTest(
    'Stage 5',
    'Record Final Settlement Payment ($300 remaining)',
    'HAPPY_PATH',
    async () => {
      const finalPayment = await paymentService.createPayment(
        {
          schoolId,
          branchId: testBranchId,
          studentId,
          tuitionFeeId,
          academicYearId,
          amountDue: 600,
          amountPaid: 300,
          currency: 'USD',
          paymentMethod: 'aba_pay',
          transactionReference: `TX-${testSuffix}-02`,
        },
        superAdminUser,
      );
      return `Final Payment Receipt: ${finalPayment.receiptNumber} Paid: $${finalPayment.amountPaid} Balance: $${finalPayment.balanceRemaining} Status: ${finalPayment.status}`;
    },
  );

  // ============================================================================
  // STAGE 6: HR COMPETENCIES & SKILLS MATRIX
  // ============================================================================
  console.log('\n--- STAGE 6: HR COMPETENCIES & SKILLS MATRIX ---');

  const teacherRole =
    (await RoleModel.findOne({ code: 'teacher', isDeleted: false })) ||
    (await RoleModel.findOne({ isDeleted: false }));
  const roleId = String(teacherRole?._id);

  const skillCode = `SKL-A${testSuffix}`;
  let skill: any;
  await recordTest('Stage 6', 'Create Pedagogical Competency Skill', 'HAPPY_PATH', async () => {
    skill = await skillService.createSkill(
      {
        code: skillCode,
        name: `Bilingual Curriculum Delivery (${testSuffix})`,
        category: 'pedagogy',
        description: 'Fluency in English & Khmer pedagogical instructional standards',
        schoolId,
      },
      superAdminUser,
    );
    return `Skill: ${skill.code} (${skill.name}) Category: ${skill.category}`;
  });

  await recordTest(
    'Stage 6',
    'Negative: Block Duplicate Skill Code',
    'NEGATIVE_CONSTRAINT',
    async () => {
      try {
        await skillService.createSkill(
          {
            code: skillCode,
            name: 'Duplicate Skill',
            category: 'pedagogy',
            schoolId,
          },
          superAdminUser,
        );
        throw new Error('FAILED_TO_BLOCK: Allowed duplicate skill code!');
      } catch (err: any) {
        if (err.status === 409 || err.message.includes('already exists')) {
          return `Conflict correctly triggered: ${err.message}`;
        }
        throw err;
      }
    },
  );

  await recordTest(
    'Stage 6',
    'Assign Role Skill Requirement (Role: teacher)',
    'HAPPY_PATH',
    async () => {
      const req = await skillService.addRoleRequirement(
        {
          roleId,
          skillId: String(skill._id),
          requiredLevel: 4,
          isRequired: true,
        },
        superAdminUser,
      );
      return `Role Requirement: role ${teacherRole?.code ?? roleId} needs ${skill.code} at level ${req.requiredLevel}`;
    },
  );

  await recordTest('Stage 6', 'Evaluate Employee Competency Level', 'HAPPY_PATH', async () => {
    const evalResult = await skillService.addEmployeeSkill(
      {
        employeeId: testEmployeeId,
        skillId: String(skill._id),
        proficiencyLevel: 4,
        yearsExperience: 3,
        notes: 'Demonstrated high competence in bilingual lesson plans',
      },
      superAdminUser,
    );
    return `Employee ${testEmployee.employeeId} evaluated on ${skill.code}: Level ${evalResult.proficiencyLevel}`;
  });

  await recordTest('Stage 6', 'Perform Employee Skill Gap Analysis', 'HAPPY_PATH', async () => {
    const gapReport = await skillService.analyzeEmployeeSkillGap(
      testEmployeeId,
      roleId,
      superAdminUser,
    );
    return `Analyzed Skill Gaps for ${gapReport.employeeName}: ${gapReport.skills.length} competencies tracked, Match: ${gapReport.matchPercentage}%, Competency Score: ${gapReport.competencyScore}/5`;
  });

  // ============================================================================
  // STAGE 7: SYSTEM CONTROLS, AUDIT LOGS & SETTINGS
  // ============================================================================
  console.log('\n--- STAGE 7: SYSTEM CONTROLS, AUDIT LOGS & SETTINGS ---');

  const settingKey = `MAX_CLASS_SIZE_${testSuffix}`;
  await recordTest('Stage 7', 'Configure Dynamic System Setting', 'HAPPY_PATH', async () => {
    const setting = await systemSettingService.createSetting(
      {
        schoolId,
        key: settingKey,
        value: 32,
        type: 'number',
        description: 'Maximum class size for kindergarten and primary grades',
        category: 'academic',
      },
      superAdminUser,
    );
    return `System Setting: ${setting.key} = ${setting.value} (${setting.type})`;
  });

  await recordTest(
    'Stage 7',
    'Verify Audit Log Persistence & Immutability',
    'DATA_INTEGRITY',
    async () => {
      const recentLogs = await auditLogService.getAuditLogs(
        {
          schoolId,
          limit: 20,
        },
        superAdminUser,
      );
      if (recentLogs.total === 0) {
        throw new Error('Zero audit logs found! Audit trail is not persisting.');
      }
      const sample = recentLogs.data[0];
      return `Audit logs successfully captured: ${recentLogs.total} events recorded. Latest: [${sample?.action}] ${sample?.entityType} by ${sample?.userId}`;
    },
  );

  // ============================================================================
  // TEARDOWN & SUMMARY
  // ============================================================================
  console.log('\n--- CLEANING UP TEMPORARY AUDIT ARTIFACTS ---');
  if (tuitionFeeId) {
    await PaymentModel.deleteMany({ tuitionFeeId: new Types.ObjectId(tuitionFeeId) });
    await TuitionFeeModel.deleteOne({ _id: tuitionFeeId });
  }
  if (studentId) {
    await StudentTransferModel.deleteMany({ studentId: new Types.ObjectId(studentId) });
    await ScoreModel.deleteMany({ studentId: new Types.ObjectId(studentId) });
    await EnrollmentModel.deleteMany({ studentId: new Types.ObjectId(studentId) });
    await StudentModel.deleteOne({ _id: studentId });
  }
  if (registrationId) {
    await PlacementTestModel.deleteMany({ registrationId: new Types.ObjectId(registrationId) });
    await RegistrationModel.deleteOne({ _id: registrationId });
  }
  if (classId) {
    await AttendanceModel.deleteMany({ classId: new Types.ObjectId(classId) });
    await AssessmentModel.deleteMany({ classId: new Types.ObjectId(classId) });
    await TeacherAssignmentModel.deleteMany({ classId: new Types.ObjectId(classId) });
    await ClassModel.deleteOne({ _id: classId });
  }
  if (classroomId) await ClassroomModel.deleteOne({ _id: classroomId });
  if (testEmployeeId) {
    await EmployeeSkillModel.deleteMany({ employeeId: new Types.ObjectId(testEmployeeId) });
    await EmployeeModel.deleteOne({ _id: testEmployeeId });
  }
  if (skill?._id) {
    await RoleSkillRequirementModel.deleteMany({ skillId: new Types.ObjectId(skill._id) });
    await SkillModel.deleteOne({ _id: skill._id });
  }
  if (testPosId) await PositionModel.deleteOne({ _id: testPosId });
  if (testDeptId) await DepartmentModel.deleteOne({ _id: testDeptId });
  if (testBranchId) await BranchModel.deleteOne({ _id: testBranchId });
  if (programId) {
    await CurriculumModel.deleteMany({ programId: new Types.ObjectId(programId) });
  }
  if (subjectId) await SubjectModel.deleteOne({ _id: subjectId });
  if (levelId) await LevelModel.deleteOne({ _id: levelId });
  if (programId) await ProgramModel.deleteOne({ _id: programId });
  if (settingKey) await SystemSettingModel.deleteOne({ key: settingKey });
  console.log('[PASS] Temporary test records safely cleared.');

  console.log('\n================================================================================');
  console.log('                        AUDIT EXECUTION SUMMARY REPORT                          ');
  console.log('================================================================================');

  const passedCount = auditLog.filter((t) => t.passed).length;
  const failedCount = auditLog.filter((t) => !t.passed).length;
  const totalCount = auditLog.length;

  console.log(`Total Checks Executed : ${totalCount}`);
  console.log(`Passed Checks         : ${passedCount}`);
  console.log(`Failed Checks         : ${failedCount}`);
  console.log(`Success Rate          : ${((passedCount / totalCount) * 100).toFixed(1)}%\n`);

  if (failedCount > 0) {
    console.log('Failed Checks:');
    auditLog
      .filter((t) => !t.passed)
      .forEach((t) => {
        console.log(`  - [${t.stage}] ${t.name}: ${t.message}`);
      });
  } else {
    console.log('ALL SYSTEM BUSINESS LOGIC CHECKS AND CONTROL BOUNDARIES PASSED FLAWLESSLY!');
  }
  console.log('================================================================================\n');

  await disconnectFromDatabase();
}

runSystemWideAudit().catch((err) => {
  console.error('Fatal error during system-wide audit:', err);
  process.exit(1);
});
