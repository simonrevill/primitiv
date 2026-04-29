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
  CarouselIndicatorGroupProps,
  CarouselIndicatorProps,
  CarouselIndicatorsProps,
  CarouselPlayPauseTriggerProps,
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
  loop,
  defaultPlaying,
  playing,
  onPlayingChange,
  autoplay,
  slidesPerPage,
  children,
  ...rest
}: CarouselRootProps) {
  const { contextValue, rootHandlers } = useCarouselRoot({
    defaultPage,
    page,
    onPageChange,
    loop,
    defaultPlaying,
    playing,
    onPlayingChange,
    autoplay,
    slidesPerPage,
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
        {...rootHandlers}
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
 * **Live region.** The viewport is also the live region for slide
 * changes: `aria-live="polite"` so paged navigation is announced to
 * assistive tech, flipping to `aria-live="off"` while autoplay is
 * actively rotating so screen readers don't get spammed with every
 * tick.
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
  const { isAutoRotating } = useCarouselContext();

  return (
    <div
      data-carousel-viewport=""
      className={className}
      aria-live={isAutoRotating ? "off" : "polite"}
      {...rest}
    >
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
 * **Boundary clamping.** When `loop` is `false` on `Carousel.Root` (the
 * default), the trigger is `disabled` once the active page reaches the
 * last slide; the click is also a no-op at boundaries because `next()`
 * short-circuits when there's nowhere to go. The button is always
 * disabled when there are zero or one slides registered. Consumer-
 * supplied `disabled={true}` is also honoured (it OR's with the
 * boundary check).
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
  disabled,
  children,
  ...rest
}: CarouselNextTriggerProps) {
  const { next, canGoNext } = useCarouselContext();
  const isDisabled = disabled === true || !canGoNext;

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
      disabled={isDisabled}
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
 * **Boundary clamping.** When `loop` is `false` on `Carousel.Root` (the
 * default), the trigger is `disabled` while the active page is the
 * first slide; the click is also a no-op at boundaries because
 * `previous()` short-circuits when there's nowhere to go. The button is
 * always disabled when there are zero or one slides registered.
 * Consumer-supplied `disabled={true}` is also honoured.
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
  disabled,
  children,
  ...rest
}: CarouselPreviousTriggerProps) {
  const { previous, canGoPrevious } = useCarouselContext();
  const isDisabled = disabled === true || !canGoPrevious;

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
      disabled={isDisabled}
      {...rest}
    >
      {children}
    </button>
  );
}

CarouselPreviousTrigger.displayName = "CarouselPreviousTrigger";

/**
 * A `<div role="group">` wrapping consumer-mapped `Carousel.Indicator`
 * dots. Use this when you want manual control over how the dots are
 * rendered (e.g. mixing custom content into each one). For the common
 * case of one auto-rendered dot per page, prefer `Carousel.Indicators`.
 *
 * Every group must have an accessible name. Pass exactly one of:
 *
 * - `label` — a short human-readable description of the picker (e.g.
 *   `"Choose slide"`).
 * - `ariaLabelledBy` — the `id` of an existing heading or label element.
 *
 * The discriminated union on the props type rejects both-or-neither at
 * compile time.
 *
 * Must be rendered as a descendant of `Carousel.Root`; rendering it
 * elsewhere throws a descriptive error.
 *
 * @example
 * ```tsx
 * <Carousel.IndicatorGroup label="Choose slide">
 *   <Carousel.Indicator index={0} />
 *   <Carousel.Indicator index={1} />
 *   <Carousel.Indicator index={2} />
 * </Carousel.IndicatorGroup>
 * ```
 */
export function CarouselIndicatorGroup({
  className = "",
  label,
  ariaLabelledBy,
  children,
  ...rest
}: CarouselIndicatorGroupProps) {
  useCarouselContext();

  return (
    <div
      role="group"
      className={className}
      {...(label !== undefined && { "aria-label": label })}
      {...(ariaLabelledBy !== undefined && {
        "aria-labelledby": ariaLabelledBy,
      })}
      {...rest}
    >
      {children}
    </div>
  );
}

CarouselIndicatorGroup.displayName = "CarouselIndicatorGroup";

/**
 * An individual indicator dot — a `<button>` that jumps to the page at
 * `index` (zero-based) when clicked. Auto-labelled `"Slide N"` (where
 * `N = index + 1`) so the page-position is announced to assistive tech.
 *
 * **Active-state ARIA.** The indicator at `currentPage` carries
 * `aria-disabled="true"` per the WAI-ARIA Carousel APG — a soft disable
 * that tells screen readers "you're already on this slide" without
 * removing it from the focus order. Non-active indicators carry
 * `aria-disabled="false"`. Both states also flip `data-state` between
 * `"active"` and `"inactive"` so consumer CSS can paint the active dot.
 *
 * **Styling hooks.**
 * - `data-carousel-indicator` — CSS-targeting attribute.
 * - `data-state="active" | "inactive"` — tracks the current page.
 *
 * Must be rendered as a descendant of `Carousel.Root`; rendering it
 * elsewhere throws a descriptive error.
 *
 * @example
 * ```tsx
 * <Carousel.Indicator index={0} />
 * ```
 */
