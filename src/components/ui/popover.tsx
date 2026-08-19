"use client";

import { createPortal } from "react-dom";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

const VIEWPORT_SAFE_MARGIN = 8;
const DEFAULT_PANEL_GAP = 8;

interface PopoverProps {
  trigger: (props: {
    onClick: () => void;
    "aria-expanded": boolean;
  }) => ReactNode;
  children: ReactNode | ((props: { close: () => void }) => ReactNode);
  align?: "start" | "end";
  /** Отступ панели от триггера, px */
  gap?: number;
  panelClassName?: string;
  rootClassName?: string;
}

// Небольшой самостоятельный popover-примитив общего назначения (в проекте
// нет Radix/Headless UI). Панель рендерится порталом в document.body —
// иначе её мог бы обрезать overflow/z-index любого родителя по пути —
// и позиционируется в fixed-координатах триггера, а не CSS-обёрткой.
// Закрывается по клику снаружи и по Escape.
export function Popover({
  trigger,
  children,
  align = "start",
  gap = DEFAULT_PANEL_GAP,
  panelClassName = "",
  rootClassName = "",
}: PopoverProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelStyle, setPanelStyle] = useState<CSSProperties>({});

  const reposition = () => {
    if (!triggerRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const panelWidth = panelRef.current?.offsetWidth ?? 0;
    let left =
      align === "end" ? triggerRect.right - panelWidth : triggerRect.left;
    left = Math.min(
      Math.max(left, VIEWPORT_SAFE_MARGIN),
      window.innerWidth - panelWidth - VIEWPORT_SAFE_MARGIN,
    );
    setPanelStyle({
      position: "fixed",
      top: triggerRect.bottom + gap,
      left,
      zIndex: 50,
    });
  };

  useLayoutEffect(() => {
    if (open) reposition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, align, gap]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        panelRef.current?.contains(target)
      )
        return;
      setOpen(false);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <div ref={triggerRef} className={`inline-block ${rootClassName}`}>
      {trigger({ onClick: () => setOpen((v) => !v), "aria-expanded": open })}
      {open &&
        createPortal(
          <div ref={panelRef} style={panelStyle} className={panelClassName}>
            {typeof children === "function"
              ? children({ close: () => setOpen(false) })
              : children}
          </div>,
          document.body,
        )}
    </div>
  );
}
