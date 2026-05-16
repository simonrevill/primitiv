import { PointerEvent, useEffect, useRef, useState } from "react";

import type { MillerColumnsResizeHandleProps } from "../types";

import { useMillerColumnsContext } from "./useMillerColumnsContext";
import { useMillerColumnsColumnContext } from "./useMillerColumnsColumnContext";

type DragState = { startX: number; startWidth: number };

export function useMillerColumnsResizeHandle({
  onPointerDown,
  ...rest
}: MillerColumnsResizeHandleProps) {
  const { columnWidths, setColumnWidth } = useMillerColumnsContext();
  const { depth } = useMillerColumnsColumnContext();

  const dragRef = useRef<DragState | null>(null);
  const [dragging, setDragging] = useState(false);

  // A drag is tracked on `window`, not the handle, so the pointer can
  // travel anywhere once it is down; the listeners live only for the
  // lifetime of the drag.
  useEffect(() => {
    if (!dragging) {
      return;
    }

    function handleMove(event: globalThis.PointerEvent) {
      const drag = dragRef.current;
      if (!drag) {
        return;
      }
      setColumnWidth(
        depth,
        Math.max(0, drag.startWidth + event.clientX - drag.startX),
      );
    }

    function endDrag() {
      dragRef.current = null;
      setDragging(false);
    }

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
    };
  }, [dragging, depth, setColumnWidth]);

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    onPointerDown?.(event);
    const column = event.currentTarget.closest<HTMLElement>(
      "[data-miller-columns-column]",
    );
    const startWidth =
      columnWidths.get(depth) ??
      column?.getBoundingClientRect().width ??
      0;
    dragRef.current = { startX: event.clientX, startWidth };
    setDragging(true);
  }

  return {
    handleProps: {
      role: "separator" as const,
      "aria-orientation": "vertical" as const,
      "data-miller-columns-resize-handle": "",
      onPointerDown: handlePointerDown,
      ...rest,
    },
  };
}
