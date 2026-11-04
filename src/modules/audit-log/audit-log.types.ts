import type { AuditAction } from './audit-log.model';

export interface AuditLogFilters {
  search?: string;
  module?: string;
  action?: AuditAction;
  entityType?: string;
  entityId?: string;
  userId?: string;
  schoolId?: string;
  branchId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}
