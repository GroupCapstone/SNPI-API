import type { SessionType } from '../time-slot/time-slot.model';
import type { AttendanceStatus } from './attendance.model';

export interface AttendanceRecordInput {
  studentId: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface MarkAttendanceDTO {
  schoolId: string;
  branchId: string;
  academicYearId: string;
  academicPeriodId?: string;
  classId: string;
  scheduleId?: string;
  teacherId?: string;
  sessionType?: SessionType;
  date: string | Date;
  records: AttendanceRecordInput[];
}

export interface AttendanceQueryFilters {
  authorizedClassIds?: string[];
  authorizedBranchIds?: string[];
  page?: number;
  limit?: number;
  schoolId?: string;
  branchId?: string;
  academicYearId?: string;
  academicPeriodId?: string;
  programId?: string;
  levelId?: string;
  classId?: string;
  scheduleId?: string;
  sessionType?: SessionType;
  date?: string;
  startDate?: string;
  endDate?: string;
  studentId?: string;
  status?: AttendanceStatus;
}
