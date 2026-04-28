import { MouseEvent, useCallback } from "react";

import { CarouselProvider } from "./CarouselContext";
import {
  useCarouselContext,
  useCarouselRoot,
  useCarouselSlide,
} from "./hooks";
import type {
  CarouselRootProps,
  CarouselViewportProps,
  CarouselSlideProps,
  CarouselNextTriggerProps,
  CarouselPreviousTriggerProps,
} from "./types";

/**
 * The root of a Carousel widget. Renders a `<section>` with
 * `aria-roledescription="carousel"` so assistive technology announces
 * the widget as a carousel rather than a generic region, per the
 * WAI-ARIA Carousel pattern.
 *
 * Every carousel must have an accessible name. Pass exactly one of:
 *
 * - `ariaLabel` — a short human-readable description (e.g.
 *   `"Featured products"`).
 * - `ariaLabelledBy` — the `id` of an existing heading or label element.
 *
 * The discriminated union on the props type rejects both-or-neither at
 * compile time.
 *
 * Supports two **page-state modes**, statically discriminated at the type
 * level so only one of the two shapes is accepted by TypeScript:
 *
 * - **Uncontrolled** — pass `defaultPage` (or omit it and start at `0`).
 *   The component owns and updates the active page internally.
 * - **Controlled** — pass `page` *and* `onPageChange` together. The
 *   parent owns the active page; the component defers every state
 *   change back through the callback.
 *
 * @example Labelled inline, uncontrolled
 * ```tsx
 * <Carousel.Root ariaLabel="Featured products" defaultPage={0}>…</Carousel.Root>
 * ```
 *
 * @example Controlled
 * ```tsx
 * const [page, setPage] = useState(0);
 *
 * <Carousel.Root
 *   ariaLabel="Featured products"
 *   page={page}
 *   onPageChange={setPage}
 * >
 *   …
 * </Carousel.Root>
 * ```
 *
 * @example Labelled by an existing heading
 * ```tsx
 * <h2 id="promos">Promotions</h2>
 * <Carousel.Root ariaLabelledBy="promos">…</Carousel.Root>
 * ```
 */
export function CarouselRoot({
  className = "",
  ariaLabel,
  ariaLabelledBy,
  defaultPage,
  page,
  onPageChange,
  children,
  ...rest
}: CarouselRootProps) {
  const { contextValue } = useCarouselRoot({
    defaultPage,
    page,
    onPageChange,
  });

  return (
    <CarouselProvider value={contextValue}>
      <section
        aria-roledescription="carousel"
        className={className}
        {...(ariaLabel !== undefined && { "aria-label": ariaLabel })}
        {...(ariaLabelledBy !== undefined && {
          "aria-labelledby": ariaLabelledBy,
        })}
        {...rest}
      >
        {children}
      </section>
    </CarouselProvider>
  );
}

CarouselRoot.displayName = "CarouselRoot";

/**
 * The slide container — the scrollable surface that holds
 * `Carousel.Slide` children. Rendered as a `<div>` with a
 * `data-carousel-viewport` attribute that the recommended scroll-snap
 * CSS targets (see this component's README for the recipe).
 *
 * The viewport must be rendered as a descendant of `Carousel.Root`;
 * rendering it elsewhere throws a descriptive error so misuse surfaces
 * during development rather than as silent ARIA breakage.
 *
 * **Styling hooks.** `data-carousel-viewport` is set on the rendered
 * element. The component ships no styles — apply your own scroll-snap
 * recipe via this attribute.
 *
 * @example
 * ```tsx
 * <Carousel.Root ariaLabel="Featured products">
 *   <Carousel.Viewport>
 *     <Carousel.Slide>…</Carousel.Slide>
 *   </Carousel.Viewport>
 * </Carousel.Root>
 * ```
 */
export function CarouselViewport({
  className = "",
  children,
  ...rest
}: CarouselViewportProps) {
  useCarouselContext();

  return (
    <div data-carousel-viewport="" className={className} {...rest}>
      {children}
    </div>
  );
}

CarouselViewport.displayName = "CarouselViewport";

/**
 * An individual slide. Renders a `<div>` with `role="group"` and
 * `aria-roledescription="slide"` per the WAI-ARIA Carousel pattern, so
 * assistive technology announces each slide as a discrete group rather
 * than a generic region.
 *
 * **Self-registration.** On mount, every slide registers itself with
 * `Carousel.Root` via a callback ref. The Root maintains an ordered list
 * of registered slide keys, which is how the slide knows its own
 * zero-based `data-index` and how every slide receives the live
 * `data-total` count. Slides may be added or removed at runtime; the
 * indices and totals update automatically.
 *
 * **Auto-labelling.** Each slide is labelled `"N of M"` (e.g. `"1 of 3"`)
 * using its live index and the live total — the format the WAI-ARIA
 * Carousel APG example uses, and what most screen readers expect. Pass
 * {@link CarouselSlideProps.ariaLabel | `ariaLabel`} to override the
 * auto-label with a more meaningful description (e.g.
 * `"Hand-picked for you"`).
 *
 * **Styling hooks.**
 * - `data-carousel-slide` — CSS-targeting attribute (recommended scroll-snap
 *   recipe targets `[data-carousel-slide]`).
 * - `data-index="N"` — the slide's zero-based position in registration order.
 * - `data-total="N"` — the live total slide count.
 *
 * Must be rendered as a descendant of `Carousel.Root`; rendering it
 * elsewhere throws a descriptive error.
 *
 * @example Auto-labelled
 * ```tsx
 * <Carousel.Viewport>
 *   <Carousel.Slide>First slide</Carousel.Slide>
 *   <Carousel.Slide>Second slide</Carousel.Slide>
 * </Carousel.Viewport>
 * ```
 *
 * @example Override the auto-label
 * ```tsx
 * <Carousel.Slide ariaLabel="Hand-picked for you">…</Carousel.Slide>
 * ```
 */
