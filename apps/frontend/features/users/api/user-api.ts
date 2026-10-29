import { apiClient } from '@/lib/api-client';
import type { ApiPaginatedResponse, ApiSuccessResponse } from '@/types/api';
import type {
  AdminResetPasswordDto,
  AdminResetPasswordResponse,
  User,
  UserFilters,
} from '../types';

export interface UserPayload {
  schoolId: string;
  employeeId?: string;
  username: string;
  email: string;
  password?: string;
  roles: string[];
  branchAccess: 'all' | string[];
  status: 'active' | 'inactive' | 'locked';
}

export const getUsers = async (filters: UserFilters = {}) => {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.schoolId) params.append('schoolId', filters.schoolId);
  if (
    filters.branchId &&
    filters.branchId !== 'all' &&
    filters.branchId !== 'all_branches' &&
    filters.branchId !== 'all-branches'
  ) {
    params.append('branchId', filters.branchId);
  }
  if (filters.role) params.append('role', filters.role);
  if (filters.status) params.append('status', filters.status);
  if (filters.page) params.append('page', String(filters.page));
  if (filters.limit) params.append('limit', String(filters.limit));

  const queryString = params.toString();
  const url = `/users${queryString ? `?${queryString}` : ''}`;
  return apiClient.get<ApiPaginatedResponse<User>>(url);
};

export const getUserById = async (id: string) => {
  return apiClient.get<ApiSuccessResponse<User>>(`/users/${id}`);
};

export const createUser = async (data: UserPayload) => {
  return apiClient.post<ApiSuccessResponse<User>>('/users', data);
};

export const updateUser = async (id: string, data: Partial<UserPayload>) => {
  return apiClient.patch<ApiSuccessResponse<User>>(`/users/${id}`, data);
};

export const deleteUser = async (id: string) => {
  return apiClient.delete<ApiSuccessResponse<null>>(`/users/${id}`);
};

export const resetUserPassword = async (id: string, data?: AdminResetPasswordDto) => {
  return apiClient.post<ApiSuccessResponse<AdminResetPasswordResponse>>(
    `/users/${id}/reset-password`,
    data ?? {},
  );
};

export const updateUserStatus = async (
  id: string,
  status: 'active' | 'inactive' | 'locked' | 'suspended',
) => {
  return apiClient.patch<ApiSuccessResponse<User>>(`/users/${id}/status`, { status });
};
