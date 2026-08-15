import { getTranslations } from "next-intl/server";
import { Link2 } from "lucide-react";
import { Link } from "@/i18n/navigation";

// Срабатывает для валидной локали без совпавшей страницы (например /ru/foo) —
// рендерится внутри LocaleLayout, так что Header и переключатели темы/языка на месте.
export default async function LocaleNotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent-2 text-accent-foreground">
        <Link2 className="h-5 w-5" strokeWidth={2.5} />
      </span>
      <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="mt-2 max-w-sm text-muted">{t("description")}</p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-gradient-to-br from-accent to-accent-2 px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-transform hover:scale-[1.03] active:scale-[0.98]"
      >
        {t("backHome")}
      </Link>
    </div>
  );
}
