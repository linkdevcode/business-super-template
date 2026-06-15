import type { ReactElement } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LanguageSwitcher } from "../../shared/components/LanguageSwitcher";
import { ThemeToggle } from "../../shared/components/ThemeToggle";

/** Summary: Minimal layout for authentication screens. */
export function AuthLayout(): ReactElement {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background px-3 py-4 text-foreground sm:px-4 sm:py-6">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-md flex-col justify-center gap-4 sm:min-h-[calc(100vh-3rem)] sm:gap-6">
        <div className="flex justify-end gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="w-full rounded-2xl border border-border bg-card p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.45)] backdrop-blur-sm sm:rounded-3xl sm:p-8"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
