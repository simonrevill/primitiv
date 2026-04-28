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
  /** When `true`, navigation wraps at the ends. When `false` (default),
   * `next()` is a no-op at the last page and `previous()` is a no-op
   * at the first. */
  loop?: boolean;
};

/**
 * Owns the Root-side state for a Carousel: the slide registration map,
 * the ordered list of registered slide keys, and the active page.
 *
 * Slide keys are tracked as `useState` so registration and unregistration
 * trigger a re-render — descendants that depend on slide order, count, or
 * the active page (e.g. each `Carousel.Slide`'s `data-index` /
 * `data-total` / `data-state`, and the prev/next triggers' `disabled`
 * attribute) update automatically when slides mount and unmount.
 *
 * The active page supports two modes, statically discriminated at the
 * `CarouselRootProps` level:
 *
 * - **Uncontrolled** — pass `defaultPage` (or omit it for `0`); the hook
 *   owns updates internally via the `next` / `previous` callbacks.
 * - **Controlled** — pass `page` and `onPageChange`; the hook defers
 *   every change back through `onPageChange` and reads the live value
 *   from the `page` prop on every render.
 *
 * `loop` toggles boundary behaviour: when `true`, `next` and `previous`
 * wrap around using modular arithmetic; when `false` (default) both
 * methods short-circuit at the ends. `canGoNext` / `canGoPrevious` on
 * the published context drive the `disabled` attribute on the prev/next
 * triggers.
 */
export function useCarouselRoot({
  defaultPage = 0,
  page,
  onPageChange,
  loop = false,
}: UseCarouselRootProps = {}) {
  const slidesRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const [slideKeys, setSlideKeys] = useState<string[]>([]);
  const [internalPage, setInternalPage] = useState(defaultPage);
  const isControlled = page !== undefined;
  const currentPage = isControlled ? page : internalPage;
  const total = slideKeys.length;

  // Boundary derivation: navigation requires at least one slide. With
  // loop, every position has a forward and backward target. Without,
  // the ends clamp.
  const canGoPrevious = total > 0 && (loop || currentPage > 0);
  const canGoNext = total > 0 && (loop || currentPage < total - 1);

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

  // next/previous are only reachable via Carousel.NextTrigger /
  // Carousel.PreviousTrigger — both are disabled by the HTML disabled
  // attribute when canGoNext / canGoPrevious is false, so the click
  // never fires at boundaries. Guards become reachable (and necessary)
  // once the imperative API or autoplay land; they're added then.
  const next = useCallback(() => {
    const target = (currentPage + 1) % total;
    if (isControlled) {
      onPageChange?.(target);
    } else {
      setInternalPage(target);
    }
  }, [currentPage, total, isControlled, onPageChange]);

  const previous = useCallback(() => {
    const target = (currentPage - 1 + total) % total;
    if (isControlled) {
      onPageChange?.(target);
    } else {
      setInternalPage(target);
    }
  }, [currentPage, total, isControlled, onPageChange]);

  const contextValue = useMemo<CarouselContextValue>(
    () => ({
      registerSlide,
      slideKeys,
      currentPage,
      canGoNext,
      canGoPrevious,
      next,
      previous,
    }),
    [
      registerSlide,
      slideKeys,
      currentPage,
      canGoNext,
      canGoPrevious,
      next,
      previous,
    ],
  );

  return { contextValue };
}
