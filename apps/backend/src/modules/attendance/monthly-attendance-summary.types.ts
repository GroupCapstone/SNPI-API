import type {
  IMonthlyAttendanceSummary,
  MonthlyAttendanceSummaryStatus,
} from './monthly-attendance-summary.model';

export interface MonthlyAttendanceSummaryQueryFilters {
  branchId?: string;
  academicYearId?: string;
  academicPeriodId?: string;
  classId?: string;
  studentId?: string;
  enrollmentId?: string;
  year?: number;
  month?: number;
  status?: MonthlyAttendanceSummaryStatus;
  page?: number;
  limit?: number;
  authorizedBranchIds?: string[];
  authorizedClassIds?: string[];
}

export interface RecalculateMonthlyAttendanceDto {
  classId: string;
  year: number;
  month: number;
  academicYearId?: string;
}

export interface StudentMonthlyRollup {
  studentId: string;
  academicYearId: string;
  year: number;
  monthlySummaries: IMonthlyAttendanceSummary[];
  totalSessions: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  permissionCount: number;
  overallAttendanceRate: number;
}

export interface ClassMonthlyAttendanceReport {
  classId: string;
  year: number;
  month: number;
  totalStudents: number;
  averageAttendanceRate: number;
  summaries: IMonthlyAttendanceSummary[];
}

export interface PaginatedMonthlyAttendanceSummaries {
  data: IMonthlyAttendanceSummary[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
