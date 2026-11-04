import { Types } from 'mongoose';

import { checkBranchAccess } from '../../middleware/branch-access';
import { checkUserPermission } from '../../middleware/authorize';
import { ForbiddenError, NotFoundError } from '../../shared/errors/app-error';
import type { AuthUser } from '../../types/auth';
import { ClassModel } from '../class/class.model';
import { EnrollmentModel } from '../enrollment/enrollment.model';
import { StudentModel } from '../student/student.model';
import { AttendanceModel } from './attendance.model';
import { AttendanceRecordModel } from './attendance-record.model';
import type { IMonthlyAttendanceSummary } from './monthly-attendance-summary.model';
import { MonthlyAttendanceSummaryRepository } from './monthly-attendance-summary.repository';
import type {
  ClassMonthlyAttendanceReport,
  MonthlyAttendanceSummaryQueryFilters,
  PaginatedMonthlyAttendanceSummaries,
  StudentMonthlyRollup,
} from './monthly-attendance-summary.types';

export class MonthlyAttendanceSummaryService {
  public constructor(private readonly repository = new MonthlyAttendanceSummaryRepository()) {}

  public async getSummaries(
    filters: MonthlyAttendanceSummaryQueryFilters,
    user: AuthUser,
  ): Promise<PaginatedMonthlyAttendanceSummaries> {
    const effectiveFilters = { ...filters };

    if (!checkUserPermission(user.permissions, 'attendance.view.own_branch')) {
      const assignedClasses = user.assignedClasses ?? [];
      if (effectiveFilters.classId && !assignedClasses.includes(effectiveFilters.classId)) {
        throw new ForbiddenError('You are not assigned to the requested class');
      }
      effectiveFilters.authorizedClassIds = assignedClasses;
    }

    if (user.branchAccess !== 'all') {
      const allowed = Array.isArray(user.branchAccess) ? user.branchAccess : [];
      if (effectiveFilters.branchId && !allowed.includes(effectiveFilters.branchId)) {
        throw new ForbiddenError('You do not have access to view attendance in this branch');
      }
      if (!effectiveFilters.branchId && allowed.length === 1) {
        effectiveFilters.branchId = allowed[0];
      }
      effectiveFilters.authorizedBranchIds = allowed;
    }

    return this.repository.findMany(effectiveFilters);
  }

  public async getClassMonthlySummary(
    classId: string,
    year: number,
    month: number,
    user: AuthUser,
  ): Promise<ClassMonthlyAttendanceReport> {
    const classDoc = await ClassModel.findOne({ _id: classId, isDeleted: false });
    if (!classDoc) {
      throw new NotFoundError(`Class with ID ${classId} not found`);
    }

    if (!checkBranchAccess(user.branchAccess, String(classDoc.branchId))) {
      throw new ForbiddenError('You do not have access to view attendance in this branch');
    }

    if (
      !checkUserPermission(user.permissions, 'attendance.view.own_branch') &&
      !(user.assignedClasses ?? []).includes(classId)
    ) {
      throw new ForbiddenError('You are not assigned to view attendance for this class');
    }

    let summaries = await this.repository.findByClassMonth(classId, year, month);
    if (summaries.length === 0) {
      // Lazy calculate if not already materialized
      await this.recalculateClassMonth(classId, year, month, user);
      summaries = await this.repository.findByClassMonth(classId, year, month);
    }

    const totalStudents = summaries.length;
    const averageAttendanceRate =
      totalStudents > 0
        ? Math.round(
            (summaries.reduce((sum, item) => sum + item.attendanceRate, 0) / totalStudents) * 10,
          ) / 10
        : 100;

    return {
      classId,
      year,
      month,
      totalStudents,
      averageAttendanceRate,
      summaries,
    };
  }

  public async getStudentMonthlyLedger(
    studentId: string,
    academicYearId: string | undefined,
    year: number | undefined,
    user: AuthUser,
  ): Promise<StudentMonthlyRollup> {
    const student = await StudentModel.findOne({ _id: studentId, isDeleted: false });
    if (!student) {
      throw new NotFoundError(`Student with ID ${studentId} not found`);
    }

    if (!checkBranchAccess(user.branchAccess, String(student.branchId))) {
      throw new ForbiddenError('You do not have access to view this student');
    }

    const summaries = await this.repository.findByStudentYear(studentId, academicYearId, year);

    let totalSessions = 0;
    let presentCount = 0;
    let absentCount = 0;
    let lateCount = 0;
    let permissionCount = 0;

    for (const record of summaries) {
      totalSessions += record.totalSessions;
      presentCount += record.presentCount;
      absentCount += record.absentCount;
      lateCount += record.lateCount;
      permissionCount += record.permissionCount;
    }

    const attended = presentCount + lateCount + permissionCount;
    const overallAttendanceRate =
      totalSessions > 0 ? Math.round((attended / totalSessions) * 100) : 100;

    return {
      studentId,
      academicYearId: academicYearId || '',
      year: year ?? new Date().getFullYear(),
      monthlySummaries: summaries,
      totalSessions,
      presentCount,
      absentCount,
      lateCount,
      permissionCount,
      overallAttendanceRate,
    };
  }

