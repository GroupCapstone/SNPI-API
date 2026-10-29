import { apiClient } from '@/lib/api-client';
import type { ApiPaginatedResponse, ApiSuccessResponse } from '@/types/api';
import type { ClassFormData } from '../schemas';
import type { ClassAvailabilitySummary, ClassFilters, ClassItem } from '../types';

export const getClasses = async (filters: ClassFilters = {}) => {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.branchId) params.append('branchId', filters.branchId);
  if (filters.academicYearId) params.append('academicYearId', filters.academicYearId);
  if (filters.programId) params.append('programId', filters.programId);
  if (filters.levelId) params.append('levelId', filters.levelId);
  if (filters.curriculumId) params.append('curriculumId', filters.curriculumId);
  if (filters.shift) params.append('shift', filters.shift);
  if (filters.daysPattern) params.append('daysPattern', filters.daysPattern);
  if (filters.status) params.append('status', filters.status);
  if (filters.availability) params.append('availability', filters.availability);
  if (filters.page) params.append('page', String(filters.page));
  if (filters.limit) params.append('limit', String(filters.limit));

  const queryString = params.toString();
  const url = `/classes${queryString ? `?${queryString}` : ''}`;
  return apiClient.get<ApiPaginatedResponse<ClassItem>>(url);
};

export const getClassSummary = async (filters: Partial<ClassFilters> = {}) => {
  const params = new URLSearchParams();
  if (filters.branchId) params.append('branchId', filters.branchId);
  if (filters.academicYearId) params.append('academicYearId', filters.academicYearId);
  if (filters.programId) params.append('programId', filters.programId);
  if (filters.levelId) params.append('levelId', filters.levelId);
  if (filters.shift) params.append('shift', filters.shift);
  if (filters.status) params.append('status', filters.status);

  const queryString = params.toString();
  const url = `/classes/summary${queryString ? `?${queryString}` : ''}`;
  return apiClient.get<ApiSuccessResponse<ClassAvailabilitySummary>>(url);
};

export const getClassById = async (id: string) => {
  return apiClient.get<ApiSuccessResponse<ClassItem>>(`/classes/${id}`);
};

export const createClass = async (data: ClassFormData) => {
  return apiClient.post<ApiSuccessResponse<ClassItem>>('/classes', data);
};

export const updateClass = async (id: string, data: Partial<ClassFormData>) => {
  return apiClient.patch<ApiSuccessResponse<ClassItem>>(`/classes/${id}`, data);
};

export const deleteClass = async (id: string) => {
  return apiClient.delete<ApiSuccessResponse<null>>(`/classes/${id}`);
};
