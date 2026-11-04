import type { Types } from 'mongoose';
import { connectToDatabase, disconnectFromDatabase } from '../config/database';
import { logger } from '../config/logger';
import { SchoolModel } from '../modules/school/school.model';
import { BranchModel } from '../modules/branch/branch.model';
import { AcademicYearModel } from '../modules/academic-year/academic-year.model';
import { AcademicPeriodModel } from '../modules/academic-period/academic-period.model';
import { ProgramModel } from '../modules/program/program.model';
import { LevelModel } from '../modules/level/level.model';
import { ClassModel } from '../modules/class/class.model';
import { SubjectModel } from '../modules/subject/subject.model';
import { EnrollmentModel } from '../modules/enrollment/enrollment.model';
import { TermResultModel } from '../modules/term-result/term-result.model';
import { ClassroomModel } from '../modules/classroom/classroom.model';
import { StudyModeModel } from '../modules/study-mode/study-mode.model';
import { EmployeeModel } from '../modules/employee/employee.model';

export const seedAcademicProgression = async (): Promise<void> => {
  await connectToDatabase();
  logger.info('Starting Academic Progression & Promotion data seeding...');

  const school = await SchoolModel.findOne({ isDeleted: false });
  if (!school) throw new Error('School not found');

  const mainBranch = await BranchModel.findOne({ branchCode: 'MB-01', isDeleted: false });
  const toulKorkBranch = await BranchModel.findOne({ branchCode: 'TK-02', isDeleted: false });
  const senSokBranch = await BranchModel.findOne({ branchCode: 'SS-03', isDeleted: false });
  if (!mainBranch || !toulKorkBranch || !senSokBranch) {
    throw new Error('Branches not found');
  }

  const academicYear = await AcademicYearModel.findOne({
    code: 'AY-2026-2027',
    isDeleted: false,
  });
  if (!academicYear) throw new Error('Academic year AY-2026-2027 not found');

  const term1Period = await AcademicPeriodModel.findOne({
    code: 'TERM-1-2026',
    isDeleted: false,
  });
  const term2Period = await AcademicPeriodModel.findOne({
    code: 'TERM-2-2026',
    isDeleted: false,
  });
  if (!term1Period || !term2Period) throw new Error('Academic periods not found');

  const engProgram = await ProgramModel.findOne({ code: 'GEP', isDeleted: false });
  const comProgram = await ProgramModel.findOne({ code: 'CTP', isDeleted: false });
  const khmProgram = await ProgramModel.findOne({ code: 'KGEP', isDeleted: false });
  if (!engProgram || !comProgram || !khmProgram) throw new Error('Programs not found');

  // Load levels
  const engBeg = await LevelModel.findOne({ code: 'ENG-BEG', isDeleted: false });
  const engElem = await LevelModel.findOne({ code: 'ENG-ELEM', isDeleted: false });
  const engInt = await LevelModel.findOne({ code: 'ENG-INT', isDeleted: false });
  const engAdv = await LevelModel.findOne({ code: 'ENG-ADV', isDeleted: false });

  const comBsc = await LevelModel.findOne({ code: 'COM-BSC', isDeleted: false });
  const comOff = await LevelModel.findOne({ code: 'COM-OFF', isDeleted: false });

  const khmP1 = await LevelModel.findOne({ code: 'KHM-P1', isDeleted: false });
  const khmP2 = await LevelModel.findOne({ code: 'KHM-P2', isDeleted: false });

  if (!engBeg || !engElem || !engInt || !engAdv || !comBsc || !comOff || !khmP1 || !khmP2) {
    throw new Error('Levels not found');
  }

  // Next level mappings
  const nextLevelMap: Record<string, typeof LevelModel.prototype> = {
    'ENG-BEG': engElem,
    'ENG-ELEM': engInt,
    'ENG-INT': engAdv,
    'COM-BSC': comOff,
    'KHM-P1': khmP2,
  };

  // Load subjects
  const engSubjects = await SubjectModel.find({
    category: 'english',
    isDeleted: false,
  });
  const comSubjects = await SubjectModel.find({
    category: 'computer',
    isDeleted: false,
  });
  const khmSubjects = await SubjectModel.find({
    category: 'general',
    isDeleted: false,
  });

  // 1. Process all Term 1 classes
  const term1Classes = await ClassModel.find({
    academicPeriodId: term1Period._id,
    isDeleted: false,
  });

  logger.info(`Found ${term1Classes.length} classes in Term 1 (${term1Period.name})`);

  let createdResultsCount = 0;
  let updatedResultsCount = 0;
  let promotedCount = 0;
  let repeatCount = 0;
  let completedCount = 0;

  for (const cls of term1Classes) {
    const enrollments = await EnrollmentModel.find({
      classId: cls._id,
      isDeleted: false,
    });

    if (enrollments.length === 0) continue;

    // Determine level code
    const currentLevel = await LevelModel.findById(cls.levelId);
    const levelCode = currentLevel?.code || '';
    const nextLevel = nextLevelMap[levelCode];

    // Determine program subjects
    let applicableSubjects = engSubjects;
    if (String(cls.programId) === String(comProgram._id)) {
      applicableSubjects = comSubjects;
    } else if (String(cls.programId) === String(khmProgram._id)) {
      applicableSubjects = khmSubjects;
    }

    for (let i = 0; i < enrollments.length; i++) {
      const enr = enrollments[i]!;

      // Fail condition: ~15% failure rate (e.g., student index % 7 === 0 for realistic distribution)
      const isFail = (i + 1) % 7 === 0;

      const scoreAvg = isFail
        ? Math.floor(38 + (i % 10)) // 38 to 47
        : Math.min(98, Math.floor(74 + ((i * 7) % 24))); // 74 to 98

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
      let assignedNextLevelId: Types.ObjectId | undefined = nextLevel?._id;
      let isCompleted = false;
      let completionDate: Date | undefined = undefined;
      let remarks = 'Successfully completed academic term criteria.';

      if (isFail) {
        resultStatus = 'FAILED';
        promotionStatus = 'REPEAT';
        assignedNextLevelId = currentLevel?._id;
        remarks = 'Did not achieve minimum passing standard; assigned to repeat level.';
        repeatCount++;
      } else if (levelCode === 'COM-OFF' || levelCode === 'ENG-ADV') {
        // Modular/vocational completion
        resultStatus = 'PASSED';
        promotionStatus = 'COMPLETED';
        isCompleted = true;
        completionDate = new Date('2026-11-28');
        assignedNextLevelId = undefined;
        remarks = 'Graduated and completed course curriculum requirements.';
        completedCount++;
      } else {
        resultStatus = 'PASSED';
        promotionStatus = 'PROMOTED';
        promotedCount++;
      }

      // Generate subject results snapshot
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
          subjectId: sub._id,
          code: sub.code,
          name: sub.name,
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

      // Check if term result already exists
      let tr = await TermResultModel.findOne({
        enrollmentId: enr._id,
        isDeleted: false,
      });

      if (!tr) {
        tr = await TermResultModel.create({
          schoolId: school._id,
          branchId: cls.branchId,
          academicYearId: academicYear._id,
          academicPeriodId: term1Period._id,
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
        createdResultsCount++;
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
        updatedResultsCount++;
      }
    }
  }

  logger.info(
    `Term 1 results processed: ${createdResultsCount} created, ${updatedResultsCount} updated, total promoted: ${promotedCount}, repeat: ${repeatCount}, completed: ${completedCount}`,
  );

  // 2. Term 2 Classes & Progression Rollover
  logger.info('Setting up Term 2 classes and next-level progression enrollments...');

  const studyModes = await StudyModeModel.find({ isDeleted: false });
  const ftMode = studyModes.find((m) => m.code === 'FT') || studyModes[0];
  const ptMode = studyModes.find((m) => m.code === 'PT') || studyModes[0];
  const wkMode = studyModes.find((m) => m.code === 'WK') || studyModes[0];

  const rooms = await ClassroomModel.find({ isDeleted: false });
  const mbRoom1 = rooms.find((r) => r.code.includes('RM-101') || r.code === 'RM-101') || rooms[0];
  const mbRoom2 = rooms.find((r) => r.code.includes('RM-102') || r.code === 'RM-102') || rooms[0];
  const tkRoom1 = rooms.find((r) => r.code.includes('RM-201') || r.code === 'RM-201') || rooms[0];
  const ssRoom1 = rooms.find((r) => r.code.includes('RM-301') || r.code === 'RM-301') || rooms[0];

  const teachers = await EmployeeModel.find({ isDeleted: false });
  const mbTeacher1 = teachers.find((t) => t.employeeId === 'EMP-MB-001') || teachers[0];
  const mbTeacher2 = teachers.find((t) => t.employeeId === 'EMP-MB-006') || teachers[0];
  const tkTeacher1 = teachers.find((t) => t.employeeId === 'EMP-TK-001') || teachers[0];
  const ssTeacher1 = teachers.find((t) => t.employeeId === 'EMP-SS-001') || teachers[0];

  const term2ClassesToSeed = [
    {
      code: 'ENG-ELEM-M2-T2',
      name: 'English Elementary Morning B (Term 2)',
      branch: mainBranch,
      program: engProgram,
      level: engElem,
      studyMode: ftMode,
      room: mbRoom1,
      teacher: mbTeacher1,
      capacity: 35,
    },
    {
      code: 'ENG-INT-M2-T2',
      name: 'English Intermediate Morning B (Term 2)',
      branch: mainBranch,
      program: engProgram,
      level: engInt,
      studyMode: ftMode,
      room: mbRoom1,
      teacher: mbTeacher1,
      capacity: 35,
    },
    {
      code: 'COM-OFF-W2-T2',
      name: 'MS Office & Digital Tools Weekend B (Term 2)',
      branch: mainBranch,
      program: comProgram,
      level: comOff,
      studyMode: wkMode,
      room: mbRoom2,
      teacher: mbTeacher2,
      capacity: 30,
    },
    {
      code: 'ENG-ELEM-TK-T2',
      name: 'English Elementary Afternoon B (TK - Term 2)',
      branch: toulKorkBranch,
      program: engProgram,
      level: engElem,
      studyMode: ptMode,
      room: tkRoom1,
      teacher: tkTeacher1,
      capacity: 30,
    },
    {
      code: 'COM-OFF-SS-T2',
      name: 'MS Office & Digital Tools Evening (Sen Sok - Term 2)',
      branch: senSokBranch,
      program: comProgram,
      level: comOff,
      studyMode: ptMode,
      room: ssRoom1,
      teacher: ssTeacher1,
      capacity: 25,
    },
    {
      code: 'ENG-BEG-REP-T2',
      name: 'English Beginner Repeat Morning (Term 2)',
      branch: mainBranch,
      program: engProgram,
      level: engBeg,
      studyMode: ptMode,
      room: mbRoom1,
      teacher: mbTeacher1,
      capacity: 25,
    },
  ];

  const seededTerm2Classes: Record<string, typeof ClassModel.prototype> = {};

  for (const c of term2ClassesToSeed) {
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
      logger.info(`Seeded Term 2 class: ${c.code}`);
    }
    seededTerm2Classes[c.code] = cls;
  }

  // 3. Create Term 2 Enrollments for Promoted & Repeat students
  let nextEnrCounter = 500;
  let term2EnrolledCount = 0;

  const allTerm1Results = await TermResultModel.find({
    academicPeriodId: term1Period._id,
    isDeleted: false,
  });

  for (const tr of allTerm1Results) {
    let targetClass: typeof ClassModel.prototype | undefined = undefined;

    if (tr.promotionStatus === 'PROMOTED') {
      if (String(tr.nextLevelId) === String(engElem._id)) {
        targetClass =
          String(tr.branchId) === String(toulKorkBranch._id)
            ? seededTerm2Classes['ENG-ELEM-TK-T2']
            : seededTerm2Classes['ENG-ELEM-M2-T2'];
      } else if (String(tr.nextLevelId) === String(engInt._id)) {
        targetClass = seededTerm2Classes['ENG-INT-M2-T2'];
      } else if (String(tr.nextLevelId) === String(comOff._id)) {
        targetClass =
          String(tr.branchId) === String(senSokBranch._id)
            ? seededTerm2Classes['COM-OFF-SS-T2']
            : seededTerm2Classes['COM-OFF-W2-T2'];
      }
    } else if (tr.promotionStatus === 'REPEAT') {
      if (String(tr.levelId) === String(engBeg._id)) {
        targetClass = seededTerm2Classes['ENG-BEG-REP-T2'];
      }
    }

    if (!targetClass) continue;

    // Check if already enrolled in Term 2
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

      term2EnrolledCount++;
    }

    // Link TermResult nextEnrollmentId and nextPeriodId
    if (!tr.nextEnrollmentId || !tr.nextPeriodId) {
      tr.nextEnrollmentId = term2Enr._id as Types.ObjectId;
      tr.nextPeriodId = term2Period._id as Types.ObjectId;
      await tr.save();
    }
  }

  logger.info(`Seeded ${term2EnrolledCount} Term 2 progression enrollments.`);
  logger.info('Academic progression and promotion seeding completed successfully!');
};

if (require.main === module) {
  seedAcademicProgression()
    .then(async () => {
      await disconnectFromDatabase();
      process.exit(0);
    })
    .catch(async (error: unknown) => {
      logger.error({ err: error }, 'Academic progression seeding failed');
      await disconnectFromDatabase();
      process.exit(1);
    });
}
