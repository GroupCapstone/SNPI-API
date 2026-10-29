import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createApp } from '../src/app';
import { SubjectModel } from '../src/modules/subject/subject.model';

vi.mock('../src/modules/subject/subject.model', () => {
  const mockSubjects = [
    {
      _id: '507f1f77bcf86cd799439033',
      code: 'ENG-READ',
      name: 'Reading & Vocabulary',
      description: 'Reading comprehension and vocab',
      status: 'active',
      isDeleted: false,
      toObject: () => ({ _id: '507f1f77bcf86cd799439033', code: 'ENG-READ' }),
    },
  ];

  return {
    SubjectModel: {
      find: vi.fn().mockReturnValue({
        sort: vi.fn().mockReturnValue({
          skip: vi.fn().mockReturnValue({
            limit: vi.fn().mockReturnValue({
              exec: vi.fn().mockResolvedValue(mockSubjects),
            }),
          }),
        }),
      }),
      countDocuments: vi.fn().mockReturnValue({
        exec: vi.fn().mockResolvedValue(1),
      }),
      findOne: vi.fn().mockImplementation((query: Record<string, unknown>) => ({
        exec: vi.fn().mockImplementation(() => {
          if (query.code === 'ENG-READ') {
            return Promise.resolve(mockSubjects[0]);
          }
          if (query._id === '507f1f77bcf86cd799439033') {
            return Promise.resolve(mockSubjects[0]);
          }
          return Promise.resolve(null);
        }),
      })),
      create: vi.fn().mockImplementation((data) =>
        Promise.resolve({
          ...data,
          _id: '507f1f77bcf86cd799439099',
          toObject: () => ({ ...data, _id: '507f1f77bcf86cd799439099' }),
        }),
      ),
      findOneAndUpdate: vi.fn().mockReturnValue({
        exec: vi.fn().mockResolvedValue({
          _id: '507f1f77bcf86cd799439033',
          code: 'ENG-READ-2',
          name: 'Advanced Reading',
          status: 'active',
          toObject: () => ({ _id: '507f1f77bcf86cd799439033' }),
        }),
      }),
    },
  };
});

describe('Subject API Endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET /api/v1/subjects returns list of subjects', async () => {
    const app = createApp();
    const response = await request(app)
      .get('/api/v1/subjects')
      .set('X-User-Id', '000000000000000000000001')
      .set('X-User-Permissions', 'subject.view.all_branches')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.pagination.total).toBe(1);
  });

  it('POST /api/v1/subjects creates a subject successfully', async () => {
    const app = createApp();
    const response = await request(app)
      .post('/api/v1/subjects')
      .set('X-User-Id', '000000000000000000000001')
      .set('X-User-Permissions', 'subject.create.all_branches')
      .send({
        code: 'ENG-WRIT',
        name: 'Grammar & Writing',
        description: 'Writing composition',
        status: 'active',
      })
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.code).toBe('ENG-WRIT');
    expect(SubjectModel.create).toHaveBeenCalled();
  });
});
