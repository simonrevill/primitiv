# Button Component — Figma Build Plan

> The step-by-step guide for authoring the production Button component set.
> Prerequisites, property definitions, slot structure, token bindings,
> focus ring implementation, and description field content — everything
> needed to build it without missing anything.
>
> Reference: RFC 0001 §9, RFC 0002 §4.6, proof-of-concept nodeId `341:4276`.

---

## 0. Read this first

The proof-of-concept (RFC 0002 §4.6) validated the token architecture
and settled design decisions. The real Button is built from scratch
alongside it — same cell structure, cleaner execution. The POC stays
on canvas for reference; do not delete it.

The total cell count: **5 variants × 5 sizes × 4 contexts × 5 states = 500 cells.**
Figma handles this comfortably.

---

## 1. Prerequisites — build these first

Do not start the component until all of these are done. Skipping them
means the danger variant has no real values and the cascade will be
incomplete.

### 1.1 Danger colour ramp

The `color/danger/light/*` ramp does not yet exist in `Primitives / Palette`.
Build it using the Harmoni plugin:

1. Open the Harmoni plugin. Enter a red-spectrum brand colour (e.g. `#c0392b`
   or your chosen danger hue) as the input.
2. Generate the ramp and press **Apply**. This writes
   `color/danger/light/50` through `color/danger/light/900` into
   `Primitives / Palette`.
3. Verify the variables appear in the Figma variables panel under
   `Primitives / Palette → color/danger/light/*`.

### 1.2 Wire Intent / Light danger tokens

Once the ramp exists, update the `Intent / Light` collection:

| Variable | Should alias |
|---|---|
| `action/danger/default` | `color/danger/light/600` |
| `action/danger/hover` | `color/danger/light/700` |
| `action/danger/active` | `color/danger/light/800` |
| `action/danger/disabled` | `color/danger/light/300` |
| `action/danger/foreground/default` | `color/neutral/white` |
| `action/danger/foreground/disabled` | `color/neutral/white` |
| `action/danger/border/default` | `color/danger/light/600` |
| `action/danger/border/hover` | `color/danger/light/700` |
| `action/danger/border/active` | `color/danger/light/800` |
| `action/danger/border/disabled` | `color/danger/light/300` |

Adjust the step numbers to match the ramp your palette engine produces
(the table above uses a 10-step brand-light ramp as reference).

### 1.3 Verify the full token chain

For each of the five variants, trace one path manually before building:

```
Button fill (primary/default)
  → action/primary/default            (Intent / Light)
  → color/brand/light/500             (Primitives / Palette)
  → #[hex]                            (raw value from Harmoni)
```

If any link in this chain is broken (aliasing nothing, or aliasing a
non-existent variable), fix it now. The component will silently carry
whatever the variable resolves to — if it resolves to nothing, you
won't notice until QA.

---

## 2. Component properties

Define these **component-set-level** variant properties. Every cell in
the 500-cell grid is the intersection of these four enumerations, plus
two boolean properties and one text property on individual instances.

### Variant properties (define on the component set)

| Property | Type | Values |
|---|---|---|
| `Variant` | Enum | `primary`, `secondary`, `ghost`, `danger`, `link` |
| `Size` | Enum | `xs`, `sm`, `md`, `lg`, `xl` |
| `Context` | Enum | `dense`, `compact`, `comfortable`, `spacious` |
| `State` | Enum | `default`, `hover`, `active`, `focus`, `disabled` |

### Instance properties (define on the base component)

| Property | Type | Default | Purpose |
|---|---|---|---|
| `Leading Icon` | Boolean | `false` | Show/hide the leading icon slot |
| `Trailing Icon` | Boolean | `false` | Show/hide the trailing icon slot |
| `Label` | Text | `Button` | The button label text |
| `Leading Icon Instance` | Instance swap | first icon in set | Which icon to use in the leading slot |
| `Trailing Icon Instance` | Instance swap | first icon in set | Which icon to use in the trailing slot |

---

## 3. Frame structure (one cell)

Each cell is a single auto-layout frame. The slots are nested instances
inside it. The structure is always:

```
[Frame] Button cell          ← auto-layout horizontal, hug height, fixed width or hug width
  ├── [Instance] Leading Icon  ← conditionally hidden via "Leading Icon" boolean
  ├── [Text] Label             ← label text, bound to text style
  └── [Instance] Trailing Icon ← conditionally hidden via "Trailing Icon" boolean
```

