import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createApp } from '../src/app';
import { BranchModel } from '../src/modules/branch/branch.model';
import { SchoolModel } from '../src/modules/school/school.model';

vi.mock('../src/modules/school/school.model', () => ({
  SchoolModel: {
    findOne: vi.fn(),
  },
}));

vi.mock('../src/modules/branch/branch.model', () => ({
  BranchModel: {
    find: vi.fn(),
    countDocuments: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    findOneAndUpdate: vi.fn(),
  },
}));

vi.mock('../src/modules/class/class.model', () => ({
  ClassModel: {
    countDocuments: vi.fn().mockResolvedValue(0),
  },
}));

describe('Branch Module API', () => {
  const app = createApp();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET /api/v1/branches - returns branches list', async () => {
    const mockBranches = [
      {
        _id: '507f1f77bcf86cd799439011',
        schoolId: '507f1f77bcf86cd799439012',
        branchCode: 'MB-01',
        branchNameEn: 'Main Branch',
        branchNameKh: 'សាខាធំ',
        status: 'active',
      },
    ];

    vi.mocked(BranchModel.find).mockReturnValue({
      populate: vi.fn().mockReturnValue({
        sort: vi.fn().mockReturnValue({
          skip: vi.fn().mockReturnValue({
            limit: vi.fn().mockReturnValue({
              exec: vi.fn().mockResolvedValue(mockBranches),
            }),
          }),
        }),
      }),
    } as never);

    vi.mocked(BranchModel.countDocuments).mockReturnValue({
      exec: vi.fn().mockResolvedValue(1),
    } as never);

    const response = await request(app).get('/api/v1/branches');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(1);
  });

  it('POST /api/v1/branches - creates branch when School exists', async () => {
    vi.mocked(SchoolModel.findOne).mockResolvedValue({
      _id: '507f1f77bcf86cd799439012',
      code: 'SNP',
      nameEn: 'SNP International School',
      status: 'active',
    } as never);

    vi.mocked(BranchModel.findOne).mockReturnValue({
      exec: vi.fn().mockResolvedValue(null),
    } as never);

    const createdBranch = {
      _id: '507f1f77bcf86cd799439011',
      schoolId: '507f1f77bcf86cd799439012',
      branchCode: 'MB-01',
      branchNameEn: 'Main Branch',
      branchNameKh: 'សាខាធំ',
      status: 'active',
      toObject: vi.fn().mockReturnValue({ branchCode: 'MB-01' }),
    };

    vi.mocked(BranchModel.create).mockResolvedValue(createdBranch as never);

    const response = await request(app).post('/api/v1/branches').send({
      schoolId: '507f1f77bcf86cd799439012',
      branchCode: 'MB-01',
      branchNameEn: 'Main Branch',
      branchNameKh: 'សាខាធំ',
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.branchCode).toBe('MB-01');
  });

  it('POST /api/v1/branches - rejects branch with nonexistent School', async () => {
    vi.mocked(SchoolModel.findOne).mockResolvedValue(null);

    const response = await request(app).post('/api/v1/branches').send({
      schoolId: '507f1f77bcf86cd799439099',
      branchCode: 'TK-02',
      branchNameEn: 'Toul Kork',
      branchNameKh: 'ទួលគោក',
    });

    expect(response.status).toBe(422);
    expect(response.body.success).toBe(false);
  });

  it('POST /api/v1/branches - rejects duplicate branchCode within same School', async () => {
    vi.mocked(SchoolModel.findOne).mockResolvedValue({
      _id: '507f1f77bcf86cd799439012',
      code: 'SNP',
      nameEn: 'SNP International School',
      status: 'active',
    } as never);

    vi.mocked(BranchModel.findOne).mockReturnValue({
      exec: vi.fn().mockResolvedValue({ _id: '507f1f77bcf86cd799439011', branchCode: 'MB-01' }),
    } as never);

    const response = await request(app).post('/api/v1/branches').send({
      schoolId: '507f1f77bcf86cd799439012',
      branchCode: 'MB-01',
      branchNameEn: 'Duplicate Branch',
      branchNameKh: 'សាខាស្ទួន',
    });

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('CONFLICT');
  });
});
