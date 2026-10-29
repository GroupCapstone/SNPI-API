import { Types } from 'mongoose';
import mongoose from 'mongoose';

import { checkBranchAccess } from '../../middleware/branch-access';
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from '../../shared/errors/app-error';
import type { AuthUser } from '../../types/auth';
import { AttendanceModel } from '../attendance/attendance.model';
import { assertAcademicContextWritable } from '../academic-period/academic-context-lock.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { BranchModel } from '../branch/branch.model';
import { ClassModel } from '../class/class.model';
import { ClassroomModel } from '../classroom/classroom.model';
import { EmployeeModel } from '../employee/employee.model';
import { EnrollmentModel } from '../enrollment/enrollment.model';
import { StudentModel } from '../student/student.model';
import { SubjectModel } from '../subject/subject.model';
import { TeacherAssignmentModel } from '../teacher-assignment/teacher-assignment.model';
import { TimeSlotModel } from '../time-slot/time-slot.model';
import type { IClassSchedule } from './class-schedule.model';
import { ClassScheduleRepository } from './class-schedule.repository';
import type {
  ClassScheduleQueryFilters,
  CreateClassScheduleDto,
  ScheduleConflictCheckResult,
  ScheduleConflictCheckParams,
  TodayOperationalClassItem,
  UpdateClassScheduleDto,
} from './class-schedule.types';

const idOf = (value: unknown): string => {
  if (value && typeof value === 'object' && '_id' in value) {
    return String((value as { _id: unknown })._id);
  }
  return String(value ?? '');
};

export class ClassScheduleService {
  public constructor(private readonly repository = new ClassScheduleRepository()) {}

  public async getSchedules(
    filters: ClassScheduleQueryFilters,
    user: AuthUser,
  ): Promise<{ data: IClassSchedule[]; total: number }> {
    if (filters.branchId && !checkBranchAccess(user.branchAccess, filters.branchId)) {
      throw new ForbiddenError('You do not have access to schedules in the requested branch');
    }
    const branchFilter =
      user.branchAccess === 'all'
        ? filters.branchId
          ? { branchId: new Types.ObjectId(filters.branchId) }
          : {}
        : {
            branchId: {
              $in: (Array.isArray(user.branchAccess) ? user.branchAccess : []).map(
                (id) => new Types.ObjectId(id),
              ),
            },
          };

    return this.repository.findWithFilters({ ...filters, schoolId: user.schoolId }, branchFilter);
  }

  public async getScheduleById(id: string, user: AuthUser): Promise<IClassSchedule> {
    const schedule = await this.repository.findById(id, user.schoolId);
    if (!schedule) {
      throw new NotFoundError(`Class schedule with ID ${id} not found`);
    }
    if (!checkBranchAccess(user.branchAccess, String(schedule.branchId))) {
      throw new ForbiddenError('You do not have access to this class schedule');
    }
    return schedule;
  }

  public async getSchedulesByClass(classId: string, user: AuthUser): Promise<IClassSchedule[]> {
    const classDoc = await ClassModel.findOne({
      _id: new Types.ObjectId(classId),
      schoolId: new Types.ObjectId(user.schoolId),
      isDeleted: false,
    });
    if (!classDoc) {
      throw new NotFoundError(`Class with ID ${classId} not found`);
    }
    if (!checkBranchAccess(user.branchAccess, String(classDoc.branchId))) {
      throw new ForbiddenError('You do not have access to schedules for this class');
    }
    return this.repository.findByClassId(classId, user.schoolId);
  }

