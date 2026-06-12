import type { ReactElement } from "react";
/** Summary: Permission denied screen scaffold. */
export function ForbiddenPage(): ReactElement {
  return (
    <section className="space-y-2 text-center">
      <h1 className="text-2xl font-semibold">Forbidden</h1>
      <p className="text-sm text-slate-600">You do not have permission to view this page.</p>
    </section>
  );
}
