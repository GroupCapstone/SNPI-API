import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createApp } from '../src/app';
import { DEFAULT_CORE_ROLES } from '../src/constants/permissions';
import { AcademicYearModel } from '../src/modules/academic-year/academic-year.model';
import { AttendanceModel } from '../src/modules/attendance/attendance.model';
import { BranchModel } from '../src/modules/branch/branch.model';
import { ClassModel } from '../src/modules/class/class.model';
import { EnrollmentModel } from '../src/modules/enrollment/enrollment.model';
import { SchoolModel } from '../src/modules/school/school.model';
import { TeacherAssignmentModel } from '../src/modules/teacher-assignment/teacher-assignment.model';

vi.mock('../src/modules/teacher-assignment/teacher-assignment.model', () => ({
  TeacherAssignmentModel: { exists: vi.fn() },
}));

vi.mock('../src/modules/school/school.model', () => ({
  SchoolModel: { findOne: vi.fn() },
}));

vi.mock('../src/modules/branch/branch.model', () => ({
  BranchModel: { findOne: vi.fn() },
}));

vi.mock('../src/modules/academic-year/academic-year.model', () => ({
  AcademicYearModel: { findOne: vi.fn() },
}));

vi.mock('../src/modules/class/class.model', () => ({
  ClassModel: { findOne: vi.fn() },
}));

vi.mock('../src/modules/enrollment/enrollment.model', () => ({
  EnrollmentModel: { find: vi.fn() },
}));

vi.mock('../src/modules/attendance/attendance.model', () => ({
  AttendanceModel: {
    find: vi.fn(),
    findOne: vi.fn(),
    findOneAndUpdate: vi.fn(),
    countDocuments: vi.fn(),
  },
}));

vi.mock('../src/modules/attendance/attendance-record.model', () => ({
  AttendanceRecordModel: {
    find: vi.fn().mockReturnValue({
      populate: vi.fn().mockReturnThis(),
      sort: vi.fn().mockReturnThis(),
      lean: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([
        {
          _id: '507f1f77bcf86cd799439009',
          attendanceSessionId: '507f1f77bcf86cd799439006',
          studentId: {
            _id: '507f1f77bcf86cd799439005',
            studentId: 'STU-000001',
            firstName: 'Bopha',
            lastName: 'Kouy',
          },
          status: 'present',
        },
      ]),
    }),
    updateMany: vi.fn().mockResolvedValue({}),
    bulkWrite: vi.fn().mockResolvedValue({}),
    distinct: vi.fn().mockResolvedValue([]),
  },
}));

vi.mock('../src/modules/audit-log/audit-log.service', () => ({
  AuditLogService: class {
    public static log = vi.fn().mockResolvedValue(undefined);
  },
}));

describe('Daily Attendance API Tests', () => {
  const app = createApp();

  const schoolId = '507f1f77bcf86cd799439001';
  const branchId = '507f1f77bcf86cd799439002';
  const academicYearId = '507f1f77bcf86cd799439003';
  const classId = '507f1f77bcf86cd799439004';
  const studentId = '507f1f77bcf86cd799439005';
  const attendanceId = '507f1f77bcf86cd799439006';

  const mockAttendance = {
    _id: attendanceId,
    schoolId: { _id: schoolId, nameEn: 'SNP' },
    branchId: { _id: branchId, branchNameEn: 'Main Branch' },
    academicYearId: { _id: academicYearId, name: '2026-2027' },
    classId: { _id: classId, className: 'GEP-1A' },
    date: new Date('2026-08-30'),
    records: [
      {
        studentId: {
          _id: studentId,
          studentId: 'STU-000001',
          firstName: 'Bopha',
          lastName: 'Kouy',
        },
        status: 'present',
      },
    ],
    isDeleted: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/v1/attendance', () => {
    it('returns paginated attendance records', async () => {
      const mockQuery = {
        populate: vi.fn().mockReturnThis(),
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue([mockAttendance]),
      };

      vi.mocked(AttendanceModel.find).mockReturnValue(mockQuery as never);
      vi.mocked(AttendanceModel.countDocuments).mockReturnValue({
        exec: vi.fn().mockResolvedValue(1),
      } as never);

      const response = await request(app).get('/api/v1/attendance?page=1&limit=10');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
    });
  });

  describe('GET /api/v1/attendance/roster/:classId', () => {
    it('returns class roster for date', async () => {
      vi.mocked(ClassModel.findOne).mockResolvedValue({
        _id: classId,
        branchId,
        academicYearId,
        isDeleted: false,
      } as never);

      const mockFindOneQuery = {
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(mockAttendance),
      };
      vi.mocked(AttendanceModel.findOne).mockReturnValue(mockFindOneQuery as never);

      const mockEnrollmentQuery = {
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue([
          {
            studentId: {
              _id: studentId,
              studentId: 'STU-000001',
              firstName: 'Bopha',
              lastName: 'Kouy',
              khmerName: 'គុយ បុប្ផា',
              gender: 'female',
            },
          },
        ]),
      };
      vi.mocked(EnrollmentModel.find).mockReturnValue(mockEnrollmentQuery as never);

      const response = await request(app).get(
        `/api/v1/attendance/roster/${classId}?date=2026-08-30`,
      );

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.roster).toHaveLength(1);
      expect(response.body.data.roster[0].studentCode).toBe('STU-000001');
    });
  });

  describe('POST /api/v1/attendance', () => {
    it.each(['super_admin', 'teacher'])('marks class attendance roll-call as %s', async (role) => {
      vi.mocked(TeacherAssignmentModel.exists).mockResolvedValue({ _id: classId } as never);
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
      vi.mocked(ClassModel.findOne).mockResolvedValue({
        _id: classId,
        branchId,
        academicYearId,
        isDeleted: false,
      } as never);
      vi.mocked(EnrollmentModel.find).mockReturnValue({
        select: vi.fn().mockResolvedValue([{ studentId }]),
      } as never);

      const mockUpsertQuery = {
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(mockAttendance),
      };
      vi.mocked(AttendanceModel.findOneAndUpdate).mockReturnValue(mockUpsertQuery as never);

      const payload = {
        schoolId,
        branchId,
        academicYearId,
        classId,
        date: '2026-08-30',
        records: [{ studentId, status: 'present' }],
      };

      const permissions = DEFAULT_CORE_ROLES.find((item) => item.code === role)!.permissions;
      const response = await request(app)
        .post('/api/v1/attendance')
        .set('X-User-Id', '507f1f77bcf86cd799439007')
        .set('X-School-Id', schoolId)
        .set('X-Employee-Id', '507f1f77bcf86cd799439008')
        .set('X-User-Permissions', permissions.join(','))
        .set('X-Branch-Access', branchId)
        .send(payload);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      if (role === 'teacher') {
        expect(TeacherAssignmentModel.exists).toHaveBeenCalledWith(
          expect.objectContaining({ classId }),
        );
      }
    });
  });
});
