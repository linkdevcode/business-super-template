import { Link } from "react-router-dom";
import type { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { EmptyState } from "../../shared/components/EmptyState";

/** Summary: Fallback page for unknown routes. */
export function NotFoundPage(): ReactElement {
  const { t } = useTranslation();

  return (
    <section className="mx-auto max-w-xl">
      <EmptyState
        title={t("errors.notFoundTitle")}
        description={t("errors.notFoundDescription")}
        action={
          <Link
            to="/"
            className="inline-flex h-10 items-center justify-center rounded-md border border-transparent bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90"
          >
            {t("errors.goHome")}
          </Link>
        }
      />
    </section>
  );
}
