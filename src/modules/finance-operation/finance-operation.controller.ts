import type { NextFunction, Response } from 'express';

import { getValidatedInput } from '../../middleware/validate';
import { sendPaginated, sendSuccess } from '../../shared/http/api-response';
import type { AuthenticatedRequest } from '../../types/auth';
import { FinanceOperationService } from './finance-operation.service';
import type {
  CloseCashierShiftDto,
  CreateDiscountPolicyDto,
  FinanceOperationFilters,
  OpenCashierShiftDto,
} from './finance-operation.types';

export class FinanceOperationController {
  public constructor(private readonly service = new FinanceOperationService()) {}
  private paginated(
    res: Response,
    result: { data: unknown[]; total: number; page: number; limit: number },
  ) {
    return sendPaginated(res, result.data, {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: Math.ceil(result.total / result.limit) || 1,
    });
  }
  public policies = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      this.paginated(
        res,
        await this.service.listPolicies(
          getValidatedInput<{ query: FinanceOperationFilters }>(res).query,
          req.user!,
        ),
      );
    } catch (error) {
      next(error);
    }
  };
  public createPolicy = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      sendSuccess(
        res,
        await this.service.createPolicy(
          getValidatedInput<{ body: CreateDiscountPolicyDto }>(res).body,
          req.user!,
        ),
        'Discount policy created successfully',
        201,
      );
    } catch (error) {
      next(error);
    }
  };
  public shifts = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      this.paginated(
        res,
        await this.service.listShifts(
          getValidatedInput<{ query: FinanceOperationFilters }>(res).query,
          req.user!,
        ),
      );
    } catch (error) {
      next(error);
    }
  };
  public openShift = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      sendSuccess(
        res,
        await this.service.openShift(
          getValidatedInput<{ body: OpenCashierShiftDto }>(res).body,
          req.user!,
        ),
        'Cashier shift opened',
        201,
      );
    } catch (error) {
      next(error);
    }
  };
  public closeShift = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      sendSuccess(
        res,
        await this.service.closeShift(
          String(req.params.id),
          getValidatedInput<{ body: CloseCashierShiftDto }>(res).body,
          req.user!,
        ),
        'Cashier shift submitted for approval',
      );
    } catch (error) {
      next(error);
    }
  };
  public approveShift = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      sendSuccess(
        res,
        await this.service.approveShift(String(req.params.id), req.user!),
        'Cashier shift approved',
      );
    } catch (error) {
      next(error);
    }
  };
}
