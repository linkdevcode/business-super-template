import type { ReactElement } from "react";
import { usePermissions } from "../hooks/usePermissions";

/** Summary: Shows the grouped permission catalog. */
export function PermissionsPage(): ReactElement {
  const { data, isLoading, isError } = usePermissions();

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Permissions</h1>
        <p className="text-sm text-slate-600">Grouped permission catalog used by role assignments.</p>
      </div>

      {isLoading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500">
          Loading permissions...
        </div>
      ) : isError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          Failed to load permissions.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {data?.map((group) => (
            <div key={group.group} className="rounded-lg border border-slate-200 bg-white p-4">
              <h2 className="mb-3 text-base font-semibold">{group.group}</h2>
              <div className="space-y-2">
                {group.permissions.map((permission) => (
                  <div key={permission.id} className="rounded-md border border-slate-100 bg-slate-50 p-3">
                    <div className="text-sm font-medium text-slate-900">{permission.name}</div>
                    <div className="text-xs text-slate-500">{permission.key}</div>
                    {permission.description ? (
                      <div className="mt-1 text-xs text-slate-600">{permission.description}</div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
