import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

/**
 * Drift guard for the Button Tailwind recipe (RFC 0006 §6.1). The recipe is
 * authored, not derived — `cva` over the styling *contract* (D: "Registry CSS,
 * derive rest"; the recipe applies the contract's classes, the styling lives in
 * the copied `styles.css`). It cannot be byte-equality-checked like the SCSS
 * form, so this guard pins it to `contract.json`: the recipe must map exactly
 * the contracted modifier classes and apply the contracted root class, so it
 * can never silently drift from the contract surface.
 *
 * Read as *text*, never imported, so the test resolves no `class-variance-authority`
 * dependency — the recipe ships as source for the consumer's build.
 */
const here = dirname(fileURLToPath(import.meta.url));

const contract = JSON.parse(
  readFileSync(resolve(here, "../../../../../registry/r/button/contract.json"), "utf8"),
);

const recipe = readFileSync(
  resolve(here, "../../../../../registry/r/button/tailwind/button.recipe.ts"),
  "utf8",
);

/** Every modifier class the contract declares, across all modifier groups. */
function contractModifierClasses(): string[] {
  return Object.values(contract.modifiers)
    .flatMap((group) => Object.values(group as Record<string, string>))
    .sort();
}

/** Every distinct `primitiv-button--*` modifier class the recipe references. */
function recipeModifierClasses(): string[] {
  const matches = recipe.match(/primitiv-button--[a-z]+/g) ?? [];
  return [...new Set(matches)].sort();
}

describe("Button Tailwind recipe contract", () => {
  it("applies the root class the contract declares", () => {
    expect(recipe).toContain(`"${contract.root.class}"`);
  });

  it("maps exactly the contract's modifier classes — no drift", () => {
    expect(recipeModifierClasses()).toEqual(contractModifierClasses());
  });
});
