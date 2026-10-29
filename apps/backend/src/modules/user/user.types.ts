import type { UserStatus } from './user.model';

export interface CreateUserDto {
  schoolId: string;
  employeeId?: string;
  username: string;
  email: string;
  password: string;
  roles: string[];
  branchAccess: 'all' | string[];
  departmentAccess?: 'all' | string[];
  directPermissions?: string[];
  status?: UserStatus;
  mustChangePassword?: boolean;
}

export interface UpdateUserDto {
  schoolId?: string;
  employeeId?: string;
  username?: string;
  email?: string;
  password?: string;
  roles?: string[];
  branchAccess?: 'all' | string[];
  departmentAccess?: 'all' | string[];
  directPermissions?: string[];
  status?: UserStatus;
  mustChangePassword?: boolean;
}

export interface UserQueryFilters {
  search?: string;
  schoolId?: string;
  branchId?: string;
  role?: string;
  status?: UserStatus;
  page?: number;
  limit?: number;
}

export interface AdminResetPasswordDto {
  temporaryPassword?: string;
}

export interface AdminResetPasswordResult {
  message: string;
  temporaryPassword: string;
  mustChangePassword: boolean;
}
