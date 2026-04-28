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
  const { registerSlide, slideKeys } = useCarouselContext();
  const slideKey = useId();

  const slideRef = useCallback(
    (element: HTMLDivElement | null) => {
      registerSlide(slideKey, element);
    },
    [registerSlide, slideKey],
  );

  const index = slideKeys.indexOf(slideKey);
  const total = slideKeys.length;

  return { slideRef, index, total };
}
