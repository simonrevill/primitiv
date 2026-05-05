import { useCallback, useEffect, useMemo, useRef } from "react";

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
  const {
    slidesRef,
    slideKeys,
    slidesPerPage,
    effectiveSlidesPerMove,
    currentPage,
    goTo,
    transition,
    refreshTick,
    visibleSlideIndicesRef,
    setSlideInView,
  } = useCarouselContext();
  const internalRef = useRef<HTMLDivElement>(null);

  // Callback ref so the consumer can compose their own ref with ours
  // via `composeRefs` later (cycle 22 introduces asChild). For now,
  // it just stashes the node.
  const viewportRef = useCallback((node: HTMLDivElement | null) => {
    internalRef.current = node;
  }, []);

  // Read prefers-reduced-motion once on mount; choose scrollTo
  // behavior accordingly so we don't fight the OS-level setting.
  const scrollBehavior = useMemo<ScrollBehavior>(
    () =>
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    [],
  );

  useEffect(() => {
    // transition="none" hands the visual to consumer CSS; we don't
    // touch viewport.scrollTo at all in that mode.
    if (transition !== "slide") return;
    const firstSlideIndex = currentPage * effectiveSlidesPerMove;
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

    viewport.scrollTo({ left: targetScrollLeft, behavior: scrollBehavior });
  }, [
    transition,
    currentPage,
    effectiveSlidesPerMove,
    slideKeys,
    slidesRef,
    refreshTick,
    scrollBehavior,
  ]);

  // User-driven scroll → state. Listen for scrollsnapchange and update
  // currentPage from the snapped slide's index. The viewport ref is
  // guaranteed populated post-commit (callback ref runs first).
  useEffect(() => {
    if (transition !== "slide") return;
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

      const targetPage = Math.floor(slideIndex / effectiveSlidesPerMove);
      if (targetPage !== currentPage) goTo(targetPage);
    };

    viewport.addEventListener("scrollsnapchange", handler);
    return () => viewport.removeEventListener("scrollsnapchange", handler);
  }, [
    transition,
    slideKeys,
    slidesRef,
    effectiveSlidesPerMove,
    currentPage,
    goTo,
  ]);

  // IntersectionObserver fallback for browsers without scrollsnapchange,
  // and the source of truth for isInView() on the imperative API. The
  // observer fires whenever a slide crosses the 0.6 visibility
  // threshold; the lowest-index visible slide derives the active page.
  useEffect(() => {
    if (transition !== "slide") return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Both lookups (slideKeys.findIndex → registered key, and the
        // slidesRef get → element) are guaranteed to resolve: the
        // observer only observes elements registered into slidesRef
        // alongside their slideKey, and is disconnected on cleanup
        // before slides can unmount.
        for (const entry of entries) {
          const idx = slideKeys.findIndex(
            (key) => slidesRef.current!.get(key) === entry.target,
          );
          setSlideInView(
            idx,
            entry.isIntersecting && entry.intersectionRatio >= 0.6,
          );
        }

        const visible = visibleSlideIndicesRef.current;
        if (visible.size === 0) return;
        const firstVisible = Math.min(...visible);
        const targetPage = Math.floor(firstVisible / effectiveSlidesPerMove);
        if (targetPage !== currentPage) goTo(targetPage);
      },
      { threshold: 0.6 },
    );

    for (const key of slideKeys) {
      observer.observe(slidesRef.current!.get(key)!);
    }

    return () => observer.disconnect();
  }, [
    transition,
    slideKeys,
    slidesRef,
    effectiveSlidesPerMove,
    currentPage,
    goTo,
    setSlideInView,
    visibleSlideIndicesRef,
  ]);

  return { viewportRef };
}