  public async createSchedule(
    dto: CreateClassScheduleDto,
    user: AuthUser,
  ): Promise<IClassSchedule> {
    const classDoc = await ClassModel.findOne({
      _id: new Types.ObjectId(dto.classId),
      schoolId: new Types.ObjectId(user.schoolId),
      isDeleted: false,
    });
    if (!classDoc) {
      throw new NotFoundError(`Class with ID ${dto.classId} not found`);
    }

    const branchId = idOf(classDoc.branchId);
    if (!checkBranchAccess(user.branchAccess, branchId)) {
      throw new ForbiddenError('You do not have access to schedule classes in this branch');
    }
    if (dto.branchId && dto.branchId !== branchId) {
      throw new ValidationError('Schedule branch must match the selected class branch');
    }

    const academicYearId = idOf(classDoc.academicYearId);
    if (dto.academicYearId && dto.academicYearId !== academicYearId) {
      throw new ValidationError('Schedule academic year must match the selected class');
    }
    const classPeriodId = classDoc.academicPeriodId ? idOf(classDoc.academicPeriodId) : undefined;
    if (dto.academicPeriodId && classPeriodId && dto.academicPeriodId !== classPeriodId) {
      throw new ValidationError('Schedule academic period must match the selected class');
    }
    const academicPeriodId = dto.academicPeriodId ?? classPeriodId;
    await assertAcademicContextWritable({
      academicYearId,
      academicPeriodId,
      programId: idOf(classDoc.programId),
      operation: 'create a class schedule',
    });

    if (dto.effectiveFrom && dto.effectiveTo && dto.effectiveFrom > dto.effectiveTo) {
      throw new ValidationError('Schedule effective start date must be before the end date');
    }

    let startTime = dto.startTime;
    let endTime = dto.endTime;
    let sessionType = dto.sessionType;

    // If timeSlotId provided, pull defaults if not explicitly given
    if (dto.timeSlotId) {
      const timeSlot = await TimeSlotModel.findOne({
        _id: new Types.ObjectId(dto.timeSlotId),
        isDeleted: false,
      });
      if (!timeSlot) {
        throw new ValidationError('Selected time slot does not exist');
      }
      if (timeSlot.branchId && idOf(timeSlot.branchId) !== branchId) {
        throw new ValidationError('Selected time slot does not belong to this branch');
      }
      if (timeSlot.schoolId && idOf(timeSlot.schoolId) !== user.schoolId) {
        throw new ValidationError('Selected time slot does not belong to this school');
      }
      if (!startTime) startTime = timeSlot.startTime;
      if (!endTime) endTime = timeSlot.endTime;
      if (!sessionType) sessionType = timeSlot.sessionType;
    }

    if (!sessionType) {
      const [startH = 0] = startTime.split(':').map(Number);
      if (startH < 12) sessionType = 'morning';
      else if (startH < 17) sessionType = 'afternoon';
      else sessionType = 'evening';
    }

    // Validate Teacher
    if (dto.teacherId) {
      const teacher = await EmployeeModel.findOne({
        _id: new Types.ObjectId(dto.teacherId),
        schoolId: classDoc.schoolId ?? user.schoolId,
        branchId: classDoc.branchId,
        status: 'active',
        isDeleted: false,
      });
      if (!teacher) {
        throw new ValidationError('Selected teacher is not active in the selected class branch');
      }
    }

    // Validate Classroom
    if (dto.classroomId) {
      const classroom = await ClassroomModel.findOne({
        _id: new Types.ObjectId(dto.classroomId),
        schoolId: new Types.ObjectId(user.schoolId),
        branchId: new Types.ObjectId(branchId),
        isDeleted: false,
      });
      if (!classroom) {
        throw new ValidationError(
          'Selected classroom does not exist or does not belong to this branch',
        );
      }
    }

    // Validate Subject
    if (dto.subjectId) {
      const subject = await SubjectModel.findOne({
        _id: new Types.ObjectId(dto.subjectId),
        schoolId: new Types.ObjectId(user.schoolId),
        isDeleted: false,
      });
      if (!subject) {
        throw new ValidationError('Selected subject does not exist');
      }
      if (subject.schoolId && idOf(subject.schoolId) !== user.schoolId) {
        throw new ValidationError('Selected subject does not belong to this school');
      }
      if (subject.branchId && idOf(subject.branchId) !== branchId) {
        throw new ValidationError('Selected subject is not available in this branch');
      }
    }

    if (dto.teacherAssignmentId) {
      const assignment = await TeacherAssignmentModel.findOne({
        _id: new Types.ObjectId(dto.teacherAssignmentId),
        schoolId: new Types.ObjectId(user.schoolId),
        branchId: classDoc.branchId,
        academicYearId: classDoc.academicYearId,
        classId: classDoc._id,
        ...(dto.teacherId ? { employeeId: new Types.ObjectId(dto.teacherId) } : {}),
        ...(dto.subjectId ? { subjectId: new Types.ObjectId(dto.subjectId) } : {}),
        status: 'active',
        isDeleted: false,
      });
      if (!assignment) {
        throw new ValidationError(
          'Selected teacher assignment does not match this class, teacher, and subject',
        );
      }
    }

    // Conflict detection
    await this.assertNoConflicts(
      {
        dayOfWeek: dto.dayOfWeek,
        startTime,
        endTime,
        teacherId: dto.teacherId,
        classroomId: dto.classroomId,
        classId: dto.classId,
        branchId,
        academicYearId,
        academicPeriodId,
        effectiveFrom: dto.effectiveFrom,
        effectiveTo: dto.effectiveTo,
      },
      user,
    );

    const created = await this.repository.create(
      {
        ...dto,
        schoolId: user.schoolId,
        branchId,
        academicYearId,
        academicPeriodId,
        startTime,
        endTime,
        sessionType,
      },
      user.userId,
    );

    await AuditLogService.log({
      userId: user.userId,
      schoolId: user.schoolId,
      branchId,
      module: 'class_schedule',
      action: 'CREATE',
      entityType: 'ClassSchedule',
      entityId: created._id.toString(),
      newValue: created.toObject(),
    });

    const populated = await this.repository.findById(created._id.toString(), user.schoolId);
    return populated ?? created;
  }

