# Primitiv

**Primitiv** is a design system. **Harmoni** is the palette generation engine that powers it.

This repo is a monorepo that houses both: the Rust engine (`harmoni-core`),
the WebAssembly adapter that exposes it to the browser (`harmoni-wasm`),
and the React app used to develop and visualise palettes during iteration
(`apps/web`). The engine will eventually back a Figma plugin so that
designers can pull Primitiv palettes directly into their Figma files.

## Repo layout

```
primitiv/
├── Cargo.toml                 # Rust workspace
├── pnpm-workspace.yaml        # pnpm workspace
├── crates/
│   ├── harmoni-core/          # Pure-Rust palette generation + contrast audit
│   └── harmoni-wasm/          # wasm-bindgen adapter; consumed by apps/web
└── apps/
    └── web/                   # React dev surface (Vite + TS)
```

- `harmoni-core` is pure Rust. It has three direct dependencies
  (`csscolorparser`, `palette`, `serde`) and knows nothing about
  JavaScript, TypeScript, or any adapter. It is intended to be
  portable: the same engine can back a wasm browser runtime, a CLI,
  or future native bindings.
- `harmoni-wasm` is the only place `wasm-bindgen` and `tsify` live.
  It holds mirror types that shadow the core structs, derive the
  Tsify TypeScript/ABI machinery, and convert at the boundary via
  `From<harmoni_core::*>`. Adapters for non-wasm runtimes would
  live as sibling crates alongside it.
- `apps/web` is a small React app used for visual iteration on the
  palette algorithm. It is **not** a production surface for the
  design system — think of it as a workbench.

## Engine surface

Adapters should program against `harmoni_core::api`, never the
lower-level modules. The curated surface is small by design:

```rust
// Palette generation (Palette = Vec<Swatch>)
api::generate(ColorInput) -> Result<Palette, ColorInputError>
api::generate_with_options(ColorInput, GenerateOptions)
    -> Result<Palette, ColorInputError>
api::generate_greyscale() -> Palette

// Contrast audit
api::audit_contrast(ColorInput, ColorInput)
    -> Result<ContrastResult, ColorInputError>
```

All colour input goes through the `ColorInput` enum, which is the
single parsing path:

```rust
ColorInput::Css(String)              // any CSS colour: #hex, oklch(...), rgb(...), named
ColorInput::Rgb { r: u8, g: u8, b: u8 }
ColorInput::Hsl { h: f32, s: f32, l: f32 }
ColorInput::Oklch { l: f32, c: f32, h: f32 }
```

Internally, everything is normalised to OkLCH via the `palette`
crate. OkLCH is perceptually uniform, which is what makes the
lightness scale and chroma interpolation feel consistent across
hues. Contrast ratios use the standard WCAG 2.1 relative luminance
formula (`AAA ≥ 7.0`, `AA ≥ 4.5`).

## Getting started

Prerequisites:

- Rust (stable)
- Node 20+ and pnpm 10
- [`wasm-pack`](https://rustwasm.github.io/wasm-pack/installer/)
  (only required to rebuild the wasm package for the web app)

Install dependencies and run the Rust test suite:

```sh
pnpm install
cargo test --workspace
```

Rebuild the wasm package and start the web dev server:

```sh
pnpm run build:wasm
pnpm run dev
```

`pnpm run build:wasm` regenerates `crates/harmoni-wasm/pkg/`,
which is what `apps/web` consumes via a pnpm workspace link. The
`pkg/` directory is not tracked in git; it is always rebuilt
from source.

## Development expectations

- **Strict TDD.** New behaviour is driven by a failing test
  first (red → green → refactor). Pure red-green — no
  characterisation tests that pass the moment you write them.
  Existing tests must stay green throughout any refactor.
- **Small commits.** One per red-green(-refactor) cycle. Each
  commit should leave the tree green and describe its own intent.
- **Push often.** "Push little and often" — land work in
  short-lived branches via PRs rather than accumulating large
  unshared histories.
- **Adapters program against `harmoni_core::api`.** Do not reach
  into `harmoni_core::audit`, `harmoni_core::palette::generator`,
  or the `palette` crate directly. If the adapter needs something
  the `api` module doesn't expose, extend the `api` module first.

## License

TBD.
