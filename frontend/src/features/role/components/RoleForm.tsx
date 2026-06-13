import { useMemo, type ReactElement } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../../shared/components/ui/Button";
import { Input } from "../../../shared/components/ui/Input";
import type { PermissionGroupDto } from "../../permission";
import { PermissionTree } from "./PermissionTree";
import { roleSchema, type RoleFormValues } from "../schemas/roleSchema";

type RoleFormProps = {
  defaultValues?: RoleFormValues;
  permissionGroups: PermissionGroupDto[];
  isSubmitting?: boolean;
  submitLabel: string;
  onSubmit: (values: RoleFormValues) => Promise<void>;
};

export function RoleForm({
  defaultValues,
  permissionGroups,
  isSubmitting = false,
  submitLabel,
  onSubmit,
}: RoleFormProps): ReactElement {
  const normalizedDefaults = useMemo<RoleFormValues>(
    () => ({
      name: defaultValues?.name ?? "",
      description: defaultValues?.description ?? "",
      permissionIds: defaultValues?.permissionIds ?? [],
    }),
    [defaultValues],
  );

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: normalizedDefaults,
  });

  const permissionIds = useWatch({
    control,
    name: "permissionIds",
  }) ?? [];

  const handleFormSubmit = async (values: RoleFormValues): Promise<void> => {
    await onSubmit({
      ...values,
      description: values.description?.trim() || undefined,
    });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="name">
            Role name
          </label>
          <Input id="name" {...register("name")} placeholder="Managers" />
          {errors.name ? <p className="mt-1 text-sm text-red-600">{errors.name.message}</p> : null}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="description">
            Description
          </label>
          <Input id="description" {...register("description")} placeholder="Role description" />
          {errors.description ? <p className="mt-1 text-sm text-red-600">{errors.description.message}</p> : null}
        </div>
      </div>

      <div>
        <div className="mb-3">
          <h3 className="text-sm font-medium text-slate-700">Permissions</h3>
          <p className="text-xs text-slate-500">Assign permissions to the role using grouped checkboxes.</p>
        </div>
        <PermissionTree
          permissionGroups={permissionGroups}
          selectedPermissionIds={permissionIds}
          onChange={(nextPermissionIds) => {
            setValue("permissionIds", nextPermissionIds, { shouldDirty: true, shouldValidate: true });
          }}
        />
        {errors.permissionIds ? (
          <p className="mt-2 text-sm text-red-600">{errors.permissionIds.message}</p>
        ) : null}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
