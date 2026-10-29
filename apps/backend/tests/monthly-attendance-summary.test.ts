import { Types } from 'mongoose';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AttendanceModel } from '../src/modules/attendance/attendance.model';
import { AttendanceRecordModel } from '../src/modules/attendance/attendance-record.model';
import { MonthlyAttendanceSummaryModel } from '../src/modules/attendance/monthly-attendance-summary.model';
import { MonthlyAttendanceSummaryService } from '../src/modules/attendance/monthly-attendance-summary.service';
import { ClassModel } from '../src/modules/class/class.model';
import { EnrollmentModel } from '../src/modules/enrollment/enrollment.model';
import { StudentModel } from '../src/modules/student/student.model';
import type { AuthUser } from '../src/types/auth';

describe('Monthly Attendance Summary Ledger Engine', () => {
  const service = new MonthlyAttendanceSummaryService();
  const mockClassId = new Types.ObjectId().toString();
  const mockStudentId = new Types.ObjectId().toString();
  const mockEnrollmentId = new Types.ObjectId().toString();
  const mockBranchId = new Types.ObjectId().toString();
  const mockSchoolId = new Types.ObjectId().toString();
  const mockAcademicYearId = new Types.ObjectId().toString();

  const mockUser: AuthUser = {
    userId: 'user-001',
    schoolId: mockSchoolId,
    branchId: mockBranchId,
    role: 'director',
    roles: ['director'],
    permissions: ['attendance.view.all_branches', 'attendance.create.all_branches'],
    branchAccess: 'all',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('recalculateClassMonth', () => {
    it('aggregates daily attendance records into monthly summary ledger records accurately', async () => {
      vi.spyOn(ClassModel, 'findOne').mockResolvedValue({
        _id: new Types.ObjectId(mockClassId),
        branchId: new Types.ObjectId(mockBranchId),
        schoolId: new Types.ObjectId(mockSchoolId),
        academicYearId: new Types.ObjectId(mockAcademicYearId),
        isDeleted: false,
      } as never);

      vi.spyOn(EnrollmentModel, 'find').mockReturnValue({
        select: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue([
          {
            _id: new Types.ObjectId(mockEnrollmentId),
            studentId: new Types.ObjectId(mockStudentId),
          },
        ]),
      } as never);

      const sessionId1 = new Types.ObjectId();
      const sessionId2 = new Types.ObjectId();
      const sessionId3 = new Types.ObjectId();
      const sessionId4 = new Types.ObjectId();

      vi.spyOn(AttendanceModel, 'find').mockReturnValue({
        select: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue([
          { _id: sessionId1, date: new Date('2026-01-05') },
          { _id: sessionId2, date: new Date('2026-01-06') },
          { _id: sessionId3, date: new Date('2026-01-07') },
          { _id: sessionId4, date: new Date('2026-01-08') },
        ]),
      } as never);

      vi.spyOn(AttendanceRecordModel, 'find').mockReturnValue({
        select: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue([
          {
            attendanceSessionId: sessionId1,
            studentId: new Types.ObjectId(mockStudentId),
            status: 'present',
          },
          {
            attendanceSessionId: sessionId2,
            studentId: new Types.ObjectId(mockStudentId),
            status: 'present',
          },
          {
            attendanceSessionId: sessionId3,
            studentId: new Types.ObjectId(mockStudentId),
            status: 'late',
          },
          {
            attendanceSessionId: sessionId4,
            studentId: new Types.ObjectId(mockStudentId),
            status: 'absent',
          },
        ]),
      } as never);

      let bulkWrittenOps: Array<Record<string, unknown>> = [];
      vi.spyOn(MonthlyAttendanceSummaryModel, 'bulkWrite').mockImplementation((async (
        ops: Array<Record<string, unknown>>,
      ) => {
        bulkWrittenOps = ops;
        return {} as never;
      }) as never);

      const count = await service.recalculateClassMonth(mockClassId, 2026, 1, mockUser);

      expect(count).toBe(1);
      expect(bulkWrittenOps).toHaveLength(1);

      const updateOp = bulkWrittenOps[0] as {
        updateOne: {
          filter: Record<string, unknown>;
          update: { $set: Record<string, unknown> };
        };
      };

      const payload = updateOp.updateOne.update.$set;
      expect(payload.totalSessions).toBe(4);
      expect(payload.presentCount).toBe(2);
      expect(payload.lateCount).toBe(1);
      expect(payload.absentCount).toBe(1);
      expect(payload.permissionCount).toBe(0);
      // Attended: 2 present + 1 late = 3 / 4 = 75.0%
      expect(payload.attendanceRate).toBe(75);
    });
  });

  describe('getClassMonthlySummary', () => {
    it('returns formatted class monthly attendance report with computed averages', async () => {
      vi.spyOn(ClassModel, 'findOne').mockResolvedValue({
        _id: new Types.ObjectId(mockClassId),
        branchId: new Types.ObjectId(mockBranchId),
        isDeleted: false,
      } as never);

      vi.spyOn(MonthlyAttendanceSummaryModel, 'find').mockReturnValue({
        populate: vi.fn().mockReturnThis(),
        sort: vi.fn().mockReturnThis(),
        lean: vi.fn().mockReturnValue({
          exec: vi.fn().mockResolvedValue([
            {
              studentId: { _id: mockStudentId, studentId: 'STU-001' },
              totalSessions: 10,
              presentCount: 9,
              absentCount: 1,
              attendanceRate: 90,
            },
            {
              studentId: { _id: new Types.ObjectId(), studentId: 'STU-002' },
              totalSessions: 10,
              presentCount: 10,
              absentCount: 0,
              attendanceRate: 100,
            },
          ]),
        }),
      } as never);

      const report = await service.getClassMonthlySummary(mockClassId, 2026, 1, mockUser);

      expect(report.classId).toBe(mockClassId);
      expect(report.year).toBe(2026);
      expect(report.month).toBe(1);
      expect(report.totalStudents).toBe(2);
      expect(report.averageAttendanceRate).toBe(95);
    });
  });

  describe('getStudentMonthlyLedger', () => {
    it('returns student longitudinal attendance summary ledger across months', async () => {
      vi.spyOn(StudentModel, 'findOne').mockResolvedValue({
        _id: new Types.ObjectId(mockStudentId),
        branchId: new Types.ObjectId(mockBranchId),
        isDeleted: false,
      } as never);

      vi.spyOn(MonthlyAttendanceSummaryModel, 'find').mockReturnValue({
        populate: vi.fn().mockReturnThis(),
        sort: vi.fn().mockReturnThis(),
        lean: vi.fn().mockReturnValue({
          exec: vi.fn().mockResolvedValue([
            {
              month: 1,
              year: 2026,
              totalSessions: 20,
              presentCount: 18,
              absentCount: 2,
              lateCount: 0,
              permissionCount: 0,
              attendanceRate: 90,
            },
            {
              month: 2,
              year: 2026,
              totalSessions: 20,
              presentCount: 20,
              absentCount: 0,
              lateCount: 0,
              permissionCount: 0,
              attendanceRate: 100,
            },
          ]),
        }),
      } as never);

      const ledger = await service.getStudentMonthlyLedger(
        mockStudentId,
        mockAcademicYearId,
        2026,
        mockUser,
      );

      expect(ledger.studentId).toBe(mockStudentId);
      expect(ledger.monthlySummaries).toHaveLength(2);
      expect(ledger.totalSessions).toBe(40);
      expect(ledger.presentCount).toBe(38);
      expect(ledger.absentCount).toBe(2);
      expect(ledger.overallAttendanceRate).toBe(95);
    });
  });
});
