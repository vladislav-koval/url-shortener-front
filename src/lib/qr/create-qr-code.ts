import { QRCodeStyling } from "@liquid-js/qr-code-styling";
import type { QrOptions } from "./types";

export function createQrCode(value: string, options: QrOptions = {}): QRCodeStyling {
  return new QRCodeStyling({
    data: value,
    dotsOptions: {
      color: options.foregroundColor ?? "#000000",
      type: options.dotShape ?? "square",
    },
    backgroundOptions: {
      color: options.backgroundColor ?? "#ffffff",
    },
    cornersSquareOptions: options.cornerSquareShape
      ? { type: options.cornerSquareShape }
      : undefined,
    cornersDotOptions: options.cornerDotShape ? { type: options.cornerDotShape } : undefined,
  });
}
