# @primitiv/icons

Fill-based SVG icon library for the Primitiv ecosystem. Icons inherit `currentColor`, scale via a `size` prop, and accept all native SVG attributes. Zero styles, zero runtime overhead, full tree-shaking.

## Usage

Within the Primitiv workspace, import directly — no build step required:

```tsx
import { Check } from "@primitiv/icons";

// Default size (24px)
<Check />

// Custom pixel size
<Check size={16} />

// Rem-based size
<Check size="1rem" />

// Tailwind color via currentColor inheritance
<Check className="text-green-500" />

// Accessible (not decorative)
<Check aria-label="Confirmed" />
```

## Props

All icons share the same props via `IconProps`:

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `number \| string` | `24` | Sets both `width` and `height`. Accepts pixel numbers (`16`) or CSS strings (`"1rem"`). |
| `className` | `string` | — | Applied to the `<svg>` element. Use Tailwind's `text-*` utilities to set `currentColor`. |
| `aria-label` | `string` | — | Makes the icon accessible to screen readers. When absent the icon is `aria-hidden="true"` (decorative). |
| `fill` | `string` | `"currentColor"` | Override the fill colour directly. |
| `ref` | `Ref<SVGSVGElement>` | — | Forwarded to the underlying `<svg>` element. |

All other [SVG element attributes](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute) are accepted and forwarded.

## Icons

| Icon | Import |
|---|---|
| [Check](src/icons/Check.tsx) | `import { Check } from "@primitiv/icons"` |

## Adding icons from Figma

1. Export the icon at **24 × 24 px** (the `md` canonical size) as an SVG from Figma.
2. Drop the `.svg` file into `icons/svg/`, using kebab-case for the filename (e.g. `arrow-right.svg`).
3. Run the generator:

   ```sh
   pnpm generate
   ```

4. Review the generated component in `src/icons/`. The generator optimises paths via SVGO and converts hyphenated SVG attribute names to JSX camelCase. Hand-edit the output if needed — the generated files are committed source, not disposable artifacts.
5. Add a row to the **Icons** table in this README.
6. Write a smoke test in `src/icons/<Name>.test.tsx` (see `Check.test.tsx` as a template).

The five design sizes (`xs`=16, `sm`=20, `md`=24, `lg`=32, `xl`=48) are all driven by the `size` prop at runtime — only the `md` SVG needs to be exported from Figma.

## Architecture

```
icons/svg/*.svg          ← source files from Figma (committed)
    ↓  pnpm generate
src/icons/*.tsx          ← generated components (committed, reviewable)
src/IconBase.tsx         ← shared SVG wrapper (sets viewBox, fill, aria-hidden)
src/types.ts             ← IconProps interface
src/index.ts             ← re-exports everything
```

`IconBase` is exported for advanced use cases (e.g. building custom icon wrappers) but is not needed for normal icon consumption.

## Testing

```sh
# Run all icon tests once
npx vitest run

# Watch mode
npx vitest

# With coverage
npx vitest run --coverage
```
