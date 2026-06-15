import { useEffect, useMemo, useState, type ReactElement } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { useCurrentUser, usePermission } from "../../features/auth";
import { NotificationBell } from "../../features/notification";
import { LanguageSwitcher } from "../../shared/components/LanguageSwitcher";
import { ThemeToggle } from "../../shared/components/ThemeToggle";
import { UserProfileMenu } from "../../shared/components/UserProfileMenu";
import { useSidebarCollapsed } from "../../shared/hooks/useSidebarCollapsed";
import { cn } from "../../lib/utils";
import { MobileNavDrawer } from "./admin/MobileNavDrawer";
import { SidebarNavigation } from "./admin/SidebarNavigation";
import {
  NAV_GROUP_ORDER,
  navigationItems,
  routeLabelKeys,
  type NavGroup,
  type NavigationItem,
} from "./admin/navigation";

function getBreadcrumbSegments(
  pathname: string,
  translate: (key: string) => string,
): Array<{ label: string; to: string }> {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return [{ label: translate("nav.dashboard"), to: "/" }];
  }

  const items: Array<{ label: string; to: string }> = [{ label: translate("nav.dashboard"), to: "/" }];
  let currentPath = "";

  for (const segment of segments) {
    currentPath += `/${segment}`;
    const labelKey = routeLabelKeys[segment];
    items.push({
      label: labelKey ? translate(labelKey) : segment,
      to: currentPath,
    });
  }

  return items;
}

/** Summary: Main authenticated application layout. */
export function AdminLayout(): ReactElement {
  const { t } = useTranslation();
  const { currentUser } = useCurrentUser();
  const { hasPermission } = usePermission();
  const location = useLocation();
  const { isCollapsed, toggleCollapsed } = useSidebarCollapsed();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const avatarLabel = currentUser?.fullName?.trim().charAt(0).toUpperCase() || "A";
  const pageTitle = useMemo(() => {
    const segments = getBreadcrumbSegments(location.pathname, t);
    return segments.at(-1)?.label ?? t("nav.dashboard");
  }, [location.pathname, t]);

  const breadcrumbItems = useMemo(
    () => getBreadcrumbSegments(location.pathname, t),
    [location.pathname, t],
  );

  const visibleGroups = useMemo(() => {
    const groups = new Map<NavGroup, NavigationItem[]>();

    for (const item of navigationItems) {
      if (item.permission && !hasPermission(item.permission)) {
        continue;
      }

      if (!groups.has(item.group)) {
        groups.set(item.group, []);
      }

      groups.get(item.group)?.push(item);
    }

    return NAV_GROUP_ORDER
      .filter((group) => groups.has(group))
      .map((group) => [group, groups.get(group)!] as const);
  }, [hasPermission]);

  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [location.pathname]);

  const closeMobileNav = (): void => {
    setIsMobileNavOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <MobileNavDrawer
        open={isMobileNavOpen}
        onClose={closeMobileNav}
        title={t("common.appName")}
        subtitle={t("common.appSubtitle")}
        footer={
          <div className="flex items-center justify-between gap-3">
            <LanguageSwitcher className="flex-1 justify-center" />
            <ThemeToggle />
          </div>
        }
      >
        <SidebarNavigation
          visibleGroups={visibleGroups}
          isCollapsed={false}
          translate={t}
          onNavigate={closeMobileNav}
        />
      </MobileNavDrawer>

      <div className="grid min-h-screen lg:grid-cols-[auto_1fr]">
        <aside
          className={cn(
            "sticky top-0 hidden h-screen flex-col border-r border-border/40 bg-sidebar lg:flex",
            "transition-[width] duration-300 ease-out",
            isCollapsed ? "w-[4.75rem]" : "w-64",
          )}
        >
          <div
            className={cn(
              "relative flex shrink-0 items-center border-b border-border/40",
              isCollapsed ? "flex-col gap-3 px-2 py-4" : "justify-between gap-3 px-4 py-4",
            )}
          >
            {isCollapsed ? (
              <div
                aria-hidden="true"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-sm font-semibold text-secondary-foreground"
              >
                {t("common.appName").charAt(0)}
              </div>
            ) : (
              <div className="min-w-0 flex-1">
                <h1 className="truncate text-base font-semibold tracking-tight text-foreground">
                  {t("common.appName")}
                </h1>
                <p className="truncate text-xs text-muted-foreground">{t("common.appSubtitle")}</p>
              </div>
            )}

            <button
              type="button"
              aria-label={isCollapsed ? t("layout.expandSidebar") : t("layout.collapseSidebar")}
              onClick={toggleCollapsed}
              className={cn(
                "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/60",
                "bg-background/60 text-muted-foreground transition-all duration-200",
                "hover:bg-muted/60 hover:text-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar",
              )}
            >
              {isCollapsed ? (
                <ChevronRight size={16} strokeWidth={1.75} aria-hidden="true" />
              ) : (
                <ChevronLeft size={16} strokeWidth={1.75} aria-hidden="true" />
              )}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <SidebarNavigation visibleGroups={visibleGroups} isCollapsed={isCollapsed} translate={t} />
          </div>
        </aside>

        <div className="flex min-w-0 flex-col">
          <header className="sticky top-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-2 px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3 lg:px-6">
              <button
                type="button"
                aria-label={t("layout.openNavigation")}
                aria-expanded={isMobileNavOpen}
                onClick={() => setIsMobileNavOpen(true)}
                className={cn(
                  "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border/60 lg:hidden",
                  "bg-card/80 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                )}
              >
                <Menu size={20} strokeWidth={1.75} aria-hidden="true" />
              </button>

              <div className="min-w-0 flex-1">
                <nav
                  aria-label={t("layout.breadcrumb")}
                  className="mb-0.5 hidden flex-wrap items-center gap-1.5 text-xs text-muted-foreground md:flex"
                >
                  {breadcrumbItems.map((item, index) => (
                    <div key={item.to} className="flex items-center gap-1.5">
                      {index > 0 ? <span aria-hidden="true" className="text-muted-foreground/50">/</span> : null}
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
                <h2 className="truncate text-sm font-semibold tracking-tight text-foreground sm:text-base">
                  {pageTitle}
                </h2>
              </div>

              <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                <LanguageSwitcher className="hidden lg:inline-flex" />
                <ThemeToggle className="hidden lg:inline-flex" />
                <NotificationBell />
                <UserProfileMenu
                  avatarLabel={avatarLabel}
                  avatarUrl={currentUser?.avatarUrl}
                  fullName={currentUser?.fullName}
                  email={currentUser?.email}
                />
              </div>
            </div>
          </header>

          <main className="flex-1 px-3 py-4 sm:px-4 sm:py-6 lg:px-6 lg:py-8">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
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
