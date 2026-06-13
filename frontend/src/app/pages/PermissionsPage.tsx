import type { ReactElement } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../shared/components/DataTable";
import { Button } from "../../shared/components/ui/Button";

type PermissionRow = {
  key: string;
  name: string;
};

const columns: Array<ColumnDef<PermissionRow, unknown>> = [
  {
    accessorKey: "key",
    header: "Key",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
];

const rows: PermissionRow[] = [
  { key: "User.Read", name: "Read users" },
  { key: "User.Create", name: "Create users" },
];

/** Summary: Permission management scaffold page. */
export function PermissionsPage(): ReactElement {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Permissions</h1>
          <p className="text-sm text-muted-foreground">Scaffold for permission protected routes.</p>
        </div>

        <Button variant="secondary">Refresh</Button>
      </div>

      <DataTable columns={columns} data={rows} pageCount={1} />
    </section>
  );
}
