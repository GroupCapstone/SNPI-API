import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createApp } from '../src/app';
import { AcademicYearModel } from '../src/modules/academic-year/academic-year.model';
import { BranchModel } from '../src/modules/branch/branch.model';
import { ProgramModel } from '../src/modules/program/program.model';
import { RegistrationModel } from '../src/modules/registration/registration.model';
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

vi.mock('../src/modules/academic-year/academic-year.model', () => ({
  AcademicYearModel: {
    findOne: vi.fn(),
  },
}));

vi.mock('../src/modules/program/program.model', () => ({
  ProgramModel: {
    findOne: vi.fn(),
  },
}));

vi.mock('../src/modules/sequence/sequence.model', () => ({
  SequenceModel: {
    findOneAndUpdate: vi.fn(),
  },
}));

vi.mock('../src/modules/registration/registration.model', () => ({
  RegistrationModel: {
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
  },
}));

describe('Admissions Registration API Tests', () => {
  const app = createApp();

  const schoolId = '507f1f77bcf86cd799439001';
  const branchId = '507f1f77bcf86cd799439002';
  const academicYearId = '507f1f77bcf86cd799439003';
  const programId = '507f1f77bcf86cd799439004';
  const registrationId = '507f1f77bcf86cd799439005';

  const mockRegistration = {
    _id: registrationId,
    registrationNumber: 'REG-000001',
    schoolId: { _id: schoolId, code: 'SNP', nameEn: 'SNP International' },
    branchId: { _id: branchId, branchCode: 'MB-01', branchNameEn: 'Main Branch' },
    academicYearId: { _id: academicYearId, name: '2026–2027 Academic Year' },
    programId: { _id: programId, programCode: 'GEP', programNameEn: 'General English Program' },
    firstName: 'Bopha',
    lastName: 'Kouy',
    khmerName: 'គុយ បុប្ផា',
    gender: 'female',
    dateOfBirth: new Date('2016-04-15'),
    phone: '012334455',
    guardianName: 'Kouy Vanna',
    guardianRelationship: 'father',
    guardianPhone: '012334455',
    status: 'registered',
    isDeleted: false,
    toObject: vi.fn().mockReturnValue({ registrationNumber: 'REG-000001' }),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/v1/registrations', () => {
    it('returns a paginated list of registrations', async () => {
      const mockQuery = {
        populate: vi.fn().mockReturnThis(),
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue([mockRegistration]),
      };

      vi.mocked(RegistrationModel.find).mockReturnValue(mockQuery as never);
      vi.mocked(RegistrationModel.countDocuments).mockReturnValue({
        exec: vi.fn().mockResolvedValue(1),
      } as never);

      const response = await request(app).get('/api/v1/registrations?page=1&limit=10');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].registrationNumber).toBe('REG-000001');
      expect(response.body.pagination.total).toBe(1);
    });
  });

  describe('POST /api/v1/registrations', () => {
    it('creates registration and auto-generates REG sequence ID', async () => {
      vi.mocked(SchoolModel.findOne).mockResolvedValue({
        _id: schoolId,
        isDeleted: false,
      } as never);
      vi.mocked(BranchModel.findOne).mockResolvedValue({
        _id: branchId,
        schoolId,
        isDeleted: false,
      } as never);
      vi.mocked(AcademicYearModel.findOne).mockResolvedValue({
        _id: academicYearId,
        schoolId,
        isDeleted: false,
      } as never);
      vi.mocked(ProgramModel.findOne).mockResolvedValue({
        _id: programId,
        schoolId,
        isDeleted: false,
      } as never);

      vi.mocked(RegistrationModel.findOne).mockReturnValue({
        exec: vi.fn().mockResolvedValue(null),
      } as never);
      vi.mocked(SequenceModel.findOneAndUpdate).mockReturnValue({
        exec: vi.fn().mockResolvedValue({ currentSequence: 1 }),
      } as never);
      vi.mocked(RegistrationModel.create).mockResolvedValue(mockRegistration as never);

      const payload = {
        schoolId,
        branchId,
        academicYearId,
        programId,
        firstName: 'Bopha',
        lastName: 'Kouy',
        khmerName: 'គុយ បុប្ផា',
        gender: 'female',
        dateOfBirth: '2016-04-15',
        phone: '012334455',
        guardianName: 'Kouy Vanna',
        guardianRelationship: 'father',
        guardianPhone: '012334455',
      };

      const response = await request(app).post('/api/v1/registrations').send(payload);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.registrationNumber).toBe('REG-000001');
    });

    it('rejects registration if school does not exist', async () => {
      vi.mocked(SchoolModel.findOne).mockResolvedValue(null as never);

      const payload = {
        schoolId,
        branchId,
        academicYearId,
        programId,
        firstName: 'Bopha',
        lastName: 'Kouy',
        khmerName: 'គុយ បុប្ផា',
        gender: 'female',
        dateOfBirth: '2016-04-15',
        phone: '012334455',
        guardianName: 'Kouy Vanna',
        guardianRelationship: 'father',
        guardianPhone: '012334455',
      };

      const response = await request(app).post('/api/v1/registrations').send(payload);

      expect(response.status).toBe(422);
      expect(response.body.message).toMatch(/Selected school with ID .* does not exist/);
    });
  });

  describe('GET /api/v1/registrations/:id', () => {
    it('returns registration by ID', async () => {
      const mockQuery = {
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(mockRegistration),
      };
      vi.mocked(RegistrationModel.findOne).mockReturnValue(mockQuery as never);

      const response = await request(app).get(`/api/v1/registrations/${registrationId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.registrationNumber).toBe('REG-000001');
    });

    it('returns 404 if registration not found', async () => {
      const mockQuery = {
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(null),
      };
      vi.mocked(RegistrationModel.findOne).mockReturnValue(mockQuery as never);

      const response = await request(app).get(`/api/v1/registrations/${registrationId}`);

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/v1/registrations/:id', () => {
    it('soft deletes registration record', async () => {
      const mockQuery = {
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(mockRegistration),
      };
      vi.mocked(RegistrationModel.findOne).mockReturnValue(mockQuery as never);
      vi.mocked(RegistrationModel.findOneAndUpdate).mockReturnValue({
        exec: vi.fn().mockResolvedValue(mockRegistration),
      } as never);

      const response = await request(app).delete(`/api/v1/registrations/${registrationId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});
