# Claude working notes for primitiv/harmoni

This file is onboarding context for a future Claude session. It's
not a changelog and not user-facing documentation — that lives in
`README.md`. Here I record the user's preferences, the state of the
architecture, the reasoning behind the current shape, and any traps
that caught me out so a fresh session can pick up without retracing.

## Two names, one repo

- **Primitiv** is the user's design system — the product.
- **Harmoni** is the palette generation engine inside it — the
  code name for what was formerly called `primitiv-core` /
  `primitiv-wasm`.

A useful heuristic when deciding whether to rename a string:
- Is this the engine crate / Rust code / wasm adapter? → `harmoni`
- Is this the product, the app title, the repo name, the README
  heading, the `<h1>` in the web app? → leave it as `Primitiv`

The deliberate "Primitiv" references kept after the rename are:

- `README.md` heading (`# Primitiv`)
- Root `package.json` `"name": "primitiv"`
- `apps/web/index.html` `<title>Primitiv</title>`
- `apps/web/src/App.tsx` `<h1>Primitiv Engine</h1>`

If you find yourself renaming any of these, stop — you're eroding
the identity split on purpose established during Step B.

## Working style (important)

The user works under **strict TDD** and holds the line on it. The
rules below are not suggestions.

1. **Red → green → refactor.** New behaviour starts with a
   failing test. The test is committed as the red state, then the
   implementation lands as the green state, then any cleanup
   lands as a separate refactor commit. Existing tests must stay
   green throughout.
2. **Pure red-green.** No characterisation tests that pass the
   moment they're written. If a test passes immediately on the
   first run, delete it and find a genuinely new behaviour to
   drive out. I got this wrong once with a `dark_padding`
   characterisation test; the user corrected with "pure red green
   please" and I pivoted to a legitimate new test.
3. **Small commits.** One per red-green(-refactor) cycle. Don't
   batch unrelated work. Commit messages explain the "why",
   ending with the `https://claude.ai/code/session_…` footer the
   harness appends automatically via my commit template.
4. **Push little and often.** The user prefers short-lived
   branches with frequent pushes over accumulating a long
   unshared history. Push after each commit if practical.
5. **Leave the web app alone** unless the change is mechanically
   forced (e.g. import paths after a crate rename). The web app
   is an iteration workbench, not a production surface, and the
   user does not want drive-by UI changes.
6. **Never create PRs unopened.** Only open a PR when the user
   explicitly asks for one. "Update the PR description" /
   "create a new PR" are explicit; silence is not.
7. **GitHub interactions go through MCP tools** (`mcp__github__*`),
   not `gh` or the raw API. The available tools are restricted to
   `simonrevill/primitiv` — do not touch any other repo.

## Claude model strategy

Which model to use depends on task type. Default is Sonnet; escalate to Opus
for architectural decisions; use Haiku for syntax lookups.

**Quick decision tree:**
- "What should we do?" → Opus (design, trade-offs, architecture)
- "How do we implement this?" → Sonnet (implementation, TDD, refactoring)
- "What's the syntax?" → Haiku (lookups, clarifications, boilerplate)

**Task-type routing:**

*Opus 4.6 (design & architecture)*
- Exploring multiple approaches to a new system
- Comparing trade-offs (performance vs. maintainability, type safety vs. flexibility)
- Long-horizon refactoring strategy or system restructuring
- Complex TDD decisions ("what should we test?" not "how?")
- Cost: ~8–15k tokens (high reasoning, infrequent)

*Sonnet 4.6 (implementation & features)*
- Writing code once the design is clear
- TDD cycles (test → red → green → refactor)
- Feature implementation following an established pattern
- Code review and refactoring within a known approach
- Cost: ~5–12k tokens per iteration (faster, frequent)

*Haiku 4.5 (quick fixes & syntax)*
- Syntax questions in any language
- Quick clarifications or API lookups
- High-volume boilerplate tasks
- Cost: ~500–2k tokens (lightweight, as-needed)

**Canonical workflow for features:**

1. **Phase 1 — Exploration (Opus).** Discuss problem space, explore 2–3
   approaches, settle on design. ~8–15k tokens.
2. **Phase 2 — Implementation (Sonnet).** TDD cycle. Write test → implement →
   refactor. Multiple iterations as needed. ~5–12k tokens per iteration.
3. **Phase 3 — Refinement (Sonnet).** Continue implementation or move to
   related features. Escalate to Opus only if you hit a structural issue.

**Token efficiency tips:**

