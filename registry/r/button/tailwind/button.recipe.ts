/*
 * Button — Primitiv default theme, Tailwind v4 recipe.
 *
 * Copied into the consumer repo by `primitiv add button --format tailwind`,
 * which also installs `class-variance-authority` and copies the CSS contract
 * stylesheet (`styles.css`) + the token `@theme` preset. It is yours to edit.
 *
 * Why a `cva` recipe over the contract classes — not Tailwind utilities
 * (RFC 0006 §6.1: authored, not transpiled; arbitrary CSS → utilities is lossy):
 *
 *   - Button's design consumes the `action/*`, `framed-control/*` and `label/*`
 *     semantic tokens, which fall outside Tailwind v4's utility namespaces
 *     (`color`, `spacing`, `radius`, `text`, …) — a utility recipe would degrade
 *     to `bg-[var(--primitiv-action-primary-default)]` arbitrary-value soup.
 *   - The per-component `--primitiv-button-*` knob seam, the `text-box-trim`
 *     leading-trim, the layer-ordered states, and (in future components)
 *     `@keyframes` have no utility form at all.
 *
 * So the recipe is pure `cva` ergonomics: it maps the `intent` / `size` props to
 * the contract's modifier classes (`registry/r/button/contract.json`), and the
 * styling resolves through the copied `styles.css` — whose custom properties
 * resolve the token layer, and which re-skins per `[data-theme]` / `[data-density]`
 * exactly as the CSS and SCSS forms do. The visual design round-trips perfectly
 * because it is never transpiled; the recipe carries no CSS.
 */
import { cva, type VariantProps } from "class-variance-authority";

export const button = cva("primitiv-button", {
  variants: {
    intent: {
      primary: "primitiv-button--primary",
      secondary: "primitiv-button--secondary",
      danger: "primitiv-button--danger",
      link: "primitiv-button--link",
    },
    size: {
      xs: "primitiv-button--xs",
      sm: "primitiv-button--sm",
      md: "primitiv-button--md",
      lg: "primitiv-button--lg",
      xl: "primitiv-button--xl",
    },
  },
  defaultVariants: {
    intent: "primary",
    size: "md",
  },
});

export type ButtonVariants = VariantProps<typeof button>;
