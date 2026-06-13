import type { ReactElement } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeToggle } from "../../shared/components/ThemeToggle";

/** Summary: Minimal layout for authentication screens. */
export function AuthLayout(): ReactElement {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background px-4 py-6 text-foreground">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-md flex-col justify-center gap-6">
        <div className="flex justify-end">
          <ThemeToggle />
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="w-full rounded-3xl border border-border bg-card p-8 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.45)] backdrop-blur-sm"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
