import type { z } from 'zod';
import type { NextFunction, Response } from 'express';

import { getValidatedInput } from '../../middleware/validate';
import { sendPaginated, sendSuccess } from '../../shared/http/api-response';
import type { AuthenticatedRequest } from '../../types/auth';
import { RegistrationService } from './registration.service';
import type {
  CreateRegistrationDTO,
  RegistrationQueryFilters,
  UpdateRegistrationDTO,
} from './registration.types';

import type {
  registrationQueryValidationSchema,
  createRegistrationValidationSchema,
  updateRegistrationValidationSchema,
} from './registration.validation';

export class RegistrationController {
  public constructor(private readonly service = new RegistrationService()) {}

  public getRegistrations = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const filters = getValidatedInput<z.infer<typeof registrationQueryValidationSchema>>(response)
        .query as unknown as RegistrationQueryFilters;
      const page = Number(filters.page ?? 1);
      const limit = Number(filters.limit ?? 20);

      const result = await this.service.getRegistrations(filters, request.user!);

      sendPaginated(
        response,
        result.data,
        {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit) || 1,
        },
        'Registration applications retrieved successfully',
      );
    } catch (error) {
      next(error);
    }
  };

  public getRegistrationById = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = request.params.id as string;
      const registration = await this.service.getRegistrationById(id, request.user!);
      sendSuccess(response, registration, 'Registration details retrieved successfully', 200);
    } catch (error) {
      next(error);
    }
  };

  public createRegistration = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = getValidatedInput<z.infer<typeof createRegistrationValidationSchema>>(response)
        .body as CreateRegistrationDTO;
      const registration = await this.service.createRegistration(dto, request.user!);
      sendSuccess(response, registration, 'Registration application submitted successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  public updateRegistration = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = request.params.id as string;
      const dto = getValidatedInput<z.infer<typeof updateRegistrationValidationSchema>>(response)
        .body as UpdateRegistrationDTO;
      const registration = await this.service.updateRegistration(id, dto, request.user!);
      sendSuccess(response, registration, 'Registration application updated successfully', 200);
    } catch (error) {
      next(error);
    }
  };

  public deleteRegistration = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = request.params.id as string;
      await this.service.deleteRegistration(id, request.user!);
      sendSuccess(response, null, 'Registration application deleted successfully', 200);
    } catch (error) {
      next(error);
    }
  };
}
