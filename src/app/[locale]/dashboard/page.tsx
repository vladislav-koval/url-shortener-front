import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { DashboardClient } from "./dashboard-client";

// Персонализированная страница за логином — незачем индексировать.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardPage({ params }: PageProps<"/[locale]/dashboard">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return <DashboardClient />;
}
