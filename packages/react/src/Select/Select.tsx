import { SelectOptionProps, SelectRootProps } from "./types";

/**
 * The root of a Select — renders a native `<select>` element and passes
 * all `SelectHTMLAttributes` through to the DOM.
 *
 * Browser-native behaviour is preserved: keyboard navigation (arrow keys,
 * Home/End, typeahead), the platform popup, mobile UX, and form submission
 * all work without additional JS.
 */
function SelectRoot({ children, ...rest }: SelectRootProps) {
  return <select {...rest}>{children}</select>;
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

type TSelectCompound = typeof SelectRoot & {
  Root: typeof SelectRoot;
  Option: typeof SelectOption;
};

const SelectCompound: TSelectCompound = Object.assign(SelectRoot, {
  Root: SelectRoot,
  Option: SelectOption,
});

SelectCompound.displayName = "Select";

export { SelectCompound as Select };
