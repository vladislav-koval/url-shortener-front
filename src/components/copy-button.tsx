"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Copy } from "lucide-react";

export function CopyButton({
  value,
  className = "",
}: {
  value: string;
  className?: string;
}) {
  const t = useTranslations("copyButton");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard недоступен — молча игнорируем
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 rounded-lg border border-surface-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface cursor-pointer ${className}`}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-success" />
          {t("copied")}
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          {t("copy")}
        </>
      )}
    </button>
  );
}
