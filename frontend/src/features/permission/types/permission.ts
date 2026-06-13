export interface PermissionDto {
  id: string;
  group: string;
  key: string;
  name: string;
  description: string | null;
}

export interface PermissionGroupDto {
  group: string;
  permissions: PermissionDto[];
}
