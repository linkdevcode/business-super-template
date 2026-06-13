import type { ReactElement } from "react";
import { EmptyState } from "../../shared/components/EmptyState";
/** Summary: Permission denied screen scaffold. */
export function ForbiddenPage(): ReactElement {
  return (
    <section className="mx-auto max-w-xl">
      <EmptyState
        title="Forbidden"
        description="You do not have permission to view this page."
      />
    </section>
  );
}
