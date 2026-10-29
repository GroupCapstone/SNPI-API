import crypto from 'crypto';
import { ALL_PERMISSION_CODES, DEFAULT_CORE_ROLES } from '../../constants/permissions';
import { checkUserPermission } from '../../middleware/authorize';
import { getAuthorizedBranchFilter } from '../../middleware/branch-access';
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from '../../shared/errors/app-error';
import type { AuthUser } from '../../types/auth';
import { PasswordUtil } from '../../utils/password';
import { AuditLogService } from '../audit-log/audit-log.service';
import { BranchModel } from '../branch/branch.model';
import { DepartmentModel } from '../department/department.model';
import { EmployeeModel } from '../employee/employee.model';
import { RoleModel } from '../role/role.model';
import { SchoolModel } from '../school/school.model';
import type { IUser, UserStatus } from './user.model';
import { UserModel } from './user.model';
import { UserRepository } from './user.repository';
import type {
  AdminResetPasswordDto,
  AdminResetPasswordResult,
  CreateUserDto,
  UpdateUserDto,
  UserQueryFilters,
} from './user.types';

const generateSecureTemporaryPassword = (): string => {
  const uppers = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lowers = 'abcdefghijkmnopqrstuvwxyz';
  const numbers = '23456789';
  const specials = '!@#$%&*';
  const all = uppers + lowers + numbers + specials;

  const pick = (charset: string) => charset[crypto.randomInt(0, charset.length)];

  const requiredChars = [pick(uppers), pick(lowers), pick(numbers), pick(specials)];

  for (let i = 0; i < 8; i++) {
    requiredChars.push(pick(all));
  }

  // Shuffle
  for (let i = requiredChars.length - 1; i > 0; i--) {
    const j = crypto.randomInt(0, i + 1);
    [requiredChars[i], requiredChars[j]] = [requiredChars[j], requiredChars[i]];
  }

  return requiredChars.join('');
};

const ROLE_ALIASES: Record<string, string> = {
  branch_admin: 'branch_manager',
  accountant: 'finance_officer',
  academic_director: 'director',
};

const normalizeRole = (role: string): string => {
  const trimmed = role.trim().toLowerCase();
  return ROLE_ALIASES[trimmed] ?? trimmed;
};

export class UserService {
  private async assertSecurityAssignments(
    roles: string[],
    directPermissions: string[],
    actor: AuthUser,
  ): Promise<void> {
    if (roles.includes('super_admin') && !actor.permissions.includes('*')) {
      throw new ForbiddenError('Only wildcard authority may assign the super_admin role');
    }

    const activeRoles = await RoleModel.find({
      code: { $in: roles },
      status: 'active',
      isDeleted: false,
    });
    if (activeRoles.length !== roles.length) {
      throw new ValidationError('One or more assigned roles do not exist or are inactive.');
    }

    const isWildcardActor = actor.permissions.includes('*');

    const knownPermissions = new Set(ALL_PERMISSION_CODES);
    for (const permission of directPermissions) {
      if (permission === '*' || !knownPermissions.has(permission)) {
        throw new ForbiddenError(`Direct permission "${permission}" cannot be assigned`);
      }
      if (!isWildcardActor && !checkUserPermission(actor.permissions, permission)) {
        throw new ForbiddenError(`You cannot assign direct permission "${permission}"`);
      }
    }

    const hasAllBranchesUserMgmt =
      isWildcardActor ||
      checkUserPermission(actor.permissions, 'user.create.all_branches') ||
      checkUserPermission(actor.permissions, 'user.edit.all_branches');

    for (const role of activeRoles) {
      if (role.permissions.includes('*') && !isWildcardActor) {
        throw new ForbiddenError(`You cannot assign role "${role.code}"`);
      }
      if (role.code === 'director' && !isWildcardActor) {
        throw new ForbiddenError('Only Super Administrator may assign the School Director role');
      }
      if (
        (role.code === 'branch_manager' || role.code === 'administrator') &&
        !hasAllBranchesUserMgmt
      ) {
        throw new ForbiddenError(
          `Only executive multi-branch leadership may assign campus leadership role "${role.code}"`,
        );
      }

      // User managers may delegate the established system roles within the
      // leadership hierarchy above. Custom roles and additions to system roles
      // must never grant authority the actor does not possess.
      const canonicalPermissions = role.isSystem
        ? (DEFAULT_CORE_ROLES.find((canonical) => canonical.code === role.code)?.permissions ?? [])
        : [];
      for (const permission of role.permissions) {
        if (
          !isWildcardActor &&
          !canonicalPermissions.includes(permission) &&
          !checkUserPermission(actor.permissions, permission)
        ) {
          throw new ForbiddenError(
            `You cannot assign role "${role.code}" with permission "${permission}"`,
          );
        }
      }
    }
  }

