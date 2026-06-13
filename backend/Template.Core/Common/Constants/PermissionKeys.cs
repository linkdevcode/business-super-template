namespace Template.Core.Common.Constants;

/// <summary>Centralized permission key constants for the platform.</summary>
public static class PermissionKeys
{
    /// <summary>Role-related permissions.</summary>
    public static class Role
    {
        /// <summary>Permission to view role lists and role details.</summary>
        public const string Read = "Role.Read";

        /// <summary>Permission to create roles.</summary>
        public const string Create = "Role.Create";

        /// <summary>Permission to update roles.</summary>
        public const string Update = "Role.Update";

        /// <summary>Permission to delete roles.</summary>
        public const string Delete = "Role.Delete";
    }

    /// <summary>Permission-related permissions.</summary>
    public static class Permission
    {
        /// <summary>Permission to view the permission catalog.</summary>
        public const string Read = "Permission.Read";
    }

    /// <summary>File-related permissions.</summary>
    public static class File
    {
        /// <summary>Permission to view file metadata.</summary>
        public const string Read = "File.Read";

        /// <summary>Permission to upload files.</summary>
        public const string Create = "File.Create";

        /// <summary>Permission to update file metadata.</summary>
        public const string Update = "File.Update";

        /// <summary>Permission to delete files.</summary>
        public const string Delete = "File.Delete";
    }

    /// <summary>System setting permissions.</summary>
    public static class SystemSetting
    {
        /// <summary>Permission to view system settings.</summary>
        public const string Read = "SystemSetting.Read";

        /// <summary>Permission to update system settings.</summary>
        public const string Update = "SystemSetting.Update";
    }

    /// <summary>Audit log permissions.</summary>
    public static class AuditLog
    {
        /// <summary>Permission to view audit logs.</summary>
        public const string Read = "AuditLog.Read";
    }
}
