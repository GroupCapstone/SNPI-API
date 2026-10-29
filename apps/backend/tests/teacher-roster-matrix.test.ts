import { Types } from 'mongoose';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Response, NextFunction } from 'express';

import { ClassModel } from '../src/modules/class/class.model';
import { EnrollmentModel } from '../src/modules/enrollment/enrollment.model';
import { MonthlyAttendanceSummaryModel } from '../src/modules/attendance/monthly-attendance-summary.model';
import { TeacherAssignmentController } from '../src/modules/teacher-assignment/teacher-assignment.controller';
import { TeacherAssignmentModel } from '../src/modules/teacher-assignment/teacher-assignment.model';
import { TeacherAssignmentService } from '../src/modules/teacher-assignment/teacher-assignment.service';
import type { AuthenticatedRequest, AuthUser } from '../src/types/auth';

vi.mock('../src/modules/teacher-assignment/teacher-assignment.model', () => ({
  TeacherAssignmentModel: {
    find: vi.fn(),
    findOne: vi.fn(),
    findOneAndUpdate: vi.fn(),
    create: vi.fn(),
    countDocuments: vi.fn(),
  },
}));

vi.mock('../src/modules/class/class.model', () => ({
  ClassModel: {
    find: vi.fn(),
    findOne: vi.fn(),
  },
}));

vi.mock('../src/modules/enrollment/enrollment.model', () => ({
  EnrollmentModel: {
    find: vi.fn(),
  },
}));

vi.mock('../src/modules/attendance/monthly-attendance-summary.model', () => ({
  MonthlyAttendanceSummaryModel: {
    find: vi.fn(),
  },
}));

vi.mock('../src/modules/audit-log/audit-log.service', () => ({
  AuditLogService: class {
    public static log = vi.fn().mockResolvedValue(undefined);
  },
}));

