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
} from "./types";

/**
 * The root of a Carousel widget. Renders a `<section>` with
 * `aria-roledescription="carousel"` so assistive technology announces
 * the widget as a carousel rather than a generic region, per the
 * WAI-ARIA Carousel pattern.
 *
 * Every carousel must have an accessible name. Pass exactly one of:
 *
 * - {@link CarouselRootProps.ariaLabel | `ariaLabel`} — a short
 *   human-readable description (e.g. `"Featured products"`).
 * - {@link CarouselRootProps.ariaLabelledBy | `ariaLabelledBy`} — the
 *   `id` of an existing heading or label element.
 *
 * The discriminated union on the props type rejects both-or-neither at
 * compile time.
 *
 * @example Labelled inline
 * ```tsx
 * <Carousel.Root ariaLabel="Featured products">…</Carousel.Root>
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
  children,
  ...rest
}: CarouselRootProps) {
  const { contextValue } = useCarouselRoot();

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
 * **Styling hooks.**
 * - `data-carousel-slide` — CSS-targeting attribute (recommended scroll-snap
 *   recipe targets `[data-carousel-slide]`).
 * - `data-index="N"` — the slide's zero-based position in registration order.
 * - `data-total="N"` — the live total slide count.
 *
 * Must be rendered as a descendant of `Carousel.Root`; rendering it
 * elsewhere throws a descriptive error.
 *
 * @example
 * ```tsx
 * <Carousel.Viewport>
 *   <Carousel.Slide>First slide</Carousel.Slide>
 *   <Carousel.Slide>Second slide</Carousel.Slide>
 * </Carousel.Viewport>
 * ```
 */
export function CarouselSlide({
  className = "",
  children,
  ...rest
}: CarouselSlideProps) {
  const { slideRef, index, total } = useCarouselSlide();

  return (
    <div
      ref={slideRef}
      role="group"
      aria-roledescription="slide"
      data-carousel-slide=""
      data-index={index}
      data-total={total}
      className={className}
      {...rest}
    >
      {children}
    </div>
  );
}

CarouselSlide.displayName = "CarouselSlide";

type CarouselCompound = typeof CarouselRoot & {
  Root: typeof CarouselRoot;
  Viewport: typeof CarouselViewport;
  Slide: typeof CarouselSlide;
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
 * </Carousel.Root>
 * ```
 */
const CarouselCompound: CarouselCompound = Object.assign(CarouselRoot, {
  Root: CarouselRoot,
  Viewport: CarouselViewport,
  Slide: CarouselSlide,
});

CarouselCompound.displayName = "Carousel";

export { CarouselCompound as Carousel };
