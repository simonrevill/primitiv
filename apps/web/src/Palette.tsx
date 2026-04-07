import { type Palette } from "primitiv-wasm";
import { Swatch } from "./Swatch";

export type PaletteProps = {
  palette?: Palette[];
};

export function Palette({ palette }: PaletteProps) {
  return (
    <div className="palette">
      {palette?.map((step, index) => (
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