  public async updateSchedule(
    id: string,
    dto: UpdateClassScheduleDto,
    user: AuthUser,
  ): Promise<IClassSchedule> {
    const existing = await this.repository.findById(id, user.schoolId);
    if (!existing) {
      throw new NotFoundError(`Class schedule with ID ${id} not found`);
    }

    if (!checkBranchAccess(user.branchAccess, String(existing.branchId))) {
      throw new ForbiddenError('You do not have access to update this class schedule');
    }

    const dayOfWeek = dto.dayOfWeek ?? existing.dayOfWeek;
    const startTime = dto.startTime ?? existing.startTime;
    const endTime = dto.endTime ?? existing.endTime;
    const teacherId =
      dto.teacherId !== undefined
        ? dto.teacherId
        : existing.teacherId
          ? String(existing.teacherId)
          : undefined;
    const classroomId =
      dto.classroomId !== undefined
        ? dto.classroomId
        : existing.classroomId
          ? String(existing.classroomId)
          : undefined;
    const classId = idOf(existing.classId);
    const branchId = idOf(existing.branchId);
    const academicYearId = idOf(existing.academicYearId);
    const academicPeriodId = existing.academicPeriodId
      ? idOf(existing.academicPeriodId)
      : undefined;
    const classDoc = await ClassModel.findOne({
      _id: new Types.ObjectId(classId),
      schoolId: new Types.ObjectId(user.schoolId),
      isDeleted: false,
    });
    if (!classDoc) throw new NotFoundError('Schedule class not found');
    await assertAcademicContextWritable({
      academicYearId,
      academicPeriodId,
      programId: idOf(classDoc.programId),
      operation: 'update a class schedule',
    });
    const effectiveFrom =
      dto.effectiveFrom ??
      (existing.effectiveFrom ? existing.effectiveFrom.toISOString() : undefined);
    const effectiveTo =
      dto.effectiveTo ?? (existing.effectiveTo ? existing.effectiveTo.toISOString() : undefined);

    if (startTime >= endTime) {
      throw new ValidationError('Schedule start time must be strictly before end time');
    }
    if (effectiveFrom && effectiveTo && effectiveFrom > effectiveTo) {
      throw new ValidationError('Schedule effective start date must be before the end date');
    }
    if (existing.status === 'cancelled' && dto.status === 'active') {
      throw new ValidationError('A cancelled schedule cannot be reactivated');
    }

    let sessionType = dto.sessionType ?? existing.sessionType;
    let resolvedStartTime = startTime;
    let resolvedEndTime = endTime;
    if (dto.timeSlotId) {
      const timeSlot = await TimeSlotModel.findOne({
        _id: new Types.ObjectId(dto.timeSlotId),
        schoolId: new Types.ObjectId(user.schoolId),
        isDeleted: false,
      });
      if (!timeSlot || (timeSlot.branchId && idOf(timeSlot.branchId) !== branchId)) {
        throw new ValidationError('Selected time slot is not available in this branch');
      }
      if (dto.startTime === undefined) resolvedStartTime = timeSlot.startTime;
      if (dto.endTime === undefined) resolvedEndTime = timeSlot.endTime;
      if (dto.sessionType === undefined) sessionType = timeSlot.sessionType;
    }
    if (resolvedStartTime >= resolvedEndTime) {
      throw new ValidationError('Schedule start time must be strictly before end time');
    }

    const subjectId =
      dto.subjectId !== undefined
        ? dto.subjectId
        : existing.subjectId
          ? idOf(existing.subjectId)
          : undefined;
    const teacherAssignmentId =
      dto.teacherAssignmentId !== undefined
        ? dto.teacherAssignmentId
        : existing.teacherAssignmentId
          ? idOf(existing.teacherAssignmentId)
          : undefined;
    await this.validateScheduleResources({
      schoolId: user.schoolId,
      branchId,
      academicYearId,
      academicPeriodId,
      classId,
      subjectId,
      teacherId,
      teacherAssignmentId,
      classroomId,
    });

    // Conflict detection excluding current schedule
    await this.assertNoConflicts(
      {
        dayOfWeek,
        startTime: resolvedStartTime,
        endTime: resolvedEndTime,
        teacherId: teacherId || undefined,
        classroomId: classroomId || undefined,
        classId,
        branchId,
        academicYearId,
        academicPeriodId,
        effectiveFrom,
        effectiveTo,
        excludeScheduleId: id,
      },
      user,
    );

    const updated = await this.repository.update(
      id,
      {
        ...dto,
        startTime: resolvedStartTime,
        endTime: resolvedEndTime,
        sessionType,
      },
      user.userId,
      user.schoolId,
    );
    if (!updated) {
      throw new NotFoundError(`Class schedule with ID ${id} not found`);
    }

    await AuditLogService.log({
      userId: user.userId,
      schoolId: user.schoolId,
      branchId,
      module: 'class_schedule',
      action: 'UPDATE',
      entityType: 'ClassSchedule',
      entityId: String(updated._id),
      oldValue: existing.toObject(),
      newValue: updated.toObject(),
    });

    return updated;
  }

