import { BarChart3, Infinity as InfinityIcon, Link2, Zap } from "lucide-react";
import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ShortenForm } from "@/components/shorten-form";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/config";

const FEATURE_ICONS = [Zap, BarChart3, InfinityIcon] as const;
const FEATURE_KEYS = ["instant", "stats", "free"] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${SITE_URL}/${l}`])
      ),
    },
  };
}

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("home");

  return (
    <div className="relative flex flex-1 flex-col">
      <div className="glow bg-grid pointer-events-none absolute inset-0 -z-10" />

      <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center px-4 pt-16 pb-24 sm:px-6 sm:pt-24">
        <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-surface-border bg-surface px-3 py-1 text-xs font-medium text-muted">
          <Link2 className="h-3.5 w-3.5" />
          {t("badge")}
        </span>

        <h1 className="text-balance text-center text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {t("titleLine1")}{" "}
          <span className="bg-gradient-to-br from-accent to-accent-2 bg-clip-text text-transparent">
            {t("titleAccent")}
          </span>
        </h1>

        <p className="mt-4 max-w-lg text-balance text-center text-base text-muted sm:text-lg">
          {t("subtitle")}
        </p>

        <div className="mt-10 w-full max-w-xl">
          <ShortenForm />
        </div>

        <div className="mt-20 grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
          {FEATURE_KEYS.map((key, i) => {
            const Icon = FEATURE_ICONS[i];
            return (
              <div key={key} className="rounded-2xl border border-surface-border bg-surface p-5">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">
                  {t(`features.${key}.title`)}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  {t(`features.${key}.description`)}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
