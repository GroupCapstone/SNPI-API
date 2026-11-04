import type { ISystemSetting, SettingCategory, SettingType } from './system-setting.model';

export interface CreateSystemSettingDTO {
  key: string;
  value: unknown;
  type?: SettingType;
  category?: SettingCategory;
  schoolId?: string;
  branchId?: string;
  description?: string;
  isEditable?: boolean;
}

export interface UpdateSystemSettingDTO {
  value: unknown;
  description?: string;
}

export interface SystemSettingQueryFilters {
  category?: SettingCategory;
  branchId?: string;
  schoolId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedSystemSettings {
  data: ISystemSetting[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
