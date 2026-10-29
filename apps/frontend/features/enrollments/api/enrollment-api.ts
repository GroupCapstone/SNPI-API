import { apiClient } from '@/lib/api-client';
import type { ApiPaginatedResponse, ApiSuccessResponse } from '@/types/api';

import type {
  CreateEnrollmentPayload,
  Enrollment,
  EnrollmentQueryFilters,
  UpdateEnrollmentPayload,
} from '../types';

export const getEnrollmentsApi = async (
  filters?: EnrollmentQueryFilters,
): Promise<ApiPaginatedResponse<Enrollment>> => {
  const params = new URLSearchParams();
  if (filters?.page) params.append('page', String(filters.page));
  if (filters?.limit) params.append('limit', String(filters.limit));
  if (filters?.search) params.append('search', filters.search);
  if (filters?.studentId) params.append('studentId', filters.studentId);
  if (filters?.schoolId) params.append('schoolId', filters.schoolId);
  if (filters?.branchId && filters.branchId !== 'all') params.append('branchId', filters.branchId);
  if (filters?.academicYearId) params.append('academicYearId', filters.academicYearId);
  if (filters?.academicPeriodId) params.append('academicPeriodId', filters.academicPeriodId);
  if (filters?.programId) params.append('programId', filters.programId);
  if (filters?.levelId) params.append('levelId', filters.levelId);
  if (filters?.classId) params.append('classId', filters.classId);
  if (filters?.status) params.append('status', filters.status);
  if (filters?.statusGroup && filters.statusGroup !== 'all')
    params.append('statusGroup', filters.statusGroup);
  if (filters?.tuitionStatus) params.append('tuitionStatus', filters.tuitionStatus);
  if (filters?.month !== undefined && filters.month !== null)
    params.append('month', String(filters.month));
  if (filters?.year !== undefined && filters.year !== null)
    params.append('year', String(filters.year));
  if (filters?.startDate) params.append('startDate', String(filters.startDate));
  if (filters?.endDate) params.append('endDate', String(filters.endDate));
  if (filters?.sortBy) params.append('sortBy', filters.sortBy);
  if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

  const query = params.toString();
  return apiClient.get<ApiPaginatedResponse<Enrollment>>(`/enrollments${query ? `?${query}` : ''}`);
};

export const getEnrollmentByIdApi = async (id: string): Promise<ApiSuccessResponse<Enrollment>> => {
  return apiClient.get<ApiSuccessResponse<Enrollment>>(`/enrollments/${id}`);
};

export const createEnrollmentApi = async (
  payload: CreateEnrollmentPayload,
): Promise<ApiSuccessResponse<Enrollment>> => {
  return apiClient.post<ApiSuccessResponse<Enrollment>>('/enrollments', payload);
};

export const updateEnrollmentApi = async (
  id: string,
  payload: UpdateEnrollmentPayload,
): Promise<ApiSuccessResponse<Enrollment>> => {
  return apiClient.patch<ApiSuccessResponse<Enrollment>>(`/enrollments/${id}`, payload);
};

export const deleteEnrollmentApi = async (id: string): Promise<ApiSuccessResponse<null>> => {
  return apiClient.delete<ApiSuccessResponse<null>>(`/enrollments/${id}`);
};
