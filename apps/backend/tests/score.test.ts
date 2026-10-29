import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createApp } from '../src/app';
import { AssessmentModel } from '../src/modules/assessment/assessment.model';
import { EnrollmentModel } from '../src/modules/enrollment/enrollment.model';
import { ScoreModel } from '../src/modules/score/score.model';

const app = createApp();

describe('Score Entry Module Endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET /api/v1/scores returns paginated score list', async () => {
    vi.spyOn(ScoreModel, 'find').mockReturnValue({
      populate: vi.fn().mockReturnThis(),
      sort: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([
        {
          _id: '6a939db4ea1f071b8b1f17e2',
          scoreObtained: 85,
          percentage: 85,
          letterGrade: 'B',
          isAbsent: false,
        },
      ]),
    } as never);

    vi.spyOn(ScoreModel, 'countDocuments').mockReturnValue({
      exec: vi.fn().mockResolvedValue(1),
    } as never);

    const res = await request(app).get('/api/v1/scores');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].letterGrade).toBe('B');
  });

  it('POST /api/v1/scores/batch upserts scores with calculated grades', async () => {
    vi.spyOn(AssessmentModel, 'findOne').mockReturnValue({
      exec: vi.fn().mockResolvedValue({
        _id: '6a939db4ea1f071b8b1f17e1',
        schoolId: '6a939db4ea1f071b8b1f17d1',
        branchId: '6a939db4ea1f071b8b1f17c1',
        academicYearId: '6a939db4ea1f071b8b1f17f1',
        classId: '6a939db4ea1f071b8b1f17a1',
        subjectId: '6a939db4ea1f071b8b1f17b1',
        maxScore: 100,
        status: 'published',
      }),
    } as never);

    vi.spyOn(ScoreModel, 'bulkWrite').mockResolvedValue({} as never);
    vi.spyOn(EnrollmentModel, 'find').mockReturnValue({
      select: vi.fn().mockResolvedValue([{ studentId: '6a939db4ea1f071b8b1f1701' }]),
    } as never);
    vi.spyOn(ScoreModel, 'find').mockReturnValue({
      session: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      populate: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([
        {
          _id: '6a939db4ea1f071b8b1f17e2',
          studentId: '6a939db4ea1f071b8b1f1701',
          scoreObtained: 95,
          percentage: 95,
          letterGrade: 'A',
        },
      ]),
    } as never);

    const payload = {
      assessmentId: '6a939db4ea1f071b8b1f17e1',
      scores: [
        {
          studentId: '6a939db4ea1f071b8b1f1701',
          scoreObtained: 95,
          isAbsent: false,
          remarks: 'Excellent',
        },
      ],
    };

    const res = await request(app).post('/api/v1/scores/batch').send(payload);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data[0].letterGrade).toBe('A');
  });
});
