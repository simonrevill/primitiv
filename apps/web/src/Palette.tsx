import { type Palette } from "harmoni-wasm";
import { Swatch } from "./Swatch";

export type PaletteProps = {
  palette?: Palette;
};

export function Palette({ palette }: PaletteProps) {
  return (
    <div className="palette__steps">
      {palette?.swatches?.map((step, index) => (
        <Swatch
          key={
            ("Number" in step.label
              ? `number-${step.label.Number}`
              : `name-${step.label.Name}`) + `-${index}`
          }
          step={step}
          index={index}
        />
      ))}
    </div>
  );
}
