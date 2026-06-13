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
        <div key={group.group} className="rounded-lg border border-slate-200 p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">{group.group}</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {group.permissions.map((permission) => {
              const isChecked = selectedPermissionIds.includes(permission.id);

              return (
                <label
                  key={permission.id}
                  className="flex cursor-pointer items-start gap-3 rounded-md border border-slate-100 bg-slate-50 p-3"
                >
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
                    checked={isChecked}
                    onChange={() => togglePermission(permission.id)}
                  />
                  <span className="space-y-1">
                    <span className="block text-sm font-medium text-slate-900">{permission.name}</span>
                    <span className="block text-xs text-slate-500">{permission.key}</span>
                    {permission.description ? (
                      <span className="block text-xs text-slate-600">{permission.description}</span>
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
