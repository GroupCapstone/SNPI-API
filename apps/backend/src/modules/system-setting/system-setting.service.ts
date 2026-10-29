import { Types } from 'mongoose';

import { checkBranchAccess } from '../../middleware/branch-access';
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from '../../shared/errors/app-error';
import type { AuthUser } from '../../types/auth';
import { AuditLogService } from '../audit-log/audit-log.service';
import { BranchModel } from '../branch/branch.model';
import { SchoolModel } from '../school/school.model';
import type { ISystemSetting, SettingType } from './system-setting.model';
import { SystemSettingRepository } from './system-setting.repository';
import type {
  CreateSystemSettingDTO,
  PaginatedSystemSettings,
  SystemSettingQueryFilters,
  UpdateSystemSettingDTO,
} from './system-setting.types';

const DISALLOWED_SETTING_KEYS = [
  'PASSWORD',
  'SECRET',
  'API_SECRET',
  'API_TOKEN',
  'JWT_SECRET',
  'PRIVATE_KEY',
  'COOKIE_SECRET',
];

const SECRET_KEY_PATTERN = /(?:secret|token|password|credential|private[-_]?key|api[-_]?key)/i;
export const isSecretSettingKey = (key: string): boolean => SECRET_KEY_PATTERN.test(key);
export const MASKED_SECRET_VALUE = '••••••••••••••••';

const maskSettingIfSecret = <T extends ISystemSetting>(setting: T): T => {
  if (
    setting &&
    isSecretSettingKey(setting.key) &&
    typeof setting.value === 'string' &&
    setting.value.length > 0
  ) {
    const cloned =
      typeof (setting as { toObject?: () => Record<string, unknown> }).toObject === 'function'
        ? (setting as { toObject: () => Record<string, unknown> }).toObject()
        : { ...setting };
    cloned.value = MASKED_SECRET_VALUE;
    return cloned as T;
  }
  return setting;
};

const canAccessSchool = (user: AuthUser, schoolId: string): boolean =>
  user.permissions.includes('*') || user.schoolId === schoolId;

const validateSettingValueType = (value: unknown, type: SettingType): void => {
  switch (type) {
    case 'number': {
      if (typeof value !== 'number' || Number.isNaN(value)) {
        throw new BadRequestError(`Setting value does not match declared type: ${type}`);
      }
      break;
    }
    case 'boolean': {
      if (typeof value !== 'boolean') {
        throw new BadRequestError(`Setting value does not match declared type: ${type}`);
      }
      break;
    }
    case 'string': {
      if (typeof value !== 'string') {
        throw new BadRequestError(`Setting value does not match declared type: ${type}`);
      }
      break;
    }
    case 'json': {
      if (typeof value !== 'object' || value === null) {
        throw new BadRequestError(`Setting value does not match declared type: ${type}`);
      }
      break;
    }
    default:
      break;
  }
};

export class SystemSettingService {
  public constructor(private readonly repository = new SystemSettingRepository()) {}

  public async getSettings(
    filters: SystemSettingQueryFilters = {},
    user: AuthUser,
  ): Promise<PaginatedSystemSettings> {
    const scopedFilters = { ...filters };
    if (scopedFilters.schoolId && !canAccessSchool(user, scopedFilters.schoolId)) {
      throw new ForbiddenError('You do not have access to settings for this school');
    }
    if (!scopedFilters.schoolId) {
      scopedFilters.schoolId = user.schoolId;
    }

    if (
      scopedFilters.branchId &&
      scopedFilters.branchId !== 'central' &&
      scopedFilters.branchId !== 'null' &&
      !checkBranchAccess(user.branchAccess, scopedFilters.branchId)
    ) {
      throw new ForbiddenError('You do not have access to settings for this branch');
    }

    const result = await this.repository.findMany(scopedFilters);
    return {
      ...result,
      data: result.data.map((s) => maskSettingIfSecret(s)),
    };
  }

  public async getSettingById(id: string, user: AuthUser): Promise<ISystemSetting> {
    const setting = await this.repository.findById(id);
    if (!setting) {
      throw new NotFoundError('System setting not found');
    }
    if (!canAccessSchool(user, String(setting.schoolId))) {
      throw new ForbiddenError('You do not have access to this system setting');
    }
    if (setting.branchId && !checkBranchAccess(user.branchAccess, String(setting.branchId))) {
      throw new ForbiddenError('You do not have access to this system setting');
    }
    return maskSettingIfSecret(setting);
  }

