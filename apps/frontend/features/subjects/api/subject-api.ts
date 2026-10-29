import { apiClient } from '@/lib/api-client';
import type { ApiPaginatedResponse, ApiSuccessResponse } from '@/types/api';
import type { SubjectFormData } from '../schemas';
import type { Subject, SubjectFilters } from '../types';

export const getSubjects = async (filters: SubjectFilters = {}) => {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.status) params.append('status', filters.status);
  if (filters.page) params.append('page', String(filters.page));
  if (filters.limit) params.append('limit', String(filters.limit));

  const queryString = params.toString();
  const url = `/subjects${queryString ? `?${queryString}` : ''}`;
  return apiClient.get<ApiPaginatedResponse<Subject>>(url);
};

export const createSubject = async (data: SubjectFormData) => {
  return apiClient.post<ApiSuccessResponse<Subject>>('/subjects', data);
};

export const updateSubject = async (id: string, data: Partial<SubjectFormData>) => {
  return apiClient.patch<ApiSuccessResponse<Subject>>(`/subjects/${id}`, data);
};

export const deleteSubject = async (id: string) => {
  return apiClient.delete<ApiSuccessResponse<null>>(`/subjects/${id}`);
};
