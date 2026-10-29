export interface LoginDto {
  identifier: string;
  password: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface SanitizedUser {
  id: string;
  username: string;
  email: string;
  schoolId:
    | {
        _id: string;
        code: string;
        nameEn: string;
        nameKh?: string;
      }
    | string;
  employeeId?:
    | {
        _id: string;
        employeeId: string;
        firstName: string;
        lastName: string;
        khmerName?: string;
      }
    | string;
  roles: string[];
  permissions: string[];
  branchAccess: 'all' | string[];
  departmentAccess: 'all' | string[];
  assignedClasses: string[];
  assignedSubjects: string[];
  defaultBranch: string | null;
  isSuperAdmin: boolean;
  status: string;
  lastLoginAt?: Date;
  mustChangePassword: boolean;
}

export interface LoginResult {
  user: SanitizedUser;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshResult {
  accessToken: string;
  refreshToken: string;
  user: SanitizedUser;
}
