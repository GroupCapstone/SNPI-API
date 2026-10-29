import type { NextFunction, Response } from 'express';

import { sendPaginated, sendSuccess } from '../../shared/http/api-response';
import type { AuthenticatedRequest } from '../../types/auth';
import { AnnouncementService } from './announcement.service';
import type {
  AnnouncementQueryFilters,
  CreateAnnouncementDTO,
  UpdateAnnouncementDTO,
} from './announcement.types';

export class AnnouncementController {
  public constructor(private readonly service = new AnnouncementService()) {}

  public getAnnouncements = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const filters = req.query as unknown as AnnouncementQueryFilters;
      const result = await this.service.getAnnouncements(filters, req.user!);
      sendPaginated(
        res,
        result.data,
        {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages,
        },
        'Announcements retrieved successfully',
      );
    } catch (error) {
      next(error);
    }
  };

  public getAnnouncementById = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(req.params.id);
      const announcement = await this.service.getAnnouncementById(id, req.user!);
      sendSuccess(res, announcement, 'Announcement retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public createAnnouncement = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = req.body as CreateAnnouncementDTO;
      const announcement = await this.service.createAnnouncement(dto, req.user!);
      sendSuccess(res, announcement, 'Announcement created successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  public updateAnnouncement = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(req.params.id);
      const dto = req.body as UpdateAnnouncementDTO;
      const announcement = await this.service.updateAnnouncement(id, dto, req.user!);
      sendSuccess(res, announcement, 'Announcement updated successfully');
    } catch (error) {
      next(error);
    }
  };

  public deleteAnnouncement = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = String(req.params.id);
      await this.service.deleteAnnouncement(id, req.user!);
      sendSuccess(res, null, 'Announcement deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}
