import { useMemo } from "react";

import { composeEventHandlers } from "../Slot";

import { RadioGroupContext } from "./RadioGroupContext";
import { useRadioGroupContext, useRadioGroupRoot } from "./hooks";
import { RadioGroupItemProps, RadioGroupRootProps } from "./types";

function RadioGroupRoot({
  defaultValue,
  onValueChange,
  children,
  ...rest
}: RadioGroupRootProps) {
  const { value, select } = useRadioGroupRoot({ defaultValue, onValueChange });
  const contextValue = useMemo(() => ({ value, select }), [value, select]);
  return (
    <RadioGroupContext.Provider value={contextValue}>
      <div role="radiogroup" {...rest}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

RadioGroupRoot.displayName = "RadioGroupRoot";

function RadioGroupItem({
  value,
  children,
  onClick,
  ...rest
}: RadioGroupItemProps) {
  const { value: selectedValue, select } = useRadioGroupContext();
  const isChecked = selectedValue === value;
  return (
    <button
      type="button"
      role="radio"
      aria-checked={isChecked}
      data-state={isChecked ? "checked" : "unchecked"}
      onClick={composeEventHandlers(onClick, () => select(value))}
      {...rest}
    >
      {children}
    </button>
  );
}

RadioGroupItem.displayName = "RadioGroupItem";

type TRadioGroupCompound = typeof RadioGroupRoot & {
  Root: typeof RadioGroupRoot;
  Item: typeof RadioGroupItem;
};

const RadioGroupCompound: TRadioGroupCompound = Object.assign(RadioGroupRoot, {
  Root: RadioGroupRoot,
  Item: RadioGroupItem,
});

RadioGroupCompound.displayName = "RadioGroup";

export { RadioGroupCompound as RadioGroup };
