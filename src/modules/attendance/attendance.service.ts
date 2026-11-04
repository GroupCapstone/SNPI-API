import { Types } from 'mongoose';

import { checkBranchAccess } from '../../middleware/branch-access';
import { checkUserPermission } from '../../middleware/authorize';
import { ForbiddenError, NotFoundError, ValidationError } from '../../shared/errors/app-error';
import type { AuthUser } from '../../types/auth';
import { runInTransaction } from '../../utils/transaction';
import { assertAcademicContextWritable } from '../academic-period/academic-context-lock.service';
import { AcademicYearModel } from '../academic-year/academic-year.model';
import { AuditLogService } from '../audit-log/audit-log.service';
import { BranchModel } from '../branch/branch.model';
import { ClassModel } from '../class/class.model';
import { EnrollmentModel } from '../enrollment/enrollment.model';
import { SchoolModel } from '../school/school.model';
import { TeacherAssignmentModel } from '../teacher-assignment/teacher-assignment.model';
import { logger } from '../../config/logger';
import type { IAttendance } from './attendance.model';
import { AttendanceRepository } from './attendance.repository';
import type { AttendanceQueryFilters, MarkAttendanceDTO } from './attendance.types';
import { MonthlyAttendanceSummaryService } from './monthly-attendance-summary.service';

export class AttendanceService {
  public constructor(
    private readonly repository = new AttendanceRepository(),
    private readonly monthlySummaryService = new MonthlyAttendanceSummaryService(),
  ) {}

  public async getAttendance(
    filters: AttendanceQueryFilters,
    user: AuthUser,
  ): Promise<{ data: IAttendance[]; total: number }> {
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

    return this.repository.findAll(effectiveFilters);
  }

  public async getClassAttendanceByDate(
    classId: string,
    dateStr: string,
    user: AuthUser,
    sessionType: string = 'morning',
  ): Promise<{
    existingRecord: IAttendance | null;
    roster: Array<{
      studentId: string;
      studentCode: string;
      firstName: string;
      lastName: string;
      khmerName: string;
      gender: string;
      status: string;
      remarks: string;
    }>;
  }> {
    if (!Types.ObjectId.isValid(classId)) {
      throw new NotFoundError(`Class with ID ${classId} not found`);
    }

    const targetClass = await ClassModel.findOne({
      _id: new Types.ObjectId(classId),
      isDeleted: false,
    });
    if (!targetClass) {
      throw new NotFoundError(`Class with ID ${classId} not found`);
    }

    if (!checkBranchAccess(user.branchAccess, String(targetClass.branchId))) {
      throw new ForbiddenError('You do not have access to view attendance in this branch');
    }

    const canManageAllClasses = checkUserPermission(user.permissions, 'attendance.view.own_branch');
    if (!canManageAllClasses) {
      if (!user.employeeId) {
        throw new ForbiddenError('A linked employee record is required for teacher attendance');
      }
      const assignment = await TeacherAssignmentModel.exists({
        employeeId: user.employeeId,
        classId: targetClass._id,
        branchId: targetClass.branchId,
        status: 'active',
        isDeleted: false,
        startDate: { $lte: new Date() },
        $or: [
          { endDate: { $exists: false } },
          { endDate: null },
          { endDate: { $gte: new Date() } },
        ],
      });
      if (!assignment) {
        throw new ForbiddenError('You are not assigned to teach this class');
      }
    }

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      throw new ValidationError('Invalid date format');
    }

    const existing = await this.repository.findByClassAndDate(classId, date, sessionType);

    // Fetch all active enrollments for this class
    const enrollments = await EnrollmentModel.find({
      classId: new Types.ObjectId(classId),
      status: { $in: ['enrolled', 'active'] },
      isDeleted: false,
    })
      .populate('studentId', 'studentId firstName lastName khmerName gender')
      .exec();

    const existingMap = new Map<string, { status: string; remarks?: string }>();
    if (existing && existing.records) {
      existing.records.forEach((r) => {
        const sid =
          r.studentId && typeof r.studentId === 'object' && '_id' in r.studentId
            ? String((r.studentId as { _id: unknown })._id)
            : String(r.studentId);
        existingMap.set(sid, { status: r.status, remarks: r.remarks });
      });
    }

