import type { z } from 'zod';
import type { NextFunction, Response } from 'express';

import { getValidatedInput } from '../../middleware/validate';
import { sendPaginated, sendSuccess } from '../../shared/http/api-response';
import type { AuthenticatedRequest } from '../../types/auth';
import { PaymentService } from './payment.service';
import type {
  CreatePaymentDto,
  PaymentQueryFilters,
  UpdatePaymentDto,
  VoidPaymentDto,
  GenerateMonthlyInvoicesDto,
} from './payment.types';

import type {
  queryPaymentSchema,
  createPaymentSchema,
  updatePaymentSchema,
  voidPaymentSchema,
  generateMonthlyInvoicesSchema,
  monthlyFinanceSummarySchema,
  debtAgingQuerySchema,
} from './payment.validation';

export class PaymentController {
  public constructor(private readonly service = new PaymentService()) {}

  public getPayments = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const filters = getValidatedInput<z.infer<typeof queryPaymentSchema>>(response)
        .query as unknown as PaymentQueryFilters;
      const page = Number(filters.page ?? 1);
      const limit = Number(filters.limit ?? 20);

      const result = await this.service.getPayments(filters, request.user!);

      sendPaginated(
        response,
        result.data,
        {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit),
        },
        'Payments and receipts retrieved successfully',
      );
    } catch (error) {
      next(error);
    }
  };

  public getMonthlySummary = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const query = getValidatedInput<z.infer<typeof monthlyFinanceSummarySchema>>(response)
        .query as { branchId?: string; year: number; month: number };

      const year = Number(query.year || new Date().getFullYear());
      const month = Number(query.month || new Date().getMonth() + 1);
      const branchId = query.branchId;

      const summary = await this.service.getMonthlySummary(year, month, branchId, request.user!);
      sendSuccess(response, summary, 'Monthly financial summary retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public getDebtAging = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const query = getValidatedInput<z.infer<typeof debtAgingQuerySchema>>(response).query as {
        branchId?: string;
        asOfDate?: string;
      };

      const report = await this.service.getDebtAging(query.branchId, query.asOfDate, request.user!);
      sendSuccess(response, report, 'Debt aging report retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public getPaymentById = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(request.params.id);
      const payment = await this.service.getPaymentById(id, request.user!);
      sendSuccess(response, payment, 'Payment record retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public generateMonthlyInvoices = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = getValidatedInput<z.infer<typeof generateMonthlyInvoicesSchema>>(response)
        .body as GenerateMonthlyInvoicesDto;
      const result = await this.service.generateMonthlyInvoices(dto, request.user!);
      sendSuccess(response, result, 'Monthly invoices generated successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  public createPayment = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = getValidatedInput<z.infer<typeof createPaymentSchema>>(response)
        .body as CreatePaymentDto;
      const payment = await this.service.createPayment(dto, request.user!);
      sendSuccess(response, payment, 'Payment recorded and receipt issued successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  public updatePayment = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(request.params.id);
      const dto = getValidatedInput<z.infer<typeof updatePaymentSchema>>(response)
        .body as UpdatePaymentDto;
      const payment = await this.service.updatePayment(id, dto, request.user!);
      sendSuccess(response, payment, 'Payment updated successfully');
    } catch (error) {
      next(error);
    }
  };

  public deletePayment = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(request.params.id);
      await this.service.deletePayment(id, request.user!);
      sendSuccess(response, null, 'Payment voided successfully');
    } catch (error) {
      next(error);
    }
  };

  public voidPayment = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const payment = await this.service.voidPayment(
        String(request.params.id),
        (getValidatedInput<z.infer<typeof voidPaymentSchema>>(response).body as VoidPaymentDto)
          .reason,
        request.user!,
      );
      sendSuccess(response, payment, 'Payment voided with audit history successfully');
    } catch (error) {
      next(error);
    }
  };
}
