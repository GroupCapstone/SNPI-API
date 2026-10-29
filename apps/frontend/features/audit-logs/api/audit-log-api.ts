import { apiClient } from '@/lib/api-client';
import type { ApiPaginatedResponse } from '@/types/api';
import type { AuditLog, AuditLogFilters } from '../types';

export const getAuditLogs = async (filters: AuditLogFilters = {}) => {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.module) params.append('module', filters.module);
  if (filters.action) params.append('action', filters.action);
  if (filters.entityType) params.append('entityType', filters.entityType);
  if (filters.entityId) params.append('entityId', filters.entityId);
  if (filters.userId) params.append('userId', filters.userId);
  if (filters.schoolId) params.append('schoolId', filters.schoolId);
  if (filters.branchId && filters.branchId !== 'all') params.append('branchId', filters.branchId);
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  if (filters.page) params.append('page', String(filters.page));
  if (filters.limit) params.append('limit', String(filters.limit));

  const queryString = params.toString();
  const url = `/audit-logs${queryString ? `?${queryString}` : ''}`;
  return apiClient.get<ApiPaginatedResponse<AuditLog>>(url);
};

export const getEntityAuditHistory = async (entityType: string, entityId: string, limit = 50) => {
  return getAuditLogs({
    entityType,
    entityId,
    limit,
    page: 1,
  });
};
