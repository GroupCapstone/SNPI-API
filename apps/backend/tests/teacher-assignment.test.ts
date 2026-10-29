import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createApp } from '../src/app';
import { AcademicYearModel } from '../src/modules/academic-year/academic-year.model';
import { BranchModel } from '../src/modules/branch/branch.model';
import { ClassModel } from '../src/modules/class/class.model';
import { EmployeeModel } from '../src/modules/employee/employee.model';
import { SchoolModel } from '../src/modules/school/school.model';
import { SubjectModel } from '../src/modules/subject/subject.model';
import { TeacherAssignmentModel } from '../src/modules/teacher-assignment/teacher-assignment.model';

vi.mock('../src/modules/school/school.model', () => ({
  SchoolModel: { findOne: vi.fn() },
}));

vi.mock('../src/modules/branch/branch.model', () => ({
  BranchModel: { findOne: vi.fn() },
}));

vi.mock('../src/modules/academic-year/academic-year.model', () => ({
  AcademicYearModel: { findOne: vi.fn() },
}));

vi.mock('../src/modules/employee/employee.model', () => ({
  EmployeeModel: { findOne: vi.fn() },
}));

vi.mock('../src/modules/class/class.model', () => ({
  ClassModel: { findOne: vi.fn() },
}));

vi.mock('../src/modules/subject/subject.model', () => ({
  SubjectModel: { findOne: vi.fn() },
}));

vi.mock('../src/modules/teacher-assignment/teacher-assignment.model', () => ({
  TeacherAssignmentModel: {
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

describe('Teacher Assignment API Tests', () => {
  const app = createApp();

  const schoolId = '507f1f77bcf86cd799439001';
  const branchId = '507f1f77bcf86cd799439002';
  const academicYearId = '507f1f77bcf86cd799439003';
  const employeeId = '507f1f77bcf86cd799439004';
  const classId = '507f1f77bcf86cd799439005';
  const subjectId = '507f1f77bcf86cd799439006';
  const assignmentId = '507f1f77bcf86cd799439007';

  const mockAssignment = {
    _id: assignmentId,
    schoolId: { _id: schoolId, nameEn: 'SNP' },
    branchId: { _id: branchId, branchNameEn: 'Main Branch' },
    academicYearId: { _id: academicYearId, name: '2026-2027' },
    employeeId: { _id: employeeId, firstName: 'Dara', lastName: 'Sok' },
    classId: { _id: classId, className: 'GEP-1A' },
    subjectId: { _id: subjectId, subjectNameEn: 'English Communication' },
    roleInClass: 'subject_teacher',
    status: 'active',
    isDeleted: false,
    toObject: vi.fn().mockReturnValue({ roleInClass: 'subject_teacher' }),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/v1/teacher-assignments', () => {
    it('returns paginated list of teacher assignments', async () => {
      const mockQuery = {
        populate: vi.fn().mockReturnThis(),
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue([mockAssignment]),
      };

      vi.mocked(TeacherAssignmentModel.find).mockReturnValue(mockQuery as never);
      vi.mocked(TeacherAssignmentModel.countDocuments).mockReturnValue({
        exec: vi.fn().mockResolvedValue(1),
      } as never);

      const response = await request(app).get('/api/v1/teacher-assignments?page=1&limit=10');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
    });
  });

  describe('POST /api/v1/teacher-assignments', () => {
    it('creates teacher assignment successfully', async () => {
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
      vi.mocked(EmployeeModel.findOne).mockResolvedValue({
        _id: employeeId,
        schoolId,
        branchId,
        status: 'active',
        isDeleted: false,
      } as never);
      vi.mocked(ClassModel.findOne).mockResolvedValue({
        _id: classId,
        branchId,
        isDeleted: false,
      } as never);
      vi.mocked(SubjectModel.findOne).mockResolvedValue({
        _id: subjectId,
        isDeleted: false,
      } as never);

      vi.mocked(TeacherAssignmentModel.findOne).mockReturnValue({
        exec: vi.fn().mockResolvedValue(null),
      } as never);
      vi.mocked(TeacherAssignmentModel.create).mockResolvedValue(mockAssignment as never);

      const payload = {
        schoolId,
        branchId,
        academicYearId,
        employeeId,
        classId,
        subjectId,
        roleInClass: 'subject_teacher',
      };

      const response = await request(app).post('/api/v1/teacher-assignments').send(payload);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });
  });

  describe('DELETE /api/v1/teacher-assignments/:id', () => {
    it('soft deletes teacher assignment', async () => {
      const mockQuery = {
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(mockAssignment),
      };
      vi.mocked(TeacherAssignmentModel.findOne).mockReturnValue(mockQuery as never);
      vi.mocked(TeacherAssignmentModel.findOneAndUpdate).mockReturnValue({
        exec: vi.fn().mockResolvedValue(mockAssignment),
      } as never);

      const response = await request(app)
        .delete(`/api/v1/teacher-assignments/${assignmentId}`)
        .set('X-School-Id', schoolId);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});
