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
  meaningful description (e.g. `"Hand-picked for you"`). Emits
  `data-state="active" | "inactive"` tracking the active page, plus a
  `data-carousel-slide` CSS hook.
- **`Carousel.NextTrigger`** — `<button>` that advances the active page
  by one. `disabled` at the last page when `loop` is `false`, and
  whenever zero or one slides are registered. Consumer `onClick` runs
  before the navigation; consumer-supplied `disabled={true}` is honoured
  alongside the boundary check.
- **`Carousel.PreviousTrigger`** — `<button>` that retreats the active
  page by one. `disabled` at the first page when `loop` is `false`,
  with the same zero/one-slide and consumer-`disabled` semantics as
  `NextTrigger`.
- **`Carousel.IndicatorGroup`** — labelled `<div role="group">`
  wrapping consumer-mapped indicator dots. Pass `label` (becomes
  `aria-label`) or `ariaLabelledBy`; the discriminated union rejects
  both-or-neither at compile time.
- **`Carousel.Indicator`** — individual `<button>` dot. `index` prop
  targets a zero-based page; clicking jumps to it. Auto-labelled
  `"Slide N"`. The dot at the current page carries
  `aria-disabled="true"` (a soft disable per the WAI-ARIA Carousel
  APG); all dots emit `data-state="active" | "inactive"` and a
  `data-carousel-indicator` CSS hook so consumer styles can paint the
  active dot.
- **`Carousel.Indicators`** — convenience wrapper that auto-renders
  one `Carousel.Indicator` per registered slide. Reuses the same
  discriminated `label` / `ariaLabelledBy` shape as `IndicatorGroup`.
  For custom indicator content, drop down to `IndicatorGroup` +
  `Indicator`.
- **`Carousel.PlayPauseTrigger`** — `<button>` that toggles the
  `playing` flag on Root. Auto-labels itself `"Start automatic slide
  show"` / `"Stop automatic slide show"` per the WAI-ARIA Carousel
  APG, exposes a `data-state="playing" | "paused"` styling hook, and
  passes `{ playing }` to a function `children` render prop so
  consumers can swap icons or labels per state.

Pass `autoplay` on `Carousel.Root` to advance the active page on a
timer while `playing` is `true`. Hover/focus pause behaviour and the
`aria-live` flip on the viewport are added in subsequent cycles.

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

### Navigating between slides

`Carousel.NextTrigger` and `Carousel.PreviousTrigger` advance and retreat
the active page. Each slide's `data-state` flips between `"active"` and
`"inactive"` so consumer CSS can paint the current slide differently.

#### Uncontrolled

Pass `defaultPage` (or omit it for `0`); the Root owns the active page
internally:

```tsx
<Carousel.Root ariaLabel="Featured products" defaultPage={0}>
  <Carousel.Viewport>
    <Carousel.Slide>First</Carousel.Slide>
    <Carousel.Slide>Second</Carousel.Slide>
    <Carousel.Slide>Third</Carousel.Slide>
  </Carousel.Viewport>
  <Carousel.PreviousTrigger>Previous</Carousel.PreviousTrigger>
  <Carousel.NextTrigger>Next</Carousel.NextTrigger>
</Carousel.Root>
```

#### Controlled

Pass `page` and `onPageChange` together to lift state into the parent.
The Root defers every state change back through the callback — clicks
on `NextTrigger` / `PreviousTrigger` invoke `onPageChange` with the
proposed page; the visual reflects whatever `page` value the parent
re-renders with. Useful for syncing two carousels (e.g. a thumbnail
strip), persisting the active page to a URL, or reacting to deep links.

```tsx
const [page, setPage] = useState(0);

<Carousel.Root
  ariaLabel="Featured products"
  page={page}
  onPageChange={setPage}
>
  …
</Carousel.Root>;
```

The discriminated union on the props type rejects mixed shapes (e.g.
both `defaultPage` and `page`, or `page` without `onPageChange`) at
compile time.

### Boundary behaviour and looping

By default, the prev/next triggers clamp at the ends:
`Carousel.PreviousTrigger` is `disabled` at the first slide,
`Carousel.NextTrigger` at the last. Both are also `disabled` when zero
or one slides are registered, since there's nowhere to navigate.

Pass `loop` to wrap navigation around the ends — clicking
`Carousel.PreviousTrigger` at the first slide jumps to the last, and
clicking `Carousel.NextTrigger` at the last jumps to the first. With
`loop`, the triggers are never auto-disabled at boundaries.

```tsx
<Carousel.Root ariaLabel="Featured products" loop>
  <Carousel.Viewport>
    <Carousel.Slide>First</Carousel.Slide>
    <Carousel.Slide>Second</Carousel.Slide>
    <Carousel.Slide>Third</Carousel.Slide>
  </Carousel.Viewport>
  <Carousel.PreviousTrigger>Previous</Carousel.PreviousTrigger>
  <Carousel.NextTrigger>Next</Carousel.NextTrigger>
</Carousel.Root>
```

