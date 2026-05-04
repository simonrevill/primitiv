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

### Lightbox composition (with `Modal`)

Two `Carousel.Root`s sharing a controlled `page` stay in sync — pair
a thumbnail strip with a fullscreen viewer mounted inside the
in-tree `Modal`. Gate the inner carousel's `playing` flag on the
modal's `open` so autoplay only runs while the modal is visible:

```tsx
const [page, setPage] = useState(0);
const [open, setOpen] = useState(false);

<>
  <Carousel.Root
    ariaLabel="Featured products — thumbnails"
    page={page}
    onPageChange={setPage}
    slidesPerPage={3}
  >
    <Carousel.Viewport>
      <Carousel.Slide>…</Carousel.Slide>
      …
    </Carousel.Viewport>
  </Carousel.Root>

  <Modal.Root open={open} onOpenChange={setOpen}>
    <Modal.Trigger>Open lightbox</Modal.Trigger>
    <Modal.Portal>
      <Modal.Content>
        <Carousel.Root
          ariaLabel="Featured products — fullscreen"
          page={page}
          onPageChange={setPage}
          autoplay
          playing={open}
          onPlayingChange={() => {}}
        >
          <Carousel.Viewport>
            <Carousel.Slide>…</Carousel.Slide>
            …
          </Carousel.Viewport>
          <Carousel.Indicators label="Choose slide" />
        </Carousel.Root>
      </Modal.Content>
    </Modal.Portal>
  </Modal.Root>
</>
```

`Carousel.Root` doesn't focus anything on mount, so the `Modal`'s
focus management isn't disturbed when the inner carousel mounts.

### Imperative API

For programmatic control from outside the component (e.g. a global
keyboard shortcut, a "skip to last slide" button elsewhere on the
page, or restoring a remembered position on mount), `Carousel.Root`
exposes an imperative handle via `ref`:

```tsx
const carouselRef = useRef<CarouselImperativeApi>(null);

<Carousel.Root ref={carouselRef} ariaLabel="Featured products">…</Carousel.Root>;

carouselRef.current?.next();
carouselRef.current?.previous();
carouselRef.current?.goTo(2);
carouselRef.current?.play();
carouselRef.current?.pause();
carouselRef.current?.refresh();
const { page, totalPages, value } = carouselRef.current!.getProgress();
```

