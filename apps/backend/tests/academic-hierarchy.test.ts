import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createApp } from '../src/app';
import { AcademicYearModel } from '../src/modules/academic-year/academic-year.model';
import { BranchModel } from '../src/modules/branch/branch.model';
import { ClassModel } from '../src/modules/class/class.model';
import { EnrollmentModel } from '../src/modules/enrollment/enrollment.model';
import { LevelModel } from '../src/modules/level/level.model';
import { ProgramModel } from '../src/modules/program/program.model';
import { SchoolModel } from '../src/modules/school/school.model';
import { StudentModel } from '../src/modules/student/student.model';

vi.mock('../src/modules/sequence/sequence.service', () => ({
  SequenceService: {
    getNextSequence: vi.fn().mockResolvedValue('ENR-000001'),
  },
}));

vi.mock('../src/modules/school/school.model', () => ({
  SchoolModel: {
    findOne: vi.fn(),
  },
}));

vi.mock('../src/modules/branch/branch.model', () => ({
  BranchModel: {
    findOne: vi.fn(),
  },
}));

vi.mock('../src/modules/academic-year/academic-year.model', () => ({
  AcademicYearModel: {
    findOne: vi.fn(),
  },
}));

vi.mock('../src/modules/program/program.model', () => ({
  ProgramModel: {
    findOne: vi.fn(),
  },
}));

vi.mock('../src/modules/level/level.model', () => ({
  LevelModel: {
    findOne: vi.fn(),
  },
}));

vi.mock('../src/utils/transaction', () => ({
  runInTransaction: vi.fn((cb) => cb(null)),
}));

vi.mock('../src/modules/class/class.model', () => ({
  ClassModel: {
    find: vi.fn().mockReturnValue({
      populate: vi.fn().mockReturnThis(),
      sort: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([]),
    }),
    findOne: vi.fn().mockImplementation(() => ({
      populate: vi.fn().mockReturnThis(),
      sort: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue(null),
    })),
    findOneAndUpdate: vi
      .fn()
      .mockResolvedValue({ _id: '507f1f77bcf86cd799439041', currentEnrollmentCount: 1 }),
    updateOne: vi.fn().mockResolvedValue({ acknowledged: true }),
    create: vi.fn(),
    countDocuments: vi.fn().mockReturnValue({
      exec: vi.fn().mockResolvedValue(0),
    }),
  },
}));

vi.mock('../src/modules/student/student.model', () => ({
  StudentModel: {
    findOne: vi.fn(),
  },
}));

vi.mock('../src/modules/enrollment/enrollment.model', () => ({
  EnrollmentModel: {
    findOne: vi.fn(),
    create: vi.fn(),
    countDocuments: vi.fn().mockReturnValue({
      exec: vi.fn().mockResolvedValue(0),
    }),
  },
}));

