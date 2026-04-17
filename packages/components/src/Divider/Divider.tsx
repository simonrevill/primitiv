import { DividerProps } from "./types";
export function Divider({
  orientation = "horizontal",
  className = "",
  ...rest
}: DividerProps) {
  return (
    <span
      role="separator"
      aria-orientation={orientation}
      className={className}
      {...rest}
    />
  );
}
