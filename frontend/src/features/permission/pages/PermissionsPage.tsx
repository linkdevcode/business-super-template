import type { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { usePermissions } from "../hooks/usePermissions";

/** Summary: Shows the grouped permission catalog. */
export function PermissionsPage(): ReactElement {
  const { t } = useTranslation();
  const { data, isLoading, isError } = usePermissions();

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{t("permissions.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("permissions.description")}</p>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground shadow-sm">
          {t("permissions.loading")}
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-6 text-sm text-destructive">
          {t("permissions.loadFailed")}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {data?.map((group) => (
            <div key={group.group} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
              <h2 className="mb-3 text-base font-semibold">{group.group}</h2>
              <div className="space-y-2">
                {group.permissions.map((permission) => (
                  <div key={permission.id} className="rounded-xl border border-border bg-muted/40 p-3">
                    <div className="text-sm font-medium text-foreground">{permission.name}</div>
                    <div className="text-xs text-muted-foreground">{permission.key}</div>
                    {permission.description ? (
                      <div className="mt-1 text-xs text-muted-foreground">{permission.description}</div>
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
