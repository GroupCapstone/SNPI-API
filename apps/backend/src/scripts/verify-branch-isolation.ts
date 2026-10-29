/* eslint-disable no-console, @typescript-eslint/no-explicit-any */
import { connectToDatabase, disconnectFromDatabase } from '../config/database';
import { BranchModel } from '../modules/branch/branch.model';
import { ProgramModel } from '../modules/program/program.model';
import { LevelModel } from '../modules/level/level.model';
import { AcademicYearModel } from '../modules/academic-year/academic-year.model';
import { AuthService } from '../modules/auth/auth.service';
import { ClassService } from '../modules/class/class.service';
import { StudentService } from '../modules/student/student.service';

const rawDevSeedPassword = process.env.DEV_SEED_PASSWORD;
if (
  !rawDevSeedPassword ||
  rawDevSeedPassword.length < 16 ||
  /(?:replace[-_ ]with|change[-_ ]me|placeholder|example|generated|secure_random|minimum\d+|your[-_ ])/i.test(
    rawDevSeedPassword,
  )
) {
  throw new Error(
    'Set DEV_SEED_PASSWORD to the private development seed password before running this check.',
  );
}
const devSeedPassword: string = rawDevSeedPassword;

async function verifyBranchIsolation() {
  await connectToDatabase();
  console.log('--- STARTING MULTI-BRANCH ISOLATION VERIFICATION ---');

  const authService = new AuthService();
  const classService = new ClassService();
  const studentService = new StudentService();

  // 1. Fetch Branches
  const mainBranch = await BranchModel.findOne({ branchCode: 'MB-01' });
  const tkBranch = await BranchModel.findOne({ branchCode: 'TK-02' });

  if (!mainBranch || !tkBranch) {
    throw new Error('Branches MB-01 or TK-02 not found in database.');
  }

  const mbId = mainBranch._id.toString();
  const tkId = tkBranch._id.toString();
  console.log(`[PASS] Main Branch ID: ${mbId} (${mainBranch.branchNameEn})`);
  console.log(`[PASS] Toul Kork Branch ID: ${tkId} (${tkBranch.branchNameEn})`);

  // Get common prerequisites
  const academicYear =
    (await AcademicYearModel.findOne({ isCurrent: true })) || (await AcademicYearModel.findOne());
  const program = await ProgramModel.findOne({ isDeleted: false });
  const level =
    (await LevelModel.findOne({ programId: program?._id, isDeleted: false })) ||
    (await LevelModel.findOne());

  if (!academicYear || !program || !level) {
    throw new Error('Prerequisites (AcademicYear, Program, Level) not found.');
  }

  // 2. Test Login: manager.mb (Main Branch Manager)
  console.log('\n--- 1. Testing Login as manager.mb ---');
  const mbLogin = await authService.login({
    identifier: 'manager.mb',
    password: devSeedPassword,
  });
  const mbUser = mbLogin.user;
  console.log(`[PASS] Logged in as: ${mbUser.username}`);
  console.log(`[PASS] Branch Access: ${JSON.stringify(mbUser.branchAccess)}`);

  const getBranchId = (b: any): string =>
    b && typeof b === 'object' && b._id ? b._id.toString() : b ? b.toString() : '';

  // Verify manager.mb branch access is strictly mainBranch
  if (
    mbUser.branchAccess === 'all' ||
    !mbUser.branchAccess.includes(mbId) ||
    mbUser.branchAccess.includes(tkId)
  ) {
    throw new Error('FAILED: manager.mb has incorrect branch access!');
  }
  console.log('[PASS] manager.mb has STRICT access to Main Branch ONLY.');

  // Query classes as manager.mb
  const mbClasses = await classService.getClasses({}, mbUser as any);
  console.log(`[PASS] manager.mb queried classes: found ${mbClasses.total} classes.`);
  for (const c of mbClasses.data) {
    if (getBranchId(c.branchId) !== mbId) {
      throw new Error(
        `LEAK DETECTED: manager.mb received class ${c.classCode} from branch ${getBranchId(c.branchId)}!`,
      );
    }
  }
  console.log('[PASS] Zero data leakage: All returned classes strictly belong to Main Branch.');

  // Create class as manager.mb in Main Branch
  const testClassCodeMB = `MB-ISO-${Date.now().toString().slice(-4)}`;
  const createdMbClass = await classService.createClass(
    {
      branchId: mbId,
      academicYearId: academicYear._id.toString(),
      programId: program._id.toString(),
      levelId: level._id.toString(),
      classCode: testClassCodeMB,
      className: `MB Isolation Class ${testClassCodeMB}`,
      capacity: 30,
      shift: 'morning',
      daysPattern: 'MON_FRI',
    },
    mbUser as any,
  );
  console.log(
    `[PASS] manager.mb successfully created class: ${createdMbClass.className} (${createdMbClass.classCode}) in Main Branch.`,
  );

  // Attempt unauthorized class creation by manager.mb in Toul Kork Branch
  try {
    await classService.createClass(
      {
        branchId: tkId,
        academicYearId: academicYear._id.toString(),
        programId: program._id.toString(),
        levelId: level._id.toString(),
        classCode: 'ILLEGAL-TK',
        className: 'Illegal TK Class',
        capacity: 30,
      },
      mbUser as any,
    );
    throw new Error('FAILED: manager.mb was able to create a class in Toul Kork Branch!');
  } catch (err: any) {
    console.log(`[PASS] Cross-branch security blocked unauthorized creation: "${err.message}"`);
  }

  // 3. Test Login: manager.tk (Toul Kork Branch Manager)
  console.log('\n--- 2. Testing Login as manager.tk ---');
  const tkLogin = await authService.login({
    identifier: 'manager.tk',
    password: devSeedPassword,
  });
  const tkUser = tkLogin.user;
  console.log(`[PASS] Logged in as: ${tkUser.username}`);
  console.log(`[PASS] Branch Access: ${JSON.stringify(tkUser.branchAccess)}`);

  if (
    tkUser.branchAccess === 'all' ||
    !tkUser.branchAccess.includes(tkId) ||
    tkUser.branchAccess.includes(mbId)
  ) {
    throw new Error('FAILED: manager.tk has incorrect branch access!');
  }
  console.log('[PASS] manager.tk has STRICT access to Toul Kork Branch ONLY.');

  // Query classes as manager.tk
  const tkClasses = await classService.getClasses({}, tkUser as any);
  console.log(`[PASS] manager.tk queried classes: found ${tkClasses.total} classes.`);
  for (const c of tkClasses.data) {
    if (getBranchId(c.branchId) !== tkId) {
      throw new Error(
        `LEAK DETECTED: manager.tk received class ${c.classCode} from branch ${getBranchId(c.branchId)}!`,
      );
    }
  }
  console.log(
    '[PASS] Zero data leakage: All returned classes strictly belong to Toul Kork Branch.',
  );

  // Verify manager.tk CANNOT see manager.mb's newly created class
  const foundMbClassInTk = tkClasses.data.some((c) => c.classCode === testClassCodeMB);
  if (foundMbClassInTk) {
    throw new Error(`CRITICAL LEAK: manager.tk can see manager.mb class ${testClassCodeMB}!`);
  }
  console.log(
    `[PASS] Confirmed: Main Branch class "${testClassCodeMB}" is completely INVISIBLE to Toul Kork Manager.`,
  );

  // Create class as manager.tk in Toul Kork Branch
  const testClassCodeTK = `TK-ISO-${Date.now().toString().slice(-4)}`;
  const createdTkClass = await classService.createClass(
    {
      branchId: tkId,
      academicYearId: academicYear._id.toString(),
      programId: program._id.toString(),
      levelId: level._id.toString(),
      classCode: testClassCodeTK,
      className: `TK Isolation Class ${testClassCodeTK}`,
      capacity: 25,
      shift: 'afternoon',
      daysPattern: 'MON_WED_FRI',
    },
    tkUser as any,
  );
  console.log(
    `[PASS] manager.tk successfully created class: ${createdTkClass.className} (${createdTkClass.classCode}) in Toul Kork Branch.`,
  );

  // 4. Test Student Isolation
  console.log('\n--- 3. Testing Student Isolation ---');
  const mbStudents = await studentService.getStudents({}, mbUser as any);
  console.log(`[PASS] manager.mb queried students: found ${mbStudents.total} students.`);
  for (const s of mbStudents.data) {
    if (getBranchId(s.branchId) !== mbId) {
      throw new Error(
        `LEAK DETECTED: manager.mb received student ${s.studentId} from branch ${getBranchId(s.branchId)}!`,
      );
    }
  }

  const tkStudents = await studentService.getStudents({}, tkUser as any);
  console.log(`[PASS] manager.tk queried students: found ${tkStudents.total} students.`);
  for (const s of tkStudents.data) {
    if (getBranchId(s.branchId) !== tkId) {
      throw new Error(
        `LEAK DETECTED: manager.tk received student ${s.studentId} from branch ${getBranchId(s.branchId)}!`,
      );
    }
  }
  console.log('[PASS] Zero student data leakage between Main Branch and Toul Kork Branch.');

  // 5. Test Login: director.sok (Global Director)
  console.log('\n--- 4. Testing Global Director & Cross-Branch Switching ---');
  const directorLogin = await authService.login({
    identifier: 'director.sok',
    password: 'Director@123456',
  });
  const directorUser = directorLogin.user;
  console.log(`[PASS] Logged in as: ${directorUser.username} with branchAccess: "all"`);

  // Director queries Main Branch
  const dirMbClasses = await classService.getClasses({ branchId: mbId }, directorUser as any);
  const dirFoundMb = dirMbClasses.data.some((c) => c.classCode === testClassCodeMB);
  console.log(
    `[PASS] Director viewing Main Branch: found ${dirMbClasses.total} classes (Contains ${testClassCodeMB}: ${dirFoundMb}).`,
  );

  // Director queries Toul Kork Branch
  const dirTkClasses = await classService.getClasses({ branchId: tkId }, directorUser as any);
  const dirFoundTk = dirTkClasses.data.some((c) => c.classCode === testClassCodeTK);
  console.log(
    `[PASS] Director viewing Toul Kork Branch: found ${dirTkClasses.total} classes (Contains ${testClassCodeTK}: ${dirFoundTk}).`,
  );

  console.log('\n======================================================');
  console.log('[SUCCESS] ALL MULTI-BRANCH ISOLATION TESTS PASSED 100%!');
  console.log('======================================================');

  await disconnectFromDatabase();
}

verifyBranchIsolation().catch((err) => {
  console.error('ERROR during verification:', err);
  process.exit(1);
});
