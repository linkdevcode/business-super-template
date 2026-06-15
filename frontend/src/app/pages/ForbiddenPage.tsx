import type { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { EmptyState } from "../../shared/components/EmptyState";

/** Summary: Permission denied screen scaffold. */
export function ForbiddenPage(): ReactElement {
  const { t } = useTranslation();

  return (
    <section className="mx-auto max-w-xl">
      <EmptyState
        title={t("errors.forbiddenTitle")}
        description={t("errors.forbiddenDescription")}
      />
    </section>
  );
}
