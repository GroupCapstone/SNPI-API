import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createApp } from '../src/app';
import { LevelModel } from '../src/modules/level/level.model';

vi.mock('../src/modules/program/program.model', () => ({
  ProgramModel: {
    findOne: vi.fn().mockImplementation((query: Record<string, unknown>) => ({
      exec: vi.fn().mockImplementation(() => {
        if (query._id === '507f1f77bcf86cd799439011') {
          return Promise.resolve({
            _id: '507f1f77bcf86cd799439011',
            code: 'GEP',
            nameEn: 'General English Program',
          });
        }
        return Promise.resolve(null);
      }),
    })),
  },
}));

vi.mock('../src/modules/level/level.model', () => {
  const mockLevels = [
    {
      _id: '507f1f77bcf86cd799439022',
      programId: '507f1f77bcf86cd799439011',
      code: 'GEP-BEG',
      name: 'Beginner',
      sequence: 1,
      status: 'active',
      isDeleted: false,
      toObject: () => ({ _id: '507f1f77bcf86cd799439022', code: 'GEP-BEG' }),
    },
  ];

  return {
    LevelModel: {
      find: vi.fn().mockReturnValue({
        populate: vi.fn().mockReturnValue({
          sort: vi.fn().mockReturnValue({
            skip: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({
                exec: vi.fn().mockResolvedValue(mockLevels),
              }),
            }),
          }),
        }),
      }),
      countDocuments: vi.fn().mockReturnValue({
        exec: vi.fn().mockResolvedValue(1),
      }),
      findOne: vi.fn().mockImplementation((query: Record<string, unknown>) => ({
        populate: vi.fn().mockReturnValue({
          exec: vi.fn().mockImplementation(() => {
            if (query._id === '507f1f77bcf86cd799439022') {
              return Promise.resolve(mockLevels[0]);
            }
            return Promise.resolve(null);
          }),
        }),
        exec: vi.fn().mockImplementation(() => {
          if (query.code === 'GEP-BEG') {
            return Promise.resolve(mockLevels[0]);
          }
          if (query._id === '507f1f77bcf86cd799439022') {
            return Promise.resolve(mockLevels[0]);
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
        populate: vi.fn().mockReturnValue({
          exec: vi.fn().mockResolvedValue({
            _id: '507f1f77bcf86cd799439022',
            code: 'GEP-BEG',
            name: 'Beginner Updated',
            sequence: 1,
            toObject: () => ({ _id: '507f1f77bcf86cd799439022' }),
          }),
        }),
      }),
    },
  };
});

describe('Level API Endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET /api/v1/levels returns paginated list of levels', async () => {
    const app = createApp();
    const response = await request(app)
      .get('/api/v1/levels')
      .set('X-User-Id', '000000000000000000000001')
      .set('X-User-Permissions', 'level.view.all_branches')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.pagination.total).toBe(1);
  });

  it('POST /api/v1/levels creates a new level for a valid program', async () => {
    const app = createApp();
    const response = await request(app)
      .post('/api/v1/levels')
      .set('X-User-Id', '000000000000000000000001')
      .set('X-User-Permissions', 'level.create.all_branches')
      .send({
        programId: '507f1f77bcf86cd799439011',
        code: 'GEP-ELEM',
        name: 'Elementary',
        sequence: 2,
        status: 'active',
      })
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.code).toBe('GEP-ELEM');
    expect(LevelModel.create).toHaveBeenCalled();
  });

  it('POST /api/v1/levels rejects non-existent programId', async () => {
    const app = createApp();
    const response = await request(app)
      .post('/api/v1/levels')
      .set('X-User-Id', '000000000000000000000001')
      .set('X-User-Permissions', 'level.create.all_branches')
      .send({
        programId: '507f1f77bcf86cd799439999', // non-existent
        code: 'INVALID-LVL',
        name: 'Invalid Level',
        sequence: 1,
      })
      .expect(422);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('Selected program does not exist');
  });
});
