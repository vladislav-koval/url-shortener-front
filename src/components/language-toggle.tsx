"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Languages } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

export function LanguageToggle() {
  const locale = useLocale() as Locale;
  const t = useTranslations("language");
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const nextLocale =
    routing.locales[
      (routing.locales.indexOf(locale) + 1) % routing.locales.length
    ];

  const handleClick = () => {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={`${t("toggle")}: ${nextLocale.toUpperCase()}`}
      title={`${t("toggle")}: ${nextLocale.toUpperCase()}`}
      className="flex h-9 items-center gap-1.5 rounded-full border border-surface-border bg-surface px-3 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent disabled:opacity-60 cursor-pointer"
    >
      <Languages className="h-4 w-4" />
      {nextLocale.toUpperCase()}
    </button>
  );
}
