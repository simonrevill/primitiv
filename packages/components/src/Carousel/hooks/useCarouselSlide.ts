import { useCallback, useId } from "react";

import { useCarouselContext } from "./useCarouselContext";

/**
 * Per-slide hook: self-registers with the Root so the Root can compute
 * the live slide count, and exposes the slide's zero-based `index` plus
 * the current `total`.
 *
 * The returned `slideRef` is a callback ref — attached to the rendered
 * slide element so registration runs synchronously during commit. Using
 * a callback ref (rather than `useEffect`) keeps DOM-attachment and
 * registration in lockstep, which matters when slides mount or unmount
 * during a render pass driven by an external state change.
 */
export function useCarouselSlide() {
  const { registerSlide, slideKeys, slidesPerPage, currentPage } =
    useCarouselContext();
  const slideKey = useId();

  const slideRef = useCallback(
    (element: HTMLDivElement | null) => {
      registerSlide(slideKey, element);
    },
    [registerSlide, slideKey],
  );

  const index = slideKeys.indexOf(slideKey);
  const total = slideKeys.length;
  // With slidesPerPage > 1 the slide is on the active "page" iff its
  // floor-divided index matches currentPage. With the default of 1 this
  // collapses to index === currentPage.
  const isActive = index >= 0 && Math.floor(index / slidesPerPage) === currentPage;
  const state: "active" | "inactive" = isActive ? "active" : "inactive";

  return { slideRef, index, total, state };
}
