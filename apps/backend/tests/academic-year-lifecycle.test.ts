import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createApp } from '../src/app';
import { assertAcademicContextWritable } from '../src/modules/academic-period/academic-context-lock.service';
import { AcademicPeriodModel } from '../src/modules/academic-period/academic-period.model';
import { AcademicPeriodService } from '../src/modules/academic-period/academic-period.service';
import { HistoricalCorrectionModel } from '../src/modules/historical-correction/historical-correction.model';

vi.mock('../src/modules/audit-log/audit-log.service', () => ({
  AuditLogService: class {
    public static log = vi.fn().mockResolvedValue(undefined);
  },
}));

const app = createApp();

describe('Academic Year & Period Lifecycle Standard Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const periodId = '6a939db4ea1f071b8b1f1706';
  const yearId = '6a939db4ea1f071b8b1f1705';

  it('assertAcademicContextWritable blocks writes when period is closed', async () => {
    vi.spyOn(AcademicPeriodModel, 'findOne').mockResolvedValue({
      _id: periodId,
      academicYearId: yearId,
      status: 'closed',
      isDeleted: false,
    } as never);

    await expect(
      assertAcademicContextWritable({
        academicPeriodId: periodId,
        operation: 'enter scores',
      }),
    ).rejects.toThrow('academic period is closed and read-only');
  });

  it('assertAcademicContextWritable allows write if an approved correctionRequestId is provided', async () => {
    vi.spyOn(HistoricalCorrectionModel, 'findOne').mockResolvedValue({
      _id: '6a939db4ea1f071b8b1f1901',
      status: 'approved',
      unlockExpiresAt: new Date(Date.now() + 60000),
      isDeleted: false,
    } as never);

    await expect(
      assertAcademicContextWritable({
        academicPeriodId: periodId,
        operation: 'enter scores',
        correctionRequestId: '6a939db4ea1f071b8b1f1901',
      }),
    ).resolves.toBeUndefined();
  });

  it('GET /api/v1/academic-periods/:id/closing-checklist returns validation gates', async () => {
    const mockChecklist = {
      academicPeriodId: periodId,
      canFinalize: true,
      canClose: true,
      checkedAt: new Date(),
      counts: {
        classes: 4,
        activeEnrollments: 80,
        assessments: 12,
        draftAssessments: 0,
        expectedScores: 960,
        recordedScores: 960,
        missingScores: 0,
        attendanceSessions: 60,
        studentsWithoutAttendance: 0,
        termResults: 80,
        unapprovedResults: 0,
        unresolvedPromotions: 0,
      },
      problems: [],
    };

    vi.spyOn(AcademicPeriodService.prototype, 'getClosingChecklist').mockResolvedValue(
      mockChecklist as never,
    );

    const res = await request(app).get(`/api/v1/academic-periods/${periodId}/closing-checklist`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('canClose', true);
    expect(res.body.data).toHaveProperty('counts');
    expect(res.body.data.counts.classes).toBe(4);
  });
});
