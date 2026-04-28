import type { CarouselRootProps } from "./types";

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
  return (
    <section
      aria-roledescription="carousel"
      className={className}
      {...(ariaLabel !== undefined && { "aria-label": ariaLabel })}
      {...(ariaLabelledBy !== undefined && { "aria-labelledby": ariaLabelledBy })}
      {...rest}
    >
      {children}
    </section>
  );
}

CarouselRoot.displayName = "CarouselRoot";

type CarouselCompound = typeof CarouselRoot & {
  Root: typeof CarouselRoot;
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
 *
 * @example
 * ```tsx
 * import { Carousel } from "@primitiv/components";
 *
 * <Carousel.Root ariaLabel="Featured products">…</Carousel.Root>
 * ```
 */
const CarouselCompound: CarouselCompound = Object.assign(CarouselRoot, {
  Root: CarouselRoot,
});

CarouselCompound.displayName = "Carousel";

export { CarouselCompound as Carousel };