  public async recalculateClassMonth(
    classId: string,
    year: number,
    month: number,
    user?: AuthUser,
  ): Promise<number> {
    const classDoc = await ClassModel.findOne({ _id: classId, isDeleted: false });
    if (!classDoc) {
      throw new NotFoundError(`Class with ID ${classId} not found`);
    }

    if (user && !checkBranchAccess(user.branchAccess, String(classDoc.branchId))) {
      throw new ForbiddenError('You do not have access to modify attendance in this branch');
    }

    // Date boundaries for the month in UTC
    const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
    const nextMonth = new Date(Date.UTC(year, month, 1, 0, 0, 0));
    const endDate = new Date(nextMonth.getTime() - 1);

    // 1. Find all active enrollments for this class
    const enrollments = await EnrollmentModel.find({
      classId: new Types.ObjectId(classId),
      status: { $in: ['enrolled', 'active', 'completed'] },
      isDeleted: false,
    })
      .select('_id studentId')
      .lean();

    if (enrollments.length === 0) {
      return 0;
    }

    // 2. Find all attendance sessions in that month
    const sessions = await AttendanceModel.find({
      classId: new Types.ObjectId(classId),
      date: { $gte: startDate, $lte: endDate },
      isDeleted: false,
    })
      .select('_id date sessionType academicPeriodId')
      .lean();

    const totalSessions = sessions.length;
    const sessionIds = sessions.map((s) => s._id);

    // Default academicPeriodId from sessions or classDoc
    const academicPeriodId =
      sessions.find((s) => s.academicPeriodId)?.academicPeriodId ?? classDoc.academicPeriodId;

    // 3. Find all attendance records for these sessions
    const records =
      sessionIds.length > 0
        ? await AttendanceRecordModel.find({
            attendanceSessionId: { $in: sessionIds },
            isDeleted: false,
          })
            .select('studentId enrollmentId status')
            .lean()
        : [];

    // Map records per student
    const recordsByStudent = new Map<string, typeof records>();
    for (const record of records) {
      const sId = String(record.studentId);
      const existing = recordsByStudent.get(sId) ?? [];
      existing.push(record);
      recordsByStudent.set(sId, existing);
    }

    const summariesToUpsert: Array<Partial<IMonthlyAttendanceSummary>> = [];

    for (const enrollment of enrollments) {
      const studentIdStr = String(enrollment.studentId);
      const studentRecords = recordsByStudent.get(studentIdStr) ?? [];

      let presentCount = 0;
      let absentCount = 0;
      let lateCount = 0;
      let permissionCount = 0;

      for (const r of studentRecords) {
        if (r.status === 'present') presentCount++;
        else if (r.status === 'absent') absentCount++;
        else if (r.status === 'late') lateCount++;
        else if (['permission', 'excused', 'sick'].includes(r.status)) permissionCount++;
      }

      const attended = presentCount + lateCount + permissionCount;
      const attendanceRate =
        totalSessions > 0 ? Math.round((attended / totalSessions) * 1000) / 10 : 100;

      summariesToUpsert.push({
        schoolId: classDoc.schoolId as Types.ObjectId,
        branchId: classDoc.branchId as Types.ObjectId,
        academicYearId: classDoc.academicYearId as Types.ObjectId,
        academicPeriodId: academicPeriodId as Types.ObjectId | undefined,
        classId: classDoc._id as Types.ObjectId,
        studentId: enrollment.studentId as Types.ObjectId,
        enrollmentId: enrollment._id as Types.ObjectId,
        year,
        month,
        totalSessions,
        presentCount,
        absentCount,
        lateCount,
        permissionCount,
        attendanceRate,
        status: 'open',
        createdBy: user?.userId,
        updatedBy: user?.userId,
      });
    }

    await this.repository.bulkUpsert(summariesToUpsert);
    return summariesToUpsert.length;
  }
}
