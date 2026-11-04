import { Types } from 'mongoose';

import { ALL_PERMISSION_CODES } from '../../constants/permissions';
import { ForbiddenError, NotFoundError, UnauthorizedError } from '../../shared/errors/app-error';
import { PasswordUtil } from '../../utils/password';
import { TokenUtil } from '../../utils/token';
import { AuditLogService } from '../audit-log/audit-log.service';
import { EmployeeModel } from '../employee/employee.model';
import { RoleService } from '../role/role.service';
import { TeacherAssignmentModel } from '../teacher-assignment/teacher-assignment.model';
import type { IUser } from '../user/user.model';
import { UserRepository } from '../user/user.repository';
import type {
  ChangePasswordDto,
  LoginDto,
  LoginResult,
  RefreshResult,
  SanitizedUser,
} from './auth.types';

export class AuthService {
  public constructor(
    private readonly userRepository = new UserRepository(),
    private readonly roleService = new RoleService(),
  ) {}

  public async buildAuthorizationContext(user: IUser): Promise<SanitizedUser> {
    const schoolId = String(
      typeof user.schoolId === 'object' && '_id' in user.schoolId
        ? user.schoolId._id
        : user.schoolId,
    );
    const rolePermissions = await this.roleService.resolvePermissionsForRoles(user.roles);
    const knownPermissions = new Set(ALL_PERMISSION_CODES);
    const directPermissions = (user.directPermissions ?? []).filter((permission) =>
      knownPermissions.has(permission),
    );
    const permissions = [...new Set([...rolePermissions, ...directPermissions])];
    const isSuperAdmin = user.roles.includes('super_admin') && permissions.includes('*');
    const employeeId =
      user.employeeId && typeof user.employeeId === 'object' && '_id' in user.employeeId
        ? String(user.employeeId._id)
        : user.employeeId
          ? String(user.employeeId)
          : undefined;

    let employeeBranchId: string | undefined;
    let employeeDepartmentId: string | undefined;
    if (employeeId && Types.ObjectId.isValid(employeeId)) {
      const employee = await EmployeeModel.findOne({ _id: employeeId, schoolId, isDeleted: false })
        .select('branchId departmentId')
        .lean()
        .exec();
      employeeBranchId = employee?.branchId ? String(employee.branchId) : undefined;
      employeeDepartmentId = employee?.departmentId ? String(employee.departmentId) : undefined;
    }

    const departmentAccess =
      user.departmentAccess === 'all'
        ? 'all'
        : [
            ...new Set([
              ...(user.departmentAccess ?? []),
              ...(employeeDepartmentId ? [employeeDepartmentId] : []),
            ]),
          ];

    let assignedClasses: string[] = [];
    let assignedSubjects: string[] = [];
    if (employeeId && Types.ObjectId.isValid(employeeId)) {
      const now = new Date();
      const assignments = await TeacherAssignmentModel.find({
        schoolId,
        employeeId: new Types.ObjectId(employeeId),
        status: 'active',
        isDeleted: false,
        startDate: { $lte: now },
        $or: [{ endDate: { $exists: false } }, { endDate: null }, { endDate: { $gte: now } }],
      })
        .select('branchId classId subjectId')
        .lean()
        .exec();
      const scopedAssignments = assignments.filter(
        (assignment) =>
          user.branchAccess === 'all' || user.branchAccess.includes(String(assignment.branchId)),
      );
      assignedClasses = [
        ...new Set(scopedAssignments.map((assignment) => String(assignment.classId))),
      ];
      assignedSubjects = [
        ...new Set(
          scopedAssignments
            .filter((assignment) => assignment.subjectId)
            .map((assignment) => String(assignment.subjectId)),
        ),
      ];
    }

    const defaultBranch =
      user.branchAccess === 'all'
        ? (employeeBranchId ?? null)
        : ((employeeBranchId && user.branchAccess.includes(employeeBranchId)
            ? employeeBranchId
            : user.branchAccess[0]) ?? null);

    return this.sanitizeUser(user, permissions, {
      departmentAccess,
      assignedClasses,
      assignedSubjects,
      defaultBranch,
      isSuperAdmin,
    });
  }

