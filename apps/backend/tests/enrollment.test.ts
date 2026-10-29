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
import { SequenceModel } from '../src/modules/sequence/sequence.model';
import { StudentModel } from '../src/modules/student/student.model';

vi.mock('../src/modules/student/student.model', () => ({
  StudentModel: {
    findOne: vi.fn(),
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
    findOne: vi.fn(),
    findOneAndUpdate: vi.fn(),
    updateOne: vi.fn(),
  },
}));

vi.mock('../src/modules/sequence/sequence.model', () => ({
  SequenceModel: {
    findOneAndUpdate: vi.fn(),
  },
}));

vi.mock('../src/modules/enrollment/enrollment.model', () => ({
  EnrollmentModel: {
    find: vi.fn(),
    findOne: vi.fn(),
    findOneAndUpdate: vi.fn(),
    create: vi.fn(),
    countDocuments: vi.fn(),
  },
}));

vi.mock('../src/modules/audit-log/audit-log.service', () => ({
  AuditLogService: class {
    public static log = vi.fn().mockResolvedValue(undefined);
  },
}));

describe('Enrollment Master API Tests (V1.0 Core School Management)', () => {
  const app = createApp();

  const studentId = '507f1f77bcf86cd799439001';
  const schoolId = '000000000000000000000001';
  const branchId = '507f1f77bcf86cd799439003';
  const academicYearId = '507f1f77bcf86cd799439004';
  const programId = '507f1f77bcf86cd799439005';
  const levelId = '507f1f77bcf86cd799439006';
  const classId = '507f1f77bcf86cd799439007';
  const enrollmentId = '507f1f77bcf86cd799439008';

  const mockEnrollment = {
    _id: enrollmentId,
    enrollmentCode: 'ENR-000001',
    studentId: {
      _id: studentId,
      studentId: 'STU-000001',
      firstName: 'Vannak',
      lastName: 'Chan',
      khmerName: 'ចាន់ វណ្ណៈ',
    },
    schoolId: { _id: schoolId, code: 'SNP', nameEn: 'SNP International' },
    branchId: { _id: branchId, branchCode: 'MB-01', branchNameEn: 'Main Branch' },
    academicYearId: { _id: academicYearId, name: '2026–2027 Academic Year', code: 'AY-2026-2027' },
    programId: { _id: programId, programCode: 'GEP', programNameEn: 'General English Program' },
    levelId: { _id: levelId, levelCode: 'GEP-L1', levelNameEn: 'GEP Level 1' },
    classId: { _id: classId, className: 'GEP-01A', room: '101', capacity: 25 },
    enrollmentDate: new Date('2026-09-01'),
    status: 'active',
    tuitionStatus: 'pending',
    isDeleted: false,
    toObject: vi.fn().mockReturnValue({ enrollmentCode: 'ENR-000001' }),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/v1/enrollments', () => {
    it('returns a paginated list of student enrollments', async () => {
      const mockQuery = {
        populate: vi.fn().mockReturnThis(),
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue([mockEnrollment]),
      };

      vi.mocked(EnrollmentModel.find).mockReturnValue(mockQuery as never);
      vi.mocked(EnrollmentModel.countDocuments).mockReturnValue({
        exec: vi.fn().mockResolvedValue(1),
      } as never);

      const response = await request(app).get('/api/v1/enrollments?page=1&limit=10');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].enrollmentCode).toBe('ENR-000001');
      expect(response.body.pagination.total).toBe(1);
    });
  });

  describe('POST /api/v1/enrollments', () => {
    it('successfully enrolls student and auto-generates ENR code sequence', async () => {
      vi.mocked(StudentModel.findOne).mockResolvedValue({
        _id: studentId,
        schoolId,
        branchId,
        status: 'active',
        firstName: 'Vannak',
        lastName: 'Chan',
        isDeleted: false,
      } as never);
      vi.mocked(SchoolModel.findOne).mockResolvedValue({
        _id: schoolId,
        isDeleted: false,
      } as never);
      vi.mocked(BranchModel.findOne).mockResolvedValue({
        _id: branchId,
        schoolId,
        isDeleted: false,
      } as never);
      vi.mocked(AcademicYearModel.findOne).mockResolvedValue({
        _id: academicYearId,
        schoolId,
        isDeleted: false,
      } as never);
      vi.mocked(ProgramModel.findOne).mockResolvedValue({
        _id: programId,
        schoolId,
        isDeleted: false,
      } as never);
      vi.mocked(LevelModel.findOne).mockResolvedValue({
        _id: levelId,
        programId,
        isDeleted: false,
      } as never);
      vi.mocked(ClassModel.findOne).mockResolvedValue({
        _id: classId,
        branchId,
        academicYearId,
        programId,
        levelId,
        capacity: 30,
        isDeleted: false,
      } as never);

      vi.mocked(EnrollmentModel.findOne).mockReturnValue({
        exec: vi.fn().mockResolvedValue(null),
      } as never);
      vi.mocked(EnrollmentModel.countDocuments).mockReturnValue({
        exec: vi.fn().mockResolvedValue(10),
      } as never);
      vi.mocked(SequenceModel.findOneAndUpdate).mockReturnValue({
        exec: vi.fn().mockResolvedValue({ currentSequence: 1 }),
      } as never);
      vi.mocked(ClassModel.findOneAndUpdate).mockResolvedValue({
        _id: classId,
        currentEnrollmentCount: 11,
      } as never);
      vi.mocked(EnrollmentModel.create).mockResolvedValue(mockEnrollment as never);

      const payload = {
        studentId,
        schoolId,
        branchId,
        academicYearId,
        programId,
        levelId,
        classId,
        enrollmentDate: '2026-09-01',
      };

      const response = await request(app).post('/api/v1/enrollments').send(payload);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.enrollmentCode).toBe('ENR-000001');
    });

    it('rejects enrollment if class has reached maximum capacity', async () => {
      vi.mocked(StudentModel.findOne).mockResolvedValue({
        _id: studentId,
        schoolId,
        branchId,
        status: 'active',
        firstName: 'Vannak',
        lastName: 'Chan',
        isDeleted: false,
      } as never);
      vi.mocked(SchoolModel.findOne).mockResolvedValue({
        _id: schoolId,
        isDeleted: false,
      } as never);
      vi.mocked(BranchModel.findOne).mockResolvedValue({
        _id: branchId,
        schoolId,
        isDeleted: false,
      } as never);
      vi.mocked(AcademicYearModel.findOne).mockResolvedValue({
        _id: academicYearId,
        schoolId,
        isDeleted: false,
      } as never);
      vi.mocked(ProgramModel.findOne).mockResolvedValue({
        _id: programId,
        schoolId,
        isDeleted: false,
      } as never);
      vi.mocked(LevelModel.findOne).mockResolvedValue({
        _id: levelId,
        programId,
        isDeleted: false,
      } as never);
      vi.mocked(ClassModel.findOne).mockResolvedValue({
        _id: classId,
        className: 'GEP-01A',
        branchId,
        academicYearId,
        programId,
        levelId,
        capacity: 25,
        isDeleted: false,
      } as never);

      vi.mocked(EnrollmentModel.findOne).mockReturnValue({
        exec: vi.fn().mockResolvedValue(null),
      } as never);
      vi.mocked(ClassModel.findOneAndUpdate).mockResolvedValue({ _id: classId } as never);
      vi.mocked(EnrollmentModel.countDocuments).mockReturnValue({
        exec: vi.fn().mockResolvedValue(25),
      } as never);

      const payload = {
        studentId,
        schoolId,
        branchId,
        academicYearId,
        programId,
        levelId,
        classId,
        enrollmentDate: '2026-09-01',
      };

      const response = await request(app).post('/api/v1/enrollments').send(payload);

      expect(response.status).toBe(422);
      expect(response.body.message).toMatch(/maximum capacity/);
    });

    it('rejects enrollment if student does not exist', async () => {
      vi.mocked(StudentModel.findOne).mockResolvedValue(null as never);

      const payload = {
        studentId,
        schoolId,
        branchId,
        academicYearId,
        programId,
        levelId,
        classId,
        enrollmentDate: '2026-09-01',
      };

      const response = await request(app).post('/api/v1/enrollments').send(payload);

      expect(response.status).toBe(422);
      expect(response.body.message).toMatch(/Student with ID .* does not exist/);
    });

    it('rejects enrollment if student is already actively enrolled in this class and academic year', async () => {
      vi.mocked(StudentModel.findOne).mockResolvedValue({
        _id: studentId,
        schoolId,
        branchId,
        status: 'active',
        firstName: 'Vannak',
        lastName: 'Chan',
        isDeleted: false,
      } as never);
      vi.mocked(SchoolModel.findOne).mockResolvedValue({
        _id: schoolId,
        isDeleted: false,
      } as never);
      vi.mocked(BranchModel.findOne).mockResolvedValue({
        _id: branchId,
        schoolId,
        isDeleted: false,
      } as never);
      vi.mocked(AcademicYearModel.findOne).mockResolvedValue({
        _id: academicYearId,
        schoolId,
        isDeleted: false,
      } as never);
      vi.mocked(ProgramModel.findOne).mockResolvedValue({
        _id: programId,
        schoolId,
        isDeleted: false,
      } as never);
      vi.mocked(LevelModel.findOne).mockResolvedValue({
        _id: levelId,
        programId,
        isDeleted: false,
      } as never);
      vi.mocked(ClassModel.findOne).mockResolvedValue({
        _id: classId,
        branchId,
        academicYearId,
        programId,
        levelId,
        capacity: 30,
        isDeleted: false,
      } as never);

      // Existing active enrollment found!
      vi.mocked(EnrollmentModel.findOne).mockReturnValue({
        exec: vi.fn().mockResolvedValue(mockEnrollment),
      } as never);

      const payload = {
        studentId,
        schoolId,
        branchId,
        academicYearId,
        programId,
        levelId,
        classId,
        enrollmentDate: '2026-09-01',
      };

      const response = await request(app).post('/api/v1/enrollments').send(payload);

      expect(response.status).toBe(409);
      expect(response.body.message).toMatch(/already enrolled in this class/);
    });
  });

  describe('GET /api/v1/enrollments/:id', () => {
    it('returns enrollment details by ID', async () => {
      const mockQuery = {
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(mockEnrollment),
      };
      vi.mocked(EnrollmentModel.findOne).mockReturnValue(mockQuery as never);

      const response = await request(app).get(`/api/v1/enrollments/${enrollmentId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.enrollmentCode).toBe('ENR-000001');
    });

    it('returns 404 if enrollment not found', async () => {
      const mockQuery = {
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(null),
      };
      vi.mocked(EnrollmentModel.findOne).mockReturnValue(mockQuery as never);

      const response = await request(app).get(`/api/v1/enrollments/${enrollmentId}`);

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/v1/enrollments/:id', () => {
    it('soft deletes enrollment record', async () => {
      const cancellableEnrollment = { ...mockEnrollment, status: 'enrolled' };
      const mockQuery = {
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(cancellableEnrollment),
      };
      vi.mocked(EnrollmentModel.findOne).mockReturnValue(mockQuery as never);
      vi.mocked(EnrollmentModel.findOneAndUpdate).mockReturnValue({
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(cancellableEnrollment),
      } as never);

      const response = await request(app).delete(`/api/v1/enrollments/${enrollmentId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});
