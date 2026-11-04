import type { z } from 'zod';
import type { NextFunction, Response } from 'express';

import { getValidatedInput } from '../../middleware/validate';
import { sendSuccess } from '../../shared/http/api-response';
import type { AuthenticatedRequest } from '../../types/auth';
import { AcademicYearService } from './academic-year.service';
import type {
  AcademicYearQueryFilters,
  CreateAcademicYearDto,
  UpdateAcademicYearDto,
  AcademicYearTransitionDto,
} from './academic-year.types';

import type {
  queryAcademicYearSchema,
  createAcademicYearSchema,
  updateAcademicYearSchema,
  transitionAcademicYearSchema,
} from './academic-year.validation';

export class AcademicYearController {
  public constructor(private readonly service = new AcademicYearService()) {}

  public getAcademicYears = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const filters = getValidatedInput<z.infer<typeof queryAcademicYearSchema>>(response)
        .query as unknown as AcademicYearQueryFilters;
      const years = await this.service.getAcademicYears(filters, request.user!);
      sendSuccess(response, years, 'Academic years retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public getAcademicYearById = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = request.params.id as string;
      const year = await this.service.getAcademicYearById(id, request.user!);
      sendSuccess(response, year, 'Academic year retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public createAcademicYear = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = getValidatedInput<z.infer<typeof createAcademicYearSchema>>(response)
        .body as CreateAcademicYearDto;
      const user = request.user!;
      const created = await this.service.createAcademicYear(dto, user);
      sendSuccess(response, created, 'Academic year created successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  public updateAcademicYear = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = request.params.id as string;
      const dto = getValidatedInput<z.infer<typeof updateAcademicYearSchema>>(response)
        .body as UpdateAcademicYearDto;
      const user = request.user!;
      const updated = await this.service.updateAcademicYear(id, dto, user);
      sendSuccess(response, updated, 'Academic year updated successfully');
    } catch (error) {
      next(error);
    }
  };

  public deleteAcademicYear = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = request.params.id as string;
      const user = request.user!;
      await this.service.deleteAcademicYear(id, user);
      sendSuccess(response, null, 'Academic year deleted successfully');
    } catch (error) {
      next(error);
    }
  };

  public getClosingChecklist = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const checklist = await this.service.getClosingChecklist(
        String(request.params.id),
        request.user!,
      );
      sendSuccess(response, checklist, 'Academic year closing checklist retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public transitionAcademicYear = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const year = await this.service.transitionAcademicYear(
        String(request.params.id),
        getValidatedInput<z.infer<typeof transitionAcademicYearSchema>>(response)
          .body as AcademicYearTransitionDto,
        request.user!,
      );
      sendSuccess(response, year, 'Academic year lifecycle transitioned successfully');
    } catch (error) {
      next(error);
    }
  };
}