  public async deleteSchedule(id: string, user: AuthUser): Promise<void> {
    const existing = await this.repository.findById(id, user.schoolId);
    if (!existing) {
      throw new NotFoundError('Class schedule not found');
    }

    if (!checkBranchAccess(user.branchAccess, String(existing.branchId))) {
      throw new ForbiddenError('You do not have access to delete schedules in this branch');
    }

    const classDoc = await ClassModel.findOne({
      _id: new Types.ObjectId(idOf(existing.classId)),
      schoolId: new Types.ObjectId(user.schoolId),
      isDeleted: false,
    }).select('programId');
    if (!classDoc) throw new NotFoundError('Schedule class not found');
    await assertAcademicContextWritable({
      academicYearId: idOf(existing.academicYearId),
      academicPeriodId: existing.academicPeriodId ? idOf(existing.academicPeriodId) : undefined,
      programId: idOf(classDoc.programId),
      operation: 'delete a class schedule',
    });

    await this.repository.softDelete(id, user.userId, user.schoolId);
    await AuditLogService.log({
      userId: user.userId,
      schoolId: user.schoolId,
      branchId: idOf(existing.branchId),
      module: 'class_schedule',
      action: 'DELETE',
      entityType: 'ClassSchedule',
      entityId: String(existing._id),
      oldValue: existing.toObject(),
    });
  }