  private assertAssignedScope(
    branchAccess: 'all' | string[],
    departmentAccess: 'all' | string[] | undefined,
    actor: AuthUser,
  ): void {
    if (actor.branchAccess !== 'all') {
      if (branchAccess === 'all' || branchAccess.some((id) => !actor.branchAccess.includes(id))) {
        throw new ForbiddenError('You cannot expand a user beyond your assigned branch scope');
      }
    }
    if (actor.departmentAccess !== 'all' && departmentAccess) {
      const allowed = actor.departmentAccess ?? [];
      if (departmentAccess === 'all' || departmentAccess.some((id) => !allowed.includes(id))) {
        throw new ForbiddenError('You cannot expand a user beyond your department scope');
      }
    }
  }

  public constructor(private readonly repository = new UserRepository()) {}

  private getSchoolId(user: IUser): string {
    return typeof user.schoolId === 'object' && user.schoolId !== null && '_id' in user.schoolId
      ? String(user.schoolId._id)
      : String(user.schoolId);
  }

  private assertUserScope(targetUser: IUser, currentUser: AuthUser): void {
    if (currentUser.permissions.includes('*')) {
      return;
    }
    if (this.getSchoolId(targetUser) !== currentUser.schoolId) {
      throw new ForbiddenError('You do not have access to this user account');
    }
    if (currentUser.branchAccess !== 'all') {
      if (
        targetUser.branchAccess === 'all' ||
        targetUser.branchAccess.some((branchId) => !currentUser.branchAccess.includes(branchId))
      ) {
        throw new ForbiddenError('You do not have access to this user account');
      }
    }
  }

  public async getUsers(
    filters: UserQueryFilters,
    user: AuthUser,
  ): Promise<{ data: IUser[]; total: number }> {
    const requestedBranch = filters.branchId === 'all' ? undefined : filters.branchId;
    const branchFilter = getAuthorizedBranchFilter(user.branchAccess);
    if (requestedBranch) getAuthorizedBranchFilter(user.branchAccess, requestedBranch);
    return this.repository.findWithFilters(
      { ...filters, schoolId: user.schoolId, branchId: requestedBranch },
      branchFilter,
    );
  }

