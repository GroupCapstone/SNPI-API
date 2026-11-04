import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createApp } from '../src/app';
import { BranchModel } from '../src/modules/branch/branch.model';
import { DepartmentModel } from '../src/modules/department/department.model';
import { PositionModel } from '../src/modules/position/position.model';
import { SchoolModel } from '../src/modules/school/school.model';

vi.mock('../src/modules/school/school.model', () => ({
  SchoolModel: {
    findOne: vi.fn(),
  },
}));

vi.mock('../src/modules/branch/branch.model', () => ({
  BranchModel: {
    findOne: vi.fn(),
  },
}));

vi.mock('../src/modules/department/department.model', () => ({
  DepartmentModel: {
    findOne: vi.fn(),
  },
}));

vi.mock('../src/modules/position/position.model', () => ({
  PositionModel: {
    find: vi.fn(),
    countDocuments: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    findOneAndUpdate: vi.fn(),
  },
}));

describe('Position Module API', () => {
  const app = createApp();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('POST /api/v1/positions - creates position when hierarchy is valid', async () => {
    vi.mocked(SchoolModel.findOne).mockResolvedValue({
      _id: '507f1f77bcf86cd799439001',
      code: 'SNP',
      status: 'active',
    } as never);

    vi.mocked(BranchModel.findOne).mockResolvedValue({
      _id: '507f1f77bcf86cd799439002',
      schoolId: '507f1f77bcf86cd799439001',
      branchCode: 'MB-01',
      status: 'active',
    } as never);

    vi.mocked(DepartmentModel.findOne).mockResolvedValue({
      _id: '507f1f77bcf86cd799439003',
      schoolId: '507f1f77bcf86cd799439001',
      branchId: '507f1f77bcf86cd799439002',
      code: 'ACA',
      nameEn: 'Academic',
      status: 'active',
    } as never);

    vi.mocked(PositionModel.findOne).mockReturnValue({
      exec: vi.fn().mockResolvedValue(null),
    } as never);

    const createdPos = {
      _id: '507f1f77bcf86cd799439004',
      schoolId: '507f1f77bcf86cd799439001',
      branchId: '507f1f77bcf86cd799439002',
      departmentId: '507f1f77bcf86cd799439003',
      code: 'TCH-ENG',
      nameEn: 'English Teacher',
      nameKh: 'គ្រូបង្រៀនភាសាអង់គ្លេស',
      status: 'active',
      toObject: vi.fn().mockReturnValue({ code: 'TCH-ENG' }),
    };

    vi.mocked(PositionModel.create).mockResolvedValue(createdPos as never);

    const response = await request(app).post('/api/v1/positions').send({
      schoolId: '507f1f77bcf86cd799439001',
      branchId: '507f1f77bcf86cd799439002',
      departmentId: '507f1f77bcf86cd799439003',
      code: 'TCH-ENG',
      nameEn: 'English Teacher',
      nameKh: 'គ្រូបង្រៀនភាសាអង់គ្លេស',
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.code).toBe('TCH-ENG');
  });

  it('POST /api/v1/positions - rejects when Department does NOT belong to selected Branch', async () => {
    vi.mocked(SchoolModel.findOne).mockResolvedValue({
      _id: '507f1f77bcf86cd799439001',
      status: 'active',
    } as never);

    vi.mocked(BranchModel.findOne).mockResolvedValue({
      _id: '507f1f77bcf86cd799439002',
      schoolId: '507f1f77bcf86cd799439001',
      status: 'active',
    } as never);

    vi.mocked(DepartmentModel.findOne).mockResolvedValue({
      _id: '507f1f77bcf86cd799439003',
      branchId: '507f1f77bcf86cd799439888', // Different branch!
      status: 'active',
    } as never);

    const response = await request(app).post('/api/v1/positions').send({
      schoolId: '507f1f77bcf86cd799439001',
      branchId: '507f1f77bcf86cd799439002',
      departmentId: '507f1f77bcf86cd799439003',
      code: 'TCH-ENG',
      nameEn: 'English Teacher',
      nameKh: 'គ្រូបង្រៀនភាសាអង់គ្លេស',
    });

    expect(response.status).toBe(422);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain(
      'Selected department does not belong to the selected branch',
    );
  });
});
