import { createStrictContext } from "../utils";

import type {
  MillerColumnsContextValue,
  MillerColumnsColumnContextValue,
} from "./types";

export const [MillerColumnsContext, useMillerColumnsContext] =
  createStrictContext<MillerColumnsContextValue>(
    "MillerColumns sub-components must be rendered inside <MillerColumns.Root>.",
    "MillerColumnsContext",
  );

export const [MillerColumnsColumnContext, useMillerColumnsColumnContext] =
  createStrictContext<MillerColumnsColumnContextValue>(
    "MillerColumns.Item must be rendered inside <MillerColumns.Column>.",
    "MillerColumnsColumnContext",
  );
