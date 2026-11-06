import crypto from 'node:crypto';
import { Types } from 'mongoose';

import { ALL_PERMISSION_CODES } from '../../constants/permissions';
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from '../../shared/errors/app-error';
import { PasswordUtil } from '../../utils/password';
import { encryptTotpSecret } from '../../utils/secret-crypto';
import { TokenUtil } from '../../utils/token';
import {
  generateBackupCodes,
  generateTotpQrDataUrl,
  generateTotpSecret,
  generateTotpUri,
  verifyBackupCode,
  verifyTotpCode,
} from '../../utils/totp';
import { AuditLogService } from '../audit-log/audit-log.service';
import { EmployeeModel } from '../employee/employee.model';
import { NotificationService } from '../notification/notification.service';
import { RoleService } from '../role/role.service';
import { TeacherAssignmentModel } from '../teacher-assignment/teacher-assignment.model';
import type { IUser } from '../user/user.model';
import { UserRepository } from '../user/user.repository';
import type {
  ChangePasswordDto,
  Disable2FaDto,
  LoginDto,
  LoginResponse,
  LoginResult,
  RefreshResult,
  RequestTelegramOtpDto,
  SanitizedUser,
  Setup2FaResult,
  Verify2FaDto,
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
  ): Promise<LoginResponse> {
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

    // Reset failed attempts upon successful password verification
    user.failedLoginAttempts = 0;
    user.lockedUntil = undefined;
    if (user.status === 'locked') {
      user.status = 'active';
    }

    if (PasswordUtil.needsRehash(user.passwordHash)) {
      user.passwordHash = PasswordUtil.hash(dto.password);
    }

    // If Two-Factor Authentication is enabled, issue short-lived MFA challenge token
    if (user.twoFactor?.enabled) {
      await user.save();

      const mfaToken = TokenUtil.generateMfaToken({ userId: user._id.toString() });

      await AuditLogService.log({
        userId: user._id.toString(),
        schoolId: (user.schoolId as unknown as { _id: string })?._id
          ? (user.schoolId as unknown as { _id: string })._id.toString()
          : user.schoolId.toString(),
        module: 'auth',
        action: 'MFA_CHALLENGE_ISSUED',
        entityType: 'User',
        entityId: user._id.toString(),
        newValue: {
          username: user.username,
        },
        ipAddress: metadata.ipAddress,
        userAgent: metadata.userAgent,
      });

      return {
        mfaRequired: true,
        mfaToken,
        telegramAvailable: Boolean(user.twoFactor?.telegramChatId),
      };
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

  public async setup2Fa(userId: string): Promise<Setup2FaResult> {
    const user = await this.userRepository.findByIdWithSecrets(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const secret = generateTotpSecret(20);
    const otpauthUri = generateTotpUri(secret, user.username, 'SNPI-SMS');
    const qrCodeDataUrl = await generateTotpQrDataUrl(otpauthUri);
    const { plainCodes, hashedCodes } = generateBackupCodes(8);

    user.twoFactor = {
      enabled: user.twoFactor?.enabled ?? false,
      secret: user.twoFactor?.secret,
      confirmedAt: user.twoFactor?.confirmedAt ?? null,
      tempSecret: encryptTotpSecret(secret),
      tempBackupCodes: hashedCodes,
      backupCodes: user.twoFactor?.backupCodes ?? [],
    };

    await user.save();

    return {
      secret,
      otpauthUri,
      qrCodeDataUrl,
      backupCodes: plainCodes,
    };
  }

  public async enable2Fa(
    userId: string,
    code: string,
    metadata: { ipAddress?: string; userAgent?: string } = {},
  ): Promise<{ success: boolean; message: string }> {
    const user = await this.userRepository.findByIdWithSecrets(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (!user.twoFactor?.tempSecret) {
      throw new BadRequestError('2FA setup has not been initiated. Please call setup first.');
    }

    const isValid = verifyTotpCode(code, user.twoFactor.tempSecret);
    if (!isValid) {
      throw new UnauthorizedError(
        'Invalid 2FA verification code. Please check your authenticator app.',
      );
    }

    user.twoFactor = {
      enabled: true,
      secret: user.twoFactor.tempSecret,
      confirmedAt: new Date(),
      tempSecret: undefined,
      tempBackupCodes: undefined,
      backupCodes: user.twoFactor.tempBackupCodes ?? [],
    };

    await user.save();

    await AuditLogService.log({
      userId: user._id.toString(),
      schoolId: (user.schoolId as unknown as { _id: string })?._id
        ? (user.schoolId as unknown as { _id: string })._id.toString()
        : user.schoolId.toString(),
      module: 'auth',
      action: 'TWO_FACTOR_ENABLED',
      entityType: 'User',
      entityId: user._id.toString(),
      newValue: {
        username: user.username,
        confirmedAt: user.twoFactor.confirmedAt,
      },
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
    });

    return {
      success: true,
      message: 'Two-factor authentication enabled successfully.',
    };
  }

  public async verify2Fa(
    dto: Verify2FaDto,
    metadata: { ipAddress?: string; userAgent?: string } = {},
  ): Promise<LoginResult> {
    let payload: { userId: string };
    try {
      payload = TokenUtil.verifyMfaToken(dto.mfaToken);
    } catch {
      throw new UnauthorizedError('Invalid or expired MFA token');
    }

    const user = await this.userRepository.findByIdWithSecrets(payload.userId);
    if (!user || user.isDeleted || user.status !== 'active') {
      throw new UnauthorizedError('User session expired or user account is not active');
    }

    if (!user.twoFactor?.enabled || !user.twoFactor.secret) {
      throw new UnauthorizedError('Two-factor authentication is not active for this account');
    }

    // Check account lockout
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const remainingMinutes = Math.ceil((user.lockedUntil.getTime() - Date.now()) / (60 * 1000));
      throw new ForbiddenError(
        `Account is temporarily locked due to multiple failed login attempts. Please try again in ${remainingMinutes} minute(s).`,
      );
    }

    let isValid = verifyTotpCode(dto.code, user.twoFactor.secret);
    let usedBackupCodeIndex = -1;
    let mfaMethod = 'totp';

    if (!isValid && user.twoFactor.backupCodes && user.twoFactor.backupCodes.length > 0) {
      usedBackupCodeIndex = verifyBackupCode(dto.code, user.twoFactor.backupCodes);
      if (usedBackupCodeIndex !== -1) {
        isValid = true;
        mfaMethod = 'backup_code';
      }
    }

    if (
      !isValid &&
      user.twoFactor.telegramOtpHash &&
      user.twoFactor.telegramOtpExpiresAt &&
      user.twoFactor.telegramOtpExpiresAt > new Date()
    ) {
      const inputHash = crypto.createHash('sha256').update(dto.code.trim()).digest('hex');
      const inputBuffer = Buffer.from(inputHash, 'hex');
      const storedBuffer = Buffer.from(user.twoFactor.telegramOtpHash, 'hex');

      if (
        inputBuffer.length === storedBuffer.length &&
        crypto.timingSafeEqual(inputBuffer, storedBuffer)
      ) {
        isValid = true;
        mfaMethod = 'telegram_otp';
        // Burn single-use Telegram OTP
        user.twoFactor.telegramOtpHash = undefined;
        user.twoFactor.telegramOtpExpiresAt = null;
      }
    }

    if (!isValid) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      if (user.failedLoginAttempts >= 5) {
        user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
        user.status = 'locked';
      }
      await user.save();

      await AuditLogService.log({
        userId: user._id.toString(),
        schoolId: (user.schoolId as unknown as { _id: string })?._id
          ? (user.schoolId as unknown as { _id: string })._id.toString()
          : user.schoolId.toString(),
        module: 'auth',
        action: 'MFA_FAILED',
        entityType: 'User',
        entityId: user._id.toString(),
        newValue: {
          username: user.username,
          failedLoginAttempts: user.failedLoginAttempts,
        },
        ipAddress: metadata.ipAddress,
        userAgent: metadata.userAgent,
      });

      throw new UnauthorizedError('Invalid 2FA verification code or backup code');
    }

    // If backup code used, mark it as spent
    if (usedBackupCodeIndex !== -1 && user.twoFactor.backupCodes) {
      user.twoFactor.backupCodes[usedBackupCodeIndex]!.usedAt = new Date();
      user.markModified('twoFactor.backupCodes');
    }

    // Reset failed attempts upon successful MFA verification
    user.failedLoginAttempts = 0;
    user.lockedUntil = undefined;
    user.lastLoginAt = new Date();

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
        mfaMethod,
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

  public async disable2Fa(
    userId: string,
    dto: Disable2FaDto,
    metadata: { ipAddress?: string; userAgent?: string } = {},
  ): Promise<{ success: boolean; message: string }> {
    const user = await this.userRepository.findByIdWithSecrets(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (!user.twoFactor?.enabled || !user.twoFactor.secret) {
      throw new BadRequestError('Two-factor authentication is not enabled for this account');
    }

    const isPasswordValid = PasswordUtil.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Current password is incorrect');
    }

    let isValid = verifyTotpCode(dto.code, user.twoFactor.secret);
    if (!isValid && user.twoFactor.backupCodes) {
      const backupIdx = verifyBackupCode(dto.code, user.twoFactor.backupCodes);
      if (backupIdx !== -1) {
        isValid = true;
      }
    }

    if (!isValid) {
      throw new UnauthorizedError('Invalid 2FA verification code or backup code');
    }

    user.twoFactor = {
      enabled: false,
      secret: undefined,
      confirmedAt: null,
      tempSecret: undefined,
      tempBackupCodes: undefined,
      backupCodes: [],
    };

    await user.save();

    await AuditLogService.log({
      userId: user._id.toString(),
      schoolId: (user.schoolId as unknown as { _id: string })?._id
        ? (user.schoolId as unknown as { _id: string })._id.toString()
        : user.schoolId.toString(),
      module: 'auth',
      action: 'TWO_FACTOR_DISABLED',
      entityType: 'User',
      entityId: user._id.toString(),
      newValue: {
        username: user.username,
      },
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
    });

    return {
      success: true,
      message: 'Two-factor authentication disabled successfully.',
    };
  }

  public async resetUser2Fa(
    targetUserId: string,
    adminUserId: string,
    metadata: { ipAddress?: string; userAgent?: string } = {},
  ): Promise<{ success: boolean; message: string }> {
    const targetUser = await this.userRepository.findByIdWithSecrets(targetUserId);
    if (!targetUser) {
      throw new NotFoundError('Target user not found');
    }

    targetUser.twoFactor = {
      enabled: false,
      secret: undefined,
      confirmedAt: null,
      tempSecret: undefined,
      tempBackupCodes: undefined,
      backupCodes: [],
    };

    // Increment tokenVersion to invalidate any active sessions
    targetUser.tokenVersion = (targetUser.tokenVersion ?? 0) + 1;
    targetUser.refreshTokenHash = undefined;
    targetUser.previousRefreshTokenHash = undefined;
    targetUser.tokenRotatedAt = undefined;

    await targetUser.save();

    await AuditLogService.log({
      userId: adminUserId,
      schoolId: (targetUser.schoolId as unknown as { _id: string })?._id
        ? (targetUser.schoolId as unknown as { _id: string })._id.toString()
        : targetUser.schoolId.toString(),
      module: 'auth',
      action: 'ADMIN_TWO_FACTOR_RESET',
      entityType: 'User',
      entityId: targetUser._id.toString(),
      newValue: {
        targetUsername: targetUser.username,
        resetBy: adminUserId,
      },
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
    });

    return {
      success: true,
      message: 'User two-factor authentication has been reset successfully.',
    };
  }

  public async requestTelegram2FaOtp(
    dto: RequestTelegramOtpDto,
    metadata: { ipAddress?: string; userAgent?: string } = {},
  ): Promise<{ success: boolean; message: string }> {
    let payload: { userId: string };
    try {
      payload = TokenUtil.verifyMfaToken(dto.mfaToken);
    } catch {
      throw new UnauthorizedError('Invalid or expired MFA token');
    }

    const user = await this.userRepository.findByIdWithSecrets(payload.userId);
    if (!user || user.isDeleted || user.status !== 'active') {
      throw new UnauthorizedError('User session expired or user account is not active');
    }

    if (!user.twoFactor?.enabled) {
      throw new BadRequestError('Two-factor authentication is not active for this account');
    }

    if (!user.twoFactor.telegramChatId) {
      throw new BadRequestError(
        'Telegram account is not linked to this user. Use a backup recovery code or contact your administrator.',
      );
    }

    // Generate cryptographically secure 6-digit numeric OTP
    const otpCode = crypto.randomInt(100000, 999999).toString();
    const otpHash = crypto.createHash('sha256').update(otpCode).digest('hex');

    user.twoFactor.telegramOtpHash = otpHash;
    user.twoFactor.telegramOtpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min TTL
    await user.save();

    const notificationService = new NotificationService();
    const message = `SNPI-SMS Authentication Security Alert\n\nYour 2FA login verification code is:\n\n${otpCode}\n\nThis code expires in 5 minutes. If you did not attempt this login, notify your administrator immediately.`;

    await notificationService.dispatchTelegramMessage(user.twoFactor.telegramChatId, message);

    await AuditLogService.log({
      userId: user._id.toString(),
      schoolId: (user.schoolId as unknown as { _id: string })?._id
        ? (user.schoolId as unknown as { _id: string })._id.toString()
        : user.schoolId.toString(),
      module: 'auth',
      action: 'MFA_CHALLENGE_ISSUED',
      entityType: 'User',
      entityId: user._id.toString(),
      newValue: {
        username: user.username,
        channel: 'telegram',
      },
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
    });

    return {
      success: true,
      message: 'One-time login verification code dispatched to your linked Telegram account.',
    };
  }

  public async linkTelegram(
    userId: string,
    telegramChatId: string,
  ): Promise<{ success: boolean; message: string }> {
    const user = await this.userRepository.findByIdWithSecrets(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (!user.twoFactor) {
      user.twoFactor = {
        enabled: false,
        backupCodes: [],
      };
    }

    user.twoFactor.telegramChatId = telegramChatId.trim();
    await user.save();

    return {
      success: true,
      message: 'Telegram account linked successfully for 2FA verification fallback.',
    };
  }

  public async unlinkTelegram(userId: string): Promise<{ success: boolean; message: string }> {
    const user = await this.userRepository.findByIdWithSecrets(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user.twoFactor) {
      user.twoFactor.telegramChatId = null;
      user.twoFactor.telegramOtpHash = undefined;
      user.twoFactor.telegramOtpExpiresAt = null;
      await user.save();
    }

    return {
      success: true,
      message: 'Telegram account unlinked from 2FA.',
    };
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
      twoFactorEnabled: Boolean(user.twoFactor?.enabled),
      twoFactorTelegramLinked: Boolean(user.twoFactor?.telegramChatId),
      lastLoginAt: user.lastLoginAt,
      mustChangePassword: Boolean(user.mustChangePassword),
    };
  }
}
