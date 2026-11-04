import type { NextFunction, Response } from 'express';

import { ForbiddenError, UnauthorizedError } from '../shared/errors/app-error';
import type { AuthenticatedRequest, PermissionCode } from '../types/auth';

const IMPLIED_SCOPES: Record<string, ReadonlySet<string>> = {
  all_branches: new Set([
    'all_branches',
    'selected_branches',
    'own_branch',
    'selected_departments',
    'own_department',
    'assigned_class',
    'assigned_subject',
    'own_record',
  ]),
  selected_branches: new Set([
    'selected_branches',
    'own_branch',
    'own_department',
    'assigned_class',
    'assigned_subject',
    'own_record',
  ]),
  own_branch: new Set([
    'own_branch',
    'own_department',
    'assigned_class',
    'assigned_subject',
    'own_record',
  ]),
  selected_departments: new Set(['selected_departments', 'own_department', 'own_record']),
  own_department: new Set(['own_department', 'own_record']),
  assigned_class: new Set(['assigned_class', 'own_record']),
  assigned_subject: new Set(['assigned_subject', 'own_record']),
  own_record: new Set(['own_record']),
};

/**
 * Evaluates whether a user's permissions satisfy a required permission using
 * exact matching, action inheritance (manage -> view/create/edit/delete),
 * and an explicit scope implication matrix. Resource scopes are deliberately
 * not ranked: assigned_class must never imply assigned_subject (or vice versa).
 */
export function checkUserPermission(
  userPermissions: string[],
  requiredPermission: string,
  _userRoles: string[] = [],
): boolean {
  if (userPermissions.includes('*')) {
    return true;
  }

  const normalizedRequired = requiredPermission.replace(/:/g, '.').trim();

  // 1. Direct match
  if (userPermissions.includes(normalizedRequired)) {
    return true;
  }

  const requiredParts = normalizedRequired.split('.');
  if (requiredParts.length < 3) {
    return false;
  }

  const reqModule = requiredParts[0] ?? '';
  const reqAction = requiredParts.slice(1, -1).join('.');
  const reqScope = requiredParts.at(-1) ?? '';

  for (const rawPerm of userPermissions) {
    const perm = rawPerm.replace(/:/g, '.').trim();

    if (perm === normalizedRequired || perm === '*') {
      return true;
    }

    const permParts = perm.split('.');
    if (permParts.length < 3) {
      continue;
    }

    const userModule = permParts[0] ?? '';
    const userAction = permParts.slice(1, -1).join('.');
    const userScope = permParts.at(-1) ?? '';

    if (userModule !== reqModule && userModule !== '*') {
      continue;
    }

    // Action matching (exact, or 'manage', or '*')
    const actionMatches =
      userAction === reqAction ||
      userAction === 'manage' ||
      userAction === '*' ||
      (reqAction === 'view' && userAction === 'edit');

    if (!actionMatches) {
      continue;
    }

    if (IMPLIED_SCOPES[userScope]?.has(reqScope)) {
      return true;
    }
  }

  return false;
}

export const authorize = (...requiredPermissions: PermissionCode[]) => {
  return (request: AuthenticatedRequest, _response: Response, next: NextFunction): void => {
    if (!request.user) {
      next(new UnauthorizedError('Authentication required'));
      return;
    }

    const hasPermission = requiredPermissions.some((perm) =>
      checkUserPermission(request.user?.permissions ?? [], perm, request.user?.roles ?? []),
    );

    if (!hasPermission) {
      next(new ForbiddenError(`Missing required permission: ${requiredPermissions.join(' or ')}`));
      return;
    }

    next();
  };
};

export const requirePermission = authorize;
