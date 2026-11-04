import type { AcademicYearStatus } from './academic-year.model';

export interface CreateAcademicYearDto {
  schoolId?: string;
  name: string;
  code: string;
  startDate: string | Date;
  endDate: string | Date;
  isCurrent?: boolean;
  status?: AcademicYearStatus;
}

export interface UpdateAcademicYearDto {
  schoolId?: string;
  name?: string;
  code?: string;
  startDate?: string | Date;
  endDate?: string | Date;
  isCurrent?: boolean;
  status?: AcademicYearStatus;
}

export interface AcademicYearQueryFilters {
  schoolId?: string;
  status?: string;
  search?: string;
  isCurrent?: boolean;
  page?: number;
  limit?: number;
}

export interface AcademicYearTransitionDto {
  status: AcademicYearStatus;
  reason?: string;
}

export interface AcademicYearClosingChecklist {
  academicYearId: string;
  canClose: boolean;
  checkedAt: Date;
  counts: {
    periods: number;
    nonClosedPeriods: number;
    activeEnrollments: number;
    unlockedResults: number;
  };
  problems: string[];
}
