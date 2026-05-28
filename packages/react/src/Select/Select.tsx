import { ChangeEvent } from "react";

import {
  SelectGroupProps,
  SelectOptionProps,
  SelectRootProps,
} from "./types";

/**
 * The root of a Select — renders a native `<select>` element and passes
 * all `SelectHTMLAttributes` through to the DOM.
 *
 * Browser-native behaviour is preserved: keyboard navigation (arrow keys,
 * Home/End, typeahead), the platform popup, mobile UX, and form
 * submission all work without additional JS.
 *
 * Supports two state modes, statically discriminated at the type level:
 *
 * - **Uncontrolled** — pass `defaultValue` (or omit it). The browser owns
 *   the selection. `onValueChange` is optional.
 * - **Controlled** — pass `value` and `onValueChange` together. Every
 *   transition defers back through `onValueChange`.
 *
 * `onValueChange` receives the new selection as a plain string. The
 * consumer's own `onChange` (the raw `ChangeEvent`) still fires alongside
 * it.
 */
function SelectRoot({
  children,
  onChange,
  onValueChange,
  ...rest
}: SelectRootProps) {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange?.(event);
    onValueChange?.(event.target.value);
  };

  return (
    <select {...rest} onChange={handleChange}>
      {children}
    </select>
  );
}

SelectRoot.displayName = "SelectRoot";

/**
 * An individual choice inside a Select — renders a native `<option>`
 * element and passes all `OptionHTMLAttributes` through to the DOM.
 *
 * Native `<option>` only renders text; rich content (icons, descriptions)
 * is not supported.
 */
function SelectOption({ children, ...rest }: SelectOptionProps) {
  return <option {...rest}>{children}</option>;
}

SelectOption.displayName = "SelectOption";

/**
 * Visually groups related options inside the Select popup — renders a
 * native `<optgroup>` element. The `label` is shown by the browser as a
 * non-selectable heading and is announced as the group's accessible name.
 */
function SelectGroup({ children, ...rest }: SelectGroupProps) {
  return <optgroup {...rest}>{children}</optgroup>;
}

SelectGroup.displayName = "SelectGroup";

type TSelectCompound = typeof SelectRoot & {
  Root: typeof SelectRoot;
  Option: typeof SelectOption;
  Group: typeof SelectGroup;
};

const SelectCompound: TSelectCompound = Object.assign(SelectRoot, {
  Root: SelectRoot,
  Option: SelectOption,
  Group: SelectGroup,
});

SelectCompound.displayName = "Select";

export { SelectCompound as Select };
