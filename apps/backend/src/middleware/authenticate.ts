import type { NextFunction, Response } from 'express';

import { env } from '../config/env';
import { ALL_PERMISSION_CODES } from '../constants/permissions';
import { AuthService } from '../modules/auth/auth.service';
import { UserModel } from '../modules/user/user.model';
import { ForbiddenError, UnauthorizedError } from '../shared/errors/app-error';
import type { AuthenticatedRequest } from '../types/auth';
import { TokenUtil } from '../utils/token';
import { checkBranchAccess } from './branch-access';

const authService = new AuthService();

const requestScopeValue = (
  request: AuthenticatedRequest,
  key: 'schoolId' | 'branchId',
): string | undefined => {
  const body = request.body as Record<string, unknown> | undefined;
  const query = request.query as Record<string, unknown> | undefined;
  const raw = body?.[key] ?? query?.[key];
  if (raw === undefined || raw === null || raw === '' || raw === 'all') return undefined;
  return Array.isArray(raw) ? String(raw[0]) : String(raw);
};

const finishAuthentication = (request: AuthenticatedRequest, next: NextFunction): void => {
  const user = request.user;
  if (!user) {
    next();
    return;
  }

  const authPath = (request.path || '').replace(/\/$/, '').toLowerCase();
  const isPasswordRecoveryRoute =
    (request.baseUrl || '').toLowerCase() === '/api/v1/auth' &&
    ((['GET', 'HEAD'].includes(request.method) && authPath === '/me') ||
      (request.method === 'PATCH' && authPath === '/change-password') ||
      (request.method === 'POST' && authPath === '/logout'));
  if (user.mustChangePassword && !isPasswordRecoveryRoute) {
    next(new ForbiddenError('You must change your temporary password before accessing the system'));
    return;
  }

  for (const source of [request.body, request.query]) {
    for (const key of ['schoolId', 'branchId'] as const) {
      const raw = (source as Record<string, unknown> | undefined)?.[key];
      for (const value of Array.isArray(raw) ? raw : [raw]) {
        if (value === undefined || value === null || value === '' || value === 'all') continue;
        const allowed =
          key === 'schoolId'
            ? String(value) === user.schoolId
            : checkBranchAccess(user.branchAccess, String(value));
        if (!allowed) {
          next(
            new ForbiddenError(
              `You do not have access to the requested ${key === 'schoolId' ? 'school' : 'branch'}`,
            ),
          );
          return;
        }
      }
    }
  }

  next();
};

export const authenticate = async (
  request: AuthenticatedRequest,
  _response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = request.header('Authorization');
    let token: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7).trim();
    }

    if (token) {
      try {
        const payload = TokenUtil.verifyAccessToken(token);

        const user = await UserModel.findOne({
          _id: payload.userId,
          isDeleted: false,
        }).exec();

        if (
          user &&
          user.status === 'active' &&
          (payload.tokenVersion ?? 0) === (user.tokenVersion ?? 0)
        ) {
          const isLocked = user.lockedUntil && user.lockedUntil > new Date();

          if (!isLocked) {
            const authorization = await authService.buildAuthorizationContext(user);
            const employeeId =
              authorization.employeeId &&
              typeof authorization.employeeId === 'object' &&
              '_id' in authorization.employeeId
                ? String(authorization.employeeId._id)
                : authorization.employeeId
                  ? String(authorization.employeeId)
                  : undefined;

            request.user = {
              userId: user._id.toString(),
              username: user.username,
              email: user.email,
              schoolId: user.schoolId.toString(),
              employeeId,
              departmentId:
                authorization.departmentAccess === 'all'
                  ? undefined
                  : authorization.departmentAccess[0],
              roles: user.roles,
              permissions: authorization.permissions,
              branchAccess: authorization.branchAccess,
              departmentAccess: authorization.departmentAccess,
              assignedClasses: authorization.assignedClasses,
              assignedSubjects: authorization.assignedSubjects,
              defaultBranch: authorization.defaultBranch,
              isSuperAdmin: authorization.isSuperAdmin,
              directPermissions: user.directPermissions,
              mustChangePassword: Boolean(user.mustChangePassword),
            };
            finishAuthentication(request, next);
            return;
          }
        }
      } catch {
        // Invalid or expired token -> leave request.user undefined
      }
    }

    // Support test suites in test environment
    if (env.NODE_ENV === 'test') {
      const userIdHeader = request.header('X-User-Id');
      if (userIdHeader) {
        const permissionsHeader = request.header('X-User-Permissions');
        const branchAccessHeader = request.header('X-Branch-Access');
        const schoolIdHeader = request.header('X-School-Id');

        const permissions = permissionsHeader
          ? permissionsHeader.split(',').map((p) => p.trim())
          : [...ALL_PERMISSION_CODES];

        const branchAccess =
          branchAccessHeader === 'all'
            ? 'all'
            : branchAccessHeader
              ? branchAccessHeader.split(',').map((b) => b.trim())
              : 'all';

        request.user = {
          userId: userIdHeader,
          username: request.header('X-User-Name') ?? 'test_user',
          email: request.header('X-User-Email') ?? 'test@snp.edu.kh',
          schoolId:
            schoolIdHeader ?? requestScopeValue(request, 'schoolId') ?? '000000000000000000000001',
          employeeId: request.header('X-Employee-Id') ?? undefined,
          roles: request.header('X-User-Roles')?.split(',') ?? ['staff'],
          permissions,
          branchAccess,
          departmentAccess:
            request.header('X-Department-Access') === 'all'
              ? 'all'
              : (request.header('X-Department-Access')?.split(',').filter(Boolean) ?? []),
          assignedClasses: request.header('X-Assigned-Classes')?.split(',').filter(Boolean) ?? [],
          assignedSubjects: request.header('X-Assigned-Subjects')?.split(',').filter(Boolean) ?? [],
          defaultBranch: branchAccess === 'all' ? null : (branchAccess[0] ?? null),
          isSuperAdmin: permissions.includes('*'),
        };
        finishAuthentication(request, next);
        return;
      }

      // If testing auth endpoints without credentials in test mode, leave unauthenticated
      if (
        request.header('X-No-Auth') === 'true' ||
        request.originalUrl?.includes('/auth/') ||
        request.baseUrl?.includes('/auth')
      ) {
        request.user = undefined;
        next();
        return;
      }

      // Default mock user for non-auth module unit tests in test environment only
      request.user = {
        userId: '000000000000000000000001',
        username: 'test_admin',
        email: 'test_admin@snp.edu.kh',
        schoolId:
          request.header('X-School-Id') ??
          requestScopeValue(request, 'schoolId') ??
          '000000000000000000000001',
        roles: ['super_admin'],
        permissions: ['*', ...ALL_PERMISSION_CODES],
        branchAccess: 'all',
        isSuperAdmin: true,
      };
      finishAuthentication(request, next);
      return;
    }

    request.user = undefined;
    next();
  } catch (error) {
    next(error);
  }
};

export const requireAuth = (
  request: AuthenticatedRequest,
  _response: Response,
  next: NextFunction,
): void => {
  if (!request.user) {
    next(new UnauthorizedError('Authentication required'));
    return;
  }
  next();
};
