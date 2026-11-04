import { logger } from '../../config/logger';
import { getAuthorizedBranchFilter } from '../../middleware/branch-access';
import type { AuthUser } from '../../types/auth';
import { getChangedFields, redactSensitiveData } from '../../utils/redact';
import type { ClientSession } from 'mongoose';
import type { AuditAction, IAuditLog } from './audit-log.model';
import { AuditLogModel } from './audit-log.model';
import { AuditLogRepository } from './audit-log.repository';
import type { AuditLogFilters } from './audit-log.types';

export interface CreateAuditLogParams {
  userId?: string;
  schoolId?: string;
  branchId?: string;
  module: string;
  action: AuditAction;
  entityType: string;
  entityId: string;
  oldValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
  changedFields?: string[];
  reason?: string;
  ipAddress?: string;
  userAgent?: string;
  session?: ClientSession;
  required?: boolean;
}

export class AuditLogService {
  private static readonly repository = new AuditLogRepository();

  public static async log(params: CreateAuditLogParams): Promise<IAuditLog | null> {
    if (process.env.NODE_ENV === 'test') {
      return null;
    }

    const { session, required = false, oldValue, newValue, ...context } = params;
    const safeOldValue = oldValue
      ? (redactSensitiveData(oldValue) as Record<string, unknown>)
      : undefined;
    const safeNewValue = newValue
      ? (redactSensitiveData(newValue) as Record<string, unknown>)
      : undefined;
    const changedFields = params.changedFields ?? getChangedFields(safeOldValue, safeNewValue);

    try {
      const [entry] = await AuditLogModel.create(
        [
          {
            ...context,
            oldValue: safeOldValue,
            newValue: safeNewValue,
            changedFields: changedFields.length > 0 ? changedFields : undefined,
            timestamp: new Date(),
          },
        ],
        session ? { session } : {},
      );
      return entry ?? null;
    } catch (error) {
      logger.error(
        { error, auditContext: redactSensitiveData(context) },
        'Failed to record audit log',
      );
      if (required) throw error;
      return null;
    }
  }

  public async getAuditLogs(
    filters: AuditLogFilters,
    user: AuthUser,
  ): Promise<{ data: IAuditLog[]; total: number }> {
    const branchFilter = getAuthorizedBranchFilter(user.branchAccess, filters.branchId);
    return AuditLogService.repository.findWithFilters(filters, branchFilter);
  }
}