describe('Academic Hierarchy & Multi-Program Enrollment Integration', () => {
  const app = createApp();

  const schoolId = '000000000000000000000001';
  const branchId = '507f1f77bcf86cd799439001';
  const academicYearId = '507f1f77bcf86cd799439002';
  const engProgramId = '507f1f77bcf86cd799439011';
  const engLevelId = '507f1f77bcf86cd799439012';
  const comProgramId = '507f1f77bcf86cd799439021';
  const comLevelId = '507f1f77bcf86cd799439022';
  const studentId = '507f1f77bcf86cd799439031';

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(SchoolModel.findOne).mockResolvedValue({
      _id: schoolId,
      code: 'SNP',
      nameEn: 'SNP International School',
      isDeleted: false,
    } as never);

    vi.mocked(BranchModel.findOne).mockResolvedValue({
      _id: branchId,
      schoolId,
      branchCode: 'MB-01',
      isDeleted: false,
    } as never);

    vi.mocked(AcademicYearModel.findOne).mockResolvedValue({
      _id: academicYearId,
      schoolId,
      name: '2026-2027',
      isDeleted: false,
    } as never);
  });

  it('verifies English Program -> Elementary Level class creation succeeds', async () => {
    vi.mocked(ProgramModel.findOne).mockReturnValue({
      populate: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue({
        _id: engProgramId,
        code: 'ENG',
        nameEn: 'General English Program',
        branchAvailability: 'all',
        isDeleted: false,
      }),
    } as never);

    vi.mocked(LevelModel.findOne).mockReturnValue({
      populate: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue({
        _id: engLevelId,
        programId: engProgramId,
        name: 'Elementary',
        isDeleted: false,
      }),
    } as never);

    vi.mocked(ClassModel.findOne).mockReturnValue({
      populate: vi.fn().mockReturnThis(),
      sort: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue(null),
    } as never);

    vi.mocked(ClassModel.create).mockResolvedValue({
      _id: '507f1f77bcf86cd799439041',
      classCode: 'ENG-ELEM-M1',
      className: 'English Elementary Morning A',
      toObject: () => ({ _id: '507f1f77bcf86cd799439041' }),
    } as never);

    const response = await request(app)
      .post('/api/v1/classes')
      .set('X-User-Id', '000000000000000000000001')
      .set('X-User-Permissions', 'class.create.all_branches')
      .send({
        branchId,
        academicYearId,
        programId: engProgramId,
        levelId: engLevelId,
        classCode: 'ENG-ELEM-M1',
        className: 'English Elementary Morning A',
        capacity: 30,
        status: 'active',
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });

  it('rejects cross-program mismatch (English Program with Computer Level)', async () => {
    vi.mocked(ProgramModel.findOne).mockReturnValue({
      populate: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue({
        _id: engProgramId,
        code: 'ENG',
        nameEn: 'General English Program',
        branchAvailability: 'all',
        isDeleted: false,
      }),
    } as never);

    // Level belongs to Computer Program, not English
    vi.mocked(LevelModel.findOne).mockReturnValue({
      populate: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue({
        _id: comLevelId,
        programId: comProgramId,
        name: 'Basic',
        isDeleted: false,
      }),
    } as never);

    const response = await request(app)
      .post('/api/v1/classes')
      .set('X-User-Id', '000000000000000000000001')
      .set('X-User-Permissions', 'class.create.all_branches')
      .send({
        branchId,
        academicYearId,
        programId: engProgramId,
        levelId: comLevelId,
        classCode: 'ENG-FAIL-01',
        className: 'Invalid Cross Program Class',
        capacity: 30,
        status: 'active',
      });

    expect(response.status).toBe(422);
    expect(response.body.success).toBe(false);
  });

  it('verifies single Student can have concurrent active enrollments across English & Computer programs', async () => {
    vi.mocked(StudentModel.findOne).mockResolvedValue({
      _id: studentId,
      schoolId,
      branchId,
      status: 'active',
      firstName: 'Dara',
      lastName: 'Sok',
      isDeleted: false,
    } as never);

    // 1st Enrollment: English Elementary
    vi.mocked(ProgramModel.findOne).mockResolvedValueOnce({
      _id: engProgramId,
      nameEn: 'General English Program',
      branchAvailability: 'all',
      isDeleted: false,
    } as never);

    vi.mocked(LevelModel.findOne).mockResolvedValueOnce({
      _id: engLevelId,
      programId: engProgramId,
      name: 'Elementary',
      isDeleted: false,
    } as never);

    vi.mocked(ClassModel.findOne).mockResolvedValueOnce({
      _id: '507f1f77bcf86cd799439041',
      branchId,
      academicYearId,
      programId: engProgramId,
      levelId: engLevelId,
      capacity: 30,
      isDeleted: false,
    } as never);

    vi.mocked(EnrollmentModel.findOne).mockReturnValueOnce({
      populate: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue(null),
    } as never);

    vi.mocked(EnrollmentModel.create).mockResolvedValueOnce({
      _id: '507f1f77bcf86cd799439051',
      enrollmentCode: 'ENR-000001',
      studentId,
      programId: engProgramId,
      classId: '507f1f77bcf86cd799439041',
      toObject: () => ({ _id: '507f1f77bcf86cd799439051' }),
    } as never);

    const enr1Res = await request(app)
      .post('/api/v1/enrollments')
      .set('X-User-Id', '000000000000000000000001')
      .set('X-User-Permissions', 'enrollment.create.all_branches')
      .send({
        studentId,
        schoolId,
        branchId,
        academicYearId,
        programId: engProgramId,
        levelId: engLevelId,
        classId: '507f1f77bcf86cd799439041',
        enrollmentDate: '2026-09-01',
      });

    expect(enr1Res.status, JSON.stringify(enr1Res.body)).toBe(201);
    expect(enr1Res.body.success).toBe(true);

    // 2nd Enrollment: Computer Basic for same student
    vi.mocked(ProgramModel.findOne).mockResolvedValueOnce({
      _id: comProgramId,
      nameEn: 'Computer Skills & IT Program',
      branchAvailability: 'all',
      isDeleted: false,
    } as never);

    vi.mocked(LevelModel.findOne).mockResolvedValueOnce({
      _id: comLevelId,
      programId: comProgramId,
      name: 'Basic',
      isDeleted: false,
    } as never);

    vi.mocked(ClassModel.findOne).mockResolvedValueOnce({
      _id: '507f1f77bcf86cd799439042',
      branchId,
      academicYearId,
      programId: comProgramId,
      levelId: comLevelId,
      capacity: 25,
      isDeleted: false,
    } as never);

    vi.mocked(EnrollmentModel.findOne).mockReturnValueOnce({
      populate: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue(null),
    } as never);

    vi.mocked(EnrollmentModel.create).mockResolvedValueOnce({
      _id: '507f1f77bcf86cd799439052',
      enrollmentCode: 'ENR-000002',
      studentId,
      programId: comProgramId,
      classId: '507f1f77bcf86cd799439042',
      toObject: () => ({ _id: '507f1f77bcf86cd799439052' }),
    } as never);

    const enr2Res = await request(app)
      .post('/api/v1/enrollments')
      .set('X-User-Id', '000000000000000000000001')
      .set('X-User-Permissions', 'enrollment.create.all_branches')
      .send({
        studentId,
        schoolId,
        branchId,
        academicYearId,
        programId: comProgramId,
        levelId: comLevelId,
        classId: '507f1f77bcf86cd799439042',
        enrollmentDate: '2026-09-01',
      });

    expect(enr2Res.status).toBe(201);
    expect(enr2Res.body.success).toBe(true);
  });
});
