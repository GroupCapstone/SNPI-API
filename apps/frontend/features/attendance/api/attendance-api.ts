import { apiClient } from '@/lib/api-client';
import type { ApiPaginatedResponse, ApiSuccessResponse } from '@/types/api';

import type {
  Attendance,
  AttendanceQueryFilters,
  ClassRosterAttendanceResponse,
  MarkAttendancePayload,
} from '../types';

export const getAttendanceListApi = async (
  filters?: AttendanceQueryFilters,
): Promise<ApiPaginatedResponse<Attendance>> => {
  const params = new URLSearchParams();
  if (filters?.page) params.append('page', String(filters.page));
  if (filters?.limit) params.append('limit', String(filters.limit));
  if (filters?.schoolId) params.append('schoolId', filters.schoolId);
  if (filters?.branchId && filters.branchId !== 'all') params.append('branchId', filters.branchId);
  if (filters?.academicYearId) params.append('academicYearId', filters.academicYearId);
  if (filters?.classId) params.append('classId', filters.classId);
  if (filters?.date) params.append('date', filters.date);
  if (filters?.startDate) params.append('startDate', filters.startDate);
  if (filters?.endDate) params.append('endDate', filters.endDate);

  const query = params.toString();
  return apiClient.get<ApiPaginatedResponse<Attendance>>(`/attendance${query ? `?${query}` : ''}`);
};

export const getClassRosterAttendanceApi = async (
  classId: string,
  date: string,
): Promise<ApiSuccessResponse<ClassRosterAttendanceResponse>> => {
  return apiClient.get<ApiSuccessResponse<ClassRosterAttendanceResponse>>(
    `/attendance/roster/${classId}?date=${date}`,
  );
};

export const markAttendanceApi = async (
  payload: MarkAttendancePayload,
): Promise<ApiSuccessResponse<Attendance>> => {
  return apiClient.post<ApiSuccessResponse<Attendance>>('/attendance', payload);
};
