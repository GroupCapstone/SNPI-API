import type { LevelStatus } from './level.model';

export interface CreateLevelDto {
  schoolId?: string;
  branchId?: string;
  programId: string;
  code: string;
  name: string;
  description?: string;
  sequence?: number;
  status?: LevelStatus;
}

export interface UpdateLevelDto {
  branchId?: string;
  programId?: string;
  code?: string;
  name?: string;
  description?: string;
  sequence?: number;
  status?: LevelStatus;
}

export interface LevelQueryFilters {
  schoolId?: string;
  search?: string;
  programId?: string;
  branchId?: string;
  status?: LevelStatus;
  page?: number;
  limit?: number;
}
