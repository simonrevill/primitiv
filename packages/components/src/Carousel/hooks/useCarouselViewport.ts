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
    isProgrammaticScrollRef,
    pendingWrapRef,
  } = useCarouselContext();
  const internalRef = useRef<HTMLDivElement>(null);
  // Set to true by the scrollsnapchange handler and the IntersectionObserver
  // callback before they call goTo(), so the scroll effect knows the page
  // change originated from a user scroll (CSS snap already positioned the
  // viewport) and must not call scrollTo() again.
  const isUserScrollRef = useRef(false);

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
    // A user swipe via CSS scroll-snap has already positioned the viewport;
    // calling scrollTo on top would start a second animation and cause jank.
    if (isUserScrollRef.current) {
      isUserScrollRef.current = false;
      return;
    }

    const viewport = internalRef.current!;

    // Loop boundary wrap: instead of the long backwards scroll a
    // regular wrap would produce, redirect into the matching edge
    // clone so the new page appears to slide in from the natural
    // direction. Capturing the direction here lets the scrollend
    // callback know whether to follow up with a silent snap to the
    // real slide once the animation settles.
    const wrapDirection = pendingWrapRef.current;
    pendingWrapRef.current = null;

    let targetEl: Element;
    if (wrapDirection === "forward") {
      targetEl = viewport.querySelector(
        '[data-carousel-slide-clone="trailing"]',
      )!;
    } else if (wrapDirection === "backward") {
      targetEl = viewport.querySelector(
        '[data-carousel-slide-clone="leading"]',
      )!;
    } else {
      targetEl = slidesRef.current!.get(firstSlideKey)!;
    }

    const slideRect = targetEl.getBoundingClientRect();
    const viewportRect = viewport.getBoundingClientRect();
    const targetScrollLeft =
      viewport.scrollLeft + (slideRect.left - viewportRect.left);

    viewport.scrollTo({ left: targetScrollLeft, behavior: scrollBehavior });

    // Clear the programmatic-scroll guard once the animation settles.
    // `scrollend` is the reliable signal in real browsers; the setTimeout
    // is a fallback for environments (jsdom, older Safari) that don't fire
    // it. The timeout is longer than any typical smooth-scroll duration so
    // real-browser IO entries that fire mid-animation are still suppressed.
    // The `cleared` guard makes the body idempotent — real browsers fire
    // scrollend AND the setTimeout fallback later, but the wrap-snap must
    // only happen once.
    let cleared = false;
    const clearFlag = () => {
      if (cleared) return;
      cleared = true;
      isProgrammaticScrollRef.current = false;
      if (wrapDirection !== null) {
        // Silent snap from the clone we just scrolled into back to the
        // matching real slide so scrollLeft re-enters the normal range.
        // `instant` skips scroll-behavior: smooth, so the user only ever
        // sees the smooth animation into the clone — never this re-anchor.
        const realEl = slidesRef.current!.get(firstSlideKey)!;
        const realRect = realEl.getBoundingClientRect();
        const realViewportRect = viewport.getBoundingClientRect();
        const realTarget =
          viewport.scrollLeft + (realRect.left - realViewportRect.left);
        viewport.scrollTo({ left: realTarget, behavior: "instant" });
      }
    };
    viewport.addEventListener("scrollend", clearFlag, { once: true });
    const timeoutId = setTimeout(() => {
      viewport.removeEventListener("scrollend", clearFlag);
      clearFlag();
    }, 600);
    return () => {
      clearTimeout(timeoutId);
      viewport.removeEventListener("scrollend", clearFlag);
    };
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
      // viewport, or one of the loop-wrap clones.
      const slideIndex = slideKeys.findIndex(
        (key) => slidesRef.current!.get(key) === target,
      );
      if (slideIndex < 0) {
        // Trailing clone: the user swiped past slide-N. Re-anchor the
        // viewport to real slide-0 with an instant scroll so they're
        // not stuck on a clone position, then dispatch the wrap goTo.
        const cloneType =
          target instanceof HTMLElement
            ? target.dataset.carouselSlideClone
            : undefined;
        if (cloneType === "trailing") {
          const realFirstKey = slideKeys[0];
          if (!realFirstKey) return;
          const viewport = internalRef.current!;
          const realSlide = slidesRef.current!.get(realFirstKey)!;
          const realRect = realSlide.getBoundingClientRect();
          const viewportRect = viewport.getBoundingClientRect();
          viewport.scrollTo({
            left:
              viewport.scrollLeft + (realRect.left - viewportRect.left),
            behavior: "instant",
          });
          isUserScrollRef.current = true;
          goTo(0);
        }
        return;
      }

      const targetPage = Math.floor(slideIndex / effectiveSlidesPerMove);
      if (targetPage !== currentPage) {
        isUserScrollRef.current = true;
        goTo(targetPage);
      }
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
        // Guard: if a programmatic scroll is in flight (e.g. user clicked
        // NextTrigger and the smooth-scroll animation hasn't settled), the
        // IO may still see the old slide as ≥0.6 visible. Calling goTo
        // here would undo the navigation, so skip until the flag clears.
        if (targetPage !== currentPage && !isProgrammaticScrollRef.current) {
          isUserScrollRef.current = true;
          goTo(targetPage);
        }
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
