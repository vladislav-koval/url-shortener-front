// Собственные типы под наш QR-функционал — компоненты работают с этими
// именами, а не напрямую с типами @liquid-js/qr-code-styling, чтобы при
// смене библиотеки поменялся только create-qr-code.ts, а не все компоненты.
// Сейчас заполняется только то, что реально нужно маленькому popover;
// остальные поля будущего кастомайзера (gradients, logo и т.д.) добавляются
// сюда по мере необходимости.

export type QrDotShape =
  | "square"
  | "dot"
  | "rounded"
  | "classy"
  | "classy-rounded"
  | "extra-rounded";

export type QrCornerSquareShape = "square" | "dot" | "extra-rounded";

export type QrCornerDotShape = "square" | "dot";

export interface QrOptions {
  /** Цвет модулей QR */
  foregroundColor?: string;
  /** Цвет фона */
  backgroundColor?: string;
  /** Форма обычных модулей */
  dotShape?: QrDotShape;
  /** Форма внешнего уголка */
  cornerSquareShape?: QrCornerSquareShape;
  /** Форма внутренней точки уголка */
  cornerDotShape?: QrCornerDotShape;
}
