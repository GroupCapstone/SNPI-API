import { Types } from 'mongoose';

import { checkBranchAccess } from '../middleware/branch-access';
import { ForbiddenError } from '../shared/errors/app-error';
import type { AuthUser, PermissionScope } from '../types/auth';

export interface ScopedFilterOptions {
  branchField?: string;
  classField?: string;
  departmentField?: string;
  ownerField?: string;
  targetBranchId?: string | null;
  targetClassId?: string | null;
  targetDepartmentId?: string | null;
  scope?: PermissionScope | null;
  strictObjectId?: boolean;
}

const toObjectId = (id: string | Types.ObjectId, strict: boolean): Types.ObjectId | string => {
  if (typeof id !== 'string') return id;
  if (strict && Types.ObjectId.isValid(id) && id.length === 24) {
    return new Types.ObjectId(id);
  }
  return id;
};

/**
 * Builds a secure, injection-safe MongoDB query filter incorporating multi-tenant
 * boundaries (schoolId, branchAccess, assignedClasses) based on Contextual ABAC rules.
 */
export function buildTenantScopeFilter(
  user: AuthUser,
  options: ScopedFilterOptions = {},
): Record<string, unknown> {
  const {
    branchField = 'branchId',
    classField = 'classId',
    departmentField = 'departmentId',
    ownerField = 'userId',
    targetBranchId,
    targetClassId,
    targetDepartmentId,
    scope,
    strictObjectId = true,
  } = options;

  const query: Record<string, unknown> = {};

  // 1. Mandatory School Isolation (Tenant boundary)
  if (user.schoolId) {
    query.schoolId = toObjectId(user.schoolId, strictObjectId);
  }

  const isSuperAdmin = user.isSuperAdmin || user.permissions.includes('*');

  // 2. Branch Scoping (Contextual ABAC)
  if (isSuperAdmin || user.branchAccess === 'all') {
    if (targetBranchId && targetBranchId !== 'all') {
      query[branchField] = toObjectId(targetBranchId, strictObjectId);
    }
  } else if (Array.isArray(user.branchAccess) && user.branchAccess.length > 0) {
    if (targetBranchId && targetBranchId !== 'all') {
      if (!checkBranchAccess(user.branchAccess, targetBranchId)) {
        throw new ForbiddenError(`You do not have permission to access branch: ${targetBranchId}`);
      }
      query[branchField] = toObjectId(targetBranchId, strictObjectId);
    } else {
      query[branchField] = {
        $in: user.branchAccess.map((b) => toObjectId(b, strictObjectId)),
      };
    }
  } else if (user.defaultBranch) {
    query[branchField] = toObjectId(user.defaultBranch, strictObjectId);
  }

  // 3. Class Scoping (Assigned Class ABAC)
  const isClassScoped = scope === 'assigned_class';
  if (
    !isSuperAdmin &&
    (isClassScoped || (user.assignedClasses && user.assignedClasses.length > 0 && !scope))
  ) {
    const assigned = user.assignedClasses ?? [];
    if (assigned.length > 0) {
      if (targetClassId) {
        if (!assigned.includes(targetClassId)) {
          throw new ForbiddenError(`You do not have permission to access class: ${targetClassId}`);
        }
        query[classField] = toObjectId(targetClassId, strictObjectId);
      } else {
        query[classField] = {
          $in: assigned.map((c) => toObjectId(c, strictObjectId)),
        };
      }
    }
  } else if (targetClassId) {
    query[classField] = toObjectId(targetClassId, strictObjectId);
  }

  // 4. Department Scoping (Department ABAC)
  if (!isSuperAdmin && user.departmentAccess && user.departmentAccess !== 'all') {
    const allowedDepts = Array.isArray(user.departmentAccess) ? user.departmentAccess : [];
    if (allowedDepts.length > 0) {
      if (targetDepartmentId) {
        if (!allowedDepts.includes(targetDepartmentId)) {
          throw new ForbiddenError(
            `You do not have permission to access department: ${targetDepartmentId}`,
          );
        }
        query[departmentField] = toObjectId(targetDepartmentId, strictObjectId);
      } else {
        query[departmentField] = {
          $in: allowedDepts.map((d) => toObjectId(d, strictObjectId)),
        };
      }
    }
  } else if (targetDepartmentId) {
    query[departmentField] = toObjectId(targetDepartmentId, strictObjectId);
  }

  // 5. Own Record Scoping (Personal Data ABAC)
  if (scope === 'own_record' && !isSuperAdmin) {
    query[ownerField] = toObjectId(user.userId, strictObjectId);
  }

  return query;
}

/**
 * Validates an already retrieved resource against the user's tenant attributes
 * to prevent Broken Object Level Authorization (BOLA / IDOR).
 */
export function assertTenantAccess(
  user: AuthUser,
  resource: {
    schoolId?: string | Types.ObjectId;
    branchId?: string | Types.ObjectId;
    classId?: string | Types.ObjectId;
    departmentId?: string | Types.ObjectId;
    ownerId?: string | Types.ObjectId;
    userId?: string | Types.ObjectId;
  },
  options: {
    scope?: PermissionScope | null;
    ownerField?: 'ownerId' | 'userId';
  } = {},
): void {
  if (user.isSuperAdmin || user.permissions.includes('*')) {
    return;
  }

  // 1. School Tenant Check
  if (resource.schoolId && String(resource.schoolId) !== String(user.schoolId)) {
    throw new ForbiddenError('Cross-school data access denied');
  }

  // 2. Branch Access Check
  if (resource.branchId && user.branchAccess !== 'all') {
    const branchStr = String(resource.branchId);
    if (!checkBranchAccess(user.branchAccess, branchStr)) {
      throw new ForbiddenError('Cross-branch data access denied');
    }
  }

  // 3. Class Scope Check
  if (
    options.scope === 'assigned_class' &&
    resource.classId &&
    user.assignedClasses &&
    !user.assignedClasses.includes(String(resource.classId))
  ) {
    throw new ForbiddenError('Cross-class data access denied: You are not assigned to this class');
  }

  // 4. Own Record Scope Check
  if (options.scope === 'own_record') {
    const recordOwner = resource.ownerId ?? resource.userId;
    if (recordOwner && String(recordOwner) !== String(user.userId)) {
      throw new ForbiddenError('Access denied: You can only access your own records');
    }
  }
}
