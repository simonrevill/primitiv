import {
  FocusEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { CarouselAutoplay, CarouselContextValue } from "../types";

const DEFAULT_AUTOPLAY_DELAY_MS = 4000;

function resolveAutoplay(autoplay: CarouselAutoplay | undefined): {
  enabled: boolean;
  delay: number;
} {
  if (autoplay === true)
    return { enabled: true, delay: DEFAULT_AUTOPLAY_DELAY_MS };
  if (autoplay && typeof autoplay === "object")
    return { enabled: true, delay: autoplay.delay };
  return { enabled: false, delay: DEFAULT_AUTOPLAY_DELAY_MS };
}

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
  /** Uncontrolled seed for the playing flag. Defaults to `false`. */
  defaultPlaying?: boolean;
  /** Controlled playing flag. When provided, the hook is in controlled
   * mode and defers all state changes back through `onPlayingChange`. */
  playing?: boolean;
  /** Required when `playing` is provided. Invoked with the proposed
   * next playing value. */
  onPlayingChange?: (playing: boolean) => void;
  /** Autoplay configuration — see {@link CarouselAutoplay}. */
  autoplay?: CarouselAutoplay;
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
  defaultPlaying = false,
  playing,
  onPlayingChange,
  autoplay,
}: UseCarouselRootProps = {}) {
  const { enabled: autoplayEnabled, delay: autoplayDelay } =
    resolveAutoplay(autoplay);
  const slidesRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const [slideKeys, setSlideKeys] = useState<string[]>([]);
  const [internalPage, setInternalPage] = useState(defaultPage);
  const isControlled = page !== undefined;
  const currentPage = isControlled ? page : internalPage;
  const total = slideKeys.length;

  const [internalPlaying, setInternalPlaying] = useState(defaultPlaying);
  const isPlayingControlled = playing !== undefined;
  const currentPlaying = isPlayingControlled ? playing : internalPlaying;

  // Tracked separately so a focus move between two descendants of the
  // Root (e.g. tabbing from Prev to Next) doesn't release the pause —
  // mouseLeave only fires when the pointer exits the Root's outer
  // boundary, and onBlur's relatedTarget tells us whether focus is
  // still inside.
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  // Per the WAI-ARIA APG carousel example: when the user explicitly
  // resumes the slideshow via PlayPauseTrigger, the hover/focus pause
  // is suspended for the lifetime of that playing session — otherwise
  // they'd fight a pause every time the pointer was already over the
  // carousel. The ref is set inside togglePlaying() on a false→true
  // transition and reset by the effect below when playing flips back
  // to false. External (non-trigger) playing changes don't set it.
  const userInitiatedPlayRef = useRef(false);
  const suspended =
    (hovered || focused) && !userInitiatedPlayRef.current;

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

  const goTo = useCallback(
    (target: number) => {
      if (isControlled) {
        onPageChange?.(target);
      } else {
        setInternalPage(target);
      }
    },
    [isControlled, onPageChange],
  );

  // Autoplay timer. Schedules a single setTimeout per active page; when
  // next() runs it bumps currentPage, which retriggers the effect with
  // a fresh timer. canGoNext gates the schedule so loop=false stops at
  // the last slide and loop=true wraps via next()'s modular arithmetic.
  // The suspended flag pauses the timer while the user is hovering or
  // has focus inside the Root, per WCAG 2.2.2.
  useEffect(() => {
    if (!autoplayEnabled || !currentPlaying || !canGoNext || suspended) {
      return;
    }
    const id = setTimeout(() => {
      next();
    }, autoplayDelay);
    return () => clearTimeout(id);
  }, [
    autoplayEnabled,
    currentPlaying,
    canGoNext,
    suspended,
    autoplayDelay,
    next,
  ]);

  // Handlers spread onto the Root <section>. mouseEnter / mouseLeave
  // fire once at the outer boundary (they don't bubble through inner
  // hovers). onFocus / onBlur in React do bubble; relatedTarget on
  // onBlur tells us whether focus is moving to another descendant —
  // in which case we keep `focused` true.
  const onMouseEnter = useCallback(() => setHovered(true), []);
  const onMouseLeave = useCallback(() => setHovered(false), []);
  const onFocus = useCallback(() => setFocused(true), []);
  const onBlur = useCallback((event: FocusEvent<HTMLElement>) => {
    const next = event.relatedTarget;
    if (!next || !event.currentTarget.contains(next)) {
      setFocused(false);
    }
  }, []);

  const rootHandlers = useMemo(
    () => ({ onMouseEnter, onMouseLeave, onFocus, onBlur }),
    [onMouseEnter, onMouseLeave, onFocus, onBlur],
  );

  const togglePlaying = useCallback(() => {
    const next = !currentPlaying;
    if (next) {
      userInitiatedPlayRef.current = true;
    }
    if (isPlayingControlled) {
      onPlayingChange?.(next);
    } else {
      setInternalPlaying(next);
    }
  }, [currentPlaying, isPlayingControlled, onPlayingChange]);

  // Reset the user-initiated flag when the playing session ends, so a
  // subsequent external (non-trigger) flip to playing=true doesn't
  // inherit the bypass.
  useEffect(() => {
    if (!currentPlaying) {
      userInitiatedPlayRef.current = false;
    }
  }, [currentPlaying]);

  const isAutoRotating = autoplayEnabled && currentPlaying;

  const contextValue = useMemo<CarouselContextValue>(
    () => ({
      registerSlide,
      slideKeys,
      currentPage,
      canGoNext,
      canGoPrevious,
      next,
      previous,
      goTo,
      playing: currentPlaying,
      togglePlaying,
      isAutoRotating,
    }),
    [
      registerSlide,
      slideKeys,
      currentPage,
      canGoNext,
      canGoPrevious,
      next,
      previous,
      goTo,
      currentPlaying,
      togglePlaying,
      isAutoRotating,
    ],
  );

  return { contextValue, rootHandlers };
}
