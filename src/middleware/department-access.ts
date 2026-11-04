import type { NextFunction, Response } from 'express';

import { ForbiddenError, UnauthorizedError } from '../shared/errors/app-error';
import type { AuthenticatedRequest } from '../types/auth';

export const checkDepartmentAccess = (
  userDepartmentAccess: 'all' | string[] | undefined,
  targetDepartmentId?: string,
): boolean => {
  if (!userDepartmentAccess) return false;
  if (userDepartmentAccess === 'all') return true;
  if (!targetDepartmentId) return true;
  return userDepartmentAccess.includes(targetDepartmentId);
};

export const requireDepartmentAccess = (
  targetDeptIdExtractor?: (req: AuthenticatedRequest) => string | undefined,
) => {
  return (request: AuthenticatedRequest, _response: Response, next: NextFunction): void => {
    if (!request.user) {
      next(new UnauthorizedError('Authentication required'));
      return;
    }

    const rawDeptId = targetDeptIdExtractor
      ? targetDeptIdExtractor(request)
      : (request.params.departmentId ??
        (request.body as { departmentId?: string })?.departmentId ??
        (request.query as { departmentId?: string })?.departmentId);

    const deptId = Array.isArray(rawDeptId)
      ? rawDeptId[0]
      : rawDeptId
        ? String(rawDeptId)
        : undefined;

    if (deptId && !checkDepartmentAccess(request.user.departmentAccess, deptId)) {
      next(new ForbiddenError('You do not have access to this department'));
      return;
    }

    next();
  };
};

export const getAuthorizedDepartmentFilter = (
  userDepartmentAccess: 'all' | string[] | undefined,
  requestedDepartmentId?: string,
) => {
  if (requestedDepartmentId) {
    if (!checkDepartmentAccess(userDepartmentAccess, requestedDepartmentId)) {
      throw new ForbiddenError('You do not have access to the requested department');
    }
    return { departmentId: requestedDepartmentId };
  }

  if (userDepartmentAccess === 'all') {
    return {};
  }

  return { departmentId: { $in: userDepartmentAccess ?? [] } };
};
