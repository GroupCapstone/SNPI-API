import type { IIntake, IntakeStatus } from './intake.model';

export interface CreateIntakeDto {
  schoolId?: string;
  branchId?: string;
  academicYearId: string;
  academicPeriodId: string;
  programId: string;
  levelId: string;
  curriculumId?: string;
  code: string;
  name: string;
  startDate?: string | Date;
  endDate?: string | Date;
  capacity?: number;
  status?: IntakeStatus;
}

export interface UpdateIntakeDto {
  branchId?: string;
  academicYearId?: string;
  academicPeriodId?: string;
  programId?: string;
  levelId?: string;
  curriculumId?: string;
  code?: string;
  name?: string;
  startDate?: string | Date;
  endDate?: string | Date;
  capacity?: number;
  status?: IntakeStatus;
}

export interface IntakeQueryFilters {
  branchId?: string;
  academicYearId?: string;
  academicPeriodId?: string;
  programId?: string;
  levelId?: string;
  status?: IntakeStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedIntakes {
  data: IIntake[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
