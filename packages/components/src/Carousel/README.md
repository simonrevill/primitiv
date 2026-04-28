# Carousel

Headless, accessible **Carousel** built on native CSS scroll-snap. Implements
the [WAI-ARIA Carousel pattern](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/),
ships zero styles, and is fully composable.

The component is being developed iteratively under strict TDD. This README
documents the surface that exists today and grows as the component does.

## Status

Currently exposes:

- **`Carousel.Root`** — labelled `<section>` wrapper with
  `aria-roledescription="carousel"`.
- **`Carousel.Viewport`** — slide container, rendered as a `<div>` with
  a `data-carousel-viewport` attribute the recommended scroll-snap CSS
  targets. Must be rendered as a descendant of `Carousel.Root`; rendering
  it elsewhere throws a descriptive error.
- **`Carousel.Slide`** — an individual slide. Renders a `<div role="group"
  aria-roledescription="slide">` and self-registers with the Root so each
  slide knows its zero-based `data-index` and the live `data-total`
  count, even as slides mount and unmount. Each slide is auto-labelled
  `"N of M"` (e.g. `"1 of 3"`); pass `ariaLabel` to override with a more
  meaningful description (e.g. `"Hand-picked for you"`). Sets a
  `data-carousel-slide` CSS hook.

Sub-components for prev/next triggers, indicators, and auto-rotation
are added in subsequent cycles.

## Usage

Every carousel must have an accessible name. Pass exactly one of `ariaLabel`
or `ariaLabelledBy`:

```tsx
import { Carousel } from "@primitiv/components";

<Carousel.Root ariaLabel="Featured products">
  {/* viewport, slides, controls — added in upcoming cycles */}
</Carousel.Root>
```

```tsx
<h2 id="promos">Promotions</h2>
<Carousel.Root ariaLabelledBy="promos">…</Carousel.Root>
```

The discriminated union on the props type rejects shapes that supply both
or neither at compile time.

### Wrapping the slide container

Slides go inside `Carousel.Viewport`:

```tsx
<Carousel.Root ariaLabel="Featured products">
  <Carousel.Viewport>
    <Carousel.Slide>First slide</Carousel.Slide>
    <Carousel.Slide>Second slide</Carousel.Slide>
    <Carousel.Slide>Third slide</Carousel.Slide>
  </Carousel.Viewport>
</Carousel.Root>
```

Each `Carousel.Slide` self-registers with the Root, so every slide
exposes its own `data-index="0"`, `data-index="1"`, … and a live
`data-total` reflecting the current slide count. Add or remove slides at
runtime and the indices and totals update automatically.

Slides are also auto-labelled `"N of M"` (e.g. `"1 of 3"`) — the format
the WAI-ARIA Carousel APG example uses. To override the auto-label with
a more meaningful description, pass `ariaLabel`:

```tsx
<Carousel.Slide ariaLabel="Hand-picked for you">…</Carousel.Slide>
```

The override remains stable as siblings mount and unmount around it.

Apply your own scroll-snap CSS via the `data-carousel-viewport` and
`data-carousel-slide` attributes. The minimal recipe lives in
[the package README's recommended-CSS section](../../README.md) and will
be expanded here once additional sub-components ship.