### Frame settings

| Property | Value |
|---|---|
| Direction | Horizontal |
| Primary axis alignment | Centre |
| Counter axis alignment | Centre |
| Sizing (width) | Hug contents |
| Sizing (height) | Fixed (bound to anatomy token — see §4) |
| Clips content | **OFF** — required for focus ring drop shadows to render outside bounds |
| Padding | Bound to `framed-control/{size}/padding-inline` on left and right; 0 top/bottom (height handles vertical space) |
| Gap | Bound to `framed-control/{size}/gap` |
| Corner radius | Bound to `framed-control/{size}/radius` |

### Icon instances

| Property | Value |
|---|---|
| Width | Bound to `framed-control/{size}/icon-size` |
| Height | Bound to `framed-control/{size}/icon-size` |
| Visible | Controlled by `Leading Icon` / `Trailing Icon` boolean properties |

---

## 4. Token bindings — anatomy (per size × context)

These dimension tokens resolve through the **Context / \*** collections.
The variable to bind depends on both the `Size` and `Context` variant
properties. Bind each to the correct context collection variable.

| Slot | Variable path | Collection |
|---|---|---|
| Frame height | `framed-control/{size}/height` | `Context / {context}` |
| Padding inline (L + R) | `framed-control/{size}/padding-inline` | `Context / {context}` |
| Item gap | `framed-control/{size}/gap` | `Context / {context}` |
| Corner radius | `framed-control/{size}/radius` | `Context / {context}` |
| Icon width + height | `framed-control/{size}/icon-size` | `Context / {context}` |

Example: a `size=md, context=comfortable` cell binds
`Context / Comfortable → framed-control/md/height`.

---

## 5. Token bindings — colour (per variant × state)

Bind via `figma.variables.setBoundVariableForPaint()`. All source
variables are in the `Intent / Light` collection.

### Primary

| State | Fill | Stroke | Text colour |
|---|---|---|---|
| default | `action/primary/default` | `action/primary/border/default` | `action/primary/foreground/default` |
| hover | `action/primary/hover` | `action/primary/border/hover` | `action/primary/foreground/default` |
| active | `action/primary/active` | `action/primary/border/active` | `action/primary/foreground/default` |
| focus | `action/primary/default` | none | `action/primary/foreground/default` |
| disabled | `action/primary/disabled` | `action/primary/border/disabled` | `action/primary/foreground/disabled` |

Disabled state: additionally set `opacity = 0.5` on the frame
(or bind to `interaction.disabled.opacity` in the `Interaction` collection).

### Secondary

| State | Fill | Stroke | Text colour |
|---|---|---|---|
| default | `action/secondary/default` | `action/secondary/border/default` | `action/secondary/foreground/default` |
| hover | `action/secondary/hover` | `action/secondary/border/hover` | `action/secondary/foreground/default` |
| active | `action/secondary/active` | `action/secondary/border/active` | `action/secondary/foreground/default` |
| focus | `action/secondary/default` | none | `action/secondary/foreground/default` |
| disabled | `action/secondary/disabled` | `action/secondary/border/disabled` | `action/secondary/foreground/disabled` |

### Ghost

| State | Fill | Stroke | Text colour | Note |
|---|---|---|---|---|
| default | none | none | `content/primary` | |
| hover | `surface/subtle` | none | `content/primary` | |
| active | `action/secondary/active` | none | `content/primary` | |
| focus | none | none | `content/primary` | requires opacity hack — see §6 |
| disabled | none | none | `content/disabled` | opacity 0.5 |

Ghost default and focus states have no fill and no stroke. Figma will
suppress drop shadows on these frames — see §6 for the workaround.

### Danger

| State | Fill | Stroke | Text colour |
|---|---|---|---|
| default | `action/danger/default` | `action/danger/border/default` | `action/danger/foreground/default` |
| hover | `action/danger/hover` | `action/danger/border/hover` | `action/danger/foreground/default` |
| active | `action/danger/active` | `action/danger/border/active` | `action/danger/foreground/default` |
| focus | `action/danger/default` | none | `action/danger/foreground/default` |
| disabled | `action/danger/disabled` | `action/danger/border/disabled` | `action/danger/foreground/disabled` |

