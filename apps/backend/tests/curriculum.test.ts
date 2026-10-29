import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createApp } from '../src/app';
import { AcademicYearModel } from '../src/modules/academic-year/academic-year.model';
import { CurriculumModel } from '../src/modules/curriculum/curriculum.model';
import { LevelModel } from '../src/modules/level/level.model';
import { ProgramModel } from '../src/modules/program/program.model';

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

vi.mock('../src/modules/academic-year/academic-year.model', () => ({
  AcademicYearModel: {
    findOne: vi.fn(),
  },
}));

vi.mock('../src/modules/subject/subject.model', () => ({
  SubjectModel: {
    countDocuments: vi.fn().mockResolvedValue(1),
  },
}));

vi.mock('../src/modules/curriculum/curriculum.model', () => {
  const mockCurriculum = {
    _id: '507f1f77bcf86cd799439044',
    code: 'CURR-ENG-ELEM-2026',
    name: 'English Elementary Curriculum',
    programId: '507f1f77bcf86cd799439001',
    levelId: '507f1f77bcf86cd799439002',
    academicYearId: '507f1f77bcf86cd799439003',
    subjects: [
      {
        subjectId: '507f1f77bcf86cd799439033',
        weeklyHours: 3,
        totalHours: 48,
        sequence: 1,
        passingScore: 50,
        isRequired: true,
      },
    ],
    status: 'active',
    isDeleted: false,
    toObject: () => ({ _id: '507f1f77bcf86cd799439044', code: 'CURR-ENG-ELEM-2026' }),
  };

  return {
    CurriculumModel: {
      find: vi.fn().mockReturnValue({
        populate: vi.fn().mockReturnThis(),
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnValue({
          exec: vi.fn().mockResolvedValue([mockCurriculum]),
        }),
      }),
      countDocuments: vi.fn().mockReturnValue({
        exec: vi.fn().mockResolvedValue(1),
      }),
      findOne: vi.fn().mockReturnValue({
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(mockCurriculum),
      }),
      create: vi.fn().mockImplementation((data) =>
        Promise.resolve({
          ...data,
          _id: '507f1f77bcf86cd799439044',
          toObject: () => ({ ...data, _id: '507f1f77bcf86cd799439044' }),
        }),
      ),
      findOneAndUpdate: vi.fn().mockReturnValue({
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue({
          ...mockCurriculum,
          name: 'Updated English Curriculum',
          toObject: () => ({ _id: '507f1f77bcf86cd799439044' }),
        }),
      }),
    },
  };
});

describe('Curriculum API Endpoints', () => {
  const app = createApp();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET /api/v1/curriculum returns paginated curricula', async () => {
    const response = await request(app)
      .get('/api/v1/curriculum')
      .set('X-User-Id', '000000000000000000000001')
      .set('X-User-Permissions', 'curriculum.view.all_branches')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.pagination.total).toBe(1);
  });

  it('POST /api/v1/curriculum creates a curriculum successfully', async () => {
    vi.mocked(ProgramModel.findOne).mockResolvedValue({
      _id: '507f1f77bcf86cd799439001',
      code: 'ENG',
      nameEn: 'General English Program',
      isDeleted: false,
    } as never);

    vi.mocked(LevelModel.findOne).mockResolvedValue({
      _id: '507f1f77bcf86cd799439002',
      programId: '507f1f77bcf86cd799439001',
      name: 'Elementary',
      isDeleted: false,
    } as never);

    vi.mocked(AcademicYearModel.findOne).mockResolvedValue({
      _id: '507f1f77bcf86cd799439003',
      name: '2026-2027',
      isDeleted: false,
    } as never);

    vi.mocked(CurriculumModel.findOne).mockReturnValue({
      exec: vi.fn().mockResolvedValue(null),
    } as never);

    const response = await request(app)
      .post('/api/v1/curriculum')
      .set('X-User-Id', '000000000000000000000001')
      .set('X-User-Permissions', 'curriculum.create.all_branches')
      .send({
        programId: '507f1f77bcf86cd799439001',
        levelId: '507f1f77bcf86cd799439002',
        academicYearId: '507f1f77bcf86cd799439003',
        code: 'CURR-ENG-ELEM-2026',
        name: 'English Elementary Standard Curriculum',
        subjects: [
          {
            subjectId: '507f1f77bcf86cd799439033',
            weeklyHours: 3,
            totalHours: 48,
            sequence: 1,
            passingScore: 50,
            isRequired: true,
          },
        ],
        status: 'active',
      })
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.code).toBe('CURR-ENG-ELEM-2026');
  });
});
