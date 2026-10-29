import { apiClient } from '@/lib/api-client';
import type { ApiPaginatedResponse, ApiSuccessResponse } from '@/types/api';
import type { AssessmentFormData } from '../schemas';
import type { Assessment, AssessmentFilters } from '../types';

export const getAssessments = async (filters: AssessmentFilters = {}) => {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.schoolId) params.append('schoolId', filters.schoolId);
  if (filters.branchId) params.append('branchId', filters.branchId);
  if (filters.academicYearId) params.append('academicYearId', filters.academicYearId);
  if (filters.classId) params.append('classId', filters.classId);
  if (filters.subjectId) params.append('subjectId', filters.subjectId);
  if (filters.type) params.append('type', filters.type);
  if (filters.status) params.append('status', filters.status);
  if (filters.page) params.append('page', String(filters.page));
  if (filters.limit) params.append('limit', String(filters.limit));

  const queryString = params.toString();
  const url = `/assessments${queryString ? `?${queryString}` : ''}`;
  return apiClient.get<ApiPaginatedResponse<Assessment>>(url);
};

export const getAssessmentById = async (id: string) => {
  return apiClient.get<ApiSuccessResponse<Assessment>>(`/assessments/${id}`);
};

export const createAssessment = async (data: AssessmentFormData) => {
  return apiClient.post<ApiSuccessResponse<Assessment>>('/assessments', data);
};

export const updateAssessment = async (id: string, data: Partial<AssessmentFormData>) => {
  return apiClient.patch<ApiSuccessResponse<Assessment>>(`/assessments/${id}`, data);
};

export const deleteAssessment = async (id: string) => {
  return apiClient.delete<ApiSuccessResponse<null>>(`/assessments/${id}`);
};
