import { PointerEvent, useEffect, useState } from "react";

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

  const [drag, setDrag] = useState<DragState | null>(null);

  // A drag is tracked on `window`, not the handle, so the pointer can
  // travel anywhere once it is down; the listeners live only for the
  // lifetime of the drag.
  useEffect(() => {
    if (!drag) {
      return;
    }

    function handleMove(event: globalThis.PointerEvent) {
      setColumnWidth(
        depth,
        Math.max(0, drag.startWidth + event.clientX - drag.startX),
      );
    }

    function endDrag() {
      setDrag(null);
    }

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
    };
  }, [drag, depth, setColumnWidth]);

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    onPointerDown?.(event);
    // The handle only renders inside a Column (enforced by context), so
    // its column ancestor is always present in the DOM. Once a column
    // has been resized its width is known; before that, measure it.
    const column = event.currentTarget.closest<HTMLElement>(
      "[data-miller-columns-column]",
    )!;
    const startWidth =
      columnWidths.get(depth) ?? column.getBoundingClientRect().width;
    setDrag({ startX: event.clientX, startWidth });
  }

  return {
    handleProps: {
      role: "separator" as const,
      "aria-orientation": "vertical" as const,
      "data-miller-columns-resize-handle": "",
      ...(drag ? { "data-dragging": "" } : {}),
      onPointerDown: handlePointerDown,
      ...rest,
    },
  };
}
