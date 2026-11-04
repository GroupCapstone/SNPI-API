import type { SessionType } from '../time-slot/time-slot.model';
import type { ScheduleStatus } from './class-schedule.model';

export interface CreateClassScheduleDto {
  schoolId?: string;
  classId: string;
  branchId?: string;
  academicYearId?: string;
  academicPeriodId?: string;
  dayOfWeek: number; // 1..7
  timeSlotId?: string;
  sessionType?: SessionType;
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  subjectId?: string;
  teacherId?: string;
  teacherAssignmentId?: string;
  classroomId?: string;
  effectiveFrom?: string;
  effectiveTo?: string;
  status?: ScheduleStatus;
}

export interface UpdateClassScheduleDto {
  dayOfWeek?: number;
  timeSlotId?: string;
  sessionType?: SessionType;
  startTime?: string;
  endTime?: string;
  subjectId?: string;
  teacherId?: string;
  teacherAssignmentId?: string;
  classroomId?: string;
  effectiveFrom?: string;
  effectiveTo?: string;
  status?: ScheduleStatus;
}

export interface ClassScheduleQueryFilters {
  schoolId?: string;
  classId?: string;
  branchId?: string;
  academicYearId?: string;
  academicPeriodId?: string;
  dayOfWeek?: number;
  sessionType?: SessionType;
  teacherId?: string;
  classroomId?: string;
  status?: ScheduleStatus;
  page?: number;
  limit?: number;
}

export interface ScheduleConflictCheckResult {
  hasConflict: boolean;
  conflicts: Array<{
    type: 'TEACHER_CONFLICT' | 'CLASSROOM_CONFLICT' | 'CLASS_OVERLAP' | 'STUDENT_CONFLICT';
    message: string;
    conflictingScheduleId?: string;
    details?: Record<string, unknown>;
  }>;
}

export interface ScheduleConflictCheckParams {
  branchId?: string;
  academicYearId?: string;
  academicPeriodId?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  effectiveFrom?: string;
  effectiveTo?: string;
  teacherId?: string;
  classroomId?: string;
  classId?: string;
  excludeScheduleId?: string;
}

export interface TimetableSlotItem {
  scheduleId: string;
  classId: string;
  classCode: string;
  className: string;
  programName?: string;
  levelName?: string;
  subjectId?: string;
  subjectCode?: string;
  subjectName?: string;
  teacherId?: string;
  teacherName?: string;
  classroomId?: string;
  roomNumber?: string;
  dayOfWeek: number;
  sessionType: SessionType;
  startTime: string;
  endTime: string;
  capacity?: number;
  enrolledCount?: number;
}

export interface TodayOperationalClassItem {
  classId: string;
  classCode: string;
  className: string;
  program: { _id: string; code: string; nameEn: string; nameKh: string };
  level: { _id: string; code: string; name: string };
  studyMode?: { _id: string; code: string; nameEn: string };
  section?: string;
  session: SessionType;
  startTime: string;
  endTime: string;
  room?: { _id: string; code: string; name: string; capacity: number };
  teacher?: { _id: string; employeeId: string; name: string };
  subject?: { _id: string; code: string; name: string };
  capacity: number;
  enrolledCount: number;
  attendanceMarked: boolean;
}
