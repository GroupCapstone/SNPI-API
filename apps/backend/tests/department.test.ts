import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createApp } from '../src/app';
import { BranchModel } from '../src/modules/branch/branch.model';
import { DepartmentModel } from '../src/modules/department/department.model';
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
    find: vi.fn(),
    countDocuments: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    findOneAndUpdate: vi.fn(),
  },
}));

vi.mock('../src/modules/position/position.model', () => ({
  PositionModel: {
    countDocuments: vi.fn().mockResolvedValue(0),
  },
}));

describe('Department Module API', () => {
  const app = createApp();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('POST /api/v1/departments - creates department when School and Branch match', async () => {
    vi.mocked(SchoolModel.findOne).mockResolvedValue({
      _id: '507f1f77bcf86cd799439001',
      code: 'SNP',
      status: 'active',
    } as never);

    vi.mocked(BranchModel.findOne).mockResolvedValue({
      _id: '507f1f77bcf86cd799439002',
      schoolId: '507f1f77bcf86cd799439001',
      branchCode: 'MB-01',
      branchNameEn: 'Main Branch',
      status: 'active',
    } as never);

    vi.mocked(DepartmentModel.findOne).mockReturnValue({
      exec: vi.fn().mockResolvedValue(null),
    } as never);

    const createdDept = {
      _id: '507f1f77bcf86cd799439003',
      schoolId: '507f1f77bcf86cd799439001',
      branchId: '507f1f77bcf86cd799439002',
      code: 'ACA',
      nameEn: 'Academic Department',
      nameKh: 'ដេប៉ាតឺម៉ង់សិក្សាធិការ',
      status: 'active',
      toObject: vi.fn().mockReturnValue({ code: 'ACA' }),
    };

    vi.mocked(DepartmentModel.create).mockResolvedValue(createdDept as never);

    const response = await request(app).post('/api/v1/departments').send({
      schoolId: '507f1f77bcf86cd799439001',
      branchId: '507f1f77bcf86cd799439002',
      code: 'ACA',
      nameEn: 'Academic Department',
      nameKh: 'ដេប៉ាតឺម៉ង់សិក្សាធិការ',
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.code).toBe('ACA');
  });

  it('POST /api/v1/departments - rejects when Branch does NOT belong to selected School', async () => {
    vi.mocked(SchoolModel.findOne).mockResolvedValue({
      _id: '507f1f77bcf86cd799439001',
      code: 'SNP',
      status: 'active',
    } as never);

    vi.mocked(BranchModel.findOne).mockResolvedValue({
      _id: '507f1f77bcf86cd799439002',
      schoolId: '507f1f77bcf86cd799439999', // Different school!
      branchCode: 'MB-01',
      branchNameEn: 'Main Branch',
      status: 'active',
    } as never);

    const response = await request(app).post('/api/v1/departments').send({
      schoolId: '507f1f77bcf86cd799439001',
      branchId: '507f1f77bcf86cd799439002',
      code: 'ACA',
      nameEn: 'Academic Department',
      nameKh: 'ដេប៉ាតឺម៉ង់សិក្សាធិការ',
    });

    expect(response.status).toBe(422);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain(
      'Selected branch does not belong to the selected school',
    );
  });

  it('POST /api/v1/departments - rejects duplicate code within same Branch', async () => {
    vi.mocked(SchoolModel.findOne).mockResolvedValue({
      _id: '507f1f77bcf86cd799439001',
      status: 'active',
    } as never);

    vi.mocked(BranchModel.findOne).mockResolvedValue({
      _id: '507f1f77bcf86cd799439002',
      schoolId: '507f1f77bcf86cd799439001',
      branchNameEn: 'Main Branch',
      status: 'active',
    } as never);

    vi.mocked(DepartmentModel.findOne).mockReturnValue({
      exec: vi.fn().mockResolvedValue({ _id: '507f1f77bcf86cd799439003', code: 'ACA' }),
    } as never);

    const response = await request(app).post('/api/v1/departments').send({
      schoolId: '507f1f77bcf86cd799439001',
      branchId: '507f1f77bcf86cd799439002',
      code: 'ACA',
      nameEn: 'Duplicate Department',
      nameKh: 'ស្ទួន',
    });

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('CONFLICT');
  });
});
