"use client";

import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Link2, LayoutDashboard, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { GoogleIcon } from "@/components/icons/google-icon";

export function Header() {
  const { status, logout, loginUrl } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("nav");

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-surface-border/80 bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent-2 text-accent-foreground shadow-[0_0_20px_-4px_var(--accent)]">
            <Link2 className="h-4 w-4" strokeWidth={2.5} />
          </span>
          <span className="text-lg">tiniq</span>
        </Link>

        <nav className="flex items-center gap-1.5 sm:gap-3">
          <Link
            href="/dashboard"
            aria-label={t("dashboard")}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              pathname === "/dashboard"
                ? "bg-surface text-foreground"
                : "text-muted hover:text-foreground"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">{t("dashboard")}</span>
          </Link>

          {status === "anonymous" && (
            <a
              href={loginUrl}
              className="flex items-center gap-1.5 rounded-full bg-gradient-to-br from-accent to-accent-2 px-4 py-2 text-sm font-medium text-accent-foreground shadow-sm transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white">
                <GoogleIcon className="h-3 w-3" />
              </span>
              <span className="sm:hidden">{t("loginShort")}</span>
              <span className="hidden sm:inline">{t("login")}</span>
            </a>
          )}

          {status === "authenticated" && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-full border border-surface-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              {t("logout")}
            </button>
          )}

          <LanguageToggle />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
