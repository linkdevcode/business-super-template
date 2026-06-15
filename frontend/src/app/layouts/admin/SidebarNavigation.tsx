import type { ReactElement } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "../../../lib/utils";
import { SimpleTooltip } from "../../../shared/components/ui/Tooltip";
import {
  NAV_ICON_SIZE,
  NAV_ICON_STROKE,
  type NavGroup,
  type NavigationItem,
} from "./navigation";

type SidebarNavItemProps = {
  item: NavigationItem;
  isCollapsed: boolean;
  label: string;
  onNavigate?: () => void;
};

function SidebarNavItem({ item, isCollapsed, label, onNavigate }: SidebarNavItemProps): ReactElement {
  const Icon = item.icon;

  const link = (
    <NavLink
      to={item.to}
      end={item.to === "/"}
      onClick={() => onNavigate?.()}
      className={({ isActive }) =>
        cn(
          "group relative flex items-center text-sm transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar",
          isCollapsed
            ? cn(
                "mx-auto h-10 w-10 justify-center rounded-full",
                isActive
                  ? "bg-secondary text-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted/70 hover:text-foreground hover:shadow-md",
              )
            : cn(
                "gap-3 rounded-lg px-3 py-2.5",
                isActive
                  ? "bg-secondary font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              ),
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && !isCollapsed ? (
            <span
              aria-hidden="true"
              className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary"
            />
          ) : null}
          <Icon
            size={NAV_ICON_SIZE}
            strokeWidth={NAV_ICON_STROKE}
            className={cn(
              "shrink-0 transition-colors",
              isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground",
            )}
            aria-hidden="true"
          />
          {isCollapsed ? null : <span className="truncate">{label}</span>}
        </>
      )}
    </NavLink>
  );

  return (
    <SimpleTooltip label={label} disabled={!isCollapsed}>
      <div className={cn(isCollapsed && "flex justify-center")}>{link}</div>
    </SimpleTooltip>
  );
}

export type SidebarNavigationProps = {
  visibleGroups: ReadonlyArray<readonly [NavGroup, NavigationItem[]]>;
  isCollapsed: boolean;
  translate: (key: string) => string;
  onNavigate?: () => void;
};

/** Summary: Shared sidebar navigation list for desktop and mobile drawer. */
export function SidebarNavigation({
  visibleGroups,
  isCollapsed,
  translate,
  onNavigate,
}: SidebarNavigationProps): ReactElement {
  return (
    <nav className={cn("space-y-6", isCollapsed ? "px-1.5 py-4" : "px-2 py-4")}>
      {visibleGroups.map(([groupName, items]) => (
        <div key={groupName}>
          <div
            className={cn(
              "mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70",
              isCollapsed && "sr-only",
            )}
          >
            {translate(`nav.groups.${groupName}`)}
          </div>
          <div className={cn("space-y-1", isCollapsed && "flex flex-col items-center")}>
            {items.map((item) => (
              <SidebarNavItem
                key={item.to}
                item={item}
                isCollapsed={isCollapsed}
                label={translate(item.labelKey)}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}
