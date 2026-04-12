import { type Swatch as SwatchData } from "harmoni-wasm";

export type SwatchProps = {
  step: SwatchData;
  index: number;
};

export function Swatch({ step, index }: SwatchProps) {
  return (
    <div className="swatch">
      <div
        key={
          ("Number" in step.label
            ? `number-${step.label.Number}`
            : `name-${step.label.Name}`) + `-${index}`
        }
        className="swatch-inner"
        style={{
          background: `oklch(${step.l} ${step.c} ${step.h})`,
          color: `oklch(${step.best_foreground.l} ${step.best_foreground.c} ${step.best_foreground.h})`,
        }}
      >
        <p className="swatch__step">
          {"Number" in step.best_foreground.label
            ? step.best_foreground.label.Number
            : step.best_foreground.label.Name}
        </p>
        <p>{step.contrast_result.display_ratio}</p>
        <p className="swatch__rating">{step.contrast_result.rating}</p>
      </div>
      <p className="swatch__step">{index === 0 ? 50 : index * 100}</p>
    </div>
  );
}