### Link

| State | Fill | Stroke | Text colour |
|---|---|---|---|
| default | none | none | `action/primary/default` |
| hover | none | none | `action/primary/hover` |
| active | none | none | `action/primary/active` |
| focus | none | none | `action/primary/default` |
| disabled | none | none | `content/disabled` |

Link default and focus states have no fill — same opacity hack as ghost (§6).

---

## 6. Focus ring implementation

Focus rings use **layered DROP_SHADOW effects** — not a child rectangle.
A rectangle approach breaks auto-layout by expanding the cell to
accommodate overflow.

### Effect array (applies only to `state=focus` cells)

Figma renders effects in reverse array order (index 1 is on top of
index 0). Set `frame.effects` to exactly this array:

```
effects[0]  DROP_SHADOW  colour = focus/ring variable
            spread = offset_value + ring_width_value   (e.g. 2+2 = 4)
            radius = 0, offset = (0, 0), visible = true
            → This is the coloured ring, rendered BEHIND

effects[1]  DROP_SHADOW  colour = white (r:1, g:1, b:1, a:1)
            spread = offset_value                       (e.g. 2)
            radius = 0, offset = (0, 0), visible = true
            → This is the gap, rendered ON TOP
```

Bind `effects[0].color` to the `focus/ring` variable in `Intent / Light`.
The gap width (`effects[1].spread`) and ring width
(`effects[0].spread - effects[1].spread`) are driven by the
`Interaction` collection variables:

| Variable | Collection | Drives |
|---|---|---|
| `focus/ring/offset` | Interaction | `effects[1].spread` (the white gap) |
| `focus/ring/width` | Interaction | added to offset for `effects[0].spread` |
| `focus/ring` | Intent / Light | `effects[0].color` |

For `state ≠ focus`: leave `frame.effects = []`.

### Ghost and link: the opacity hack

Figma suppresses drop shadows on frames with no fill and no stroke.
Ghost (default, focus) and link (default, focus) need a near-invisible
fill to activate shadow rendering:

```
fill: SOLID  colour = white (r:1, g:1, b:1)  opacity = 0.001
```

This is invisible in practice but switches Figma's shadow rendering on.
Apply it only to ghost and link cells where the fill would otherwise be
absent.

### Clip content must be OFF

Set `clipsContent = false` on the button frame itself and on every
ancestor frame in the hierarchy (section, grid row, etc.) up to the
page root. If any ancestor clips content, the shadow will be cut off.

---

## 7. Typography binding (per size × context)

Bind the label text node to a **text style**, not raw font properties.
Use the existing text styles authored in Phase 1 / Phase 4 of RFC 0001.

Naming convention: `{Context} / Label / {size}`

Examples:
- `size=md, context=comfortable` → text style `Comfortable / Label / md`
- `size=xs, context=dense` → text style `Dense / Label / xs`

The text style handles font-family, font-weight, font-size, line-height,
and letter-spacing in one binding. Do not set any of these properties
directly on the text node — they should all resolve through the style.

---

## 8. Disabled state

For `state=disabled`, beyond the colour bindings in §5:

- Set frame `opacity = 0.5` (or bind to `Interaction → disabled/opacity`).
- The lower opacity desaturates the component visually and signals
  non-interactivity. The colour tokens for disabled states are still
  applied (they handle the text/border explicitly); the opacity provides
  the overall wash.

---

## 9. Build sequence

Follow this order. Each step is independently verifiable before moving on.

**Phase 0 — Token prerequisites**
1. Build danger ramp in Harmoni plugin (§1.1).
2. Wire `action/danger/*` in `Intent / Light` (§1.2).
3. Verify all 5 variant chains resolve end-to-end (§1.3).

**Phase 1 — Single base cell**
4. Create a new Frame (not inside the existing POC).
5. Build one cell: `variant=primary, size=md, context=comfortable, state=default`.
6. Apply all anatomy bindings (§4) — height, padding, gap, radius, icon size.
7. Apply colour bindings (§5) — fill, stroke, text.
8. Bind text style (§7).
9. Verify: change a brand colour variable. The cell fill should update immediately.

