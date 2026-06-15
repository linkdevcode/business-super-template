import { useMemo, useState, type ReactElement } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { Button } from "../../../shared/components/ui/Button";
import { DataTable } from "../../../shared/components/DataTable";
import { HasPermission, PERMISSION_KEYS } from "../../permission";
import { AssignRolesDialog } from "../components/AssignRolesDialog";
import { UserStatusBadge } from "../components/UserStatusBadge";
import { useAssignUserRoles } from "../hooks/useAssignUserRoles";
import { useUpdateUserStatus } from "../hooks/useUpdateUserStatus";
import { useUsers } from "../hooks/useUsers";
import { USER_STATUS, type UserListItemDto } from "../types/user";

export function UsersPage(): ReactElement {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [assigningUser, setAssigningUser] = useState<UserListItemDto | null>(null);

  const usersQuery = useUsers({
    pageNumber: pageIndex + 1,
    pageSize,
    searchTerm: searchValue.trim() || undefined,
    status: statusFilter || undefined,
    sortBy: "createdAt",
    sortDescending: true,
  });

  const updateStatusMutation = useUpdateUserStatus();
  const assignRolesMutation = useAssignUserRoles();

  const users = usersQuery.data?.items ?? [];
  const pageCount = usersQuery.data?.totalPages ?? 0;

  const handleToggleStatus = async (user: UserListItemDto): Promise<void> => {
    const nextStatus =
      user.status.toUpperCase() === USER_STATUS.ACTIVE ? USER_STATUS.INACTIVE : USER_STATUS.ACTIVE;

    await updateStatusMutation.mutateAsync({
      id: user.id,
      input: { status: nextStatus },
    });
  };

  const handleAssignRoles = async (roleIds: string[]): Promise<void> => {
    if (!assigningUser) {
      return;
    }

    await assignRolesMutation.mutateAsync({
      id: assigningUser.id,
      input: { roleIds },
    });
  };

  const columns: Array<ColumnDef<UserListItemDto, unknown>> = useMemo(
    () => [
      {
        accessorKey: "fullName",
        header: t("common.name"),
        cell: ({ row }) => (
          <div className="space-y-0.5">
            <div className="font-medium text-foreground">{row.original.fullName}</div>
            <div className="text-xs text-muted-foreground">{row.original.email}</div>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: t("common.status"),
        cell: ({ row }) => <UserStatusBadge status={row.original.status} />,
      },
      {
        accessorKey: "roleNames",
        header: t("users.rolesColumn"),
        cell: ({ row }) =>
          row.original.roleNames.length > 0 ? (
            <div className="text-sm text-foreground">{row.original.roleNames.join(", ")}</div>
          ) : (
            <div className="text-sm text-muted-foreground">{t("users.noRolesAssigned")}</div>
          ),
      },
      {
        accessorKey: "lastLoginAt",
        header: t("users.lastLogin"),
        cell: ({ row }) =>
          row.original.lastLoginAt
            ? new Date(row.original.lastLoginAt).toLocaleString()
            : t("users.neverLoggedIn"),
      },
      {
        id: "actions",
        header: t("common.actions"),
        cell: ({ row }) => (
          <div className="flex flex-wrap items-center gap-2">
            <HasPermission permission={PERMISSION_KEYS.User.Update}>
              <Button
                variant="secondary"
                onClick={() => setAssigningUser(row.original)}
                disabled={assignRolesMutation.isPending}
              >
                {t("users.assignRoles")}
              </Button>
              <Button
                variant={row.original.status.toUpperCase() === USER_STATUS.ACTIVE ? "danger" : "secondary"}
                onClick={() => void handleToggleStatus(row.original)}
                disabled={updateStatusMutation.isPending}
              >
                {row.original.status.toUpperCase() === USER_STATUS.ACTIVE
                  ? t("users.deactivate")
                  : t("users.activate")}
              </Button>
            </HasPermission>
          </div>
        ),
      },
    ],
    [assignRolesMutation.isPending, t, updateStatusMutation.isPending],
  );

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{t("users.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("users.description")}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{t("common.status")}</span>
          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setPageIndex(0);
            }}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">{t("users.allStatuses")}</option>
            <option value={USER_STATUS.ACTIVE}>{t("users.statusActive")}</option>
            <option value={USER_STATUS.INACTIVE}>{t("users.statusInactive")}</option>
          </select>
        </label>
      </div>

      <DataTable
        columns={columns}
        data={users}
        isLoading={usersQuery.isLoading}
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
        emptyTitle={t("users.emptyTitle")}
        emptyDescription={t("users.emptyDescription")}
      />

      <AssignRolesDialog
        user={assigningUser}
        isSubmitting={assignRolesMutation.isPending}
        onClose={() => setAssigningUser(null)}
        onSubmit={handleAssignRoles}
      />
    </section>
  );
}
