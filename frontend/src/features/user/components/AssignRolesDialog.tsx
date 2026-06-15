import { useEffect, useState, type ReactElement } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogCancel,
  DialogConfirm,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../shared/components/ui/Dialog";
import { useRoles } from "../../role/hooks/useRoles";
import type { UserListItemDto } from "../types/user";

type AssignRolesDialogProps = {
  user: UserListItemDto | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (roleIds: string[]) => Promise<void>;
};

export function AssignRolesDialog({
  user,
  isSubmitting,
  onClose,
  onSubmit,
}: AssignRolesDialogProps): ReactElement {
  const { t } = useTranslation();
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const rolesQuery = useRoles({
    pageNumber: 1,
    pageSize: 100,
    sortBy: "name",
    sortDescending: false,
  });

  useEffect(() => {
    if (user) {
      setSelectedRoleIds(user.roleIds);
    }
  }, [user]);

  const roles = rolesQuery.data?.items ?? [];

  const toggleRole = (roleId: string): void => {
    setSelectedRoleIds((current) =>
      current.includes(roleId) ? current.filter((id) => id !== roleId) : [...current, roleId],
    );
  };

  const handleSubmit = async (): Promise<void> => {
    await onSubmit(selectedRoleIds);
    onClose();
  };

  return (
    <Dialog open={user !== null} onOpenChange={(open) => (!open ? onClose() : undefined)}>
      {user ? (
        <div className="space-y-4">
          <DialogHeader>
            <DialogTitle>{t("users.assignRoles")}</DialogTitle>
            <DialogDescription>
              {t("users.assignRolesDescription", { name: user.fullName })}
            </DialogDescription>
          </DialogHeader>

          {rolesQuery.isLoading ? (
            <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
          ) : roles.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("users.noRolesAvailable")}</p>
          ) : (
            <div className="max-h-64 space-y-2 overflow-y-auto rounded-xl border border-border bg-muted/20 p-3">
              {roles.map((role) => {
                const isChecked = selectedRoleIds.includes(role.id);
                return (
                  <label
                    key={role.id}
                    className="flex cursor-pointer items-start gap-3 rounded-lg border border-transparent px-3 py-2 transition-colors hover:border-border hover:bg-background"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleRole(role.id)}
                      className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-ring"
                    />
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-foreground">{role.name}</span>
                      {role.description ? (
                        <span className="block text-xs text-muted-foreground">{role.description}</span>
                      ) : null}
                    </span>
                  </label>
                );
              })}
            </div>
          )}

          <DialogFooter>
            <DialogCancel onClick={onClose}>{t("common.cancel")}</DialogCancel>
            <DialogConfirm onClick={handleSubmit}>
              {isSubmitting ? t("common.loading") : t("users.saveRoles")}
            </DialogConfirm>
          </DialogFooter>
        </div>
      ) : null}
    </Dialog>
  );
}
