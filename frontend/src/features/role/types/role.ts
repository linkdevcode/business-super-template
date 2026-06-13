export interface RoleListItemDto {
  id: string;
  name: string;
  description: string | null;
  permissionCount: number;
  permissionKeys: string[];
}

export interface RoleDetailDto {
  id: string;
  name: string;
  description: string | null;
  permissionIds: string[];
  permissionKeys: string[];
}

export interface CreateRoleInput {
  name: string;
  description?: string;
  permissionIds: string[];
}

export type UpdateRoleInput = CreateRoleInput;
