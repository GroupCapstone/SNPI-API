import type { PermissionDefinition } from '../../constants/permissions';

export interface GroupedPermissions {
  module: string;
  moduleName: string;
  permissions: PermissionDefinition[];
}
