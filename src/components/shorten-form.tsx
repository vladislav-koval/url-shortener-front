"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { ExternalLink, Loader2, Sparkles, User } from "lucide-react";
import { api, isInvalidArgument } from "@/lib/api";
import { API_BASE_URL } from "@/lib/config";
import type { CreateLinkResponse } from "@/lib/types";
import { CopyButton } from "@/components/copy-button";
import { useApiErrorMessage } from "@/lib/use-api-error-message";
import { isValidHttpUrl, MAX_URL_LENGTH } from "@/lib/validate-url";

export function ShortenForm() {
  const t = useTranslations("shortenForm");
  const getApiErrorMessage = useApiErrorMessage();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<CreateLinkResponse[]>([]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;

    if (trimmed.length > MAX_URL_LENGTH) {
      setError(t("urlTooLong", { max: MAX_URL_LENGTH }));
      return;
    }
    if (!isValidHttpUrl(trimmed)) {
      setError(t("invalidUrl"));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await api.createLink(trimmed);
      setHistory((prev) => [result, ...prev]);
      setUrl("");
    } catch (err) {
      // На /link единственный аргумент — url, так что invalid_argument
      // здесь всегда про него.
      setError(isInvalidArgument(err) ? t("invalidUrl") : getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 rounded-2xl border border-surface-border bg-surface p-3 shadow-xl shadow-black/[0.03] sm:flex-row sm:p-3"
      >
        <input
          type="text"
          inputMode="url"
          autoComplete="off"
          spellCheck={false}
          placeholder={t("placeholder")}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="min-w-0 flex-1 rounded-xl bg-transparent px-4 py-3.5 text-base text-foreground outline-none placeholder:text-muted"
        />
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-accent to-accent-2 px-6 py-3.5 text-sm font-semibold text-accent-foreground transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {t("submit")}
        </button>
      </form>

      {error && (
        <p className="mt-3 rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}

      {history.length > 0 && (
        <ul className="mt-6 flex flex-col gap-3">
          {history.map((item, i) => {
            const shortUrl = `${API_BASE_URL}/${item.short_code}`;
            return (
              <li
                key={`${item.short_code}-${i}`}
                className="flex flex-col gap-3 rounded-2xl border border-surface-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <a
                      href={shortUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="truncate font-mono text-base font-medium text-accent hover:underline"
                    >
                      {shortUrl.replace(/^https?:\/\//, "")}
                    </a>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted" />
                    {item.user_id && (
                      <span className="flex shrink-0 items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                        <User className="h-3 w-3" />
                        {t("linked")}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 truncate text-sm text-muted">
                    {item.original_url}
                  </p>
                </div>
                <CopyButton
                  value={shortUrl}
                  className="shrink-0 self-start sm:self-auto"
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
