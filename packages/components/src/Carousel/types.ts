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

export type CarouselRootProps = Omit<
  ComponentProps<"section">,
  "aria-label" | "aria-labelledby"
> &
  CarouselRootLabelProps & {
    /** Uncontrolled active page index. Defaults to `0`. The Root owns
     * and updates the page internally as the consumer interacts with
     * `Carousel.NextTrigger`, `Carousel.PreviousTrigger`, etc. */
    defaultPage?: number;
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
  /** Advance the active page by one step. */
  next: () => void;
  /** Retreat the active page by one step. */
  previous: () => void;
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
