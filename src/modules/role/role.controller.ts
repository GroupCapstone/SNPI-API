import type { z } from 'zod';
import type { NextFunction, Request, Response } from 'express';

import { getValidatedInput } from '../../middleware/validate';
import type { AuthenticatedRequest } from '../../types/auth';
import { RoleService } from './role.service';

import type { queryRoleSchema, updateRoleSchema } from './role.validation';

export class RoleController {
  public constructor(private readonly service = new RoleService()) {}

  public getRoles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = getValidatedInput<z.infer<typeof queryRoleSchema>>(res).query;
      const { data, total } = await this.service.getRoles(filters);
      const page = Number(filters.page ?? 1);
      const limit = Number(filters.limit ?? 50);

      res.status(200).json({
        success: true,
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit) || 1,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public getRoleById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const role = await this.service.getRoleById(String(req.params.id));
      res.status(200).json({
        success: true,
        data: role,
      });
    } catch (error) {
      next(error);
    }
  };

  public createRole = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const role = await this.service.createRole(
        getValidatedInput<{ body: Parameters<RoleService['createRole']>[0] }>(res).body,
        req.user!,
      );
      res.status(201).json({
        success: true,
        message: 'Role created successfully',
        data: role,
      });
    } catch (error) {
      next(error);
    }
  };

  public updateRole = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const role = await this.service.updateRole(
        String(req.params.id),
        getValidatedInput<z.infer<typeof updateRoleSchema>>(res).body,
        req.user!,
      );
      res.status(200).json({
        success: true,
        message: 'Role updated successfully',
        data: role,
      });
    } catch (error) {
      next(error);
    }
  };

  public deleteRole = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      await this.service.deleteRole(String(req.params.id), req.user!);
      res.status(200).json({
        success: true,
        message: 'Role deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}