export function CarouselIndicator({
  className = "",
  index,
  onClick,
  children,
  ...rest
}: CarouselIndicatorProps) {
  const { goTo, currentPage } = useCarouselContext();
  const isActive = index === currentPage;

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      goTo(index);
    },
    [goTo, index, onClick],
  );

  return (
    <button
      type="button"
      className={className}
      aria-label={`Slide ${index + 1}`}
      aria-disabled={isActive}
      data-carousel-indicator=""
      data-state={isActive ? "active" : "inactive"}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </button>
  );
}

CarouselIndicator.displayName = "CarouselIndicator";

/**
 * Convenience wrapper that auto-renders one `Carousel.Indicator` per
 * registered slide — the "dots between Prev and Next" you'd reach for
 * in 90% of carousels. Internally renders a `Carousel.IndicatorGroup`
 * containing one `Carousel.Indicator` per entry in the slide-key list,
 * keyed by the slide's stable `useId` so React doesn't shuffle the
 * dots when slides mount or unmount in the middle of the range.
 *
 * For full control over indicator content (e.g. dots that show
 * thumbnail previews on hover), drop down to
 * `Carousel.IndicatorGroup` + `Carousel.Indicator` instead.
 *
 * Must be rendered as a descendant of `Carousel.Root`; rendering it
 * elsewhere throws a descriptive error.
 *
 * @example
 * ```tsx
 * <Carousel.Indicators label="Choose slide" />
 * ```
 */
export function CarouselIndicators(props: CarouselIndicatorsProps) {
  const { totalPages } = useCarouselContext();

  return (
    <CarouselIndicatorGroup {...props}>
      {Array.from({ length: totalPages }, (_, index) => (
        <CarouselIndicator key={index} index={index} />
      ))}
    </CarouselIndicatorGroup>
  );
}

CarouselIndicators.displayName = "CarouselIndicators";

/**
 * A `<button>` that toggles the carousel's `playing` flag. Renders the
 * accessible name dictated by the WAI-ARIA Carousel APG by default —
 * `"Start automatic slide show"` when paused, `"Stop automatic slide
 * show"` when playing — and exposes the live `playing` flag both as a
 * `data-state="playing" | "paused"` styling hook and to a function
 * `children` render prop, so consumers can swap icons or labels per
 * state without re-implementing the toggle:
 *
 * ```tsx
 * <Carousel.PlayPauseTrigger>
 *   {({ playing }) => (playing ? <PauseIcon /> : <PlayIcon />)}
 * </Carousel.PlayPauseTrigger>
 * ```
 *
 * Static children also work — useful when you want a single icon and
 * style it via `[data-state]` selectors.
 *
 * Must be rendered as a descendant of `Carousel.Root`; rendering it
 * elsewhere throws a descriptive error. The autoplay timer that
 * advances the page when `playing` flips to `true` lands in cycle 12.
 */
export function CarouselPlayPauseTrigger({
  className = "",
  onClick,
  children,
  ...rest
}: CarouselPlayPauseTriggerProps) {
  const { playing, togglePlaying } = useCarouselContext();

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      togglePlaying();
    },
    [onClick, togglePlaying],
  );

  const renderedChildren =
    typeof children === "function" ? children({ playing }) : children;

  return (
    <button
      type="button"
      className={className}
      aria-label={
        playing ? "Stop automatic slide show" : "Start automatic slide show"
      }
      data-state={playing ? "playing" : "paused"}
      onClick={handleClick}
      {...rest}
    >
      {renderedChildren}
    </button>
  );
}

CarouselPlayPauseTrigger.displayName = "CarouselPlayPauseTrigger";

type CarouselCompound = typeof CarouselRoot & {
  Root: typeof CarouselRoot;
  Viewport: typeof CarouselViewport;
  Slide: typeof CarouselSlide;
  NextTrigger: typeof CarouselNextTrigger;
  PreviousTrigger: typeof CarouselPreviousTrigger;
  IndicatorGroup: typeof CarouselIndicatorGroup;
  Indicator: typeof CarouselIndicator;
  Indicators: typeof CarouselIndicators;
  PlayPauseTrigger: typeof CarouselPlayPauseTrigger;
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
 * - {@link CarouselIndicatorGroup | `Carousel.IndicatorGroup`} — a
 *   labelled `<div role="group">` for consumer-mapped dot indicators.
 * - {@link CarouselIndicator | `Carousel.Indicator`} — an individual
 *   `<button>` that jumps to a target page when clicked.
 * - {@link CarouselIndicators | `Carousel.Indicators`} — convenience
 *   wrapper that auto-renders one indicator per registered slide.
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
 *   <Carousel.Indicators label="Choose slide" />
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
  IndicatorGroup: CarouselIndicatorGroup,
  Indicator: CarouselIndicator,
  Indicators: CarouselIndicators,
  PlayPauseTrigger: CarouselPlayPauseTrigger,
});

CarouselCompound.displayName = "Carousel";

export { CarouselCompound as Carousel };
