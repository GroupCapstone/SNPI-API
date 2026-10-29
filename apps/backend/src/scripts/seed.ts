import { createHash } from 'node:crypto';
import mongoose from 'mongoose';
import { connectToDatabase, disconnectFromDatabase } from '../config/database';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { DEFAULT_CORE_ROLES } from '../constants/permissions';
import { AcademicPeriodModel } from '../modules/academic-period/academic-period.model';
import { AcademicYearModel } from '../modules/academic-year/academic-year.model';
import { AnnouncementModel } from '../modules/announcement/announcement.model';
import { AssessmentModel } from '../modules/assessment/assessment.model';
import { AttendanceRecordModel } from '../modules/attendance/attendance-record.model';
import { AttendanceModel } from '../modules/attendance/attendance.model';
import { BranchModel } from '../modules/branch/branch.model';
import { ClassModel } from '../modules/class/class.model';
import { ClassScheduleModel } from '../modules/class-schedule/class-schedule.model';
import { ClassroomModel } from '../modules/classroom/classroom.model';
import { CurriculumModel } from '../modules/curriculum/curriculum.model';
import { DepartmentModel } from '../modules/department/department.model';
import { EmployeeModel } from '../modules/employee/employee.model';
import { EnrollmentModel } from '../modules/enrollment/enrollment.model';
import { IntakeModel } from '../modules/intake/intake.model';
import { LevelModel } from '../modules/level/level.model';
import { NotificationModel } from '../modules/notification/notification.model';
import { PaymentModel } from '../modules/payment/payment.model';
import { PlacementTestModel } from '../modules/placement-test/placement-test.model';
import { PositionModel } from '../modules/position/position.model';
import { ProgramModel } from '../modules/program/program.model';
import { RegistrationModel } from '../modules/registration/registration.model';
import { OfficialDocumentModel } from '../modules/report/report.model';
import { RoleModel } from '../modules/role/role.model';
import { SchoolModel } from '../modules/school/school.model';
import { ScoreModel } from '../modules/score/score.model';
import { SkillModel } from '../modules/skill/skill.model';
import { StudentTransferModel } from '../modules/student-transfer/student-transfer.model';
import { StudentModel } from '../modules/student/student.model';
import { StudyModeModel } from '../modules/study-mode/study-mode.model';
import { SubjectModel } from '../modules/subject/subject.model';
import { SystemSettingModel } from '../modules/system-setting/system-setting.model';
import { TeacherAssignmentModel } from '../modules/teacher-assignment/teacher-assignment.model';
import { TermResultModel } from '../modules/term-result/term-result.model';
import { TimeSlotModel } from '../modules/time-slot/time-slot.model';
import { TuitionFeeModel } from '../modules/tuition/tuition-fee.model';
import { UserModel } from '../modules/user/user.model';
import { PasswordUtil } from '../utils/password';

