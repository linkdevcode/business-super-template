import { useState, type ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../../shared/components/ui/Button";
import { Input } from "../../../shared/components/ui/Input";
import { useAuth } from "../hooks/useAuth";
import { loginSchema, type LoginFormValues } from "../schemas/loginSchema";

/** Summary: Auth login screen. */
export function LoginPage(): ReactElement {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues): Promise<void> => {
    setSubmitError(null);

    try {
      await login(values);
      navigate("/", { replace: true });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to sign in.");
    }
  };

  return (
    <section className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <p className="text-sm text-slate-300">Use your account to access the admin area.</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
          {errors.email ? <p className="text-sm text-red-300">{errors.email.message}</p> : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
          {errors.password ? <p className="text-sm text-red-300">{errors.password.message}</p> : null}
        </div>

        {submitError ? <p className="text-sm text-red-300">{submitError}</p> : null}

        {import.meta.env.DEV ? (
          <p className="rounded-md bg-slate-800 px-3 py-2 text-xs text-slate-300">
            Demo account: <span className="font-medium">admin@example.com</span> /{" "}
            <span className="font-medium">Password123!</span>
          </p>
        ) : null}

        <Button className="w-full" type="submit" disabled={isSubmitting || isLoading}>
          {isSubmitting ? "Signing in..." : "Login"}
        </Button>
      </form>
    </section>
  );
}