Consumer-supplied `disabled={true}` on either trigger is honoured
regardless of boundary state — useful for momentarily freezing
navigation while another part of the UI takes over.

### Indicator dots (manual)

For full control over indicator content, map them yourself with
`Carousel.IndicatorGroup` + `Carousel.Indicator`. Each dot's `index`
prop targets a zero-based page; clicking jumps to it.

```tsx
<Carousel.IndicatorGroup label="Choose slide">
  <Carousel.Indicator index={0} />
  <Carousel.Indicator index={1} />
  <Carousel.Indicator index={2} />
</Carousel.IndicatorGroup>
```

Indicators are auto-labelled `"Slide N"` (1-indexed). The dot at the
current page carries `aria-disabled="true"` per the WAI-ARIA APG and
`data-state="active"`; non-active dots carry `aria-disabled="false"`
and `data-state="inactive"`. Style them via the
`data-carousel-indicator` attribute and the `data-state` hook:

```css
[data-carousel-indicator][data-state="active"] {
  background: black;
}
```

### Play / pause control

`Carousel.PlayPauseTrigger` toggles a `playing` flag on the Root. The
flag has the same controlled / uncontrolled split as `page`:

```tsx
// Uncontrolled
<Carousel.Root ariaLabel="Featured products" defaultPlaying={false}>
  <Carousel.PlayPauseTrigger />
</Carousel.Root>

// Controlled
const [playing, setPlaying] = useState(false);
<Carousel.Root
  ariaLabel="Featured products"
  playing={playing}
  onPlayingChange={setPlaying}
>
  <Carousel.PlayPauseTrigger />
</Carousel.Root>
```

The discriminated union rejects mixed shapes (e.g. `defaultPlaying` +
`playing`, or `playing` without `onPlayingChange`) at compile time.

Pass a function as `children` to swap icons or labels per state:

```tsx
<Carousel.PlayPauseTrigger>
  {({ playing }) => (playing ? <PauseIcon /> : <PlayIcon />)}
</Carousel.PlayPauseTrigger>
```

The trigger is auto-labelled `"Start automatic slide show"` (paused)
or `"Stop automatic slide show"` (playing) for assistive tech, and
emits `data-state="playing" | "paused"` for consumer CSS.

### Autoplay timer

Pass `autoplay` on `Carousel.Root` to advance the active page on a
timer while `playing` is `true`:

```tsx
// Default 4000ms cadence
<Carousel.Root ariaLabel="Featured products" autoplay defaultPlaying>
  …
</Carousel.Root>

// Custom delay
<Carousel.Root
  ariaLabel="Featured products"
  autoplay={{ delay: 6000 }}
  defaultPlaying
>
  …
</Carousel.Root>
```

The timer reads from the live `playing` flag and the active page —
toggling pause via `Carousel.PlayPauseTrigger` (or via the controlled
`onPlayingChange`) cancels the next tick. With `loop={false}` (the
default), the timer stops once the active page reaches the last slide;
with `loop={true}` it wraps to the first.

The timer also pauses automatically while the user is hovering the
Root or has focus on a descendant element, per WCAG 2.2.2 (Pause,
Stop, Hide). Focus moving between descendants of the Root (e.g.
tabbing from `Previous` to `Next`) keeps the pause active; the timer
only resumes once the pointer leaves and focus has moved out of the
carousel entirely. The `playing` flag is unaffected — it stays
`true` while suspended, so toggling pause-resume via
`PlayPauseTrigger` continues to behave as the consumer expects.

**User-initiated play overrides the hover/focus pause.** Per the
WAI-ARIA Carousel APG example, when the user explicitly clicks
`PlayPauseTrigger` to start the slideshow, the hover/focus pause is
suspended for the lifetime of that playing session — otherwise the
user would fight a pause every time their pointer was already over
the carousel when they pressed play. The override resets when
`playing` flips back to `false` (via another click, or via an
external state change), so a subsequent play that's *not* user-
initiated falls back to the standard WCAG pause.

The `aria-live` flip on the viewport during auto-rotation is added in
a subsequent cycle.

### Indicator dots (auto-rendered)

For the common case of one dot per slide with auto-generated labels,
use `Carousel.Indicators` — it reads the live slide count from
context and renders the right number of dots without any mapping
boilerplate:

```tsx
<Carousel.Root ariaLabel="Featured products">
  <Carousel.Viewport>
    <Carousel.Slide>1</Carousel.Slide>
    <Carousel.Slide>2</Carousel.Slide>
    <Carousel.Slide>3</Carousel.Slide>
  </Carousel.Viewport>
  <Carousel.Indicators label="Choose slide" />
</Carousel.Root>
```

The dot count tracks slide count automatically — add or remove a
slide and the indicator row updates on the next render. For custom
indicator content (thumbnails, numbers, mixed icons), drop down to
the manual `IndicatorGroup` + `Indicator` API above.

Apply your own scroll-snap CSS via the `data-carousel-viewport` and
`data-carousel-slide` attributes. The minimal recipe lives in
[the package README's recommended-CSS section](../../README.md) and will
be expanded here once additional sub-components ship.
