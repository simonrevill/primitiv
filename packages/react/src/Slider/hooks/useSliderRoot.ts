import { useMemo } from "react";

import { useCollection, useControllableState } from "../../hooks";
import type { SliderContextValue } from "../SliderContext";
import type { SliderDirection, SliderOrientation } from "../types";
import { sortThumbsByDomOrder } from "../utils";

type UseSliderRootArgs = {
  min: number;
  max: number;
  orientation: SliderOrientation;
  dir: SliderDirection;
  inverted: boolean;
  defaultValue?: number[];
  value?: number[];
  onValueChange?: (value: number[]) => void;
};

export function useSliderRoot({
  min,
  max,
  orientation,
  dir,
  inverted,
  defaultValue,
  value,
  onValueChange,
}: UseSliderRootArgs) {
  const [values] = useControllableState<number[]>(
    value,
    defaultValue ?? [min],
    onValueChange,
  );
  const {
    register: registerThumb,
    itemsRef,
    keys,
  } = useCollection<string, HTMLSpanElement>();

  const orderedThumbIds = useMemo(
    () => sortThumbsByDomOrder(itemsRef.current),
    [keys, itemsRef],
  );

  const contextValue = useMemo<SliderContextValue>(
    () => ({
      values,
      min,
      max,
      orientation,
      dir,
      inverted,
      registerThumb,
      orderedThumbIds,
    }),
    [values, min, max, orientation, dir, inverted, registerThumb, orderedThumbIds],
  );

  return { contextValue };
}
