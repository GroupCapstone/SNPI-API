import type { CurriculumStatus } from './curriculum.model';

export interface CurriculumSubjectDto {
  subjectId: string;
  weeklyHours: number;
  totalHours?: number;
  sequence: number;
  passingScore: number;
  isRequired?: boolean;
}

export interface CreateCurriculumDto {
  schoolId?: string;
  branchId?: string;
  programId: string;
  levelId: string;
  academicYearId: string;
  name: string;
  code: string;
  description?: string;
  subjects?: CurriculumSubjectDto[];
  status?: CurriculumStatus;
}

export interface UpdateCurriculumDto {
  branchId?: string;
  programId?: string;
  levelId?: string;
  academicYearId?: string;
  name?: string;
  code?: string;
  description?: string;
  subjects?: CurriculumSubjectDto[];
  status?: CurriculumStatus;
}

export interface CurriculumQueryFilters {
  search?: string;
  schoolId?: string;
  branchId?: string;
  programId?: string;
  levelId?: string;
  academicYearId?: string;
  status?: CurriculumStatus;
  page?: number;
  limit?: number;
}
