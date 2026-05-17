import { composeEventHandlers, composeRefs } from "../Slot";

import { SliderContext } from "./SliderContext";
import { useSliderContext, useSliderRoot, useSliderThumb } from "./hooks";
import type {
  SliderRangeProps,
  SliderRootProps,
  SliderThumbProps,
  SliderTrackProps,
} from "./types";
import { getRangeStyle } from "./utils";

function SliderRoot({
  min = 0,
  max = 100,
  step = 1,
  minStepsBetweenThumbs = 0,
  orientation = "horizontal",
  dir = "ltr",
  inverted = false,
  disabled = false,
  defaultValue,
  value,
  onValueChange,
  onValueCommit,
  name,
  onPointerDown,
  ref,
  children,
  ...rest
}: SliderRootProps) {
  const {
    contextValue,
    rootRef,
    onPointerDown: handlePointerDown,
  } = useSliderRoot({
    min,
    max,
    step,
    minStepsBetweenThumbs,
    orientation,
    dir,
    inverted,
    disabled,
    defaultValue,
    value,
    onValueChange,
    onValueCommit,
  });
  return (
    <SliderContext.Provider value={contextValue}>
      <span
        {...rest}
        ref={composeRefs(rootRef, ref)}
        dir={dir}
        data-orientation={orientation}
        data-disabled={disabled ? "" : undefined}
        onPointerDown={composeEventHandlers(onPointerDown, handlePointerDown)}
      >
        {children}
        {name !== undefined &&
          contextValue.values.map((thumbValue, index) => (
            <input
              key={index}
              type="hidden"
              name={
                contextValue.values.length > 1 ? `${name}[]` : name
              }
              value={thumbValue}
              readOnly
            />
          ))}
      </span>
    </SliderContext.Provider>
  );
}

SliderRoot.displayName = "SliderRoot";

function SliderTrack({ children, ...rest }: SliderTrackProps) {
  const { orientation, disabled } = useSliderContext();
  return (
    <span
      {...rest}
      data-orientation={orientation}
      data-disabled={disabled ? "" : undefined}
    >
      {children}
    </span>
  );
}

SliderTrack.displayName = "SliderTrack";

function SliderRange({ style, ...rest }: SliderRangeProps) {
  const { values, min, max, orientation, dir, inverted, disabled } =
    useSliderContext();
  return (
    <span
      {...rest}
      data-orientation={orientation}
      data-disabled={disabled ? "" : undefined}
      style={{
        ...getRangeStyle(values, min, max, { orientation, dir, inverted }),
        ...style,
      }}
    />
  );
}

SliderRange.displayName = "SliderRange";

function SliderThumb({
  style,
  ref: forwardedRef,
  onKeyDown,
  ...rest
}: SliderThumbProps) {
  const {
    ref,
    value,
    min,
    max,
    orientation,
    disabled,
    style: positionStyle,
    onKeyDown: handleKeyDown,
  } = useSliderThumb();
  return (
    <span
      {...rest}
      ref={composeRefs(ref, forwardedRef)}
      role="slider"
      tabIndex={disabled ? undefined : 0}
      aria-orientation={orientation}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-disabled={disabled || undefined}
      data-orientation={orientation}
      data-disabled={disabled ? "" : undefined}
      onKeyDown={composeEventHandlers(onKeyDown, handleKeyDown)}
      style={{ ...positionStyle, ...style }}
    />
  );
}

SliderThumb.displayName = "SliderThumb";

type TSliderCompound = typeof SliderRoot & {
  Root: typeof SliderRoot;
  Track: typeof SliderTrack;
  Range: typeof SliderRange;
  Thumb: typeof SliderThumb;
};

const SliderCompound: TSliderCompound = Object.assign(SliderRoot, {
  Root: SliderRoot,
  Track: SliderTrack,
  Range: SliderRange,
  Thumb: SliderThumb,
});

SliderCompound.displayName = "Slider";

export { SliderCompound as Slider };
