import type { LucideIcon } from "lucide-react";
import { FileClock, KeyRound, LayoutDashboard, Settings2, Shield, Users, type LucideProps } from "lucide-react";
import { PERMISSION_KEYS } from "../../../features/permission";

export const NAV_ICON_SIZE = 18;
export const NAV_ICON_STROKE = 1.75;

export type NavIconProps = LucideProps;

export type NavGroup = "overview" | "administration" | "operations";

export type NavigationItem = {
  labelKey: string;
  to: string;
  permission?: string;
  group: NavGroup;
  icon: LucideIcon;
};

export const NAV_GROUP_ORDER: NavGroup[] = ["overview", "administration", "operations"];

export const navigationItems: NavigationItem[] = [
  { labelKey: "nav.dashboard", to: "/", group: "overview", icon: LayoutDashboard },
  {
    labelKey: "nav.roles",
    to: "/roles",
    permission: PERMISSION_KEYS.Role.Read,
    group: "administration",
    icon: Shield,
  },
  {
    labelKey: "nav.users",
    to: "/users",
    permission: PERMISSION_KEYS.User.Read,
    group: "administration",
    icon: Users,
  },
  {
    labelKey: "nav.permissions",
    to: "/permissions",
    permission: PERMISSION_KEYS.Permission.Read,
    group: "administration",
    icon: KeyRound,
  },
  {
    labelKey: "nav.systemSettings",
    to: "/system-settings",
    permission: PERMISSION_KEYS.SystemSetting.Read,
    group: "operations",
    icon: Settings2,
  },
  {
    labelKey: "nav.auditLogs",
    to: "/audit-logs",
    permission: PERMISSION_KEYS.AuditLog.Read,
    group: "operations",
    icon: FileClock,
  },
];

export const routeLabelKeys: Record<string, string> = {
  "": "nav.dashboard",
  roles: "nav.roles",
  users: "nav.users",
  permissions: "nav.permissions",
  profile: "nav.profile",
  "system-settings": "nav.systemSettings",
  "audit-logs": "nav.auditLogs",
};
