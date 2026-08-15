"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

export function ThemeToggle() {
  const t = useTranslations("theme");
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    // Синхронизация с внешней системой (DOM-атрибутом, выставленным инлайн-скриптом
    // до гидратации) — легитимный случай для react-hooks/set-state-in-effect.
    const current = document.documentElement.getAttribute("data-theme") as Theme | null;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(current ?? "light");
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t("toggle")}
      title={t("toggle")}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-surface-border bg-surface text-foreground transition-colors hover:border-accent hover:text-accent"
    >
      {theme === null ? null : theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}
