import { useEffect, useId, useRef } from "react";

import { useSliderContext } from "../SliderContext";
import { getThumbStyle } from "../utils";

export function useSliderThumb() {
  const {
    values,
    min,
    max,
    orientation,
    dir,
    inverted,
    registerThumb,
    orderedThumbIds,
  } = useSliderContext();
  const id = useId();
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    registerThumb(id, ref.current);
    return () => registerThumb(id, null);
  }, [id, registerThumb]);

  const index = orderedThumbIds.indexOf(id);
  const value = index === -1 ? undefined : values[index];
  const style = getThumbStyle(value, min, max, { orientation, dir, inverted });

  return { ref, value, min, max, orientation, style };
}
