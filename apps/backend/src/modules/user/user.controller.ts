import type { z } from 'zod';
import type { NextFunction, Response } from 'express';

import { getValidatedInput } from '../../middleware/validate';
import { sendPaginated, sendSuccess } from '../../shared/http/api-response';
import type { AuthenticatedRequest } from '../../types/auth';
import { UserService } from './user.service';
import type {
  AdminResetPasswordDto,
  CreateUserDto,
  UpdateUserDto,
  UserQueryFilters,
} from './user.types';

const sanitizeUserResponse = (user: unknown): Record<string, unknown> => {
  const source =
    user && typeof user === 'object' && 'toObject' in user
      ? (user as { toObject: () => Record<string, unknown> }).toObject()
      : ({ ...(user as Record<string, unknown>) } as Record<string, unknown>);

  delete source.passwordHash;
  delete source.refreshTokenHash;
  delete source.previousRefreshTokenHash;
  delete source.tokenRotatedAt;
  return source;
};

import type {
  queryUserSchema,
  createUserSchema,
  updateUserSchema,
  adminResetPasswordSchema,
  updateUserStatusSchema,
} from './user.validation';

export class UserController {
  public constructor(private readonly service = new UserService()) {}

  public getUsers = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const filters = getValidatedInput<z.infer<typeof queryUserSchema>>(response)
        .query as unknown as UserQueryFilters;
      const page = Number(filters.page ?? 1);
      const limit = Number(filters.limit ?? 20);

      const result = await this.service.getUsers(filters, request.user!);

      sendPaginated(
        response,
        result.data,
        {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit),
        },
        'Users retrieved successfully',
      );
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = request.params.id as string;
      const user = await this.service.getUserById(id, request.user!);
      sendSuccess(response, user, 'User retrieved successfully', 200);
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = getValidatedInput<z.infer<typeof createUserSchema>>(response)
        .body as CreateUserDto;
      const user = request.user!;
      const created = await this.service.createUser(dto, user);
      sendSuccess(
        response,
        sanitizeUserResponse(created),
        'User account created successfully',
        201,
      );
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = request.params.id as string;
      const dto = getValidatedInput<z.infer<typeof updateUserSchema>>(response)
        .body as UpdateUserDto;
      const user = request.user!;
      const updated = await this.service.updateUser(id, dto, user);
      sendSuccess(
        response,
        sanitizeUserResponse(updated),
        'User account updated successfully',
        200,
      );
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = request.params.id as string;
      const user = request.user!;
      await this.service.deleteUser(id, user);
      sendSuccess(response, null, 'User account deleted successfully', 200);
    } catch (error) {
      next(error);
    }
  };

  public resetPassword = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = request.params.id as string;
      const dto = getValidatedInput<z.infer<typeof adminResetPasswordSchema>>(response)
        .body as AdminResetPasswordDto;
      const user = request.user!;
      const result = await this.service.resetUserPassword(id, dto, user);
      sendSuccess(response, result, result.message, 200);
    } catch (error) {
      next(error);
    }
  };

  public updateUserStatus = async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = request.params.id as string;
      const { status } = getValidatedInput<z.infer<typeof updateUserStatusSchema>>(response).body;
      const user = request.user!;
      const updated = await this.service.updateUserStatus(id, status, user);
      sendSuccess(
        response,
        sanitizeUserResponse(updated),
        `User account status updated to ${status}`,
        200,
      );
    } catch (error) {
      next(error);
    }
  };
}
