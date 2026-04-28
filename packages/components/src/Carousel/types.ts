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
  CarouselRootLabelProps;

/**
 * Shape of the context published by `Carousel.Root` to descendants.
 * Currently a presence marker — fields are added as future cycles
 * introduce shared state (active page, slide registration, autoplay).
 */
export type CarouselContextValue = Record<string, never>;

export type CarouselViewportProps = ComponentProps<"div">;
