import { ALL_PERMISSION_CODES } from '../../constants/permissions';
import { checkUserPermission } from '../../middleware/authorize';
import { ConflictError, ForbiddenError, NotFoundError } from '../../shared/errors/app-error';
import type { AuthUser } from '../../types/auth';
import { AuditLogService } from '../audit-log/audit-log.service';
import { UserModel } from '../user/user.model';
import type { IRole } from './role.model';
import { RoleRepository } from './role.repository';
import type { CreateRoleDto, RoleQueryFilters, UpdateRoleDto } from './role.types';

export class RoleService {
  private assertPermissionsCanBeGranted(permissions: string[], actor: AuthUser): string[] {
    const normalized = [...new Set(permissions.map((permission) => permission.trim()))];
    const knownPermissions = new Set(ALL_PERMISSION_CODES);

    for (const permission of normalized) {
      if (permission === '*' || !knownPermissions.has(permission)) {
        throw new ForbiddenError(`Permission "${permission}" cannot be assigned`);
      }
      if (!checkUserPermission(actor.permissions, permission)) {
        throw new ForbiddenError(`You cannot assign permission "${permission}"`);
      }
    }

    return normalized;
  }

  public constructor(private readonly repository = new RoleRepository()) {}

  public async getRoles(filters: RoleQueryFilters): Promise<{ data: IRole[]; total: number }> {
    return this.repository.findWithFilters(filters);
  }

  public async getRoleById(id: string): Promise<IRole> {
    const role = await this.repository.findById(id);
    if (!role) {
      throw new NotFoundError(`Role with ID ${id} not found`);
    }
    return role;
  }

  public async createRole(dto: CreateRoleDto, user: AuthUser): Promise<IRole> {
    const normalizedCode = dto.code.trim().toLowerCase();
    if (normalizedCode === 'super_admin') {
      throw new ForbiddenError(
        'The "super_admin" role is a reserved core role and cannot be created.',
      );
    }

    const existing = await this.repository.findByCode(normalizedCode);
    if (existing) {
      throw new ConflictError(`Role with code "${dto.code}" already exists`);
    }

    const permissions = this.assertPermissionsCanBeGranted(dto.permissions, user);
    const created = await this.repository.create({
      ...dto,
      permissions,
      code: normalizedCode,
      isSystem: false,
      createdBy: user.userId,
    });

    await AuditLogService.log({
      userId: user.userId,
      module: 'role',
      action: 'CREATE',
      entityType: 'Role',
      entityId: created._id.toString(),
      schoolId: user.schoolId,
      newValue: {
        code: created.code,
        nameEn: created.nameEn,
        permissions: created.permissions,
        status: created.status,
      },
    });

    return created;
  }

  public async updateRole(id: string, dto: UpdateRoleDto, user: AuthUser): Promise<IRole> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Role with ID ${id} not found`);
    }

    if (existing.code === 'super_admin') {
      if (!user.permissions.includes('*')) {
        throw new ForbiddenError('Only wildcard authority may modify the Super Administrator role');
      }
      if (dto.status === 'inactive' || (dto.permissions && !dto.permissions.includes('*'))) {
        throw new ForbiddenError(
          'The Super Administrator role must remain active with wildcard authority',
        );
      }
    }

    if (existing.isSystem) {
      if (!user.permissions.includes('*')) {
        throw new ForbiddenError('Only wildcard authority may modify a system-defined role.');
      }
      if (dto.status === 'inactive') {
        throw new ForbiddenError(`System-defined role "${existing.nameEn}" cannot be deactivated.`);
      }
    }

    const permissions = dto.permissions
      ? existing.code === 'super_admin'
        ? [
            '*',
            ...this.assertPermissionsCanBeGranted(
              dto.permissions.filter((permission) => permission !== '*'),
              user,
            ),
          ]
        : this.assertPermissionsCanBeGranted(dto.permissions, user)
      : undefined;
    const updated = await this.repository.update(id, {
      ...dto,
      permissions,
      updatedBy: user.userId,
    });

    if (!updated) {
      throw new NotFoundError(`Failed to update role with ID ${id}`);
    }

    await AuditLogService.log({
      userId: user.userId,
      module: 'role',
      action: 'UPDATE',
      entityType: 'Role',
      entityId: id,
      schoolId: user.schoolId,
      oldValue: {
        nameEn: existing.nameEn,
        permissions: existing.permissions,
        status: existing.status,
      },
      newValue: {
        nameEn: updated.nameEn,
        permissions: updated.permissions,
        status: updated.status,
      },
    });

    return updated;
  }

  public async deleteRole(id: string, user: AuthUser): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Role with ID ${id} not found`);
    }

    if (existing.isSystem || existing.code === 'super_admin') {
      throw new ForbiddenError('System-defined roles are protected and cannot be deleted');
    }

    // Check if any active user is currently assigned this role
    const usersCount = await UserModel.countDocuments({
      roles: existing.code,
      isDeleted: false,
    });
    if (usersCount > 0) {
      throw new ForbiddenError(
        `Cannot delete role "${existing.nameEn}" because it is currently assigned to ${usersCount} active user(s). Please reassign those users first.`,
      );
    }

    await this.repository.softDelete(id, user.userId);

    await AuditLogService.log({
      userId: user.userId,
      module: 'role',
      action: 'DELETE',
      entityType: 'Role',
      entityId: id,
      schoolId: user.schoolId,
      oldValue: {
        code: existing.code,
        nameEn: existing.nameEn,
      },
    });
  }

  /**
   * Resolves dynamic permissions for an array of role codes.
   * Wildcard authority is granted only by an active, persisted super_admin role
   * that explicitly contains `*`; a role name alone never grants authority.
   */
  public async resolvePermissionsForRoles(roleCodes: string[]): Promise<string[]> {
    const normalized = roleCodes.map((r) => r.trim().toLowerCase());

    const roles = await this.repository.findByCodes(normalized);
    const permissionSet = new Set<string>();
    const knownPermissions = new Set(ALL_PERMISSION_CODES);

    for (const role of roles) {
      for (const perm of role.permissions) {
        if (perm === '*' && role.code === 'super_admin') {
          permissionSet.add('*');
          continue;
        }
        if (knownPermissions.has(perm)) {
          permissionSet.add(perm);
        }
      }
    }

    return Array.from(permissionSet);
  }
}