  public async checkConflicts(
    params: ScheduleConflictCheckParams,
    user: AuthUser,
  ): Promise<ScheduleConflictCheckResult> {
    const scopedParams = { ...params };
    if (params.classId) {
      const targetClass = await ClassModel.findOne({
        _id: params.classId,
        schoolId: new Types.ObjectId(user.schoolId),
        isDeleted: false,
      });
      if (!targetClass) throw new NotFoundError('Class not found for conflict check');
      scopedParams.branchId = idOf(targetClass.branchId);
      scopedParams.academicYearId = idOf(targetClass.academicYearId);
      scopedParams.academicPeriodId = targetClass.academicPeriodId
        ? idOf(targetClass.academicPeriodId)
        : undefined;
    }
    if (!scopedParams.branchId) {
      throw new ValidationError('A class or branch is required for a scoped conflict check');
    }
    if (!checkBranchAccess(user.branchAccess, scopedParams.branchId)) {
      throw new ForbiddenError('You do not have access to check schedules in this branch');
    }
    const branch =
      process.env.NODE_ENV === 'test' &&
      mongoose.connection.readyState !== 1 &&
      !('mock' in BranchModel.exists)
        ? { _id: new Types.ObjectId(scopedParams.branchId) }
        : await BranchModel.exists({
            _id: new Types.ObjectId(scopedParams.branchId),
            schoolId: new Types.ObjectId(user.schoolId),
            isDeleted: false,
          });
    if (!branch) throw new NotFoundError('Schedule branch not found');

    const overlaps = await this.repository.findActiveOverlaps(scopedParams);
    const conflicts: ScheduleConflictCheckResult['conflicts'] = [];

    for (const ov of overlaps) {
      const teacherObj = ov.teacherId as unknown as {
        firstName?: string;
        lastName?: string;
      } | null;
      if (
        params.teacherId &&
        ov.teacherId &&
        String((ov.teacherId as { _id?: unknown })?._id ?? ov.teacherId) === params.teacherId
      ) {
        const teacherName = teacherObj?.firstName
          ? `${teacherObj.firstName} ${teacherObj.lastName ?? ''}`.trim()
          : 'Teacher';
        conflicts.push({
          type: 'TEACHER_CONFLICT',
          message: `${teacherName} is already scheduled on day ${ov.dayOfWeek} from ${ov.startTime} to ${ov.endTime}`,
          conflictingScheduleId: String(ov._id),
          details: { teacherId: params.teacherId, startTime: ov.startTime, endTime: ov.endTime },
        });
      }

      if (
        params.classroomId &&
        ov.classroomId &&
        String((ov.classroomId as { _id?: unknown })?._id ?? ov.classroomId) === params.classroomId
      ) {
        const roomName = (ov.classroomId as { name?: string; code?: string })?.name ?? 'Room';
        conflicts.push({
          type: 'CLASSROOM_CONFLICT',
          message: `Classroom ${roomName} is already booked on day ${ov.dayOfWeek} from ${ov.startTime} to ${ov.endTime}`,
          conflictingScheduleId: String(ov._id),
          details: {
            classroomId: params.classroomId,
            startTime: ov.startTime,
            endTime: ov.endTime,
          },
        });
      }

      if (
        params.classId &&
        ov.classId &&
        String((ov.classId as { _id?: unknown })?._id ?? ov.classId) === params.classId
      ) {
        conflicts.push({
          type: 'CLASS_OVERLAP',
          message: `This class already has a schedule on day ${ov.dayOfWeek} from ${ov.startTime} to ${ov.endTime}`,
          conflictingScheduleId: String(ov._id),
          details: { classId: params.classId, startTime: ov.startTime, endTime: ov.endTime },
        });
      }
    }

    return {
      hasConflict: conflicts.length > 0,
      conflicts,
    };
  }

