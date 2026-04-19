import { RadioGroupItemProps, RadioGroupRootProps } from "./types";

function RadioGroupRoot({ children, ...rest }: RadioGroupRootProps) {
  return (
    <div role="radiogroup" {...rest}>
      {children}
    </div>
  );
}

RadioGroupRoot.displayName = "RadioGroupRoot";

function RadioGroupItem({ value, children, ...rest }: RadioGroupItemProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={false}
      data-state="unchecked"
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
