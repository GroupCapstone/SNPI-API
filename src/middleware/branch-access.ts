import type { NextFunction, Response } from 'express';

import { ForbiddenError, UnauthorizedError } from '../shared/errors/app-error';
import type { AuthenticatedRequest } from '../types/auth';

const isReservedBranchContext = (value?: string): boolean => {
  if (!value) return false;
  const normalized = String(value).trim().toLowerCase();
  return normalized === 'all' || normalized === 'all_branches' || normalized === 'all-branches';
};

export const checkBranchAccess = (
  userBranchAccess: 'all' | string[] | undefined,
  targetBranchId?: string,
): boolean => {
  if (!userBranchAccess) return false;
  if (!targetBranchId) return true;
  if (isReservedBranchContext(targetBranchId)) return false;
  if (userBranchAccess === 'all') return true;
  return userBranchAccess.includes(targetBranchId);
};

export const requireBranchAccess = (
  targetBranchIdExtractor?: (req: AuthenticatedRequest) => string | undefined,
) => {
  return (request: AuthenticatedRequest, _response: Response, next: NextFunction): void => {
    if (!request.user) {
      next(new UnauthorizedError('Authentication required'));
      return;
    }

    const rawBranchId = targetBranchIdExtractor
      ? targetBranchIdExtractor(request)
      : (request.params.branchId ??
        (request.body as { branchId?: string })?.branchId ??
        (request.query as { branchId?: string })?.branchId ??
        request.headers['x-branch-id']);

    const branchId = Array.isArray(rawBranchId)
      ? rawBranchId[0]
      : rawBranchId
        ? String(rawBranchId)
        : undefined;

    if (branchId && isReservedBranchContext(branchId)) {
      next(
        new ForbiddenError(
          'All Branches is a reporting context and cannot be used as a real branch',
        ),
      );
      return;
    }

    if (branchId && !checkBranchAccess(request.user.branchAccess, branchId)) {
      next(new ForbiddenError('You do not have access to this branch'));
      return;
    }

    next();
  };
};

export const getAuthorizedBranchFilter = (
  userBranchAccess: 'all' | string[] | undefined,
  requestedBranchId?: string,
) => {
  if (requestedBranchId) {
    if (isReservedBranchContext(requestedBranchId)) {
      throw new ForbiddenError(
        'All Branches is a reporting context and cannot be used as a real branch',
      );
    }
    if (!checkBranchAccess(userBranchAccess, requestedBranchId)) {
      throw new ForbiddenError('You do not have access to the requested branch');
    }
    return { branchId: requestedBranchId };
  }

  if (userBranchAccess === 'all') {
    return {};
  }

  return { branchId: { $in: userBranchAccess ?? [] } };
};
