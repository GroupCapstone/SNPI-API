import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createApp } from '../src/app';
import { BranchModel } from '../src/modules/branch/branch.model';
import { EnrollmentModel } from '../src/modules/enrollment/enrollment.model';
import { PaymentModel } from '../src/modules/payment/payment.model';
import { SchoolModel } from '../src/modules/school/school.model';
import { SequenceModel } from '../src/modules/sequence/sequence.model';
import { StudentModel } from '../src/modules/student/student.model';

vi.mock('../src/modules/enrollment/enrollment.model', () => ({
  EnrollmentModel: {
    countDocuments: vi.fn().mockResolvedValue(0),
  },
}));

vi.mock('../src/modules/payment/payment.model', () => ({
  PaymentModel: {
    countDocuments: vi.fn().mockResolvedValue(0),
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

vi.mock('../src/modules/sequence/sequence.model', () => ({
  SequenceModel: {
    findOneAndUpdate: vi.fn(),
  },
}));

vi.mock('../src/modules/student/student.model', () => ({
  StudentModel: {
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

describe('Student Master API Tests (V1.0 Core School Management)', () => {
  const app = createApp();

  const schoolId = '000000000000000000000001';
  const branchId = '507f1f77bcf86cd799439002';
  const studentObjectId = '507f1f77bcf86cd799439003';

  const mockStudent = {
    _id: studentObjectId,
    studentId: 'STU-000001',
    schoolId: { _id: schoolId, code: 'SNP', nameEn: 'SNP International' },
    branchId: { _id: branchId, branchCode: 'MB-01', branchNameEn: 'Main Branch' },
    firstName: 'Vannak',
    lastName: 'Chan',
    khmerName: 'ចាន់ វណ្ណៈ',
    gender: 'male',
    dateOfBirth: new Date('2015-05-12'),
    phone: '+85512999888',
    email: 'vannak.chan@student.snp.edu.kh',
    status: 'active',
    guardians: [
      {
        fullName: 'Chan Sok',
        relationship: 'father',
        phone: '012999888',
        isPrimary: true,
        isEmergencyContact: true,
      },
    ],
    isDeleted: false,
    toObject: vi.fn().mockReturnValue({ studentId: 'STU-000001' }),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/v1/students', () => {
    it('returns a paginated list of students', async () => {
      const mockQuery = {
        populate: vi.fn().mockReturnThis(),
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue([mockStudent]),
      };

      vi.mocked(StudentModel.find).mockReturnValue(mockQuery as never);
      vi.mocked(StudentModel.countDocuments).mockReturnValue({
        exec: vi.fn().mockResolvedValue(1),
      } as never);

      const response = await request(app).get('/api/v1/students?page=1&limit=10');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].studentId).toBe('STU-000001');
      expect(response.body.pagination.total).toBe(1);
    });
  });

  describe('POST /api/v1/students', () => {
    it('creates a new student and auto-generates STU ID sequence', async () => {
      vi.mocked(SchoolModel.findOne).mockResolvedValue({
        _id: schoolId,
        isDeleted: false,
      } as never);
      vi.mocked(BranchModel.findOne).mockResolvedValue({
        _id: branchId,
        schoolId,
        isDeleted: false,
      } as never);
      vi.mocked(StudentModel.findOne).mockReturnValue({
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(mockStudent),
      } as never);
      vi.mocked(SequenceModel.findOneAndUpdate).mockReturnValue({
        exec: vi.fn().mockResolvedValue({ currentSequence: 1 }),
      } as never);
      vi.mocked(StudentModel.create).mockResolvedValue(mockStudent as never);

      const payload = {
        schoolId,
        branchId,
        firstName: 'Vannak',
        lastName: 'Chan',
        khmerName: 'ចាន់ វណ្ណៈ',
        gender: 'male',
        dateOfBirth: '2015-05-12',
        guardians: [
          {
            fullName: 'Chan Sok',
            relationship: 'father',
            phone: '012999888',
            isPrimary: true,
            isEmergencyContact: true,
          },
        ],
      };

      const response = await request(app).post('/api/v1/students').send(payload);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.studentId).toBe('STU-000001');
    });

    it('rejects student creation if school does not exist', async () => {
      vi.mocked(SchoolModel.findOne).mockResolvedValue(null as never);

      const payload = {
        schoolId,
        branchId,
        firstName: 'Vannak',
        lastName: 'Chan',
        khmerName: 'ចាន់ វណ្ណៈ',
        gender: 'male',
        dateOfBirth: '2015-05-12',
      };

      const response = await request(app).post('/api/v1/students').send(payload);

      expect(response.status).toBe(422);
      expect(response.body.message).toMatch(/does not exist/);
    });
  });

  describe('GET /api/v1/students/:id', () => {
    it('returns student profile by ID', async () => {
      const mockQuery = {
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(mockStudent),
      };
      vi.mocked(StudentModel.findOne).mockReturnValue(mockQuery as never);

      const response = await request(app).get(`/api/v1/students/${studentObjectId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.studentId).toBe('STU-000001');
    });

    it('returns 404 if student not found', async () => {
      const mockQuery = {
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(null),
      };
      vi.mocked(StudentModel.findOne).mockReturnValue(mockQuery as never);

      const response = await request(app).get(`/api/v1/students/${studentObjectId}`);

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/v1/students/:id', () => {
    it('soft deletes student record', async () => {
      const mockQuery = {
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(mockStudent),
      };
      vi.mocked(StudentModel.findOne).mockReturnValue(mockQuery as never);
      vi.mocked(StudentModel.findOneAndUpdate).mockReturnValue({
        exec: vi.fn().mockResolvedValue(mockStudent),
      } as never);

      const response = await request(app).delete(`/api/v1/students/${studentObjectId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('blocks student deletion when active enrollments exist', async () => {
      const mockQuery = {
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(mockStudent),
      };
      vi.mocked(StudentModel.findOne).mockReturnValue(mockQuery as never);
      vi.mocked(EnrollmentModel.countDocuments).mockResolvedValueOnce(2 as never);

      const response = await request(app).delete(`/api/v1/students/${studentObjectId}`);

      expect(response.status).toBe(409);
      expect(response.body.message).toMatch(/active dependencies/);
    });

    it('blocks student deletion when unpaid payment balances exist', async () => {
      const mockQuery = {
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(mockStudent),
      };
      vi.mocked(StudentModel.findOne).mockReturnValue(mockQuery as never);
      vi.mocked(EnrollmentModel.countDocuments).mockResolvedValueOnce(0 as never);
      vi.mocked(PaymentModel.countDocuments).mockResolvedValueOnce(1 as never);

      const response = await request(app).delete(`/api/v1/students/${studentObjectId}`);

      expect(response.status).toBe(409);
      expect(response.body.message).toMatch(/active dependencies/);
    });
  });
});
