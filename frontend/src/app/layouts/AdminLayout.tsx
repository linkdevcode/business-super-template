import { useMemo, useState, type ReactElement } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { HasPermission, useCurrentUser } from "../../features/auth";
import { NotificationBell } from "../../features/notification";
import { PERMISSION_KEYS } from "../../features/permission";
import { ThemeToggle } from "../../shared/components/ThemeToggle";

type NavigationItem = {
  label: string;
  to: string;
  permission?: string;
  group: string;
  shortLabel: string;
};

const navigationItems: NavigationItem[] = [
  { label: "Dashboard", to: "/", group: "Overview", shortLabel: "D" },
  {
    label: "Roles",
    to: "/roles",
    permission: PERMISSION_KEYS.Role.Read,
    group: "Administration",
    shortLabel: "R",
  },
  {
    label: "Permissions",
    to: "/permissions",
    permission: PERMISSION_KEYS.Permission.Read,
    group: "Administration",
    shortLabel: "P",
  },
  {
    label: "System Settings",
    to: "/system-settings",
    permission: PERMISSION_KEYS.SystemSetting.Read,
    group: "Operations",
    shortLabel: "S",
  },
  {
    label: "Audit Logs",
    to: "/audit-logs",
    permission: PERMISSION_KEYS.AuditLog.Read,
    group: "Operations",
    shortLabel: "A",
  },
];

const routeLabels: Record<string, string> = {
  "": "Dashboard",
  roles: "Roles",
  permissions: "Permissions",
  "system-settings": "System Settings",
  "audit-logs": "Audit Logs",
};

function navLinkClass(isActive: boolean, isCollapsed: boolean): string {
  return [
    "group flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar",
    isActive
      ? "border-sidebar-primary/20 bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
      : "border-transparent text-sidebar-foreground hover:border-sidebar-border hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
    isCollapsed ? "justify-center px-2" : "justify-start",
  ].join(" ");
}

function getBreadcrumbSegments(pathname: string): Array<{ label: string; to: string }> {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return [{ label: "Dashboard", to: "/" }];
  }

  const items: Array<{ label: string; to: string }> = [{ label: "Dashboard", to: "/" }];
  let currentPath = "";

  for (const segment of segments) {
    currentPath += `/${segment}`;
    items.push({
      label: routeLabels[segment] ?? segment,
      to: currentPath,
    });
  }

  return items;
}

