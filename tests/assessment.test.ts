import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createApp } from '../src/app';
import { AssessmentModel } from '../src/modules/assessment/assessment.model';
import { BranchModel } from '../src/modules/branch/branch.model';
import { ClassModel } from '../src/modules/class/class.model';
import { SubjectModel } from '../src/modules/subject/subject.model';

const app = createApp();

describe('Assessment Module Endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET /api/v1/assessments returns paginated list of assessments', async () => {
    vi.spyOn(AssessmentModel, 'find').mockReturnValue({
      populate: vi.fn().mockReturnThis(),
      sort: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([
        {
          _id: '6a939db4ea1f071b8b1f17e1',
          name: 'Midterm Exam 1',
          code: 'MID-1',
          type: 'midterm',
          maxScore: 100,
          passingScore: 50,
          weightPercentage: 30,
          assessmentDate: new Date(),
          status: 'published',
        },
      ]),
    } as never);

    vi.spyOn(AssessmentModel, 'countDocuments').mockReturnValue({
      exec: vi.fn().mockResolvedValue(1),
    } as never);

    const res = await request(app).get('/api/v1/assessments');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].code).toBe('MID-1');
  });

  it('POST /api/v1/assessments creates assessment successfully', async () => {
    vi.spyOn(ClassModel, 'findOne').mockReturnValue({
      exec: vi.fn().mockResolvedValue({
        _id: '6a939db4ea1f071b8b1f17a1',
        schoolId: '6a939db4ea1f071b8b1f17d1',
        branchId: '6a939db4ea1f071b8b1f17c1',
        academicYearId: '6a939db4ea1f071b8b1f17f1',
      }),
    } as never);

    vi.spyOn(SubjectModel, 'findOne').mockReturnValue({
      exec: vi.fn().mockResolvedValue({ _id: '6a939db4ea1f071b8b1f17b1' }),
    } as never);

    vi.spyOn(BranchModel, 'findOne').mockReturnValue({
      exec: vi.fn().mockResolvedValue({
        _id: '6a939db4ea1f071b8b1f17c1',
        schoolId: '6a939db4ea1f071b8b1f17d1',
      }),
    } as never);

    vi.spyOn(AssessmentModel, 'findOne').mockReturnValue({
      exec: vi.fn().mockResolvedValue(null),
    } as never);

    vi.spyOn(AssessmentModel, 'create').mockResolvedValue({
      _id: '6a939db4ea1f071b8b1f17e1',
      schoolId: '6a939db4ea1f071b8b1f17d1',
      branchId: '6a939db4ea1f071b8b1f17c1',
      academicYearId: '6a939db4ea1f071b8b1f17f1',
      classId: '6a939db4ea1f071b8b1f17a1',
      subjectId: '6a939db4ea1f071b8b1f17b1',
      name: 'Final Exam',
      code: 'FIN-2026',
      type: 'final',
      maxScore: 100,
      passingScore: 50,
      weightPercentage: 40,
      assessmentDate: new Date('2026-12-15'),
      status: 'published',
      toObject: vi.fn().mockReturnValue({ _id: '6a939db4ea1f071b8b1f17e1', code: 'FIN-2026' }),
    } as never);

    const payload = {
      schoolId: '6a939db4ea1f071b8b1f17d1',
      branchId: '6a939db4ea1f071b8b1f17c1',
      academicYearId: '6a939db4ea1f071b8b1f17f1',
      classId: '6a939db4ea1f071b8b1f17a1',
      subjectId: '6a939db4ea1f071b8b1f17b1',
      name: 'Final Exam',
      code: 'FIN-2026',
      type: 'final',
      maxScore: 100,
      passingScore: 50,
      weightPercentage: 40,
      assessmentDate: '2026-12-15',
    };

    const res = await request(app).post('/api/v1/assessments').send(payload);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.code).toBe('FIN-2026');
  });
});
