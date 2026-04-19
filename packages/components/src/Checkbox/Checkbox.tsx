import { useMemo } from "react";

import { composeEventHandlers } from "../Slot";

import { CheckboxContext } from "./CheckboxContext";
import { useCheckboxContext, useCheckboxRoot } from "./hooks";
import {
  CheckboxIndicatorProps,
  CheckboxRootProps,
  CheckedState,
} from "./types";

function dataStateOf(checked: CheckedState) {
  if (checked === "indeterminate") return "indeterminate" as const;
  return checked ? ("checked" as const) : ("unchecked" as const);
}

function CheckboxRoot(props: CheckboxRootProps) {
  const {
    defaultChecked,
    checked,
    onCheckedChange,
    onClick,
    disabled,
    children,
    ...rest
  } = props;
  const { checked: isChecked, toggle } = useCheckboxRoot({
    defaultChecked,
    checked,
    onCheckedChange,
  });
  const contextValue = useMemo(() => ({ checked: isChecked }), [isChecked]);
  return (
    <CheckboxContext.Provider value={contextValue}>
      <button
        type="button"
        role="checkbox"
        aria-checked={
          isChecked === "indeterminate" ? "mixed" : (isChecked as boolean)
        }
        data-state={dataStateOf(isChecked)}
        data-disabled={disabled ? "" : undefined}
        disabled={disabled}
        onClick={composeEventHandlers(onClick, toggle)}
        {...rest}
      >
        {children}
      </button>
    </CheckboxContext.Provider>
  );
}

CheckboxRoot.displayName = "CheckboxRoot";

function CheckboxIndicator({
  children,
  forceMount,
  ...rest
}: CheckboxIndicatorProps) {
  const { checked } = useCheckboxContext();
  const isVisible = checked !== false;
  if (!isVisible && !forceMount) return null;
  return (
    <span
      aria-hidden="true"
      data-state={dataStateOf(checked)}
      {...rest}
    >
      {children}
    </span>
  );
}

CheckboxIndicator.displayName = "CheckboxIndicator";

type TCheckboxCompound = typeof CheckboxRoot & {
  Root: typeof CheckboxRoot;
  Indicator: typeof CheckboxIndicator;
};

const CheckboxCompound: TCheckboxCompound = Object.assign(CheckboxRoot, {
  Root: CheckboxRoot,
  Indicator: CheckboxIndicator,
});

CheckboxCompound.displayName = "Checkbox";

export { CheckboxCompound as Checkbox };