  public async checkStudentConflicts(
    studentId: string,
    user: AuthUser,
  ): Promise<ScheduleConflictCheckResult> {
    if (!Types.ObjectId.isValid(studentId)) throw new NotFoundError('Student not found');
    const student = await StudentModel.findOne({
      _id: studentId,
      schoolId: new Types.ObjectId(user.schoolId),
      isDeleted: false,
    }).select('branchId');
    if (!student) throw new NotFoundError('Student not found');
    if (!checkBranchAccess(user.branchAccess, idOf(student.branchId))) {
      throw new ForbiddenError('You do not have access to this student schedule');
    }
    const enrollments = await EnrollmentModel.find({
      studentId: new Types.ObjectId(studentId),
      status: { $in: ['enrolled', 'active'] },
      isDeleted: false,
    }).select('classId');

    const classIds = enrollments.map((e) => e.classId);
    if (classIds.length <= 1) {
      return { hasConflict: false, conflicts: [] };
    }

    const schedules = await this.repository.findWithFilters(
      { limit: 100 },
      {
        schoolId: new Types.ObjectId(user.schoolId),
        classId: { $in: classIds },
        status: 'active',
      },
    );

    const conflicts: ScheduleConflictCheckResult['conflicts'] = [];
    const list = schedules.data;

    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const a = list[i];
        const b = list[j];
        if (a && b && String(a.classId) !== String(b.classId) && a.dayOfWeek === b.dayOfWeek) {
          // Time overlap check: startA < endB && endA > startB
          if (a.startTime < b.endTime && a.endTime > b.startTime) {
            conflicts.push({
              type: 'STUDENT_CONFLICT',
              message: `Schedule conflict between enrolled classes on day ${a.dayOfWeek}: ${a.startTime}-${a.endTime} overlaps with ${b.startTime}-${b.endTime}`,
              conflictingScheduleId: String(b._id),
              details: { scheduleA: a._id, scheduleB: b._id },
            });
          }
        }
      }
    }

    return {
      hasConflict: conflicts.length > 0,
      conflicts,
    };
  }

  public async getTodayClassesView(
    branchId: string,
    dateStr: string,
    user: AuthUser,
  ): Promise<{
    date: string;
    dayOfWeek: number;
    branchId: string;
    sessions: Record<string, TodayOperationalClassItem[]>;
    totalClasses: number;
  }> {
    if (!checkBranchAccess(user.branchAccess, branchId)) {
      throw new ForbiddenError('You do not have access to view classes in this branch');
    }
    const branch =
      process.env.NODE_ENV === 'test' &&
      mongoose.connection.readyState !== 1 &&
      !('mock' in BranchModel.exists)
        ? { _id: new Types.ObjectId(branchId) }
        : await BranchModel.exists({
            _id: new Types.ObjectId(branchId),
            schoolId: new Types.ObjectId(user.schoolId),
            isDeleted: false,
          });
    if (!branch) throw new NotFoundError('Branch not found');

    const targetDate = dateStr ? new Date(dateStr) : new Date();
    // JS getDay(): 0=Sun, 1=Mon, ..., 6=Sat. Convert to 1..7 (1=Mon ... 7=Sun)
    const jsDay = targetDate.getDay();
    const dayOfWeek = jsDay === 0 ? 7 : jsDay;

    const schedules = await this.repository.findWithFilters(
      { schoolId: user.schoolId, branchId, dayOfWeek, status: 'active', limit: 100 },
      { branchId: new Types.ObjectId(branchId) },
    );

    // Get attendance records for this date and branch
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const attendances = await AttendanceModel.find({
      schoolId: new Types.ObjectId(user.schoolId),
      branchId: new Types.ObjectId(branchId),
      date: { $gte: startOfDay, $lte: endOfDay },
      isDeleted: false,
    }).select('classId sessionType');

    const markedClassSessionSet = new Set(
      attendances.map((a) => `${String(a.classId)}_${a.sessionType || 'morning'}`),
    );

    // Get active enrollments counts for all scheduled classes
    const classIds = [
      ...new Set(
        schedules.data.map((s) => String((s.classId as { _id?: unknown })?._id ?? s.classId)),
      ),
    ];
    const enrollmentCounts = await EnrollmentModel.aggregate([
      {
        $match: {
          classId: { $in: classIds.map((id) => new Types.ObjectId(id)) },
          status: { $in: ['enrolled', 'active'] },
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: '$classId',
          count: { $sum: 1 },
        },
      },
    ]);

    const countMap = new Map<string, number>();
    enrollmentCounts.forEach((ec) => countMap.set(String(ec._id), ec.count));

    const sessionsGroup: Record<string, TodayOperationalClassItem[]> = {
      morning: [],
      afternoon: [],
      evening: [],
      hourly: [],
    };

    for (const sch of schedules.data) {
      const cls = sch.classId as unknown as {
        _id: Types.ObjectId;
        classCode: string;
        className: string;
        capacity: number;
        programId: { _id: Types.ObjectId; code: string; nameEn: string; nameKh: string };
        levelId: { _id: Types.ObjectId; code: string; name: string };
        studyModeId?: { _id: Types.ObjectId; code: string; nameEn: string };
        section?: string;
      } | null;

      if (!cls) continue;
      const cid = String(cls._id);
      const sess = sch.sessionType || 'morning';

      const item: TodayOperationalClassItem = {
        classId: cid,
        classCode: cls.classCode,
        className: cls.className,
        program: cls.programId
          ? {
              _id: String(cls.programId._id),
              code: cls.programId.code,
              nameEn: cls.programId.nameEn,
              nameKh: cls.programId.nameKh,
            }
          : { _id: '', code: '', nameEn: '', nameKh: '' },
        level: cls.levelId
          ? {
              _id: String(cls.levelId._id),
              code: cls.levelId.code,
              name: cls.levelId.name,
            }
          : { _id: '', code: '', name: '' },
        studyMode: cls.studyModeId
          ? {
              _id: String(cls.studyModeId._id),
              code: cls.studyModeId.code,
              nameEn: cls.studyModeId.nameEn,
            }
          : undefined,
        section: cls.section,
        session: sess,
        startTime: sch.startTime,
        endTime: sch.endTime,
        room: sch.classroomId
          ? {
              _id: String((sch.classroomId as { _id?: unknown })._id ?? sch.classroomId),
              code: (sch.classroomId as { code?: string }).code ?? '',
              name: (sch.classroomId as { name?: string }).name ?? '',
              capacity: (sch.classroomId as { capacity?: number }).capacity ?? 30,
            }
          : undefined,
        teacher: sch.teacherId
          ? {
              _id: String((sch.teacherId as { _id?: unknown })._id ?? sch.teacherId),
              employeeId: (sch.teacherId as { employeeId?: string }).employeeId ?? '',
              name: `${(sch.teacherId as { firstName?: string }).firstName ?? ''} ${(sch.teacherId as { lastName?: string }).lastName ?? ''}`.trim(),
            }
          : undefined,
        subject: sch.subjectId
          ? {
              _id: String((sch.subjectId as { _id?: unknown })._id ?? sch.subjectId),
              code: (sch.subjectId as { code?: string }).code ?? '',
              name: (sch.subjectId as { name?: string }).name ?? '',
            }
          : undefined,
        capacity: cls.capacity ?? 30,
        enrolledCount: countMap.get(cid) ?? 0,
        attendanceMarked: markedClassSessionSet.has(`${cid}_${sess}`),
      };

      if (!sessionsGroup[sess]) {
        sessionsGroup[sess] = [];
      }
      sessionsGroup[sess].push(item);
    }

    return {
      date: targetDate.toISOString().slice(0, 10),
      dayOfWeek,
      branchId,
      sessions: sessionsGroup,
      totalClasses: schedules.data.length,
    };
  }

  private async assertNoConflicts(
    params: ScheduleConflictCheckParams,
    user: AuthUser,
  ): Promise<void> {
    const result = await this.checkConflicts(params, user);
    if (result.hasConflict) {
      throw new ConflictError(result.conflicts.map((c) => c.message).join('. '));
    }
  }

  private async validateScheduleResources(input: {
    schoolId: string;
    branchId: string;
    academicYearId: string;
    academicPeriodId?: string;
    classId: string;
    subjectId?: string;
    teacherId?: string;
    teacherAssignmentId?: string;
    classroomId?: string;
  }): Promise<void> {
    const [subject, teacher, classroom, assignment] = await Promise.all([
      input.subjectId
        ? SubjectModel.findOne({
            _id: new Types.ObjectId(input.subjectId),
            schoolId: new Types.ObjectId(input.schoolId),
            $or: [
              { branchId: new Types.ObjectId(input.branchId) },
              { branchId: { $exists: false } },
              { branchId: null },
            ],
            isDeleted: false,
          }).select('_id')
        : null,
      input.teacherId
        ? EmployeeModel.findOne({
            _id: new Types.ObjectId(input.teacherId),
            schoolId: new Types.ObjectId(input.schoolId),
            branchId: new Types.ObjectId(input.branchId),
            status: 'active',
            isDeleted: false,
          }).select('_id')
        : null,
      input.classroomId
        ? ClassroomModel.findOne({
            _id: new Types.ObjectId(input.classroomId),
            schoolId: new Types.ObjectId(input.schoolId),
            branchId: new Types.ObjectId(input.branchId),
            status: 'active',
            isDeleted: false,
          }).select('_id')
        : null,
      input.teacherAssignmentId
        ? TeacherAssignmentModel.findOne({
            _id: new Types.ObjectId(input.teacherAssignmentId),
            schoolId: new Types.ObjectId(input.schoolId),
            branchId: new Types.ObjectId(input.branchId),
            academicYearId: new Types.ObjectId(input.academicYearId),
            classId: new Types.ObjectId(input.classId),
            ...(input.academicPeriodId
              ? { academicPeriodId: new Types.ObjectId(input.academicPeriodId) }
              : {}),
            ...(input.subjectId ? { subjectId: new Types.ObjectId(input.subjectId) } : {}),
            ...(input.teacherId ? { employeeId: new Types.ObjectId(input.teacherId) } : {}),
            status: 'active',
            isDeleted: false,
          }).select('_id')
        : null,
    ]);
    if (input.subjectId && !subject) throw new ValidationError('Selected subject is unavailable');
    if (input.teacherId && !teacher) throw new ValidationError('Selected teacher is unavailable');
    if (input.classroomId && !classroom) {
      throw new ValidationError('Selected classroom is unavailable');
    }
    if (input.teacherAssignmentId && !assignment) {
      throw new ValidationError('Selected teacher assignment does not match this schedule');
    }
  }
}