  public async createSetting(dto: CreateSystemSettingDTO, user: AuthUser): Promise<ISystemSetting> {
    const keyTrimmed = dto.key.trim();
    const keyUpper = keyTrimmed.toUpperCase();
    if (DISALLOWED_SETTING_KEYS.some((k) => keyUpper.includes(k))) {
      throw new BadRequestError(
        'Secret and sensitive credential keys should be stored in environment variables or deployment secret store',
      );
    }

    const type = dto.type || 'string';
    validateSettingValueType(dto.value, type);

    const schoolId = dto.schoolId || user.schoolId;
    if (!canAccessSchool(user, schoolId)) {
      throw new ForbiddenError('You do not have access to create settings for this school');
    }
    const school = await SchoolModel.findOne({ _id: schoolId, isDeleted: false }).exec();
    if (!school) {
      throw new NotFoundError('School not found');
    }

    if (dto.branchId) {
      if (!checkBranchAccess(user.branchAccess, dto.branchId)) {
        throw new ForbiddenError('You do not have access to create settings in this branch');
      }
      const branch = await BranchModel.findOne({
        _id: dto.branchId,
        schoolId,
        isDeleted: false,
      }).exec();
      if (!branch) {
        throw new NotFoundError('Branch not found in the selected school');
      }
    }

    const existing = await this.repository.findByKey(schoolId, keyTrimmed, dto.branchId);
    if (existing) {
      throw new ConflictError(`Setting with key "${keyTrimmed}" already exists for this scope`);
    }

    const initialHistory = [
      {
        oldValue: undefined,
        newValue: dto.value,
        updatedBy: user.userId,
        timestamp: new Date(),
      },
    ];

    const created = await this.repository.create({
      key: keyTrimmed,
      value: dto.value,
      type,
      category: dto.category || 'general',
      schoolId: new Types.ObjectId(schoolId),
      branchId: dto.branchId ? new Types.ObjectId(dto.branchId) : undefined,
      description: dto.description?.trim(),
      isEditable: dto.isEditable !== undefined ? dto.isEditable : true,
      auditHistory: initialHistory,
      createdBy: user.userId,
      updatedBy: user.userId,
    });

    await AuditLogService.log({
      userId: user.userId,
      schoolId: String(schoolId),
      branchId: dto.branchId ? String(dto.branchId) : undefined,
      module: 'setting',
      action: 'CREATE',
      entityType: 'SystemSetting',
      entityId: String(created._id),
      newValue: {
        key: created.key,
        category: created.category,
        value: isSecretSettingKey(created.key) ? '[REDACTED]' : created.value,
      },
    });

    return maskSettingIfSecret(created);
  }

  public async updateSetting(
    id: string,
    dto: UpdateSystemSettingDTO,
    user: AuthUser,
  ): Promise<ISystemSetting> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError('System setting not found');
    }

    if (!canAccessSchool(user, String(existing.schoolId))) {
      throw new ForbiddenError('You do not have access to update settings for this school');
    }

    if (!existing.isEditable) {
      throw new BadRequestError('This system setting is locked and cannot be modified');
    }

    if (existing.branchId && !checkBranchAccess(user.branchAccess, String(existing.branchId))) {
      throw new ForbiddenError('You do not have access to update settings in this branch');
    }

    const isMaskedValue =
      typeof dto.value === 'string' &&
      (dto.value.includes('••') || dto.value === MASKED_SECRET_VALUE);

    // If updating a secret setting with a masked placeholder, preserve existing secret value
    const finalValue =
      isMaskedValue && isSecretSettingKey(existing.key) ? existing.value : dto.value;

    validateSettingValueType(finalValue, existing.type);

    const oldValue = existing.value;
    existing.value = finalValue;
    if (dto.description !== undefined) {
      existing.description = dto.description.trim();
    }
    existing.updatedBy = user.userId;

    if (!existing.auditHistory) {
      existing.auditHistory = [];
    }
    existing.auditHistory.push({
      oldValue: isSecretSettingKey(existing.key) ? MASKED_SECRET_VALUE : oldValue,
      newValue: isSecretSettingKey(existing.key) ? MASKED_SECRET_VALUE : finalValue,
      updatedBy: user.userId,
      timestamp: new Date(),
    });

    if (typeof (existing as { save?: () => Promise<unknown> }).save === 'function') {
      await (existing as { save: () => Promise<unknown> }).save();
    } else {
      await this.repository.updateById(id, {
        value: existing.value,
        description: existing.description,
        updatedBy: user.userId,
        auditHistory: existing.auditHistory,
      });
    }

    await AuditLogService.log({
      userId: user.userId,
      schoolId: String(existing.schoolId),
      branchId: existing.branchId ? String(existing.branchId) : undefined,
      module: 'setting',
      action: 'UPDATE',
      entityType: 'SystemSetting',
      entityId: id,
      oldValue: { value: isSecretSettingKey(existing.key) ? '[REDACTED]' : oldValue },
      newValue: { value: isSecretSettingKey(existing.key) ? '[REDACTED]' : finalValue },
    });

    return maskSettingIfSecret(existing);
  }

  public async deleteSetting(id: string, user: AuthUser): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError('System setting not found');
    }

    if (!canAccessSchool(user, String(existing.schoolId))) {
      throw new ForbiddenError('You do not have access to delete settings for this school');
    }

    if (!existing.isEditable) {
      throw new BadRequestError('This system setting is locked and cannot be deleted');
    }

    if (existing.branchId && !checkBranchAccess(user.branchAccess, String(existing.branchId))) {
      throw new ForbiddenError('You do not have access to delete settings in this branch');
    }

    if (
      typeof (this.repository as { softDelete?: (id: string, userId?: string) => Promise<unknown> })
        .softDelete === 'function'
    ) {
      await (
        this.repository as { softDelete: (id: string, userId?: string) => Promise<unknown> }
      ).softDelete(id, user.userId);
    } else {
      await this.repository.softDeleteById(id, user.userId);
    }

    await AuditLogService.log({
      userId: user.userId,
      schoolId: String(existing.schoolId),
      branchId: existing.branchId ? String(existing.branchId) : undefined,
      module: 'setting',
      action: 'DELETE',
      entityType: 'SystemSetting',
      entityId: id,
      oldValue: { key: existing.key, value: existing.value },
    });
  }

  public async resolveSettingValue<T>(
    key: string,
    schoolId: string,
    branchId?: string,
    defaultValue?: T,
  ): Promise<T> {
    try {
      const setting = await this.repository.resolveEffectiveSetting(schoolId, key, branchId);
      if (setting && setting.value !== undefined && setting.value !== null) {
        return setting.value as T;
      }
      return defaultValue as T;
    } catch {
      return defaultValue as T;
    }
  }

  public static async resolveSettingValue<T>(
    key: string,
    schoolId: string,
    branchId?: string,
    defaultValue?: T,
  ): Promise<T> {
    const service = new SystemSettingService();
    return service.resolveSettingValue(key, schoolId, branchId, defaultValue);
  }
}
