import { CheckboxRootProps } from "./types";

function CheckboxRoot({ ...rest }: CheckboxRootProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={false}
      data-state="unchecked"
      {...rest}
    />
  );
}

CheckboxRoot.displayName = "CheckboxRoot";

type TCheckboxCompound = typeof CheckboxRoot & {
  Root: typeof CheckboxRoot;
};

const CheckboxCompound: TCheckboxCompound = Object.assign(CheckboxRoot, {
  Root: CheckboxRoot,
});

CheckboxCompound.displayName = "Checkbox";

export { CheckboxCompound as Checkbox };
