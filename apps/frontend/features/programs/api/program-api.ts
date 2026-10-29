import { apiClient } from '@/lib/api-client';
import type { ApiPaginatedResponse, ApiSuccessResponse } from '@/types/api';
import type { ProgramFormData } from '../schemas';
import type { Program, ProgramFilters } from '../types';

export const getPrograms = async (filters: ProgramFilters = {}) => {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.status) params.append('status', filters.status);
  if (filters.page) params.append('page', String(filters.page));
  if (filters.limit) params.append('limit', String(filters.limit));

  const queryString = params.toString();
  const url = `/programs${queryString ? `?${queryString}` : ''}`;
  return apiClient.get<ApiPaginatedResponse<Program>>(url);
};

export const createProgram = async (data: ProgramFormData) => {
  return apiClient.post<ApiSuccessResponse<Program>>('/programs', data);
};

export const updateProgram = async (id: string, data: Partial<ProgramFormData>) => {
  return apiClient.patch<ApiSuccessResponse<Program>>(`/programs/${id}`, data);
};

export const deleteProgram = async (id: string) => {
  return apiClient.delete<ApiSuccessResponse<null>>(`/programs/${id}`);
};
