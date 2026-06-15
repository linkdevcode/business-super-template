import { useTranslation } from "react-i18next";
import type { ButtonHTMLAttributes, ReactElement } from "react";
import { SUPPORTED_LOCALES, type SupportedLocale } from "../i18n";

type LanguageSwitcherProps = ButtonHTMLAttributes<HTMLButtonElement>;

function FlagEn(): ReactElement {
  return (
    <span className="inline-flex h-5 w-5 shrink-0 overflow-hidden rounded-full border border-white/20 shadow-sm ring-1 ring-black/5">
      <svg viewBox="0 0 60 30" className="h-full w-full" aria-hidden="true">
        <rect width="60" height="30" fill="#B22234" />
        <rect y="2.3" width="60" height="2.3" fill="#fff" />
        <rect y="6.9" width="60" height="2.3" fill="#fff" />
        <rect y="11.5" width="60" height="2.3" fill="#fff" />
        <rect y="16.1" width="60" height="2.3" fill="#fff" />
        <rect y="20.7" width="60" height="2.3" fill="#fff" />
        <rect y="25.3" width="60" height="2.3" fill="#fff" />
        <rect width="24" height="16.1" fill="#3C3B6E" />
        <circle cx="4" cy="3" r="0.9" fill="#fff" />
        <circle cx="8" cy="3" r="0.9" fill="#fff" />
        <circle cx="12" cy="3" r="0.9" fill="#fff" />
        <circle cx="16" cy="3" r="0.9" fill="#fff" />
        <circle cx="20" cy="3" r="0.9" fill="#fff" />
        <circle cx="6" cy="6" r="0.9" fill="#fff" />
        <circle cx="10" cy="6" r="0.9" fill="#fff" />
        <circle cx="14" cy="6" r="0.9" fill="#fff" />
        <circle cx="18" cy="6" r="0.9" fill="#fff" />
        <circle cx="4" cy="9" r="0.9" fill="#fff" />
        <circle cx="8" cy="9" r="0.9" fill="#fff" />
        <circle cx="12" cy="9" r="0.9" fill="#fff" />
        <circle cx="16" cy="9" r="0.9" fill="#fff" />
        <circle cx="20" cy="9" r="0.9" fill="#fff" />
        <circle cx="6" cy="12" r="0.9" fill="#fff" />
        <circle cx="10" cy="12" r="0.9" fill="#fff" />
        <circle cx="14" cy="12" r="0.9" fill="#fff" />
        <circle cx="18" cy="12" r="0.9" fill="#fff" />
      </svg>
    </span>
  );
}

function FlagVi(): ReactElement {
  return (
    <span className="inline-flex h-5 w-5 shrink-0 overflow-hidden rounded-full border border-white/20 shadow-sm ring-1 ring-black/5">
      <svg viewBox="0 0 30 20" className="h-full w-full" aria-hidden="true">
        <rect width="30" height="20" fill="#DA251D" />
        <polygon
          fill="#FFCD00"
          points="15,4 16.76,8.24 21.47,8.24 17.6,10.76 19.06,15.24 15,12.6 10.94,15.24 12.4,10.76 8.53,8.24 13.24,8.24"
        />
      </svg>
    </span>
  );
}

const FLAG_BY_LOCALE: Record<SupportedLocale, () => ReactElement> = {
  en: FlagEn,
  vi: FlagVi,
};

export function LanguageSwitcher({ className = "", ...props }: LanguageSwitcherProps): ReactElement {
  const { i18n, t } = useTranslation();
  const currentLocale = SUPPORTED_LOCALES.includes(i18n.language as SupportedLocale)
    ? (i18n.language as SupportedLocale)
    : "en";

  const nextLocale: SupportedLocale = currentLocale === "en" ? "vi" : "en";
  const CurrentFlag = FLAG_BY_LOCALE[currentLocale];

  return (
    <button
      type="button"
      aria-label={t("language.label")}
      onClick={() => {
        void i18n.changeLanguage(nextLocale);
      }}
      className={[
        "inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border/80 bg-card px-2.5 text-sm font-semibold text-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:bg-accent hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <CurrentFlag />
      <span className="text-xs font-bold tracking-wider">{currentLocale.toUpperCase()}</span>
    </button>
  );
}
