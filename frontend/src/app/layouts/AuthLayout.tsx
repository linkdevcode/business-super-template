import type { ReactElement } from "react";
import { Outlet } from "react-router-dom";

/** Summary: Minimal layout for authentication screens. */
export function AuthLayout(): ReactElement {
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center justify-center">
        <div className="w-full rounded-2xl bg-slate-900 p-8 shadow-2xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
