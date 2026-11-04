import type { EnrollmentStatus, TuitionPaymentStatus } from './enrollment.model';

export interface CreateEnrollmentDTO {
  enrollmentCode?: string;
  studentId: string;
  schoolId: string;
  branchId: string;
  academicYearId: string;
  academicPeriodId?: string;
  programId: string;
  levelId: string;
  classId: string;
  studyModeId?: string;
  enrollmentDate?: string | Date;
  startDate?: string | Date;
  endDate?: string | Date;
  status?: EnrollmentStatus;
  tuitionStatus?: TuitionPaymentStatus;
  remarks?: string;
}

export interface UpdateEnrollmentDTO {
  studentId?: string;
  schoolId?: string;
  branchId?: string;
  academicYearId?: string;
  academicPeriodId?: string;
  programId?: string;
  levelId?: string;
  classId?: string;
  studyModeId?: string;
  enrollmentDate?: string | Date;
  startDate?: string | Date;
  endDate?: string | Date;
  status?: EnrollmentStatus;
  tuitionStatus?: TuitionPaymentStatus;
  remarks?: string;
}

export interface EnrollmentQueryFilters {
  authorizedClassIds?: string[];
  authorizedBranchIds?: string[];
  page?: number;
  limit?: number;
  search?: string;
  studentId?: string;
  schoolId?: string;
  branchId?: string;
  academicYearId?: string;
  academicPeriodId?: string;
  programId?: string;
  levelId?: string;
  classId?: string;
  status?: EnrollmentStatus;
  statusGroup?: 'continuing' | 'completed' | 'dropped' | 'transferred' | 'all';
  tuitionStatus?: TuitionPaymentStatus;
  month?: number;
  year?: number;
  startDate?: string | Date;
  endDate?: string | Date;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