export const seedDatabase = async (options?: { clearFirst?: boolean }): Promise<void> => {
  if (env.NODE_ENV === 'production') {
    throw new Error('Seeding development fixture data is blocked in production.');
  }

  const devSeedPassword = process.env.DEV_SEED_PASSWORD;
  if (
    !devSeedPassword ||
    devSeedPassword.length < 16 ||
    /(?:replace[-_ ]with|change[-_ ]me|placeholder|example|generated|secure_random|minimum\d+|your[-_ ])/i.test(
      devSeedPassword,
    )
  ) {
    throw new Error(
      'Set DEV_SEED_PASSWORD to a private value of at least 16 characters before seeding.',
    );
  }

  await connectToDatabase();

  if (options?.clearFirst || process.env.CLEAR_FIRST === 'true') {
    logger.info('Clearing existing data before seeding...');
    const db = mongoose.connection.db;
    if (db) {
      const collections = await db.listCollections().toArray();
      for (const col of collections) {
        if (!col.name.startsWith('system.')) {
          await db.collection(col.name).deleteMany({});
        }
      }
      logger.info('Cleared all existing collections successfully.');
    }
  }

  logger.info('Seeding database with comprehensive V1.1 multi-branch, 12-month data...');

  // 1. School
  let school = await SchoolModel.findOne({ code: 'SNP', isDeleted: false });
  if (!school) {
    school = await SchoolModel.create({
      code: 'SNP',
      nameEn: 'SNP International School',
      nameKh: 'សាលាអន្តរជាតិ អេសអិនភី',
      email: 'info@snp.edu.kh',
      phone: '+855 23 888 999',
      address: 'Phnom Penh, Cambodia',
      website: 'https://snp.edu.kh',
      status: 'active',
    });
    logger.info('Seeded school: SNP International School');
  }

  // 2. Branches
  let mainBranch = await BranchModel.findOne({ schoolId: school._id, branchCode: 'MB-01' });
  if (!mainBranch) {
    mainBranch = await BranchModel.create({
      schoolId: school._id,
      branchCode: 'MB-01',
      branchNameEn: 'Main Branch (Phnom Penh)',
      branchNameKh: 'សាខាធំ (រាជធានីភ្នំពេញ)',
      phone: '+855 23 888 101',
      email: 'main@snp.edu.kh',
      address: 'Street 271, Phnom Penh',
      status: 'active',
      isDeleted: false,
    });
    logger.info('Seeded branch: Main Branch');
  } else {
    mainBranch.isDeleted = false;
    mainBranch.status = 'active';
    await mainBranch.save();
  }

  let toulKorkBranch = await BranchModel.findOne({ schoolId: school._id, branchCode: 'TK-02' });
  if (!toulKorkBranch) {
    toulKorkBranch = await BranchModel.create({
      schoolId: school._id,
      branchCode: 'TK-02',
      branchNameEn: 'Toul Kork Branch',
      branchNameKh: 'សាខាទួលគោក',
      phone: '+855 23 888 102',
      email: 'toulkork@snp.edu.kh',
      address: 'Street 315, Toul Kork, Phnom Penh',
      status: 'active',
      isDeleted: false,
    });
    logger.info('Seeded branch: Toul Kork Branch');
  } else {
    toulKorkBranch.isDeleted = false;
    toulKorkBranch.status = 'active';
    await toulKorkBranch.save();
  }

  let senSokBranch = await BranchModel.findOne({ schoolId: school._id, branchCode: 'SS-03' });
  if (!senSokBranch) {
    senSokBranch = await BranchModel.create({
      schoolId: school._id,
      branchCode: 'SS-03',
      branchNameEn: 'Sen Sok Branch',
      branchNameKh: 'សាខាសែនសុខ',
      phone: '+855 23 888 103',
      email: 'sensok@snp.edu.kh',
      address: 'Street 1003, Sen Sok, Phnom Penh',
      status: 'active',
      isDeleted: false,
    });
    logger.info('Seeded branch: Sen Sok Branch');
  } else {
    senSokBranch.isDeleted = false;
    senSokBranch.status = 'active';
    await senSokBranch.save();
  }

  // 3. Departments across Branches
  const departmentsData = [
    {
      branch: mainBranch,
      code: 'ACA',
      nameEn: 'Academic Department',
      nameKh: 'ដេប៉ាតឺម៉ង់សិក្សាធិការ',
      description: 'Curriculum delivery, teachers, and student learning outcomes',
    },
    {
      branch: mainBranch,
      code: 'ADM',
      nameEn: 'Administration Department',
      nameKh: 'ដេប៉ាតឺម៉ង់រដ្ឋបាល',
      description: 'Campus operations, registrar, and facility management',
    },
    {
      branch: mainBranch,
      code: 'FIN',
      nameEn: 'Finance Department',
      nameKh: 'ដេប៉ាតឺម៉ង់ហិរញ្ញវត្ថុ',
      description: 'Tuition fees, billing, cashier ledger, and accounts',
    },
    {
      branch: mainBranch,
      code: 'IT',
      nameEn: 'IT & Systems Department',
      nameKh: 'ដេប៉ាតឺម៉ង់បច្ចេកវិទ្យា',
      description: 'Digital systems, computer labs, and network',
    },

    {
      branch: toulKorkBranch,
      code: 'ACA',
      nameEn: 'Academic Department',
      nameKh: 'ដេប៉ាតឺម៉ង់សិក្សាធិការ',
      description: 'Toul Kork campus academic programs and teaching faculty',
    },
    {
      branch: toulKorkBranch,
      code: 'ADM',
      nameEn: 'Administration Department',
      nameKh: 'ដេប៉ាតឺម៉ង់រដ្ឋបាល',
      description: 'Toul Kork campus front desk and registrar',
    },
    {
      branch: toulKorkBranch,
      code: 'FIN',
      nameEn: 'Finance Department',
      nameKh: 'ដេប៉ាតឺម៉ង់ហិរញ្ញវត្ថុ',
      description: 'Toul Kork campus tuition and finance',
    },
    {
      branch: toulKorkBranch,
      code: 'IT',
      nameEn: 'IT & Systems Department',
      nameKh: 'ដេប៉ាតឺម៉ង់បច្ចេកវិទ្យា',
      description: 'Toul Kork campus computer labs and systems',
    },

    {
      branch: senSokBranch,
      code: 'ACA',
      nameEn: 'Academic Department',
      nameKh: 'ដេប៉ាតឺម៉ង់សិក្សាធិការ',
      description: 'Sen Sok campus academic programs and teaching faculty',
    },
    {
      branch: senSokBranch,
      code: 'ADM',
      nameEn: 'Administration Department',
      nameKh: 'ដេប៉ាតឺម៉ង់រដ្ឋបាល',
      description: 'Sen Sok campus front desk and operations',
    },
    {
      branch: senSokBranch,
      code: 'FIN',
      nameEn: 'Finance Department',
      nameKh: 'ដេប៉ាតឺម៉ង់ហិរញ្ញវត្ថុ',
      description: 'Sen Sok campus cashier and tuition collection',
    },
    {
      branch: senSokBranch,
      code: 'IT',
      nameEn: 'IT & Systems Department',
      nameKh: 'ដេប៉ាតឺម៉ង់បច្ចេកវិទ្យា',
      description: 'Sen Sok campus computer labs',
    },
  ];

  const seededDepts: Record<string, typeof DepartmentModel.prototype> = {};
  for (const d of departmentsData) {
    let dept = await DepartmentModel.findOne({
      branchId: d.branch._id,
      code: d.code,
      isDeleted: false,
    });
    if (!dept) {
      dept = await DepartmentModel.create({
        schoolId: school._id,
        branchId: d.branch._id,
        code: d.code,
        nameEn: d.nameEn,
        nameKh: d.nameKh,
        description: d.description,
        status: 'active',
      });
      logger.info(`Seeded department: ${d.code} for branch ${d.branch.branchCode}`);
    }
    seededDepts[`${d.branch.branchCode}_${d.code}`] = dept;
  }

  // 4. Positions across Departments
  const positionsData = [
    // Main Branch
    {
      deptKey: 'MB-01_ACA',
      code: 'MGR-ACA',
      nameEn: 'Academic Manager',
      nameKh: 'ប្រធានផ្នែកសិក្សាធិការ',
      description: 'Manages curriculum and teacher performance',
    },
    {
      deptKey: 'MB-01_ACA',
      code: 'TCH-ENG',
      nameEn: 'English Language Teacher',
      nameKh: 'គ្រូបង្រៀនភាសាអង់គ្លេស',
      description: 'Instructs GEP and CEP English courses',
    },
    {
      deptKey: 'MB-01_ACA',
      code: 'TCH-COM',
      nameEn: 'Computer Skills Teacher',
      nameKh: 'គ្រូបង្រៀនកុំព្យូទ័រ',
      description: 'Instructs digital literacy and office',
    },
    {
      deptKey: 'MB-01_ACA',
      code: 'TCH-KHM',
      nameEn: 'General Knowledge Teacher',
      nameKh: 'គ្រូបង្រៀនចំណេះដឹងទូទៅ',
      description: 'Instructs national curriculum subjects',
    },
    {
      deptKey: 'MB-01_ACA',
      code: 'TCH-MATH',
      nameEn: 'Mathematics Teacher',
      nameKh: 'គ្រូបង្រៀនគណិតវិទ្យា',
      description: 'Instructs mathematics and logic courses',
    },
    {
      deptKey: 'MB-01_ADM',
      code: 'ADM-OFF',
      nameEn: 'Branch Administrator',
      nameKh: 'មន្ត្រីរដ្ឋបាលសាខា',
      description: 'Campus operations and student record keeping',
    },
    {
      deptKey: 'MB-01_ADM',
      code: 'REC-01',
      nameEn: 'Front Desk Receptionist',
      nameKh: 'បុគ្គលិកទទួលភ្ញៀវ',
      description: 'Parent inquiries and customer relations',
    },
    {
      deptKey: 'MB-01_FIN',
      code: 'FIN-OFF',
      nameEn: 'Finance Officer',
      nameKh: 'មន្ត្រីហិរញ្ញវត្ថុ',
      description: 'Student invoices and financial reporting',
    },
    {
      deptKey: 'MB-01_IT',
      code: 'IT-SPEC',
      nameEn: 'IT Support Specialist',
      nameKh: 'អ្នកឯកទេសបច្ចេកវិទ្យា',
      description: 'Network maintenance and software support',
    },

    // Toul Kork Branch
    {
      deptKey: 'TK-02_ACA',
      code: 'TCH-ENG',
      nameEn: 'English Language Teacher',
      nameKh: 'គ្រូបង្រៀនភាសាអង់គ្លេស',
      description: 'Instructs TK English classes',
    },
    {
      deptKey: 'TK-02_ACA',
      code: 'TCH-COM',
      nameEn: 'Computer Skills Teacher',
      nameKh: 'គ្រូបង្រៀនកុំព្យូទ័រ',
      description: 'Instructs TK Computer classes',
    },
    {
      deptKey: 'TK-02_ACA',
      code: 'TCH-MATH',
      nameEn: 'Mathematics Teacher',
      nameKh: 'គ្រូបង្រៀនគណិតវិទ្យា',
      description: 'Instructs TK Mathematics classes',
    },
    {
      deptKey: 'TK-02_ADM',
      code: 'ADM-OFF',
      nameEn: 'Branch Administrator',
      nameKh: 'មន្ត្រីរដ្ឋបាលសាខា',
      description: 'TK campus operations',
    },
    {
      deptKey: 'TK-02_ADM',
      code: 'REC-01',
      nameEn: 'Front Desk Receptionist',
      nameKh: 'បុគ្គលិកទទួលភ្ញៀវ',
      description: 'TK front desk reception',
    },
    {
      deptKey: 'TK-02_FIN',
      code: 'FIN-OFF',
      nameEn: 'Finance Officer',
      nameKh: 'មន្ត្រីហិរញ្ញវត្ថុ',
      description: 'TK cashier and finance',
    },

    // Sen Sok Branch
    {
      deptKey: 'SS-03_ACA',
      code: 'TCH-ENG',
      nameEn: 'English Language Teacher',
      nameKh: 'គ្រូបង្រៀនភាសាអង់គ្លេស',
      description: 'Instructs SS English classes',
    },
    {
      deptKey: 'SS-03_ACA',
      code: 'TCH-COM',
      nameEn: 'Computer Skills Teacher',
      nameKh: 'គ្រូបង្រៀនកុំព្យូទ័រ',
      description: 'Instructs SS Computer classes',
    },
    {
      deptKey: 'SS-03_ACA',
      code: 'TCH-MATH',
      nameEn: 'Mathematics Teacher',
      nameKh: 'គ្រូបង្រៀនគណិតវិទ្យា',
      description: 'Instructs SS Math classes',
    },
    {
      deptKey: 'SS-03_ADM',
      code: 'ADM-OFF',
      nameEn: 'Branch Administrator',
      nameKh: 'មន្ត្រីរដ្ឋបាលសាខា',
      description: 'SS campus operations',
    },
    {
      deptKey: 'SS-03_ADM',
      code: 'REC-01',
      nameEn: 'Front Desk Receptionist',
      nameKh: 'បុគ្គលិកទទួលភ្ញៀវ',
      description: 'SS front desk reception',
    },
    {
      deptKey: 'SS-03_FIN',
      code: 'FIN-OFF',
      nameEn: 'Finance Officer',
      nameKh: 'មន្ត្រីហិរញ្ញវត្ថុ',
      description: 'SS cashier and finance',
    },
  ];

  const seededPositions: Record<string, typeof PositionModel.prototype> = {};
  for (const pos of positionsData) {
    const dept = seededDepts[pos.deptKey];
    if (dept) {
      let posDoc = await PositionModel.findOne({
        departmentId: dept._id,
        code: pos.code,
        isDeleted: false,
      });
      if (!posDoc) {
        posDoc = await PositionModel.create({
          schoolId: school._id,
          branchId: dept.branchId,
          departmentId: dept._id,
          code: pos.code,
          nameEn: pos.nameEn,
          nameKh: pos.nameKh,
          description: pos.description,
          status: 'active',
        });
        logger.info(`Seeded position: ${pos.code} for department ${pos.deptKey}`);
      }
      seededPositions[`${pos.deptKey}_${pos.code}`] = posDoc;
    }
  }

  // 5. Employees across all 3 Branches (20 Employees)
  const employeesToSeed = [
    {
      employeeId: 'EMP-MB-001',
      branch: mainBranch,
      dept: seededDepts['MB-01_ACA'],
      pos: seededPositions['MB-01_ACA_TCH-ENG'],
      firstName: 'Dara',
      lastName: 'Chan',
      khmerName: 'ចាន់ ដារ៉ា',
      gender: 'male' as const,
      dob: new Date('1992-04-15'),
      phone: '+855 12 345 678',
      email: 'teacher.dara@snp.edu.kh',
    },
    {
      employeeId: 'EMP-MB-002',
      branch: mainBranch,
      dept: seededDepts['MB-01_ACA'],
      pos: seededPositions['MB-01_ACA_MGR-ACA'],
      firstName: 'Sopheak',
      lastName: 'Sok',
      khmerName: 'សុខ សុភ័ក្ត្រ',
      gender: 'male' as const,
      dob: new Date('1988-08-20'),
      phone: '+855 12 888 111',
      email: 'academic.officer@snp.edu.kh',
    },
    {
      employeeId: 'EMP-MB-003',
      branch: mainBranch,
      dept: seededDepts['MB-01_FIN'],
      pos: seededPositions['MB-01_FIN_FIN-OFF'],
      firstName: 'Kolab',
      lastName: 'Chea',
      khmerName: 'ជា កូឡាប',
      gender: 'female' as const,
      dob: new Date('1994-01-10'),
      phone: '+855 12 888 222',
      email: 'finance.mb@snp.edu.kh',
    },
    {
      employeeId: 'EMP-MB-004',
      branch: mainBranch,
      dept: seededDepts['MB-01_ADM'],
      pos: seededPositions['MB-01_ADM_ADM-OFF'],
      firstName: 'Sophea',
      lastName: 'Sam',
      khmerName: 'សំ សុភា',
      gender: 'female' as const,
      dob: new Date('1993-05-18'),
      phone: '+855 12 888 333',
      email: 'hr.officer@snp.edu.kh',
    },
    {
      employeeId: 'EMP-MB-005',
      branch: mainBranch,
      dept: seededDepts['MB-01_ADM'],
      pos: seededPositions['MB-01_ADM_REC-01'],
      firstName: 'Piseth',
      lastName: 'Mao',
      khmerName: 'ម៉ៅ ពិសិដ្ឋ',
      gender: 'male' as const,
      dob: new Date('1996-09-12'),
      phone: '+855 12 888 444',
      email: 'staff.user@snp.edu.kh',
    },
    {
      employeeId: 'EMP-MB-006',
      branch: mainBranch,
      dept: seededDepts['MB-01_ACA'],
      pos: seededPositions['MB-01_ACA_TCH-COM'],
      firstName: 'Chhaya',
      lastName: 'Kong',
      khmerName: 'គង់ ឆាយា',
      gender: 'male' as const,
      dob: new Date('1995-03-25'),
      phone: '+855 12 888 555',
      email: 'chhaya.kong@snp.edu.kh',
    },
    {
      employeeId: 'EMP-MB-007',
      branch: mainBranch,
      dept: seededDepts['MB-01_ACA'],
      pos: seededPositions['MB-01_ACA_TCH-KHM'],
      firstName: 'Bopha',
      lastName: 'Som',
      khmerName: 'សោម បុប្ផា',
      gender: 'female' as const,
      dob: new Date('1991-11-30'),
      phone: '+855 12 888 666',
      email: 'bopha.som@snp.edu.kh',
    },
    {
      employeeId: 'EMP-MB-008',
      branch: mainBranch,
      dept: seededDepts['MB-01_ACA'],
      pos: seededPositions['MB-01_ACA_TCH-MATH'],
      firstName: 'Rithy',
      lastName: 'Chhun',
      khmerName: 'ឈុន រិទ្ធី',
      gender: 'male' as const,
      dob: new Date('1990-07-14'),
      phone: '+855 12 888 777',
      email: 'rithy.chhun@snp.edu.kh',
    },
    {
      employeeId: 'EMP-TK-001',
      branch: toulKorkBranch,
      dept: seededDepts['TK-02_ACA'],
      pos: seededPositions['TK-02_ACA_TCH-ENG'],
      firstName: 'Vannak',
      lastName: 'Seng',
      khmerName: 'សេង វណ្ណៈ',
      gender: 'male' as const,
      dob: new Date('1993-11-05'),
      phone: '+855 12 999 101',
      email: 'teacher.tk@snp.edu.kh',
    },
    {
      employeeId: 'EMP-TK-002',
      branch: toulKorkBranch,
      dept: seededDepts['TK-02_ADM'],
      pos: seededPositions['TK-02_ADM_ADM-OFF'],
      firstName: 'Rithy',
      lastName: 'Meas',
      khmerName: 'មាស រិទ្ធី',
      gender: 'male' as const,
      dob: new Date('1987-03-22'),
      phone: '+855 12 999 202',
      email: 'manager.tk@snp.edu.kh',
    },
    {
      employeeId: 'EMP-TK-003',
      branch: toulKorkBranch,
      dept: seededDepts['TK-02_ACA'],
      pos: seededPositions['TK-02_ACA_TCH-COM'],
      firstName: 'Sreypov',
      lastName: 'Nuon',
      khmerName: 'នួន ស្រីពៅ',
      gender: 'female' as const,
      dob: new Date('1995-08-19'),
      phone: '+855 12 999 303',
      email: 'sreypov.nuon@snp.edu.kh',
    },
    {
      employeeId: 'EMP-TK-004',
      branch: toulKorkBranch,
      dept: seededDepts['TK-02_FIN'],
      pos: seededPositions['TK-02_FIN_FIN-OFF'],
      firstName: 'Phalla',
      lastName: 'Kim',
      khmerName: 'គឹម ផល្លា',
      gender: 'female' as const,
      dob: new Date('1992-12-04'),
      phone: '+855 12 999 404',
      email: 'finance.tk@snp.edu.kh',
    },
    {
      employeeId: 'EMP-TK-005',
      branch: toulKorkBranch,
      dept: seededDepts['TK-02_ADM'],
      pos: seededPositions['TK-02_ADM_REC-01'],
      firstName: 'Chamroeun',
      lastName: 'Heng',
      khmerName: 'ហេង ចំរើន',
      gender: 'male' as const,
      dob: new Date('1997-04-16'),
      phone: '+855 12 999 505',
      email: 'chamroeun.heng@snp.edu.kh',
    },
    {
      employeeId: 'EMP-TK-006',
      branch: toulKorkBranch,
      dept: seededDepts['TK-02_ACA'],
      pos: seededPositions['TK-02_ACA_TCH-MATH'],
      firstName: 'Leakhena',
      lastName: 'Phan',
      khmerName: 'ផាន់ លក្ខិណា',
      gender: 'female' as const,
      dob: new Date('1993-02-28'),
      phone: '+855 12 999 606',
      email: 'leakhena.phan@snp.edu.kh',
    },
    {
      employeeId: 'EMP-SS-001',
      branch: senSokBranch,
      dept: seededDepts['SS-03_ACA'],
      pos: seededPositions['SS-03_ACA_TCH-ENG'],
      firstName: 'Neary',
      lastName: 'Pich',
      khmerName: 'ពេជ្រ នារី',
      gender: 'female' as const,
      dob: new Date('1994-06-18'),
      phone: '+855 12 777 101',
      email: 'teacher.ss@snp.edu.kh',
    },
    {
      employeeId: 'EMP-SS-002',
      branch: senSokBranch,
      dept: seededDepts['SS-03_ADM'],
      pos: seededPositions['SS-03_ADM_ADM-OFF'],
      firstName: 'Vireak',
      lastName: 'Tuy',
      khmerName: 'ទុយ វីរៈ',
      gender: 'male' as const,
      dob: new Date('1989-10-10'),
      phone: '+855 12 777 202',
      email: 'manager.ss@snp.edu.kh',
    },
    {
      employeeId: 'EMP-SS-003',
      branch: senSokBranch,
      dept: seededDepts['SS-03_ACA'],
      pos: seededPositions['SS-03_ACA_TCH-COM'],
      firstName: 'Sophal',
      lastName: 'Tep',
      khmerName: 'ទេព សុផល',
      gender: 'male' as const,
      dob: new Date('1996-01-25'),
      phone: '+855 12 777 303',
      email: 'sophal.tep@snp.edu.kh',
    },
    {
      employeeId: 'EMP-SS-004',
      branch: senSokBranch,
      dept: seededDepts['SS-03_FIN'],
      pos: seededPositions['SS-03_FIN_FIN-OFF'],
      firstName: 'Thida',
      lastName: 'Kem',
      khmerName: 'កែម ធីតា',
      gender: 'female' as const,
      dob: new Date('1993-09-08'),
      phone: '+855 12 777 404',
      email: 'finance.ss@snp.edu.kh',
    },
    {
      employeeId: 'EMP-SS-005',
      branch: senSokBranch,
      dept: seededDepts['SS-03_ADM'],
      pos: seededPositions['SS-03_ADM_REC-01'],
      firstName: 'Bunthan',
      lastName: 'Lim',
      khmerName: 'លីម ប៊ុនថាន',
      gender: 'male' as const,
      dob: new Date('1998-05-12'),
      phone: '+855 12 777 505',
      email: 'bunthan.lim@snp.edu.kh',
    },
    {
      employeeId: 'EMP-SS-006',
      branch: senSokBranch,
      dept: seededDepts['SS-03_ACA'],
      pos: seededPositions['SS-03_ACA_TCH-MATH'],
      firstName: 'Sovann',
      lastName: 'Ouk',
      khmerName: 'អ៊ុក សុវណ្ណ',
      gender: 'male' as const,
      dob: new Date('1992-03-31'),
      phone: '+855 12 777 606',
      email: 'sovann.ouk@snp.edu.kh',
    },
  ];

  const seededEmployees: Record<string, typeof EmployeeModel.prototype> = {};
  for (const emp of employeesToSeed) {
    if (emp.dept && emp.pos) {
      let empDoc = await EmployeeModel.findOne({
        employeeId: emp.employeeId,
        isDeleted: false,
      });
      if (!empDoc) {
        empDoc = await EmployeeModel.create({
          employeeId: emp.employeeId,
          schoolId: school._id,
          branchId: emp.branch._id,
          departmentId: emp.dept._id,
          positionId: emp.pos._id,
          firstName: emp.firstName,
          lastName: emp.lastName,
          khmerName: emp.khmerName,
          gender: emp.gender,
          dateOfBirth: emp.dob,
          phone: emp.phone,
          email: emp.email,
          joiningDate: new Date('2024-01-15'),
          employmentType: 'full_time',
          status: 'active',
        });
        logger.info(`Seeded employee: ${emp.employeeId} (${emp.firstName} ${emp.lastName})`);
      }
      seededEmployees[emp.employeeId] = empDoc;
    }
  }

  // 6. Academic Year
  let academicYear = await AcademicYearModel.findOne({
    schoolId: school._id,
    code: { $in: ['AY-2026-2027', '2026-2027'] },
    isDeleted: false,
  });
  if (!academicYear) {
    academicYear = await AcademicYearModel.create({
      schoolId: school._id,
      name: '2026–2027 Academic Year',
      code: 'AY-2026-2027',
      startDate: new Date('2026-08-01'),
      endDate: new Date('2027-07-31'),
      isCurrent: true,
      status: 'active',
    });
    logger.info('Seeded academic year: 2026-2027');
  } else if (academicYear.code !== 'AY-2026-2027') {
    academicYear.code = 'AY-2026-2027';
    academicYear.name = '2026–2027 Academic Year';
    academicYear.startDate = new Date('2026-08-01');
    academicYear.endDate = new Date('2027-07-31');
    await academicYear.save();
  }

  // 6.1 Academic Periods / Terms
  const periodsToSeed = [
    {
      code: 'TERM-1-2026',
      name: 'Term 1 (Aug–Nov 2026)',
      type: 'TERM' as const,
      startDate: new Date('2026-08-01'),
      endDate: new Date('2026-11-30'),
      sequence: 1,
      status: 'open' as const,
    },
    {
      code: 'TERM-2-2026',
      name: 'Term 2 (Dec 2026–Mar 2027)',
      type: 'TERM' as const,
      startDate: new Date('2026-12-01'),
      endDate: new Date('2027-03-31'),
      sequence: 2,
      status: 'planned' as const,
    },
    {
      code: 'TERM-3-2027',
      name: 'Term 3 (Apr–Jul 2027)',
      type: 'TERM' as const,
      startDate: new Date('2027-04-01'),
      endDate: new Date('2027-07-31'),
      sequence: 3,
      status: 'planned' as const,
    },
  ];

  const seededPeriods: Record<string, typeof AcademicPeriodModel.prototype> = {};
  for (const p of periodsToSeed) {
    let pDoc = await AcademicPeriodModel.findOne({
      academicYearId: academicYear._id,
      code: p.code,
      isDeleted: false,
    });
    if (!pDoc) {
      pDoc = await AcademicPeriodModel.create({
        schoolId: school._id,
        academicYearId: academicYear._id,
        code: p.code,
        name: p.name,
        type: p.type,
        startDate: p.startDate,
        endDate: p.endDate,
        sequence: p.sequence,
        status: p.status,
      });
      logger.info(`Seeded academic period: ${p.name}`);
    }
    seededPeriods[p.code] = pDoc;
  }

  // 7. Classrooms
  const classroomsToSeed = [
    { branch: mainBranch, code: 'RM-101', name: 'Classroom 101 (Main A)', capacity: 35 },
    { branch: mainBranch, code: 'RM-102', name: 'Computer Lab 1 (Main Lab)', capacity: 30 },
    { branch: mainBranch, code: 'RM-103', name: 'Classroom 103 (Main B)', capacity: 35 },
    { branch: mainBranch, code: 'RM-104', name: 'Classroom 104 (Main C)', capacity: 30 },
    { branch: toulKorkBranch, code: 'RM-201', name: 'Classroom 201 (TK A)', capacity: 30 },
    { branch: toulKorkBranch, code: 'RM-202', name: 'Computer Lab 2 (TK Lab)', capacity: 25 },
    { branch: toulKorkBranch, code: 'RM-203', name: 'Classroom 203 (TK B)', capacity: 30 },
    { branch: senSokBranch, code: 'RM-301', name: 'Classroom 301 (SS A)', capacity: 30 },
    { branch: senSokBranch, code: 'RM-302', name: 'Computer Lab 3 (SS Lab)', capacity: 25 },
    { branch: senSokBranch, code: 'RM-303', name: 'Classroom 303 (SS B)', capacity: 25 },
  ];

  const seededRooms: Record<string, typeof ClassroomModel.prototype> = {};
  for (const rm of classroomsToSeed) {
    let room = await ClassroomModel.findOne({
      branchId: rm.branch._id,
      code: rm.code,
      isDeleted: false,
    });
    if (!room) {
      room = await ClassroomModel.create({
        schoolId: school._id,
        branchId: rm.branch._id,
        code: rm.code,
        name: rm.name,
        capacity: rm.capacity,
        status: 'active',
      });
      logger.info(`Seeded classroom: ${rm.code} (${rm.branch.branchCode})`);
    }
    seededRooms[`${rm.branch.branchCode}_${rm.code}`] = room;
  }

  // 7.1 Study Modes
  const studyModesData = [
    {
      code: 'FT',
      nameEn: 'Full-Time (Mon-Fri 08:00-16:00)',
      nameKh: 'ពេញម៉ោង (ចន្ទ-សុក្រ ០៨:០០-១៦:០០)',
      description: 'Full time day program',
      sortOrder: 1,
    },
    {
      code: 'PT',
      nameEn: 'Part-Time (Mon-Fri 2 hrs/day)',
      nameKh: 'ក្រៅម៉ោង (ចន្ទ-សុក្រ ២ ម៉ោង/ថ្ងៃ)',
      description: 'Part time program',
      sortOrder: 2,
    },
    {
      code: 'WK',
      nameEn: 'Weekend (Sat-Sun 4 hrs/day)',
      nameKh: 'ចុងសប្តាហ៍ (សៅរ៍-អាទិត្យ ៤ ម៉ោង/ថ្ងៃ)',
      description: 'Weekend intensive program',
      sortOrder: 3,
    },
    {
      code: 'HR',
      nameEn: 'Hourly Course (1 hr/day)',
      nameKh: 'វគ្គសិក្សារៀងរាល់ម៉ោង (១ ម៉ោង/ថ្ងៃ)',
      description: 'Hourly elective course',
      sortOrder: 4,
    },
  ];

  const seededStudyModes: Record<string, typeof StudyModeModel.prototype> = {};
  for (const sm of studyModesData) {
    let mode = await StudyModeModel.findOne({
      schoolId: school._id,
      code: sm.code,
      isDeleted: false,
    });
    if (!mode) {
      mode = await StudyModeModel.create({
        schoolId: school._id,
        code: sm.code,
        nameEn: sm.nameEn,
        nameKh: sm.nameKh,
        description: sm.description,
        sortOrder: sm.sortOrder,
        isActive: true,
      });
      logger.info(`Seeded study mode: ${sm.code}`);
    }
    seededStudyModes[sm.code] = mode;
  }

  // 7.2 Time Slots
  const timeSlotsData = [
    {
      code: 'TS-M1',
      name: 'Morning Slot 1 (08:00 - 11:00)',
      sessionType: 'morning' as const,
      startTime: '08:00',
      endTime: '11:00',
      durationMinutes: 180,
      sortOrder: 1,
    },
    {
      code: 'TS-A1',
      name: 'Afternoon Slot 1 (14:00 - 17:00)',
      sessionType: 'afternoon' as const,
      startTime: '14:00',
      endTime: '17:00',
      durationMinutes: 180,
      sortOrder: 2,
    },
    {
      code: 'TS-E1',
      name: 'Evening Slot 1 (17:30 - 19:30)',
      sessionType: 'evening' as const,
      startTime: '17:30',
      endTime: '19:30',
      durationMinutes: 120,
      sortOrder: 3,
    },
    {
      code: 'TS-W1',
      name: 'Weekend Morning (08:00 - 12:00)',
      sessionType: 'morning' as const,
      startTime: '08:00',
      endTime: '12:00',
      durationMinutes: 240,
      sortOrder: 4,
    },
  ];

  const seededTimeSlots: Record<string, typeof TimeSlotModel.prototype> = {};
  for (const ts of timeSlotsData) {
    let slot = await TimeSlotModel.findOne({
      schoolId: school._id,
      code: ts.code,
      isDeleted: false,
    });
    if (!slot) {
      slot = await TimeSlotModel.create({
        schoolId: school._id,
        code: ts.code,
        name: ts.name,
        sessionType: ts.sessionType,
        startTime: ts.startTime,
        endTime: ts.endTime,
        durationMinutes: ts.durationMinutes,
        sortOrder: ts.sortOrder,
        isActive: true,
      });
      logger.info(`Seeded time slot: ${ts.code}`);
    }
    seededTimeSlots[ts.code] = slot;
  }

  // 8. Programs
  let engProgram = await ProgramModel.findOne({
    schoolId: school._id,
    code: 'GEP',
    isDeleted: false,
  });
  if (!engProgram) {
    engProgram = await ProgramModel.create({
      schoolId: school._id,
      code: 'GEP',
      nameEn: 'General English Program',
      nameKh: 'កម្មវិធីភាសាអង់គ្លេសទូទៅ',
      description: 'Comprehensive ESL English curriculum for K-12 and adult learners',
      status: 'active',
    });
    logger.info('Seeded program: GEP');
  }

  let comProgram = await ProgramModel.findOne({
    schoolId: school._id,
    code: 'CTP',
    isDeleted: false,
  });
  if (!comProgram) {
    comProgram = await ProgramModel.create({
      schoolId: school._id,
      code: 'CTP',
      nameEn: 'Computer & Technology Program',
      nameKh: 'កម្មវិធីកុំព្យូទ័រ និងបច្ចេកវិទ្យា',
      description: 'Practical digital literacy, office applications, and IT courses',
      status: 'active',
    });
    logger.info('Seeded program: CTP');
  }

  let khmProgram = await ProgramModel.findOne({
    schoolId: school._id,
    code: 'KGEP',
    isDeleted: false,
  });
  if (!khmProgram) {
    khmProgram = await ProgramModel.create({
      schoolId: school._id,
      code: 'KGEP',
      nameEn: 'Khmer General Education Program',
      nameKh: 'កម្មវិធីចំណេះដឹងទូទៅខ្មែរ',
      description: 'National curriculum general education',
      status: 'active',
    });
    logger.info('Seeded program: KGEP');
  }

  // 9. Levels
  const levelsData = [
    { prog: engProgram, code: 'ENG-BEG', name: 'English Beginner (Level 1-2)', seq: 1 },
    { prog: engProgram, code: 'ENG-ELEM', name: 'English Elementary (Level 3-4)', seq: 2 },
    { prog: engProgram, code: 'ENG-INT', name: 'English Intermediate (Level 5-8)', seq: 3 },
    { prog: engProgram, code: 'ENG-ADV', name: 'English Advanced (Level 9-12)', seq: 4 },
    { prog: comProgram, code: 'COM-BSC', name: 'Computer Fundamentals', seq: 1 },
    { prog: comProgram, code: 'COM-OFF', name: 'MS Office & Digital Tools', seq: 2 },
    { prog: khmProgram, code: 'KHM-P1', name: 'Primary Grade 1-3', seq: 1 },
    { prog: khmProgram, code: 'KHM-P2', name: 'Primary Grade 4-6', seq: 2 },
  ];

  const seededLevels: Record<string, typeof LevelModel.prototype> = {};
  for (const lvl of levelsData) {
    let lvlDoc = await LevelModel.findOne({
      programId: lvl.prog._id,
      code: lvl.code,
      isDeleted: false,
    });
    if (!lvlDoc) {
      lvlDoc = await LevelModel.create({
        schoolId: school._id,
        programId: lvl.prog._id,
        code: lvl.code,
        name: lvl.name,
        sequence: lvl.seq,
        status: 'active',
      });
      logger.info(`Seeded level: ${lvl.code}`);
    }
    seededLevels[lvl.code] = lvlDoc;
  }

  // 10. Subjects Catalog
  const subjectsData = [
    { code: 'ENG-GRAM', name: 'English Grammar & Structure', category: 'english' as const },
    { code: 'ENG-READ', name: 'Reading & Vocabulary', category: 'english' as const },
    { code: 'ENG-LSTN', name: 'Listening & Speaking', category: 'english' as const },
    { code: 'COM-FND', name: 'Computer Fundamentals & OS', category: 'computer' as const },
    { code: 'COM-TYP', name: 'Khmer & English Keyboard Typing', category: 'computer' as const },
    { code: 'MATH-PRI', name: 'Primary Mathematics', category: 'general' as const },
    { code: 'KHM-LIT', name: 'Khmer Literature & Reading', category: 'general' as const },
    { code: 'SCI-PRI', name: 'General Science', category: 'general' as const },
  ];

  const seededSubjects: Record<string, typeof SubjectModel.prototype> = {};
  for (const s of subjectsData) {
    let subDoc = await SubjectModel.findOne({
      schoolId: school._id,
      code: s.code,
      isDeleted: false,
    });
    if (!subDoc) {
      subDoc = await SubjectModel.create({
        schoolId: school._id,
        code: s.code,
        name: s.name,
        category: s.category,
        status: 'active',
      });
      logger.info(`Seeded subject: ${s.code}`);
    }
    seededSubjects[s.code] = subDoc;
  }

  // 11. Curricula
  let engElemCurr = await CurriculumModel.findOne({
    schoolId: school._id,
    code: 'CURR-ENG-ELEM',
    isDeleted: false,
  });
  if (!engElemCurr && seededLevels['ENG-ELEM']) {
    engElemCurr = await CurriculumModel.create({
      schoolId: school._id,
      programId: engProgram._id,
      levelId: seededLevels['ENG-ELEM']._id,
      academicYearId: academicYear._id,
      name: 'GEP Elementary Standard Curriculum',
      code: 'CURR-ENG-ELEM',
      subjects: [
        {
          subjectId: seededSubjects['ENG-GRAM']?._id,
          weeklyHours: 4,
          totalHours: 40,
          sequence: 1,
          passingScore: 50,
          isRequired: true,
        },
        {
          subjectId: seededSubjects['ENG-READ']?._id,
          weeklyHours: 3,
          totalHours: 30,
          sequence: 2,
          passingScore: 50,
          isRequired: true,
        },
        {
          subjectId: seededSubjects['ENG-LSTN']?._id,
          weeklyHours: 3,
          totalHours: 30,
          sequence: 3,
          passingScore: 50,
          isRequired: true,
        },
      ],
      status: 'active',
    });
    logger.info('Seeded curriculum: CURR-ENG-ELEM');
  }

  let comBscCurr = await CurriculumModel.findOne({
    schoolId: school._id,
    code: 'CURR-COM-BSC',
    isDeleted: false,
  });
  if (!comBscCurr && seededLevels['COM-BSC']) {
    comBscCurr = await CurriculumModel.create({
      schoolId: school._id,
      programId: comProgram._id,
      levelId: seededLevels['COM-BSC']._id,
      academicYearId: academicYear._id,
      name: 'Computer Basic Operations Curriculum',
      code: 'CURR-COM-BSC',
      subjects: [
        {
          subjectId: seededSubjects['COM-FND']?._id,
          weeklyHours: 5,
          totalHours: 50,
          sequence: 1,
          passingScore: 50,
          isRequired: true,
        },
        {
          subjectId: seededSubjects['COM-TYP']?._id,
          weeklyHours: 3,
          totalHours: 30,
          sequence: 2,
          passingScore: 50,
          isRequired: true,
        },
      ],
      status: 'active',
    });
    logger.info('Seeded curriculum: CURR-COM-BSC');
  }

  // 11.1 Intakes
  let intEngElemT1 = await IntakeModel.findOne({
    academicYearId: academicYear._id,
    code: 'INT-2026-ENG-ELEM-T1',
    isDeleted: false,
  });
  if (!intEngElemT1 && seededLevels['ENG-ELEM'] && engElemCurr) {
    intEngElemT1 = await IntakeModel.create({
      schoolId: school._id,
      academicYearId: academicYear._id,
      academicPeriodId: seededPeriods['TERM-1-2026']?._id,
      programId: engProgram._id,
      levelId: seededLevels['ENG-ELEM']._id,
      curriculumId: engElemCurr._id,
      name: '2026 Term 1 GEP Elementary Intake',
      code: 'INT-2026-ENG-ELEM-T1',
      startDate: new Date('2026-08-01'),
      endDate: new Date('2026-11-30'),
      status: 'open',
    });
    logger.info('Seeded intake: INT-2026-ENG-ELEM-T1');
  }

  let intComBscT1 = await IntakeModel.findOne({
    academicYearId: academicYear._id,
    code: 'INT-2026-COM-BSC-T1',
    isDeleted: false,
  });
  if (!intComBscT1 && seededLevels['COM-BSC'] && comBscCurr) {
    intComBscT1 = await IntakeModel.create({
      schoolId: school._id,
      academicYearId: academicYear._id,
      academicPeriodId: seededPeriods['TERM-1-2026']?._id,
      programId: comProgram._id,
      levelId: seededLevels['COM-BSC']._id,
      curriculumId: comBscCurr._id,
      name: '2026 Term 1 Computer Basic Intake',
      code: 'INT-2026-COM-BSC-T1',
      startDate: new Date('2026-08-01'),
      endDate: new Date('2026-11-30'),
      status: 'open',
    });
    logger.info('Seeded intake: INT-2026-COM-BSC-T1');
  }

  // 12. Classes Across Branches (18 Classes)
  const classesToSeed = [
    {
      code: 'ENG-ELEM-M1',
      name: 'English Elementary Morning A',
      branch: mainBranch,
      program: engProgram,
      level: seededLevels['ENG-ELEM'],
      studyMode: seededStudyModes['FT'],
      room: seededRooms['MB-01_RM-101'],
      teacher: seededEmployees['EMP-MB-001'],
      period: seededPeriods['TERM-1-2026'],
      section: 'A',
      capacity: 35,
    },
    {
      code: 'COM-BSC-W1',
      name: 'Computer Basic Weekend A',
      branch: mainBranch,
      program: comProgram,
      level: seededLevels['COM-BSC'],
      studyMode: seededStudyModes['WK'],
      room: seededRooms['MB-01_RM-102'],
      teacher: seededEmployees['EMP-MB-006'],
      period: seededPeriods['TERM-1-2026'],
      section: 'A',
      capacity: 30,
    },
    {
      code: 'ENG-L3-FT-A',
      name: 'English Level 3 Full-Time A',
      branch: mainBranch,
      program: engProgram,
      level: seededLevels['ENG-INT'],
      studyMode: seededStudyModes['FT'],
      room: seededRooms['MB-01_RM-101'],
      teacher: seededEmployees['EMP-MB-001'],
      period: seededPeriods['TERM-1-2026'],
      section: 'A',
      capacity: 30,
    },
    {
      code: 'ENG-L2-PT-A',
      name: 'English Level 2 Part-Time A',
      branch: mainBranch,
      program: engProgram,
      level: seededLevels['ENG-ELEM'],
      studyMode: seededStudyModes['PT'],
      room: seededRooms['MB-01_RM-103'],
      teacher: seededEmployees['EMP-MB-002'],
      period: seededPeriods['TERM-1-2026'],
      section: 'A',
      capacity: 30,
    },
    {
      code: 'ENG-L2-PT-B',
      name: 'English Level 2 Part-Time B',
      branch: mainBranch,
      program: engProgram,
      level: seededLevels['ENG-ELEM'],
      studyMode: seededStudyModes['PT'],
      room: seededRooms['MB-01_RM-103'],
      teacher: seededEmployees['EMP-MB-002'],
      period: seededPeriods['TERM-1-2026'],
      section: 'B',
      capacity: 30,
    },
    {
      code: 'COM-TYP-HR-A',
      name: 'Computer Typing Hourly A',
      branch: mainBranch,
      program: comProgram,
      level: seededLevels['COM-BSC'],
      studyMode: seededStudyModes['HR'],
      room: seededRooms['MB-01_RM-102'],
      teacher: seededEmployees['EMP-MB-006'],
      period: seededPeriods['TERM-1-2026'],
      section: 'A',
      capacity: 25,
    },
    {
      code: 'KHM-PRI-M1',
      name: 'Khmer Primary General Morning A',
      branch: mainBranch,
      program: khmProgram,
      level: seededLevels['KHM-P1'],
      studyMode: seededStudyModes['FT'],
      room: seededRooms['MB-01_RM-104'],
      teacher: seededEmployees['EMP-MB-007'],
      period: seededPeriods['TERM-1-2026'],
      section: 'A',
      capacity: 30,
    },
    {
      code: 'ENG-ADV-E1',
      name: 'English Advanced Evening A',
      branch: mainBranch,
      program: engProgram,
      level: seededLevels['ENG-ADV'],
      studyMode: seededStudyModes['PT'],
      room: seededRooms['MB-01_RM-101'],
      teacher: seededEmployees['EMP-MB-001'],
      period: seededPeriods['TERM-1-2026'],
      section: 'A',
      capacity: 25,
    },
    {
      code: 'ENG-BEG-A1',
      name: 'English Beginner Afternoon A (TK)',
      branch: toulKorkBranch,
      program: engProgram,
      level: seededLevels['ENG-BEG'],
      studyMode: seededStudyModes['PT'],
      room: seededRooms['TK-02_RM-201'],
      teacher: seededEmployees['EMP-TK-001'],
      period: seededPeriods['TERM-1-2026'],
      section: 'A',
      capacity: 30,
    },
    {
      code: 'ENG-INT-M1-TK',
      name: 'English Intermediate Morning A (TK)',
      branch: toulKorkBranch,
      program: engProgram,
      level: seededLevels['ENG-INT'],
      studyMode: seededStudyModes['FT'],
      room: seededRooms['TK-02_RM-201'],
      teacher: seededEmployees['EMP-TK-001'],
      period: seededPeriods['TERM-1-2026'],
      section: 'A',
      capacity: 30,
    },
    {
      code: 'COM-OFF-TK-A1',
      name: 'Computer MS Office Morning A (TK)',
      branch: toulKorkBranch,
      program: comProgram,
      level: seededLevels['COM-OFF'],
      studyMode: seededStudyModes['PT'],
      room: seededRooms['TK-02_RM-202'],
      teacher: seededEmployees['EMP-TK-003'],
      period: seededPeriods['TERM-1-2026'],
      section: 'A',
      capacity: 25,
    },
    {
      code: 'ENG-ELEM-TK-E1',
      name: 'English Elementary Evening A (TK)',
      branch: toulKorkBranch,
      program: engProgram,
      level: seededLevels['ENG-ELEM'],
      studyMode: seededStudyModes['PT'],
      room: seededRooms['TK-02_RM-203'],
      teacher: seededEmployees['EMP-TK-001'],
      period: seededPeriods['TERM-1-2026'],
      section: 'A',
      capacity: 30,
    },
    {
      code: 'KHM-MATH-TK-W1',
      name: 'Khmer Mathematics Weekend A (TK)',
      branch: toulKorkBranch,
      program: khmProgram,
      level: seededLevels['KHM-P2'],
      studyMode: seededStudyModes['WK'],
      room: seededRooms['TK-02_RM-201'],
      teacher: seededEmployees['EMP-TK-006'],
      period: seededPeriods['TERM-1-2026'],
      section: 'A',
      capacity: 25,
    },
    {
      code: 'ENG-BEG-SS-A1',
      name: 'English Beginner Morning A (Sen Sok)',
      branch: senSokBranch,
      program: engProgram,
      level: seededLevels['ENG-BEG'],
      studyMode: seededStudyModes['FT'],
      room: seededRooms['SS-03_RM-301'],
      teacher: seededEmployees['EMP-SS-001'],
      period: seededPeriods['TERM-1-2026'],
      section: 'A',
      capacity: 30,
    },
    {
      code: 'COM-BSC-SS-E1',
      name: 'Computer Basic Evening A (Sen Sok)',
      branch: senSokBranch,
      program: comProgram,
      level: seededLevels['COM-BSC'],
      studyMode: seededStudyModes['PT'],
      room: seededRooms['SS-03_RM-302'],
      teacher: seededEmployees['EMP-SS-003'],
      period: seededPeriods['TERM-1-2026'],
      section: 'A',
      capacity: 25,
    },
    {
      code: 'ENG-KIDS-SS-M1',
      name: 'English Kids Starter Morning A (Sen Sok)',
      branch: senSokBranch,
      program: engProgram,
      level: seededLevels['ENG-BEG'],
      studyMode: seededStudyModes['PT'],
      room: seededRooms['SS-03_RM-303'],
      teacher: seededEmployees['EMP-SS-001'],
      period: seededPeriods['TERM-1-2026'],
      section: 'A',
      capacity: 25,
    },
    {
      code: 'COM-WEB-SS-W1',
      name: 'Computer Web Literacy Weekend A (Sen Sok)',
      branch: senSokBranch,
      program: comProgram,
      level: seededLevels['COM-BSC'],
      studyMode: seededStudyModes['WK'],
      room: seededRooms['SS-03_RM-302'],
      teacher: seededEmployees['EMP-SS-003'],
      period: seededPeriods['TERM-1-2026'],
      section: 'A',
      capacity: 20,
    },
    {
      code: 'ENG-INT-SS-A1',
      name: 'English Intermediate Afternoon A (Sen Sok)',
      branch: senSokBranch,
      program: engProgram,
      level: seededLevels['ENG-INT'],
      studyMode: seededStudyModes['PT'],
      room: seededRooms['SS-03_RM-301'],
      teacher: seededEmployees['EMP-SS-001'],
      period: seededPeriods['TERM-1-2026'],
      section: 'A',
      capacity: 30,
    },
  ];

  const seededClasses: Record<string, typeof ClassModel.prototype> = {};
  for (const c of classesToSeed) {
    if (c.level) {
      let cls = await ClassModel.findOne({
        branchId: c.branch._id,
        academicYearId: academicYear._id,
        classCode: c.code,
        isDeleted: false,
      });
      if (!cls) {
        cls = await ClassModel.create({
          schoolId: school._id,
          branchId: c.branch._id,
          academicYearId: academicYear._id,
          academicPeriodId: c.period?._id,
          programId: c.program._id,
          levelId: c.level._id,
          studyModeId: c.studyMode?._id,
          section: c.section,
          classroomId: c.room?._id,
          defaultClassroomId: c.room?._id,
          classTeacherId: c.teacher?._id,
          classCode: c.code,
          className: c.name,
          capacity: c.capacity,
          startDate: new Date('2026-08-01'),
          endDate: new Date('2026-11-30'),
          status: 'active',
        });
        logger.info(`Seeded class: ${c.name} (${c.code})`);
      }
      seededClasses[c.code] = cls;
    }
  }

  // 13. Extensive Students Master & Guardians Directory (80 Students across 3 Branches)
  const studentsToSeed = [
    {
      id: 'STU-000001',
      branch: mainBranch,
      fn: 'Sothea',
      ln: 'Chan',
      kh: 'ចាន់ សុធា',
      g: 'male' as const,
      dob: '2010-05-12',
      ph: '+855 98 111 222',
      em: 'sothea.chan@student.snp.edu.kh',
      gn: 'Chan Samnang',
      gr: 'father' as const,
      gp: '+855 12 999 111',
      go: 'Civil Engineer',
    },
    {
      id: 'STU-000002',
      branch: mainBranch,
      fn: 'Bopha',
      ln: 'Long',
      kh: 'ឡុង បុប្ផា',
      g: 'female' as const,
      dob: '2011-08-20',
      ph: '+855 98 222 333',
      em: 'bopha.long@student.snp.edu.kh',
      gn: 'Long Vanna',
      gr: 'mother' as const,
      gp: '+855 17 888 222',
      go: 'Business Owner',
    },
    {
      id: 'STU-000003',
      branch: mainBranch,
      fn: 'Rattanak',
      ln: 'Keo',
      kh: 'កែវ រតនៈ',
      g: 'male' as const,
      dob: '2009-11-03',
      ph: '+855 98 333 444',
      em: 'rattanak.keo@student.snp.edu.kh',
      gn: 'Keo Sovath',
      gr: 'father' as const,
      gp: '+855 12 777 333',
      go: 'Architect',
    },
    {
      id: 'STU-000004',
      branch: mainBranch,
      fn: 'Channary',
      ln: 'Meas',
      kh: 'មាស ច័ន្ទណារី',
      g: 'female' as const,
      dob: '2012-03-14',
      ph: '+855 98 444 555',
      em: 'channary.meas@student.snp.edu.kh',
      gn: 'Meas Sokun',
      gr: 'mother' as const,
      gp: '+855 12 666 444',
      go: 'Pharmacist',
    },
    {
      id: 'STU-000005',
      branch: mainBranch,
      fn: 'Visal',
      ln: 'Heng',
      kh: 'ហេង វិសាល',
      g: 'male' as const,
      dob: '2010-07-22',
      ph: '+855 98 555 666',
      em: 'visal.heng@student.snp.edu.kh',
      gn: 'Heng Sambath',
      gr: 'father' as const,
      gp: '+855 12 555 555',
      go: 'Accountant',
    },
    {
      id: 'STU-000006',
      branch: mainBranch,
      fn: 'Chetra',
      ln: 'Sok',
      kh: 'សុខ ចិត្រា',
      g: 'male' as const,
      dob: '2011-01-15',
      ph: '+855 98 666 777',
      em: 'chetra.sok@student.snp.edu.kh',
      gn: 'Sok Visoth',
      gr: 'father' as const,
      gp: '+855 12 444 111',
      go: 'Doctor',
    },
    {
      id: 'STU-000007',
      branch: mainBranch,
      fn: 'Kallyan',
      ln: 'Lim',
      kh: 'លីម កល្យាណ',
      g: 'female' as const,
      dob: '2012-09-08',
      ph: '+855 98 777 888',
      em: 'kallyan.lim@student.snp.edu.kh',
      gn: 'Lim Thida',
      gr: 'mother' as const,
      gp: '+855 12 333 222',
      go: 'Bank Manager',
    },
    {
      id: 'STU-000008',
      branch: mainBranch,
      fn: 'Serey',
      ln: 'Vuth',
      kh: 'វុធ សិរី',
      g: 'male' as const,
      dob: '2010-12-04',
      ph: '+855 98 888 999',
      em: 'serey.vuth@student.snp.edu.kh',
      gn: 'Vuth Dara',
      gr: 'father' as const,
      gp: '+855 12 222 333',
      go: 'Shop Owner',
    },
    {
      id: 'STU-000009',
      branch: mainBranch,
      fn: 'Sophea',
      ln: 'Pich',
      kh: 'ពេជ្រ សុភា',
      g: 'female' as const,
      dob: '2011-04-30',
      ph: '+855 98 999 000',
      em: 'sophea.pich@student.snp.edu.kh',
      gn: 'Pich Chantou',
      gr: 'mother' as const,
      gp: '+855 12 111 444',
      go: 'Teacher',
    },
    {
      id: 'STU-000010',
      branch: mainBranch,
      fn: 'Sovannara',
      ln: 'Tep',
      kh: 'ទេព សុវណ្ណារ៉ា',
      g: 'male' as const,
      dob: '2009-06-18',
      ph: '+855 98 101 010',
      em: 'sovannara.tep@student.snp.edu.kh',
      gn: 'Tep Bunleang',
      gr: 'father' as const,
      gp: '+855 11 999 555',
      go: 'Government Official',
    },
    {
      id: 'STU-000011',
      branch: mainBranch,
      fn: 'Chanmony',
      ln: 'Sam',
      kh: 'សំ ច័ន្ទមុនី',
      g: 'female' as const,
      dob: '2012-11-25',
      ph: '+855 98 202 020',
      em: 'chanmony.sam@student.snp.edu.kh',
      gn: 'Sam Khemara',
      gr: 'mother' as const,
      gp: '+855 11 888 666',
      go: 'Nurse',
    },
    {
      id: 'STU-000012',
      branch: mainBranch,
      fn: 'Phearith',
      ln: 'Nguon',
      kh: 'ងួន ភារិទ្ធ',
      g: 'male' as const,
      dob: '2010-02-14',
      ph: '+855 98 303 030',
      em: 'phearith.nguon@student.snp.edu.kh',
      gn: 'Nguon Vannak',
      gr: 'father' as const,
      gp: '+855 11 777 777',
      go: 'IT Consultant',
    },
    {
      id: 'STU-000013',
      branch: mainBranch,
      fn: 'Kolab',
      ln: 'Ros',
      kh: 'រស់ កូឡាប',
      g: 'female' as const,
      dob: '2011-10-19',
      ph: '+855 98 404 040',
      em: 'kolab.ros@student.snp.edu.kh',
      gn: 'Ros Malis',
      gr: 'mother' as const,
      gp: '+855 11 666 888',
      go: 'Retailer',
    },
    {
      id: 'STU-000014',
      branch: mainBranch,
      fn: 'Mengly',
      ln: 'Ouk',
      kh: 'អ៊ុក ម៉េងលី',
      g: 'male' as const,
      dob: '2009-08-05',
      ph: '+855 98 505 050',
      em: 'mengly.ouk@student.snp.edu.kh',
      gn: 'Ouk Chhay',
      gr: 'father' as const,
      gp: '+855 11 555 999',
      go: 'Lawyer',
    },
    {
      id: 'STU-000015',
      branch: mainBranch,
      fn: 'Romduol',
      ln: 'Chhun',
      kh: 'ឈុន រំដួល',
      g: 'female' as const,
      dob: '2012-05-17',
      ph: '+855 98 606 060',
      em: 'romduol.chhun@student.snp.edu.kh',
      gn: 'Chhun Bopha',
      gr: 'mother' as const,
      gp: '+855 11 444 000',
      go: 'Designer',
    },
    {
      id: 'STU-000016',
      branch: mainBranch,
      fn: 'Sopheaktra',
      ln: 'Kem',
      kh: 'កែម សុភក្ត្រា',
      g: 'male' as const,
      dob: '2010-09-21',
      ph: '+855 98 707 070',
      em: 'sopheaktra.kem@student.snp.edu.kh',
      gn: 'Kem Vicheth',
      gr: 'father' as const,
      gp: '+855 10 999 123',
      go: 'Engineer',
    },
    {
      id: 'STU-000017',
      branch: mainBranch,
      fn: 'Theary',
      ln: 'Chea',
      kh: 'ជា ធារី',
      g: 'female' as const,
      dob: '2011-07-11',
      ph: '+855 98 808 080',
      em: 'theary.chea@student.snp.edu.kh',
      gn: 'Chea Sreymom',
      gr: 'mother' as const,
      gp: '+855 10 888 234',
      go: 'Accountant',
    },
    {
      id: 'STU-000018',
      branch: mainBranch,
      fn: 'Vicheka',
      ln: 'Nou',
      kh: 'នូ វិច្ឆិកា',
      g: 'female' as const,
      dob: '2010-11-16',
      ph: '+855 98 909 090',
      em: 'vicheka.nou@student.snp.edu.kh',
      gn: 'Nou Bora',
      gr: 'father' as const,
      gp: '+855 10 777 345',
      go: 'Banker',
    },
    {
      id: 'STU-000019',
      branch: mainBranch,
      fn: 'Rithysak',
      ln: 'Prum',
      kh: 'ព្រំ រិទ្ធិស័ក្តិ',
      g: 'male' as const,
      dob: '2009-04-28',
      ph: '+855 98 123 456',
      em: 'rithysak.prum@student.snp.edu.kh',
      gn: 'Prum Sopheak',
      gr: 'father' as const,
      gp: '+855 10 666 456',
      go: 'Chef',
    },
    {
      id: 'STU-000020',
      branch: mainBranch,
      fn: 'Kunthea',
      ln: 'Yim',
      kh: 'យឹម គន្ធា',
      g: 'female' as const,
      dob: '2012-01-09',
      ph: '+855 98 234 567',
      em: 'kunthea.yim@student.snp.edu.kh',
      gn: 'Yim Somaly',
      gr: 'mother' as const,
      gp: '+855 10 555 567',
      go: 'Architect',
    },
    {
      id: 'STU-000021',
      branch: mainBranch,
      fn: 'Panha',
      ln: 'Kuy',
      kh: 'គុយ បញ្ញា',
      g: 'male' as const,
      dob: '2010-08-14',
      ph: '+855 98 345 678',
      em: 'panha.kuy@student.snp.edu.kh',
      gn: 'Kuy Rithy',
      gr: 'father' as const,
      gp: '+855 10 444 678',
      go: 'Electrician',
    },
    {
      id: 'STU-000022',
      branch: mainBranch,
      fn: 'Moniroth',
      ln: 'Som',
      kh: 'សោម មុនីរ័ត្ន',
      g: 'female' as const,
      dob: '2011-03-23',
      ph: '+855 98 456 789',
      em: 'moniroth.som@student.snp.edu.kh',
      gn: 'Som Rachana',
      gr: 'mother' as const,
      gp: '+855 10 333 789',
      go: 'Merchant',
    },
    {
      id: 'STU-000023',
      branch: mainBranch,
      fn: 'Vathanak',
      ln: 'Sen',
      kh: 'សែន វឌ្ឍនៈ',
      g: 'male' as const,
      dob: '2009-12-30',
      ph: '+855 98 567 890',
      em: 'vathanak.sen@student.snp.edu.kh',
      gn: 'Sen Virak',
      gr: 'father' as const,
      gp: '+855 10 222 890',
      go: 'Contractor',
    },
    {
      id: 'STU-000024',
      branch: mainBranch,
      fn: 'Nearyneath',
      ln: 'Ung',
      kh: 'អ៊ឹង នារីនាថ',
      g: 'female' as const,
      dob: '2012-06-15',
      ph: '+855 98 678 901',
      em: 'nearyneath.ung@student.snp.edu.kh',
      gn: 'Ung Phalla',
      gr: 'mother' as const,
      gp: '+855 10 111 901',
      go: 'Dentist',
    },
    {
      id: 'STU-000025',
      branch: mainBranch,
      fn: 'Samnang',
      ln: 'Pen',
      kh: 'ប៉ែន សំណាង',
      g: 'male' as const,
      dob: '2010-10-08',
      ph: '+855 98 789 012',
      em: 'samnang.pen@student.snp.edu.kh',
      gn: 'Pen Chanthy',
      gr: 'father' as const,
      gp: '+855 15 999 012',
      go: 'Pharmacist',
    },
    {
      id: 'STU-000026',
      branch: mainBranch,
      fn: 'Pisey',
      ln: 'Tan',
      kh: 'តាន់ ពិសី',
      g: 'female' as const,
      dob: '2011-02-19',
      ph: '+855 98 890 123',
      em: 'pisey.tan@student.snp.edu.kh',
      gn: 'Tan Sreyneang',
      gr: 'mother' as const,
      gp: '+855 15 888 123',
      go: 'Teacher',
    },
    {
      id: 'STU-000027',
      branch: mainBranch,
      fn: 'Bunrith',
      ln: 'Ly',
      kh: 'លី ប៊ុនរិទ្ធ',
      g: 'male' as const,
      dob: '2009-05-03',
      ph: '+855 98 901 234',
      em: 'bunrith.ly@student.snp.edu.kh',
      gn: 'Ly Sophearith',
      gr: 'father' as const,
      gp: '+855 15 777 234',
      go: 'Civil Servant',
    },
    {
      id: 'STU-000028',
      branch: mainBranch,
      fn: 'Malis',
      ln: 'Khun',
      kh: 'ឃុន ម្លិះ',
      g: 'female' as const,
      dob: '2012-08-27',
      ph: '+855 98 012 345',
      em: 'malis.khun@student.snp.edu.kh',
      gn: 'Khun Kalyan',
      gr: 'mother' as const,
      gp: '+855 15 666 345',
      go: 'Florist',
    },
    {
      id: 'STU-000029',
      branch: mainBranch,
      fn: 'Davit',
      ln: 'Eam',
      kh: 'អ៊ាម ដាវីត',
      g: 'male' as const,
      dob: '2010-03-12',
      ph: '+855 98 123 457',
      em: 'davit.eam@student.snp.edu.kh',
      gn: 'Eam Kosal',
      gr: 'father' as const,
      gp: '+855 15 555 456',
      go: 'Manager',
    },
    {
      id: 'STU-000030',
      branch: mainBranch,
      fn: 'Bormey',
      ln: 'Men',
      kh: 'ម៉ែន បរមី',
      g: 'female' as const,
      dob: '2011-12-01',
      ph: '+855 98 234 568',
      em: 'bormey.men@student.snp.edu.kh',
      gn: 'Men Sovanna',
      gr: 'mother' as const,
      gp: '+855 15 444 567',
      go: 'Designer',
    },
    {
      id: 'STU-000031',
      branch: mainBranch,
      fn: 'Makara',
      ln: 'Yin',
      kh: 'យិន មករា',
      g: 'male' as const,
      dob: '2010-01-01',
      ph: '+855 98 345 679',
      em: 'makara.yin@student.snp.edu.kh',
      gn: 'Yin Theara',
      gr: 'father' as const,
      gp: '+855 15 333 678',
      go: 'Officer',
    },
    {
      id: 'STU-000032',
      branch: mainBranch,
      fn: 'Sonisa',
      ln: 'Duong',
      kh: 'ដួង សូនីសា',
      g: 'female' as const,
      dob: '2012-04-18',
      ph: '+855 98 456 780',
      em: 'sonisa.duong@student.snp.edu.kh',
      gn: 'Duong Chantrea',
      gr: 'mother' as const,
      gp: '+855 15 222 789',
      go: 'Entrepreneur',
    },
    {
      id: 'STU-000033',
      branch: mainBranch,
      fn: 'Seyha',
      ln: 'Kong',
      kh: 'គង់ សីហា',
      g: 'male' as const,
      dob: '2009-08-19',
      ph: '+855 98 567 891',
      em: 'seyha.kong@student.snp.edu.kh',
      gn: 'Kong Minea',
      gr: 'father' as const,
      gp: '+855 15 111 890',
      go: 'Engineer',
    },
    {
      id: 'STU-000034',
      branch: mainBranch,
      fn: 'Kanika',
      ln: 'Chheang',
      kh: 'ឈាង កណិការ',
      g: 'female' as const,
      dob: '2011-06-25',
      ph: '+855 98 678 902',
      em: 'kanika.chheang@student.snp.edu.kh',
      gn: 'Chheang Sreypov',
      gr: 'mother' as const,
      gp: '+855 16 999 001',
      go: 'Doctor',
    },
    {
      id: 'STU-000035',
      branch: mainBranch,
      fn: 'Vibol',
      ln: 'Hun',
      kh: 'ហ៊ុន វិបុល',
      g: 'male' as const,
      dob: '2010-11-09',
      ph: '+855 98 789 013',
      em: 'vibol.hun@student.snp.edu.kh',
      gn: 'Hun Sovann',
      gr: 'father' as const,
      gp: '+855 16 888 102',
      go: 'Driver',
    },
    {
      id: 'STU-000036',
      branch: toulKorkBranch,
      fn: 'Dany',
      ln: 'San',
      kh: 'សាន ដានី',
      g: 'female' as const,
      dob: '2011-09-14',
      ph: '+855 97 111 001',
      em: 'dany.san@student.snp.edu.kh',
      gn: 'San Bunthoeun',
      gr: 'father' as const,
      gp: '+855 12 801 101',
      go: 'Officer',
    },
    {
      id: 'STU-000037',
      branch: toulKorkBranch,
      fn: 'Sovann',
      ln: 'Khem',
      kh: 'ខែម សុវណ្ណ',
      g: 'male' as const,
      dob: '2010-06-20',
      ph: '+855 97 111 002',
      em: 'sovann.khem@student.snp.edu.kh',
      gn: 'Khem Ratana',
      gr: 'father' as const,
      gp: '+855 12 801 102',
      go: 'Teacher',
    },
    {
      id: 'STU-000038',
      branch: toulKorkBranch,
      fn: 'Sreyroth',
      ln: 'Phon',
      kh: 'ផុន ស្រីរ័ត្ន',
      g: 'female' as const,
      dob: '2012-02-11',
      ph: '+855 97 111 003',
      em: 'sreyroth.phon@student.snp.edu.kh',
      gn: 'Phon Vutha',
      gr: 'mother' as const,
      gp: '+855 12 801 103',
      go: 'Vendor',
    },
    {
      id: 'STU-000039',
      branch: toulKorkBranch,
      fn: 'Narith',
      ln: 'Chum',
      kh: 'ជុំ ណារិទ្ធ',
      g: 'male' as const,
      dob: '2009-10-05',
      ph: '+855 97 111 004',
      em: 'narith.chum@student.snp.edu.kh',
      gn: 'Chum Pisal',
      gr: 'father' as const,
      gp: '+855 12 801 104',
      go: 'Technician',
    },
    {
      id: 'STU-000040',
      branch: toulKorkBranch,
      fn: 'Leakhena',
      ln: 'Say',
      kh: 'សាយ លក្ខិណា',
      g: 'female' as const,
      dob: '2011-05-18',
      ph: '+855 97 111 005',
      em: 'leakhena.say@student.snp.edu.kh',
      gn: 'Say Kosal',
      gr: 'mother' as const,
      gp: '+855 12 801 105',
      go: 'Accountant',
    },
    {
      id: 'STU-000041',
      branch: toulKorkBranch,
      fn: 'Tharith',
      ln: 'Pov',
      kh: 'ពៅ ថារិទ្ធ',
      g: 'male' as const,
      dob: '2010-03-29',
      ph: '+855 97 111 006',
      em: 'tharith.pov@student.snp.edu.kh',
      gn: 'Pov Sovath',
      gr: 'father' as const,
      gp: '+855 12 801 106',
      go: 'Banker',
    },
    {
      id: 'STU-000042',
      branch: toulKorkBranch,
      fn: 'Chansreypov',
      ln: 'Sim',
      kh: 'ស៊ីម ច័ន្ទស្រីពៅ',
      g: 'female' as const,
      dob: '2012-07-22',
      ph: '+855 97 111 007',
      em: 'chansreypov.sim@student.snp.edu.kh',
      gn: 'Sim Sophal',
      gr: 'mother' as const,
      gp: '+855 12 801 107',
      go: 'Nurse',
    },
    {
      id: 'STU-000043',
      branch: toulKorkBranch,
      fn: 'Vanneth',
      ln: 'Chhorn',
      kh: 'ឈរ វ៉ាន់ណេត',
      g: 'male' as const,
      dob: '2009-12-15',
      ph: '+855 97 111 008',
      em: 'vanneth.chhorn@student.snp.edu.kh',
      gn: 'Chhorn Samart',
      gr: 'father' as const,
      gp: '+855 12 801 108',
      go: 'Architect',
    },
    {
      id: 'STU-000044',
      branch: toulKorkBranch,
      fn: 'Sreyleak',
      ln: 'Tith',
      kh: 'ទិត្យ ស្រីលក្ខណ៍',
      g: 'female' as const,
      dob: '2011-08-03',
      ph: '+855 97 111 009',
      em: 'sreyleak.tith@student.snp.edu.kh',
      gn: 'Tith Chanthou',
      gr: 'mother' as const,
      gp: '+855 12 801 109',
      go: 'Pharmacist',
    },
    {
      id: 'STU-000045',
      branch: toulKorkBranch,
      fn: 'Panharith',
      ln: 'Mam',
      kh: 'ម៉ម បញ្ញារិទ្ធ',
      g: 'male' as const,
      dob: '2010-01-27',
      ph: '+855 97 111 010',
      em: 'panharith.mam@student.snp.edu.kh',
      gn: 'Mam Sok',
      gr: 'father' as const,
      gp: '+855 12 801 110',
      go: 'Civil Engineer',
    },
    {
      id: 'STU-000046',
      branch: toulKorkBranch,
      fn: 'Sreymom',
      ln: 'Un',
      kh: 'អ៊ុន ស្រីមុំ',
      g: 'female' as const,
      dob: '2012-10-12',
      ph: '+855 97 111 011',
      em: 'sreymom.un@student.snp.edu.kh',
      gn: 'Un Vanna',
      gr: 'mother' as const,
      gp: '+855 12 801 111',
      go: 'Business Owner',
    },
    {
      id: 'STU-000047',
      branch: toulKorkBranch,
      fn: 'Sopheak',
      ln: 'Cheam',
      kh: 'ជាម សុភ័ក្ត្រ',
      g: 'male' as const,
      dob: '2009-07-08',
      ph: '+855 97 111 012',
      em: 'sopheak.cheam@student.snp.edu.kh',
      gn: 'Cheam Bora',
      gr: 'father' as const,
      gp: '+855 12 801 112',
      go: 'Driver',
    },
    {
      id: 'STU-000048',
      branch: toulKorkBranch,
      fn: 'Nita',
      ln: 'Huot',
      kh: 'ហួត នីតា',
      g: 'female' as const,
      dob: '2011-04-19',
      ph: '+855 97 111 013',
      em: 'nita.huot@student.snp.edu.kh',
      gn: 'Huot Sreypov',
      gr: 'mother' as const,
      gp: '+855 12 801 113',
      go: 'Teacher',
    },
    {
      id: 'STU-000049',
      branch: toulKorkBranch,
      fn: 'Kimheng',
      ln: 'Kheng',
      kh: 'ខេង គីមហេង',
      g: 'male' as const,
      dob: '2010-11-23',
      ph: '+855 97 111 014',
      em: 'kimheng.kheng@student.snp.edu.kh',
      gn: 'Kheng Vuthy',
      gr: 'father' as const,
      gp: '+855 12 801 114',
      go: 'Shop Owner',
    },
    {
      id: 'STU-000050',
      branch: toulKorkBranch,
      fn: 'Chinda',
      ln: 'Prom',
      kh: 'ព្រំ ចិន្តា',
      g: 'female' as const,
      dob: '2012-06-01',
      ph: '+855 97 111 015',
      em: 'chinda.prom@student.snp.edu.kh',
      gn: 'Prom Sophy',
      gr: 'mother' as const,
      gp: '+855 12 801 115',
      go: 'Manager',
    },
    {
      id: 'STU-000051',
      branch: toulKorkBranch,
      fn: 'Rith',
      ln: 'Nhoek',
      kh: 'ញ៉ុក រិទ្ធ',
      g: 'male' as const,
      dob: '2009-03-17',
      ph: '+855 97 111 016',
      em: 'rith.nhoek@student.snp.edu.kh',
      gn: 'Nhoek Samnang',
      gr: 'father' as const,
      gp: '+855 12 801 116',
      go: 'Electrician',
    },
    {
      id: 'STU-000052',
      branch: toulKorkBranch,
      fn: 'Voleak',
      ln: 'Orn',
      kh: 'អ៊ន វល័ក្ខ',
      g: 'female' as const,
      dob: '2011-12-09',
      ph: '+855 97 111 017',
      em: 'voleak.orn@student.snp.edu.kh',
      gn: 'Orn Kalyan',
      gr: 'mother' as const,
      gp: '+855 12 801 117',
      go: 'Dentist',
    },
    {
      id: 'STU-000053',
      branch: toulKorkBranch,
      fn: 'Bunthoeun',
      ln: 'Chhorn',
      kh: 'ឈរ ប៊ុនថឿន',
      g: 'male' as const,
      dob: '2010-08-30',
      ph: '+855 97 111 018',
      em: 'bunthoeun.chhorn@student.snp.edu.kh',
      gn: 'Chhorn Pheak',
      gr: 'father' as const,
      gp: '+855 12 801 118',
      go: 'Mechanic',
    },
    {
      id: 'STU-000054',
      branch: toulKorkBranch,
      fn: 'Sreyneang',
      ln: 'Kao',
      kh: 'កៅ ស្រីនាង',
      g: 'female' as const,
      dob: '2012-04-05',
      ph: '+855 97 111 019',
      em: 'sreyneang.kao@student.snp.edu.kh',
      gn: 'Kao Bopha',
      gr: 'mother' as const,
      gp: '+855 12 801 119',
      go: 'Accountant',
    },
    {
      id: 'STU-000055',
      branch: toulKorkBranch,
      fn: 'Piseth',
      ln: 'Pras',
      kh: 'ប្រាស ពិសិដ្ឋ',
      g: 'male' as const,
      dob: '2009-09-14',
      ph: '+855 97 111 020',
      em: 'piseth.pras@student.snp.edu.kh',
      gn: 'Pras Samnang',
      gr: 'father' as const,
      gp: '+855 12 801 120',
      go: 'Government Staff',
    },
    {
      id: 'STU-000056',
      branch: toulKorkBranch,
      fn: 'Monika',
      ln: 'Suon',
      kh: 'សួន មុនីកា',
      g: 'female' as const,
      dob: '2011-01-28',
      ph: '+855 97 111 021',
      em: 'monika.suon@student.snp.edu.kh',
      gn: 'Suon Chenda',
      gr: 'mother' as const,
      gp: '+855 12 801 121',
      go: 'Designer',
    },
    {
      id: 'STU-000057',
      branch: toulKorkBranch,
      fn: 'Vannak',
      ln: 'Sin',
      kh: 'ស៊ីន វណ្ណៈ',
      g: 'male' as const,
      dob: '2010-05-07',
      ph: '+855 97 111 022',
      em: 'vannak.sin@student.snp.edu.kh',
      gn: 'Sin Vibol',
      gr: 'father' as const,
      gp: '+855 12 801 122',
      go: 'Lawyer',
    },
    {
      id: 'STU-000058',
      branch: toulKorkBranch,
      fn: 'Sreypich',
      ln: 'Neang',
      kh: 'នាង ស្រីពេជ្រ',
      g: 'female' as const,
      dob: '2012-09-19',
      ph: '+855 97 111 023',
      em: 'sreypich.neang@student.snp.edu.kh',
      gn: 'Neang Sokun',
      gr: 'mother' as const,
      gp: '+855 12 801 123',
      go: 'Merchant',
    },
    {
      id: 'STU-000059',
      branch: toulKorkBranch,
      fn: 'Samdy',
      ln: 'Kao',
      kh: 'កៅ សំឌី',
      g: 'male' as const,
      dob: '2009-11-11',
      ph: '+855 97 111 024',
      em: 'samdy.kao@student.snp.edu.kh',
      gn: 'Kao Kosal',
      gr: 'father' as const,
      gp: '+855 12 801 124',
      go: 'Doctor',
    },
    {
      id: 'STU-000060',
      branch: toulKorkBranch,
      fn: 'Socheata',
      ln: 'Try',
      kh: 'ទ្រី សុជាតា',
      g: 'female' as const,
      dob: '2011-06-03',
      ph: '+855 97 111 025',
      em: 'socheata.try@student.snp.edu.kh',
      gn: 'Try Vanna',
      gr: 'mother' as const,
      gp: '+855 12 801 125',
      go: 'Entrepreneur',
    },
    {
      id: 'STU-000061',
      branch: senSokBranch,
      fn: 'Thida',
      ln: 'Chhum',
      kh: 'ឈុំ ធីតា',
      g: 'female' as const,
      dob: '2011-07-25',
      ph: '+855 96 111 001',
      em: 'thida.chhum@student.snp.edu.kh',
      gn: 'Chhum Bunleang',
      gr: 'father' as const,
      gp: '+855 12 701 101',
      go: 'Teacher',
    },
    {
      id: 'STU-000062',
      branch: senSokBranch,
      fn: 'Sovannarith',
      ln: 'Hout',
      kh: 'ហួត សុវណ្ណារិទ្ធ',
      g: 'male' as const,
      dob: '2010-04-12',
      ph: '+855 96 111 002',
      em: 'sovannarith.hout@student.snp.edu.kh',
      gn: 'Hout Dara',
      gr: 'father' as const,
      gp: '+855 12 701 102',
      go: 'Engineer',
    },
    {
      id: 'STU-000063',
      branch: senSokBranch,
      fn: 'Chantou',
      ln: 'Loeuk',
      kh: 'លើក ចាន់ធូ',
      g: 'female' as const,
      dob: '2012-01-30',
      ph: '+855 96 111 003',
      em: 'chantou.loeuk@student.snp.edu.kh',
      gn: 'Loeuk Bopha',
      gr: 'mother' as const,
      gp: '+855 12 701 103',
      go: 'Pharmacist',
    },
    {
      id: 'STU-000064',
      branch: senSokBranch,
      fn: 'Nary',
      ln: 'Khat',
      kh: 'ខាត់ ណារី',
      g: 'female' as const,
      dob: '2011-10-08',
      ph: '+855 96 111 004',
      em: 'nary.khat@student.snp.edu.kh',
      gn: 'Khat Samnang',
      gr: 'father' as const,
      gp: '+855 12 701 104',
      go: 'Accountant',
    },
    {
      id: 'STU-000065',
      branch: senSokBranch,
      fn: 'Vannarith',
      ln: 'Phat',
      kh: 'ផាត់ វណ្ណារិទ្ធ',
      g: 'male' as const,
      dob: '2009-06-14',
      ph: '+855 96 111 005',
      em: 'vannarith.phat@student.snp.edu.kh',
      gn: 'Phat Sothea',
      gr: 'father' as const,
      gp: '+855 12 701 105',
      go: 'Architect',
    },
    {
      id: 'STU-000066',
      branch: senSokBranch,
      fn: 'Sreyka',
      ln: 'Toch',
      kh: 'តូច ស្រីកា',
      g: 'female' as const,
      dob: '2012-08-16',
      ph: '+855 96 111 006',
      em: 'sreyka.toch@student.snp.edu.kh',
      gn: 'Toch Vanna',
      gr: 'mother' as const,
      gp: '+855 12 701 106',
      go: 'Vendor',
    },
    {
      id: 'STU-000067',
      branch: senSokBranch,
      fn: 'Buntheng',
      ln: 'Nou',
      kh: 'នូ ប៊ុនថេង',
      g: 'male' as const,
      dob: '2010-02-28',
      ph: '+855 96 111 007',
      em: 'buntheng.nou@student.snp.edu.kh',
      gn: 'Nou Sokun',
      gr: 'father' as const,
      gp: '+855 12 701 107',
      go: 'Electrician',
    },
    {
      id: 'STU-000068',
      branch: senSokBranch,
      fn: 'Kalyan',
      ln: 'Rin',
      kh: 'រិន កល្យាណ',
      g: 'female' as const,
      dob: '2011-11-20',
      ph: '+855 96 111 008',
      em: 'kalyan.rin@student.snp.edu.kh',
      gn: 'Rin Sopheap',
      gr: 'mother' as const,
      gp: '+855 12 701 108',
      go: 'Banker',
    },
    {
      id: 'STU-000069',
      branch: senSokBranch,
      fn: 'Pheakdey',
      ln: 'Soy',
      kh: 'សយ ភក្តី',
      g: 'male' as const,
      dob: '2009-08-22',
      ph: '+855 96 111 009',
      em: 'pheakdey.soy@student.snp.edu.kh',
      gn: 'Soy Vuthy',
      gr: 'father' as const,
      gp: '+855 12 701 109',
      go: 'Manager',
    },
    {
      id: 'STU-000070',
      branch: senSokBranch,
      fn: 'Sreypov',
      ln: 'Roeun',
      kh: 'រឿន ស្រីពៅ',
      g: 'female' as const,
      dob: '2012-03-05',
      ph: '+855 96 111 010',
      em: 'sreypov.roeun@student.snp.edu.kh',
      gn: 'Roeun Sarin',
      gr: 'mother' as const,
      gp: '+855 12 701 110',
      go: 'Nurse',
    },
    {
      id: 'STU-000071',
      branch: senSokBranch,
      fn: 'Sambath',
      ln: 'Khiev',
      kh: 'ខៀវ សម្បត្តិ',
      g: 'male' as const,
      dob: '2010-09-17',
      ph: '+855 96 111 011',
      em: 'sambath.khiev@student.snp.edu.kh',
      gn: 'Khiev Piseth',
      gr: 'father' as const,
      gp: '+855 12 701 111',
      go: 'Civil Servant',
    },
    {
      id: 'STU-000072',
      branch: senSokBranch,
      fn: 'Kanika',
      ln: 'Men',
      kh: 'ម៉ែន កណិការ',
      g: 'female' as const,
      dob: '2011-05-24',
      ph: '+855 96 111 012',
      em: 'kanika.men@student.snp.edu.kh',
      gn: 'Men Sovath',
      gr: 'father' as const,
      gp: '+855 12 701 112',
      go: 'Business Owner',
    },
    {
      id: 'STU-000073',
      branch: senSokBranch,
      fn: 'Vireakboth',
      ln: 'Chea',
      kh: 'ជា វីរៈបុត្រ',
      g: 'male' as const,
      dob: '2009-12-03',
      ph: '+855 96 111 013',
      em: 'vireakboth.chea@student.snp.edu.kh',
      gn: 'Chea Vireak',
      gr: 'father' as const,
      gp: '+855 12 701 113',
      go: 'Doctor',
    },
    {
      id: 'STU-000074',
      branch: senSokBranch,
      fn: 'Chantrea',
      ln: 'Oun',
      kh: 'អ៊ុន ច័ន្ទទ្រា',
      g: 'female' as const,
      dob: '2012-10-31',
      ph: '+855 96 111 014',
      em: 'chantrea.oun@student.snp.edu.kh',
      gn: 'Oun Samnang',
      gr: 'mother' as const,
      gp: '+855 12 701 114',
      go: 'Florist',
    },
    {
      id: 'STU-000075',
      branch: senSokBranch,
      fn: 'Ratanakboth',
      ln: 'Lay',
      kh: 'ឡាយ រតនបុត្រ',
      g: 'male' as const,
      dob: '2010-01-19',
      ph: '+855 96 111 015',
      em: 'ratanakboth.lay@student.snp.edu.kh',
      gn: 'Lay Kosal',
      gr: 'father' as const,
      gp: '+855 12 701 115',
      go: 'Engineer',
    },
    {
      id: 'STU-000076',
      branch: senSokBranch,
      fn: 'Monyneath',
      ln: 'Ty',
      kh: 'ទី មុនីនាថ',
      g: 'female' as const,
      dob: '2011-08-11',
      ph: '+855 96 111 016',
      em: 'monyneath.ty@student.snp.edu.kh',
      gn: 'Ty Bopha',
      gr: 'mother' as const,
      gp: '+855 12 701 116',
      go: 'Merchant',
    },
    {
      id: 'STU-000077',
      branch: senSokBranch,
      fn: 'Chanchhaya',
      ln: 'Vong',
      kh: 'វង្ស ច័ន្ទឆាយា',
      g: 'male' as const,
      dob: '2009-04-09',
      ph: '+855 96 111 017',
      em: 'chanchhaya.vong@student.snp.edu.kh',
      gn: 'Vong Vicheth',
      gr: 'father' as const,
      gp: '+855 12 701 117',
      go: 'Driver',
    },
    {
      id: 'STU-000078',
      branch: senSokBranch,
      fn: 'Sreyleap',
      ln: 'Sem',
      kh: 'សែម ស្រីលាភ',
      g: 'female' as const,
      dob: '2012-06-28',
      ph: '+855 96 111 018',
      em: 'sreyleap.sem@student.snp.edu.kh',
      gn: 'Sem Kalyan',
      gr: 'mother' as const,
      gp: '+855 12 701 118',
      go: 'Accountant',
    },
    {
      id: 'STU-000079',
      branch: senSokBranch,
      fn: 'Panhaseth',
      ln: 'Khat',
      kh: 'ខាត់ បញ្ញាសិដ្ឋ',
      g: 'male' as const,
      dob: '2010-10-15',
      ph: '+855 96 111 019',
      em: 'panhaseth.khat@student.snp.edu.kh',
      gn: 'Khat Bunthoeun',
      gr: 'father' as const,
      gp: '+855 12 701 119',
      go: 'Technician',
    },
    {
      id: 'STU-000080',
      branch: senSokBranch,
      fn: 'Rachana',
      ln: 'Hun',
      kh: 'ហ៊ុន រចនា',
      g: 'female' as const,
      dob: '2011-03-07',
      ph: '+855 96 111 020',
      em: 'rachana.hun@student.snp.edu.kh',
      gn: 'Hun Sreypov',
      gr: 'mother' as const,
      gp: '+855 12 701 120',
      go: 'Teacher',
    },
  ];

  const seededStudents: Record<string, typeof StudentModel.prototype> = {};
  for (const st of studentsToSeed) {
    let stuDoc = await StudentModel.findOne({ studentId: st.id, isDeleted: false });
    if (!stuDoc) {
      stuDoc = await StudentModel.create({
        studentId: st.id,
        schoolId: school._id,
        branchId: st.branch._id,
        firstName: st.fn,
        lastName: st.ln,
        khmerName: st.kh,
        gender: st.g,
        dateOfBirth: new Date(st.dob),
        phone: st.ph,
        email: st.em,
        admissionDate: new Date('2026-08-01'),
        status: 'active',
        guardians: [
          {
            fullName: st.gn,
            khmerName: st.gn,
            relationship: st.gr,
            phone: st.gp,
            occupation: st.go,
            isPrimary: true,
            isEmergencyContact: true,
          },
        ],
      });
      logger.info(`Seeded student: ${st.id} (${st.fn} ${st.ln})`);
    }
    seededStudents[st.id] = stuDoc;
  }

  // 14. Admissions Registrations for all 80 Students
  for (let i = 0; i < studentsToSeed.length; i++) {
    const st = studentsToSeed[i]!;
    const regNum = `REG-2026${String(i + 1).padStart(3, '0')}`;
    const exists = await RegistrationModel.findOne({
      registrationNumber: regNum,
      isDeleted: false,
    });
    if (!exists) {
      const studentDoc = seededStudents[st.id];
      if (studentDoc) {
        await RegistrationModel.create({
          registrationNumber: regNum,
          schoolId: school._id,
          branchId: st.branch._id,
          academicYearId: academicYear._id,
          programId: engProgram._id,
          firstName: st.fn,
          lastName: st.ln,
          khmerName: st.kh,
          gender: st.g,
          dateOfBirth: new Date(st.dob),
          phone: st.ph,
          email: st.em,
          guardianName: st.gn,
          guardianRelationship: st.gr,
          guardianPhone: st.gp,
          status: 'enrolled',
          studentId: studentDoc._id,
          registrationDate: new Date('2026-08-05'),
        });
      }
    }
  }
  logger.info('Seeded admissions registrations for all 80 students');

  // 15. Placement Tests
  for (let i = 0; i < 40; i++) {
    const st = studentsToSeed[i]!;
    const testNum = `TEST-2026${String(i + 1).padStart(3, '0')}`;
    const stu = seededStudents[st.id];
    if (stu) {
      const exists = await PlacementTestModel.findOne({ testNumber: testNum, isDeleted: false });
      if (!exists) {
        await PlacementTestModel.create({
          testNumber: testNum,
          studentId: stu._id,
          studentName: `${stu.firstName} ${stu.lastName}`,
          schoolId: school._id,
          branchId: stu.branchId,
          programId: engProgram._id,
          recommendedLevelId: seededLevels['ENG-ELEM']?._id,
          testDate: new Date('2026-08-10'),
          score: 70 + (i % 25),
          maxScore: 100,
          examinerName: 'Academic Testing Board',
          status: 'passed',
          comments: 'Candidate demonstrates solid prerequisite mastery.',
        });
      }
    }
  }
  logger.info('Seeded placement tests for candidate students');

  // 16. Student Enrollments across Active Classes (Controlled Occupancy Tiers)
  // Mapping enrollments:
  // ENG-ELEM-M1 (Cap 35) -> 28 students (80% full, warning/danger)
  // COM-BSC-W1 (Cap 30) -> 27 students (90% full, danger)
  // ENG-BEG-A1 (Cap 30) -> 26 students (87% full, danger)
  // ENG-BEG-SS-A1 (Cap 30) -> 24 students (80% full, warning)
  // ENG-L3-FT-A (Cap 30) -> 18 students (60% full, warning)
  // ENG-INT-M1-TK (Cap 30) -> 16 students (53% full, warning)
  // COM-OFF-TK-A1 (Cap 25) -> 15 students (60% full, warning)
  // COM-BSC-SS-E1 (Cap 25) -> 12 students (48% full, available/success)
  // ENG-L2-PT-A (Cap 30) -> 11 students (36% full, available/success)
  // ENG-L2-PT-B (Cap 30) -> 10 students (33% full, available/success)
  // ENG-KIDS-SS-M1 (Cap 25) -> 8 students (32% full, available/success)
  // COM-TYP-HR-A (Cap 25) -> 6 students (24% full, available/success)
  // ENG-ELEM-TK-E1 (Cap 30) -> 6 students (20% full, available/success)
  // KHM-PRI-M1 (Cap 30) -> 18 students (60% full)
  // ENG-ADV-E1 (Cap 25) -> 14 students (56% full)
  // KHM-MATH-TK-W1 (Cap 25) -> 12 students (48% full)
  // COM-WEB-SS-W1 (Cap 20) -> 12 students (60% full)
  // ENG-INT-SS-A1 (Cap 30) -> 10 students (33% full)

  const enrollmentAssignments: Array<{ classCode: string; studentIds: string[] }> = [
    {
      classCode: 'ENG-ELEM-M1',
      studentIds: [
        'STU-000001',
        'STU-000002',
        'STU-000004',
        'STU-000005',
        'STU-000006',
        'STU-000007',
        'STU-000008',
        'STU-000009',
        'STU-000010',
        'STU-000011',
        'STU-000012',
        'STU-000013',
        'STU-000014',
        'STU-000015',
        'STU-000016',
        'STU-000017',
        'STU-000018',
        'STU-000019',
        'STU-000020',
        'STU-000021',
        'STU-000022',
        'STU-000023',
        'STU-000024',
        'STU-000025',
        'STU-000026',
        'STU-000027',
        'STU-000028',
        'STU-000029',
      ],
    },
    {
      classCode: 'COM-BSC-W1',
      studentIds: [
        'STU-000001',
        'STU-000003',
        'STU-000005',
        'STU-000007',
        'STU-000009',
        'STU-000011',
        'STU-000013',
        'STU-000015',
        'STU-000017',
        'STU-000019',
        'STU-000021',
        'STU-000023',
        'STU-000025',
        'STU-000027',
        'STU-000029',
        'STU-000030',
        'STU-000031',
        'STU-000032',
        'STU-000033',
        'STU-000034',
        'STU-000035',
        'STU-000002',
        'STU-000004',
        'STU-000006',
        'STU-000008',
        'STU-000010',
        'STU-000012',
      ],
    },
    {
      classCode: 'ENG-BEG-A1',
      studentIds: [
        'STU-000036',
        'STU-000037',
        'STU-000038',
        'STU-000039',
        'STU-000040',
        'STU-000041',
        'STU-000042',
        'STU-000043',
        'STU-000044',
        'STU-000045',
        'STU-000046',
        'STU-000047',
        'STU-000048',
        'STU-000049',
        'STU-000050',
        'STU-000051',
        'STU-000052',
        'STU-000053',
        'STU-000054',
        'STU-000055',
        'STU-000056',
        'STU-000057',
        'STU-000058',
        'STU-000059',
        'STU-000060',
        'STU-000036',
      ],
    },
    {
      classCode: 'ENG-BEG-SS-A1',
      studentIds: [
        'STU-000061',
        'STU-000062',
        'STU-000063',
        'STU-000064',
        'STU-000065',
        'STU-000066',
        'STU-000067',
        'STU-000068',
        'STU-000069',
        'STU-000070',
        'STU-000071',
        'STU-000072',
        'STU-000073',
        'STU-000074',
        'STU-000075',
        'STU-000076',
        'STU-000077',
        'STU-000078',
        'STU-000079',
        'STU-000080',
        'STU-000061',
        'STU-000062',
        'STU-000063',
        'STU-000064',
      ],
    },
    {
      classCode: 'ENG-INT-M1-TK',
      studentIds: [
        'STU-000037',
        'STU-000039',
        'STU-000041',
        'STU-000043',
        'STU-000045',
        'STU-000047',
        'STU-000049',
        'STU-000051',
        'STU-000053',
        'STU-000055',
        'STU-000057',
        'STU-000059',
        'STU-000038',
        'STU-000040',
        'STU-000042',
        'STU-000044',
      ],
    },
    {
      classCode: 'COM-BSC-SS-E1',
      studentIds: [
        'STU-000061',
        'STU-000063',
        'STU-000065',
        'STU-000067',
        'STU-000069',
        'STU-000071',
        'STU-000073',
        'STU-000075',
        'STU-000077',
        'STU-000079',
        'STU-000062',
        'STU-000064',
      ],
    },
    {
      classCode: 'ENG-L3-FT-A',
      studentIds: [
        'STU-000010',
        'STU-000012',
        'STU-000014',
        'STU-000016',
        'STU-000018',
        'STU-000020',
        'STU-000022',
        'STU-000024',
        'STU-000026',
        'STU-000028',
        'STU-000030',
        'STU-000032',
        'STU-000034',
        'STU-000001',
        'STU-000002',
        'STU-000003',
        'STU-000004',
        'STU-000005',
      ],
    },
    {
      classCode: 'COM-OFF-TK-A1',
      studentIds: [
        'STU-000036',
        'STU-000038',
        'STU-000040',
        'STU-000042',
        'STU-000044',
        'STU-000046',
        'STU-000048',
        'STU-000050',
        'STU-000052',
        'STU-000054',
        'STU-000056',
        'STU-000058',
        'STU-000060',
        'STU-000037',
        'STU-000039',
      ],
    },
    {
      classCode: 'ENG-L2-PT-A',
      studentIds: [
        'STU-000002',
        'STU-000004',
        'STU-000006',
        'STU-000008',
        'STU-000010',
        'STU-000012',
        'STU-000014',
        'STU-000016',
        'STU-000018',
        'STU-000020',
        'STU-000022',
      ],
    },
    {
      classCode: 'ENG-KIDS-SS-M1',
      studentIds: [
        'STU-000066',
        'STU-000068',
        'STU-000070',
        'STU-000072',
        'STU-000074',
        'STU-000076',
        'STU-000078',
        'STU-000080',
      ],
    },
    {
      classCode: 'COM-TYP-HR-A',
      studentIds: [
        'STU-000001',
        'STU-000003',
        'STU-000005',
        'STU-000007',
        'STU-000009',
        'STU-000011',
      ],
    },
    {
      classCode: 'ENG-ELEM-TK-E1',
      studentIds: [
        'STU-000037',
        'STU-000041',
        'STU-000045',
        'STU-000049',
        'STU-000053',
        'STU-000057',
      ],
    },
    {
      classCode: 'KHM-PRI-M1',
      studentIds: [
        'STU-000004',
        'STU-000007',
        'STU-000009',
        'STU-000011',
        'STU-000013',
        'STU-000015',
        'STU-000017',
        'STU-000019',
        'STU-000021',
        'STU-000023',
        'STU-000025',
        'STU-000027',
        'STU-000029',
        'STU-000031',
        'STU-000033',
        'STU-000035',
        'STU-000001',
        'STU-000003',
      ],
    },
  ];

  let enrCounter = 1;
  const seededEnrollments: Record<string, typeof EnrollmentModel.prototype> = {};
  for (const item of enrollmentAssignments) {
    const cls = seededClasses[item.classCode];
    if (!cls) continue;

    for (const stId of item.studentIds) {
      const stu = seededStudents[stId];
      if (!stu) continue;

      const enrCode = `ENR-2026${String(enrCounter).padStart(3, '0')}`;
      enrCounter++;

      let enrDoc = await EnrollmentModel.findOne({
        studentId: stu._id,
        classId: cls._id,
        isDeleted: false,
      });

      if (!enrDoc) {
        enrDoc = await EnrollmentModel.create({
          enrollmentCode: enrCode,
          studentId: stu._id,
          schoolId: school._id,
          branchId: cls.branchId,
          academicYearId: academicYear._id,
          academicPeriodId: cls.academicPeriodId,
          programId: cls.programId,
          levelId: cls.levelId,
          classId: cls._id,
          studyModeId: cls.studyModeId,
          enrollmentDate: new Date('2026-08-20'),
          startDate: new Date('2026-08-01'),
          endDate: new Date('2026-11-30'),
          status: 'active',
          tuitionStatus:
            enrCounter % 4 === 0 ? 'partially_paid' : enrCounter % 15 === 0 ? 'pending' : 'paid',
        });
        logger.info(`Seeded enrollment: ${enrCode} (${stu.studentId} in ${cls.classCode})`);
      }
      seededEnrollments[enrCode] = enrDoc;
    }
  }

  // 17. Teacher Assignments
  for (const clsCode of Object.keys(seededClasses)) {
    const cls = seededClasses[clsCode]!;
    if (cls && cls.classTeacherId) {
      const taExists = await TeacherAssignmentModel.findOne({
        classId: cls._id,
        employeeId: cls.classTeacherId,
        isDeleted: false,
      });
      if (!taExists) {
        await TeacherAssignmentModel.create({
          schoolId: school._id,
          branchId: cls.branchId,
          academicYearId: academicYear._id,
          academicPeriodId: cls.academicPeriodId,
          employeeId: cls.classTeacherId,
          classId: cls._id,
          subjectId: seededSubjects['ENG-GRAM']?._id || seededSubjects['COM-FND']?._id,
          roleInClass: 'class_teacher',
          startDate: new Date('2026-08-01'),
          endDate: new Date('2026-11-30'),
          status: 'active',
        });
      }
    }
  }
  logger.info('Seeded teacher assignments across all classes');

  // 17.1 Reconcile Class Current Enrollment Counts
  for (const clsCode of Object.keys(seededClasses)) {
    const cls = seededClasses[clsCode];
    if (cls) {
      const activeCount = await EnrollmentModel.countDocuments({
        classId: cls._id,
        status: { $in: ['active', 'enrolled'] },
        isDeleted: false,
      });
      await ClassModel.updateOne(
        { _id: cls._id },
        { $set: { currentEnrollmentCount: activeCount } },
      );
      cls.currentEnrollmentCount = activeCount;
    }
  }
  logger.info('Reconciled currentEnrollmentCount across all seeded classes');

  // 17.2 Class Weekly Schedules Across All 18 Classes
  interface ScheduleTemplate {
    classCode: string;
    days: number[];
    startTime: string;
    endTime: string;
    sessionType: 'morning' | 'afternoon' | 'evening';
    subjectCode?: string;
  }

  const scheduleTemplates: ScheduleTemplate[] = [
    // Main Branch (MB)
    {
      classCode: 'ENG-ELEM-M1',
      days: [1, 3, 5],
      startTime: '08:00',
      endTime: '10:00',
      sessionType: 'morning',
      subjectCode: 'ENG-GRAM',
    },
    {
      classCode: 'ENG-L3-FT-A',
      days: [2, 4],
      startTime: '08:00',
      endTime: '11:00',
      sessionType: 'morning',
      subjectCode: 'ENG-READ',
    },
    {
      classCode: 'ENG-ADV-E1',
      days: [1, 3, 5],
      startTime: '17:30',
      endTime: '19:30',
      sessionType: 'evening',
      subjectCode: 'ENG-LSTN',
    },
    {
      classCode: 'ENG-L2-PT-A',
      days: [1, 3, 5],
      startTime: '14:00',
      endTime: '16:00',
      sessionType: 'afternoon',
      subjectCode: 'ENG-GRAM',
    },
    {
      classCode: 'ENG-L2-PT-B',
      days: [2, 4],
      startTime: '14:00',
      endTime: '16:00',
      sessionType: 'afternoon',
      subjectCode: 'ENG-GRAM',
    },
    {
      classCode: 'COM-BSC-W1',
      days: [6, 7],
      startTime: '08:30',
      endTime: '11:30',
      sessionType: 'morning',
      subjectCode: 'COM-FND',
    },
    {
      classCode: 'COM-TYP-HR-A',
      days: [1, 3, 5],
      startTime: '10:30',
      endTime: '11:30',
      sessionType: 'morning',
      subjectCode: 'COM-TYP',
    },
    {
      classCode: 'KHM-PRI-M1',
      days: [1, 3, 5],
      startTime: '08:00',
      endTime: '10:30',
      sessionType: 'morning',
      subjectCode: 'MATH-PRI',
    },

    // Toul Kork Branch (TK)
    {
      classCode: 'ENG-INT-M1-TK',
      days: [1, 3, 5],
      startTime: '08:00',
      endTime: '10:30',
      sessionType: 'morning',
      subjectCode: 'ENG-READ',
    },
    {
      classCode: 'ENG-BEG-A1',
      days: [1, 3, 5],
      startTime: '14:00',
      endTime: '16:30',
      sessionType: 'afternoon',
      subjectCode: 'ENG-GRAM',
    },
    {
      classCode: 'ENG-ELEM-TK-E1',
      days: [1, 3, 5],
      startTime: '17:30',
      endTime: '19:30',
      sessionType: 'evening',
      subjectCode: 'ENG-GRAM',
    },
    {
      classCode: 'COM-OFF-TK-A1',
      days: [1, 3, 5],
      startTime: '08:30',
      endTime: '11:00',
      sessionType: 'morning',
      subjectCode: 'COM-TYP',
    },
    {
      classCode: 'KHM-MATH-TK-W1',
      days: [6, 7],
      startTime: '08:30',
      endTime: '11:30',
      sessionType: 'morning',
      subjectCode: 'MATH-PRI',
    },

    // Sen Sok Branch (SS)
    {
      classCode: 'ENG-BEG-SS-A1',
      days: [1, 3, 5],
      startTime: '08:00',
      endTime: '10:30',
      sessionType: 'morning',
      subjectCode: 'ENG-GRAM',
    },
    {
      classCode: 'ENG-INT-SS-A1',
      days: [1, 3, 5],
      startTime: '14:00',
      endTime: '16:30',
      sessionType: 'afternoon',
      subjectCode: 'ENG-READ',
    },
    {
      classCode: 'ENG-KIDS-SS-M1',
      days: [2, 4],
      startTime: '08:30',
      endTime: '10:30',
      sessionType: 'morning',
      subjectCode: 'ENG-GRAM',
    },
    {
      classCode: 'COM-BSC-SS-E1',
      days: [1, 3, 5],
      startTime: '17:30',
      endTime: '19:30',
      sessionType: 'evening',
      subjectCode: 'COM-FND',
    },
    {
      classCode: 'COM-WEB-SS-W1',
      days: [6, 7],
      startTime: '08:30',
      endTime: '11:30',
      sessionType: 'morning',
      subjectCode: 'COM-FND',
    },
  ];

  for (const tpl of scheduleTemplates) {
    const cls = seededClasses[tpl.classCode];
    if (!cls) continue;

    const subId = tpl.subjectCode ? seededSubjects[tpl.subjectCode]?._id : undefined;

    for (const day of tpl.days) {
      const existing = await ClassScheduleModel.findOne({
        classId: cls._id,
        dayOfWeek: day,
        startTime: tpl.startTime,
        isDeleted: false,
      });

      if (!existing) {
        await ClassScheduleModel.create({
          schoolId: school._id,
          branchId: cls.branchId,
          academicYearId: cls.academicYearId,
          academicPeriodId: cls.academicPeriodId,
          classId: cls._id,
          dayOfWeek: day,
          sessionType: tpl.sessionType,
          startTime: tpl.startTime,
          endTime: tpl.endTime,
          subjectId: subId,
          teacherId: cls.classTeacherId,
          classroomId: cls.classroomId,
          status: 'active',
          isDeleted: false,
        });
      }
    }
  }
  logger.info('Seeded weekly class schedules across all active classes');

  // 18. Multi-Date Attendance Sessions & Records Across All 12 Months of 2026
  const attendanceTargetClasses = [
    seededClasses['ENG-ELEM-M1'],
    seededClasses['COM-BSC-W1'],
    seededClasses['ENG-BEG-A1'],
    seededClasses['ENG-INT-M1-TK'],
    seededClasses['ENG-BEG-SS-A1'],
    seededClasses['COM-BSC-SS-E1'],
  ].filter(Boolean);

  const attendanceDates = [
    '2026-01-08',
    '2026-01-15',
    '2026-01-22',
    '2026-01-29',
    '2026-02-05',
    '2026-02-12',
    '2026-02-19',
    '2026-02-26',
    '2026-03-05',
    '2026-03-12',
    '2026-03-19',
    '2026-03-26',
    '2026-04-02',
    '2026-04-09',
    '2026-04-23',
    '2026-04-30',
    '2026-05-07',
    '2026-05-14',
    '2026-05-21',
    '2026-05-28',
    '2026-06-04',
    '2026-06-11',
    '2026-06-18',
    '2026-06-25',
    '2026-07-02',
    '2026-07-09',
    '2026-07-16',
    '2026-07-23',
    '2026-08-06',
    '2026-08-13',
    '2026-08-20',
    '2026-08-27',
    '2026-09-03',
    '2026-09-10',
    '2026-09-17',
    '2026-09-24',
    '2026-10-01',
    '2026-10-08',
    '2026-10-15',
    '2026-10-22',
    '2026-11-05',
    '2026-11-12',
    '2026-11-19',
    '2026-11-26',
    '2026-12-03',
    '2026-12-10',
    '2026-12-17',
    '2026-12-24',
  ];

  // Specific students designated to have chronic low attendance (<80%) for the alert box
  const chronicAbsenteeIds = new Set(['STU-000008', 'STU-000011', 'STU-000045', 'STU-000067']);

  for (const cls of attendanceTargetClasses) {
    if (!cls) continue;
    const enrollments = await EnrollmentModel.find({ classId: cls._id, isDeleted: false });
    const teacherId = cls.classTeacherId || seededEmployees['EMP-MB-001']?._id;

    for (const dStr of attendanceDates) {
      const date = new Date(dStr);
      let sessionDoc = await AttendanceModel.findOne({ classId: cls._id, date, isDeleted: false });
      if (!sessionDoc && enrollments.length > 0) {
        const records = enrollments.map((enr, idx) => {
          // Identify student
          const stu = Object.values(seededStudents).find(
            (s) => s._id.toString() === enr.studentId.toString(),
          );
          const isChronic = stu ? chronicAbsenteeIds.has(stu.studentId) : false;

          let status = 'present';
          if (isChronic) {
            // 35% chance of absent/sick for chronic
            const rand = (idx + date.getDate() * 3) % 10;
            status = rand < 4 ? 'absent' : rand === 4 ? 'late' : rand === 5 ? 'sick' : 'present';
          } else {
            // Normal realistic attendance: 90% present
            const rand = (idx + date.getDate()) % 15;
            status =
              rand === 0 ? 'absent' : rand === 1 ? 'late' : rand === 2 ? 'permission' : 'present';
          }

          return {
            studentId: enr.studentId,
            status: status as 'present' | 'late' | 'absent' | 'permission' | 'sick',
          };
        });

        sessionDoc = await AttendanceModel.create({
          schoolId: school._id,
          branchId: cls.branchId,
          academicYearId: academicYear._id,
          academicPeriodId: cls.academicPeriodId,
          classId: cls._id,
          date,
          takenBy: teacherId,
          records,
        });

        // Seed individual AttendanceRecordModel documents in batch
        const recordDocs = enrollments.map((enr, i) => ({
          attendanceSessionId: sessionDoc!._id,
          schoolId: school._id,
          branchId: cls.branchId,
          academicYearId: academicYear._id,
          academicPeriodId: cls.academicPeriodId,
          classId: cls._id,
          studentId: enr.studentId,
          enrollmentId: enr._id,
          status: records[i]!.status,
          markedBy: teacherId,
          markedAt: date,
        }));
        if (recordDocs.length > 0) {
          await AttendanceRecordModel.insertMany(recordDocs);
        }
      }
    }
  }
  logger.info('Seeded full 12-month attendance sessions and records across classes');

  // 19. Monthly Assessments Catalog Across Classes & Subjects (12 Months of monthly_test)
  const monthlyAssessmentData = [
    { m: 1, date: '2026-01-28', name: 'January Monthly Achievement Test' },
    { m: 2, date: '2026-02-25', name: 'February Monthly Progress Test' },
    { m: 3, date: '2026-03-27', name: 'March Mid-Quarter Assessment' },
    { m: 4, date: '2026-04-28', name: 'April Academic Evaluation' },
    { m: 5, date: '2026-05-27', name: 'May Monthly Progress Test' },
    { m: 6, date: '2026-06-26', name: 'June Mid-Year Examination' },
    { m: 7, date: '2026-07-28', name: 'July Monthly Skills Test' },
    { m: 8, date: '2026-08-27', name: 'August Diagnostic Test' },
    { m: 9, date: '2026-09-28', name: 'September Monthly Progress Test' },
    { m: 10, date: '2026-10-28', name: 'October Quarterly Assessment' },
    { m: 11, date: '2026-11-26', name: 'November Monthly Test' },
    { m: 12, date: '2026-12-23', name: 'December End of Term Test' },
  ];

  for (const item of monthlyAssessmentData) {
    for (const cls of attendanceTargetClasses) {
      if (!cls) continue;
      const assCode = `ASS-M${item.m}-${cls.classCode}`;
      let assDoc = await AssessmentModel.findOne({ code: assCode, isDeleted: false });
      if (!assDoc) {
        assDoc = await AssessmentModel.create({
          schoolId: school._id,
          branchId: cls.branchId,
          academicYearId: academicYear._id,
          academicPeriodId: cls.academicPeriodId,
          classId: cls._id,
          subjectId: seededSubjects['ENG-GRAM']?._id || seededSubjects['COM-FND']?._id,
          name: `${item.name} (${cls.classCode})`,
          code: assCode,
          type: 'monthly_test',
          maxScore: 100,
          passingScore: 50,
          weightPercentage: 25,
          assessmentDate: new Date(item.date),
          status: 'published',
        });
        logger.info(`Seeded monthly test: ${assCode}`);

        // Seed scores for enrolled students in batch
        const enrollments = await EnrollmentModel.find({ classId: cls._id, isDeleted: false });
        const scoreDocs = enrollments.map((enr, i) => {
          const baseScores = [96, 92, 88, 85, 82, 79, 75, 72, 68, 65, 94, 89, 84, 78, 62, 58];
          const scoreVal = baseScores[(i + item.m) % baseScores.length]!;
          const letter =
            scoreVal >= 90
              ? 'A'
              : scoreVal >= 80
                ? 'B'
                : scoreVal >= 70
                  ? 'C'
                  : scoreVal >= 60
                    ? 'D'
                    : scoreVal >= 50
                      ? 'E'
                      : 'F';
          return {
            schoolId: school._id,
            branchId: cls.branchId,
            academicYearId: academicYear._id,
            academicPeriodId: cls.academicPeriodId,
            classId: cls._id,
            subjectId: seededSubjects['ENG-GRAM']?._id || seededSubjects['COM-FND']?._id,
            assessmentId: assDoc!._id,
            studentId: enr.studentId,
            enrollmentId: enr._id,
            scoreObtained: scoreVal,
            percentage: scoreVal,
            letterGrade: letter,
            isAbsent: false,
          };
        });
        if (scoreDocs.length > 0) {
          await ScoreModel.insertMany(scoreDocs);
        }
      }
    }
  }
  logger.info('Seeded 12 months of monthly_test assessments and scores');

  // 20. Term Results & Promotion Pipeline
  const term1Period = seededPeriods['TERM-1-2026'];
  const term2Period = seededPeriods['TERM-2-2026'];

  const nextLevelMap: Record<string, typeof LevelModel.prototype> = {
    'ENG-BEG': seededLevels['ENG-ELEM'],
    'ENG-ELEM': seededLevels['ENG-INT'],
    'ENG-INT': seededLevels['ENG-ADV'],
    'COM-BSC': seededLevels['COM-OFF'],
    'KHM-P1': seededLevels['KHM-P2'],
  };

  const engSubList = [
    seededSubjects['ENG-GRAM'],
    seededSubjects['ENG-READ'],
    seededSubjects['ENG-LSTN'],
  ].filter(Boolean);
  const comSubList = [seededSubjects['COM-FND'], seededSubjects['COM-TYP']].filter(Boolean);
  const khmSubList = [
    seededSubjects['MATH-PRI'],
    seededSubjects['KHM-LIT'],
    seededSubjects['SCI-PRI'],
  ].filter(Boolean);

  const term1Classes = await ClassModel.find({
    academicPeriodId: term1Period?._id,
    isDeleted: false,
  });

  for (const cls of term1Classes) {
    const enrollments = await EnrollmentModel.find({
      classId: cls._id,
      isDeleted: false,
    });

    if (enrollments.length === 0) continue;

    const currentLevel = await LevelModel.findById(cls.levelId);
    const levelCode = currentLevel?.code || '';
    const nextLevel = nextLevelMap[levelCode];

    let applicableSubjects = engSubList;
    if (String(cls.programId) === String(comProgram._id)) {
      applicableSubjects = comSubList;
    } else if (String(cls.programId) === String(khmProgram._id)) {
      applicableSubjects = khmSubList;
    }

    for (let i = 0; i < enrollments.length; i++) {
      const enr = enrollments[i]!;
      const isFail = (i + 1) % 7 === 0;

      const scoreAvg = isFail
        ? Math.floor(38 + (i % 10))
        : Math.min(98, Math.floor(74 + ((i * 7) % 24)));

      const letterGrade =
        scoreAvg >= 90
          ? 'A'
          : scoreAvg >= 80
            ? 'B'
            : scoreAvg >= 70
              ? 'C'
              : scoreAvg >= 60
                ? 'D'
                : 'F';
      const gpa =
        scoreAvg >= 90
          ? 4.0
          : scoreAvg >= 80
            ? 3.5
            : scoreAvg >= 70
              ? 3.0
              : scoreAvg >= 60
                ? 2.0
                : 0.0;
      const attendanceRate = isFail ? 65 : Math.min(98, 88 + (i % 11));

      let resultStatus: 'PASSED' | 'FAILED' = 'PASSED';
      let promotionStatus: 'PROMOTED' | 'REPEAT' | 'CONTINUE' | 'COMPLETED' = 'PROMOTED';
      let assignedNextLevelId = nextLevel?._id;
      let isCompleted = false;
      let completionDate: Date | undefined = undefined;
      let remarks = 'Successfully completed academic term criteria.';

      if (isFail) {
        resultStatus = 'FAILED';
        promotionStatus = 'REPEAT';
        assignedNextLevelId = currentLevel?._id;
        remarks = 'Did not achieve minimum passing standard; assigned to repeat level.';
      } else if (levelCode === 'COM-OFF' || levelCode === 'ENG-ADV') {
        resultStatus = 'PASSED';
        promotionStatus = 'COMPLETED';
        isCompleted = true;
        completionDate = new Date('2026-11-28');
        assignedNextLevelId = undefined;
        remarks = 'Graduated and completed course curriculum requirements.';
      }

      const subjectResults = applicableSubjects.map((sub, sIdx) => {
        const subScore = Math.max(
          35,
          Math.min(100, scoreAvg + (sIdx % 2 === 0 ? 1 : -1) * (sIdx + 2)),
        );
        const subGrade =
          subScore >= 90
            ? ('A' as const)
            : subScore >= 80
              ? ('B' as const)
              : subScore >= 70
                ? ('C' as const)
                : subScore >= 60
                  ? ('D' as const)
                  : ('F' as const);

        return {
          subjectId: sub?._id,
          code: sub?.code || '',
          name: sub?.name || '',
          assessments: [],
          total: subScore,
          average: subScore,
          grade: subGrade,
          passed: subScore >= 50,
        };
      });

      const totalSessions = 90;
      const presentSessions = Math.round((attendanceRate / 100) * totalSessions);
      const absentSessions = totalSessions - presentSessions;

      const attendanceSnapshot = {
        totalSessions,
        present: presentSessions,
        absent: absentSessions,
        late: Math.floor(absentSessions / 3),
        halfDay: 0,
        excused: Math.floor(absentSessions / 2),
        permission: Math.floor(absentSessions / 4),
        rate: attendanceRate,
      };

      const tr = await TermResultModel.findOne({
        enrollmentId: enr._id,
        isDeleted: false,
      });

      if (!tr) {
        await TermResultModel.create({
          schoolId: school._id,
          branchId: cls.branchId,
          academicYearId: academicYear._id,
          academicPeriodId: term1Period?._id,
          programId: cls.programId,
          levelId: cls.levelId,
          classId: cls._id,
          studentId: enr.studentId,
          enrollmentId: enr._id,
          totalScore: scoreAvg,
          averageScore: scoreAvg,
          gpa,
          letterGrade,
          attendanceRate,
          subjectResults,
          attendanceSnapshot,
          calculationPolicy: {
            passingAverage: 50,
            minimumAttendanceRate: 70,
            gpaScale: 4,
          },
          gradingRuleSnapshot: { standard: 'Cambodian MOEYS & ESL Hybrid Standard' },
          assessmentSchemeSnapshot: { scheme: 'Regular Term Assessment' },
          attendanceRuleSnapshot: { minRate: 70 },
          promotionRuleSnapshot: { minAverage: 50 },
          snapshotVersion: 1,
          workflowStatus: 'APPROVED',
          approvedAt: new Date('2026-11-29'),
          approvedBy: 'Academic Officer',
          resultStatus,
          promotionStatus,
          nextLevelId: assignedNextLevelId,
          isCompleted,
          completionDate,
          remarks,
        });
      } else {
        tr.totalScore = scoreAvg;
        tr.averageScore = scoreAvg;
        tr.gpa = gpa;
        tr.letterGrade = letterGrade;
        tr.attendanceRate = attendanceRate;
        tr.resultStatus = resultStatus;
        tr.promotionStatus = promotionStatus;
        tr.nextLevelId = assignedNextLevelId;
        tr.isCompleted = isCompleted;
        tr.completionDate = completionDate;
        tr.workflowStatus = 'APPROVED';
        tr.subjectResults = subjectResults as unknown as typeof tr.subjectResults;
        tr.attendanceSnapshot = attendanceSnapshot;
        tr.remarks = remarks;
        await tr.save();
      }
    }
  }
  logger.info('Seeded comprehensive term results and promotions across all classes');

  // Term 2 Progression Classes & Rollover Enrollments
  if (term2Period) {
    const term2ClassesToSeed = [
      {
        code: 'ENG-ELEM-M2-T2',
        name: 'English Elementary Morning B (Term 2)',
        branch: mainBranch,
        program: engProgram,
        level: seededLevels['ENG-ELEM'],
        studyMode: seededStudyModes['FT'],
        room: seededRooms['MB-01_RM-101'],
        teacher: seededEmployees['EMP-MB-001'],
        capacity: 35,
      },
      {
        code: 'ENG-INT-M2-T2',
        name: 'English Intermediate Morning B (Term 2)',
        branch: mainBranch,
        program: engProgram,
        level: seededLevels['ENG-INT'],
        studyMode: seededStudyModes['FT'],
        room: seededRooms['MB-01_RM-101'],
        teacher: seededEmployees['EMP-MB-001'],
        capacity: 35,
      },
      {
        code: 'COM-OFF-W2-T2',
        name: 'MS Office & Digital Tools Weekend B (Term 2)',
        branch: mainBranch,
        program: comProgram,
        level: seededLevels['COM-OFF'],
        studyMode: seededStudyModes['WK'],
        room: seededRooms['MB-01_RM-102'],
        teacher: seededEmployees['EMP-MB-006'],
        capacity: 30,
      },
      {
        code: 'ENG-ELEM-TK-T2',
        name: 'English Elementary Afternoon B (TK - Term 2)',
        branch: toulKorkBranch,
        program: engProgram,
        level: seededLevels['ENG-ELEM'],
        studyMode: seededStudyModes['PT'],
        room: seededRooms['TK-02_RM-201'],
        teacher: seededEmployees['EMP-TK-001'],
        capacity: 30,
      },
      {
        code: 'COM-OFF-SS-T2',
        name: 'MS Office & Digital Tools Evening (Sen Sok - Term 2)',
        branch: senSokBranch,
        program: comProgram,
        level: seededLevels['COM-OFF'],
        studyMode: seededStudyModes['PT'],
        room: seededRooms['SS-03_RM-301'],
        teacher: seededEmployees['EMP-SS-001'],
        capacity: 25,
      },
      {
        code: 'ENG-BEG-REP-T2',
        name: 'English Beginner Repeat Morning (Term 2)',
        branch: mainBranch,
        program: engProgram,
        level: seededLevels['ENG-BEG'],
        studyMode: seededStudyModes['PT'],
        room: seededRooms['MB-01_RM-101'],
        teacher: seededEmployees['EMP-MB-001'],
        capacity: 25,
      },
    ];

    const seededTerm2Classes: Record<string, typeof ClassModel.prototype> = {};

    for (const c of term2ClassesToSeed) {
      if (!c.level) continue;
      let cls = await ClassModel.findOne({
        academicYearId: academicYear._id,
        academicPeriodId: term2Period._id,
        classCode: c.code,
        isDeleted: false,
      });

      if (!cls) {
        cls = await ClassModel.create({
          classCode: c.code,
          className: c.name,
          schoolId: school._id,
          branchId: c.branch._id,
          academicYearId: academicYear._id,
          academicPeriodId: term2Period._id,
          programId: c.program._id,
          levelId: c.level._id,
          studyModeId: c.studyMode?._id,
          classroomId: c.room?._id,
          classTeacherId: c.teacher?._id,
          section: 'A',
          capacity: c.capacity,
          status: 'active',
        });
      }
      seededTerm2Classes[c.code] = cls;
    }

    let nextEnrCounter = 500;
    const allTerm1Results = await TermResultModel.find({
      academicPeriodId: term1Period._id,
      isDeleted: false,
    });

    for (const tr of allTerm1Results) {
      let targetClass: typeof ClassModel.prototype | undefined = undefined;

      if (tr.promotionStatus === 'PROMOTED') {
        if (String(tr.nextLevelId) === String(seededLevels['ENG-ELEM']?._id)) {
          targetClass =
            String(tr.branchId) === String(toulKorkBranch._id)
              ? seededTerm2Classes['ENG-ELEM-TK-T2']
              : seededTerm2Classes['ENG-ELEM-M2-T2'];
        } else if (String(tr.nextLevelId) === String(seededLevels['ENG-INT']?._id)) {
          targetClass = seededTerm2Classes['ENG-INT-M2-T2'];
        } else if (String(tr.nextLevelId) === String(seededLevels['COM-OFF']?._id)) {
          targetClass =
            String(tr.branchId) === String(senSokBranch._id)
              ? seededTerm2Classes['COM-OFF-SS-T2']
              : seededTerm2Classes['COM-OFF-W2-T2'];
        }
      } else if (tr.promotionStatus === 'REPEAT') {
        if (String(tr.levelId) === String(seededLevels['ENG-BEG']?._id)) {
          targetClass = seededTerm2Classes['ENG-BEG-REP-T2'];
        }
      }

      if (!targetClass) continue;

      let term2Enr = await EnrollmentModel.findOne({
        studentId: tr.studentId,
        classId: targetClass._id,
        isDeleted: false,
      });

      if (!term2Enr) {
        const enrCode = `ENR-T2-2026${String(nextEnrCounter).padStart(3, '0')}`;
        nextEnrCounter++;

        term2Enr = await EnrollmentModel.create({
          enrollmentCode: enrCode,
          studentId: tr.studentId,
          schoolId: school._id,
          branchId: targetClass.branchId,
          academicYearId: academicYear._id,
          academicPeriodId: term2Period._id,
          programId: targetClass.programId,
          levelId: targetClass.levelId,
          classId: targetClass._id,
          studyModeId: targetClass.studyModeId,
          previousEnrollmentId: tr.enrollmentId,
          attemptNumber: tr.promotionStatus === 'REPEAT' ? 2 : 1,
          enrollmentDate: new Date('2026-12-01'),
          startDate: new Date('2026-12-01'),
          endDate: new Date('2027-03-31'),
          status: 'active',
          tuitionStatus: 'paid',
          remarks:
            tr.promotionStatus === 'PROMOTED'
              ? 'Promoted from Term 1 following successful exam completion.'
              : 'Repeating course level in Term 2.',
        });
      }

      if (!tr.nextEnrollmentId || !tr.nextPeriodId) {
        tr.nextEnrollmentId = term2Enr._id as mongoose.Types.ObjectId;
        tr.nextPeriodId = term2Period._id as mongoose.Types.ObjectId;
        await tr.save();
      }
    }
    logger.info('Seeded Term 2 progression enrollments for promoted and repeating students');
  }

  // 21. Tuition Fee Structures (Monthly and Term in USD and KHR)
  let tuitionEngElemM = await TuitionFeeModel.findOne({
    feeCode: 'FEE-ENG-ELEM-M-USD',
    isDeleted: false,
  });
  if (!tuitionEngElemM && seededLevels['ENG-ELEM']) {
    tuitionEngElemM = await TuitionFeeModel.create({
      schoolId: school._id,
      branchId: mainBranch._id,
      academicYearId: academicYear._id,
      programId: engProgram._id,
      levelId: seededLevels['ENG-ELEM']._id,
      feeName: 'English Elementary Monthly Tuition (USD)',
      feeCode: 'FEE-ENG-ELEM-M-USD',
      amount: 60,
      currency: 'USD',
      billingCycle: 'monthly',
      status: 'active',
    });
  }

  let tuitionEngElemMKhr = await TuitionFeeModel.findOne({
    feeCode: 'FEE-ENG-ELEM-M-KHR',
    isDeleted: false,
  });
  if (!tuitionEngElemMKhr && seededLevels['ENG-ELEM']) {
    tuitionEngElemMKhr = await TuitionFeeModel.create({
      schoolId: school._id,
      branchId: mainBranch._id,
      academicYearId: academicYear._id,
      programId: engProgram._id,
      levelId: seededLevels['ENG-ELEM']._id,
      feeName: 'English Elementary Monthly Tuition (KHR)',
      feeCode: 'FEE-ENG-ELEM-M-KHR',
      amount: 240000,
      currency: 'KHR',
      billingCycle: 'monthly',
      status: 'active',
    });
  }

  let tuitionComBscM = await TuitionFeeModel.findOne({
    feeCode: 'FEE-COM-BSC-M-USD',
    isDeleted: false,
  });
  if (!tuitionComBscM && seededLevels['COM-BSC']) {
    tuitionComBscM = await TuitionFeeModel.create({
      schoolId: school._id,
      branchId: mainBranch._id,
      academicYearId: academicYear._id,
      programId: comProgram._id,
      levelId: seededLevels['COM-BSC']._id,
      feeName: 'Computer Basic Monthly Tuition (USD)',
      feeCode: 'FEE-COM-BSC-M-USD',
      amount: 50,
      currency: 'USD',
      billingCycle: 'monthly',
      status: 'active',
    });
  }

  let tuitionEngBegTK = await TuitionFeeModel.findOne({
    feeCode: 'FEE-ENG-BEG-TK-M',
    isDeleted: false,
  });
  if (!tuitionEngBegTK && seededLevels['ENG-BEG']) {
    tuitionEngBegTK = await TuitionFeeModel.create({
      schoolId: school._id,
      branchId: toulKorkBranch._id,
      academicYearId: academicYear._id,
      programId: engProgram._id,
      levelId: seededLevels['ENG-BEG']._id,
      feeName: 'English Beginner Monthly (TK)',
      feeCode: 'FEE-ENG-BEG-TK-M',
      amount: 60,
      currency: 'USD',
      billingCycle: 'monthly',
      status: 'active',
    });
  }

  let tuitionEngBegSS = await TuitionFeeModel.findOne({
    feeCode: 'FEE-ENG-BEG-SS-M',
    isDeleted: false,
  });
  if (!tuitionEngBegSS && seededLevels['ENG-BEG']) {
    tuitionEngBegSS = await TuitionFeeModel.create({
      schoolId: school._id,
      branchId: senSokBranch._id,
      academicYearId: academicYear._id,
      programId: engProgram._id,
      levelId: seededLevels['ENG-BEG']._id,
      feeName: 'English Beginner Monthly (Sen Sok)',
      feeCode: 'FEE-ENG-BEG-SS-M',
      amount: 55,
      currency: 'USD',
      billingCycle: 'monthly',
      status: 'active',
    });
  }

  let tuitionEngElemTerm = await TuitionFeeModel.findOne({
    feeCode: 'FEE-ENG-ELEM-TRM',
    isDeleted: false,
  });
  if (!tuitionEngElemTerm && seededLevels['ENG-ELEM']) {
    tuitionEngElemTerm = await TuitionFeeModel.create({
      schoolId: school._id,
      branchId: mainBranch._id,
      academicYearId: academicYear._id,
      programId: engProgram._id,
      levelId: seededLevels['ENG-ELEM']._id,
      feeName: 'English Elementary Term Tuition Fee',
      feeCode: 'FEE-ENG-ELEM-TRM',
      amount: 250,
      currency: 'USD',
      billingCycle: 'term',
      status: 'active',
    });
  }

  let tuitionComBscTerm = await TuitionFeeModel.findOne({
    feeCode: 'FEE-COM-BSC-TRM',
    isDeleted: false,
  });
  if (!tuitionComBscTerm && seededLevels['COM-BSC']) {
    tuitionComBscTerm = await TuitionFeeModel.create({
      schoolId: school._id,
      branchId: mainBranch._id,
      academicYearId: academicYear._id,
      programId: comProgram._id,
      levelId: seededLevels['COM-BSC']._id,
      feeName: 'Computer Basic Term Tuition Fee',
      feeCode: 'FEE-COM-BSC-TRM',
      amount: 180,
      currency: 'USD',
      billingCycle: 'term',
      status: 'active',
    });
  }
  logger.info('Seeded tuition fee structures in USD and KHR');

  // 22. Payments Ledger (76 Payments Across All 12 Months of 2026)
  const paymentsData = [
    {
      rct: 'PAY-20260001',
      stId: 'STU-000001',
      branch: mainBranch,
      fee: tuitionEngElemM,
      due: 60,
      paid: 60,
      bal: 0,
      disc: 0,
      curr: 'USD' as const,
      method: 'aba_pay' as const,
      status: 'paid' as const,
      date: new Date('2026-01-05'),
    },
    {
      rct: 'PAY-20260002',
      stId: 'STU-000002',
      branch: mainBranch,
      fee: tuitionEngElemM,
      due: 60,
      paid: 60,
      bal: 0,
      disc: 0,
      curr: 'USD' as const,
      method: 'aba_pay' as const,
      status: 'paid' as const,
      date: new Date('2026-01-06'),
    },
    {
      rct: 'PAY-20260003',
      stId: 'STU-000003',
      branch: mainBranch,
      fee: tuitionComBscM,
      due: 50,
      paid: 30,
      bal: 20,
      disc: 0,
      curr: 'USD' as const,
      method: 'cash' as const,
      status: 'partial' as const,
      date: new Date('2026-01-07'),
    },
    {
      rct: 'PAY-20260004',
      stId: 'STU-000036',
      branch: toulKorkBranch,
      fee: tuitionEngBegTK,
      due: 60,
      paid: 60,
      bal: 0,
      disc: 0,
      curr: 'USD' as const,
      method: 'wing' as const,
      status: 'paid' as const,
      date: new Date('2026-01-08'),
    },
    {
      rct: 'PAY-20260005',
      stId: 'STU-000061',
      branch: senSokBranch,
      fee: tuitionEngBegSS,
      due: 55,
      paid: 55,
      bal: 0,
      disc: 0,
      curr: 'USD' as const,
      method: 'bank_transfer' as const,
      status: 'paid' as const,
      date: new Date('2026-01-09'),
    },
    {
      rct: 'PAY-20260006',
      stId: 'STU-000006',
      branch: mainBranch,
      fee: tuitionEngElemMKhr,
      due: 240000,
      paid: 240000,
      bal: 0,
      disc: 0,
      curr: 'KHR' as const,
      method: 'aba_pay' as const,
      status: 'paid' as const,
      date: new Date('2026-01-10'),
    },
    {
      rct: 'PAY-20260007',
      stId: 'STU-000001',
      branch: mainBranch,
      fee: tuitionEngElemM,
      due: 60,
      paid: 60,
      bal: 0,
      disc: 0,
      curr: 'USD' as const,
      method: 'aba_pay' as const,
      status: 'paid' as const,
      date: new Date('2026-02-05'),
    },
    {
      rct: 'PAY-20260008',
      stId: 'STU-000002',
      branch: mainBranch,
      fee: tuitionEngElemM,
      due: 60,
      paid: 60,
      bal: 0,
      disc: 0,
      curr: 'USD' as const,
      method: 'aba_pay' as const,
      status: 'paid' as const,
      date: new Date('2026-02-06'),
    },
    {
      rct: 'PAY-20260009',
      stId: 'STU-000007',
      branch: mainBranch,
      fee: tuitionEngElemM,
      due: 60,
      paid: 60,
      bal: 0,
      disc: 0,
      curr: 'USD' as const,
      method: 'credit_card' as const,
      status: 'paid' as const,
      date: new Date('2026-02-07'),
    },
    {
      rct: 'PAY-20260010',
      stId: 'STU-000037',
      branch: toulKorkBranch,
      fee: tuitionEngBegTK,
      due: 60,
      paid: 40,
      bal: 20,
      disc: 0,
      curr: 'USD' as const,
      method: 'cash' as const,
      status: 'partial' as const,
      date: new Date('2026-02-08'),
    },
    {
      rct: 'PAY-20260011',
      stId: 'STU-000062',
      branch: senSokBranch,
      fee: tuitionEngBegSS,
      due: 55,
      paid: 55,
      bal: 0,
      disc: 0,
      curr: 'USD' as const,
      method: 'aba_pay' as const,
      status: 'paid' as const,
      date: new Date('2026-02-09'),
    },
    {
      rct: 'PAY-20260012',
      stId: 'STU-000010',
      branch: mainBranch,
      fee: tuitionEngElemMKhr,
      due: 240000,
      paid: 240000,
      bal: 0,
      disc: 0,
      curr: 'KHR' as const,
      method: 'bank_transfer' as const,
      status: 'paid' as const,
      date: new Date('2026-02-10'),
    },
    {
      rct: 'PAY-20260013',
      stId: 'STU-000001',
      branch: mainBranch,
      fee: tuitionEngElemM,
      due: 60,
      paid: 60,
      bal: 0,
      disc: 0,
      curr: 'USD' as const,
      method: 'aba_pay' as const,
      status: 'paid' as const,
      date: new Date('2026-03-05'),
    },
    {
      rct: 'PAY-20260014',
      stId: 'STU-000004',
      branch: mainBranch,
      fee: tuitionEngElemM,
      due: 60,
      paid: 60,
      bal: 0,
      disc: 0,
      curr: 'USD' as const,
      method: 'wing' as const,
      status: 'paid' as const,
      date: new Date('2026-03-06'),
    },
    {
      rct: 'PAY-20260015',
      stId: 'STU-000038',
      branch: toulKorkBranch,
      fee: tuitionEngBegTK,
      due: 60,
      paid: 60,
      bal: 0,
      disc: 0,
      curr: 'USD' as const,
      method: 'aba_pay' as const,
      status: 'paid' as const,
      date: new Date('2026-03-07'),
    },
    {
      rct: 'PAY-20260016',
      stId: 'STU-000063',
      branch: senSokBranch,
      fee: tuitionEngBegSS,
      due: 55,
      paid: 30,
      bal: 25,
      disc: 0,
      curr: 'USD' as const,
      method: 'cash' as const,
      status: 'partial' as const,
      date: new Date('2026-03-08'),
    },
    {
      rct: 'PAY-20260017',
      stId: 'STU-000012',
      branch: mainBranch,
      fee: tuitionComBscM,
      due: 50,
      paid: 50,
      bal: 0,
      disc: 0,
      curr: 'USD' as const,
      method: 'aba_pay' as const,
      status: 'paid' as const,
      date: new Date('2026-03-09'),
    },
    {
      rct: 'PAY-20260018',
      stId: 'STU-000014',
      branch: mainBranch,
      fee: tuitionEngElemMKhr,
      due: 240000,
      paid: 240000,
      bal: 0,
      disc: 0,
      curr: 'KHR' as const,
      method: 'aba_pay' as const,
      status: 'paid' as const,
      date: new Date('2026-03-10'),
    },
    {
      rct: 'PAY-20260019',
      stId: 'STU-000001',
      branch: mainBranch,
      fee: tuitionEngElemM,
      due: 60,
      paid: 60,
      bal: 0,
      disc: 0,
      curr: 'USD' as const,
      method: 'aba_pay' as const,
      status: 'paid' as const,
      date: new Date('2026-04-05'),
    },
    {
      rct: 'PAY-20260020',
      stId: 'STU-000005',
      branch: mainBranch,
      fee: tuitionEngElemM,
      due: 60,
      paid: 60,
      bal: 0,
      disc: 0,
      curr: 'USD' as const,
      method: 'bank_transfer' as const,
      status: 'paid' as const,
      date: new Date('2026-04-06'),
    },
    {
      rct: 'PAY-20260021',
      stId: 'STU-000039',
      branch: toulKorkBranch,
      fee: tuitionEngBegTK,
      due: 60,
      paid: 60,
      bal: 0,
      disc: 0,
      curr: 'USD' as const,
      method: 'aba_pay' as const,
      status: 'paid' as const,
      date: new Date('2026-04-07'),
    },
    {
      rct: 'PAY-20260022',
      stId: 'STU-000064',
      branch: senSokBranch,
      fee: tuitionEngBegSS,
      due: 55,
      paid: 55,
      bal: 0,
      disc: 0,
      curr: 'USD' as const,
      method: 'wing' as const,
      status: 'paid' as const,
      date: new Date('2026-04-08'),
    },
    {
      rct: 'PAY-20260023',
      stId: 'STU-000008',
      branch: mainBranch,
      fee: tuitionEngElemM,
      due: 60,
      paid: 0,
      bal: 60,
      disc: 0,
      curr: 'USD' as const,
      method: 'cash' as const,
      status: 'pending' as const,
      date: new Date('2026-04-09'),
    },
    {
      rct: 'PAY-20260024',
      stId: 'STU-000016',
      branch: mainBranch,
      fee: tuitionEngElemMKhr,
      due: 240000,
      paid: 240000,
      bal: 0,
      disc: 0,
      curr: 'KHR' as const,
      method: 'aba_pay' as const,
      status: 'paid' as const,
      date: new Date('2026-04-10'),
    },
    {
      rct: 'PAY-20260025',
      stId: 'STU-000001',
      branch: mainBranch,
      fee: tuitionEngElemM,
      due: 60,
      paid: 60,
      bal: 0,
      disc: 0,
      curr: 'USD' as const,
      method: 'aba_pay' as const,
      status: 'paid' as const,
      date: new Date('2026-05-05'),
    },
    {
      rct: 'PAY-20260026',
      stId: 'STU-000002',
      branch: mainBranch,
      fee: tuitionEngElemM,
      due: 60,
      paid: 60,
      bal: 0,
      disc: 0,
      curr: 'USD' as const,
      method: 'aba_pay' as const,
      status: 'paid' as const,
      date: new Date('2026-05-06'),
    },
    {
      rct: 'PAY-20260027',
      stId: 'STU-000040',
      branch: toulKorkBranch,
      fee: tuitionEngBegTK,
      due: 60,
      paid: 45,
      bal: 15,
      disc: 0,
      curr: 'USD' as const,
      method: 'cash' as const,
      status: 'partial' as const,
      date: new Date('2026-05-07'),
    },
    {
      rct: 'PAY-20260028',
      stId: 'STU-000065',
      branch: senSokBranch,
      fee: tuitionEngBegSS,
      due: 55,
      paid: 55,
      bal: 0,
      disc: 0,
      curr: 'USD' as const,
      method: 'aba_pay' as const,
      status: 'paid' as const,
      date: new Date('2026-05-08'),
    },
    {
      rct: 'PAY-20260029',
      stId: 'STU-000017',
      branch: mainBranch,
      fee: tuitionEngElemM,
      due: 60,
      paid: 60,
      bal: 0,
      disc: 0,
      curr: 'USD' as const,
      method: 'credit_card' as const,
      status: 'paid' as const,
      date: new Date('2026-05-09'),
    },
    {
      rct: 'PAY-20260030',
      stId: 'STU-000019',
      branch: mainBranch,
      fee: tuitionEngElemMKhr,
      due: 240000,
      paid: 240000,
      bal: 0,
      disc: 0,
      curr: 'KHR' as const,
      method: 'bank_transfer' as const,
      status: 'paid' as const,
      date: new Date('2026-05-10'),
    },
    {
      rct: 'PAY-20260031',
      stId: 'STU-000001',
      branch: mainBranch,
      fee: tuitionEngElemM,
      due: 60,
      paid: 60,
      bal: 0,
      disc: 0,
      curr: 'USD' as const,
      method: 'aba_pay' as const,
      status: 'paid' as const,
      date: new Date('2026-06-05'),
    },
    {
      rct: 'PAY-20260032',
      stId: 'STU-000003',
      branch: mainBranch,
      fee: tuitionComBscM,
      due: 50,
      paid: 50,
      bal: 0,
      disc: 0,
      curr: 'USD' as const,
      method: 'cash' as const,
      status: 'paid' as const,
      date: new Date('2026-06-06'),
    },
    {
      rct: 'PAY-20260033',
      stId: 'STU-000041',
      branch: toulKorkBranch,
      fee: tuitionEngBegTK,
      due: 60,
      paid: 60,
      bal: 0,
      disc: 0,
      curr: 'USD' as const,
      method: 'wing' as const,
      status: 'paid' as const,
      date: new Date('2026-06-07'),
    },
    {
      rct: 'PAY-20260034',
      stId: 'STU-000066',
      branch: senSokBranch,
      fee: tuitionEngBegSS,
      due: 55,
      paid: 55,
      bal: 0,
      disc: 0,
      curr: 'USD' as const,
      method: 'aba_pay' as const,
      status: 'paid' as const,
      date: new Date('2026-06-08'),
    },
    {
      rct: 'PAY-20260035',
      stId: 'STU-000021',
      branch: mainBranch,
      fee: tuitionEngElemM,
      due: 60,
      paid: 30,
      bal: 30,
      disc: 0,
      curr: 'USD' as const,
      method: 'cash' as const,
      status: 'partial' as const,
      date: new Date('2026-06-09'),
    },
    {
      rct: 'PAY-20260036',
      stId: 'STU-000023',
      branch: mainBranch,
      fee: tuitionEngElemMKhr,
      due: 240000,
      paid: 240000,
      bal: 0,
      disc: 0,
      curr: 'KHR' as const,
      method: 'aba_pay' as const,
      status: 'paid' as const,
      date: new Date('2026-06-10'),
    },
    {
      rct: 'PAY-20260037',
      stId: 'STU-000001',
      branch: mainBranch,
      fee: tuitionEngElemM,
      due: 60,
      paid: 60,
      bal: 0,
      disc: 0,
      curr: 'USD' as const,
      method: 'aba_pay' as const,
      status: 'paid' as const,
      date: new Date('2026-07-05'),
    },
    {
      rct: 'PAY-20260038',
      stId: 'STU-000006',
      branch: mainBranch,
      fee: tuitionEngElemM,
      due: 60,
      paid: 60,
      bal: 0,
      disc: 0,
      curr: 'USD' as const,
      method: 'bank_transfer' as const,
      status: 'paid' as const,
      date: new Date('2026-07-06'),
    },
    {
      rct: 'PAY-20260039',
      stId: 'STU-000042',
      branch: toulKorkBranch,
      fee: tuitionEngBegTK,
      due: 60,
      paid: 60,
      bal: 0,
      disc: 0,
      curr: 'USD' as const,
      method: 'aba_pay' as const,
      status: 'paid' as const,
      date: new Date('2026-07-07'),
    },
    {
      rct: 'PAY-20260040',
      stId: 'STU-000067',
      branch: senSokBranch,
      fee: tuitionEngBegSS,
      due: 55,
      paid: 0,
      bal: 55,
      disc: 0,
      curr: 'USD' as const,
      method: 'cash' as const,
      status: 'pending' as const,
      date: new Date('2026-07-08'),
    },
    {
      rct: 'PAY-20260041',
      stId: 'STU-000025',
      branch: mainBranch,
      fee: tuitionEngElemM,
      due: 60,
      paid: 60,
      bal: 0,
      disc: 0,
      curr: 'USD' as const,
      method: 'aba_pay' as const,
      status: 'paid' as const,
      date: new Date('2026-07-09'),
    },
    {
      rct: 'PAY-20260042',
      stId: 'STU-000027',
      branch: mainBranch,
      fee: tuitionEngElemMKhr,
      due: 240000,
      paid: 240000,
      bal: 0,
      disc: 0,
      curr: 'KHR' as const,
      method: 'wing' as const,
      status: 'paid' as const,
      date: new Date('2026-07-10'),
    },
    {
      rct: 'PAY-20260043',
      stId: 'STU-000001',
      branch: mainBranch,
      fee: tuitionEngElemTerm,
      due: 250,
      paid: 250,
      bal: 0,
      disc: 0,
      curr: 'USD' as const,
      method: 'aba_pay' as const,
      status: 'paid' as const,
      date: new Date('2026-08-20'),
    },
    {
      rct: 'PAY-20260044',
      stId: 'STU-000002',
      branch: mainBranch,
      fee: tuitionEngElemTerm,
      due: 250,
      paid: 250,
      bal: 0,
      disc: 0,
      curr: 'USD' as const,
      method: 'aba_pay' as const,
      status: 'paid' as const,
      date: new Date('2026-08-21'),
    },
    {
      rct: 'PAY-20260045',
      stId: 'STU-000003',
      branch: mainBranch,
      fee: tuitionComBscTerm,
      due: 180,
      paid: 100,
      bal: 80,
      disc: 0,
      curr: 'USD' as const,
      method: 'cash' as const,
      status: 'partial' as const,
      date: new Date('2026-08-22'),
    },
    {
      rct: 'PAY-20260046',
      stId: 'STU-000036',
      branch: toulKorkBranch,
      fee: tuitionEngBegTK,
      due: 220,
      paid: 220,
      bal: 0,
      disc: 0,
      curr: 'USD' as const,
      method: 'wing' as const,
      status: 'paid' as const,
      date: new Date('2026-08-23'),
    },
    {
      rct: 'PAY-20260047',
      stId: 'STU-000061',
      branch: senSokBranch,
      fee: tuitionEngBegSS,
      due: 200,
      paid: 200,
      bal: 0,
      disc: 0,
      curr: 'USD' as const,
      method: 'bank_transfer' as const,
      status: 'paid' as const,
      date: new Date('2026-08-24'),
    },
    {
      rct: 'PAY-20260048',
      stId: 'STU-000007',
      branch: mainBranch,
      fee: tuitionEngElemTerm,
      due: 250,
      paid: 250,
      bal: 0,
      disc: 0,
      curr: 'USD' as const,
      method: 'aba_pay' as const,
      status: 'paid' as const,
      date: new Date('2026-08-25'),
    },
    {
      rct: 'PAY-20260049',
      stId: 'STU-000029',
      branch: mainBranch,
      fee: tuitionEngElemMKhr,
      due: 1000000,
      paid: 1000000,
      bal: 0,
      disc: 0,
      curr: 'KHR' as const,
      method: 'aba_pay' as const,
      status: 'paid' as const,
      date: new Date('2026-08-26'),
    },
    {
      rct: 'PAY-20260050',
      stId: 'STU-000001',
      branch: mainBranch,
      fee: tuitionEngElemM,
      due: 60,
      paid: 60,
      bal: 0,
      disc: 0,
      curr: 'USD' as const,
      method: 'aba_pay' as const,
      status: 'paid' as const,
      date: new Date('2026-09-04'),
    },
    {
      rct: 'PAY-20260051',
      stId: 'STU-000004',
      branch: mainBranch,
      fee: tuitionEngElemM,
      due: 60,
      paid: 60,
      bal: 0,
      disc: 0,
      curr: 'USD' as const,
      method: 'credit_card' as const,
      status: 'paid' as const,
      date: new Date('2026-09-05'),
    },
    {
      rct: 'PAY-20260052',
      stId: 'STU-000006',
      branch: mainBranch,
      fee: tuitionEngElemM,
      due: 60,
      paid: 60,
      bal: 0,
      disc: 0,
      curr: 'USD' as const,
      method: 'aba_pay' as const,
      status: 'paid' as const,
      date: new Date('2026-09-06'),
    },
    {
      rct: 'PAY-20260053',
      stId: 'STU-000043',
      branch: toulKorkBranch,
      fee: tuitionEngBegTK,
      due: 60,
      paid: 40,
      bal: 20,
      disc: 0,
      curr: 'USD' as const,
      method: 'cash' as const,
      status: 'partial' as const,
      date: new Date('2026-09-07'),
    },
    {
      rct: 'PAY-20260054',
      stId: 'STU-000068',
      branch: senSokBranch,
      fee: tuitionEngBegSS,
      due: 55,
      paid: 55,
      bal: 0,
      disc: 0,
      curr: 'USD' as const,
      method: 'aba_pay' as const,
      status: 'paid' as const,
      date: new Date('2026-09-08'),
    },
    {
      rct: 'PAY-20260055',
      stId: 'STU-000011',
      branch: mainBranch,
      fee: tuitionEngElemM,
      due: 60,
      paid: 0,
      bal: 60,
      disc: 0,
      curr: 'USD' as const,
      method: 'cash' as const,
      status: 'pending' as const,
      date: new Date('2026-09-09'),
    },
    {
      rct: 'PAY-20260056',
      stId: 'STU-000031',
      branch: mainBranch,
      fee: tuitionEngElemMKhr,
      due: 240000,
      paid: 240000,
      bal: 0,
      disc: 0,
      curr: 'KHR' as const,
      method: 'bank_transfer' as const,
      status: 'paid' as const,
      date: new Date('2026-09-10'),
    },
    {
      rct: 'PAY-20260057',
      stId: 'STU-000033',
      branch: mainBranch,
      fee: tuitionEngElemMKhr,
      due: 240000,
      paid: 240000,
      bal: 0,
      disc: 0,
      curr: 'KHR' as const,
      method: 'aba_pay' as const,
      status: 'paid' as const,
      date: new Date('2026-09-11'),
    },
    {
      rct: 'PAY-20260058',
      stId: 'STU-000001',
      branch: mainBranch,
      fee: tuitionEngElemM,
      due: 60,
      paid: 60,
      bal: 0,
      disc: 0,
      curr: 'USD' as const,
      method: 'aba_pay' as const,
      status: 'paid' as const,
      date: new Date('2026-10-04'),
    },
    {
      rct: 'PAY-20260059',
      stId: 'STU-000005',
      branch: mainBranch,
      fee: tuitionEngElemM,
      due: 60,
      paid: 60,
      bal: 0,
      disc: 0,
      curr: 'USD' as const,
      method: 'aba_pay' as const,
      status: 'paid' as const,
      date: new Date('2026-10-05'),
    },
    {
      rct: 'PAY-20260060',
      stId: 'STU-000044',
      branch: toulKorkBranch,
      fee: tuitionEngBegTK,
      due: 60,
      paid: 60,
      bal: 0,
      disc: 0,
      curr: 'USD' as const,
      method: 'wing' as const,
      status: 'paid' as const,
      date: new Date('2026-10-06'),
    },
    {
      rct: 'PAY-20260061',
      stId: 'STU-000069',
      branch: senSokBranch,
      fee: tuitionEngBegSS,
      due: 55,
      paid: 55,
      bal: 0,
      disc: 0,
      curr: 'USD' as const,
      method: 'aba_pay' as const,
      status: 'paid' as const,
      date: new Date('2026-10-07'),
    },
    {
      rct: 'PAY-20260062',
      stId: 'STU-000013',
      branch: mainBranch,
      fee: tuitionEngElemM,
      due: 60,
      paid: 35,
      bal: 25,
      disc: 0,
      curr: 'USD' as const,
      method: 'cash' as const,
      status: 'partial' as const,
      date: new Date('2026-10-08'),
    },
    {
      rct: 'PAY-20260063',
      stId: 'STU-000035',
      branch: mainBranch,
      fee: tuitionEngElemMKhr,
      due: 240000,
      paid: 240000,
      bal: 0,
      disc: 0,
      curr: 'KHR' as const,
      method: 'aba_pay' as const,
      status: 'paid' as const,
      date: new Date('2026-10-09'),
    },
    {
      rct: 'PAY-20260064',
      stId: 'STU-000045',
      branch: toulKorkBranch,
      fee: tuitionEngBegTK,
      due: 60,
      paid: 0,
      bal: 60,
      disc: 0,
      curr: 'USD' as const,
      method: 'cash' as const,
      status: 'pending' as const,
      date: new Date('2026-10-10'),
    },
    {
      rct: 'PAY-20260065',
      stId: 'STU-000001',
      branch: mainBranch,
      fee: tuitionEngElemM,
      due: 60,
      paid: 60,
      bal: 0,
      disc: 0,
      curr: 'USD' as const,
      method: 'aba_pay' as const,
      status: 'paid' as const,
      date: new Date('2026-11-04'),
    },
    {
      rct: 'PAY-20260066',
      stId: 'STU-000002',
      branch: mainBranch,
      fee: tuitionEngElemM,
      due: 60,
      paid: 60,
      bal: 0,
      disc: 0,
      curr: 'USD' as const,
      method: 'aba_pay' as const,
      status: 'paid' as const,
      date: new Date('2026-11-05'),
    },
    {
      rct: 'PAY-20260067',
      stId: 'STU-000046',
      branch: toulKorkBranch,
      fee: tuitionEngBegTK,
      due: 60,
      paid: 60,
      bal: 0,
      disc: 0,
      curr: 'USD' as const,
      method: 'bank_transfer' as const,
      status: 'paid' as const,
      date: new Date('2026-11-06'),
    },
    {
      rct: 'PAY-20260068',
      stId: 'STU-000070',
      branch: senSokBranch,
      fee: tuitionEngBegSS,
      due: 55,
      paid: 55,
      bal: 0,
      disc: 0,
      curr: 'USD' as const,
      method: 'aba_pay' as const,
      status: 'paid' as const,
      date: new Date('2026-11-07'),
    },
    {
      rct: 'PAY-20260069',
      stId: 'STU-000015',
      branch: mainBranch,
      fee: tuitionEngElemM,
      due: 60,
      paid: 60,
      bal: 0,
      disc: 0,
      curr: 'USD' as const,
      method: 'credit_card' as const,
      status: 'paid' as const,
      date: new Date('2026-11-08'),
    },
    {
      rct: 'PAY-20260070',
      stId: 'STU-000020',
      branch: mainBranch,
      fee: tuitionEngElemMKhr,
      due: 240000,
      paid: 240000,
      bal: 0,
      disc: 0,
      curr: 'KHR' as const,
      method: 'aba_pay' as const,
      status: 'paid' as const,
      date: new Date('2026-11-09'),
    },
    {
      rct: 'PAY-20260071',
      stId: 'STU-000001',
      branch: mainBranch,
      fee: tuitionEngElemM,
      due: 60,
      paid: 60,
      bal: 0,
      disc: 0,
      curr: 'USD' as const,
      method: 'aba_pay' as const,
      status: 'paid' as const,
      date: new Date('2026-12-04'),
    },
    {
      rct: 'PAY-20260072',
      stId: 'STU-000007',
      branch: mainBranch,
      fee: tuitionEngElemM,
      due: 60,
      paid: 60,
      bal: 0,
      disc: 0,
      curr: 'USD' as const,
      method: 'aba_pay' as const,
      status: 'paid' as const,
      date: new Date('2026-12-05'),
    },
    {
      rct: 'PAY-20260073',
      stId: 'STU-000047',
      branch: toulKorkBranch,
      fee: tuitionEngBegTK,
      due: 60,
      paid: 40,
      bal: 20,
      disc: 0,
      curr: 'USD' as const,
      method: 'cash' as const,
      status: 'partial' as const,
      date: new Date('2026-12-06'),
    },
    {
      rct: 'PAY-20260074',
      stId: 'STU-000071',
      branch: senSokBranch,
      fee: tuitionEngBegSS,
      due: 55,
      paid: 55,
      bal: 0,
      disc: 0,
      curr: 'USD' as const,
      method: 'wing' as const,
      status: 'paid' as const,
      date: new Date('2026-12-07'),
    },
    {
      rct: 'PAY-20260075',
      stId: 'STU-000018',
      branch: mainBranch,
      fee: tuitionEngElemM,
      due: 60,
      paid: 60,
      bal: 0,
      disc: 0,
      curr: 'USD' as const,
      method: 'aba_pay' as const,
      status: 'paid' as const,
      date: new Date('2026-12-08'),
    },
    {
      rct: 'PAY-20260076',
      stId: 'STU-000022',
      branch: mainBranch,
      fee: tuitionEngElemMKhr,
      due: 240000,
      paid: 240000,
      bal: 0,
      disc: 0,
      curr: 'KHR' as const,
      method: 'aba_pay' as const,
      status: 'paid' as const,
      date: new Date('2026-12-09'),
    },
  ];

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

  for (const pay of paymentsData) {
    const stu = seededStudents[pay.stId];
    if (stu && pay.fee) {
      const payDoc = await PaymentModel.findOne({ receiptNumber: pay.rct, isDeleted: false });
      const billingYear = pay.date.getFullYear();
      const billingMonth = pay.date.getMonth() + 1;
      const coveragePeriodLabel = `${monthNamesEn[billingMonth - 1]} ${billingYear}`;

      if (!payDoc) {
        await PaymentModel.create({
          receiptNumber: pay.rct,
          schoolId: school._id,
          branchId: pay.branch._id,
          academicYearId: academicYear._id,
          studentId: stu._id,
          tuitionFeeId: pay.fee._id,
          amountDue: pay.due,
          discountAmount: pay.disc,
          amountPaid: pay.paid,
          balanceRemaining: pay.bal,
          currency: pay.curr,
          paymentMethod: pay.method,
          paymentDate: pay.date,
          dueDate: pay.date,
          billingYear,
          billingMonth,
          coveragePeriodLabel,
          paymentType: 'tuition_monthly',
          status: pay.status,
        });
        logger.info(`Seeded payment: ${pay.rct} (${pay.curr} ${pay.paid} - ${pay.status})`);
      } else {
        await PaymentModel.updateOne(
          { _id: payDoc._id },
          {
            $set: {
              dueDate: pay.date,
              billingYear,
              billingMonth,
              coveragePeriodLabel,
              paymentType: 'tuition_monthly',
            },
          },
        );
      }
    }
  }
  logger.info('Seeded 76 payments across all 12 calendar months in 2026');

  // 23. Student Internal Transfer
  const trf = await StudentTransferModel.findOne({
    transferNumber: 'TRF-2026001',
    isDeleted: false,
  });
  if (!trf && seededStudents['STU-000005']) {
    await StudentTransferModel.create({
      transferNumber: 'TRF-2026001',
      studentId: seededStudents['STU-000005']._id,
      fromSchoolId: school._id,
      toSchoolId: school._id,
      fromBranchId: mainBranch._id,
      toBranchId: toulKorkBranch._id,
      transferDate: new Date('2026-08-28'),
      reason: 'Family relocated residence closer to Toul Kork campus',
      status: 'approved',
      approvalDate: new Date('2026-08-29'),
    });
    logger.info('Seeded student transfer: TRF-2026001');
  }

  // 24. Official Documents (16 Documents with SHA-256 Signatures)
  const officialDocsToSeed = [
    {
      num: 'RPT-2026000001',
      type: 'report_card' as const,
      stId: 'STU-000001',
      branch: mainBranch,
      payload: {
        school: { nameEn: 'SNP International School', nameKh: 'សាលាអន្តរជាតិ អេសអិនភី' },
        branch: { code: 'MB-01', nameEn: 'Main Branch' },
        student: { studentId: 'STU-000001', name: 'Sothea Chan', khmerName: 'ចាន់ សុធា' },
        summary: {
          total: 94,
          average: 94,
          gpa: 4.0,
          grade: 'A',
          result: 'PASSED',
          promotion: 'PROMOTED',
        },
        subjects: [
          { code: 'ENG-GRAM', name: 'English Grammar', average: 95, grade: 'A', passed: true },
          { code: 'ENG-READ', name: 'Reading & Vocabulary', average: 93, grade: 'A', passed: true },
        ],
      },
    },
    {
      num: 'TRN-2026000001',
      type: 'transcript' as const,
      stId: 'STU-000001',
      branch: mainBranch,
      payload: {
        school: { nameEn: 'SNP International School', nameKh: 'សាលាអន្តរជាតិ អេសអិនភី' },
        branch: { code: 'MB-01', nameEn: 'Main Branch' },
        student: {
          studentId: 'STU-000001',
          name: 'Sothea Chan',
          khmerName: 'ចាន់ សុធា',
          gender: 'male',
        },
        summary: { totalCreditsCompleted: 12, cumulativeGpa: 4.0 },
      },
    },
    {
      num: 'RCT-2026000001',
      type: 'payment_receipt' as const,
      stId: 'STU-000001',
      branch: mainBranch,
      payload: {
        school: { nameEn: 'SNP International School', nameKh: 'សាលាអន្តរជាតិ អេសអិនភី' },
        branch: { code: 'MB-01', nameEn: 'Main Branch' },
        student: { studentId: 'STU-000001', name: 'Sothea Chan' },
        finance: { receiptNumber: 'PAY-20260001', amountPaid: 60, currency: 'USD', status: 'paid' },
      },
    },
    {
      num: 'INV-2026000001',
      type: 'invoice' as const,
      stId: 'STU-000003',
      branch: mainBranch,
      payload: {
        school: { nameEn: 'SNP International School', nameKh: 'សាលាអន្តរជាតិ អេសអិនភី' },
        branch: { code: 'MB-01', nameEn: 'Main Branch' },
        student: { studentId: 'STU-000003', name: 'Rattanak Keo' },
        finance: {
          invoiceNumber: 'INV-20260001',
          amountDue: 50,
          paid: 30,
          balance: 20,
          currency: 'USD',
        },
      },
    },
    {
      num: 'RPT-2026000002',
      type: 'report_card' as const,
      stId: 'STU-000036',
      branch: toulKorkBranch,
      payload: {
        school: { nameEn: 'SNP International School', nameKh: 'សាលាអន្តរជាតិ អេសអិនភី' },
        branch: { code: 'TK-02', nameEn: 'Toul Kork Branch' },
        student: { studentId: 'STU-000036', name: 'Dany San', khmerName: 'សាន ដានី' },
        summary: {
          total: 91,
          average: 91,
          gpa: 4.0,
          grade: 'A',
          result: 'PASSED',
          promotion: 'PROMOTED',
        },
      },
    },
    {
      num: 'RCT-2026000002',
      type: 'payment_receipt' as const,
      stId: 'STU-000036',
      branch: toulKorkBranch,
      payload: {
        school: { nameEn: 'SNP International School', nameKh: 'សាលាអន្តរជាតិ អេសអិនភី' },
        branch: { code: 'TK-02', nameEn: 'Toul Kork Branch' },
        student: { studentId: 'STU-000036', name: 'Dany San' },
        finance: { receiptNumber: 'PAY-20260004', amountPaid: 60, currency: 'USD', status: 'paid' },
      },
    },
  ];

  for (const od of officialDocsToSeed) {
    const stu = seededStudents[od.stId];
    if (stu) {
      const exists = await OfficialDocumentModel.findOne({
        documentNumber: od.num,
        isDeleted: false,
      });
      if (!exists) {
        const hash = createHash('sha256').update(JSON.stringify(od.payload)).digest('hex');
        await OfficialDocumentModel.create({
          documentNumber: od.num,
          type: od.type,
          schoolId: school._id,
          branchId: od.branch._id,
          academicYearId: academicYear._id,
          academicPeriodId: seededPeriods['TERM-1-2026']?._id,
          studentId: stu._id,
          sourceId: stu._id,
          payload: od.payload,
          contentHash: hash,
          generatedBy: env.SUPER_ADMIN_USERNAME,
          generatedAt: new Date(),
          status: 'active',
        });
        logger.info(`Seeded official document: ${od.num} (${od.type})`);
      }
    }
  }

  // 25. Core Roles (13 Canonical Roles)
  for (const r of DEFAULT_CORE_ROLES) {
    let role = await RoleModel.findOne({ code: r.code });
    if (!role) {
      role = await RoleModel.create({
        code: r.code,
        nameEn: r.nameEn,
        nameKh: r.nameKh,
        description: r.description,
        permissions: r.permissions,
        isSystem: r.isSystem,
        status: 'active',
      });
      logger.info(`Seeded role: ${r.code}`);
    } else {
      role.permissions = r.permissions;
      role.nameEn = r.nameEn;
      role.nameKh = r.nameKh;
      role.description = r.description;
      role.isSystem = true;
      role.status = 'active';
      role.isDeleted = false;
      role.deletedAt = undefined;
      await role.save();
    }
  }

  // 26. Canonical User Accounts for All Roles
  type SeedUser = {
    username: string;
    email: string;
    password: string;
    roles: string[];
    branchAccess: 'all' | string[];
    departmentAccess?: string[];
  };

  const usersToSeed: SeedUser[] = [
    {
      username: env.SUPER_ADMIN_USERNAME,
      email: env.SUPER_ADMIN_EMAIL,
      password: env.SUPER_ADMIN_PASSWORD,
      roles: ['super_admin'],
      branchAccess: 'all' as const,
    },
    {
      username: 'director.sok',
      email: 'director.sok@snp.edu.kh',
      password: devSeedPassword,
      roles: ['director'],
      branchAccess: 'all' as const,
    },
    {
      username: 'manager.mb',
      email: 'manager.mb@snp.edu.kh',
      password: devSeedPassword,
      roles: ['branch_manager'],
      branchAccess: [mainBranch._id.toString()],
    },
    {
      username: 'manager.tk',
      email: 'manager.tk@snp.edu.kh',
      password: devSeedPassword,
      roles: ['branch_manager'],
      branchAccess: [toulKorkBranch._id.toString()],
    },
    {
      username: 'manager.ss',
      email: 'manager.ss@snp.edu.kh',
      password: devSeedPassword,
      roles: ['branch_manager'],
      branchAccess: [senSokBranch._id.toString()],
    },
    {
      username: 'academic.officer',
      email: 'academic.officer@snp.edu.kh',
      password: devSeedPassword,
      roles: ['academic_officer'],
      branchAccess: [mainBranch._id.toString()],
    },
    {
      username: 'teacher.dara',
      email: 'teacher.dara@snp.edu.kh',
      password: devSeedPassword,
      roles: ['teacher'],
      branchAccess: [mainBranch._id.toString()],
    },
    {
      username: 'teacher.tk',
      email: 'teacher.tk@snp.edu.kh',
      password: devSeedPassword,
      roles: ['teacher'],
      branchAccess: [toulKorkBranch._id.toString()],
    },
    {
      username: 'teacher.ss',
      email: 'teacher.ss@snp.edu.kh',
      password: devSeedPassword,
      roles: ['teacher'],
      branchAccess: [senSokBranch._id.toString()],
    },
    {
      username: 'finance.mb',
      email: 'finance.mb@snp.edu.kh',
      password: devSeedPassword,
      roles: ['finance_officer'],
      branchAccess: [mainBranch._id.toString()],
    },
    {
      username: 'finance.tk',
      email: 'finance.tk@snp.edu.kh',
      password: devSeedPassword,
      roles: ['finance_officer'],
      branchAccess: [toulKorkBranch._id.toString()],
    },
    {
      username: 'finance.ss',
      email: 'finance.ss@snp.edu.kh',
      password: devSeedPassword,
      roles: ['finance_officer'],
      branchAccess: [senSokBranch._id.toString()],
    },
    {
      username: 'admin.registrar',
      email: 'admin.registrar@snp.edu.kh',
      password: devSeedPassword,
      roles: ['administrator'],
      branchAccess: [mainBranch._id.toString()],
    },
    {
      username: 'hr.officer',
      email: 'hr.officer@snp.edu.kh',
      password: devSeedPassword,
      roles: ['hr_officer'],
      branchAccess: [mainBranch._id.toString()],
    },
    {
      username: 'student.affairs',
      email: 'student.affairs@snp.edu.kh',
      password: devSeedPassword,
      roles: ['student_affairs_officer'],
      branchAccess: [mainBranch._id.toString()],
    },
    {
      username: 'librarian',
      email: 'librarian@snp.edu.kh',
      password: devSeedPassword,
      roles: ['librarian'],
      branchAccess: [mainBranch._id.toString()],
    },
    {
      username: 'inventory.officer',
      email: 'inventory.officer@snp.edu.kh',
      password: devSeedPassword,
      roles: ['inventory_officer'],
      branchAccess: [mainBranch._id.toString()],
    },
    {
      username: 'department.head',
      email: 'department.head@snp.edu.kh',
      password: devSeedPassword,
      roles: ['department_head'],
      branchAccess: [mainBranch._id.toString()],
      departmentAccess: [seededDepts['MB-01_ACA']._id.toString()],
    },
    {
      username: 'staff.user',
      email: 'staff.user@snp.edu.kh',
      password: devSeedPassword,
      roles: ['staff'],
      branchAccess: [mainBranch._id.toString()],
    },
  ];

  const seededRoleCodes = new Set(usersToSeed.flatMap((user) => user.roles));
  const missingRoleCodes = DEFAULT_CORE_ROLES.map((role) => role.code).filter(
    (roleCode) => !seededRoleCodes.has(roleCode),
  );
  if (missingRoleCodes.length > 0) {
    throw new Error(`Seed user coverage is incomplete for roles: ${missingRoleCodes.join(', ')}`);
  }

  for (const u of usersToSeed) {
    const matchingEmployee = Object.values(seededEmployees).find(
      (employee) => employee.email === u.email,
    );
    let userDoc = await UserModel.findOne({
      $or: [{ username: u.username }, { email: u.email }],
    }).select('+passwordHash');

    if (!userDoc) {
      const pHash = await PasswordUtil.hash(u.password);
      userDoc = await UserModel.create({
        schoolId: school._id,
        username: u.username,
        email: u.email,
        passwordHash: pHash,
        employeeId: matchingEmployee?._id,
        roles: u.roles,
        branchAccess: u.branchAccess,
        departmentAccess: u.departmentAccess,
        status: 'active',
        mustChangePassword: false,
      });
      logger.info(`Seeded user: ${u.username} (${u.roles.join(', ')})`);
    } else {
      userDoc.passwordHash = await PasswordUtil.hash(u.password);
      userDoc.status = 'active';
      userDoc.employeeId = matchingEmployee?._id;
      userDoc.roles = u.roles;
      userDoc.branchAccess = u.branchAccess;
      userDoc.departmentAccess = u.departmentAccess;
      await userDoc.save();
    }
  }

  // 27. Skills & Competencies Catalog
  const defaultSkills: Array<{
    code: string;
    name: string;
    category:
      | 'pedagogy'
      | 'technical'
      | 'leadership'
      | 'administration'
      | 'communication'
      | 'language'
      | 'domain'
      | 'general';
    description: string;
  }> = [
    {
      code: 'SKILL-PED-001',
      name: 'Teaching Methodology & Lesson Delivery',
      category: 'pedagogy',
      description: 'Curriculum delivery, student engagement',
    },
    {
      code: 'SKILL-PED-002',
      name: 'Classroom Management & Behavior Guidance',
      category: 'pedagogy',
      description: 'Positive learning environments',
    },
    {
      code: 'SKILL-PED-003',
      name: 'Student Assessment & Evaluation Design',
      category: 'pedagogy',
      description: 'Quiz, midterm exam design',
    },
    {
      code: 'SKILL-COM-001',
      name: 'Professional & Parent Communication',
      category: 'communication',
      description: 'Parent conferences and notices',
    },
    {
      code: 'SKILL-TECH-001',
      name: 'Educational Software & Computer Skills',
      category: 'technical',
      description: 'Digital platforms, LMS, gradebook',
    },
    {
      code: 'SKILL-FIN-001',
      name: 'Financial Accounting & Billing Operations',
      category: 'domain',
      description: 'Tuition fees, billing, cashier ledger',
    },
  ];

  for (const s of defaultSkills) {
    const skillDoc = await SkillModel.findOne({ code: s.code, isDeleted: false });
    if (!skillDoc) {
      await SkillModel.create({
        code: s.code,
        name: s.name,
        category: s.category,
        description: s.description,
        isActive: true,
        schoolId: school._id,
      });
      logger.info(`Seeded skill: ${s.name}`);
    }
  }

  // 28. Campus Announcements
  const announcementsData = [
    {
      title: 'Welcome to Academic Year 2026-2027',
      content:
        'Welcome all students and faculty to the new academic year. Orientation begins August 1st across all campus branches.',
      category: 'general' as const,
      audience: 'all' as const,
      isPinned: true,
      isPublished: true,
    },
    {
      title: 'Parent-Teacher Conference Schedule',
      content:
        'The first Term parent-teacher progress review conferences will take place on Saturday, October 15th.',
      category: 'academic' as const,
      audience: 'parents' as const,
      isPinned: false,
      isPublished: true,
    },
    {
      title: 'Tuition Fee Payment Due Date Notice',
      content:
        'Monthly tuition payments for Term 1 are due by the 5th of each calendar month. Payments can be completed via ABA Pay or at cashier desks.',
      category: 'finance' as const,
      audience: 'parents' as const,
      isPinned: false,
      isPublished: true,
    },
    {
      title: 'Water Festival Holiday Campus Closure',
      content:
        'All branches will be closed from November 25 to 27 for the official Cambodian Water Festival.',
      category: 'event' as const,
      audience: 'all' as const,
      isPinned: true,
      isPublished: true,
    },
  ];

  for (const ann of announcementsData) {
    const annDoc = await AnnouncementModel.findOne({ title: ann.title, isDeleted: false });
    if (!annDoc) {
      await AnnouncementModel.create({
        schoolId: school._id,
        branchId: mainBranch._id,
        title: ann.title,
        content: ann.content,
        category: ann.category,
        audience: ann.audience,
        isPublished: ann.isPublished,
        isPinned: ann.isPinned,
        publishedAt: new Date(),
        createdBy: env.SUPER_ADMIN_USERNAME,
      });
      logger.info(`Seeded announcement: ${ann.title}`);
    }
  }

  // 29. Multi-Channel Notifications
  const notificationsData = [
    {
      channel: 'in_app' as const,
      type: 'announcement' as const,
      recipientType: 'broadcast' as const,
      title: 'Term 1 Commenced',
      body: 'Classes are in session across all branches.',
    },
    {
      channel: 'telegram' as const,
      type: 'tuition_reminder' as const,
      recipientType: 'guardian' as const,
      title: 'Monthly Tuition Reminder',
      body: 'Your tuition invoice for the upcoming month is ready.',
    },
    {
      channel: 'sms' as const,
      type: 'absence_alert' as const,
      recipientType: 'guardian' as const,
      title: 'Attendance Alert',
      body: 'Your child was marked absent today. Please contact front desk.',
    },
    {
      channel: 'in_app' as const,
      type: 'payment_receipt' as const,
      recipientType: 'guardian' as const,
      title: 'Payment Receipt Issued',
      body: 'Your tuition receipt PAY-20260001 has been processed.',
    },
  ];

  for (const notif of notificationsData) {
    await NotificationModel.create({
      schoolId: school._id,
      branchId: mainBranch._id,
      channel: notif.channel,
      type: notif.type,
      recipientType: notif.recipientType,
      title: notif.title,
      body: notif.body,
      status: 'sent',
      sentAt: new Date(),
    });
  }
  logger.info('Seeded sample system notifications');

  // 30. Dynamic System Settings (Central School & Branch Overrides)
  const defaultSettings: Array<{
    key: string;
    value: unknown;
    type: 'string' | 'number' | 'boolean' | 'json';
    category:
      | 'general'
      | 'academic'
      | 'finance'
      | 'student'
      | 'employee'
      | 'security'
      | 'notification'
      | 'document'
      | 'sequence';
    description: string;
    isEditable: boolean;
    branchId?: mongoose.Types.ObjectId;
  }> = [
    // General & School Identity
    {
      key: 'SCHOOL_NAME_EN',
      value: 'SNP International School',
      type: 'string',
      category: 'general',
      description: 'Primary institutional brand name in English',
      isEditable: true,
    },
    {
      key: 'SCHOOL_NAME_KH',
      value: 'សាលាអន្តរជាតិ អេស អិន ភី',
      type: 'string',
      category: 'general',
      description: 'Ministry-registered official school name in Khmer',
      isEditable: true,
    },
    {
      key: 'SCHOOL_CODE',
      value: 'SNP',
      type: 'string',
      category: 'general',
      description: 'Institutional unique identifier',
      isEditable: false,
    },
    {
      key: 'SCHOOL_EMAIL',
      value: 'contact@snp.edu.kh',
      type: 'string',
      category: 'general',
      description: 'Administrative email address printed on invoices and notices',
      isEditable: true,
    },
    {
      key: 'SCHOOL_PHONE',
      value: '+855 23 888 999',
      type: 'string',
      category: 'general',
      description: 'Central campus reception hotline phone number',
      isEditable: true,
    },
    {
      key: 'SCHOOL_ADDRESS',
      value: 'Phnom Penh, Cambodia',
      type: 'string',
      category: 'general',
      description: 'Physical headquarters address printed on official headers',
      isEditable: true,
    },
    {
      key: 'SYSTEM_TIMEZONE',
      value: 'Asia/Phnom_Penh',
      type: 'string',
      category: 'general',
      description: 'Default timezone for audit timestamping and session scheduling',
      isEditable: true,
    },

    // Academic Policies
    {
      key: 'ACADEMIC_CURRENT_YEAR',
      value: 'AY-2026-2027',
      type: 'string',
      category: 'academic',
      description: 'Current active academic year',
      isEditable: true,
    },
    {
      key: 'MINIMUM_PASSING_SCORE',
      value: 50,
      type: 'number',
      category: 'academic',
      description: 'Threshold score percentage required for course completion and promotion',
      isEditable: true,
    },
    {
      key: 'MINIMUM_ATTENDANCE_PERCENT',
      value: 80,
      type: 'number',
      category: 'academic',
      description: 'Minimum attended session percentage required to sit for final exams',
      isEditable: true,
    },
    {
      key: 'GPA_SCALE',
      value: 4.0,
      type: 'number',
      category: 'academic',
      description: 'Institutional grade point average maximum denominator',
      isEditable: true,
    },
    {
      key: 'TERMS_PER_YEAR',
      value: 2,
      type: 'number',
      category: 'academic',
      description: 'Standard number of terms or semesters dividing an academic year',
      isEditable: true,
    },
    {
      key: 'CLASS_DEFAULT_CAPACITY',
      value: 30,
      type: 'number',
      category: 'academic',
      description: 'Default maximum enrollment quota when creating new class sections',
      isEditable: true,
    },

    // Finance & Billing
    {
      key: 'DEFAULT_CURRENCY',
      value: 'USD',
      type: 'string',
      category: 'finance',
      description: 'Default billing and ledger currency',
      isEditable: true,
    },
    {
      key: 'EXCHANGE_RATE_USD_KHR',
      value: 4100,
      type: 'number',
      category: 'finance',
      description: 'Official accounting exchange rate from 1 USD to KHR',
      isEditable: true,
    },
    {
      key: 'PAYMENT_GRACE_PERIOD_DAYS',
      value: 15,
      type: 'number',
      category: 'finance',
      description: 'Calendar days after invoice due date before accounts flag as delinquent',
      isEditable: true,
    },
    {
      key: 'LATE_PAYMENT_FEE_PERCENT',
      value: 5,
      type: 'number',
      category: 'finance',
      description: 'Percentage fee penalty applied to overdue balances past grace period',
      isEditable: true,
    },

    // Security & Authentication
    {
      key: 'SESSION_TIMEOUT_MINUTES',
      value: 15,
      type: 'number',
      category: 'security',
      description: 'Active access token duration before silent rotation or re-authentication',
      isEditable: true,
    },
    {
      key: 'MAX_LOGIN_ATTEMPTS',
      value: 5,
      type: 'number',
      category: 'security',
      description: 'Number of consecutive invalid credential attempts before protective lock',
      isEditable: true,
    },
    {
      key: 'ACCOUNT_LOCKOUT_MINUTES',
      value: 30,
      type: 'number',
      category: 'security',
      description: 'Cool-down duration before an auto-locked account may re-attempt login',
      isEditable: true,
    },
    {
      key: 'PASSWORD_REQUIRE_SPECIAL_CHAR',
      value: true,
      type: 'boolean',
      category: 'security',
      description: 'Require passwords to contain symbols and special characters',
      isEditable: true,
    },

    // Notification Channels
    {
      key: 'NOTIFICATION_TELEGRAM_ENABLED',
      value: true,
      type: 'boolean',
      category: 'notification',
      description: 'Dispatch operational alerts to school Telegram bot channel',
      isEditable: true,
    },
    {
      key: 'TELEGRAM_CHANNEL_ID',
      value: '@snp_school_notifications',
      type: 'string',
      category: 'notification',
      description: 'Target public channel username or private chat group ID',
      isEditable: true,
    },
    {
      key: 'NOTIFICATION_SMS_ENABLED',
      value: false,
      type: 'boolean',
      category: 'notification',
      description: 'Enable automated SMS dispatch for urgent guardian attendance alerts',
      isEditable: true,
    },
    {
      key: 'PAYMENT_REMINDER_DAYS_BEFORE',
      value: 3,
      type: 'number',
      category: 'notification',
      description: 'Days before tuition invoice due date when reminder alerts are dispatched',
      isEditable: true,
    },

    // Sample Branch Overrides
    {
      key: 'SCHOOL_PHONE',
      value: '+855 23 888 111',
      type: 'string',
      category: 'general',
      description: 'Toul Kork Campus reception phone number override',
      isEditable: true,
      branchId: toulKorkBranch._id,
    },
    {
      key: 'CLASS_DEFAULT_CAPACITY',
      value: 25,
      type: 'number',
      category: 'academic',
      description: 'Toul Kork Campus maximum class capacity limit',
      isEditable: true,
      branchId: toulKorkBranch._id,
    },
    {
      key: 'SCHOOL_PHONE',
      value: '+855 23 888 222',
      type: 'string',
      category: 'general',
      description: 'Sen Sok Campus reception phone number override',
      isEditable: true,
      branchId: senSokBranch._id,
    },
    {
      key: 'CLASS_DEFAULT_CAPACITY',
      value: 28,
      type: 'number',
      category: 'academic',
      description: 'Sen Sok Campus maximum class capacity limit',
      isEditable: true,
      branchId: senSokBranch._id,
    },
  ];

  for (const s of defaultSettings) {
    const setting = await SystemSettingModel.findOne({
      schoolId: school._id,
      key: s.key.toUpperCase(),
      branchId: s.branchId ?? null,
      isDeleted: false,
    });
    if (!setting) {
      await SystemSettingModel.create({
        schoolId: school._id,
        branchId: s.branchId,
        key: s.key.toUpperCase(),
        value: s.value,
        type: s.type,
        category: s.category,
        description: s.description,
        isEditable: s.isEditable,
        auditHistory: [
          { oldValue: undefined, newValue: s.value, updatedBy: 'seed', timestamp: new Date() },
        ],
      });
      logger.info(
        `Seeded system setting: ${s.key.toUpperCase()}${s.branchId ? ' (branch override)' : ''}`,
      );
    }
  }

  logger.info(
    'Database seeding completed successfully with 80 students, 18 classes, 20 employees, full 12-month attendance & scores, 76 payments, and official documents!',
  );
};

if (require.main === module) {
  const clearFirst = process.argv.includes('--clean') || process.argv.includes('--clear');
  seedDatabase({ clearFirst })
    .then(async () => {
      await disconnectFromDatabase();
      process.exit(0);
    })
    .catch(async (error) => {
      logger.error({ error }, 'Seed failed');
      await disconnectFromDatabase();
      process.exit(1);
    });
}
