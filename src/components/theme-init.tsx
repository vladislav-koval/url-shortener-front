"use client";

import { useEffect } from "react";

// Подстраховка для notFound()-страниц: Next.js рендерит их через клиентский
// shell (__next_error__), поэтому инлайн-скрипт в body там не парсится браузером
// и не выполняется — data-theme остаётся не выставленным. На обычных страницах
// data-theme уже стоит (инлайн-скрипт в src/app/layout.tsx отработал до отрисовки),
// поэтому здесь ничего не делаем — только страхуем случай, когда его не было.
export function ThemeInit() {
  useEffect(() => {
    if (document.documentElement.hasAttribute("data-theme")) return;
    try {
      const stored = localStorage.getItem("theme");
      const theme =
        stored === "light" || stored === "dark"
          ? stored
          : window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
      document.documentElement.setAttribute("data-theme", theme);
    } catch {
      // localStorage недоступен — оставляем системную тему по умолчанию
    }
  }, []);

  return null;
}
