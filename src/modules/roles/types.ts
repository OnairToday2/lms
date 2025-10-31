import { PermissionActions, TPermissionActions } from "@/constants/permission.constant";

export interface ActionOption {
  label: string;
  code: TPermissionActions;
}

export interface PermissionModule {
  id: string;
  name: string;
  actions: ActionOption[];
  // selectedActions: TPermissionActions[];
}

export interface RoleFormData {
  id: string;
  name: string;
  description: string;
  // selectedPermissions: Set<string> // Set of `${moduleId}_${permCode}`
  // originalSelectedPermissions: Set<string>; // For tracking changes
  selectedPermissions: Map<string, Set<TPermissionActions>>; // Map of moduleId to Set of permCodes
  originalSelectedPermissions: Map<string, Set<TPermissionActions>>; // For tracking changes
  modules: Record<string, PermissionModule>
}

export const ACTION_OPTIONS = [
   { label: "Xem", code: PermissionActions.READ },
   { label: "Thêm", code: PermissionActions.CREATE },
   { label: "Chỉnh sửa", code: PermissionActions.UPDATE },
   { label: "Xoá", code: PermissionActions.DELETE },
]


