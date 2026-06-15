import { useMemo, type ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { DataTable } from "../../shared/components/DataTable";
import { Button } from "../../shared/components/ui/Button";
import type { ColumnDef } from "@tanstack/react-table";

type DashboardRow = {
  name: string;
  status: string;
};

/** Summary: Default authenticated landing page. */
export function DashboardPage(): ReactElement {
  const { t } = useTranslation();

  const columns: Array<ColumnDef<DashboardRow, unknown>> = useMemo(
    () => [
      {
        accessorKey: "name",
        header: t("common.name"),
      },
      {
        accessorKey: "status",
        header: t("common.status"),
      },
    ],
    [t],
  );

  const rows: DashboardRow[] = useMemo(
    () => [
      { name: t("dashboard.rows.templateScaffold"), status: t("dashboard.rows.ready") },
      { name: t("dashboard.rows.phase25"), status: t("dashboard.rows.inProgress") },
    ],
    [t],
  );

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{t("dashboard.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("dashboard.description")}</p>
        </div>

        <Button>{t("dashboard.addItem")}</Button>
      </div>

      <DataTable columns={columns} data={rows} pageCount={1} />
    </section>
  );
}