`refresh()` re-issues the viewport's `scrollTo` for the current
page — useful when external layout changes (window resize, container
reflow, dynamic content) leave the scroll position misaligned with
React state. `getProgress()` returns a normalised
`value` in `[0, 1]` (`0` when there's at most one page) plus the
live `page` and `totalPages`, intended for custom progress bars.

Every method routes through the same internal state machine the
trigger components use, so controlled-mode `onPageChange` /
`onPlayingChange` callbacks fire just as if the user had clicked.
`play()` also dismisses the hover/focus pause for the lifetime of
that playing session, matching the WAI-ARIA APG semantics for
user-initiated play.

### `asChild` composition

`Carousel.NextTrigger`, `Carousel.PreviousTrigger`,
`Carousel.PlayPauseTrigger`, and `Carousel.Indicator` all accept an
`asChild` prop. When set, the trigger renders the consumer's child
element via the in-tree `Slot` (instead of its default `<button>`)
and merges every trigger prop — `onClick`, `aria-label`,
`aria-disabled`, `data-state`, custom `id`, etc. — onto it. Useful
for routing links and other elements that need trigger semantics:

```tsx
<Carousel.NextTrigger asChild>
  <a href="/products?page=2">Next</a>
</Carousel.NextTrigger>
```

Because `<a>` and other non-button elements don't honour the HTML
`disabled` attribute, the prev/next triggers also short-circuit
their click handler when boundary clamping says "no further" — so
asChild on a non-button still respects `loop={false}` boundaries.

### Transition modes

`Carousel.Root` accepts a `transition` prop that controls how the
viewport handles slide changes visually.

- `transition="slide"` (default) — relies on native CSS scroll-snap.
  The Viewport scrolls programmatically when the page changes and
  listens for `scrollsnapchange` so user swipes update React state.
- `transition="none"` — the Viewport installs no scroll wiring at
  all. Consumer CSS owns the visual via the `data-state="active" |
  "inactive"` hook on each slide, which still flips with the active
  page. This is the entry point for crossfade, dissolve, zoom, or
  any CSS-only transition pattern:

```css
[data-carousel-slide] {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 400ms;
}
[data-carousel-slide][data-state="active"] {
  opacity: 1;
}
```

### Programmatic scroll sync

When the active page changes for any reason (`Carousel.NextTrigger` /
`Carousel.PreviousTrigger` click, indicator click, autoplay tick),
the viewport calls `scrollTo` so the visual surface tracks React
state. The scroll target is derived from the first slide of the new
page via `getBoundingClientRect`, so consumer CSS owns slide width
and gap. Default `behavior` is `"smooth"`.

The reverse path is also wired: when the user swipes the viewport,
the browser fires `scrollsnapchange` with the snapped slide as the
target. The Viewport listens for that event, computes
`floor(slideIndex / slidesPerPage)`, and calls `goTo` so React state
follows the user's scroll. `onPageChange` is only invoked when the
page genuinely changes, so a snap that lands back on the active page
doesn't dispatch a spurious callback. The IntersectionObserver
fallback for browsers without `scrollsnapchange` lands in a follow-up
cycle.

### Custom DOM ids

For SSR / hydration stability or external `aria-controls` linkage,
pin DOM `id`s on the rendered sub-components via the `ids` bag on
`Carousel.Root`:

```tsx
<Carousel.Root
  ariaLabel="Featured products"
  ids={{
    root: "promo-carousel",
    viewport: "promo-viewport",
    previousTrigger: "promo-prev",
    nextTrigger: "promo-next",
    playPauseTrigger: "promo-play-pause",
    indicatorGroup: "promo-indicators",
  }}
>
  …
</Carousel.Root>
```

Any keys you omit leave the corresponding element unidentified. A
direct `id` prop on a sub-component (e.g.
`<Carousel.NextTrigger id="…">`) wins over `ids.*` because it spreads
last.

### Internationalisation

The component owns four user-visible strings: each slide's auto-
generated `aria-label` (`"N of M"`), each indicator's auto-generated
`aria-label` (`"Slide N"`), and the two `Carousel.PlayPauseTrigger`
accessible names (`"Start automatic slide show"` and
`"Stop automatic slide show"`). Override any subset of them via the
`translations` prop on `Carousel.Root`:

```tsx
<Carousel.Root
  ariaLabel="Produits en vedette"
  translations={{
    slideLabel: ({ index, total }) => `${index} sur ${total}`,
    indicatorLabel: ({ index }) => `Diapositive ${index}`,
    startSlideshow: "Démarrer le diaporama",
    stopSlideshow: "Arrêter le diaporama",
  }}
>
  …
</Carousel.Root>
```

`slideLabel` and `indicatorLabel` are functions (they receive
position info), the slideshow names are plain strings. Any keys you
omit fall back to the English defaults. Per-slide `ariaLabel`
overrides on `Carousel.Slide` still take precedence over
`translations.slideLabel`, so a single slide can carry a
domain-meaningful label (e.g. `"Hand-picked for you"`) without
losing the localised `"N of M"` format on the others.

### Multi-slide pages

Pass `slidesPerPage` (default `1`) to make several slides visible per
page — the "image carousel" / "property cards" pattern. Slides
group into pages of that size for navigation:

```tsx
<Carousel.Root ariaLabel="Featured products" slidesPerPage={3}>
  <Carousel.Viewport>
    <Carousel.Slide>1</Carousel.Slide>
    <Carousel.Slide>2</Carousel.Slide>
    <Carousel.Slide>3</Carousel.Slide>
    <Carousel.Slide>4</Carousel.Slide>
    <Carousel.Slide>5</Carousel.Slide>
  </Carousel.Viewport>
  <Carousel.PreviousTrigger>Previous</Carousel.PreviousTrigger>
  <Carousel.Indicators label="Choose page" />
  <Carousel.NextTrigger>Next</Carousel.NextTrigger>
</Carousel.Root>
```

With `slidesPerPage={3}` and 5 slides:

- Total pages = `ceil(5 / 3) === 2`. `Carousel.Indicators` renders 2
  dots.
- Page 0 contains slides 0–2; page 1 contains the remaining 3, 4 (a
  partial last page).
- Each slide on the active page emits `data-state="active"`; slides
  on other pages emit `"inactive"`.
- `Carousel.NextTrigger` advances one page per click; the boundary
  clamp is at the last page (so with `loop={false}`, Next is
  disabled while page 1 is active).
- `loop={true}` wraps at page boundaries.

The slide-level `aria-label="N of M"` continues to count individual
slides (so a 5-slide carousel announces "1 of 5", "2 of 5", … even
when grouped into 3-per-page).

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

**Viewport live region.** `Carousel.Viewport` is also the live region
for slide changes. Its `aria-live` defaults to `"polite"` so paged
manual navigation is announced to assistive tech, and flips to
`"off"` while autoplay is actively rotating (`autoplay` enabled and
`playing=true`) so screen readers aren't spammed with every tick.
The flip is reactive — pausing via `PlayPauseTrigger` returns the
viewport to `"polite"` for the duration of the pause.

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
