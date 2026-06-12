import type { ReactElement } from "react";
import { Button } from "../../shared/components/ui/Button";
import { Input } from "../../shared/components/ui/Input";

/** Summary: Login screen scaffold. */
export function LoginPage(): ReactElement {
  return (
    <section className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <p className="text-sm text-slate-300">Authentication flow will land here.</p>
      </div>

      <form className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input id="email" type="email" placeholder="you@example.com" />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <Input id="password" type="password" placeholder="••••••••" />
        </div>

        <Button className="w-full">Login</Button>
      </form>
    </section>
  );
}
