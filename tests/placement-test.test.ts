import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createApp } from '../src/app';
import { BranchModel } from '../src/modules/branch/branch.model';
import { LevelModel } from '../src/modules/level/level.model';
import { PlacementTestModel } from '../src/modules/placement-test/placement-test.model';
import { ProgramModel } from '../src/modules/program/program.model';
import { SchoolModel } from '../src/modules/school/school.model';
import { SequenceModel } from '../src/modules/sequence/sequence.model';

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

vi.mock('../src/modules/sequence/sequence.model', () => ({
  SequenceModel: {
    findOneAndUpdate: vi.fn(),
  },
}));

vi.mock('../src/modules/placement-test/placement-test.model', () => ({
  PlacementTestModel: {
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

describe('Admissions Placement Test API Tests', () => {
  const app = createApp();

  const schoolId = '507f1f77bcf86cd799439001';
  const branchId = '507f1f77bcf86cd799439002';
  const programId = '507f1f77bcf86cd799439003';
  const levelId = '507f1f77bcf86cd799439004';
  const testId = '507f1f77bcf86cd799439005';

  const mockPlacementTest = {
    _id: testId,
    testNumber: 'TEST-000001',
    studentName: 'Bopha Kouy',
    schoolId: { _id: schoolId, code: 'SNP', nameEn: 'SNP International' },
    branchId: { _id: branchId, branchCode: 'MB-01', branchNameEn: 'Main Branch' },
    programId: { _id: programId, programCode: 'GEP', programNameEn: 'General English Program' },
    recommendedLevelId: { _id: levelId, levelCode: 'GEP-L2', levelNameEn: 'GEP Level 2' },
    testDate: new Date('2026-08-20'),
    score: 85,
    maxScore: 100,
    examinerName: 'Teacher Dara',
    status: 'completed',
    isDeleted: false,
    toObject: vi.fn().mockReturnValue({ testNumber: 'TEST-000001' }),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/v1/placement-tests', () => {
    it('returns a paginated list of placement tests', async () => {
      const mockQuery = {
        populate: vi.fn().mockReturnThis(),
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue([mockPlacementTest]),
      };

      vi.mocked(PlacementTestModel.find).mockReturnValue(mockQuery as never);
      vi.mocked(PlacementTestModel.countDocuments).mockReturnValue({
        exec: vi.fn().mockResolvedValue(1),
      } as never);

      const response = await request(app).get('/api/v1/placement-tests?page=1&limit=10');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].testNumber).toBe('TEST-000001');
      expect(response.body.pagination.total).toBe(1);
    });
  });

  describe('POST /api/v1/placement-tests', () => {
    it('records placement test and auto-generates TEST sequence ID', async () => {
      vi.mocked(SchoolModel.findOne).mockResolvedValue({
        _id: schoolId,
        isDeleted: false,
      } as never);
      vi.mocked(BranchModel.findOne).mockResolvedValue({
        _id: branchId,
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

      vi.mocked(PlacementTestModel.findOne).mockReturnValue({
        exec: vi.fn().mockResolvedValue(null),
      } as never);
      vi.mocked(SequenceModel.findOneAndUpdate).mockReturnValue({
        exec: vi.fn().mockResolvedValue({ currentSequence: 1 }),
      } as never);
      vi.mocked(PlacementTestModel.create).mockResolvedValue(mockPlacementTest as never);

      const payload = {
        studentName: 'Bopha Kouy',
        schoolId,
        branchId,
        programId,
        recommendedLevelId: levelId,
        score: 85,
        maxScore: 100,
        examinerName: 'Teacher Dara',
      };

      const response = await request(app).post('/api/v1/placement-tests').send(payload);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.testNumber).toBe('TEST-000001');
    });

    it('rejects test if score exceeds max score', async () => {
      const payload = {
        studentName: 'Bopha Kouy',
        schoolId,
        branchId,
        programId,
        recommendedLevelId: levelId,
        score: 105,
        maxScore: 100,
      };

      const response = await request(app).post('/api/v1/placement-tests').send(payload);

      expect(response.status).toBe(422);
      expect(response.body.message).toBe('Validation failed');
    });
  });

  describe('GET /api/v1/placement-tests/:id', () => {
    it('returns placement test by ID', async () => {
      const mockQuery = {
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(mockPlacementTest),
      };
      vi.mocked(PlacementTestModel.findOne).mockReturnValue(mockQuery as never);

      const response = await request(app).get(`/api/v1/placement-tests/${testId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.testNumber).toBe('TEST-000001');
    });
  });

  describe('DELETE /api/v1/placement-tests/:id', () => {
    it('soft deletes placement test record', async () => {
      const mockQuery = {
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(mockPlacementTest),
      };
      vi.mocked(PlacementTestModel.findOne).mockReturnValue(mockQuery as never);
      vi.mocked(PlacementTestModel.findOneAndUpdate).mockReturnValue({
        exec: vi.fn().mockResolvedValue(mockPlacementTest),
      } as never);

      const response = await request(app).delete(`/api/v1/placement-tests/${testId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});
