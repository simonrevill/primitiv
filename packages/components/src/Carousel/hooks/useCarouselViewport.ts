import { KeyboardEvent, useCallback, useEffect, useMemo, useRef } from "react";

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
 * calculation is correct mid-scroll. Each scroll-effect run also
 * asserts `isProgrammaticScrollRef` so the wrap-clone branch of the
 * scrollsnapchange handler can recognise edge-clone snap landings as
 * the result of our own scroll (initial-mount layout snap, smooth
 * wrap into a clone) rather than a user wrap intent. When a wrap is
 * still in flight at cleanup time (rapid follow-up navigation while
 * the smooth scroll into a clone hasn't settled), the cleanup invokes
 * the wrap re-anchor synchronously so the next scroll-effect computes
 * its target relative to the real slide rather than the stale clone
 * position.
 *
 * **Scroll → state.** When the user swipes the viewport, the browser
 * fires `scrollsnapchange` with the new snap target. The handler
 * looks up which slide that target is, computes
 * `floor(slideIndex / slidesPerPage)`, and calls `goTo` on the new
 * page (skipping when the page is unchanged so consumers don't see
 * spurious onPageChange callbacks). When the snap target is one of
 * the loop-wrap clones, the handler re-anchors the viewport and
 * dispatches the wrap goTo — but only when `isProgrammaticScrollRef`
 * is clear and the wrap target differs from `currentPage`. Otherwise
 * the snap-change is a side effect of our own programmatic wrap (or
 * the initial-mount layout settling on the leading clone) and
 * driving a page change here would set `isUserScrollRef` sticky-true
 * and short-circuit the next legitimate navigation.
 */
export function useCarouselViewport() {
  const {
    slidesRef,
    slideKeys,
    slidesPerPage,
    effectiveSlidesPerMove,
    totalPages,
    currentPage,
    goTo,
    next,
    previous,
    canGoNext,
    canGoPrevious,
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

    // Mark the scroll as programmatic for any browser-fired
    // scrollsnapchange that lands on an edge clone while our scrollTo
    // is in flight (initial-mount layout snap, smooth wrap into a
    // clone). next() / previous() also set this — re-asserting here
    // covers indicator-driven goTo and the initial scroll on mount,
    // neither of which goes through next() / previous().
    isProgrammaticScrollRef.current = true;

    // Loop boundary wrap: instead of the long backwards scroll a
    // regular wrap would produce, redirect into the matching edge
    // clone so the new page appears to slide in from the natural
    // direction. Capturing the direction here lets the scrollend
    // callback know whether to follow up with a silent snap to the
    // real slide once the animation settles.
    //
    // Reduced motion bypasses the clone hop: when scrollBehavior is
    // already "instant" there's no smooth animation to host, so the
    // round-trip clone→real snap would be two no-op scrolls instead
    // of one. Drop the wrap intent and fall through to the real slide.
    const wrapDirection =
      scrollBehavior === "instant" ? null : pendingWrapRef.current;
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
        // The lookup may miss when this runs from the cleanup path on
        // unmount (slide callback refs have already detached); skip the
        // re-anchor in that case — the viewport is going away anyway.
        const realEl = slidesRef.current!.get(firstSlideKey);
        if (!realEl) return;
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
      // A rapid follow-up navigation re-runs the effect while the wrap's
      // smooth scroll is still in flight. Without re-anchoring here, the
      // next effect computes its target from a scrollLeft parked over the
      // edge clone and the smooth scroll lands far away — exactly the
      // long backwards scroll the clones exist to prevent. clearFlag is
      // idempotent via the `cleared` guard, so this is a no-op when
      // scrollend or the timeout fallback already fired.
      clearFlag();
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
        // Trailing/leading clone: the user swiped past the slide list
        // edge. Re-anchor the viewport to the real wrap-target slide
        // with an instant scroll so they're not stuck on a clone
        // position, then dispatch the wrap goTo.
        const cloneType =
          target instanceof HTMLElement
            ? target.dataset.carouselSlideClone
            : undefined;
        if (cloneType !== "trailing" && cloneType !== "leading") return;

        const wrapPage = cloneType === "trailing" ? 0 : totalPages - 1;

        // Two ways the snap target ends up on an edge clone without a
        // user actually wrapping: (a) our own scroll-effect targeted
        // the clone for the wrap animation and the smooth scroll just
        // settled, (b) the browser reported the leading clone as the
        // initial snap on mount before we'd scrolled to slide-0. In
        // both cases the page state is already correct — driving a
        // page change here would set isUserScrollRef sticky-true and
        // short-circuit the next legitimate navigation. The
        // scroll-effect's scrollend handler does the silent re-anchor
        // for case (a); case (b) needs no re-anchor because the
        // initial scrollTo is already heading to the active page.
        if (
          isProgrammaticScrollRef.current ||
          wrapPage === currentPage
        ) {
          return;
        }

        const realKey = slideKeys[wrapPage * effectiveSlidesPerMove];

        const viewport = internalRef.current!;
        const realSlide = slidesRef.current!.get(realKey)!;
        const realRect = realSlide.getBoundingClientRect();
        const viewportRect = viewport.getBoundingClientRect();
        viewport.scrollTo({
          left: viewport.scrollLeft + (realRect.left - viewportRect.left),
          behavior: "instant",
        });
        isUserScrollRef.current = true;
        goTo(wrapPage);
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
    totalPages,
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

  // Keyboard navigation per the WAI-ARIA Carousel pattern: arrow keys
  // route through the same imperative API as the trigger buttons so the
  // smooth scroll and loop-wrap animation match the click path. The
  // event.target === currentTarget guard restricts handling to the
  // Viewport itself — focus inside a slide (e.g. on a link or form
  // control) keeps its native arrow-key semantics.
  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      // Restrict to keypresses originating on the Viewport itself —
      // focus inside a slide (e.g. on a link or form control) keeps
      // its native arrow-key semantics.
      if (event.target !== event.currentTarget) return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        if (canGoNext) next();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        if (canGoPrevious) previous();
      } else if (event.key === "Home") {
        event.preventDefault();
        goTo(0);
      } else if (event.key === "End") {
        event.preventDefault();
        goTo(totalPages - 1);
      }
    },
    [canGoNext, canGoPrevious, next, previous, goTo, totalPages],
  );

  return { viewportRef, onKeyDown };
}
