import { Types } from 'mongoose';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { checkUserPermission } from '../src/middleware/authorize';
import { BranchModel } from '../src/modules/branch/branch.model';
import { SchoolModel } from '../src/modules/school/school.model';
import { SystemSettingService } from '../src/modules/system-setting/system-setting.service';
import type { AuthUser } from '../src/types/auth';

vi.mock('../src/modules/audit-log/audit-log.service', () => ({
  AuditLogService: class {
    public static log = vi.fn().mockResolvedValue(undefined);
  },
}));

const schoolId = new Types.ObjectId().toString();
const branchId = new Types.ObjectId().toString();
const user: AuthUser = {
  userId: new Types.ObjectId().toString(),
  username: 'super_admin',
  email: 'admin@snp.edu.kh',
  schoolId,
  roles: ['super_admin'],
  permissions: ['*'],
  branchAccess: [branchId],
};

describe('Dynamic System Settings', () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => vi.restoreAllMocks());

  it('protects the API when setting permission is absent', async () => {
    expect(
      checkUserPermission(['student.view.own_branch'], 'setting.view.all_branches', ['staff']),
    ).toBe(false);
  });

  it('creates a typed branch setting and starts audit history', async () => {
    const repository = {
      findByKey: vi.fn().mockResolvedValue(null),
      create: vi
        .fn()
        .mockImplementation(async (value) => ({ _id: new Types.ObjectId(), ...value })),
    };
    vi.spyOn(SchoolModel, 'findOne').mockReturnValue({
      exec: vi.fn().mockResolvedValue({ _id: schoolId }),
    } as never);
    vi.spyOn(BranchModel, 'findOne').mockReturnValue({
      exec: vi.fn().mockResolvedValue({ _id: branchId, schoolId }),
    } as never);
    const service = new SystemSettingService(repository as never);
    const result = await service.createSetting(
      {
        key: 'academic.passing_average',
        value: 50,
        type: 'number',
        category: 'academic',
        schoolId,
        branchId,
      },
      user,
    );
    expect(result).toMatchObject({ key: 'academic.passing_average', value: 50 });
    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        schoolId: expect.any(Types.ObjectId),
        branchId: expect.any(Types.ObjectId),
        auditHistory: [expect.objectContaining({ newValue: 50, updatedBy: user.userId })],
      }),
    );
  });

  it('rejects secrets and credentials in ordinary settings records', async () => {
    const service = new SystemSettingService({} as never);
    await expect(
      service.createSetting(
        {
          key: 'notification.telegram.api_token',
          value: 'secret',
          type: 'string',
          category: 'notification',
          schoolId,
        },
        user,
      ),
    ).rejects.toThrow('deployment secret store');
  });

  it('rejects values that do not match the declared setting type', async () => {
    const service = new SystemSettingService({} as never);
    await expect(
      service.createSetting(
        {
          key: 'academic.passing_average',
          value: 'fifty',
          type: 'number',
          category: 'academic',
          schoolId,
        },
        user,
      ),
    ).rejects.toThrow('does not match');
  });

  it('applies branch isolation when listing settings', async () => {
    const repository = { findMany: vi.fn().mockResolvedValue({ data: [], total: 0 }) };
    const service = new SystemSettingService(repository as never);
    await expect(
      service.getSettings({ branchId: new Types.ObjectId().toString() }, user),
    ).rejects.toThrow('do not have access');
    expect(repository.findMany).not.toHaveBeenCalled();
  });

  it('prevents non-global users from crossing the school boundary', async () => {
    const repository = { findMany: vi.fn().mockResolvedValue({ data: [], total: 0 }) };
    const scopedUser: AuthUser = {
      ...user,
      roles: ['branch_manager'],
      permissions: ['setting.view.own_branch'],
      isSuperAdmin: false,
    };
    const service = new SystemSettingService(repository as never);

    await expect(
      service.getSettings({ schoolId: new Types.ObjectId().toString() }, scopedUser),
    ).rejects.toThrow('school');
    expect(repository.findMany).not.toHaveBeenCalled();
  });

  it('rejects a branch that does not belong to the selected school', async () => {
    const repository = { findByKey: vi.fn(), create: vi.fn() };
    vi.spyOn(SchoolModel, 'findOne').mockReturnValue({
      exec: vi.fn().mockResolvedValue({ _id: schoolId }),
    } as never);
    vi.spyOn(BranchModel, 'findOne').mockReturnValue({
      exec: vi.fn().mockResolvedValue(null),
    } as never);
    const service = new SystemSettingService(repository as never);

    await expect(
      service.createSetting(
        {
          key: 'academic.minimum_attendance',
          value: 70,
          type: 'number',
          category: 'academic',
          schoolId,
          branchId,
        },
        user,
      ),
    ).rejects.toThrow('selected school');
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('updates editable settings and appends value history', async () => {
    const setting = {
      _id: new Types.ObjectId(),
      schoolId: new Types.ObjectId(schoolId),
      branchId: new Types.ObjectId(branchId),
      key: 'academic.passing_average',
      value: 50,
      type: 'number',
      category: 'academic',
      isEditable: true,
      auditHistory: [],
      save: vi.fn().mockResolvedValue(undefined),
    };
    const service = new SystemSettingService({
      findById: vi.fn().mockResolvedValue(setting),
    } as never);
    const result = await service.updateSetting(String(setting._id), { value: 60 }, user);
    expect(result.value).toBe(60);
    expect(setting.auditHistory).toEqual([
      expect.objectContaining({ oldValue: 50, newValue: 60, updatedBy: user.userId }),
    ]);
    expect(setting.save).toHaveBeenCalled();
  });

  it('does not allow locked settings to be changed or deleted', async () => {
    const setting = {
      _id: new Types.ObjectId(),
      schoolId: new Types.ObjectId(schoolId),
      key: 'security.session_policy',
      value: 'locked',
      type: 'string',
      category: 'security',
      isEditable: false,
      auditHistory: [],
    };
    const repository = { findById: vi.fn().mockResolvedValue(setting), softDelete: vi.fn() };
    const service = new SystemSettingService(repository as never);
    await expect(
      service.updateSetting(String(setting._id), { value: 'changed' }, user),
    ).rejects.toThrow('locked');
    await expect(service.deleteSetting(String(setting._id), user)).rejects.toThrow('locked');
    expect(repository.softDelete).not.toHaveBeenCalled();
  });

  it('permits School Director with setting permissions to view and update settings', async () => {
    const directorUser: AuthUser = {
      userId: new Types.ObjectId().toString(),
      username: 'director.sok',
      email: 'director@snp.edu.kh',
      schoolId,
      roles: ['director'],
      permissions: ['setting.view.all_branches', 'setting.edit.all_branches'],
      branchAccess: 'all',
    };

    expect(
      checkUserPermission(
        directorUser.permissions,
        'setting.view.all_branches',
        directorUser.roles,
      ),
    ).toBe(true);
    expect(
      checkUserPermission(
        directorUser.permissions,
        'setting.edit.all_branches',
        directorUser.roles,
      ),
    ).toBe(true);

    const setting = {
      _id: new Types.ObjectId(),
      schoolId: new Types.ObjectId(schoolId),
      key: 'FINANCE.EXCHANGE_RATE_USD_KHR',
      value: 4100,
      type: 'number',
      category: 'finance',
      isEditable: true,
      auditHistory: [],
      save: vi.fn().mockResolvedValue(true),
    };
    const repository = {
      findById: vi.fn().mockResolvedValue(setting),
      findMany: vi
        .fn()
        .mockResolvedValue({ data: [setting], total: 1, page: 1, limit: 20, totalPages: 1 }),
    };
    const service = new SystemSettingService(repository as never);

    const queried = await service.getSettings({ category: 'finance' }, directorUser);
    expect(queried.data).toHaveLength(1);

    const updated = await service.updateSetting(String(setting._id), { value: 4150 }, directorUser);
    expect(updated.value).toBe(4150);
  });

  it('hierarchically resolves branch override or falls back to central setting and default', async () => {
    const branchSetting = {
      _id: new Types.ObjectId(),
      schoolId: new Types.ObjectId(schoolId),
      branchId: new Types.ObjectId(branchId),
      key: 'CLASS_DEFAULT_CAPACITY',
      value: 25,
      type: 'number',
      category: 'academic',
    };
    const centralSetting = {
      _id: new Types.ObjectId(),
      schoolId: new Types.ObjectId(schoolId),
      key: 'DEFAULT_CURRENCY',
      value: 'USD',
      type: 'string',
      category: 'finance',
    };

    const repository = {
      resolveEffectiveSetting: vi.fn().mockImplementation((sId, key, bId) => {
        if (key === 'CLASS_DEFAULT_CAPACITY' && bId) return Promise.resolve(branchSetting);
        if (key === 'DEFAULT_CURRENCY') return Promise.resolve(centralSetting);
        return Promise.resolve(null);
      }),
    };
    const service = new SystemSettingService(repository as never);

    // 1. Branch override resolved
    const capacity = await service.resolveSettingValue(
      'CLASS_DEFAULT_CAPACITY',
      schoolId,
      branchId,
      30,
    );
    expect(capacity).toBe(25);

    // 2. Central school fallback
    const currency = await service.resolveSettingValue(
      'DEFAULT_CURRENCY',
      schoolId,
      branchId,
      'KHR',
    );
    expect(currency).toBe('USD');

    // 3. System default fallback
    const fallbackVal = await service.resolveSettingValue('NON_EXISTENT', schoolId, branchId, 999);
    expect(fallbackVal).toBe(999);
  });
});