- **Batch design sessions.** One comprehensive Opus session beats multiple
  back-and-forth clarifications. Saves 30–40%.
- **Separate design from implementation.** Opus for design → Sonnet for code.
  Two conversations beats one mixed conversation. Saves ~12–15k tokens per feature.
- **Retry before escalating.** When Sonnet feels incomplete, retry with a
  clearer prompt first. Only escalate if retry fails.
- **Use Sonnet for TDD cycles.** Lower latency means faster iteration and more
  tests per token. Saves 20–30% vs. Opus for test writing.

When in doubt, default to Sonnet — it handles most tasks well and iterates
quickly. Reserve Opus for genuinely architectural decisions.

## Architecture — the shape we landed on

Four refactoring steps were executed in order C → D → A → B. They
all shipped in PRs #1 and #2.

### Step C — `ColorInput` abstraction

One enum is the only way to hand colours to the engine:

```rust
pub enum ColorInput {
    Css(String),            // parsed via csscolorparser
    Rgb { r: u8, g: u8, b: u8 },
    Hsl { h: f32, s: f32, l: f32 },
    Oklch { l: f32, c: f32, h: f32 },
}

pub enum ColorInputError {
    InvalidCss(String),
}
```

- Lives in `crates/harmoni-core/src/color/input.rs`.
- All variants normalise to `palette::Oklch`, which is the
  internal canonical form.
- `Css` covers hex, `oklch(...)`, `rgb(...)`, named colours —
  anything `csscolorparser` accepts.
- There is exactly one parsing path. Before this step there were
  three (`audit::contrast::parse_oklch_string`, the wasm crate's
  hex dance, and ad-hoc hex parsing) and they were consolidated
  here.
- The enum variant was initially named `Hex` because that was
  the first shape I wired up. I renamed it to `Css` in a
  dedicated refactor commit once I realised it accepted arbitrary
  CSS, and that the old name was misleading.

### Step D — curated `api` module

`crates/harmoni-core/src/api/` is the adapter-facing surface.
Adapters import from `harmoni_core::api`, never from lower-level
modules and never from the `palette` crate directly.

```rust
pub use audit::audit_contrast;
pub use generate::{generate, generate_with_options, GenerateOptions};
pub use crate::palette::generator::generate_greyscale_oklch as generate_greyscale;
```

- `generate_with_options` takes `GenerateOptions { light_padding,
  dark_padding }`. `generate` is a thin wrapper with defaults.
- `audit_contrast` is fallible because it accepts arbitrary CSS.
- `generate_greyscale` is intentionally infallible — it takes no
  user input, so there's nothing to validate. The web app calls it
  directly and would break if I made it fallible.
- The module-and-function name collision (`api::generate` is
  both a module and a re-exported function) is intentional. Rust
  allows it — same pattern as `std::mem::size_of`.

### Step A — `harmoni-core` is pure Rust

`wasm-bindgen` and `tsify` are **gone** from `harmoni-core`.
`crates/harmoni-core/Cargo.toml` has three direct deps only:
`csscolorparser`, `palette`, `serde`.

The Tsify/wasm-abi work moved to `crates/harmoni-wasm/src/types.rs`,
which holds mirror types that shadow the core structs field-for-field
(`SwatchLabel`, `SwatchStep`, `ContrastResult`, `Swatch`) and derive
`Tsify`. Each has `From<harmoni_core::*>` so wasm entry points convert
at the boundary:

```rust
api::audit_contrast(...)
    .map(Into::into)     // harmoni_core::ContrastResult → types::ContrastResult
    .map_err(to_js_error)
```

An opaque `Palette` extern type is used because `Vec<T>` isn't a
first-class wasm-abi return type. A `typescript_custom_section`
emits `export type Palette = Swatch[]` so the TS side gets a named
type alias matching the engine's vocabulary:

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

The TypeScript type `Swatch` in the generated `.d.ts` comes from
Tsify's `typescript_custom_section` emission on `types::Swatch`.
The web app's `import { type Palette } from "harmoni-wasm"` still
resolves because the emitted type name is identical.

### Step B — rename

`primitiv-core` → `harmoni-core`, `primitiv-wasm` → `harmoni-wasm`.
Everything Rust, tooling, and JS/TS now says `harmoni` except the
four product-name references listed above.

## Things that caught me out

- **`git mv` across device boundaries fails** in this sandbox with
  `Invalid cross-device link`. Use plain `mv` and then `git add -A`
  — git's rename detection picks it up at add time.
