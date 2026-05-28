import { Slot } from "../Slot";
import {
  InputGroupAdornmentProps,
  InputGroupRootProps,
} from "./types";

function InputGroupRoot({
  asChild = false,
  children,
  ref,
  ...rest
}: InputGroupRootProps) {
  const rootProps = {
    ...rest,
    ref,
    "data-input-group": "",
  };

  if (asChild) {
    return <Slot {...rootProps}>{children}</Slot>;
  }

  return <div {...rootProps}>{children}</div>;
}

InputGroupRoot.displayName = "InputGroupRoot";

function InputGroupLeadingAdornment({
  asChild = false,
  children,
  ref,
  ...rest
}: InputGroupAdornmentProps) {
  const adornmentProps = {
    ...rest,
    ref,
    "data-input-group-adornment": "leading" as const,
  };

  if (asChild) {
    return <Slot {...adornmentProps}>{children}</Slot>;
  }

  return <span {...adornmentProps}>{children}</span>;
}

InputGroupLeadingAdornment.displayName = "InputGroupLeadingAdornment";

function InputGroupTrailingAdornment({
  asChild = false,
  children,
  ref,
  ...rest
}: InputGroupAdornmentProps) {
  const adornmentProps = {
    ...rest,
    ref,
    "data-input-group-adornment": "trailing" as const,
  };

  if (asChild) {
    return <Slot {...adornmentProps}>{children}</Slot>;
  }

  return <span {...adornmentProps}>{children}</span>;
}

InputGroupTrailingAdornment.displayName = "InputGroupTrailingAdornment";

type TInputGroupCompound = typeof InputGroupRoot & {
  Root: typeof InputGroupRoot;
  LeadingAdornment: typeof InputGroupLeadingAdornment;
  TrailingAdornment: typeof InputGroupTrailingAdornment;
};

const InputGroupCompound: TInputGroupCompound = Object.assign(InputGroupRoot, {
  Root: InputGroupRoot,
  LeadingAdornment: InputGroupLeadingAdornment,
  TrailingAdornment: InputGroupTrailingAdornment,
});

InputGroupCompound.displayName = "InputGroup";

export { InputGroupCompound as InputGroup };
