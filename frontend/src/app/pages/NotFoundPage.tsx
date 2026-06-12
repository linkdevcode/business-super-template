import { Link } from "react-router-dom";
import type { ReactElement } from "react";

/** Summary: Fallback page for unknown routes. */
export function NotFoundPage(): ReactElement {
  return (
    <section className="space-y-4 text-center">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-sm text-slate-600">The requested route does not exist.</p>
      <Link
        to="/"
        className="inline-flex items-center justify-center rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-200"
      >
        Go home
      </Link>
    </section>
  );
}
