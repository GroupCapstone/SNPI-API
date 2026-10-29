import { apiClient } from '@/lib/api-client';
import type { ApiPaginatedResponse, ApiSuccessResponse } from '@/types/api';
import type {
  CreateRolloverPlanInput,
  ExecuteRolloverInput,
  RolloverExecutionResult,
  RolloverPlan,
  RolloverPlanFilters,
  RolloverValidationSummary,
  TargetPeriodReadiness,
  UpdateRolloverPlanInput,
} from '../types';

export const getRolloverPlans = async (filters: RolloverPlanFilters = {}) => {
  const params = new URLSearchParams();
  if (filters.branchId && filters.branchId !== 'all') params.append('branchId', filters.branchId);
  if (filters.sourcePeriodId) params.append('sourcePeriodId', filters.sourcePeriodId);
  if (filters.targetPeriodId) params.append('targetPeriodId', filters.targetPeriodId);
  if (filters.status) params.append('status', filters.status);
  if (filters.page) params.append('page', String(filters.page));
  if (filters.limit) params.append('limit', String(filters.limit));

  const queryString = params.toString();
  const url = `/rollovers${queryString ? `?${queryString}` : ''}`;
  return apiClient.get<ApiPaginatedResponse<RolloverPlan>>(url);
};

export const getRolloverPlanById = async (id: string) => {
  return apiClient.get<ApiSuccessResponse<RolloverPlan>>(`/rollovers/${id}`);
};

export const createRolloverPlan = async (data: CreateRolloverPlanInput) => {
  return apiClient.post<ApiSuccessResponse<RolloverPlan>>('/rollovers', data);
};

export const updateRolloverPlan = async (id: string, data: UpdateRolloverPlanInput) => {
  return apiClient.patch<ApiSuccessResponse<RolloverPlan>>(`/rollovers/${id}`, data);
};

export const validateRolloverPlan = async (id: string) => {
  return apiClient.post<ApiSuccessResponse<RolloverValidationSummary>>(
    `/rollovers/${id}/validate`,
    {},
  );
};

export const approveRolloverPlan = async (id: string) => {
  return apiClient.post<ApiSuccessResponse<RolloverPlan>>(`/rollovers/${id}/approve`, {});
};

export const executeRolloverPlan = async (id: string, data: ExecuteRolloverInput = {}) => {
  return apiClient.post<
    ApiSuccessResponse<RolloverPlan> & { executionResult: RolloverExecutionResult }
  >(`/rollovers/${id}/execute`, data);
};

export const getTargetPeriodReadiness = async (targetPeriodId: string) => {
  return apiClient.get<ApiSuccessResponse<TargetPeriodReadiness>>(
    `/rollovers/target-readiness/${targetPeriodId}`,
  );
};

export const approveTargetPeriodReadiness = async (targetPeriodId: string) => {
  return apiClient.post<ApiSuccessResponse<TargetPeriodReadiness>>(
    `/rollovers/target-readiness/${targetPeriodId}/approve`,
    {},
  );
};

export const openTargetPeriod = async (targetPeriodId: string) => {
  return apiClient.post<ApiSuccessResponse<unknown>>(
    `/rollovers/target-readiness/${targetPeriodId}/open`,
    {},
  );
};
