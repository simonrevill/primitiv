import { useCallback, useEffect, useRef } from "react";

import { useCarouselContext } from "./useCarouselContext";

/**
 * Owns the Viewport-side scroll-state sync — bidirectional.
 *
 * **State → scroll.** When `currentPage` flips for any reason
 * (NextTrigger, Indicator click, autoplay tick, imperative goTo), the
 * effect locates the first slide of the target page via the published
 * `slidesRef`, reads its `getBoundingClientRect` relative to the
 * viewport, and calls `scrollTo` so the visual surface tracks React
 * state. The current `scrollLeft` is included in the target so the
 * calculation is correct mid-scroll.
 *
 * **Scroll → state.** When the user swipes the viewport, the browser
 * fires `scrollsnapchange` with the new snap target. The handler
 * looks up which slide that target is, computes
 * `floor(slideIndex / slidesPerPage)`, and calls `goTo` on the new
 * page (skipping when the page is unchanged so consumers don't see
 * spurious onPageChange callbacks). The IntersectionObserver fallback
 * for browsers without scrollsnapchange ships in a later cycle.
 */
export function useCarouselViewport() {
  const { slidesRef, slideKeys, slidesPerPage, currentPage, goTo } =
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

  // User-driven scroll → state. Listen for scrollsnapchange and update
  // currentPage from the snapped slide's index. The viewport ref is
  // guaranteed populated post-commit (callback ref runs first).
  useEffect(() => {
    const viewport = internalRef.current!;

    const handler = (event: Event) => {
      const target = (event as Event & { snapTargetInline?: Element })
        .snapTargetInline;

      // findIndex returns -1 when the snap target isn't one of our
      // registered slides — e.g. a consumer-wrapped element inside the
      // viewport. In that case there's no page to derive, so bail.
      const slideIndex = slideKeys.findIndex(
        (key) => slidesRef.current!.get(key) === target,
      );
      if (slideIndex < 0) return;

      const targetPage = Math.floor(slideIndex / slidesPerPage);
      if (targetPage !== currentPage) goTo(targetPage);
    };

    viewport.addEventListener("scrollsnapchange", handler);
    return () => viewport.removeEventListener("scrollsnapchange", handler);
  }, [slideKeys, slidesRef, slidesPerPage, currentPage, goTo]);

  return { viewportRef };
}
