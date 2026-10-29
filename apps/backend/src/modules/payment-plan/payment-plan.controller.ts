import type { z } from 'zod';
import type { NextFunction, Response } from 'express';

import { getValidatedInput } from '../../middleware/validate';
import { sendPaginated, sendSuccess } from '../../shared/http/api-response';
import type { AuthenticatedRequest } from '../../types/auth';
import { PaymentPlanService } from './payment-plan.service';
import type { CreatePaymentPlanDto, PaymentPlanQueryFilters } from './payment-plan.types';
import type {
  cancelPaymentPlanSchema,
  createPaymentPlanSchema,
  queryPaymentPlanSchema,
  payInstallmentSchema,
} from './payment-plan.validation';

export class PaymentPlanController {
  public constructor(private readonly service = new PaymentPlanService()) {}

  public list = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
    try {
      const filters = getValidatedInput<z.infer<typeof queryPaymentPlanSchema>>(response)
        .query as unknown as PaymentPlanQueryFilters;
      const result = await this.service.list(filters, request.user!);
      sendPaginated(
        response,
        result.data,
        {
          page: Number(filters.page ?? 1),
          limit: Number(filters.limit ?? 20),
          total: result.total,
          totalPages: Math.ceil(result.total / Number(filters.limit ?? 20)),
        },
        'Payment plans retrieved successfully',
      );
    } catch (error) {
      next(error);
    }
  };

  public getById = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      sendSuccess(
        response,
        await this.service.getById(String(request.params.id), request.user!),
        'Payment plan retrieved successfully',
      );
    } catch (error) {
      next(error);
    }
  };

  public create = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
    try {
      const dto = getValidatedInput<z.infer<typeof createPaymentPlanSchema>>(response)
        .body as CreatePaymentPlanDto;
      sendSuccess(
        response,
        await this.service.create(dto, request.user!),
        'Payment plan created successfully',
        201,
      );
    } catch (error) {
      next(error);
    }
  };

  public cancel = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
    try {
      const input = getValidatedInput<z.infer<typeof cancelPaymentPlanSchema>>(response);
      sendSuccess(
        response,
        await this.service.cancel(String(request.params.id), input.body.reason, request.user!),
        'Payment plan cancelled successfully',
      );
    } catch (error) {
      next(error);
    }
  };

  public payInstallment = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const input = getValidatedInput<z.infer<typeof payInstallmentSchema>>(response);
      const result = await this.service.payInstallment(
        input.params.id,
        input.params.sequence,
        input.body,
        request.user!,
      );
      sendSuccess(response, result, 'Installment payment recorded', 201);
    } catch (error) {
      next(error);
    }
  };
}
