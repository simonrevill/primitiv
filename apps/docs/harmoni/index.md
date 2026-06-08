---
title: Harmoni
---

# Harmoni

**Harmoni** is the palette-generation engine that powers Primitiv. It takes a
single brand colour and produces a harmonious, contrast-audited scale — in both
light and dark — using a perceptually uniform colour space.

## Architecture

Harmoni is split across two crates so the engine stays portable:

| Crate | Role |
| --- | --- |
| [`harmoni-core`](/harmoni/core) | Pure Rust. Palette generation, neutral ramps, and WCAG contrast audit. Three direct dependencies (`csscolorparser`, `palette`, `serde`); knows nothing about JavaScript or WASM. |
| [`harmoni-wasm`](/harmoni/wasm) | The only place `wasm-bindgen` and `tsify` live. Mirror types shadow the core structs and convert at the boundary, exposing a typed API to the browser. |

The same `harmoni-core` engine can back a WASM browser runtime, a CLI, or
future native bindings. Adapters program against `harmoni_core::api` — never the
lower-level modules.

## Colour model

Every colour input is normalised to **OkLCH** via the `palette` crate. OkLCH is
perceptually uniform, which is what makes the lightness scale and chroma
interpolation feel consistent across hues.

Contrast ratios use the standard WCAG 2.1 relative-luminance formula:

- **AAA** ≥ 7.0
- **AA** ≥ 4.5
- otherwise **Fail**

## Where it runs

The [workbench](/workbench/) home page drives Harmoni live through
`harmoni-wasm` — generate a palette from any colour and watch the contrast
audit update in real time.
