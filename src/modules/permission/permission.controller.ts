import type { NextFunction, Request, Response } from 'express';

import { PermissionService } from './permission.service';

export class PermissionController {
  public constructor(private readonly service = new PermissionService()) {}

  public getPermissions = (_req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = this.service.getAllPermissions();
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  public getGroupedPermissions = (_req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = this.service.getGroupedPermissions();
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };
}
