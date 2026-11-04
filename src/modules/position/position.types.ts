import type { PositionStatus } from './position.model';

export interface CreatePositionDto {
  schoolId: string;
  branchId: string;
  departmentId: string;
  code: string;
  nameKh: string;
  nameEn: string;
  description?: string;
  status?: PositionStatus;
}

export interface UpdatePositionDto {
  schoolId?: string;
  branchId?: string;
  departmentId?: string;
  code?: string;
  nameKh?: string;
  nameEn?: string;
  description?: string;
  status?: PositionStatus;
}

export interface PositionQueryFilters {
  search?: string;
  schoolId?: string;
  branchId?: string;
  departmentId?: string;
  status?: PositionStatus;
  page?: number;
  limit?: number;
}
