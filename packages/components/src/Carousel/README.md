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

Sub-components for slides, prev/next triggers, indicators, and
auto-rotation are added in subsequent cycles.

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
    {/* Carousel.Slide children — added in upcoming cycles */}
  </Carousel.Viewport>
</Carousel.Root>
```

Apply your own scroll-snap CSS via the `data-carousel-viewport`
attribute. The minimal recipe lives in
[the package README's recommended-CSS section](../../README.md) and will
be expanded here once additional sub-components ship.
