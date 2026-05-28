import { ComponentProps, ReactNode, Ref } from "react";

/**
 * Props for {@link Select.Root} — all `SelectHTMLAttributes` on the
 * underlying `<select>` element, plus a typed `ref`.
 */
export type SelectRootProps = ComponentProps<"select"> & {
  children?: ReactNode;
  ref?: Ref<HTMLSelectElement>;
};

/**
 * Props for {@link Select.Option} — all `OptionHTMLAttributes` on the
 * underlying `<option>` element, plus a typed `ref`.
 */
export type SelectOptionProps = ComponentProps<"option"> & {
  children?: ReactNode;
  ref?: Ref<HTMLOptionElement>;
};
