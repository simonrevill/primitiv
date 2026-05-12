import { createStrictContext } from "../utils";

import { ToggleGroupContextValue } from "./types";

export const [ToggleGroupContext, useToggleGroupContext] =
  createStrictContext<ToggleGroupContextValue>(
    "ToggleGroup.Item must be rendered inside a ToggleGroup.Root",
    "ToggleGroupContext",
  );
