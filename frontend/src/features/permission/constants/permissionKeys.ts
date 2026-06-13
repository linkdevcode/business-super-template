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
  File: {
    Read: "File.Read",
    Create: "File.Create",
    Update: "File.Update",
    Delete: "File.Delete",
  },
  SystemSetting: {
    Read: "SystemSetting.Read",
    Update: "SystemSetting.Update",
  },
  AuditLog: {
    Read: "AuditLog.Read",
  },
} as const;

export type PermissionKey =
  | typeof PERMISSION_KEYS.Role.Read
  | typeof PERMISSION_KEYS.Role.Create
  | typeof PERMISSION_KEYS.Role.Update
  | typeof PERMISSION_KEYS.Role.Delete
  | typeof PERMISSION_KEYS.Permission.Read
  | typeof PERMISSION_KEYS.File.Read
  | typeof PERMISSION_KEYS.File.Create
  | typeof PERMISSION_KEYS.File.Update
  | typeof PERMISSION_KEYS.File.Delete
  | typeof PERMISSION_KEYS.SystemSetting.Read
  | typeof PERMISSION_KEYS.SystemSetting.Update
  | typeof PERMISSION_KEYS.AuditLog.Read;
