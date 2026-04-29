import { useCallback, useEffect, useRef } from "react";

import { useCarouselContext } from "./useCarouselContext";

/**
 * Owns the Viewport-side scroll-state sync. When `currentPage` flips
 * for any reason (NextTrigger, Indicator click, autoplay tick,
 * imperative goTo), the effect locates the first slide of the target
 * page via the published `slidesRef`, reads its `getBoundingClientRect`
 * relative to the viewport, and calls `scrollTo` so the visual surface
 * tracks React state. The current `scrollLeft` is included in the
 * target so the calculation is correct mid-scroll.
 */
export function useCarouselViewport() {
  const { slidesRef, slideKeys, slidesPerPage, currentPage } =
    useCarouselContext();
  const internalRef = useRef<HTMLDivElement>(null);

  // Callback ref so the consumer can compose their own ref with ours
  // via `composeRefs` later (cycle 22 introduces asChild). For now,
  // it just stashes the node.
  const viewportRef = useCallback((node: HTMLDivElement | null) => {
    internalRef.current = node;
  }, []);

  useEffect(() => {
    const firstSlideIndex = currentPage * slidesPerPage;
    const firstSlideKey = slideKeys[firstSlideIndex];
    // No slides registered yet, or page out of range: nothing to scroll to.
    if (!firstSlideKey) return;

    // Both viewport ref and the slide element are guaranteed populated
    // here — the effect runs post-commit (after callback refs fire) and
    // any key in slideKeys was just registered into slidesRef in
    // lockstep by useCarouselRoot.registerSlide.
    const viewport = internalRef.current!;
    const slideEl = slidesRef.current!.get(firstSlideKey)!;

    const slideRect = slideEl.getBoundingClientRect();
    const viewportRect = viewport.getBoundingClientRect();
    const targetScrollLeft =
      viewport.scrollLeft + (slideRect.left - viewportRect.left);

    viewport.scrollTo({ left: targetScrollLeft, behavior: "smooth" });
  }, [currentPage, slidesPerPage, slideKeys, slidesRef]);

  return { viewportRef };
}
