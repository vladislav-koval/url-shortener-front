import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getLocale } from "next-intl/server";
import "./globals.css";
import { ThemeInit } from "@/components/theme-init";

const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var theme = stored === "light" || stored === "dark"
      ? stored
      : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {}
})();
`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Фолбэк на случай, если сегмент [locale] невалиден (например /fr) и его
// собственный generateMetadata не успевает отработать.
export const metadata: Metadata = {
  title: "tiniq",
  description: "A fast link shortener with click analytics",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        {/* Обычный script-тег, а не next/script beforeInteractive — на
            страницах notFound() тот не попадает в вывод вовсе (проверено
            в проде: data-theme оставался null), а этот работает везде. */}
        <script id="theme-init" dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <ThemeInit />
        {children}
      </body>
    </html>
  );
}
