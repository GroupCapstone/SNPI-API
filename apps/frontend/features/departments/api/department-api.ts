import { apiClient } from '@/lib/api-client';
import type { ApiPaginatedResponse, ApiSuccessResponse } from '@/types/api';
import type { DepartmentFormData } from '../schemas';
import type { Department, DepartmentFilters } from '../types';

export const getDepartments = async (filters: DepartmentFilters = {}) => {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.schoolId) params.append('schoolId', filters.schoolId);
  if (filters.branchId) params.append('branchId', filters.branchId);
  if (filters.status) params.append('status', filters.status);
  if (filters.page) params.append('page', String(filters.page));
  if (filters.limit) params.append('limit', String(filters.limit));

  const queryString = params.toString();
  const url = `/departments${queryString ? `?${queryString}` : ''}`;
  return apiClient.get<ApiPaginatedResponse<Department>>(url);
};

export const getDepartmentById = async (id: string) => {
  return apiClient.get<ApiSuccessResponse<Department>>(`/departments/${id}`);
};

export const createDepartment = async (data: DepartmentFormData) => {
  return apiClient.post<ApiSuccessResponse<Department>>('/departments', data);
};

export const updateDepartment = async (id: string, data: Partial<DepartmentFormData>) => {
  return apiClient.patch<ApiSuccessResponse<Department>>(`/departments/${id}`, data);
};

export const deleteDepartment = async (id: string) => {
  return apiClient.delete<ApiSuccessResponse<null>>(`/departments/${id}`);
};
