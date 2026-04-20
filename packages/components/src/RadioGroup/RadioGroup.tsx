import { useCallback, useEffect, useMemo, useRef } from "react";

import { composeEventHandlers } from "../Slot";

import { RadioGroupContext } from "./RadioGroupContext";
import { useRadioGroupContext, useRadioGroupRoot } from "./hooks";
import { RadioGroupItemProps, RadioGroupRootProps } from "./types";

function RadioGroupRoot({
  defaultValue,
  value: controlledValue,
  onValueChange,
  children,
  ...rest
}: RadioGroupRootProps) {
  const { value, select, registerItem, itemValues } = useRadioGroupRoot({
    defaultValue,
    value: controlledValue,
    onValueChange,
  });
  const contextValue = useMemo(
    () => ({ value, select, registerItem, itemValues }),
    [value, select, registerItem, itemValues],
  );
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
  ref,
  ...rest
}: RadioGroupItemProps) {
  const {
    value: selectedValue,
    select,
    registerItem,
    itemValues,
  } = useRadioGroupContext();
  const isChecked = selectedValue === value;
  const isTabStop =
    selectedValue !== undefined
      ? isChecked
      : itemValues[0] === value;

  const localRef = useRef<HTMLButtonElement | null>(null);
  const setRef = useCallback(
    (node: HTMLButtonElement | null) => {
      localRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref],
  );

  useEffect(() => {
    registerItem(value, localRef.current);
    return () => registerItem(value, null);
  }, [value, registerItem]);

  return (
    <button
      ref={setRef}
      type="button"
      role="radio"
      aria-checked={isChecked}
      data-state={isChecked ? "checked" : "unchecked"}
      tabIndex={isTabStop ? 0 : -1}
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
