import { z } from "zod";

export const roleSchema = z.object({
  name: z.string().min(2, "Role name is required."),
  description: z.string().optional(),
  permissionIds: z.array(z.string().uuid()).default([]),
});

export type RoleFormValues = z.infer<typeof roleSchema>;
