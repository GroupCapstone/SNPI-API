import type { z } from 'zod';
import type { NextFunction, Response } from 'express';

import { getValidatedInput } from '../../middleware/validate';
import { sendPaginated } from '../../shared/http/api-response';
import type { AuthenticatedRequest } from '../../types/auth';
import { AuditLogService } from './audit-log.service';
import type { AuditLogFilters } from './audit-log.types';

import type { queryAuditLogSchema } from './audit-log.validation';

export class AuditLogController {
  public constructor(private readonly service = new AuditLogService()) {}

  public getAuditLogs = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const filters = getValidatedInput<z.infer<typeof queryAuditLogSchema>>(response)
        .query as unknown as AuditLogFilters;
      const page = Number(filters.page ?? 1);
      const limit = Number(filters.limit ?? 20);

      const result = await this.service.getAuditLogs(filters, request.user!);

      sendPaginated(
        response,
        result.data,
        {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit),
        },
        'Audit logs retrieved successfully',
      );
    } catch (error) {
      next(error);
    }
  };
}
