import { ComponentProps } from "react";

/**
 * Discriminated label shape for `Carousel.Root` — exactly one of
 * `ariaLabel` or `ariaLabelledBy` must be supplied so every carousel
 * has an accessible name (per the WAI-ARIA Carousel pattern). TypeScript
 * rejects shapes that supply both or neither.
 */
export type CarouselRootLabelProps =
  | { ariaLabel: string; ariaLabelledBy?: never }
  | { ariaLabel?: never; ariaLabelledBy: string };

/**
 * Uncontrolled page state — the Root owns the active page internally,
 * optionally seeded by `defaultPage`. The discriminated union below
 * rejects passing `page` or `onPageChange` alongside it.
 */
export type UncontrolledCarouselPageProps = {
  /** Uncontrolled active page index. Defaults to `0`. */
  defaultPage?: number;
  page?: never;
  onPageChange?: never;
};

/**
 * Controlled page state — the parent owns the active page; the Root
 * defers every state change back through `onPageChange`. Both props
 * must be supplied together.
 */
export type ControlledCarouselPageProps = {
  /** Controlled active page index. */
  page: number;
  /** Callback invoked when the active page should change (e.g. when the
   * user clicks `Carousel.NextTrigger` or `Carousel.PreviousTrigger`).
   * The callback is responsible for re-rendering with the new `page`. */
  onPageChange: (page: number) => void;
  defaultPage?: never;
};

/**
 * Discriminated state union — TypeScript rejects mixed shapes (e.g.
 * `defaultPage` + `page`, or `page` without `onPageChange`).
 */
export type CarouselRootPageStateProps =
  | UncontrolledCarouselPageProps
  | ControlledCarouselPageProps;

export type CarouselRootProps = Omit<
  ComponentProps<"section">,
  "aria-label" | "aria-labelledby"
> &
  CarouselRootLabelProps &
  CarouselRootPageStateProps & {
    /** When `true`, advancing past the last slide wraps to the first
     * (and vice versa) and `Carousel.NextTrigger` /
     * `Carousel.PreviousTrigger` are never auto-disabled at the ends.
     * When `false` (default), the triggers clamp at boundaries: Prev is
     * disabled at the first slide, Next at the last. */
    loop?: boolean;
  };

/**
 * Shape of the context published by `Carousel.Root` to descendants.
 * Fields are added as future cycles introduce shared state (active
 * page, autoplay, etc.).
 */
export type CarouselContextValue = {
  /** Self-registers a slide. Called as a callback ref by `Carousel.Slide`
   * with the rendered DOM node on mount and `null` on unmount. */
  registerSlide: (key: string, element: HTMLDivElement | null) => void;
  /** Ordered list of currently-mounted slide keys. The slide's index is
   * its position in this array; the array's length is the total. */
  slideKeys: string[];
  /** Zero-based index of the currently-active page. */
  currentPage: number;
  /** `true` when there is a forward navigation target (a slide ahead, or
   * `loop` is enabled and at least one slide is registered). Drives the
   * `disabled` attribute on `Carousel.NextTrigger` and short-circuits
   * `next()` when there's nowhere to go. */
  canGoNext: boolean;
  /** `true` when there is a backward navigation target. Drives the
   * `disabled` attribute on `Carousel.PreviousTrigger`. */
  canGoPrevious: boolean;
  /** Advance the active page by one step. No-op when `!canGoNext`. */
  next: () => void;
  /** Retreat the active page by one step. No-op when `!canGoPrevious`. */
  previous: () => void;
  /** Jump directly to `target` (zero-based page index). Used by
   * `Carousel.Indicator` to dispatch click-to-jump. */
  goTo: (target: number) => void;
};

export type CarouselViewportProps = ComponentProps<"div">;

export type CarouselSlideProps = Omit<ComponentProps<"div">, "aria-label"> & {
  /** Override the auto-generated `"N of M"` `aria-label`. Use this when
   * the slide has a more meaningful description than its position
   * (e.g. `"Hand-picked for you"`). When omitted, slides are labelled
   * with their live index and total in registration order. */
  ariaLabel?: string;
};

export type CarouselNextTriggerProps = ComponentProps<"button">;

export type CarouselPreviousTriggerProps = ComponentProps<"button">;

/**
 * Discriminated label shape for `Carousel.IndicatorGroup` — exactly one
 * of `label` (becomes `aria-label`) or `ariaLabelledBy` (points at an
 * external label element) must be supplied. TypeScript rejects
 * both-or-neither at compile time.
 */
export type CarouselIndicatorGroupProps = Omit<
  ComponentProps<"div">,
  "label" | "aria-labelledby"
> &
  (
    | { label: string; ariaLabelledBy?: never }
    | { label?: never; ariaLabelledBy: string }
  );

export type CarouselIndicatorProps = ComponentProps<"button"> & {
  /** Zero-based page this indicator targets. Clicking jumps to it. */
  index: number;
};
