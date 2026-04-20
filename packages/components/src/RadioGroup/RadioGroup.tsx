import { useCallback, useEffect, useMemo, useRef } from "react";

import { Slot, composeEventHandlers } from "../Slot";

import { RadioGroupContext } from "./RadioGroupContext";
import { RadioGroupItemContext } from "./RadioGroupItemContext";
import {
  useRadioGroupContext,
  useRadioGroupItemContext,
  useRadioGroupRoot,
} from "./hooks";
import {
  RadioGroupIndicatorProps,
  RadioGroupItemProps,
  RadioGroupRootProps,
} from "./types";

function RadioGroupRoot({
  defaultValue,
  value: controlledValue,
  onValueChange,
  asChild = false,
  children,
  ...rest
}: RadioGroupRootProps) {
  const {
    value,
    select,
    registerItem,
    itemValues,
    disabledValues,
    focusItem,
  } = useRadioGroupRoot({
    defaultValue,
    value: controlledValue,
    onValueChange,
  });
  const contextValue = useMemo(
    () => ({
      value,
      select,
      registerItem,
      itemValues,
      disabledValues,
      focusItem,
    }),
    [value, select, registerItem, itemValues, disabledValues, focusItem],
  );
  const rootProps = { role: "radiogroup" as const, ...rest };
  return (
    <RadioGroupContext.Provider value={contextValue}>
      {asChild ? (
        <Slot {...rootProps}>{children}</Slot>
      ) : (
        <div {...rootProps}>{children}</div>
      )}
    </RadioGroupContext.Provider>
  );
}

RadioGroupRoot.displayName = "RadioGroupRoot";

const NEXT_KEYS = new Set(["ArrowDown", "ArrowRight"]);
const PREV_KEYS = new Set(["ArrowUp", "ArrowLeft"]);

function RadioGroupItem({
  value,
  children,
  onClick,
  onKeyDown,
  disabled,
  asChild = false,
  ref,
  ...rest
}: RadioGroupItemProps) {
  const {
    value: selectedValue,
    select,
    registerItem,
    itemValues,
    disabledValues,
    focusItem,
  } = useRadioGroupContext();
  const isChecked = selectedValue === value;
  const enabledValues = useMemo(
    () => itemValues.filter((v) => !disabledValues.has(v)),
    [itemValues, disabledValues],
  );
  const isTabStop =
    selectedValue !== undefined
      ? isChecked
      : enabledValues[0] === value;

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
    registerItem(value, localRef.current, disabled);
    return () => registerItem(value, null);
  }, [value, disabled, registerItem]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!NEXT_KEYS.has(event.key) && !PREV_KEYS.has(event.key)) return;
    event.preventDefault();
    if (enabledValues.length === 0) return;
    const currentIndex = enabledValues.indexOf(value);
    if (currentIndex === -1) return;
    const delta = NEXT_KEYS.has(event.key) ? 1 : -1;
    const nextIndex =
      (currentIndex + delta + enabledValues.length) % enabledValues.length;
    const nextValue = enabledValues[nextIndex];
    select(nextValue);
    focusItem(nextValue);
  };

  const itemContextValue = useMemo(
    () => ({ checked: isChecked }),
    [isChecked],
  );

  const itemProps = {
    ...rest,
    ref: setRef,
    role: "radio" as const,
    "aria-checked": isChecked,
    "data-state": isChecked ? ("checked" as const) : ("unchecked" as const),
    tabIndex: isTabStop ? 0 : -1,
    disabled,
    onClick: composeEventHandlers(onClick, () => select(value)),
    onKeyDown: composeEventHandlers(onKeyDown, handleKeyDown),
  };

  return (
    <RadioGroupItemContext.Provider value={itemContextValue}>
      {asChild ? (
        <Slot {...itemProps}>{children}</Slot>
      ) : (
        <button type="button" {...itemProps}>
          {children}
        </button>
      )}
    </RadioGroupItemContext.Provider>
  );
}

RadioGroupItem.displayName = "RadioGroupItem";

function RadioGroupIndicator({
  children,
  forceMount,
  asChild = false,
  ...rest
}: RadioGroupIndicatorProps) {
  const { checked } = useRadioGroupItemContext();
  if (!checked && !forceMount) return null;
  const indicatorProps = {
    ...rest,
    "aria-hidden": "true" as const,
    "data-state": checked ? ("checked" as const) : ("unchecked" as const),
  };
  if (asChild) {
    return <Slot {...indicatorProps}>{children}</Slot>;
  }
  return <span {...indicatorProps}>{children}</span>;
}

RadioGroupIndicator.displayName = "RadioGroupIndicator";

type TRadioGroupCompound = typeof RadioGroupRoot & {
  Root: typeof RadioGroupRoot;
  Item: typeof RadioGroupItem;
  Indicator: typeof RadioGroupIndicator;
};

const RadioGroupCompound: TRadioGroupCompound = Object.assign(RadioGroupRoot, {
  Root: RadioGroupRoot,
  Item: RadioGroupItem,
  Indicator: RadioGroupIndicator,
});

RadioGroupCompound.displayName = "RadioGroup";

export { RadioGroupCompound as RadioGroup };