**Phase 2 — All states for one size/context**
10. Clone the base cell 4× for the remaining states (hover, active, focus, disabled).
11. Apply the state-specific colour bindings to each clone.
12. Apply focus ring effects to the `focus` cell (§6).
13. Apply opacity 0.5 to the `disabled` cell (§8).
14. Verify the focus ring renders with a visible gap.

**Phase 3 — Scale to all sizes**
15. Repeat Phase 2 for `xs`, `sm`, `lg`, `xl` within the
    `primary / comfortable` slice. Five size groups × 5 states = 25 cells.
16. Verify anatomy tokens are resolving correctly at each size
    (height and padding should differ between xs and xl).

**Phase 4 — Scale to all contexts**
17. Repeat Phase 3 for `dense`, `compact`, `spacious`.
    Total primary slice: 5 sizes × 4 contexts × 5 states = 100 cells.
18. Verify that at `context=dense`, the button is visibly smaller/tighter
    than at `context=spacious`.

**Phase 5 — All variants**
19. Repeat Phases 2–4 for `secondary`, `ghost`, `danger`, `link`.
    Total: 500 cells.
20. For ghost and link: apply the opacity hack fills to no-fill states (§6).
21. For danger: confirm bindings resolve to the new danger ramp, not the
    placeholder tokens.

**Phase 6 — Promote to component set**
22. Select all 500 cells and combine into a single component set.
23. Verify Figma auto-derives the four variant properties
    (`Variant`, `Size`, `Context`, `State`) from the cell names.
24. Rename cells to the canonical convention:
    `Variant=primary, Size=md, Context=comfortable, State=default`
    (Figma uses comma-separated `Key=value` pairs).

**Phase 7 — Component properties and slots**
25. Define instance properties on the base component (§2):
    - `Leading Icon` boolean (default: false)
    - `Trailing Icon` boolean (default: false)
    - `Label` text (default: "Button")
    - `Leading Icon Instance` instance swap
    - `Trailing Icon Instance` instance swap
26. Verify that toggling `Leading Icon` shows/hides the icon slot without
    breaking the auto-layout.
27. Verify that swapping `Leading Icon Instance` replaces the icon correctly.

**Phase 8 — Description field**
28. Set the component set description (§9).

**Phase 9 — Verification**
29. On the existing "Button — Context Demo" demo page, place one instance
    of each variant/state combination.
30. Acid test: in the Harmoni plugin, generate a new brand colour and apply.
    All primary cells, link text, and focus rings should update. Secondary,
    ghost, danger, and neutral-coloured elements should not change.
31. Verify focus rings are visible on all 5 variants and all 4 contexts
    at `state=focus`.

---

## 10. Description field content

Set this on the component set (the top-level node, not individual variants):

> **Button** — Primary interactive control. Five variants (primary,
> secondary, ghost, danger, link), five sizes (xs–xl), four density
> contexts (dense, compact, comfortable, spacious), and five interaction
> states (default, hover, active, focus, disabled).
>
> All dimensions are bound to `Context / *` anatomy tokens. All colours
> are bound to `Intent / Light` semantic tokens. Changing the brand colour
> in `Primitives / Palette` updates all primary-variant cells automatically.
> The danger variant requires the `color/danger/light/*` ramp to be present.
>
> Focus rings use layered drop shadows bound to `Intent / Light → focus/ring`
> and `Interaction → focus/ring/*` variables. Parent frames must have
> **Clip content** disabled for focus rings to render outside bounds.

---

## 11. Tokens still to build (post-Button)

These are needed for the next components but not blocking the Button:

| Missing token | Needed for | Notes |
|---|---|---|
| `action/success/*` | Success button / alert | Needs `color/green/light/*` ramp |
| `action/warning/*` | Warning button / alert | Needs `color/amber/light/*` ramp |
| `action/info/*` | Info variants | Needs `color/blue/light/*` ramp |
| `content/on-action` | Explicit pattern for text-on-coloured-button | Currently duplicated as `action/*/foreground/*` |
| `Intent / Dark` collection | Dark mode | Deferred; shape is the same as Light |

---

## 12. What not to touch

- The proof-of-concept component set (nodeId `341:4276`) — leave it on canvas.
- The "Button — Interaction State Review" frame — leave it on canvas.
- The sync plugin, `packages/tokens`, or `dtcg.ts` — no code changes needed
  for the Figma component authoring step. Run **Export tokens** after the
  component is done to capture the updated `components.json`.

End.
