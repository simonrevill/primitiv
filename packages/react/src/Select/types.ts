import { ChangeEventHandler, ComponentProps, ReactNode, Ref } from "react";

type SelectRootBaseProps = Omit<
  ComponentProps<"select">,
  "value" | "defaultValue" | "multiple" | "onChange"
> & {
  children?: ReactNode;
  ref?: Ref<HTMLSelectElement>;
  /**
   * Native `change` handler. Fires alongside `onValueChange` whenever the
   * user picks a different option. Use this when you want the raw
   * `ChangeEvent` (e.g. to inspect `event.target.validity`).
   */
  onChange?: ChangeEventHandler<HTMLSelectElement>;
};

type SelectRootUncontrolledProps = SelectRootBaseProps & {
  defaultValue?: string;
  value?: never;
  onValueChange?: (value: string) => void;
};

type SelectRootControlledProps = SelectRootBaseProps & {
  defaultValue?: never;
  value: string;
  onValueChange: (value: string) => void;
};

/**
 * Props for {@link Select.Root}.
 *
 * Two state modes are statically discriminated at the type level so only
 * one shape is accepted by TypeScript:
 *
 * - **Uncontrolled** — pass `defaultValue` (or omit it). The browser owns
 *   the selection state. `onValueChange` is optional.
 * - **Controlled** — pass `value` and `onValueChange` together. The
 *   parent owns the selection; the component defers every transition
 *   back through the callback.
 *
 * Native `multiple`-selection mode is not supported in v1.
 */
export type SelectRootProps =
  | SelectRootUncontrolledProps
  | SelectRootControlledProps;

/**
 * Props for {@link Select.Option} — all `OptionHTMLAttributes` on the
 * underlying `<option>` element, plus a typed `ref`.
 */
export type SelectOptionProps = ComponentProps<"option"> & {
  children?: ReactNode;
  ref?: Ref<HTMLOptionElement>;
};