  public async login(
    dto: LoginDto,
    metadata: { ipAddress?: string; userAgent?: string } = {},
  ): Promise<LoginResult> {
    const user = await this.userRepository.findByIdentifier(dto.identifier);

    if (!user) {
      await AuditLogService.log({
        module: 'auth',
        action: 'LOGIN_FAILED',
        entityType: 'User',
        entityId: 'anonymous',
        newValue: { identifier: dto.identifier, reason: 'User not found' },
        ipAddress: metadata.ipAddress,
        userAgent: metadata.userAgent,
      });
      throw new UnauthorizedError('Incorrect username/email or password');
    }

    // Check account status
    if (user.status === 'inactive' || user.status === 'suspended') {
      await AuditLogService.log({
        userId: user._id.toString(),
        schoolId: String((user.schoolId as unknown as { _id?: string })._id ?? user.schoolId),
        module: 'auth',
        action: 'LOGIN_FAILED',
        entityType: 'User',
        entityId: user._id.toString(),
        newValue: { username: user.username, reason: `Account status: ${user.status}` },
        ipAddress: metadata.ipAddress,
        userAgent: metadata.userAgent,
      });
      throw new ForbiddenError(
        'Your account is inactive or suspended. Please contact the administrator.',
      );
    }

    // Check lockout status
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const remainingMinutes = Math.ceil((user.lockedUntil.getTime() - Date.now()) / (60 * 1000));
      await AuditLogService.log({
        userId: user._id.toString(),
        schoolId: String((user.schoolId as unknown as { _id?: string })._id ?? user.schoolId),
        module: 'auth',
        action: 'LOGIN_FAILED',
        entityType: 'User',
        entityId: user._id.toString(),
        newValue: { username: user.username, reason: 'Account lockout active', remainingMinutes },
        ipAddress: metadata.ipAddress,
        userAgent: metadata.userAgent,
      });
      throw new ForbiddenError(
        `Account is temporarily locked due to multiple failed login attempts. Please try again in ${remainingMinutes} minute(s).`,
      );
    }

    // Verify password
    const isPasswordValid = PasswordUtil.compare(dto.password, user.passwordHash);

    if (!isPasswordValid) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

      if (user.failedLoginAttempts >= 5) {
        user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15-minute lock
        user.status = 'locked';
      }

      await user.save();

      await AuditLogService.log({
        userId: user._id.toString(),
        schoolId: (user.schoolId as unknown as { _id: string })?._id
          ? (user.schoolId as unknown as { _id: string })._id.toString()
          : user.schoolId.toString(),
        module: 'auth',
        action: 'LOGIN_FAILED',
        entityType: 'User',
        entityId: user._id.toString(),
        newValue: {
          username: user.username,
          failedLoginAttempts: user.failedLoginAttempts,
          isLocked: Boolean(user.lockedUntil),
        },
        ipAddress: metadata.ipAddress,
        userAgent: metadata.userAgent,
      });

