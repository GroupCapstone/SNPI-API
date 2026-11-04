import type { NextFunction, Response } from 'express';

import { sendPaginated, sendSuccess } from '../../shared/http/api-response';
import type { AuthenticatedRequest } from '../../types/auth';
import { TimeSlotService } from './time-slot.service';
import {
  createTimeSlotSchema,
  queryTimeSlotSchema,
  updateTimeSlotSchema,
} from './time-slot.validation';

export class TimeSlotController {
  public constructor(private readonly service = new TimeSlotService()) {}

  public getTimeSlots = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const filters = queryTimeSlotSchema.parse(req.query);
      const result = await this.service.getTimeSlots(filters, req.user!);
      const page = filters.page ?? 1;
      const limit = filters.limit ?? 20;

      sendPaginated(
        res,
        result.data,
        {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit),
        },
        'Time slots retrieved successfully',
      );
    } catch (error) {
      next(error);
    }
  };

  public getTimeSlotById = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const timeSlot = await this.service.getTimeSlotById(id, req.user!);
      sendSuccess(res, timeSlot, 'Time slot retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public createTimeSlot = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = createTimeSlotSchema.parse(req.body);
      const timeSlot = await this.service.createTimeSlot(dto, req.user!);
      sendSuccess(res, timeSlot, 'Time slot created successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  public updateTimeSlot = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const dto = updateTimeSlotSchema.parse(req.body);
      const timeSlot = await this.service.updateTimeSlot(id, dto, req.user!);
      sendSuccess(res, timeSlot, 'Time slot updated successfully');
    } catch (error) {
      next(error);
    }
  };

  public deleteTimeSlot = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      await this.service.deleteTimeSlot(id, req.user!);
      sendSuccess(res, null, 'Time slot deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}
