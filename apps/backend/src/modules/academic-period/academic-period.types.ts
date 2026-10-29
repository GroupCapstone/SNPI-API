import type {
  AcademicPeriodStatus,
  AcademicPeriodType,
  IAcademicPeriod,
} from './academic-period.model';

export interface CreateAcademicPeriodDto {
  schoolId?: string;
  programId?: string;
  code: string;
  name: string;
  type: AcademicPeriodType;
  academicYearId: string;
  startDate: string | Date;
  endDate: string | Date;
  sequence?: number;
  status?: AcademicPeriodStatus;
}

export interface UpdateAcademicPeriodDto {
  schoolId?: string;
  programId?: string;
  code?: string;
  name?: string;
  type?: AcademicPeriodType;
  academicYearId?: string;
  startDate?: string | Date;
  endDate?: string | Date;
  sequence?: number;
  status?: AcademicPeriodStatus;
}

export interface AcademicPeriodQueryFilters {
  schoolId?: string;
  programId?: string;
  academicYearId?: string;
  type?: AcademicPeriodType;
  status?: AcademicPeriodStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedAcademicPeriods {
  data: IAcademicPeriod[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AcademicPeriodTransitionDto {
  status: AcademicPeriodStatus;
  reason?: string;
}

export interface ClosingIssue {
  type:
    | 'MISSING_SCORE'
    | 'DRAFT_ASSESSMENT'
    | 'UNAPPROVED_RESULT'
    | 'UNRESOLVED_PROMOTION'
    | 'INCOMPLETE_TRANSFER'
    | 'DUPLICATE_ENROLLMENT'
    | 'INVALID_ACADEMIC_REFERENCE';
  message: string;
  classId?: string;
  className?: string;
  count: number;
}

export interface ClosingWarning {
  type:
    | 'ATTENDANCE_COMPLETENESS'
    | 'UNASSIGNED_TEACHER'
    | 'OUTSTANDING_BALANCE'
    | 'INCOMPLETE_SCHEDULE';
  message: string;
  count: number;
}

export interface PeriodClosingPreview {
  classesCount: number;
  activeEnrollmentsCount: number;
  promotedCount: number;
  repeatedCount: number;
  continuedCount: number;
  graduatedCount: number;
  withdrawnCount: number;
  unresolvedCount: number;
  projectedTargetEnrollmentsCount: number;
}

export interface AcademicPeriodClosingChecklist {
  academicPeriodId: string;
  canFinalize: boolean;
  canClose: boolean;
  checkedAt: Date;
  counts: {
    classes: number;
    activeEnrollments: number;
    assessments: number;
    draftAssessments: number;
    expectedScores: number;
    recordedScores: number;
    missingScores: number;
    attendanceSessions: number;
    studentsWithoutAttendance: number;
    termResults: number;
    unapprovedResults: number;
    unresolvedPromotions: number;
  };
  problems: string[];
  blockingIssues: ClosingIssue[];
  warnings: ClosingWarning[];
  preview: PeriodClosingPreview;
}

export interface GenerateMonthlyPeriodsDto {
  academicYearId: string;
  calendarYear?: number;
  startMonth?: number;
  monthCount?: number;
  schoolId?: string;
  programId?: string;
}

export interface GeneratedMonthlyPeriodsResult {
  createdCount: number;
  skippedCount: number;
  periods: IAcademicPeriod[];
}
