import { useState, type ReactElement } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "../../../shared/components/ui/Button";
import {
  Dialog,
  DialogCancel,
  DialogConfirm,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../shared/components/ui/Dialog";
import { DataTable } from "../../../shared/components/DataTable";
import { HasPermission, usePermissions } from "../../permission";
import { PERMISSION_KEYS } from "../../permission/constants/permissionKeys";
import { useCreateRole } from "../hooks/useCreateRole";
import { useDeleteRole } from "../hooks/useDeleteRole";
import { useRole } from "../hooks/useRole";
import { useRoles } from "../hooks/useRoles";
import { useUpdateRole } from "../hooks/useUpdateRole";
import { RoleForm } from "../components/RoleForm";
import type { RoleFormValues } from "../schemas/roleSchema";
import type { RoleListItemDto } from "../types/role";

type DialogMode = "create" | "edit" | null;

export function RolesPage(): ReactElement {
  const [searchValue, setSearchValue] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [deletingRole, setDeletingRole] = useState<RoleListItemDto | null>(null);

  const permissionsQuery = usePermissions();
  const rolesQuery = useRoles({
    pageNumber: pageIndex + 1,
    pageSize,
    searchTerm: searchValue.trim() || undefined,
    sortBy: "name",
    sortDescending: false,
  });
  const selectedRoleQuery = useRole(dialogMode === "edit" ? editingRoleId : null);

  const createRoleMutation = useCreateRole();
  const updateRoleMutation = useUpdateRole();
  const deleteRoleMutation = useDeleteRole();

  const roles = rolesQuery.data?.items ?? [];
  const pageCount = rolesQuery.data?.totalPages ?? 0;
  const permissionGroups = permissionsQuery.data ?? [];

  const openCreateDialog = (): void => {
    setEditingRoleId(null);
    setDialogMode("create");
  };

  const openEditDialog = (roleId: string): void => {
    setEditingRoleId(roleId);
    setDialogMode("edit");
  };

  const closeDialog = (): void => {
    setDialogMode(null);
    setEditingRoleId(null);
  };

  const closeDeleteDialog = (): void => {
    setDeletingRole(null);
  };

  const handleSubmit = async (values: RoleFormValues): Promise<void> => {
    const input = {
      name: values.name.trim(),
      description: values.description?.trim() || undefined,
      permissionIds: values.permissionIds,
    };

    if (dialogMode === "edit" && editingRoleId) {
      await updateRoleMutation.mutateAsync({ id: editingRoleId, input });
    } else {
      await createRoleMutation.mutateAsync(input);
    }

    closeDialog();
  };

  const handleDelete = async (): Promise<void> => {
    if (!deletingRole) {
      return;
    }

    await deleteRoleMutation.mutateAsync(deletingRole.id);
    closeDeleteDialog();
  };

  const columns: Array<ColumnDef<RoleListItemDto, unknown>> = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => row.original.description ?? "-",
    },
    {
      accessorKey: "permissionCount",
      header: "Permissions",
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="text-sm font-medium text-foreground">
            {row.original.permissionCount} permission(s)
          </div>
          {row.original.permissionKeys.length > 0 ? (
            <div className="text-xs text-muted-foreground">{row.original.permissionKeys.join(", ")}</div>
          ) : (
            <div className="text-xs text-muted-foreground">No permissions</div>
          )}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <HasPermission permission={PERMISSION_KEYS.Role.Update}>
            <Button variant="secondary" onClick={() => openEditDialog(row.original.id)}>
              Edit
            </Button>
          </HasPermission>
          <HasPermission permission={PERMISSION_KEYS.Role.Delete}>
            <Button variant="danger" onClick={() => setDeletingRole(row.original)}>
              Delete
            </Button>
          </HasPermission>
        </div>
      ),
    },
  ];

  const defaultValues = selectedRoleQuery.data
    ? {
        name: selectedRoleQuery.data.name,
        description: selectedRoleQuery.data.description ?? "",
        permissionIds: selectedRoleQuery.data.permissionIds,
      }
    : undefined;

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Roles</h1>
          <p className="text-sm text-muted-foreground">Manage RBAC roles and assign permissions.</p>
        </div>

        <HasPermission permission={PERMISSION_KEYS.Role.Create}>
          <Button onClick={openCreateDialog}>Add Role</Button>
        </HasPermission>
      </div>

      <DataTable
        columns={columns}
        data={roles}
        isLoading={rolesQuery.isLoading}
        searchValue={searchValue}
        onSearchValueChange={(value) => {
          setSearchValue(value);
          setPageIndex(0);
        }}
        pageIndex={pageIndex}
        pageSize={pageSize}
        pageCount={pageCount}
        onPageIndexChange={setPageIndex}
        onPageSizeChange={(nextPageSize) => {
          setPageSize(nextPageSize);
          setPageIndex(0);
        }}
        emptyTitle="No roles found"
        emptyDescription="Try changing the search term or create a new role."
      />

      <Dialog open={dialogMode !== null} onOpenChange={(open) => (!open ? closeDialog() : undefined)}>
        {dialogMode ? (
          selectedRoleQuery.isLoading && dialogMode === "edit" ? (
            <div className="space-y-2">
              <DialogHeader>
                <DialogTitle>Loading role...</DialogTitle>
                <DialogDescription>Please wait while we load role data.</DialogDescription>
              </DialogHeader>
            </div>
          ) : (
            <div className="space-y-2">
              <DialogHeader>
                <DialogTitle>{dialogMode === "create" ? "Create Role" : "Edit Role"}</DialogTitle>
                <DialogDescription>
                  Configure the role information and assign permissions.
                </DialogDescription>
              </DialogHeader>

              <RoleForm
                key={dialogMode === "edit" ? editingRoleId ?? "edit" : "create"}
                defaultValues={defaultValues}
                permissionGroups={permissionGroups}
                isSubmitting={createRoleMutation.isPending || updateRoleMutation.isPending}
                submitLabel={dialogMode === "create" ? "Create Role" : "Save Changes"}
                onSubmit={handleSubmit}
              />
            </div>
          )
        ) : null}
      </Dialog>

      <Dialog open={deletingRole !== null} onOpenChange={(open) => (!open ? closeDeleteDialog() : undefined)}>
        {deletingRole ? (
          <div>
            <DialogHeader>
              <DialogTitle>Delete role</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete <strong>{deletingRole.name}</strong>?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogCancel onClick={closeDeleteDialog}>Cancel</DialogCancel>
              <DialogConfirm onClick={handleDelete}>Delete</DialogConfirm>
            </DialogFooter>
          </div>
        ) : null}
      </Dialog>
    </section>
  );
}
