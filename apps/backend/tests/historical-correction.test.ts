import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createApp } from '../src/app';
import { AssessmentModel } from '../src/modules/assessment/assessment.model';
import { AttendanceRecordModel } from '../src/modules/attendance/attendance-record.model';
import { AttendanceModel } from '../src/modules/attendance/attendance.model';
import { HistoricalCorrectionModel } from '../src/modules/historical-correction/historical-correction.model';
import { HistoricalCorrectionService } from '../src/modules/historical-correction/historical-correction.service';
import type { AuthUser } from '../src/types/auth';
import { ScoreRevisionModel } from '../src/modules/score/score-revision.model';
import { ScoreModel } from '../src/modules/score/score.model';
import { TermResultModel } from '../src/modules/term-result/term-result.model';

vi.mock('../src/modules/audit-log/audit-log.service', () => ({
  AuditLogService: class {
    public static log = vi.fn().mockResolvedValue(undefined);
  },
}));

vi.mock('../src/modules/sequence/sequence.service', () => ({
  SequenceService: {
    getNextSequence: vi.fn().mockResolvedValue('HC-000001'),
  },
}));

vi.mock('../src/utils/transaction', () => ({
  runInTransaction: vi.fn((cb) => cb(null)),
}));

const app = createApp();

describe('Historical Correction Workflow API Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(AssessmentModel, 'findOne').mockResolvedValue(null as never);
  });

  const mockCorrectionId = '6a939db4ea1f071b8b1f1901';
  const mockScoreId = '6a939db4ea1f071b8b1f17e2';
  const mockStudentId = '6a939db4ea1f071b8b1f1702';
  const mockBranchId = '6a939db4ea1f071b8b1f1704';

  const mockCorrection = {
    _id: mockCorrectionId,
    correctionNumber: 'HC-000001',
    entityType: 'score',
    entityId: mockScoreId,
    studentId: mockStudentId,
    branchId: mockBranchId,
    academicYearId: '6a939db4ea1f071b8b1f1705',
    reason: 'Grading clerical entry error on midterm exam paper',
    requestedBy: '6a939db4ea1f071b8b1f1799',
    status: 'pending',
    previousValue: { scoreObtained: 65 },
    proposedValue: { scoreObtained: 85 },
    isDeleted: false,
  };

  it('POST /api/v1/historical-corrections creates a pending correction request', async () => {
    vi.spyOn(ScoreModel, 'findOne').mockResolvedValue({
      _id: mockScoreId,
      studentId: mockStudentId,
      academicYearId: '6a939db4ea1f071b8b1f1705',
      academicPeriodId: '6a939db4ea1f071b8b1f1706',
      branchId: mockBranchId,
      scoreObtained: 65,
      isDeleted: false,
    } as never);

    vi.spyOn(HistoricalCorrectionModel, 'create').mockResolvedValue(mockCorrection as never);

    const payload = {
      entityType: 'score',
      entityId: mockScoreId,
      reason: 'Grading clerical entry error on midterm exam paper',
      proposedValue: { scoreObtained: 85 },
    };

    const res = await request(app).post('/api/v1/historical-corrections').send(payload);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.correctionNumber).toBe('HC-000001');
    expect(res.body.data.status).toBe('pending');
  });

  it('POST /api/v1/historical-corrections/:id/review approves request and issues unlockToken', async () => {
    vi.spyOn(HistoricalCorrectionModel, 'findOne').mockResolvedValue(mockCorrection as never);
    vi.spyOn(HistoricalCorrectionModel, 'findOneAndUpdate').mockResolvedValue({
      ...mockCorrection,
      status: 'approved',
      unlockToken: 'test-unlock-token-1234567890',
      unlockExpiresAt: new Date(Date.now() + 3600000),
    } as never);

    const res = await request(app)
      .post(`/api/v1/historical-corrections/${mockCorrectionId}/review`)
      .send({
        status: 'approved',
        reviewRemarks: 'Exam paper verified by academic coordinator',
        unlockDurationMinutes: 60,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('approved');
  });

  it('POST /api/v1/historical-corrections rejects proposed score exceeding assessment maxScore', async () => {
    vi.spyOn(ScoreModel, 'findOne').mockResolvedValue({
      _id: mockScoreId,
      studentId: mockStudentId,
      academicYearId: '6a939db4ea1f071b8b1f1705',
      academicPeriodId: '6a939db4ea1f071b8b1f1706',
      branchId: mockBranchId,
      assessmentId: '6a939db4ea1f071b8b1f1707',
      scoreObtained: 65,
      isDeleted: false,
    } as never);
    vi.spyOn(AssessmentModel, 'findOne').mockResolvedValue({
      _id: '6a939db4ea1f071b8b1f1707',
      maxScore: 100,
      isDeleted: false,
    } as never);

    const payload = {
      entityType: 'score',
      entityId: mockScoreId,
      reason: 'Attempted invalid score',
      proposedValue: { scoreObtained: 105 },
    };

    const res = await request(app).post('/api/v1/historical-corrections').send(payload);
    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/v1/historical-corrections/:id/apply updates score, records ScoreRevision, and relocks', async () => {
    const approvedCorrection = {
      ...mockCorrection,
      status: 'approved',
      unlockToken: 'valid-token-1234567890',
      unlockExpiresAt: new Date(Date.now() + 3600000),
    };

    const mockScoreSave = vi.fn().mockResolvedValue(undefined);
    const mockScore = {
      _id: mockScoreId,
      studentId: mockStudentId,
      enrollmentId: '6a939db4ea1f071b8b1f1708',
      assessmentId: '6a939db4ea1f071b8b1f1707',
      branchId: mockBranchId,
      academicYearId: '6a939db4ea1f071b8b1f1705',
      academicPeriodId: '6a939db4ea1f071b8b1f1706',
      scoreObtained: 65,
      percentage: 65,
      letterGrade: 'D',
      isAbsent: false,
      save: mockScoreSave,
    };

    vi.spyOn(HistoricalCorrectionModel, 'findOne').mockResolvedValue(approvedCorrection as never);
    vi.spyOn(ScoreModel, 'findOne').mockResolvedValue(mockScore as never);
    vi.spyOn(AssessmentModel, 'findOne').mockResolvedValue({
      _id: '6a939db4ea1f071b8b1f1707',
      maxScore: 100,
      isDeleted: false,
    } as never);
    vi.spyOn(ScoreRevisionModel, 'create').mockResolvedValue([{}] as never);
    vi.spyOn(HistoricalCorrectionModel, 'findOneAndUpdate').mockResolvedValue({
      ...approvedCorrection,
      status: 'applied',
    } as never);

    const res = await request(app)
      .post(`/api/v1/historical-corrections/${mockCorrectionId}/apply`)
      .send({
        unlockToken: 'valid-token-1234567890',
        correctedValue: { scoreObtained: 85 },
        remarks: 'Corrected to 85 as per physical paper',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(mockScoreSave).toHaveBeenCalled();
    expect(ScoreRevisionModel.create).toHaveBeenCalled();
  });

  it('POST /api/v1/historical-corrections/:id/apply updates attendance record and parent session', async () => {
    const attendanceCorrection = {
      ...mockCorrection,
      entityType: 'attendance',
      proposedValue: { status: 'present', remarks: 'Late arrival confirmed by front desk' },
      entityId: '6a939db4ea1f071b8b1f1750',
      status: 'approved',
      unlockToken: 'valid-token-1234567890',
      unlockExpiresAt: new Date(Date.now() + 3600000),
    };

    const mockAttendanceSave = vi.fn().mockResolvedValue(undefined);
    const mockRecord = {
      _id: '6a939db4ea1f071b8b1f1750',
      attendanceSessionId: '6a939db4ea1f071b8b1f1760',
      studentId: mockStudentId,
      status: 'absent',
      remarks: 'Originally recorded as absent',
      save: mockAttendanceSave,
    };

    vi.spyOn(HistoricalCorrectionModel, 'findOne').mockResolvedValue(attendanceCorrection as never);
    vi.spyOn(AttendanceRecordModel, 'findOne').mockResolvedValue(mockRecord as never);
    vi.spyOn(AttendanceModel, 'updateOne').mockResolvedValue({ modifiedCount: 1 } as never);
    vi.spyOn(HistoricalCorrectionModel, 'findOneAndUpdate').mockResolvedValue({
      ...attendanceCorrection,
      status: 'applied',
    } as never);

    const res = await request(app)
      .post(`/api/v1/historical-corrections/${mockCorrectionId}/apply`)
      .send({
        unlockToken: 'valid-token-1234567890',
        correctedValue: { status: 'present', remarks: 'Late arrival confirmed by front desk' },
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(mockAttendanceSave).toHaveBeenCalled();
    expect(mockRecord.status).toBe('present');
    expect(AttendanceModel.updateOne).toHaveBeenCalled();
  });

  it('POST /api/v1/historical-corrections/:id/apply updates term result with CORRECTED status', async () => {
    const termResultCorrection = {
      ...mockCorrection,
      entityType: 'term_result',
      proposedValue: { totalScore: 500, averageScore: 83.3, gpa: 3.5, letterGrade: 'B' },
      entityId: '6a939db4ea1f071b8b1f1770',
      status: 'approved',
      unlockToken: 'valid-token-1234567890',
      unlockExpiresAt: new Date(Date.now() + 3600000),
    };

    const mockTermResultSave = vi.fn().mockResolvedValue(undefined);
    const mockTermResult = {
      _id: '6a939db4ea1f071b8b1f1770',
      studentId: mockStudentId,
      totalScore: 450,
      averageScore: 75,
      gpa: 3.0,
      letterGrade: 'B',
      workflowStatus: 'FINALIZED',
      save: mockTermResultSave,
    };

    vi.spyOn(HistoricalCorrectionModel, 'findOne').mockResolvedValue(termResultCorrection as never);
    vi.spyOn(TermResultModel, 'findOne').mockResolvedValue(mockTermResult as never);
    vi.spyOn(HistoricalCorrectionModel, 'findOneAndUpdate').mockResolvedValue({
      ...termResultCorrection,
      status: 'applied',
    } as never);

    const res = await request(app)
      .post(`/api/v1/historical-corrections/${mockCorrectionId}/apply`)
      .send({
        unlockToken: 'valid-token-1234567890',
        correctedValue: { totalScore: 500, averageScore: 83.3, gpa: 3.5, letterGrade: 'B' },
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(mockTermResultSave).toHaveBeenCalled();
    expect(mockTermResult.workflowStatus).toBe('CORRECTED');
    expect(mockTermResult.totalScore).toBe(500);
  });

  it.each([
    ['score', {}],
    ['score', { scoreObtained: '85' }],
    ['score', { isAbsent: 'false' }],
    ['score', { scoreObtained: 85, branchId: mockBranchId }],
    ['attendance', { status: 'invalid' }],
    ['term_result', { averageScore: 101 }],
    ['term_result', { gpa: -1 }],
  ])('rejects invalid %s correction values %j', async (entityType, proposedValue) => {
    const res = await request(app).post('/api/v1/historical-corrections').send({
      entityType,
      entityId: mockScoreId,
      reason: 'Verified clerical correction request',
      proposedValue,
    });
    expect(res.status).toBe(422);
    expect(HistoricalCorrectionModel.create).not.toHaveBeenCalled();
  });

  it('prevents requesters approving their own changes', async () => {
    vi.spyOn(HistoricalCorrectionModel, 'findOne').mockResolvedValue({
      ...mockCorrection,
      requestedBy: '000000000000000000000001',
    } as never);
    const res = await request(app)
      .post(`/api/v1/historical-corrections/${mockCorrectionId}/review`)
      .send({ status: 'approved' });
    expect(res.status).toBe(403);
    expect(HistoricalCorrectionModel.findOneAndUpdate).not.toHaveBeenCalled();
  });

  it('rejects applying values other than those approved', async () => {
    vi.spyOn(HistoricalCorrectionModel, 'findOne').mockResolvedValue({
      ...mockCorrection,
      status: 'approved',
      unlockToken: 'valid-token-1234567890',
      unlockExpiresAt: new Date(Date.now() + 3600000),
    } as never);
    const res = await request(app)
      .post(`/api/v1/historical-corrections/${mockCorrectionId}/apply`)
      .send({ unlockToken: 'valid-token-1234567890', correctedValue: { scoreObtained: 99 } });
    expect(res.status).toBe(422);
    expect(ScoreModel.findOne).not.toHaveBeenCalled();
    expect(HistoricalCorrectionModel.findOneAndUpdate).not.toHaveBeenCalled();
  });

  it('rejects a concurrently consumed approval before changing the target', async () => {
    vi.spyOn(HistoricalCorrectionModel, 'findOne').mockResolvedValue({
      ...mockCorrection,
      status: 'approved',
      unlockToken: 'valid-token-1234567890',
      unlockExpiresAt: new Date(Date.now() + 3600000),
    } as never);
    vi.spyOn(HistoricalCorrectionModel, 'findOneAndUpdate').mockResolvedValue(null);
    const res = await request(app)
      .post(`/api/v1/historical-corrections/${mockCorrectionId}/apply`)
      .send({ unlockToken: 'valid-token-1234567890', correctedValue: { scoreObtained: 85 } });
    expect(res.status).toBe(409);
    expect(ScoreModel.findOne).not.toHaveBeenCalled();
    expect(HistoricalCorrectionModel.findOneAndUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'approved',
        unlockToken: 'valid-token-1234567890',
        unlockExpiresAt: { $gt: expect.any(Date) },
      }),
      expect.objectContaining({ $unset: { unlockToken: 1, unlockExpiresAt: 1 } }),
      expect.anything(),
    );
  });

  it.each([{ branches: [] }, { branches: [mockBranchId, '6a939db4ea1f071b8b1f1709'] }])(
    'restricts list queries to every authorized branch, including an empty list',
    async ({ branches }) => {
      const chain = {
        populate: vi.fn().mockReturnThis(),
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue([]),
      };
      vi.spyOn(HistoricalCorrectionModel, 'find').mockReturnValue(chain as never);
      vi.spyOn(HistoricalCorrectionModel, 'countDocuments').mockReturnValue({
        exec: vi.fn().mockResolvedValue(0),
      } as never);
      await new HistoricalCorrectionService().getCorrections({}, {
        branchAccess: branches,
      } as AuthUser);
      const query = vi.mocked(HistoricalCorrectionModel.find).mock.calls[0]![0] as {
        branchId: { $in: unknown[] };
      };
      expect(query.branchId.$in.map(String)).toEqual(branches);
    },
  );
});