describe('Teacher Roster Matrix Service & Controller Tests', () => {
  const schoolId = new Types.ObjectId().toString();
  const branchId = new Types.ObjectId().toString();
  const otherBranchId = new Types.ObjectId().toString();
  const academicYearId = new Types.ObjectId().toString();
  const teacherId = new Types.ObjectId().toString();
  const classId = new Types.ObjectId().toString();
  const subjectId = new Types.ObjectId().toString();
  const assignmentId = new Types.ObjectId().toString();
  const studentId = new Types.ObjectId().toString();
  const enrollmentId = new Types.ObjectId().toString();

  const mockTeacherAssignment = {
    _id: assignmentId,
    schoolId,
    branchId: {
      _id: branchId,
      branchCode: 'B-01',
      branchNameEn: 'Main Campus',
      branchNameKh: 'សាខាកណ្តាល',
    },
    academicYearId,
    employeeId: {
      _id: teacherId,
      employeeId: 'EMP-001',
      firstName: 'Sophea',
      lastName: 'Chan',
      khmerName: 'ចាន់ សុភា',
      gender: 'female',
      phone: '012345678',
      email: 'sophea.chan@snp.edu.kh',
      departmentId: {
        _id: new Types.ObjectId().toString(),
        departmentNameEn: 'Foreign Languages',
      },
      positionId: {
        _id: new Types.ObjectId().toString(),
        positionNameEn: 'Senior Instructor',
      },
      branchId: {
        _id: branchId,
        branchCode: 'B-01',
        branchNameEn: 'Main Campus',
      },
    },
    classId: {
      _id: classId,
      classCode: 'GEP-101',
      className: 'General English Level 1',
      capacity: 30,
      shift: 'morning',
      daysPattern: 'mon_wed_fri',
      startTime: '08:00',
      endTime: '10:00',
      programId: {
        _id: new Types.ObjectId().toString(),
        programCode: 'GEP',
        programNameEn: 'General English Program',
      },
      levelId: {
        _id: new Types.ObjectId().toString(),
        levelCode: 'L1',
        levelNameEn: 'Level 1',
      },
      classroomId: {
        _id: new Types.ObjectId().toString(),
        roomNumber: 'R-101',
        name: 'Room 101',
        building: 'Building A',
      },
    },
    subjectId: {
      _id: subjectId,
      subjectCode: 'ENG-READ',
      subjectNameEn: 'Reading & Writing',
    },
    roleInClass: 'lead_teacher',
    status: 'active',
    isDeleted: false,
  };

  const mockEnrollment = {
    _id: enrollmentId,
    classId,
    studentId: {
      _id: studentId,
      studentId: 'STU-001',
      firstName: 'Vannak',
      lastName: 'Keo',
      khmerName: 'កែវ វណ្ណៈ',
      gender: 'male',
      dateOfBirth: new Date('2010-05-15'),
      photo: 'https://example.com/avatar.jpg',
      guardians: [
        {
          fullName: 'Borey Keo',
          phone: '098765432',
          isPrimary: true,
        },
      ],
    },
    status: 'enrolled',
    tuitionStatus: 'paid',
    isDeleted: false,
  };

  const mockAttendanceSummary = {
    classId,
    studentId,
    attendanceRate: 95.5,
    isDeleted: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const setupRepositoryMocks = () => {
    // 1. Teacher assignments query
    const mockAssignmentQuery = {
      populate: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([mockTeacherAssignment]),
    };
    vi.mocked(TeacherAssignmentModel.find).mockReturnValue(mockAssignmentQuery as never);

    // 2. Enrollments query
    const mockEnrollmentQuery = {
      populate: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([mockEnrollment]),
    };
    vi.mocked(EnrollmentModel.find).mockReturnValue(mockEnrollmentQuery as never);

    // 3. Attendance summaries query
    const mockAttendanceQuery = {
      select: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([mockAttendanceSummary]),
    };
    vi.mocked(MonthlyAttendanceSummaryModel.find).mockReturnValue(mockAttendanceQuery as never);

    // 4. Classes query for unassigned classes
    const mockClassQuery = {
      populate: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([]),
    };
    vi.mocked(ClassModel.find).mockReturnValue(mockClassQuery as never);
  };

  describe('Service Layer: TeacherAssignmentService.getRosterMatrix', () => {
    const service = new TeacherAssignmentService();

    it('returns matrix with correct calculations for authorized user', async () => {
      setupRepositoryMocks();

      const user: AuthUser = {
        userId: new Types.ObjectId().toString(),
        username: 'admin',
        email: 'admin@snp.edu.kh',
        schoolId,
        roles: ['super_admin'],
        permissions: ['*'],
        branchAccess: 'all',
      };

      const result = await service.getRosterMatrix({}, user);

      expect(result).toBeDefined();
      expect(result.summary.totalTeachers).toBe(1);
      expect(result.summary.assignedClassesCount).toBe(1);
      expect(result.summary.totalStudents).toBe(1);
      expect(result.summary.unassignedClassesCount).toBe(0);
      expect(result.faculty).toHaveLength(1);
      expect(result.faculty[0].teacher.employeeId).toBe('EMP-001');
      expect(result.faculty[0].classes[0].students).toHaveLength(1);
      expect(result.faculty[0].classes[0].students[0].attendanceRate).toBe(95.5);
    });

    it('scopes query to teacher employeeId if user has teacher role', async () => {
      setupRepositoryMocks();

      const teacherUser: AuthUser = {
        userId: new Types.ObjectId().toString(),
        username: 'teacher_sophea',
        email: 'sophea@snp.edu.kh',
        schoolId,
        roles: ['teacher'],
        employeeId: teacherId,
        permissions: ['teacher_assignment.view.own_branch'],
        branchAccess: [branchId],
      };

      const result = await service.getRosterMatrix({}, teacherUser);

      expect(result).toBeDefined();
      expect(TeacherAssignmentModel.find).toHaveBeenCalledWith(
        expect.objectContaining({
          schoolId: new Types.ObjectId(schoolId),
          employeeId: new Types.ObjectId(teacherId),
        }),
      );
    });

    it('rejects a teacher session without a linked employee record', async () => {
      setupRepositoryMocks();

      await expect(
        service.getRosterMatrix(
          {},
          {
            userId: new Types.ObjectId().toString(),
            username: 'unlinked_teacher',
            email: 'unlinked@snp.edu.kh',
            schoolId,
            roles: ['teacher'],
            permissions: ['teacher_assignment.view.own_branch'],
            branchAccess: [branchId],
          },
        ),
      ).rejects.toThrow(/linked employee record is required/);
    });

    it('throws ForbiddenError if user accesses branch outside their branchAccess', async () => {
      const branchRestrictedUser: AuthUser = {
        userId: new Types.ObjectId().toString(),
        username: 'branch_manager',
        email: 'bm@snp.edu.kh',
        schoolId,
        roles: ['branch_manager'],
        permissions: ['teacher_assignment.view.own_branch'],
        branchAccess: [branchId],
      };

      await expect(
        service.getRosterMatrix({ branchId: otherBranchId }, branchRestrictedUser),
      ).rejects.toThrow();
    });
  });

  describe('Controller Layer: TeacherAssignmentController.getRosterMatrix', () => {
    const controller = new TeacherAssignmentController();

    it('handles request and sends JSON response successfully', async () => {
      setupRepositoryMocks();

      const req = {
        user: {
          userId: new Types.ObjectId().toString(),
          username: 'admin',
          email: 'admin@snp.edu.kh',
          schoolId,
          roles: ['super_admin'],
          permissions: ['*'],
          branchAccess: 'all',
        },
      } as unknown as AuthenticatedRequest;

      const res = {
        locals: {
          validated: {
            query: {
              branchId,
              academicYearId,
            },
          },
        },
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
      } as unknown as Response;

      const next = vi.fn() as NextFunction;

      await controller.getRosterMatrix(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Teacher roster matrix retrieved successfully',
          data: expect.objectContaining({
            summary: expect.objectContaining({
              totalTeachers: 1,
              assignedClassesCount: 1,
              totalStudents: 1,
            }),
            faculty: expect.any(Array),
          }),
        }),
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('forwards error to next() middleware when service throws', async () => {
      const req = {
        user: {
          userId: new Types.ObjectId().toString(),
          username: 'teacher',
          email: 'teacher@snp.edu.kh',
          schoolId,
          roles: ['teacher'],
          permissions: ['teacher_assignment.view.own_branch'],
          branchAccess: [branchId],
        },
      } as unknown as AuthenticatedRequest;

      const res = {
        locals: {
          validated: {
            query: {
              branchId: otherBranchId,
            },
          },
        },
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
      } as unknown as Response;

      const next = vi.fn() as NextFunction;

      await controller.getRosterMatrix(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
