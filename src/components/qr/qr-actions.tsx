"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AlertCircle, Check, ChevronDown, Copy, Download } from "lucide-react";
import { createQrCode } from "@/lib/qr/create-qr-code";
import { copyQrAsPng, downloadQr } from "@/lib/qr/qr-export";
import { Popover } from "@/components/ui/popover";
import type { QrOptions } from "@/lib/qr/types";

type ActionState = "idle" | "success" | "error";

const DOWNLOAD_FORMATS = ["png", "svg"] as const;

// Copy/Download для произвольного QR — не завязан на ShortLink, принимает
// только value+options. Каждый вызов строит свой собственный экземпляр
// QRCodeStyling (он не рендерится в DOM, нужен только для экспорта), поэтому
// компонент не зависит от того, что и где отрисовал соседний <QrCode>.
export function QrActions({
  value,
  options,
  fileName = "qr-code",
  className = "",
}: {
  value: string;
  options?: QrOptions;
  fileName?: string;
  className?: string;
}) {
  const t = useTranslations("qr");
  const [copyState, setCopyState] = useState<ActionState>("idle");

  const handleCopy = async () => {
    try {
      await copyQrAsPng(createQrCode(value, options));
      setCopyState("success");
    } catch {
      setCopyState("error");
    } finally {
      setTimeout(() => setCopyState("idle"), 1600);
    }
  };

  const handleDownload = async (
    extension: (typeof DOWNLOAD_FORMATS)[number],
  ) => {
    await downloadQr(createQrCode(value, options), extension, fileName);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-surface-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface cursor-pointer"
      >
        {copyState === "success" ? (
          <>
            <Check className="h-4 w-4 text-success" />
            {t("copied")}
          </>
        ) : copyState === "error" ? (
          <>
            <AlertCircle className="h-4 w-4 text-danger" />
            {t("copyError")}
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" />
            {t("copy")}
          </>
        )}
      </button>

      <Popover
        align="end"
        gap={2}
        rootClassName="flex-1"
        trigger={({ onClick, "aria-expanded": expanded }) => (
          <button
            type="button"
            onClick={onClick}
            aria-expanded={expanded}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-surface-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface cursor-pointer"
          >
            <Download className="h-4 w-4" />
            {t("download")}
            <ChevronDown className="h-4 w-4" />
          </button>
        )}
        panelClassName="w-24 overflow-hidden rounded-lg border border-surface-border bg-surface shadow-lg"
      >
        {({ close }) => (
          <>
            {DOWNLOAD_FORMATS.map((ext) => (
              <button
                key={ext}
                type="button"
                onClick={() => {
                  close();
                  void handleDownload(ext);
                }}
                className="block w-full px-3 py-2 text-left text-sm font-medium text-foreground transition-colors hover:bg-background cursor-pointer"
              >
                {ext.toUpperCase()}
              </button>
            ))}
          </>
        )}
      </Popover>
    </div>
  );
}
