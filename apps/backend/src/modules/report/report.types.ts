import type { IOfficialDocument, OfficialDocumentType } from './report.model';

export interface ReportQueryFilters {
  schoolId?: string;
  type?: OfficialDocumentType;
  branchId?: string;
  studentId?: string;
  status?: 'active' | 'voided';
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  authorizedBranchIds?: string[];
  allowedTypes?: OfficialDocumentType[];
}

export interface PaginatedOfficialDocuments {
  data: IOfficialDocument[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ReportPreview {
  document?: IOfficialDocument;
  payload: Record<string, unknown>;
  snapshotSource: 'finalized_result' | 'official_document' | 'legacy_derived' | 'live_record';
}

export interface MonthlyReportQuery {
  year: number;
  month?: number;
  search?: string;
  paymentCurrency?: 'USD' | 'KHR';
  branchId?: string;
  academicYearId?: string;
  classId?: string;
  page?: number;
  limit?: number;
  schoolId?: string;
  authorizedBranchIds?: string[];
}

export interface MonthlyAttendanceCell {
  month: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  permission: number;
  total: number;
  rate: number;
}

export interface MonthlyRankingCell {
  month: number;
  average: number | null;
  rank: number | null;
  assessments: number;
}

export type MonthlyPaymentStatus = 'paid' | 'partial' | 'unpaid' | 'upcoming' | 'not_configured';

export interface MonthlyPaymentCell {
  month: number;
  status: MonthlyPaymentStatus;
  expected: number;
  paid: number;
  balance: number;
  currency: 'USD' | 'KHR' | null;
  receipts: Array<{ id: string; number: string }>;
}

export interface MonthlyStudentRow<TCell> {
  studentId: string;
  studentCode: string;
  name: string;
  khmerName: string;
  cells: TCell[];
}

export interface MonthlyTrendPoint {
  month: number;
  revenueUsd: number;
  revenueKhr: number;
  admissions: number;
  enrollments: number;
  attendanceRate: number;
  transfers: number;
  dropouts: number;
}

export interface SelectedMonthSummary {
  month: number;
  monthName: string;
  monthNameKh: string;
  totalStudents: number;
  attendanceRate: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  averageScore: number;
  totalRevenueUsd: number;
  totalRevenueKhr: number;
  paidCount: number;
  partialCount: number;
  unpaidCount: number;
  overdueCount: number;
}

export interface BranchBenchmark {
  branchId: string;
  branchCode: string;
  branchName: string;
  students: number;
  passRate: number;
  averageScore: number;
  attendanceRate: number;
}

export interface MonthlyReportOverview {
  access: { attendance: boolean; academic: boolean; finance: boolean; student: boolean };
  paymentCurrency: 'USD' | 'KHR';
  year: number;
  selectedMonth?: number;
  selectedMonthSummary?: SelectedMonthSummary;
  generatedAt: string;
  scope: { branchId?: string; academicYearId?: string; classId?: string };
  pagination: { page: number; limit: number; total: number; totalPages: number };
  summary: {
    students: number;
    averageAttendanceRate: number;
    averageAssessmentScore: number;
    overdueAccounts: number;
  };
  attendance: {
    months: MonthlyAttendanceCell[];
    students: MonthlyStudentRow<MonthlyAttendanceCell>[];
  };
  rankings: MonthlyStudentRow<MonthlyRankingCell>[];
  payments: MonthlyStudentRow<MonthlyPaymentCell>[];
  trends: MonthlyTrendPoint[];
  branchBenchmarks: BranchBenchmark[];
}
