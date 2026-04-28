import { useCallback, useMemo, useRef, useState } from "react";

import type { CarouselContextValue, CarouselRootProps } from "../types";

/**
 * Owns the Root-side state for a Carousel: the slide registration map,
 * the ordered list of registered slide keys, and the active page.
 *
 * Slide keys are tracked as `useState` so registration and unregistration
 * trigger a re-render — descendants that depend on slide order, count, or
 * the active page (e.g. each `Carousel.Slide`'s `data-index` /
 * `data-total` / `data-state`) update automatically when slides mount and
 * unmount.
 *
 * The active page is uncontrolled: callers seed it with `defaultPage`
 * (defaults to `0`); the hook owns updates internally via the `next` and
 * `previous` callbacks exposed on the context.
 */
export function useCarouselRoot({
  defaultPage = 0,
}: Pick<CarouselRootProps, "defaultPage"> = {}) {
  const slidesRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const [slideKeys, setSlideKeys] = useState<string[]>([]);
  const [internalPage, setInternalPage] = useState(defaultPage);
  const currentPage = internalPage;

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
    setInternalPage((page) => page + 1);
  }, []);

  const previous = useCallback(() => {
    setInternalPage((page) => page - 1);
  }, []);

  const contextValue = useMemo<CarouselContextValue>(
    () => ({ registerSlide, slideKeys, currentPage, next, previous }),
    [registerSlide, slideKeys, currentPage, next, previous],
  );

  return { contextValue };
}
