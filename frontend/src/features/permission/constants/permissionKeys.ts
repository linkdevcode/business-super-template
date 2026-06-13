export const PERMISSION_KEYS = {
  Role: {
    Read: "Role.Read",
    Create: "Role.Create",
    Update: "Role.Update",
    Delete: "Role.Delete",
  },
  Permission: {
    Read: "Permission.Read",
  },
} as const;

export type PermissionKey =
  | typeof PERMISSION_KEYS.Role.Read
  | typeof PERMISSION_KEYS.Role.Create
  | typeof PERMISSION_KEYS.Role.Update
  | typeof PERMISSION_KEYS.Role.Delete
  | typeof PERMISSION_KEYS.Permission.Read;
