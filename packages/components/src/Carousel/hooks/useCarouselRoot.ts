import { useCallback, useMemo, useRef, useState } from "react";

import type { CarouselContextValue } from "../types";

type UseCarouselRootProps = {
  /** Uncontrolled seed for the active page. Defaults to `0`. */
  defaultPage?: number;
  /** Controlled active page. When provided, the hook is in controlled
   * mode and defers all state changes back through `onPageChange`. */
  page?: number;
  /** Required when `page` is provided. Invoked with the next page
   * value the Root would like to advance to. */
  onPageChange?: (page: number) => void;
};

/**
 * Owns the Root-side state for a Carousel: the slide registration map,
 * the ordered list of registered slide keys, and the active page.
 *
 * Slide keys are tracked as `useState` so registration and unregistration
 * trigger a re-render — descendants that depend on slide order, count, or
 * the active page (e.g. each `Carousel.Slide`'s `data-index` /
 * `data-total` / `data-state`) update automatically when slides mount
 * and unmount.
 *
 * The active page supports two modes, statically discriminated at the
 * `CarouselRootProps` level:
 *
 * - **Uncontrolled** — pass `defaultPage` (or omit it for `0`); the hook
 *   owns updates internally via the `next` / `previous` callbacks.
 * - **Controlled** — pass `page` and `onPageChange`; the hook defers
 *   every change back through `onPageChange` and reads the live value
 *   from the `page` prop on every render.
 */
export function useCarouselRoot({
  defaultPage = 0,
  page,
  onPageChange,
}: UseCarouselRootProps = {}) {
  const slidesRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const [slideKeys, setSlideKeys] = useState<string[]>([]);
  const [internalPage, setInternalPage] = useState(defaultPage);
  const isControlled = page !== undefined;
  const currentPage = isControlled ? page : internalPage;

  const registerSlide = useCallback(
    (key: string, element: HTMLDivElement | null) => {
      if (element) {
        slidesRef.current.set(key, element);
      } else {
        slidesRef.current.delete(key);
      }
      setSlideKeys(Array.from(slidesRef.current.keys()));
    },
    [],
  );

  const next = useCallback(() => {
    if (isControlled) {
      onPageChange?.(currentPage + 1);
    } else {
      setInternalPage((p) => p + 1);
    }
  }, [isControlled, onPageChange, currentPage]);

  const previous = useCallback(() => {
    if (isControlled) {
      onPageChange?.(currentPage - 1);
    } else {
      setInternalPage((p) => p - 1);
    }
  }, [isControlled, onPageChange, currentPage]);

  const contextValue = useMemo<CarouselContextValue>(
    () => ({ registerSlide, slideKeys, currentPage, next, previous }),
    [registerSlide, slideKeys, currentPage, next, previous],
  );

  return { contextValue };
}
