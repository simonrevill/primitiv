import { useCallback, useMemo, useRef, useState } from "react";

import type { CarouselContextValue } from "../types";

/**
 * Owns the Root-side state for a Carousel. Currently holds the slide
 * registration map and the ordered list of registered slide keys; future
 * cycles add active-page state, autoplay, etc.
 *
 * Slide keys are tracked as `useState` so registration and unregistration
 * trigger a re-render — descendants that depend on slide order or count
 * (e.g. each `Carousel.Slide`'s `data-index` / `data-total`) update
 * automatically when slides mount and unmount.
 */
export function useCarouselRoot() {
  const slidesRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const [slideKeys, setSlideKeys] = useState<string[]>([]);

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

  const contextValue = useMemo<CarouselContextValue>(
    () => ({ registerSlide, slideKeys }),
    [registerSlide, slideKeys],
  );

  return { contextValue };
}
