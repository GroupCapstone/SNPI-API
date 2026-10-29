import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createApp } from '../src/app';
import { ProgramModel } from '../src/modules/program/program.model';

vi.mock('../src/modules/program/program.model', () => {
  const mockPrograms = [
    {
      _id: '507f1f77bcf86cd799439011',
      code: 'GEP',
      nameEn: 'General English Program',
      nameKh: 'កម្មវិធីភាសាអង់គ្លេសទូទៅ',
      status: 'active',
      isDeleted: false,
      toObject: vi.fn().mockReturnValue({
        _id: '507f1f77bcf86cd799439011',
        code: 'GEP',
        nameEn: 'General English Program',
        nameKh: 'កម្មវិធីភាសាអង់គ្លេសទូទៅ',
        status: 'active',
      }),
    },
  ];

  return {
    ProgramModel: {
      find: vi.fn().mockReturnValue({
        sort: vi.fn().mockReturnValue({
          skip: vi.fn().mockReturnValue({
            limit: vi.fn().mockReturnValue({
              exec: vi.fn().mockResolvedValue(mockPrograms),
            }),
          }),
        }),
      }),
      countDocuments: vi.fn().mockReturnValue({
        exec: vi.fn().mockResolvedValue(1),
      }),
      findOne: vi.fn().mockImplementation((query: Record<string, unknown>) => ({
        exec: vi.fn().mockImplementation(() => {
          if (query.code === 'GEP') {
            return Promise.resolve(mockPrograms[0]);
          }
          if (query._id === '507f1f77bcf86cd799439011') {
            return Promise.resolve(mockPrograms[0]);
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
          _id: '507f1f77bcf86cd799439011',
          code: 'GEP-UPDATED',
          nameEn: 'General English Program',
          nameKh: 'កម្មវិធីភាសាអង់គ្លេសទូទៅ',
          status: 'active',
          toObject: () => ({ _id: '507f1f77bcf86cd799439011' }),
        }),
      }),
    },
  };
});

describe('Program API Endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET /api/v1/programs returns paginated list of programs', async () => {
    const app = createApp();
    const response = await request(app)
      .get('/api/v1/programs')
      .set('X-User-Id', '000000000000000000000001')
      .set('X-User-Permissions', 'program.view.all_branches')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.pagination).toBeDefined();
    expect(response.body.pagination.total).toBe(1);
  });

  it('POST /api/v1/programs creates a new program successfully', async () => {
    const app = createApp();
    const response = await request(app)
      .post('/api/v1/programs')
      .set('X-User-Id', '000000000000000000000001')
      .set('X-User-Permissions', 'program.create.all_branches')
      .send({
        code: 'NEWPROG',
        nameEn: 'New Test Program',
        nameKh: 'កម្មវិធីសាកល្បង',
        description: 'Testing description',
        status: 'active',
      })
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.code).toBe('NEWPROG');
    expect(ProgramModel.create).toHaveBeenCalled();
  });

  it('POST /api/v1/programs rejects invalid input', async () => {
    const app = createApp();
    const response = await request(app)
      .post('/api/v1/programs')
      .set('X-User-Id', '000000000000000000000001')
      .set('X-User-Permissions', 'program.create.all_branches')
      .send({
        code: '', // invalid empty code
      })
      .expect(422);

    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('VALIDATION_ERROR');
  });

  it('GET /api/v1/programs blocks unauthorized requests without permission', async () => {
    const app = createApp();
    const response = await request(app)
      .get('/api/v1/programs')
      .set('X-User-Id', '000000000000000000000002')
      .set('X-User-Permissions', 'other.permission')
      .expect(403);

    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('FORBIDDEN');
  });
});
