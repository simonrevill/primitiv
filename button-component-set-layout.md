# Button Component Set — Figma Layout Plan

## Dimensions

| Axis       | Values                                        | Direction              |
|------------|-----------------------------------------------|------------------------|
| Density    | Compact, Comfortable, Spacious                | Sections, top → bottom |
| Size       | md (anchor), xs, sm, lg, xl                   | Rows within section    |
| Variant    | Primary, Secondary, Link, Danger              | Column groups          |
| State      | Default, Hover, Active, Focus, Disabled       | Columns within variant |
| Icon slots | Leading + Trailing (always present, toggle off to hide) | Baked into every cell |

**Total: 3 densities × 5 sizes × 4 variants × 5 states = 300 components**

Icon-only Button will be a separate component, built later.

---

## Size ordering rationale

With five sizes (xs → xl), strict ascending order puts **xs** at row 1. But Figma's
default instance is always the top-left component in the set, which must be
**Compact / md**. These two requirements conflict.

Resolution: **md anchors row 1 in every density section**, followed by xs → sm → lg → xl
in ascending order below. The ascending sequence is preserved for all five sizes; md
simply sits above it as the canonical default. Row labels make this self-evident.

---

## Layout diagram

```
BUTTON COMPONENT SET
═══════════════════════════════════════════════════════════════════════════════════════════════════
          ←──── Primary ──────────────── ←── Secondary ──────────────── ←── Link ──────────────── ←── Danger ────────────────
          Def  Hov  Act  Foc  Dis        Def  Hov  Act  Foc  Dis        Def  Hov  Act  Foc  Dis   Def  Hov  Act  Foc  Dis
──────────────────────────────────────────────────────────────────────────────────────────────────────── COMPACT
  md ★    [  ] [  ] [  ] [  ] [  ]       [  ] [  ] [  ] [  ] [  ]       [  ] [  ] [  ] [  ] [  ]  [  ] [  ] [  ] [  ] [  ]
  xs      [  ] [  ] [  ] [  ] [  ]       [  ] [  ] [  ] [  ] [  ]       [  ] [  ] [  ] [  ] [  ]  [  ] [  ] [  ] [  ] [  ]
  sm      [  ] [  ] [  ] [  ] [  ]       [  ] [  ] [  ] [  ] [  ]       [  ] [  ] [  ] [  ] [  ]  [  ] [  ] [  ] [  ] [  ]
  lg      [  ] [  ] [  ] [  ] [  ]       [  ] [  ] [  ] [  ] [  ]       [  ] [  ] [  ] [  ] [  ]  [  ] [  ] [  ] [  ] [  ]
  xl      [  ] [  ] [  ] [  ] [  ]       [  ] [  ] [  ] [  ] [  ]       [  ] [  ] [  ] [  ] [  ]  [  ] [  ] [  ] [  ] [  ]
──────────────────────────────────────────────────────────────────────────────────────────────────────── COMFORTABLE
  md      [  ] [  ] [  ] [  ] [  ]       [  ] [  ] [  ] [  ] [  ]       [  ] [  ] [  ] [  ] [  ]  [  ] [  ] [  ] [  ] [  ]
  xs      [  ] [  ] [  ] [  ] [  ]       [  ] [  ] [  ] [  ] [  ]       [  ] [  ] [  ] [  ] [  ]  [  ] [  ] [  ] [  ] [  ]
  sm      [  ] [  ] [  ] [  ] [  ]       [  ] [  ] [  ] [  ] [  ]       [  ] [  ] [  ] [  ] [  ]  [  ] [  ] [  ] [  ] [  ]
  lg      [  ] [  ] [  ] [  ] [  ]       [  ] [  ] [  ] [  ] [  ]       [  ] [  ] [  ] [  ] [  ]  [  ] [  ] [  ] [  ] [  ]
  xl      [  ] [  ] [  ] [  ] [  ]       [  ] [  ] [  ] [  ] [  ]       [  ] [  ] [  ] [  ] [  ]  [  ] [  ] [  ] [  ] [  ]
──────────────────────────────────────────────────────────────────────────────────────────────────────── SPACIOUS
  md      [  ] [  ] [  ] [  ] [  ]       [  ] [  ] [  ] [  ] [  ]       [  ] [  ] [  ] [  ] [  ]  [  ] [  ] [  ] [  ] [  ]
  xs      [  ] [  ] [  ] [  ] [  ]       [  ] [  ] [  ] [  ] [  ]       [  ] [  ] [  ] [  ] [  ]  [  ] [  ] [  ] [  ] [  ]
  sm      [  ] [  ] [  ] [  ] [  ]       [  ] [  ] [  ] [  ] [  ]       [  ] [  ] [  ] [  ] [  ]  [  ] [  ] [  ] [  ] [  ]
  lg      [  ] [  ] [  ] [  ] [  ]       [  ] [  ] [  ] [  ] [  ]       [  ] [  ] [  ] [  ] [  ]  [  ] [  ] [  ] [  ] [  ]
  xl      [  ] [  ] [  ] [  ] [  ]       [  ] [  ] [  ] [  ] [  ]       [  ] [  ] [  ] [  ] [  ]  [  ] [  ] [  ] [  ] [  ]
═══════════════════════════════════════════════════════════════════════════════════════════════════

★  Top-left = Compact / md / Primary / Default → Figma default instance
[  ] Each cell contains: leading icon + label + trailing icon (all visible; toggle off to hide)
```

---

## Spacing guide

| Gap              | Value | Between                                         |
|------------------|-------|-------------------------------------------------|
| State instances  | 8px   | Default ↔ Hover ↔ Active ↔ Focus ↔ Disabled     |
| Variant groups   | 32px  | Primary ↔ Secondary ↔ Link ↔ Danger             |
| Size rows        | 12px  | md ↔ xs ↔ sm ↔ lg ↔ xl within a density section |
| Density sections | 64px  | Compact ↔ Comfortable ↔ Spacious                |