export function CarouselSlide({
  className = "",
  ariaLabel,
  children,
  ...rest
}: CarouselSlideProps) {
  const { slideRef, index, total, state } = useCarouselSlide();
  const autoLabel =
    index >= 0 && total > 0 ? `${index + 1} of ${total}` : undefined;
  const label = ariaLabel ?? autoLabel;

  return (
    <div
      ref={slideRef}
      role="group"
      aria-roledescription="slide"
      data-carousel-slide=""
      data-index={index}
      data-total={total}
      data-state={state}
      className={className}
      {...(label !== undefined && { "aria-label": label })}
      {...rest}
    >
      {children}
    </div>
  );
}

CarouselSlide.displayName = "CarouselSlide";

/**
 * Advances the active page by one. Renders as
 * `<button type="button">` and dispatches the consumer's `onClick`
 * before invoking the navigation, so analytics handlers and similar
 * still fire when the user advances the carousel.
 *
 * Boundary clamping (`disabled` on the last page when `loop` is off) is
 * added in a later cycle; in this cycle the trigger advances naively.
 *
 * Must be rendered as a descendant of `Carousel.Root`; rendering it
 * elsewhere throws a descriptive error.
 *
 * @example
 * ```tsx
 * <Carousel.NextTrigger>Next</Carousel.NextTrigger>
 * ```
 */
export function CarouselNextTrigger({
  className = "",
  onClick,
  children,
  ...rest
}: CarouselNextTriggerProps) {
  const { next } = useCarouselContext();

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      next();
    },
    [next, onClick],
  );

  return (
    <button
      type="button"
      className={className}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </button>
  );
}

CarouselNextTrigger.displayName = "CarouselNextTrigger";

/**
 * Retreats the active page by one. Renders as
 * `<button type="button">` and dispatches the consumer's `onClick`
 * before invoking the navigation, so analytics handlers and similar
 * still fire when the user retreats the carousel.
 *
 * Boundary clamping (`disabled` on the first page when `loop` is off) is
 * added in a later cycle; in this cycle the trigger retreats naively.
 *
 * Must be rendered as a descendant of `Carousel.Root`; rendering it
 * elsewhere throws a descriptive error.
 *
 * @example
 * ```tsx
 * <Carousel.PreviousTrigger>Previous</Carousel.PreviousTrigger>
 * ```
 */
export function CarouselPreviousTrigger({
  className = "",
  onClick,
  children,
  ...rest
}: CarouselPreviousTriggerProps) {
  const { previous } = useCarouselContext();

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      previous();
    },
    [previous, onClick],
  );

  return (
    <button
      type="button"
      className={className}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </button>
  );
}

CarouselPreviousTrigger.displayName = "CarouselPreviousTrigger";

type CarouselCompound = typeof CarouselRoot & {
  Root: typeof CarouselRoot;
  Viewport: typeof CarouselViewport;
  Slide: typeof CarouselSlide;
  NextTrigger: typeof CarouselNextTrigger;
  PreviousTrigger: typeof CarouselPreviousTrigger;
};

/**
 * Headless, accessible **Carousel** — a compound component implementing the
 * WAI-ARIA Carousel pattern with zero styles.
 *
 * `Carousel` is both callable (it's an alias of {@link CarouselRoot |
 * `Carousel.Root`}) and carries its sub-components as static properties.
 * Prefer the namespaced form in application code for readability:
 *
 * - {@link CarouselRoot | `Carousel.Root`} — the labelled `<section>`
 *   that wraps the entire widget.
 * - {@link CarouselViewport | `Carousel.Viewport`} — the slide
 *   container that the recommended scroll-snap CSS targets.
 * - {@link CarouselSlide | `Carousel.Slide`} — an individual slide,
 *   self-registering with the Root for live index / total tracking.
 * - {@link CarouselNextTrigger | `Carousel.NextTrigger`} — advances
 *   the active page by one.
 * - {@link CarouselPreviousTrigger | `Carousel.PreviousTrigger`} —
 *   retreats the active page by one.
 *
 * @example
 * ```tsx
 * import { Carousel } from "@primitiv/components";
 *
 * <Carousel.Root ariaLabel="Featured products">
 *   <Carousel.Viewport>
 *     <Carousel.Slide>First</Carousel.Slide>
 *     <Carousel.Slide>Second</Carousel.Slide>
 *   </Carousel.Viewport>
 *   <Carousel.PreviousTrigger>Previous</Carousel.PreviousTrigger>
 *   <Carousel.NextTrigger>Next</Carousel.NextTrigger>
 * </Carousel.Root>
 * ```
 */
const CarouselCompound: CarouselCompound = Object.assign(CarouselRoot, {
  Root: CarouselRoot,
  Viewport: CarouselViewport,
  Slide: CarouselSlide,
  NextTrigger: CarouselNextTrigger,
  PreviousTrigger: CarouselPreviousTrigger,
});

CarouselCompound.displayName = "Carousel";

export { CarouselCompound as Carousel };
