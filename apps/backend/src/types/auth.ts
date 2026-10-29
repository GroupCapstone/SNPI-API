import type { Request } from 'express';

export type PermissionScope =
  | 'own_record'
  | 'assigned_class'
  | 'assigned_subject'
  | 'own_department'
  | 'selected_departments'
  | 'own_branch'
  | 'selected_branches'
  | 'all_branches';

export type PermissionAction =
  | 'view'
  | 'create'
  | 'edit'
  | 'delete'
  | 'approve'
  | 'submit'
  | 'review'
  | 'finalize'
  | 'export'
  | 'print'
  | 'void'
  | 'manage'
  | 'verify';

export interface AuthUser {
  userId: string;
  username: string;
  email: string;
  schoolId: string;
  employeeId?: string;
  departmentId?: string;
  roles: string[];
  permissions: string[];
  branchAccess: 'all' | string[];
  departmentAccess?: 'all' | string[];
  assignedClasses?: string[];
  assignedSubjects?: string[];
  defaultBranch?: string | null;
  isSuperAdmin?: boolean;
  directPermissions?: string[];
  mustChangePassword?: boolean;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

export type PermissionCode = string;
