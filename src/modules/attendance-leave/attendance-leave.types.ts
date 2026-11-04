import type { AttendanceLeaveStatus, AttendanceLeaveType } from './attendance-leave.model';

export interface CreateAttendanceLeaveDto {
  branchId: string;
  studentId: string;
  enrollmentId: string;
  classId: string;
  leaveType: AttendanceLeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  documentUrl?: string;
  documentName?: string;
}

export interface ReviewAttendanceLeaveDto {
  status: 'approved' | 'rejected' | 'cancelled';
  reviewNotes?: string;
}

export interface AttendanceLeaveFilters {
  branchId?: string;
  studentId?: string;
  classId?: string;
  status?: AttendanceLeaveStatus;
  leaveType?: AttendanceLeaveType;
  startDate?: string;
  endDate?: string;
  authorizedClassIds?: string[];
  page?: number;
  limit?: number;
}
