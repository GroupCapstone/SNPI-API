import type { SubjectCategory, SubjectStatus } from './subject.model';

export interface CreateSubjectDto {
  schoolId?: string;
  branchId?: string;
  code: string;
  name: string;
  category?: SubjectCategory;
  description?: string;
  status?: SubjectStatus;
}

export interface UpdateSubjectDto {
  branchId?: string;
  code?: string;
  name?: string;
  category?: SubjectCategory;
  description?: string;
  status?: SubjectStatus;
}

export interface SubjectQueryFilters {
  schoolId?: string;
  search?: string;
  branchId?: string;
  category?: SubjectCategory;
  status?: SubjectStatus;
  page?: number;
  limit?: number;
}
