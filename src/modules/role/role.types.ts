import type { RoleStatus } from './role.model';

export interface CreateRoleDto {
  code: string;
  nameEn: string;
  nameKh?: string;
  description?: string;
  permissions: string[];
  status?: RoleStatus;
}

export interface UpdateRoleDto {
  nameEn?: string;
  nameKh?: string;
  description?: string;
  permissions?: string[];
  status?: RoleStatus;
}

export interface RoleQueryFilters {
  search?: string;
  status?: RoleStatus;
  isSystem?: boolean;
  page?: number;
  limit?: number;
}