      throw new UnauthorizedError('Incorrect username/email or password');
    }

    // Reset failed attempts upon successful login
    user.failedLoginAttempts = 0;
    user.lockedUntil = undefined;
    if (user.status === 'locked') {
      user.status = 'active';
    }
    user.lastLoginAt = new Date();

    // Generate tokens
    const accessToken = TokenUtil.generateAccessToken({
      userId: user._id.toString(),
      username: user.username,
      email: user.email,
      tokenVersion: user.tokenVersion ?? 0,
    });

    const refreshToken = TokenUtil.generateRefreshToken({
      userId: user._id.toString(),
      tokenVersion: user.tokenVersion ?? 0,
    });

    if (PasswordUtil.needsRehash(user.passwordHash)) {
      user.passwordHash = PasswordUtil.hash(dto.password);
    }

    user.refreshTokenHash = TokenUtil.hashToken(refreshToken);
    await user.save();

    await AuditLogService.log({
      userId: user._id.toString(),
      schoolId: (user.schoolId as unknown as { _id: string })?._id
        ? (user.schoolId as unknown as { _id: string })._id.toString()
        : user.schoolId.toString(),
      module: 'auth',
      action: 'LOGIN_SUCCESS',
      entityType: 'User',
      entityId: user._id.toString(),
      newValue: {
        username: user.username,
        roles: user.roles,
        lastLoginAt: user.lastLoginAt,
      },
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
    });

    const sanitizedUser = await this.buildAuthorizationContext(user);

    return {
      user: sanitizedUser,
      accessToken,
      refreshToken,
    };
  }

  public async refreshToken(
    rawRefreshToken: string,
    _metadata: { ipAddress?: string; userAgent?: string } = {},
  ): Promise<RefreshResult> {
    if (!rawRefreshToken) {
      throw new UnauthorizedError('Refresh token required');
    }

    let payload: { userId: string; tokenVersion?: number };
    try {
      payload = TokenUtil.verifyRefreshToken(rawRefreshToken);
    } catch {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    const user = await this.userRepository.findByIdWithSecrets(payload.userId);

    if (
      !user ||
      user.isDeleted ||
      user.status !== 'active' ||
      (payload.tokenVersion ?? 0) !== (user.tokenVersion ?? 0)
    ) {
      throw new UnauthorizedError('User not found or account not active');
    }

    const incomingHash = TokenUtil.hashToken(rawRefreshToken);
    const isCurrent = user.refreshTokenHash && user.refreshTokenHash === incomingHash;
    if (!isCurrent) {
      throw new UnauthorizedError('Refresh token has been revoked or is invalid');
    }

    // Token Rotation: Generate new pair
    const accessToken = TokenUtil.generateAccessToken({
      userId: user._id.toString(),
      username: user.username,
      email: user.email,
      tokenVersion: user.tokenVersion ?? 0,
    });

    const newRefreshToken = TokenUtil.generateRefreshToken({
      userId: user._id.toString(),
      tokenVersion: user.tokenVersion ?? 0,
    });
    user.previousRefreshTokenHash = undefined;
    user.tokenRotatedAt = new Date();
    user.refreshTokenHash = TokenUtil.hashToken(newRefreshToken);
    await user.save();

    return {
      accessToken,
      refreshToken: newRefreshToken,
      user: await this.buildAuthorizationContext(user),
    };
  }

  public async logout(
    userId: string,
    metadata: { ipAddress?: string; userAgent?: string } = {},
  ): Promise<void> {
    const user = await this.userRepository.findByIdWithSecrets(userId);
    if (user) {
      user.refreshTokenHash = undefined;
      user.previousRefreshTokenHash = undefined;
      user.tokenRotatedAt = undefined;
      user.tokenVersion = (user.tokenVersion ?? 0) + 1;
      await user.save();

      await AuditLogService.log({
        userId: user._id.toString(),
        schoolId: (user.schoolId as unknown as { _id: string })?._id
          ? (user.schoolId as unknown as { _id: string })._id.toString()
          : user.schoolId.toString(),
        module: 'auth',
        action: 'LOGOUT',
        entityType: 'User',
        entityId: user._id.toString(),
        newValue: {
          username: user.username,
        },
        ipAddress: metadata.ipAddress,
        userAgent: metadata.userAgent,
      });
    }
  }

  public async getCurrentUser(userId: string): Promise<SanitizedUser> {
    const user = await this.userRepository.findById(userId);

    if (!user || user.status !== 'active') {
      throw new UnauthorizedError('User session expired or user not active');
    }

    return this.buildAuthorizationContext(user);
  }

  public async changePassword(
    userId: string,
    dto: ChangePasswordDto,
    metadata: { ipAddress?: string; userAgent?: string } = {},
  ): Promise<void> {
    const user = await this.userRepository.findByIdWithSecrets(userId);

    if (!user) {
      throw new NotFoundError('User account not found');
    }

    const isMatch = PasswordUtil.compare(dto.currentPassword, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError('Current password is incorrect');
    }

    user.passwordHash = PasswordUtil.hash(dto.newPassword);
    user.passwordChangedAt = new Date();
    user.mustChangePassword = false;
    user.refreshTokenHash = undefined; // Revoke refresh tokens on password change
    user.previousRefreshTokenHash = undefined;
    user.tokenRotatedAt = undefined;
    user.tokenVersion = (user.tokenVersion ?? 0) + 1;
    await user.save();

    await AuditLogService.log({
      userId: user._id.toString(),
      schoolId: (user.schoolId as unknown as { _id: string })?._id
        ? (user.schoolId as unknown as { _id: string })._id.toString()
        : user.schoolId.toString(),
      module: 'auth',
      action: 'PASSWORD_CHANGED',
      entityType: 'User',
      entityId: user._id.toString(),
      newValue: {
        username: user.username,
        passwordChangedAt: user.passwordChangedAt,
      },
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
    });
  }

  private sanitizeUser(
    user: IUser,
    permissions: string[],
    authorization: Pick<
      SanitizedUser,
      'departmentAccess' | 'assignedClasses' | 'assignedSubjects' | 'defaultBranch' | 'isSuperAdmin'
    >,
  ): SanitizedUser {
    return {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      schoolId: user.schoolId as unknown as SanitizedUser['schoolId'],
      employeeId: user.employeeId as unknown as SanitizedUser['employeeId'],
      roles: user.roles,
      permissions,
      branchAccess: user.branchAccess,
      ...authorization,
      status: user.status,
      lastLoginAt: user.lastLoginAt,
      mustChangePassword: Boolean(user.mustChangePassword),
    };
  }
}
