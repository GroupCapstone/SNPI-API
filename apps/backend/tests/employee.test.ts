import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createApp } from '../src/app';
import { BranchModel } from '../src/modules/branch/branch.model';
import { DepartmentModel } from '../src/modules/department/department.model';
import { EmployeeModel } from '../src/modules/employee/employee.model';
import { PositionModel } from '../src/modules/position/position.model';
import { SchoolModel } from '../src/modules/school/school.model';
import { SequenceModel } from '../src/modules/sequence/sequence.model';

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
    findOne: vi.fn(),
  },
}));

vi.mock('../src/modules/sequence/sequence.model', () => ({
  SequenceModel: {
    findOneAndUpdate: vi.fn(),
  },
}));

vi.mock('../src/modules/employee/employee.model', () => ({
  EmployeeModel: {
    find: vi.fn(),
    findOne: vi.fn(),
    findOneAndUpdate: vi.fn(),
    create: vi.fn(),
    countDocuments: vi.fn(),
  },
}));

vi.mock('../src/modules/audit-log/audit-log.service', () => ({
  AuditLogService: class {
    public static log = vi.fn().mockResolvedValue(undefined);
    public getAuditLogs = vi.fn().mockResolvedValue({ data: [], total: 0 });
  },
}));

describe('Employee Master API Tests', () => {
  const app = createApp();

  const schoolId = '507f1f77bcf86cd799439001';
  const branchId = '507f1f77bcf86cd799439002';
  const departmentId = '507f1f77bcf86cd799439003';
  const positionId = '507f1f77bcf86cd799439004';
  const employeeObjectId = '507f1f77bcf86cd799439005';

  const mockEmployee = {
    _id: employeeObjectId,
    employeeId: 'EMP-000001',
    legacyEmployeeNumber: 'LEG-01',
    schoolId: { _id: schoolId, code: 'SNP', nameEn: 'SNP International' },
    branchId: { _id: branchId, branchCode: 'MB-01', branchNameEn: 'Main Branch' },
    departmentId: { _id: departmentId, code: 'ACA', nameEn: 'Academic Department' },
    positionId: { _id: positionId, code: 'TCH-ENG', nameEn: 'English Teacher' },
    firstName: 'Dara',
    lastName: 'Sok',
    khmerName: 'សុខ តារា',
    gender: 'male',
    dateOfBirth: new Date('1990-05-15'),
    nationality: 'Cambodian',
    ethnicity: 'Khmer',
    nationalIdNumber: '010203040',
    maritalStatus: 'married',
    numberOfChildren: 2,
    birthplace: {
      province: 'Battambang',
      district: 'Moung Ruessei',
      commune: 'Prey Touch',
      village: 'Phum 1',
    },
    currentAddress: {
      province: 'Phnom Penh',
      district: 'Tuol Kouk',
      commune: 'Tuek L’ak 1',
      village: 'Phum 3',
      additionalAddress: '#123, St 598',
    },
    phone: '+85512345678',
    primaryPhone: '+85512345678',
    secondaryPhone: '+85598765432',
    email: 'dara.sok@snp.edu.kh',
    educationLevel: 'bachelor',
    major: 'English Literature',
    foreignLanguages: ['English', 'Thai'],
    otherSkills: ['Microsoft Office', 'Curriculum Design'],
    workExperienceSummary: '5 years teaching English in high schools',
    father: {
      name: 'Sok Mean',
      age: 65,
      nationality: 'Cambodian',
      ethnicity: 'Khmer',
      livingStatus: 'living',
      occupation: 'Farmer',
    },
    mother: {
      name: 'Chan Rath',
      age: 62,
      nationality: 'Cambodian',
      ethnicity: 'Khmer',
      livingStatus: 'living',
      occupation: 'Homemaker',
    },
    documents: [
      {
        documentType: 'CV / Resume',
        fileName: 'dara_cv.pdf',
        fileUrl: 'https://cdn.snp.edu.kh/docs/dara_cv.pdf',
        status: 'active',
      },
    ],
    employmentType: 'full_time',
    joiningDate: new Date('2024-01-01'),
    status: 'active',
    isDeleted: false,
    toObject: vi.fn().mockReturnValue({ employeeId: 'EMP-000001' }),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/v1/employees', () => {
    it('returns a paginated list of employees with search and filters', async () => {
      const mockQuery = {
        populate: vi.fn().mockReturnThis(),
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue([mockEmployee]),
      };

      vi.mocked(EmployeeModel.find).mockReturnValue(mockQuery as never);
      vi.mocked(EmployeeModel.countDocuments).mockReturnValue({
        exec: vi.fn().mockResolvedValue(1),
      } as never);

      const response = await request(app).get(
        '/api/v1/employees?search=Dara&status=active&employmentType=full_time',
      );

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.pagination.total).toBe(1);
    });

    it('successfully returns employees with limit=200 for dropdown and selection dialogs', async () => {
      const mockQuery = {
        populate: vi.fn().mockReturnThis(),
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue([mockEmployee]),
      };

      vi.mocked(EmployeeModel.find).mockReturnValue(mockQuery as never);
      vi.mocked(EmployeeModel.countDocuments).mockReturnValue({
        exec: vi.fn().mockResolvedValue(1),
      } as never);

      const response = await request(app).get('/api/v1/employees?status=active&limit=200');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(mockQuery.limit).toHaveBeenCalledWith(200);
    });
  });

  describe('GET /api/v1/employees/:id', () => {
    it('returns complete employee details when found', async () => {
      const mockQuery = {
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(mockEmployee),
      };

      vi.mocked(EmployeeModel.findOne).mockReturnValue(mockQuery as never);

      const response = await request(app).get(`/api/v1/employees/${employeeObjectId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.employeeId).toBe('EMP-000001');
      expect(response.body.data.birthplace.province).toBe('Battambang');
      expect(response.body.data.father.name).toBe('Sok Mean');
    });

    it('returns 404 if employee does not exist', async () => {
      const mockQuery = {
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(null),
      };

      vi.mocked(EmployeeModel.findOne).mockReturnValue(mockQuery as never);

      const response = await request(app).get('/api/v1/employees/507f1f77bcf86cd799439099');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('allows staff to view only their linked employment record', async () => {
      const mockQuery = {
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(mockEmployee),
      };
      vi.mocked(EmployeeModel.findOne).mockReturnValue(mockQuery as never);
      const headers = {
        'X-User-Id': 'staff-user',
        'X-Employee-Id': employeeObjectId,
        'X-User-Roles': 'staff',
        'X-User-Permissions': 'employee.view.own_record',
        'X-Branch-Access': branchId,
      };

      const ownResponse = await request(app)
        .get(`/api/v1/employees/${employeeObjectId}`)
        .set(headers);
      const otherResponse = await request(app)
        .get('/api/v1/employees/507f1f77bcf86cd799439099')
        .set(headers);
      const listResponse = await request(app).get('/api/v1/employees').set(headers);

      expect(ownResponse.status).toBe(200);
      expect(otherResponse.status).toBe(403);
      expect(listResponse.status).toBe(403);
    });
  });

  describe('POST /api/v1/employees', () => {
    it('creates an employee with full 8-section HR data and auto-generates EMP sequence ID', async () => {
      vi.mocked(SchoolModel.findOne).mockResolvedValue({
        _id: schoolId,
        code: 'SNP',
      } as never);

      vi.mocked(BranchModel.findOne).mockResolvedValue({
        _id: branchId,
        schoolId,
        branchCode: 'MB-01',
      } as never);

      vi.mocked(DepartmentModel.findOne).mockResolvedValue({
        _id: departmentId,
        schoolId,
        branchId,
        code: 'ACA',
      } as never);

      vi.mocked(PositionModel.findOne).mockResolvedValue({
        _id: positionId,
        schoolId,
        branchId,
        departmentId,
        code: 'TCH-ENG',
      } as never);

      vi.mocked(SequenceModel.findOneAndUpdate).mockReturnValue({
        exec: vi.fn().mockResolvedValue({ currentSequence: 1 }),
      } as never);

      vi.mocked(EmployeeModel.findOne).mockReturnValue({
        exec: vi.fn().mockResolvedValue(null),
      } as never);

      vi.mocked(EmployeeModel.create).mockResolvedValue(mockEmployee as never);

      const response = await request(app)
        .post('/api/v1/employees')
        .send({
          schoolId,
          branchId,
          departmentId,
          positionId,
          legacyEmployeeNumber: 'LEG-01',
          firstName: 'Dara',
          lastName: 'Sok',
          khmerName: 'សុខ តារា',
          gender: 'male',
          dateOfBirth: '1990-05-15',
          nationality: 'Cambodian',
          ethnicity: 'Khmer',
          nationalIdNumber: '010203040',
          maritalStatus: 'married',
          numberOfChildren: 2,
          birthplace: {
            province: 'Battambang',
            district: 'Moung Ruessei',
            commune: 'Prey Touch',
            village: 'Phum 1',
          },
          currentAddress: {
            province: 'Phnom Penh',
            district: 'Tuol Kouk',
            commune: 'Tuek L’ak 1',
            village: 'Phum 3',
            additionalAddress: '#123, St 598',
          },
          primaryPhone: '+85512345678',
          secondaryPhone: '+85598765432',
          email: 'dara.sok@snp.edu.kh',
          educationLevel: 'bachelor',
          major: 'English Literature',
          foreignLanguages: ['English', 'Thai'],
          otherSkills: ['Microsoft Office'],
          workExperienceSummary: '5 years teaching English in high schools',
          father: {
            name: 'Sok Mean',
            age: 65,
            livingStatus: 'living',
          },
          mother: {
            name: 'Chan Rath',
            age: 62,
            livingStatus: 'living',
          },
          employmentType: 'full_time',
          joiningDate: '2024-01-01',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.employeeId).toBe('EMP-000001');
    });

    it('rejects creation when Department does not belong to Branch', async () => {
      vi.mocked(SchoolModel.findOne).mockResolvedValue({
        _id: schoolId,
        code: 'SNP',
      } as never);

      vi.mocked(BranchModel.findOne).mockResolvedValue({
        _id: branchId,
        schoolId,
        branchCode: 'MB-01',
      } as never);

      // Department belongs to another branch
      vi.mocked(DepartmentModel.findOne).mockResolvedValue({
        _id: departmentId,
        schoolId,
        branchId: '507f1f77bcf86cd799439999',
        code: 'ACA',
      } as never);

      const response = await request(app).post('/api/v1/employees').send({
        schoolId,
        branchId,
        departmentId,
        positionId,
        firstName: 'Dara',
        lastName: 'Sok',
        khmerName: 'សុខ តារា',
        gender: 'male',
        dateOfBirth: '1990-05-15',
        employmentType: 'full_time',
        joiningDate: '2024-01-01',
      });

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
    });

    it('rejects creation when Position does not belong to Department', async () => {
      vi.mocked(SchoolModel.findOne).mockResolvedValue({
        _id: schoolId,
        code: 'SNP',
      } as never);

      vi.mocked(BranchModel.findOne).mockResolvedValue({
        _id: branchId,
        schoolId,
        branchCode: 'MB-01',
      } as never);

      vi.mocked(DepartmentModel.findOne).mockResolvedValue({
        _id: departmentId,
        schoolId,
        branchId,
        code: 'ACA',
      } as never);

      // Position belongs to another department
      vi.mocked(PositionModel.findOne).mockResolvedValue({
        _id: positionId,
        schoolId,
        branchId,
        departmentId: '507f1f77bcf86cd799439888',
        code: 'TCH-ENG',
      } as never);

      const response = await request(app).post('/api/v1/employees').send({
        schoolId,
        branchId,
        departmentId,
        positionId,
        firstName: 'Dara',
        lastName: 'Sok',
        khmerName: 'សុខ តារា',
        gender: 'male',
        dateOfBirth: '1990-05-15',
        employmentType: 'full_time',
        joiningDate: '2024-01-01',
      });

      expect(response.status).toBe(422);
      expect(response.body.message).toMatch(/does not belong to department/);
    });

    it('rejects creation when user lacks permission', async () => {
      const response = await request(app)
        .post('/api/v1/employees')
        .set('X-User-Id', 'test-user-id')
        .set('X-User-Permissions', 'school.view.all_branches')
        .send({
          schoolId,
          branchId,
          departmentId,
          positionId,
          firstName: 'Dara',
          lastName: 'Sok',
          khmerName: 'សុខ តារា',
          gender: 'male',
          dateOfBirth: '1990-05-15',
          employmentType: 'full_time',
          joiningDate: '2024-01-01',
        });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PATCH /api/v1/employees/:id', () => {
    it('updates an employee record with new address and family information', async () => {
      vi.mocked(EmployeeModel.findOne).mockReturnValue({
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(mockEmployee),
      } as never);

      const updatedMock = {
        ...mockEmployee,
        primaryPhone: '+85599887766',
        currentAddress: {
          province: 'Kandal',
          district: 'Ta Khmau',
        },
        toObject: vi.fn().mockReturnValue({ primaryPhone: '+85599887766' }),
      };

      vi.mocked(EmployeeModel.findOneAndUpdate).mockReturnValue({
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(updatedMock),
      } as never);

      const response = await request(app)
        .patch(`/api/v1/employees/${employeeObjectId}`)
        .send({
          primaryPhone: '+85599887766',
          currentAddress: {
            province: 'Kandal',
            district: 'Ta Khmau',
          },
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('DELETE /api/v1/employees/:id', () => {
    it('soft deletes an employee record', async () => {
      vi.mocked(EmployeeModel.findOne).mockReturnValue({
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(mockEmployee),
      } as never);

      vi.mocked(EmployeeModel.findOneAndUpdate).mockReturnValue({
        exec: vi.fn().mockResolvedValue({ ...mockEmployee, isDeleted: true }),
      } as never);

      const response = await request(app).delete(`/api/v1/employees/${employeeObjectId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});
