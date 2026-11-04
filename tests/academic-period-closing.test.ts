import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Types } from 'mongoose';

import { AcademicPeriodModel } from '../src/modules/academic-period/academic-period.model';
import { AcademicPeriodService } from '../src/modules/academic-period/academic-period.service';
import { AssessmentModel } from '../src/modules/assessment/assessment.model';
import { AttendanceModel } from '../src/modules/attendance/attendance.model';
import { AttendanceRecordModel } from '../src/modules/attendance/attendance-record.model';
import { ClassModel } from '../src/modules/class/class.model';
import { EnrollmentModel } from '../src/modules/enrollment/enrollment.model';
import { ScoreModel } from '../src/modules/score/score.model';
import { TermResultModel } from '../src/modules/term-result/term-result.model';

describe('AcademicPeriodService.getClosingChecklist & Pre-Close Validation', () => {
  const service = new AcademicPeriodService();
  const mockPeriodId = new Types.ObjectId().toString();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('separates blocking issues from warnings and calculates closing preview', async () => {
    vi.spyOn(AcademicPeriodModel, 'findOne').mockResolvedValue({
      _id: mockPeriodId,
      name: 'Term 1 2026',
      status: 'result_processing',
      isDeleted: false,
    } as never);

    const classId = new Types.ObjectId();
    const enrollment1 = new Types.ObjectId();
    const enrollment2 = new Types.ObjectId();

    vi.spyOn(ClassModel, 'find').mockReturnValue({
      select: vi.fn().mockReturnThis(),
      lean: vi.fn().mockResolvedValue([{ _id: classId }]),
    } as never);

    vi.spyOn(EnrollmentModel, 'find').mockReturnValue({
      select: vi.fn().mockReturnThis(),
      lean: vi.fn().mockResolvedValue([
        { _id: enrollment1, classId, status: 'active' },
        { _id: enrollment2, classId, status: 'active' },
      ]),
    } as never);

    vi.spyOn(AssessmentModel, 'find').mockReturnValue({
      select: vi.fn().mockReturnThis(),
      lean: vi.fn().mockResolvedValue([
        { _id: new Types.ObjectId(), classId, status: 'draft' }, // 1 draft assessment
      ]),
    } as never);

    vi.spyOn(ScoreModel, 'find').mockReturnValue({
      select: vi.fn().mockReturnThis(),
      lean: vi.fn().mockResolvedValue([]),
    } as never);

    vi.spyOn(ScoreModel, 'countDocuments').mockResolvedValue(0 as never);
    vi.spyOn(AttendanceModel, 'countDocuments').mockResolvedValue(1 as never);
    vi.spyOn(AttendanceRecordModel, 'distinct').mockResolvedValue([enrollment1] as never);

    vi.spyOn(AttendanceModel, 'find').mockReturnValue({
      select: vi.fn().mockReturnThis(),
      lean: vi
        .fn()
        .mockResolvedValue([{ classId, records: [{ studentId: new Types.ObjectId() }] }]),
    } as never);

    vi.spyOn(TermResultModel, 'find').mockReturnValue({
      select: vi.fn().mockReturnThis(),
      lean: vi.fn().mockResolvedValue([
        {
          enrollmentId: enrollment1,
          workflowStatus: 'APPROVED',
          promotionStatus: 'PROMOTED',
          isCompleted: false, // unresolved promotion
        },
      ]),
    } as never);

    const checklist = await service.getClosingChecklist(mockPeriodId);

    expect(checklist.canFinalize).toBe(false);
    expect(checklist.canClose).toBe(false);
    expect(checklist.blockingIssues.length).toBeGreaterThan(0);

    const types = checklist.blockingIssues.map((b) => b.type);
    expect(types).toContain('DRAFT_ASSESSMENT');
    expect(types).toContain('UNAPPROVED_RESULT');

    expect(checklist.preview).toBeDefined();
    expect(checklist.preview.classesCount).toBe(1);
    expect(checklist.preview.activeEnrollmentsCount).toBe(2);
    expect(checklist.preview.promotedCount).toBe(1);
  });
});