/** Summary: Main authenticated application layout. */
export function AdminLayout(): ReactElement {
  const { currentUser } = useCurrentUser();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const avatarLabel = currentUser?.fullName?.trim().charAt(0).toUpperCase() || "A";
  const breadcrumbItems = useMemo(() => getBreadcrumbSegments(location.pathname), [location.pathname]);
  const visibleGroups = useMemo(() => {
    const groups = new Map<string, NavigationItem[]>();

    for (const item of navigationItems) {
      if (item.permission) {
        continue;
      }
      if (!groups.has(item.group)) {
        groups.set(item.group, []);
      }
      groups.get(item.group)?.push(item);
    }

    return groups;
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[auto_1fr]">
        <aside
          className={[
            "sticky top-0 hidden h-screen border-r border-sidebar-border bg-sidebar/95 px-3 py-4 text-sidebar-foreground shadow-[0_10px_40px_-24px_rgba(15,23,42,0.3)] backdrop-blur-xl lg:block",
            "transition-[width] duration-300 ease-out",
            isSidebarCollapsed ? "w-20" : "w-80",
          ].join(" ")}
        >
          <div className="mb-6 flex items-center justify-between gap-3">
            <div className={["min-w-0", isSidebarCollapsed ? "hidden" : "block"].join(" ")}>
              <h1 className="truncate text-lg font-semibold text-foreground">My Super Template</h1>
              <p className="text-xs text-muted-foreground">Premium admin shell</p>
            </div>
            <button
              type="button"
              aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              onClick={() => setIsSidebarCollapsed((value) => !value)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-sidebar-border bg-sidebar text-sidebar-foreground shadow-sm transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <span className="text-lg leading-none">{isSidebarCollapsed ? "→" : "←"}</span>
            </button>
          </div>

          <nav className="space-y-5">
            {Array.from(visibleGroups.entries()).map(([groupName, items]) => (
              <div key={groupName} className="space-y-2">
                <div
                  className={["px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground", isSidebarCollapsed ? "sr-only" : ""]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {groupName}
                </div>
                <div className="space-y-1">
                  {items.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === "/"}
                      className={({ isActive }) => navLinkClass(isActive, isSidebarCollapsed)}
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-sidebar-border bg-sidebar-accent text-xs font-semibold text-sidebar-accent-foreground">
                        {item.shortLabel}
                      </span>
                      <span className={isSidebarCollapsed ? "sr-only" : "truncate"}>{item.label}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}

            <div className="space-y-2">
              <div
                className={["px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground", isSidebarCollapsed ? "sr-only" : ""]
                  .filter(Boolean)
                  .join(" ")}
              >
                Administration
              </div>
              <HasPermission permission={PERMISSION_KEYS.Role.Read}>
                <NavLink
                  to="/roles"
                  className={({ isActive }) => navLinkClass(isActive, isSidebarCollapsed)}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-sidebar-border bg-sidebar-accent text-xs font-semibold text-sidebar-accent-foreground">
                    R
                  </span>
                  <span className={isSidebarCollapsed ? "sr-only" : "truncate"}>Roles</span>
                </NavLink>
              </HasPermission>
              <HasPermission permission={PERMISSION_KEYS.Permission.Read}>
                <NavLink
                  to="/permissions"
                  className={({ isActive }) => navLinkClass(isActive, isSidebarCollapsed)}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-sidebar-border bg-sidebar-accent text-xs font-semibold text-sidebar-accent-foreground">
                    P
                  </span>
                  <span className={isSidebarCollapsed ? "sr-only" : "truncate"}>Permissions</span>
                </NavLink>
              </HasPermission>
              <HasPermission permission={PERMISSION_KEYS.SystemSetting.Read}>
                <NavLink
                  to="/system-settings"
                  className={({ isActive }) => navLinkClass(isActive, isSidebarCollapsed)}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-sidebar-border bg-sidebar-accent text-xs font-semibold text-sidebar-accent-foreground">
                    S
                  </span>
                  <span className={isSidebarCollapsed ? "sr-only" : "truncate"}>System Settings</span>
                </NavLink>
              </HasPermission>
              <HasPermission permission={PERMISSION_KEYS.AuditLog.Read}>
                <NavLink
                  to="/audit-logs"
                  className={({ isActive }) => navLinkClass(isActive, isSidebarCollapsed)}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-sidebar-border bg-sidebar-accent text-xs font-semibold text-sidebar-accent-foreground">
                    A
                  </span>
                  <span className={isSidebarCollapsed ? "sr-only" : "truncate"}>Audit Logs</span>
                </NavLink>
              </HasPermission>
            </div>

            <div className="space-y-2">
              <div
                className={["px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground", isSidebarCollapsed ? "sr-only" : ""]
                  .filter(Boolean)
                  .join(" ")}
              >
                Operations
              </div>
              <HasPermission permission={PERMISSION_KEYS.SystemSetting.Read}>
                <NavLink
                  to="/system-settings"
                  className={({ isActive }) => navLinkClass(isActive, isSidebarCollapsed)}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-sidebar-border bg-sidebar-accent text-xs font-semibold text-sidebar-accent-foreground">
                    S
                  </span>
                  <span className={isSidebarCollapsed ? "sr-only" : "truncate"}>System Settings</span>
                </NavLink>
              </HasPermission>
              <HasPermission permission={PERMISSION_KEYS.AuditLog.Read}>
                <NavLink
                  to="/audit-logs"
                  className={({ isActive }) => navLinkClass(isActive, isSidebarCollapsed)}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-sidebar-border bg-sidebar-accent text-xs font-semibold text-sidebar-accent-foreground">
                    A
                  </span>
                  <span className={isSidebarCollapsed ? "sr-only" : "truncate"}>Audit Logs</span>
                </NavLink>
              </HasPermission>
            </div>
          </nav>
        </aside>

        <div className="flex min-w-0 flex-col">
          <header className="sticky top-0 z-30 border-b border-border/70 bg-background/75 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4 px-4 py-4 lg:px-6">
              <div className="min-w-0">
                <nav aria-label="Breadcrumb" className="mb-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  {breadcrumbItems.map((item, index) => (
                    <div key={item.to} className="flex items-center gap-2">
                      {index > 0 ? <span aria-hidden="true">/</span> : null}
                      {index < breadcrumbItems.length - 1 ? (
                        <Link to={item.to} className="transition-colors hover:text-foreground">
                          {item.label}
                        </Link>
                      ) : (
                        <span className="font-medium text-foreground">{item.label}</span>
                      )}
                    </div>
                  ))}
                </nav>
                <h2 className="text-lg font-semibold text-foreground">
                  {breadcrumbItems.at(-1)?.label ?? "Dashboard"}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <ThemeToggle className="hidden sm:inline-flex" />
                <NotificationBell />
                <details className="relative">
                  <summary className="flex list-none items-center gap-3 rounded-full border border-border bg-card px-3 py-1.5 shadow-sm transition-all duration-200 hover:bg-accent hover:text-accent-foreground">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                      {avatarLabel}
                    </div>
                    <div className="hidden text-left sm:block">
                      <p className="text-sm font-medium text-foreground">{currentUser?.fullName ?? "Admin"}</p>
                      <p className="text-xs text-muted-foreground">{currentUser?.email ?? "Signed in user"}</p>
                    </div>
                    <span aria-hidden="true" className="text-xs text-muted-foreground">
                      ▾
                    </span>
                  </summary>

                  <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-border bg-popover p-3 shadow-2xl">
                    <div className="rounded-xl border border-border bg-card p-3">
                      <p className="text-sm font-semibold text-foreground">{currentUser?.fullName ?? "Admin"}</p>
                      <p className="text-xs text-muted-foreground">{currentUser?.email ?? "Signed in user"}</p>
                    </div>
                    <div className="mt-3 grid gap-2">
                      <ThemeToggle className="w-full justify-between rounded-xl" />
                      <Link
                        to="/logout"
                        className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-secondary px-4 text-sm font-medium text-secondary-foreground transition-all duration-200 hover:bg-accent"
                      >
                        Sign out
                      </Link>
                    </div>
                  </div>
                </details>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 lg:px-6 lg:py-8">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
