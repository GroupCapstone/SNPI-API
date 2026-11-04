import type { PermissionDefinition } from '../../constants/permissions';
import { SYSTEM_PERMISSIONS } from '../../constants/permissions';
import type { GroupedPermissions } from './permission.types';

export class PermissionService {
  public getAllPermissions(): PermissionDefinition[] {
    return SYSTEM_PERMISSIONS;
  }

  public getGroupedPermissions(): GroupedPermissions[] {
    const groupMap = new Map<string, PermissionDefinition[]>();

    for (const perm of SYSTEM_PERMISSIONS) {
      if (!groupMap.has(perm.module)) {
        groupMap.set(perm.module, []);
      }
      groupMap.get(perm.module)!.push(perm);
    }

    const formatModuleName = (mod: string) => {
      return mod
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    return Array.from(groupMap.entries()).map(([module, permissions]) => ({
      module,
      moduleName: formatModuleName(module),
      permissions,
    }));
  }
}
