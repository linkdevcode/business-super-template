import { useMemo, useState, type ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Button } from "../../../shared/components/ui/Button";
import { Input } from "../../../shared/components/ui/Input";
import { useAuth } from "../hooks/useAuth";
import { createLoginSchema, type LoginFormValues } from "../schemas/loginSchema";

/** Summary: Auth login screen. */
export function LoginPage(): ReactElement {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const loginSchema = useMemo(
    () =>
      createLoginSchema({
        emailRequired: t("auth.validation.emailRequired"),
        emailInvalid: t("auth.validation.emailInvalid"),
        passwordRequired: t("auth.validation.passwordRequired"),
      }),
    [t],
  );

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
      setSubmitError(error instanceof Error ? error.message : t("auth.unableToSignIn"));
    }
  };

  return (
    <section className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold">{t("auth.signIn")}</h1>
        <p className="text-sm text-muted-foreground">{t("auth.signInDescription")}</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            {t("common.email")}
          </label>
          <Input id="email" type="email" placeholder={t("auth.emailPlaceholder")} {...register("email")} />
          {errors.email ? <p className="text-sm text-destructive">{errors.email.message}</p> : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            {t("common.password")}
          </label>
          <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
          {errors.password ? <p className="text-sm text-destructive">{errors.password.message}</p> : null}
        </div>

        {submitError ? <p className="text-sm text-destructive">{submitError}</p> : null}

        {import.meta.env.DEV ? (
          <p className="rounded-lg border border-border bg-muted px-3 py-2 text-xs text-muted-foreground">
            {t("auth.demoAccount")} <span className="font-medium">admin@example.com</span> /{" "}
            <span className="font-medium">Password123!</span>
          </p>
        ) : null}

        <Button className="w-full" type="submit" disabled={isSubmitting || isLoading}>
          {isSubmitting ? t("auth.signingIn") : t("auth.login")}
        </Button>
      </form>
    </section>
  );
}