- **pnpm install without a wasm pkg dir.** The `apps/web` package
  depends on `harmoni-wasm: workspace:*`, which resolves to a
  workspace link at `crates/harmoni-wasm/pkg`. The `pkg/`
  directory is generated by `wasm-pack build` and is not tracked
  in git. If you rename the crate, `pnpm install` will fail
  with `ERR_PNPM_WORKSPACE_PKG_NOT_FOUND` until you either (a)
  run `pnpm run build:wasm` to regenerate the pkg under the new
  name, or (b) do a targeted in-place edit of `pnpm-lock.yaml`
  to rename the importer path and the workspace link. I did (b)
  during Step B because wasm-pack wasn't installed in the
  sandbox; `pnpm install --frozen-lockfile` confirmed the edits
  were valid.
- **`build:core` script is probably broken.** Root `package.json`
  has `"build:core": "pnpm --filter harmoni-core exec cargo build"`,
  but `harmoni-core` is a Rust crate, not a pnpm workspace
  package, so the filter shouldn't match. I did not fix this
  during the rename — the user didn't ask and it's pre-existing
  breakage. Flag it if relevant.
- **No `wasm-pack` in the sandbox.** I couldn't regenerate the
  `.d.ts` to verify that the Tsify relocation in Step A produced
  the same TypeScript types the web app expects. The structs are
  field-for-field identical and named identically, so the output
  *should* be byte-equivalent, but the user is going to verify
  manually. Flag this as pending.
- **`cargo test` is fine but `pnpm test:e2e` will fail.** The
  Playwright e2e test was deleted early in this work because it
  targeted a contrast-preview UI that no longer exists in
  `App.tsx`. The `test:e2e` script remains in root `package.json`
  and would fail with "no tests found" if run. Not yet replaced.

## Vocabulary rename (post-Step B)

The user renamed the domain types to align with design-system
language:

- `OklchStep` → `SwatchStep` — a single colour point with l/c/h
  and a label.
- `OklchLabel` → `SwatchLabel` — the discriminated label on a
  step (either a numeric scale position like `500` or a name like
  `"White"`).
- The struct formerly called `Palette` → `Swatch` — one item on a
  lightness scale, carrying its foreground recommendation and
  contrast metadata.
- `pub type Palette = Vec<Swatch>` — a type alias so the whole
  scale has a name. Generator return types simplify from
  `Vec<Palette>` to `Palette`.

The wasm mirror types (`types.rs`) and the web app's TypeScript
were updated mechanically. `Swatch.tsx` aliases the import as
`SwatchData` to avoid colliding with the React component name.

## Current state (post vocabulary rename)

- Steps C, D, A, B are done and landed (PRs #1, #2, #3 merged).
- Vocabulary rename (`OklchStep`/`OklchLabel`/`Palette` →
  `SwatchStep`/`SwatchLabel`/`Swatch` + `Palette` alias) is
  complete across all Rust, wasm, TS, and documentation.
- 47 core tests + 4 wasm conversion tests, all green.
- `harmoni-core` has 3 direct deps (`csscolorparser`, `palette`,
  `serde`), 0 wasm/JS/TS concerns.
- `harmoni-wasm` holds all Tsify/wasm-bindgen code.

## Natural next moves (nothing here is committed to)

The user has not prioritised any of these. List is for context,
not instructions.

- **Figma plugin.** A new adapter under `apps/` or a sibling
  crate. This is the eventual home of Harmoni.
- **CLI adapter.** `crates/harmoni-cli` that wraps
  `harmoni_core::api` for scripted palette work.
- **Replace the stale Playwright test** with one that matches the
  current `App.tsx`. The workbench is useful to verify visually
  but there's nothing automated around it.
- **Lift per-swatch metadata to Palette level.** Fields like
  `max_recommended_light_padding`, `max_recommended_dark_padding`,
  and `note` are currently duplicated on every `Swatch`. They
  logically belong on the palette (they're the same for every
  swatch in a given palette). If/when `Palette` becomes a struct
  instead of a type alias, these could move there.
- **Fix the broken `build:core` pnpm script** — see Things that
  caught me out.
- **Add a real LICENSE** — README currently says `TBD`.

## Useful commands

```sh
# Run all Rust tests
cargo test --workspace

# Build the wasm package for the web app
pnpm run build:wasm

# Run the web dev server
pnpm run dev

# Search for a specific thing with the right tool — do NOT use
# raw grep/find/rg from Bash. Use the Grep and Glob tools.
```
