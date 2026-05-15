---
name: rust-wasm-workflow
description: Build/test commands and conventions for the Rust crates — running cargo tests, regenerating the wasm package, the harmoni-core ↔ harmoni-wasm mirror-types boundary, the api module boundary rule. TRIGGER when working in `crates/harmoni-core` or `crates/harmoni-wasm`, when regenerating the `.d.ts`, when adding a new wasm entry point, when writing or modifying a `From<harmoni_core::*> for types::*` conversion. SKIP for pure React work.
---

# Rust / wasm workflow

## Commands

```sh
# All workspace tests
cargo test --workspace

# Single crate
cargo test -p harmoni-core
cargo test -p harmoni-wasm

# Fast type check
cargo check --workspace

# Rebuild the wasm pkg the web app links into
pnpm run build:wasm
```

If `pnpm run build:wasm` fails with "wasm-pack: command not found",
see the `sandbox-gotchas` skill.

## The api module boundary

Adapters (wasm, future CLI, future Figma plugin) import only from
`harmoni_core::api`. They do **not** import from lower-level modules
inside `harmoni-core`, and they do **not** import from the `palette`
crate directly.

The `api` module re-exports:

```rust
pub use audit::audit_contrast;
pub use generate::{generate, generate_with_options, generate_with_lightness, GenerateOptions};
pub use neutral::{derive_soft_neutrals, generate_neutral_ramp, tint_neutrals};
```

If you find yourself reaching deeper, either lift the symbol into
`api` or rethink the access pattern.

(The old `generate_greyscale` re-export was removed — the `neutral`
module owns greyscale/neutral ramps now. See `generate_neutral_ramp`,
`derive_soft_neutrals`, `tint_neutrals`.)

## Mirror-types pattern

`harmoni-core` is pure Rust — no `wasm-bindgen`, no `tsify`. The
wasm adapter (`crates/harmoni-wasm`) holds **mirror types** in
`src/types.rs` that shadow the core structs field-for-field and
derive `Tsify`:

- `SwatchLabel`, `SwatchStep`, `ContrastResult`, `Swatch`, `Palette`,
  `TintMode`, and `SoftNeutrals` are mirrored.
- `OklchTriple` is a wasm-only helper — `SoftNeutrals` carries two of
  them, flattening `palette::Oklch` to plain `{ l, c, h }` floats
  because the wasm crate can't expose `Oklch` directly.
- Each has a `From<harmoni_core::*>` so wasm entry points convert at
  the boundary:

```rust
api::audit_contrast(...)
    .map(Into::into)     // harmoni_core::ContrastResult → types::ContrastResult
    .map_err(to_js_error)
```

A type the user passes **into** the engine (not just receives back)
needs `From` impls in *both* directions. `TintMode` is the example:
`From<core::TintMode> for types::TintMode` *and*
`From<types::TintMode> for core::TintMode`.

When you add a new field to a core struct, you must:

1. Add it to the core struct in `harmoni-core`.
2. Mirror it on the `types::*` struct in `harmoni-wasm`.
3. Update the `From` impl.
4. Regenerate the wasm pkg if you want the new TS types in the web
   app: `pnpm run build:wasm`.

When you add a new wasm **entry point**, take CSS strings for colour
arguments (`ColorInput::Css`), call the matching `api::*` function,
and `.map(Into::into).map_err(to_js_error)`. `generate_neutral_ramp`,
`derive_soft_neutrals`, and `tint_neutrals` all follow this shape.

## Opaque Palette extern type

`Vec<T>` isn't a first-class wasm-abi return type. The pattern is:

```rust
#[wasm_bindgen(typescript_custom_section)]
const TS_PALETTE: &'static str = r#"
export type Palette = Swatch[];
"#;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "Palette")]
    pub type Palette;
}
```

The TS-side `Swatch` is emitted by Tsify's
`typescript_custom_section` on `types::Swatch`. Both names line up
with the engine vocabulary so the web app's
`import { type Palette } from "harmoni-wasm"` resolves correctly.

## Color input

Every public entry point that accepts user-supplied colour takes
`ColorInput` (`crates/harmoni-core/src/color/input.rs`). The CSS
variant covers hex / `oklch(...)` / `rgb(...)` / named colours —
anything `csscolorparser` accepts. All variants normalise to
`palette::Oklch`, which is the internal canonical form.

Don't introduce a second parsing path. If a new shape is needed,
add a variant to `ColorInput`.

## Vocabulary

The domain types are: `SwatchLabel`, `SwatchStep`, `Swatch`,
`Palette` (type alias for `Vec<Swatch>`). Don't reintroduce the
older `OklchStep`/`OklchLabel`/(old)`Palette` names — those were
renamed in the post-Step B vocabulary alignment.
