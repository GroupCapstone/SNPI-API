import { apiClient } from '@/lib/api-client';
import type { ApiPaginatedResponse, ApiSuccessResponse } from '@/types/api';

import type {
  ConfirmImportPayload,
  ConfirmImportResponse,
  CreateStudentPayload,
  DuplicateCheckCriteria,
  DuplicateCheckResponse,
  ImportPreviewResponse,
  RawImportStudentRow,
  Student,
  StudentQueryFilters,
  UpdateStudentPayload,
} from '../types';

export const getStudentsApi = async (
  filters?: StudentQueryFilters,
): Promise<ApiPaginatedResponse<Student>> => {
  const params = new URLSearchParams();
  if (filters?.page) params.append('page', String(filters.page));
  if (filters?.limit) params.append('limit', String(filters.limit));
  if (filters?.search) params.append('search', filters.search);
  if (filters?.branchId && filters.branchId !== 'all') params.append('branchId', filters.branchId);
  if (filters?.schoolId) params.append('schoolId', filters.schoolId);
  if (filters?.status) params.append('status', filters.status);
  if (filters?.gender) params.append('gender', filters.gender);
  if (filters?.sortBy) params.append('sortBy', filters.sortBy);
  if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

  const query = params.toString();
  return apiClient.get<ApiPaginatedResponse<Student>>(`/students${query ? `?${query}` : ''}`);
};

export const getStudentByIdApi = async (id: string): Promise<ApiSuccessResponse<Student>> => {
  return apiClient.get<ApiSuccessResponse<Student>>(`/students/${id}`);
};

export const createStudentApi = async (
  payload: CreateStudentPayload,
): Promise<ApiSuccessResponse<Student>> => {
  return apiClient.post<ApiSuccessResponse<Student>>('/students', payload);
};

export const updateStudentApi = async (
  id: string,
  payload: UpdateStudentPayload,
): Promise<ApiSuccessResponse<Student>> => {
  return apiClient.patch<ApiSuccessResponse<Student>>(`/students/${id}`, payload);
};

export const deleteStudentApi = async (id: string): Promise<ApiSuccessResponse<null>> => {
  return apiClient.delete<ApiSuccessResponse<null>>(`/students/${id}`);
};

export const checkDuplicatesApi = async (
  criteria: DuplicateCheckCriteria,
): Promise<ApiSuccessResponse<DuplicateCheckResponse>> => {
  return apiClient.post<ApiSuccessResponse<DuplicateCheckResponse>>(
    '/students/check-duplicates',
    criteria,
  );
};

export const previewImportApi = async (payload: {
  schoolId: string;
  branchId: string;
  rows: RawImportStudentRow[];
}): Promise<ApiSuccessResponse<ImportPreviewResponse>> => {
  return apiClient.post<ApiSuccessResponse<ImportPreviewResponse>>(
    '/students/import/preview',
    payload,
  );
};

export const confirmImportApi = async (
  payload: ConfirmImportPayload,
): Promise<ApiSuccessResponse<ConfirmImportResponse>> => {
  return apiClient.post<ApiSuccessResponse<ConfirmImportResponse>>(
    '/students/import/confirm',
    payload,
  );
};
