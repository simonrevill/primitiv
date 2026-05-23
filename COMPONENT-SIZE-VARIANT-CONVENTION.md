# Component Size Variant Convention

The Primitiv Design System has a typographic scale with 3 density contexts (Compact / Comfortable / Spacious). A `ui` namespace already exists within each density context — `typography.{mode}.ui.button` and `typography.{mode}.ui.label` — but currently each has only one size (16px semibold sans). Components like Button need multiple size variants, and this document establishes the convention for deriving those variants consistently across all components.

---

## The Core Insight: Two Orthogonal Axes

**Density context** (Compact → Spacious) = how the *entire layout* responds to screen/container size. It scales the whole type ramp. This is a *responsive* axis — the same component at `size="md"` renders differently in Compact vs Spacious.

**Component size** (xs → xl) = the *intrinsic* size of the component, chosen at authoring time. A `lg` button stays `lg` regardless of density.

These multiply together. Both axes already exist in the token structure — density contexts as the top-level namespace, component sizes as the missing inner dimension.

---

## Convention

### 1. Expand the `ui` namespace with size variants

The `ui` category is the right home — it's already semantically distinct from reading typography (`body`, `heading`, `display`). Add size tiers to it:

```
typography.{mode}.ui.button.xs
typography.{mode}.ui.button.sm
typography.{mode}.ui.button.md   ← current single token becomes this
typography.{mode}.ui.button.lg
typography.{mode}.ui.button.xl
```

All variants share font-family (sans / Khand) and font-weight (semibold / 600). Only font-size changes per tier:

| Size | font-size | line-height |
|------|-----------|-------------|
| xs   | 12        | 16          |
| sm   | 14        | 20          |
| md   | 16        | 24          |
| lg   | 18        | 28          |
| xl   | 20        | 28          |

Validate visually in Figma across all 3 density contexts before committing values.

### 2. The same pattern propagates to every other UI component

Any component with text gets its own size variants under `ui`:

```
typography.{mode}.ui.badge.{xs|sm|md|lg}
typography.{mode}.ui.tag.{xs|sm|md|lg}
typography.{mode}.ui.tab.{sm|md|lg}
```

Not every component needs all 5 tiers — each component's README declares which subset it supports.

### 3. Canonical 5-tier scale: `xs | sm | md | lg | xl`

Add `2xs` / `2xl` only when a specific component genuinely needs them. Button needs xs → xl. Most other components will need sm → lg only.

### 4. Component size tokens in `components.json` reference the `ui` tokens

```json
"button": {
  "size": {
    "xs": { "typography": "{typography.comfortable.ui.button.xs}" },
    "sm": { "typography": "{typography.comfortable.ui.button.sm}" },
    "md": { "typography": "{typography.comfortable.ui.button.md}" },
    "lg": { "typography": "{typography.comfortable.ui.button.lg}" },
    "xl": { "typography": "{typography.comfortable.ui.button.xl}" }
  }
}
```

Height and padding-x tokens for each size tier belong here too (see below).

---

## Height and Padding: Harmonious Spatial Scaling

### Vertical trim

Button typography uses **vertical trim** (`text-box-trim: both; text-edge: cap alphabetic` / Figma's "Vertical trim"). This strips above-cap and below-baseline spacing so text sits flush to its cap-height. Line-height is irrelevant to layout — it gets clipped. Only **font-size** (which determines cap-height) and **padding-y** drive the visual height.

### The governing formula

```
height = cap-height + (2 × padding-y)   [visual model]
height = size-* token                    [what gets set in CSS/Figma]
padding-x = 2 × padding-y
```

Because cap-height varies by typeface, the height tokens are arrived at visually in Figma and then snapped to the nearest `size-*` token. The formula is the validation test, not the generation method.

The **2:1 padding-x:padding-y ratio** keeps button proportions visually consistent at every size.

### Mapping to existing primitive tokens

Using font sizes 12→14→16→18→20 (+2 arithmetic step):

| Size | font-size | padding-y (visual) | height → size token | padding-x → space token |
|------|-----------|--------------------|---------------------|-------------------------|
| xs   | 12        | ~6                 | **28** → `size-28`  | 12 → `space-12`         |
| sm   | 14        | ~6                 | **32** → `size-32`  | 12 → `space-12`         |
| md   | 16        | ~8                 | **40** → `size-40`  | 16 → `space-16`         |
| lg   | 18        | ~10                | **48** → `size-48`  | 20 → `space-20`         |
| xl   | 20        | ~12                | **56** → `size-56`  | 24 → `space-24`         |

Every height lands exactly on an existing `size-*` token. Every padding-x lands on an existing `space-*` token. No new primitive tokens are needed.

Because line-height is trimmed, `ui.button.*` tokens only need to specify font-family, font-weight, and font-size — line-height is included for non-trimmed contexts (accessibility tools, fallback rendering) but does not drive the height calculation.

### Density context interaction

Height and padding are **fixed per size tier** — they do not scale with density context. Only the typography (font-size) scales. A `lg` button is always 48px tall regardless of whether it appears in a Compact or Spacious layout; the text inside it simply uses the Compact or Spacious `ui.button.lg` type style.

### Full `components.json` token shape

```json
"button": {
  "size": {
    "xs": {
      "typography": "{typography.comfortable.ui.button.xs}",
      "height": "{size.size-28}",
      "padding-x": "{space.space-12}"
    },
    "sm": {
      "typography": "{typography.comfortable.ui.button.sm}",
      "height": "{size.size-32}",
      "padding-x": "{space.space-12}"
    },
    "md": {
      "typography": "{typography.comfortable.ui.button.md}",
      "height": "{size.size-40}",
      "padding-x": "{space.space-16}"
    },
    "lg": {
      "typography": "{typography.comfortable.ui.button.lg}",
      "height": "{size.size-48}",
      "padding-x": "{space.space-20}"
    },
    "xl": {
      "typography": "{typography.comfortable.ui.button.xl}",
      "height": "{size.size-56}",
      "padding-x": "{space.space-24}"
    }
  }
}
```

The three properties (`typography`, `height`, `padding-x`) are the repeating pattern for every component that carries text and has a size tier. The ratio and formula stay the same; only which subset of tiers the component exposes differs.

---

## Implementation Order

1. **Figma** — Add size variants to the `ui.button` variable in each density mode. Validate all 15 combinations (5 sizes × 3 densities) visually. Lock down font-size values before touching files.

2. **`packages/tokens/src/semantic.json`** — Expand `typography.compact.ui.button`, `typography.comfortable.ui.button`, and `typography.spacious.ui.button` from a single token to 5 size-keyed tokens. Repeat for `ui.label`.

3. **`packages/tokens/src/components.json`** — Add `button.size` section with `typography`, `height`, and `padding-x` references per tier.

4. **`packages/react` Button component** — Add `size` prop (`"xs" | "sm" | "md" | "lg" | "xl"`, default `"md"`). Map each value to the corresponding CSS custom property. Proves the convention end to end.

5. **Propagate** — Every subsequent component picks from the established tier set and documents which subset it supports in its README.