    const roster = enrollments
      .map((enr) => {
        const student = enr.studentId as unknown as {
          _id: Types.ObjectId;
          studentId: string;
          firstName: string;
          lastName: string;
          khmerName: string;
          gender: string;
        } | null;

        if (!student) return null;
        const sid = String(student._id);
        const recorded = existingMap.get(sid);

        return {
          studentId: sid,
          studentCode: student.studentId,
          firstName: student.firstName,
          lastName: student.lastName,
          khmerName: student.khmerName,
          gender: student.gender,
          status: recorded ? recorded.status : 'present',
          remarks: recorded?.remarks || '',
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    return {
      existingRecord: existing,
      roster,
    };
  }

  public async markAttendance(dto: MarkAttendanceDTO, user: AuthUser): Promise<IAttendance> {
    if (!checkBranchAccess(user.branchAccess, dto.branchId)) {
      throw new ForbiddenError('You do not have access to mark attendance in this branch');
    }

    // 1. School check
    const school = await SchoolModel.findOne({ _id: dto.schoolId, isDeleted: false });
    if (!school) {
      throw new ValidationError(`Selected school with ID ${dto.schoolId} does not exist`);
    }

    // 2. Branch check
    const branch = await BranchModel.findOne({
      _id: dto.branchId,
      schoolId: dto.schoolId,
      isDeleted: false,
    });
    if (!branch) {
      throw new ValidationError(
        `Selected branch with ID ${dto.branchId} does not belong to school ${dto.schoolId}`,
      );
    }

    // 3. Academic Year check
    const academicYear = await AcademicYearModel.findOne({
      _id: dto.academicYearId,
      schoolId: dto.schoolId,
      isDeleted: false,
    });
    if (!academicYear) {
      throw new ValidationError(`Academic year with ID ${dto.academicYearId} does not exist`);
    }

    // 4. Class check
    const classDoc = await ClassModel.findOne({
      _id: dto.classId,
      branchId: dto.branchId,
      isDeleted: false,
    });
    if (!classDoc) {
      throw new ValidationError(
        `Class with ID ${dto.classId} does not belong to branch ${dto.branchId}`,
      );
    }
    if (String(classDoc.academicYearId) !== dto.academicYearId) {
      throw new ValidationError('Class does not belong to the selected academic year');
    }
    const academicPeriodId = dto.academicPeriodId ?? classDoc.academicPeriodId?.toString();
    if (
      dto.academicPeriodId &&
      classDoc.academicPeriodId &&
      String(classDoc.academicPeriodId) !== dto.academicPeriodId
    ) {
      throw new ValidationError('Class does not belong to the selected academic period');
    }
    await assertAcademicContextWritable({
      academicYearId: dto.academicYearId,
      academicPeriodId,
      programId: classDoc.programId ? String(classDoc.programId) : undefined,
      operation: 'mark attendance',
    });

    const canManageAllClasses = checkUserPermission(
      user.permissions,
      'attendance.create.own_branch',
    );
    if (!canManageAllClasses) {
      if (!user.employeeId) {
        throw new ForbiddenError('A linked employee record is required for teacher attendance');
      }
      const assignment = await TeacherAssignmentModel.exists({
        employeeId: user.employeeId,
        classId: classDoc._id,
        branchId: classDoc.branchId,
        status: 'active',
        isDeleted: false,
        startDate: { $lte: new Date() },
        $or: [
          { endDate: { $exists: false } },
          { endDate: null },
          { endDate: { $gte: new Date() } },
        ],
      });
      if (!assignment) {
        throw new ForbiddenError('You are not assigned to teach this class');
      }
    }

    // 5. Verify all submitted students are actively enrolled in this class
    const studentIds = dto.records.map((r) => new Types.ObjectId(r.studentId));
    const activeEnrollments = await EnrollmentModel.find({
      classId: new Types.ObjectId(dto.classId),
      studentId: { $in: studentIds },
      status: { $in: ['enrolled', 'active'] },
      isDeleted: false,
    }).select('_id studentId');

    const enrollmentByStudentId = new Map(
      activeEnrollments.map((enrollment) => [String(enrollment.studentId), enrollment._id]),
    );
    for (const r of dto.records) {
      if (!enrollmentByStudentId.has(r.studentId)) {
        throw new ValidationError(
          `Student with ID ${r.studentId} is not actively enrolled in class ${dto.classId}`,
        );
      }
    }

    const date = new Date(dto.date);
    const sessionType = dto.sessionType || 'morning';
    const records = dto.records.map((r) => ({
      studentId: new Types.ObjectId(r.studentId),
      enrollmentId: enrollmentByStudentId.get(r.studentId) as Types.ObjectId,
      status: r.status,
      remarks: r.remarks?.trim(),
    }));

    const attendance = await runInTransaction(async (session) => {
      const savedSession = await this.repository.upsertAttendance(
        dto.classId,
        date,
        sessionType,
        {
          schoolId: school._id as never,
          branchId: branch._id as never,
          academicYearId: academicYear._id as never,
          academicPeriodId: academicPeriodId
            ? (new Types.ObjectId(academicPeriodId) as never)
            : undefined,
          scheduleId: dto.scheduleId ? (new Types.ObjectId(dto.scheduleId) as never) : undefined,
          teacherId: dto.teacherId ? (new Types.ObjectId(dto.teacherId) as never) : undefined,
          sessionType,
          takenBy: user.userId as never,
          createdBy: user.userId as never,
          updatedBy: user.userId as never,
        },
        session,
      );
      await this.repository.replaceRecords(savedSession, records, user.userId, session);
      if (typeof savedSession.set === 'function') {
        savedSession.set('records', records, { strict: false });
      } else {
        Object.assign(savedSession, { records });
      }
      return savedSession;
    });

    // Audit log
    await AuditLogService.log({
      userId: user.userId,
      module: 'attendance',
      action: 'UPDATE',
      entityType: 'Attendance',
      entityId: attendance._id.toString(),
      schoolId: dto.schoolId,
      branchId: dto.branchId,
      newValue: {
        classId: dto.classId,
        date: dto.date,
        totalRecords: records.length,
      },
    });

    const d = new Date(dto.date);
    void this.monthlySummaryService
      .recalculateClassMonth(dto.classId, d.getUTCFullYear(), d.getUTCMonth() + 1, user)
      .catch((err) => {
        logger.error({ err, classId: dto.classId }, 'Failed to update monthly attendance summary');
      });

    return attendance;
  }
}
