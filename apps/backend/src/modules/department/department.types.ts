import type { DepartmentStatus } from './department.model';

export interface CreateDepartmentDto {
  schoolId: string;
  branchId: string;
  code: string;
  nameKh: string;
  nameEn: string;
  description?: string;
  managerId?: string;
  status?: DepartmentStatus;
}

export interface UpdateDepartmentDto {
  schoolId?: string;
  branchId?: string;
  code?: string;
  nameKh?: string;
  nameEn?: string;
  description?: string;
  managerId?: string;
  status?: DepartmentStatus;
}

export interface DepartmentQueryFilters {
  search?: string;
  schoolId?: string;
  branchId?: string;
  status?: DepartmentStatus;
  page?: number;
  limit?: number;
}
