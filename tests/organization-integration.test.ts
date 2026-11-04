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
    create: vi.fn(),
  },
}));

vi.mock('../src/modules/branch/branch.model', () => ({
  BranchModel: {
    find: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    countDocuments: vi.fn(),
  },
}));

vi.mock('../src/modules/department/department.model', () => ({
  DepartmentModel: {
    find: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    countDocuments: vi.fn(),
  },
}));

vi.mock('../src/modules/position/position.model', () => ({
  PositionModel: {
    find: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    countDocuments: vi.fn(),
  },
}));

vi.mock('../src/modules/class/class.model', () => ({
  ClassModel: {
    countDocuments: vi.fn().mockResolvedValue(0),
  },
}));

describe('Organization Full Integration Workflow', () => {
  const app = createApp();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('verifies School -> Branch -> Department -> Position full hierarchy creation', async () => {
    const schoolId = '507f1f77bcf86cd799439001';
    const branchId = '507f1f77bcf86cd799439002';
    const departmentId = '507f1f77bcf86cd799439003';
    const positionId = '507f1f77bcf86cd799439004';

    // 1. Create School
    vi.mocked(SchoolModel.findOne).mockReturnValue({
      exec: vi.fn().mockResolvedValue(null),
    } as never);
    vi.mocked(SchoolModel.create).mockResolvedValue({
      _id: schoolId,
      code: 'SNP',
      nameEn: 'SNP International School',
      toObject: vi.fn().mockReturnValue({ code: 'SNP' }),
    } as never);

    const schoolRes = await request(app).post('/api/v1/schools').send({
      code: 'SNP',
      nameEn: 'SNP International School',
      nameKh: 'សាលាអន្តរជាតិ អេសអិនភី',
    });
    expect(schoolRes.status).toBe(201);

    // 2. Create Branch referencing School
    vi.mocked(SchoolModel.findOne).mockResolvedValue({
      _id: schoolId,
      code: 'SNP',
      status: 'active',
    } as never);
    vi.mocked(BranchModel.findOne).mockReturnValue({
      exec: vi.fn().mockResolvedValue(null),
    } as never);
    vi.mocked(BranchModel.create).mockResolvedValue({
      _id: branchId,
      schoolId,
      branchCode: 'MB-01',
      toObject: vi.fn().mockReturnValue({ branchCode: 'MB-01' }),
    } as never);

    const branchRes = await request(app).post('/api/v1/branches').send({
      schoolId,
      branchCode: 'MB-01',
      branchNameEn: 'Main Branch',
      branchNameKh: 'សាខាធំ',
    });
    expect(branchRes.status).toBe(201);

    // 3. Create Department referencing Branch & School
    vi.mocked(BranchModel.findOne).mockResolvedValue({
      _id: branchId,
      schoolId,
      branchCode: 'MB-01',
      branchNameEn: 'Main Branch',
      status: 'active',
    } as never);
    vi.mocked(DepartmentModel.findOne).mockReturnValue({
      exec: vi.fn().mockResolvedValue(null),
    } as never);
    vi.mocked(DepartmentModel.create).mockResolvedValue({
      _id: departmentId,
      schoolId,
      branchId,
      code: 'ACA',
      toObject: vi.fn().mockReturnValue({ code: 'ACA' }),
    } as never);

    const deptRes = await request(app).post('/api/v1/departments').send({
      schoolId,
      branchId,
      code: 'ACA',
      nameEn: 'Academic Department',
      nameKh: 'ដេប៉ាតឺម៉ង់សិក្សាធិការ',
    });
    expect(deptRes.status).toBe(201);

    // 4. Create Position referencing Department, Branch & School
    vi.mocked(DepartmentModel.findOne).mockResolvedValue({
      _id: departmentId,
      schoolId,
      branchId,
      code: 'ACA',
      status: 'active',
      nameEn: 'Academic',
    } as never);
    vi.mocked(PositionModel.findOne).mockReturnValue({
      exec: vi.fn().mockResolvedValue(null),
    } as never);
    vi.mocked(PositionModel.create).mockResolvedValue({
      _id: positionId,
      schoolId,
      branchId,
      departmentId,
      code: 'TCH-ENG',
      toObject: vi.fn().mockReturnValue({ code: 'TCH-ENG' }),
    } as never);

    const posRes = await request(app).post('/api/v1/positions').send({
      schoolId,
      branchId,
      departmentId,
      code: 'TCH-ENG',
      nameEn: 'English Teacher',
      nameKh: 'គ្រូបង្រៀនភាសាអង់គ្លេស',
    });
    expect(posRes.status).toBe(201);
    expect(posRes.body.data.code).toBe('TCH-ENG');
  });

  it('rejects cross-branch access for restricted Branch Manager', async () => {
    // User only has branchAccess: ['507f1f77bcf86cd799439002']
    // User attempts to create a department for '507f1f77bcf86cd799439999'
    const response = await request(app)
      .post('/api/v1/departments')
      .set('X-User-Id', 'branch-manager-user')
      .set('X-Branch-Access', '507f1f77bcf86cd799439002')
      .send({
        schoolId: '507f1f77bcf86cd799439001',
        branchId: '507f1f77bcf86cd799439999', // Unauthorized branch!
        code: 'ACA',
        nameEn: 'Academic',
        nameKh: 'សិក្សា',
      });

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('FORBIDDEN');
  });
});
