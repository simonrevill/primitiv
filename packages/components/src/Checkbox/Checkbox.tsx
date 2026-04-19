import { composeEventHandlers } from "../Slot";

import { useCheckboxRoot } from "./hooks";
import { CheckboxRootProps } from "./types";

function CheckboxRoot(props: CheckboxRootProps) {
  const { defaultChecked, onCheckedChange, onClick, ...rest } = props;
  const { checked: isChecked, toggle } = useCheckboxRoot({
    defaultChecked,
    onCheckedChange,
  });
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={isChecked}
      data-state={isChecked ? "checked" : "unchecked"}
      onClick={composeEventHandlers(onClick, toggle)}
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
