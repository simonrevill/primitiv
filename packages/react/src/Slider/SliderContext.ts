import { createStrictContext } from "../utils";

import type { SliderDirection, SliderOrientation } from "./types";

export type SliderContextValue = {
  values: number[];
  min: number;
  max: number;
  orientation: SliderOrientation;
  dir: SliderDirection;
  inverted: boolean;
  registerThumb: (id: string, element: HTMLSpanElement | null) => void;
  orderedThumbIds: string[];
};

export const [SliderContext, useSliderContext] =
  createStrictContext<SliderContextValue>(
    "Slider sub-components must be rendered inside a <Slider.Root>.",
    "SliderContext",
  );
