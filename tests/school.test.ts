import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createApp } from '../src/app';
import { SchoolModel } from '../src/modules/school/school.model';

vi.mock('../src/modules/school/school.model', () => ({
  SchoolModel: {
    find: vi.fn(),
    countDocuments: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    findOneAndUpdate: vi.fn(),
  },
}));

vi.mock('../src/modules/branch/branch.model', () => ({
  BranchModel: {
    countDocuments: vi.fn().mockResolvedValue(0),
  },
}));

describe('School Module API', () => {
  const app = createApp();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET /api/v1/schools - returns paginated schools', async () => {
    const mockSchools = [
      {
        _id: '507f1f77bcf86cd799439011',
        code: 'SNP',
        nameEn: 'SNP International School',
        nameKh: 'សាលាអន្តរជាតិ អេសអិនភី',
        status: 'active',
        isDeleted: false,
      },
    ];

    vi.mocked(SchoolModel.find).mockReturnValue({
      sort: vi.fn().mockReturnValue({
        skip: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            exec: vi.fn().mockResolvedValue(mockSchools),
          }),
        }),
      }),
    } as never);

    vi.mocked(SchoolModel.countDocuments).mockReturnValue({
      exec: vi.fn().mockResolvedValue(1),
    } as never);

    const response = await request(app).get('/api/v1/schools');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].code).toBe('SNP');
  });

  it('POST /api/v1/schools - creates school successfully', async () => {
    vi.mocked(SchoolModel.findOne).mockReturnValue({
      exec: vi.fn().mockResolvedValue(null),
    } as never);

    const createdSchool = {
      _id: '507f1f77bcf86cd799439011',
      code: 'SNP',
      nameEn: 'SNP International School',
      nameKh: 'សាលាអន្តរជាតិ អេសអិនភី',
      status: 'active',
      isDeleted: false,
      toObject: vi.fn().mockReturnValue({ code: 'SNP' }),
    };

    vi.mocked(SchoolModel.create).mockResolvedValue(createdSchool as never);

    const response = await request(app).post('/api/v1/schools').send({
      code: 'SNP',
      nameEn: 'SNP International School',
      nameKh: 'សាលាអន្តរជាតិ អេសអិនភី',
      email: 'info@snp.edu.kh',
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.code).toBe('SNP');
  });

  it('POST /api/v1/schools - rejects duplicate school code (409 Conflict)', async () => {
    vi.mocked(SchoolModel.findOne).mockReturnValue({
      exec: vi.fn().mockResolvedValue({ _id: '507f1f77bcf86cd799439011', code: 'SNP' }),
    } as never);

    const response = await request(app).post('/api/v1/schools').send({
      code: 'SNP',
      nameEn: 'Duplicate School',
      nameKh: 'សាលាស្ទួន',
    });

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('CONFLICT');
  });

  it('GET /api/v1/schools - rejects unauthenticated or unauthorized access', async () => {
    const response = await request(app)
      .get('/api/v1/schools')
      .set('X-User-Id', 'user-no-perms')
      .set('X-User-Permissions', 'program.view.own_branch');

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('FORBIDDEN');
  });
});
