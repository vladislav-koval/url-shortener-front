import { QrCode } from "@/components/qr/qr-code";
import type { QrOptions } from "@/lib/qr/types";

// Небольшая витрина QR — фиксированный размер под popover/страницу
// генератора. Сама не знает про короткие ссылки, только value+options.
export function QrPreview({
  value,
  options,
  size = 160,
}: {
  value: string;
  options?: QrOptions;
  size?: number;
}) {
  return (
    <div
      className="flex items-center justify-center rounded-xl border border-surface-border bg-white p-3"
      style={{ width: size, height: size }}
    >
      <QrCode value={value} options={options} className="h-full w-full" />
    </div>
  );
}