  public async getUserById(id: string, currentUser: AuthUser): Promise<IUser> {
    const targetUser = await this.repository.findById(id);
    if (!targetUser) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }
    this.assertUserScope(targetUser, currentUser);
    return targetUser;
  }

  public async createUser(dto: CreateUserDto, user: AuthUser): Promise<IUser> {
    this.assertAssignedScope(dto.branchAccess, dto.departmentAccess, user);
    if (!user.permissions.includes('*') && user.schoolId && dto.schoolId !== user.schoolId) {
      throw new ForbiddenError('You cannot create a user account for another school');
    }
    // 1. Validate School exists & is active
    const school = await SchoolModel.findOne({ _id: dto.schoolId, isDeleted: false });
    if (!school) {
      throw new ValidationError(`Selected school with ID ${dto.schoolId} does not exist`);
    }

    // 2. Validate Employee exists if provided
    if (dto.employeeId && dto.employeeId.trim()) {
      const employee = await EmployeeModel.findOne({ _id: dto.employeeId, isDeleted: false });
      if (!employee) {
        throw new ValidationError(`Selected employee with ID ${dto.employeeId} does not exist`);
      }
      if (String(employee.schoolId) !== dto.schoolId) {
        throw new ValidationError('Selected employee does not belong to the selected school');
      }
      if (dto.branchAccess !== 'all' && !dto.branchAccess.includes(String(employee.branchId))) {
        throw new ValidationError('User branch access must include the linked employee branch');
      }
      if (
        dto.departmentAccess &&
        dto.departmentAccess !== 'all' &&
        !dto.departmentAccess.includes(String(employee.departmentId))
      ) {
        throw new ValidationError(
          'User department access must include the linked employee department',
        );
      }
    }

    if (dto.branchAccess !== 'all') {
      const uniqueBranchIds = [...new Set(dto.branchAccess)];
      if (uniqueBranchIds.length === 0) {
        throw new ValidationError('At least one branch must be assigned');
      }
      const validBranches = await BranchModel.countDocuments({
        _id: { $in: uniqueBranchIds },
        schoolId: dto.schoolId,
        isDeleted: false,
      });
      if (validBranches !== uniqueBranchIds.length) {
        throw new ValidationError('One or more assigned branches are invalid for this school');
      }
    }

    // 3. Super Admin Uniqueness Enforcement (Only one Super Admin permitted)
    const normalizedRoles = [...new Set(dto.roles.map(normalizeRole))];
    const directPermissions = [...new Set(dto.directPermissions ?? [])];
    await this.assertSecurityAssignments(normalizedRoles, directPermissions, user);
    if (normalizedRoles.includes('super_admin')) {
      const existingSuperAdmin = await UserModel.countDocuments({
        roles: 'super_admin',
        isDeleted: false,
      });
      if (existingSuperAdmin >= 1) {
        throw new ForbiddenError(
          'Only one Super Administrator account is permitted in the system.',
        );
      }
    }

    if (dto.departmentAccess && dto.departmentAccess !== 'all') {
      const departmentIds = [...new Set(dto.departmentAccess)];
      const departmentCount = await DepartmentModel.countDocuments({
        _id: { $in: departmentIds },
        schoolId: dto.schoolId,
        isDeleted: false,
      });
      if (departmentCount !== departmentIds.length) {
        throw new ValidationError('One or more assigned departments are invalid for this school');
      }
    }

    // 5. Check duplicate username
    const existingUsername = await this.repository.findByUsername(dto.username);
    if (existingUsername) {
      throw new ConflictError(`Username "${dto.username}" is already taken`);
    }

    // 6. Check duplicate email
    const existingEmail = await this.repository.findByEmail(dto.email);
    if (existingEmail) {
      throw new ConflictError(`Email "${dto.email}" is already registered`);
    }

    // 7. Hash password
    const passwordHash = PasswordUtil.hash(dto.password);

    // 8. Create User
    const created = await this.repository.create({
      ...dto,
      username: dto.username.trim().toLowerCase(),
      email: dto.email.trim().toLowerCase(),
      roles: normalizedRoles,
      directPermissions,
      employeeId: dto.employeeId && dto.employeeId.trim() ? dto.employeeId : undefined,
      passwordHash,
      createdBy: user.userId,
    });

    // 9. Audit Logging
    await AuditLogService.log({
      userId: user.userId,
      module: 'user',
      action: 'CREATE',
      entityType: 'User',
      entityId: created._id.toString(),
      schoolId: dto.schoolId,
      newValue: {
        username: created.username,
        email: created.email,
        roles: created.roles,
        branchAccess: created.branchAccess,
        departmentAccess: created.departmentAccess,
        directPermissions: created.directPermissions,
        status: created.status,
      },
    });

    return created;
  }

  public async updateUser(id: string, dto: UpdateUserDto, user: AuthUser): Promise<IUser> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }
    this.assertUserScope(existing, user);

    if (
      existing._id.toString() === user.userId &&
      (dto.roles ||
        dto.branchAccess ||
        dto.departmentAccess ||
        dto.directPermissions ||
        dto.status ||
        dto.employeeId !== undefined ||
        dto.schoolId !== undefined ||
        dto.password ||
        dto.mustChangePassword !== undefined)
    ) {
      throw new ForbiddenError('You cannot change your own roles, permissions, scope, or status');
    }

    const isExistingSuperAdmin = existing.roles.includes('super_admin');
    const isActorWildcard = user.permissions.includes('*');
    if (isExistingSuperAdmin && !isActorWildcard) {
      throw new ForbiddenError('Only wildcard authority may modify a Super Administrator account');
    }

    const isExistingDirector = existing.roles.includes('director');
    if (isExistingDirector && !isActorWildcard) {
      throw new ForbiddenError('Only Super Administrator may modify a School Director account');
    }

    if (dto.mustChangePassword === false) {
      throw new ForbiddenError(
        'Only a successful password change may clear the password-change requirement',
      );
    }
    if (
      (dto.password || dto.mustChangePassword !== undefined) &&
      !checkUserPermission(user.permissions, 'user.reset_password.own_branch')
    ) {
      throw new ForbiddenError('Password changes require user reset-password permission');
    }
    if (!isActorWildcard) {
      await this.assertSecurityAssignments(existing.roles, existing.directPermissions ?? [], user);
    }

    let normalizedRoles: string[] | undefined;

    if (dto.roles) {
      normalizedRoles = [...new Set(dto.roles.map(normalizeRole))];
    }

    if (dto.roles !== undefined || dto.directPermissions !== undefined) {
      const effectiveRoles = normalizedRoles ?? existing.roles;
      const effectiveDirectPermissions = [
        ...new Set(dto.directPermissions ?? existing.directPermissions ?? []),
      ];
      await this.assertSecurityAssignments(effectiveRoles, effectiveDirectPermissions, user);
    }

    if (dto.branchAccess !== undefined || dto.departmentAccess !== undefined) {
      this.assertAssignedScope(
        dto.branchAccess ?? existing.branchAccess,
        dto.departmentAccess ?? existing.departmentAccess,
        user,
      );
    }

    const targetSchoolId = dto.schoolId || this.getSchoolId(existing);
    if (!user.permissions.includes('*') && targetSchoolId !== user.schoolId) {
      throw new ForbiddenError('You cannot move a user account to another school');
    }
    if (dto.branchAccess && dto.branchAccess !== 'all') {
      const uniqueBranchIds = [...new Set(dto.branchAccess)];
      if (uniqueBranchIds.length === 0) {
        throw new ValidationError('At least one branch must be assigned');
      }
      const validBranches = await BranchModel.countDocuments({
        _id: { $in: uniqueBranchIds },
        schoolId: targetSchoolId,
        isDeleted: false,
      });
      if (validBranches !== uniqueBranchIds.length) {
        throw new ValidationError('One or more assigned branches are invalid for this school');
      }
    }
    if (dto.departmentAccess && dto.departmentAccess !== 'all') {
      const departmentIds = [...new Set(dto.departmentAccess)];
      const departmentCount = await DepartmentModel.countDocuments({
        _id: { $in: departmentIds },
        schoolId: targetSchoolId,
        isDeleted: false,
      });
      if (departmentCount !== departmentIds.length) {
        throw new ValidationError('One or more assigned departments are invalid for this school');
      }
    }

    const existingEmployeeId = existing.employeeId
      ? typeof existing.employeeId === 'object' && '_id' in existing.employeeId
        ? String(existing.employeeId._id)
        : String(existing.employeeId)
      : undefined;
    const targetEmployeeId =
      dto.employeeId !== undefined ? dto.employeeId.trim() || undefined : existingEmployeeId;
    if (targetEmployeeId) {
      const employee = await EmployeeModel.findOne({ _id: targetEmployeeId, isDeleted: false });
      if (!employee || String(employee.schoolId) !== targetSchoolId) {
        throw new ValidationError('Linked employee is invalid for the selected school');
      }
      const targetBranchAccess = dto.branchAccess ?? existing.branchAccess;
      if (targetBranchAccess !== 'all' && !targetBranchAccess.includes(String(employee.branchId))) {
        throw new ValidationError('User branch access must include the linked employee branch');
      }
      const targetDepartmentAccess = dto.departmentAccess ?? existing.departmentAccess;
      if (
        targetDepartmentAccess !== 'all' &&
        !(targetDepartmentAccess ?? []).includes(String(employee.departmentId))
      ) {
        throw new ValidationError(
          'User department access must include the linked employee department',
        );
      }
    }

    // Super Admin Protection Rules
    if (isExistingSuperAdmin) {
      if (normalizedRoles && !normalizedRoles.includes('super_admin')) {
        throw new ForbiddenError(
          'Cannot remove the super_admin role from the primary Super Administrator.',
        );
      }
      if (dto.status && dto.status !== 'active') {
        throw new ForbiddenError(
          'The primary Super Administrator account cannot be deactivated or suspended.',
        );
      }
      if (dto.branchAccess && dto.branchAccess !== 'all') {
        throw new ForbiddenError('The Super Administrator must have access to all branches.');
      }
    } else if (normalizedRoles && normalizedRoles.includes('super_admin')) {
      // Check if another super admin exists
      const existingSuperAdminCount = await UserModel.countDocuments({
        roles: 'super_admin',
        isDeleted: false,
        _id: { $ne: id },
      });
      if (existingSuperAdminCount >= 1) {
        throw new ForbiddenError(
          'Only one Super Administrator account is permitted in the system.',
        );
      }
    }

    // 1. Check duplicate username if changing
    if (dto.username && dto.username.trim().toLowerCase() !== existing.username) {
      const usernameConflict = await this.repository.findByUsername(dto.username);
      if (usernameConflict && usernameConflict._id.toString() !== id) {
        throw new ConflictError(`Username "${dto.username}" is already taken`);
      }
    }

    // 2. Check duplicate email if changing
    if (dto.email && dto.email.trim().toLowerCase() !== existing.email) {
      const emailConflict = await this.repository.findByEmail(dto.email);
      if (emailConflict && emailConflict._id.toString() !== id) {
        throw new ConflictError(`Email "${dto.email}" is already registered`);
      }
    }

    // 3. Hash password if provided
    let passwordHash: string | undefined;
    if (dto.password && dto.password.trim()) {
      passwordHash = PasswordUtil.hash(dto.password);
    }

    const updated = await this.repository.update(id, {
      ...dto,
      username: dto.username ? dto.username.trim().toLowerCase() : undefined,
      email: dto.email ? dto.email.trim().toLowerCase() : undefined,
      roles: normalizedRoles,
      directPermissions: dto.directPermissions !== undefined ? dto.directPermissions : undefined,
      employeeId:
        dto.employeeId !== undefined
          ? dto.employeeId.trim()
            ? dto.employeeId
            : undefined
          : undefined,
      passwordHash,
      updatedBy: user.userId,
    });

    if (!updated) {
      throw new NotFoundError(`Failed to update user with ID ${id}`);
    }

    // Audit Logging
    await AuditLogService.log({
      userId: user.userId,
      module: 'user',
      action: 'UPDATE',
      entityType: 'User',
      entityId: id,
      schoolId: existing.schoolId.toString(),
      oldValue: {
        username: existing.username,
        email: existing.email,
        roles: existing.roles,
        branchAccess: existing.branchAccess,
        departmentAccess: existing.departmentAccess,
        directPermissions: existing.directPermissions,
        status: existing.status,
      },
      newValue: {
        username: updated.username,
        email: updated.email,
        roles: updated.roles,
        branchAccess: updated.branchAccess,
        departmentAccess: updated.departmentAccess,
        directPermissions: updated.directPermissions,
        status: updated.status,
      },
    });

    const oldRoles = [...existing.roles].sort();
    const newRoles = [...updated.roles].sort();
    if (JSON.stringify(oldRoles) !== JSON.stringify(newRoles)) {
      await AuditLogService.log({
        userId: user.userId,
        module: 'user',
        action: 'ROLE_ASSIGN',
        entityType: 'User',
        entityId: id,
        schoolId: this.getSchoolId(existing),
        oldValue: { roles: oldRoles },
        newValue: { roles: newRoles },
      });
    }

    const oldPermissions = [...(existing.directPermissions ?? [])].sort();
    const newPermissions = [...(updated.directPermissions ?? [])].sort();
    if (JSON.stringify(oldPermissions) !== JSON.stringify(newPermissions)) {
      await AuditLogService.log({
        userId: user.userId,
        module: 'user',
        action: 'PERMISSION_CHANGE',
        entityType: 'User',
        entityId: id,
        schoolId: this.getSchoolId(existing),
        oldValue: { directPermissions: oldPermissions },
        newValue: { directPermissions: newPermissions },
      });
    }

    if (JSON.stringify(existing.branchAccess) !== JSON.stringify(updated.branchAccess)) {
      await AuditLogService.log({
        userId: user.userId,
        module: 'user',
        action: 'BRANCH_ACCESS_CHANGED',
        entityType: 'User',
        entityId: id,
        schoolId: this.getSchoolId(existing),
        oldValue: { branchAccess: existing.branchAccess },
        newValue: { branchAccess: updated.branchAccess },
      });
    }

    if (JSON.stringify(existing.departmentAccess) !== JSON.stringify(updated.departmentAccess)) {
      await AuditLogService.log({
        userId: user.userId,
        module: 'user',
        action: 'DEPARTMENT_ACCESS_CHANGED',
        entityType: 'User',
        entityId: id,
        schoolId: this.getSchoolId(existing),
        oldValue: { departmentAccess: existing.departmentAccess },
        newValue: { departmentAccess: updated.departmentAccess },
      });
    }

    return updated;
  }

  public async deleteUser(id: string, user: AuthUser): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }
    this.assertUserScope(existing, user);

    // Super Admin Protection: Cannot be deleted
    if (existing.roles.includes('super_admin')) {
      throw new ForbiddenError(
        'The primary Super Administrator account is protected and cannot be deleted.',
      );
    }

    // Self-deletion protection
    if (existing._id.toString() === user.userId) {
      throw new ForbiddenError('You cannot delete your own user account.');
    }
    if (!user.permissions.includes('*')) {
      await this.assertSecurityAssignments(existing.roles, existing.directPermissions ?? [], user);
    }

    await this.repository.softDelete(id, user.userId);

    // Audit Logging
    await AuditLogService.log({
      userId: user.userId,
      module: 'user',
      action: 'DELETE',
      entityType: 'User',
      entityId: id,
      schoolId: existing.schoolId.toString(),
      oldValue: {
        username: existing.username,
        email: existing.email,
      },
    });
  }

  public async resetUserPassword(
    id: string,
    dto: AdminResetPasswordDto,
    actor: AuthUser,
  ): Promise<AdminResetPasswordResult> {
    const targetUser = await this.repository.findByIdWithSecrets(id);
    if (!targetUser || targetUser.isDeleted) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }

    this.assertUserScope(targetUser, actor);

    // Role Hierarchy Authorization Checks
    const isActorSuperAdmin = actor.permissions.includes('*');
    const isTargetSuperAdmin = targetUser.roles.includes('super_admin');
    const isTargetDirector = targetUser.roles.includes('director');

    if (isTargetSuperAdmin && !isActorSuperAdmin) {
      throw new ForbiddenError(
        'Only a Super Administrator can reset a Super Administrator password.',
      );
    }

    if (isTargetDirector && !isActorSuperAdmin) {
      throw new ForbiddenError('You do not have permission to reset a School Director password.');
    }
    if (!isActorSuperAdmin) {
      await this.assertSecurityAssignments(
        targetUser.roles,
        targetUser.directPermissions ?? [],
        actor,
      );
    }

    // Determine temporary password
    const temporaryPassword =
      dto.temporaryPassword && dto.temporaryPassword.trim()
        ? dto.temporaryPassword.trim()
        : generateSecureTemporaryPassword();

    // Hash & update user credentials
    targetUser.passwordHash = PasswordUtil.hash(temporaryPassword);
    targetUser.mustChangePassword = true;
    targetUser.failedLoginAttempts = 0;
    targetUser.lockedUntil = undefined;
    if (targetUser.status === 'locked') {
      targetUser.status = 'active';
    }

    // Invalidate existing sessions/tokens
    targetUser.refreshTokenHash = undefined;
    targetUser.previousRefreshTokenHash = undefined;
    targetUser.tokenRotatedAt = undefined;
    targetUser.tokenVersion = (targetUser.tokenVersion ?? 0) + 1;

    await targetUser.save();

    // Audit Logging
    await AuditLogService.log({
      userId: actor.userId,
      module: 'user',
      action: 'PASSWORD_RESET',
      entityType: 'User',
      entityId: targetUser._id.toString(),
      schoolId: this.getSchoolId(targetUser),
      newValue: {
        username: targetUser.username,
        email: targetUser.email,
        mustChangePassword: true,
        resetBy: actor.userId,
      },
    });

    return {
      message: 'Password reset successfully. The user must change password upon next login.',
      temporaryPassword,
      mustChangePassword: true,
    };
  }

  public async updateUserStatus(id: string, status: UserStatus, user: AuthUser): Promise<IUser> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }
    this.assertUserScope(existing, user);

    if (existing._id.toString() === user.userId) {
      throw new ForbiddenError('You cannot change your own account status');
    }

    const isExistingSuperAdmin = existing.roles.includes('super_admin');
    const isActorWildcard = user.permissions.includes('*');
    if (isExistingSuperAdmin) {
      throw new ForbiddenError(
        'The primary Super Administrator account cannot be deactivated or suspended.',
      );
    }

    const isExistingDirector = existing.roles.includes('director');
    if (isExistingDirector && !isActorWildcard) {
      throw new ForbiddenError('Only Super Administrator may change status of a School Director');
    }
    if (!isActorWildcard) {
      await this.assertSecurityAssignments(existing.roles, existing.directPermissions ?? [], user);
    }

    if (user.branchAccess !== 'all') {
      const allowedBranches = Array.isArray(user.branchAccess) ? user.branchAccess : [];
      if (
        existing.branchAccess === 'all' ||
        (Array.isArray(existing.branchAccess) &&
          existing.branchAccess.some((b) => !allowedBranches.includes(String(b))))
      ) {
        throw new ForbiddenError(
          'You do not have access to change user status outside your branch',
        );
      }
    }

    const oldStatus = existing.status;
    existing.status = status;
    if (status !== 'active') {
      existing.tokenVersion = (existing.tokenVersion ?? 0) + 1;
      existing.refreshTokenHash = undefined;
      existing.previousRefreshTokenHash = undefined;
      existing.tokenRotatedAt = undefined;
    }
    const updated = await existing.save();

    await AuditLogService.log({
      userId: user.userId,
      schoolId: this.getSchoolId(existing),
      branchId:
        Array.isArray(existing.branchAccess) && existing.branchAccess.length > 0
          ? String(existing.branchAccess[0])
          : undefined,
      module: 'user',
      action: status === 'active' ? 'USER_ACTIVATED' : 'USER_DEACTIVATED',
      entityType: 'User',
      entityId: String(existing._id),
      oldValue: { status: oldStatus },
      newValue: { status },
      reason: `User account status transitioned to ${status}`,
    });

    return updated;
  }
}
