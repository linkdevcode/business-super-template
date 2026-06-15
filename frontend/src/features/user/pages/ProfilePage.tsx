import { useEffect, useState, type ReactElement } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Button } from "../../../shared/components/ui/Button";
import { Input } from "../../../shared/components/ui/Input";
import { AvatarUploader } from "../../file-management/components/AvatarUploader";
import { useAuth } from "../../auth/hooks/useAuth";
import { UserStatusBadge } from "../components/UserStatusBadge";
import { useChangePassword } from "../hooks/useChangePassword";
import { useProfile } from "../hooks/useProfile";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import {
  changePasswordSchema,
  updateProfileSchema,
  type ChangePasswordFormValues,
  type UpdateProfileFormValues,
} from "../schemas/profileSchema";

export function ProfilePage(): ReactElement {
  const { t } = useTranslation();
  const { currentUser, refreshCurrentUser } = useAuth();
  const profileQuery = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const profileForm = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullName: "",
      avatarUrl: "",
    },
  });

  const passwordForm = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (profileQuery.data) {
      profileForm.reset({
        fullName: profileQuery.data.fullName,
        avatarUrl: profileQuery.data.avatarUrl ?? "",
      });
    }
  }, [profileForm, profileQuery.data]);

  const avatarUrl = profileForm.watch("avatarUrl");

  const handleProfileSubmit = profileForm.handleSubmit(async (values) => {
    setProfileMessage(null);

    const updatedProfile = await updateProfileMutation.mutateAsync({
      fullName: values.fullName.trim(),
      avatarUrl: values.avatarUrl?.trim() ? values.avatarUrl.trim() : null,
    });

    profileForm.reset({
      fullName: updatedProfile.fullName,
      avatarUrl: updatedProfile.avatarUrl ?? "",
    });

    await refreshCurrentUser();
    setProfileMessage(t("profile.updateSuccess"));
  });

  const handlePasswordSubmit = passwordForm.handleSubmit(async (values) => {
    setPasswordMessage(null);
    setPasswordError(null);

    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      passwordForm.reset();
      setPasswordMessage(t("profile.passwordSuccess"));
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : t("profile.passwordError"));
    }
  });

  if (profileQuery.isLoading) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold">{t("profile.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
      </section>
    );
  }

  const profile = profileQuery.data;

  return (
    <section className="mx-auto max-w-4xl space-y-6 sm:space-y-8">
      <div className="space-y-2">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{t("profile.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("profile.description")}</p>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-[280px_1fr]">
        <div className="rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm backdrop-blur-sm sm:p-6">
          <AvatarUploader
            initialUrl={avatarUrl || profile?.avatarUrl || currentUser?.avatarUrl || null}
            alt={profile?.fullName ?? currentUser?.fullName ?? "Profile avatar"}
            disabled={updateProfileMutation.isPending}
            onUploaded={(file) => {
              profileForm.setValue("avatarUrl", file.url, { shouldDirty: true });
            }}
          />
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm backdrop-blur-sm sm:p-6">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">{t("profile.accountInfo")}</h2>
                <p className="text-sm text-muted-foreground">{t("profile.accountInfoDescription")}</p>
              </div>
              {profile ? <UserStatusBadge status={profile.status} /> : null}
            </div>

            <form className="space-y-4" onSubmit={handleProfileSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="profile-email">
                  {t("common.email")}
                </label>
                <Input id="profile-email" value={profile?.email ?? currentUser?.email ?? ""} disabled readOnly />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="profile-full-name">
                  {t("common.name")}
                </label>
                <Input id="profile-full-name" {...profileForm.register("fullName")} />
                {profileForm.formState.errors.fullName ? (
                  <p className="text-sm text-destructive">{profileForm.formState.errors.fullName.message}</p>
                ) : null}
              </div>

              {profile?.roles.length ? (
                <div className="space-y-2">
                  <span className="text-sm font-medium text-foreground">{t("profile.roles")}</span>
                  <p className="text-sm text-muted-foreground">{profile.roles.join(", ")}</p>
                </div>
              ) : null}

              {profileMessage ? <p className="text-sm text-emerald-600 dark:text-emerald-400">{profileMessage}</p> : null}

              <Button type="submit" disabled={updateProfileMutation.isPending}>
                {updateProfileMutation.isPending ? t("common.loading") : t("profile.saveProfile")}
              </Button>
            </form>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm backdrop-blur-sm sm:p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold">{t("profile.changePassword")}</h2>
              <p className="text-sm text-muted-foreground">{t("profile.changePasswordDescription")}</p>
            </div>

            <form className="space-y-4" onSubmit={handlePasswordSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="current-password">
                  {t("profile.currentPassword")}
                </label>
                <Input
                  id="current-password"
                  type="password"
                  autoComplete="current-password"
                  {...passwordForm.register("currentPassword")}
                />
                {passwordForm.formState.errors.currentPassword ? (
                  <p className="text-sm text-destructive">{passwordForm.formState.errors.currentPassword.message}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="new-password">
                  {t("profile.newPassword")}
                </label>
                <Input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  {...passwordForm.register("newPassword")}
                />
                {passwordForm.formState.errors.newPassword ? (
                  <p className="text-sm text-destructive">{passwordForm.formState.errors.newPassword.message}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="confirm-password">
                  {t("profile.confirmPassword")}
                </label>
                <Input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  {...passwordForm.register("confirmPassword")}
                />
                {passwordForm.formState.errors.confirmPassword ? (
                  <p className="text-sm text-destructive">{passwordForm.formState.errors.confirmPassword.message}</p>
                ) : null}
              </div>

              {passwordMessage ? (
                <p className="text-sm text-emerald-600 dark:text-emerald-400">{passwordMessage}</p>
              ) : null}
              {passwordError ? <p className="text-sm text-destructive">{passwordError}</p> : null}

              <Button type="submit" variant="secondary" disabled={changePasswordMutation.isPending}>
                {changePasswordMutation.isPending ? t("common.loading") : t("profile.updatePassword")}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
