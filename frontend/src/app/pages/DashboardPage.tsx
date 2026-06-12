import type { ReactElement } from "react";
import { DataTable } from "../../shared/components/DataTable";
import { Button } from "../../shared/components/ui/Button";
import type { ColumnDef } from "@tanstack/react-table";

type DashboardRow = {
  name: string;
  status: string;
};

const columns: Array<ColumnDef<DashboardRow, unknown>> = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];

const rows: DashboardRow[] = [
  { name: "Template scaffold", status: "Ready" },
  { name: "Phase 2.5", status: "In progress" },
];

/** Summary: Default authenticated landing page. */
export function DashboardPage(): ReactElement {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-slate-600">Base layout and table scaffold.</p>
        </div>

        <Button>Add item</Button>
      </div>

      <DataTable columns={columns} data={rows} pageCount={1} />
    </section>
  );
}
