import type { ReactElement } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Button } from "../../shared/components/ui/Button";

const navLinkClass = ({ isActive }: { isActive: boolean }): string =>
  [
    "block rounded-md px-3 py-2 text-sm transition-colors",
    isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100",
  ].join(" ");

/** Summary: Main authenticated application layout. */
export function AdminLayout(): ReactElement {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="grid min-h-screen grid-cols-[240px_1fr]">
        <aside className="border-r border-slate-200 bg-white p-4">
          <div className="mb-8">
            <h1 className="text-lg font-semibold">My Super Template</h1>
            <p className="text-sm text-slate-500">Admin area</p>
          </div>

          <nav className="space-y-1">
            <NavLink to="/" end className={navLinkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/permissions" className={navLinkClass}>
              Permissions
            </NavLink>
          </nav>
        </aside>

        <div className="flex min-w-0 flex-col">
          <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
            <div>
              <h2 className="text-sm font-medium text-slate-500">Welcome back</h2>
              <p className="text-base font-semibold">Admin Dashboard</p>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="secondary" aria-label="Notifications">
                Bell
              </Button>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                A
              </div>
            </div>
          </header>

          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
