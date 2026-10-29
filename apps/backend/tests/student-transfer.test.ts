import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createApp } from '../src/app';
import { BranchModel } from '../src/modules/branch/branch.model';
import { SchoolModel } from '../src/modules/school/school.model';
import { SequenceModel } from '../src/modules/sequence/sequence.model';
import { StudentTransferModel } from '../src/modules/student-transfer/student-transfer.model';
import { StudentModel } from '../src/modules/student/student.model';

vi.mock('../src/modules/school/school.model', () => ({
  SchoolModel: { findOne: vi.fn() },
}));

vi.mock('../src/modules/branch/branch.model', () => ({
  BranchModel: { findOne: vi.fn() },
}));

vi.mock('../src/modules/student/student.model', () => ({
  StudentModel: {
    findOne: vi.fn(),
    findByIdAndUpdate: vi.fn().mockResolvedValue({}),
  },
}));

vi.mock('../src/modules/enrollment/enrollment.model', () => ({
  EnrollmentModel: {
    updateMany: vi.fn().mockResolvedValue({ acknowledged: true, modifiedCount: 1 }),
  },
}));

vi.mock('../src/modules/sequence/sequence.model', () => ({
  SequenceModel: { findOneAndUpdate: vi.fn() },
}));

vi.mock('../src/modules/student-transfer/student-transfer.model', () => ({
  StudentTransferModel: {
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

describe('Student Transfer API Tests', () => {
  const app = createApp();

  const schoolId = '000000000000000000000001';
  const fromBranchId = '507f1f77bcf86cd799439002';
  const toBranchId = '507f1f77bcf86cd799439003';
  const studentId = '507f1f77bcf86cd799439004';
  const transferId = '507f1f77bcf86cd799439005';

  const mockTransfer = {
    _id: transferId,
    transferNumber: 'TRF-000001',
    studentId: { _id: studentId, studentId: 'STU-000001', firstName: 'Bopha', lastName: 'Kouy' },
    fromSchoolId: { _id: schoolId, nameEn: 'SNP' },
    toSchoolId: { _id: schoolId, nameEn: 'SNP' },
    fromBranchId: { _id: fromBranchId, branchNameEn: 'Main Branch' },
    toBranchId: { _id: toBranchId, branchNameEn: 'Tuol Kork Branch' },
    reason: 'Family relocated to Toul Kork area',
    status: 'pending',
    isDeleted: false,
    toObject: vi.fn().mockReturnValue({ transferNumber: 'TRF-000001' }),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/v1/student-transfers', () => {
    it('returns paginated transfer records', async () => {
      const mockQuery = {
        populate: vi.fn().mockReturnThis(),
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue([mockTransfer]),
      };

      vi.mocked(StudentTransferModel.find).mockReturnValue(mockQuery as never);
      vi.mocked(StudentTransferModel.countDocuments).mockReturnValue({
        exec: vi.fn().mockResolvedValue(1),
      } as never);

      const response = await request(app).get('/api/v1/student-transfers?page=1&limit=10');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
    });
  });

  describe('POST /api/v1/student-transfers', () => {
    it('creates transfer request with TRF sequence', async () => {
      vi.mocked(SchoolModel.findOne).mockResolvedValue({
        _id: schoolId,
        isDeleted: false,
      } as never);
      vi.mocked(BranchModel.findOne).mockResolvedValue({
        _id: fromBranchId,
        schoolId,
        isDeleted: false,
      } as never);
      vi.mocked(StudentModel.findOne).mockResolvedValue({
        _id: studentId,
        branchId: fromBranchId,
        isDeleted: false,
      } as never);

      vi.mocked(StudentTransferModel.findOne).mockReturnValue({
        exec: vi.fn().mockResolvedValue(null),
      } as never);
      vi.mocked(SequenceModel.findOneAndUpdate).mockReturnValue({
        exec: vi.fn().mockResolvedValue({ currentSequence: 1 }),
      } as never);
      vi.mocked(StudentTransferModel.create).mockResolvedValue(mockTransfer as never);

      const payload = {
        studentId,
        fromSchoolId: schoolId,
        toSchoolId: schoolId,
        fromBranchId,
        toBranchId,
        reason: 'Family relocated to Toul Kork area',
      };

      const response = await request(app)
        .post('/api/v1/student-transfers')
        .set('X-User-Id', 'transfer-admin')
        .set('X-School-Id', schoolId)
        .set('X-Branch-Access', 'all')
        .send(payload);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.transferNumber).toBe('TRF-000001');
    });
  });

  describe('PATCH /api/v1/student-transfers/:id/process', () => {
    it('approves and completes student transfer', async () => {
      const mockQuery = {
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(mockTransfer),
      };
      vi.mocked(StudentTransferModel.findOne).mockReturnValue(mockQuery as never);
      vi.mocked(StudentTransferModel.findOneAndUpdate).mockReturnValue({
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue({ ...mockTransfer, status: 'approved' }),
      } as never);

      const payload = {
        status: 'approved',
        remarks: 'Approved by Branch Director',
      };

      const response = await request(app)
        .patch(`/api/v1/student-transfers/${transferId}/process`)
        .send(payload);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});
