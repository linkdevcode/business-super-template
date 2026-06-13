import type { ReactElement } from "react";
import type { PermissionGroupDto } from "../../permission";

type PermissionTreeProps = {
  permissionGroups: PermissionGroupDto[];
  selectedPermissionIds: string[];
  onChange: (permissionIds: string[]) => void;
};

export function PermissionTree({
  permissionGroups,
  selectedPermissionIds,
  onChange,
}: PermissionTreeProps): ReactElement {
  const togglePermission = (permissionId: string): void => {
    if (selectedPermissionIds.includes(permissionId)) {
      onChange(selectedPermissionIds.filter((currentPermissionId) => currentPermissionId !== permissionId));
      return;
    }

    onChange([...selectedPermissionIds, permissionId]);
  };

  return (
    <div className="space-y-4">
      {permissionGroups.map((group) => (
        <div key={group.group} className="rounded-2xl border border-border p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-foreground">{group.group}</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {group.permissions.map((permission) => {
              const isChecked = selectedPermissionIds.includes(permission.id);

              return (
                <label
                  key={permission.id}
                  className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:bg-accent"
                >
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                    checked={isChecked}
                    onChange={() => togglePermission(permission.id)}
                  />
                  <span className="space-y-1">
                    <span className="block text-sm font-medium text-foreground">{permission.name}</span>
                    <span className="block text-xs text-muted-foreground">{permission.key}</span>
                    {permission.description ? (
                      <span className="block text-xs text-muted-foreground">{permission.description}</span>
                    ) : null}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
