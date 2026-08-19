"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Info,
  LogIn,
  MousePointerClick,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { API_BASE_URL } from "@/lib/config";
import type { ClicksPage } from "@/lib/types";
import { CopyButton } from "@/components/copy-button";
import { QrPopover } from "@/components/qr/qr-popover";
import { useApiErrorMessage } from "@/lib/use-api-error-message";
import { Link } from "@/i18n/navigation";

const PAGE_SIZE = 10;

export function DashboardClient() {
  const { status, loginUrl } = useAuth();
  const t = useTranslations("dashboard");
  const getApiErrorMessage = useApiErrorMessage();
  const [page, setPage] = useState<ClicksPage | null>(null);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;

    let cancelled = false;
    // Стандартный паттерн fetch-в-эффекте из react.dev — сбрасываем состояние
    // синхронно перед запросом, react-hooks/set-state-in-effect ложно-положительно тут срабатывает.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);

    api
      .getClicks({ limit: PAGE_SIZE, offset })
      .then((result) => {
        if (cancelled) return;
        setPage(result);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(getApiErrorMessage(err));
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [status, offset, getApiErrorMessage]);

  if (status === "anonymous") {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
          <MousePointerClick className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("anonymous.title")}
        </h1>
        <p className="mt-2 max-w-sm text-muted">{t("anonymous.subtitle")}</p>
        <a
          href={loginUrl}
          className="mt-6 flex items-center gap-2 rounded-full bg-gradient-to-br from-accent to-accent-2 px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-transform hover:scale-[1.03] active:scale-[0.98]"
        >
          <LogIn className="h-4 w-4" />
          {t("anonymous.cta")}
        </a>
      </div>
    );
  }

  const total = page?.total ?? 0;
  const from = total === 0 ? 0 : offset + 1;
  const to = Math.min(offset + PAGE_SIZE, total);

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="mt-1 text-sm text-muted">{t("subtitle")}</p>

      <div className="mt-4 flex items-start gap-2 rounded-xl border border-surface-border bg-surface px-4 py-3 text-sm text-muted">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <span>{t("missingUrlNotice")}</span>
      </div>

      {error && (
        <p className="mt-4 flex items-center gap-2 rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </p>
      )}

      <div className="mt-4 overflow-hidden rounded-2xl border border-surface-border bg-surface">
        {loading && (
          <div className="divide-y divide-surface-border">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse px-5 py-4">
                <div className="h-4 w-40 rounded bg-background" />
              </div>
            ))}
          </div>
        )}

        {!loading && page && page.items.length === 0 && (
          <div className="px-5 py-12 text-center text-sm text-muted">
            {t.rich("empty", {
              link: (chunks) => (
                <Link
                  href="/"
                  className="font-medium text-accent hover:underline"
                >
                  {chunks}
                </Link>
              ),
            })}
          </div>
        )}

        {!loading && page && page.items.length > 0 && (
          <ul className="divide-y divide-surface-border">
            {page.items.map((item) => {
              const shortUrl = `${API_BASE_URL}/${item.short_code}`;
              return (
                <li
                  key={item.short_code}
                  className="flex items-center justify-between gap-4 px-5 py-4"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <a
                      href={shortUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="truncate font-mono text-sm font-medium text-foreground hover:text-accent"
                    >
                      /{item.short_code}
                    </a>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted" />
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
                      <MousePointerClick className="h-3 w-3" />
                      {item.click_count}
                    </span>
                    <QrPopover value={shortUrl} fileName={item.short_code} />
                    <CopyButton value={shortUrl} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {page && total > 0 && (
        <div className="mt-4 flex items-center justify-between text-sm text-muted">
          <span>{t("range", { from, to, total })}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setOffset((o) => Math.max(0, o - PAGE_SIZE))}
              disabled={offset === 0 || loading}
              className="flex items-center gap-1 rounded-lg border border-surface-border px-3 py-1.5 font-medium text-foreground transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              {t("prev")}
            </button>
            <button
              onClick={() => setOffset((o) => o + PAGE_SIZE)}
              disabled={offset + PAGE_SIZE >= total || loading}
              className="flex items-center gap-1 rounded-lg border border-surface-border px-3 py-1.5 font-medium text-foreground transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t("next")}
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
