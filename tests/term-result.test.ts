import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createApp } from '../src/app';
import { AcademicPeriodModel } from '../src/modules/academic-period/academic-period.model';
import { AssessmentModel } from '../src/modules/assessment/assessment.model';
import { AttendanceModel } from '../src/modules/attendance/attendance.model';
import { ClassModel } from '../src/modules/class/class.model';
import { EnrollmentModel } from '../src/modules/enrollment/enrollment.model';
import { LevelModel } from '../src/modules/level/level.model';
import { ScoreModel } from '../src/modules/score/score.model';
import { SequenceService } from '../src/modules/sequence/sequence.service';
import { PromotionModel } from '../src/modules/term-result/promotion.model';
import { SubjectModel } from '../src/modules/subject/subject.model';
import { TermResultModel } from '../src/modules/term-result/term-result.model';

vi.mock('../src/modules/audit-log/audit-log.service', () => ({
  AuditLogService: class {
    public static log = vi.fn().mockResolvedValue(undefined);
  },
}));

const app = createApp();

describe('Term Result Module Endpoints & Progression Workflow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not allow legacy edit permission to transition workflow stages', async () => {
    const response = await request(app)
      .post('/api/v1/term-results/6a939db4ea1f071b8b1f17e1/workflow-transition')
      .set('X-User-Id', 'legacy-term-result-editor')
      .set('X-User-Permissions', 'term_result.edit.own_branch')
      .send({ status: 'SUBMITTED' });

    expect(response.status).toBe(403);
  });

  it('GET /api/v1/term-results returns paginated list with filter support', async () => {
    vi.spyOn(TermResultModel, 'find').mockReturnValue({
      populate: vi.fn().mockReturnThis(),
      sort: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([
        {
          _id: '6a939db4ea1f071b8b1f17e1',
          totalScore: 180,
          averageScore: 90,
          gpa: 4.0,
          letterGrade: 'A',
          attendanceRate: 95,
          resultStatus: 'PASSED',
          promotionStatus: 'PROMOTED',
          isCompleted: false,
        },
      ]),
    } as never);

    vi.spyOn(TermResultModel, 'countDocuments').mockReturnValue({
      exec: vi.fn().mockResolvedValue(1),
    } as never);

    const res = await request(app).get('/api/v1/term-results');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].letterGrade).toBe('A');
    expect(res.body.data[0].resultStatus).toBe('PASSED');
  });

  it('POST /api/v1/term-results/calculate-student calculates scores, attendance, GPA and marks promotion', async () => {
    vi.spyOn(EnrollmentModel, 'findOne').mockResolvedValue({
      _id: '6a939db4ea1f071b8b1f1701',
      studentId: '6a939db4ea1f071b8b1f1702',
      schoolId: '6a939db4ea1f071b8b1f1703',
      branchId: '6a939db4ea1f071b8b1f1704',
      academicYearId: '6a939db4ea1f071b8b1f1705',
      academicPeriodId: '6a939db4ea1f071b8b1f1706',
      programId: '6a939db4ea1f071b8b1f1707',
      levelId: '6a939db4ea1f071b8b1f1708',
      classId: '6a939db4ea1f071b8b1f1709',
      isDeleted: false,
    } as never);

    vi.spyOn(ClassModel, 'findOne').mockResolvedValue({
      _id: '6a939db4ea1f071b8b1f1709',
      branchId: '6a939db4ea1f071b8b1f1704',
      academicPeriodId: '6a939db4ea1f071b8b1f1706',
      isDeleted: false,
    } as never);
    vi.spyOn(ClassModel, 'findOneAndUpdate').mockResolvedValue(null);

    vi.spyOn(ScoreModel, 'find').mockResolvedValue([
      {
        subjectId: '6a939db4ea1f071b8b1f1711',
        assessmentId: '6a939db4ea1f071b8b1f1721',
        scoreObtained: 90,
        percentage: 90,
        isAbsent: false,
        isDeleted: false,
      },
    ] as never);

    vi.spyOn(AssessmentModel, 'find').mockReturnValue({
      select: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([
        {
          _id: '6a939db4ea1f071b8b1f1721',
          code: 'ASM-01',
          name: 'Midterm',
          maxScore: 100,
          weightPercentage: 1,
          status: 'closed',
        },
      ]),
    } as never);

    vi.spyOn(SubjectModel, 'find').mockReturnValue({
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([
        {
          _id: '6a939db4ea1f071b8b1f1711',
          code: 'ENG',
          name: 'English',
        },
      ]),
    } as never);

    vi.spyOn(AttendanceModel, 'find').mockResolvedValue([
      {
        records: [
          {
            studentId: '6a939db4ea1f071b8b1f1702',
            status: 'present',
          },
        ],
      },
    ] as never);

    vi.spyOn(LevelModel, 'findOne')
      .mockResolvedValueOnce({
        _id: '6a939db4ea1f071b8b1f1708',
        sequence: 1,
        isDeleted: false,
      } as never)
      .mockResolvedValueOnce({
        _id: '6a939db4ea1f071b8b1f1710',
        sequence: 2,
        isDeleted: false,
      } as never);

    const mockSavedResult = {
      _id: '6a939db4ea1f071b8b1f17e1',
      averageScore: 90,
      gpa: 4.0,
      letterGrade: 'A',
      attendanceRate: 100,
      resultStatus: 'PASSED',
      promotionStatus: 'PROMOTED',
      toObject: () => ({
        _id: '6a939db4ea1f071b8b1f17e1',
        averageScore: 90,
        gpa: 4.0,
        letterGrade: 'A',
        resultStatus: 'PASSED',
        promotionStatus: 'PROMOTED',
      }),
      save: vi.fn().mockResolvedValue(true),
    };

    const nullQuery = Object.assign(Promise.resolve(null), {
      exec: vi.fn().mockResolvedValue(null),
    });
    vi.spyOn(TermResultModel, 'findOne').mockReturnValue(nullQuery as never);
    vi.spyOn(TermResultModel.prototype, 'save').mockImplementation(function (this: unknown) {
      return Promise.resolve(Object.assign(this as object, mockSavedResult));
    });

    const res = await request(app)
      .post('/api/v1/term-results/calculate-student')
      .send({ enrollmentId: '6a939db4ea1f071b8b1f1701' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.averageScore).toBe(90);
    expect(res.body.data.letterGrade).toBe('A');
    expect(res.body.data.promotionStatus).toBe('PROMOTED');
  });

  it('POST /api/v1/term-results/:id/complete finalizes term and auto-enrolls student into next period', async () => {
    const mockSave = vi.fn().mockResolvedValue(true);
    vi.spyOn(TermResultModel, 'findOne').mockResolvedValue({
      _id: '6a939db4ea1f071b8b1f17e1',
      studentId: '6a939db4ea1f071b8b1f1702',
      schoolId: '6a939db4ea1f071b8b1f1703',
      branchId: '6a939db4ea1f071b8b1f1704',
      academicYearId: '6a939db4ea1f071b8b1f1705',
      academicPeriodId: '6a939db4ea1f071b8b1f1720',
      programId: '6a939db4ea1f071b8b1f1707',
      levelId: '6a939db4ea1f071b8b1f1708',
      nextLevelId: '6a939db4ea1f071b8b1f1710',
      enrollmentId: '6a939db4ea1f071b8b1f1701',
      promotionStatus: 'PROMOTED',
      workflowStatus: 'APPROVED',
      isCompleted: false,
      save: mockSave,
      isDeleted: false,
      toObject: () => ({
        _id: '6a939db4ea1f071b8b1f17e1',
        isCompleted: true,
      }),
    } as never);

    vi.spyOn(EnrollmentModel, 'findOne').mockResolvedValue({
      _id: '6a939db4ea1f071b8b1f1701',
      schoolId: '6a939db4ea1f071b8b1f1703',
      branchId: '6a939db4ea1f071b8b1f1704',
      academicYearId: '6a939db4ea1f071b8b1f1705',
      academicPeriodId: '6a939db4ea1f071b8b1f1720',
      status: 'active',
      isDeleted: false,
    } as never);

    vi.spyOn(AcademicPeriodModel, 'findOne').mockResolvedValue({
      _id: '6a939db4ea1f071b8b1f1720',
      academicYearId: '6a939db4ea1f071b8b1f1705',
      isDeleted: false,
    } as never);

    vi.spyOn(ClassModel, 'findOne').mockResolvedValue({
      _id: '6a939db4ea1f071b8b1f1730',
      schoolId: '6a939db4ea1f071b8b1f1703',
      branchId: '6a939db4ea1f071b8b1f1704',
      programId: '6a939db4ea1f071b8b1f1707',
      levelId: '6a939db4ea1f071b8b1f1710',
      academicYearId: '6a939db4ea1f071b8b1f1705',
      academicPeriodId: '6a939db4ea1f071b8b1f1720',
      isDeleted: false,
    } as never);

    vi.spyOn(EnrollmentModel, 'exists').mockResolvedValue(null as never);
    vi.spyOn(SequenceService, 'getNextSequence').mockResolvedValue('ENR-2026001');

    vi.spyOn(EnrollmentModel, 'create').mockResolvedValue({
      _id: '6a939db4ea1f071b8b1f1799',
      enrollmentCode: 'ENR-2026001',
      status: 'enrolled',
    } as never);

    vi.spyOn(PromotionModel, 'create').mockResolvedValue([{} as never] as never);
    vi.spyOn(EnrollmentModel, 'updateOne').mockResolvedValue({ modifiedCount: 1 } as never);

    const payload = {
      nextPeriodId: '6a939db4ea1f071b8b1f1720',
      nextClassId: '6a939db4ea1f071b8b1f1730',
      remarks: 'Promoted to Level 2',
    };

    const res = await request(app)
      .post('/api/v1/term-results/6a939db4ea1f071b8b1f17e1/complete')
      .set('X-School-Id', '6a939db4ea1f071b8b1f1703')
      .send(payload);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(mockSave).toHaveBeenCalled();
  });
});
