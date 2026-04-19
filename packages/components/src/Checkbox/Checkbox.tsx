import { useMemo } from "react";

import { Slot, composeEventHandlers } from "../Slot";

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
    asChild = false,
    children,
    ...rest
  } = props;
  const { checked: isChecked, toggle } = useCheckboxRoot({
    defaultChecked,
    checked,
    onCheckedChange,
  });
  const contextValue = useMemo(() => ({ checked: isChecked }), [isChecked]);
  const rootProps = {
    ...rest,
    role: "checkbox" as const,
    "aria-checked":
      isChecked === "indeterminate" ? ("mixed" as const) : (isChecked as boolean),
    "data-state": dataStateOf(isChecked),
    "data-disabled": disabled ? "" : undefined,
    disabled,
    onClick: composeEventHandlers(onClick, toggle),
  };
  return (
    <CheckboxContext.Provider value={contextValue}>
      {asChild ? (
        <Slot {...rootProps}>{children}</Slot>
      ) : (
        <button type="button" {...rootProps}>
          {children}
        </button>
      )}
    </CheckboxContext.Provider>
  );
}

CheckboxRoot.displayName = "CheckboxRoot";

function CheckboxIndicator({
  children,
  forceMount,
  asChild = false,
  ...rest
}: CheckboxIndicatorProps) {
  const { checked } = useCheckboxContext();
  const isVisible = checked !== false;
  if (!isVisible && !forceMount) return null;
  const indicatorProps = {
    ...rest,
    "aria-hidden": "true" as const,
    "data-state": dataStateOf(checked),
  };
  if (asChild) {
    return <Slot {...indicatorProps}>{children}</Slot>;
  }
  return <span {...indicatorProps}>{children}</span>;
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
