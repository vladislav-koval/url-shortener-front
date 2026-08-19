"use client";

import { useTranslations } from "next-intl";
import { QrCode as QrCodeIcon } from "lucide-react";
import { Popover } from "@/components/ui/popover";
import { QrPreview } from "@/components/qr/qr-preview";
import { QrActions } from "@/components/qr/qr-actions";
import type { QrOptions } from "@/lib/qr/types";

// Маленький popover для карточки короткой ссылки. Сам компонент про
// произвольное value — ShortLink в него не протекает, вызывающая сторона
// сама решает, какую строку показать (короткий URL, любой другой value).
export function QrPopover({
  value,
  options,
  fileName,
  className = "",
}: {
  value: string;
  options?: QrOptions;
  fileName?: string;
  className?: string;
}) {
  const t = useTranslations("qr");

  return (
    <Popover
      align="end"
      rootClassName={className}
      trigger={({ onClick, "aria-expanded": expanded }) => (
        <button
          type="button"
          onClick={onClick}
          aria-expanded={expanded}
          className="inline-flex items-center gap-1.5 rounded-lg border border-surface-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface cursor-pointer"
        >
          <QrCodeIcon className="h-4 w-4" />
          {t("button")}
        </button>
      )}
      panelClassName="w-80 rounded-2xl border border-surface-border bg-surface p-4 shadow-xl"
    >
      <div className="flex flex-col items-center gap-3">
        <QrPreview value={value} options={options} size={160} />
        <QrActions
          value={value}
          options={options}
          fileName={fileName}
          className="w-full"
        />
        <button
          type="button"
          disabled
          title={t("customizeSoon")}
          className="mt-1 cursor-not-allowed text-sm font-medium text-muted opacity-60"
        >
          {t("customize")}
        </button>
      </div>
    </Popover>
  );
}
