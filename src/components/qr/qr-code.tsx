"use client";

import { useEffect, useRef } from "react";
import { createQrCode } from "@/lib/qr/create-qr-code";
import type { QrOptions } from "@/lib/qr/types";

// Базовый рендерер QR — работает с произвольной строкой, ничего не знает
// про короткие ссылки. Рисует в DOM через @liquid-js/qr-code-styling,
// вся работа с самой библиотекой изолирована в lib/qr/create-qr-code.
export function QrCode({
  value,
  options,
  className = "",
}: {
  value: string;
  options?: QrOptions;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const qrCode = createQrCode(value, options);
    qrCode.append(container);

    // Внутренний рендер фиксированного размера (QR_RENDER_SIZE) — тянем
    // SVG на весь контейнер, реальный визуальный размер задаёт CSS снаружи.
    const svg = container.querySelector("svg");
    svg?.setAttribute("width", "100%");
    svg?.setAttribute("height", "100%");

    return () => {
      container.replaceChildren();
    };
  }, [value, options]);

  return <div ref={containerRef} className={className} />;
}
