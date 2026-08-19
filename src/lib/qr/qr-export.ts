import { browserUtils, FileExtension, type QRCodeStyling } from "@liquid-js/qr-code-styling";

// Нативный размер SVG зависит от длины данных и дефолтного размера точки
// в самой библиотеке (может оказаться и 290px) — для PNG (скачивание/copy)
// растеризуем в фиксированное разрешение, чтобы файл не был мелким.
// margin — "тихая зона" по краям, без неё скачанный/скопированный QR
// может плохо сканироваться.
const EXPORT_CANVAS_SIZE = 768;
const EXPORT_MARGIN = 32;

function requireBrowserUtils() {
  if (!browserUtils) {
    throw new Error("QR export is only available in the browser");
  }
  return browserUtils;
}

export async function copyQrAsPng(qrCode: QRCodeStyling): Promise<void> {
  const { drawToCanvas } = requireBrowserUtils();
  const result = drawToCanvas(qrCode, {
    width: EXPORT_CANVAS_SIZE,
    height: EXPORT_CANVAS_SIZE,
    margin: EXPORT_MARGIN,
  });
  if (!result) {
    throw new Error("Failed to render QR to canvas");
  }
  await result.canvasDrawingPromise;

  const blob = await new Promise<Blob | null>((resolve) =>
    result.canvas.toBlob(resolve, "image/png"),
  );
  if (!blob) {
    throw new Error("Failed to create PNG blob");
  }

  await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
}

export async function downloadQr(
  qrCode: QRCodeStyling,
  extension: "png" | "svg",
  name = "qr-code",
): Promise<void> {
  const { download } = requireBrowserUtils();
  await download(
    qrCode,
    { name, extension: extension === "png" ? FileExtension.png : FileExtension.svg },
    { width: EXPORT_CANVAS_SIZE, height: EXPORT_CANVAS_SIZE, margin: EXPORT_MARGIN },
  );
}
