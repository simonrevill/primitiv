import { ComponentProps, ReactNode, Ref } from "react";

type MillerColumnsRootBaseProps = Omit<ComponentProps<"div">, "ref"> & {
  children: ReactNode;
};

type MillerColumnsRootUncontrolledProps = MillerColumnsRootBaseProps & {
  defaultValue?: string[];
  value?: never;
  onValueChange?: never;
};

type MillerColumnsRootControlledProps = MillerColumnsRootBaseProps & {
  defaultValue?: never;
  value: string[];
  onValueChange: (path: string[]) => void;
};

export type MillerColumnsRootProps =
  | MillerColumnsRootUncontrolledProps
  | MillerColumnsRootControlledProps;

export type MillerColumnsColumnProps = ComponentProps<"div"> & {
  children: ReactNode;
};

export type MillerColumnsItemProps<
  T extends HTMLElement = HTMLDivElement,
> = Omit<ComponentProps<"div">, "ref"> & {
  value: string;
  disabled?: boolean;
  asChild?: boolean;
  children: ReactNode;
  /** Ref to the rendered element. Defaults to `HTMLDivElement`; when using
   * `asChild`, specify the child's element type. */
  ref?: Ref<T>;
};

export type MillerColumnsItemIndicatorProps = ComponentProps<"span"> & {
  children?: ReactNode;
};

export type MillerColumnsItemMeta = {
  value: string;
  disabled: boolean;
};

export type MillerColumnsItemAddress = {
  depth: number;
  value: string;
};

export type MillerColumnsContextValue = {
  strip: HTMLElement | null;
  setStrip: (element: HTMLDivElement | null) => void;
  activePath: string[];
  select: (depth: number, value: string) => void;
  registerItem: (
    depth: number,
    value: string,
    element: HTMLElement | null,
    disabled: boolean,
  ) => void;
  getColumnItems: (depth: number) => MillerColumnsItemMeta[];
  focusItem: (depth: number, value: string) => void;
  focusFirstInColumn: (depth: number) => boolean;
  requestColumnFocus: (depth: number) => void;
  activeItem: MillerColumnsItemAddress | null;
  setActiveItem: (item: MillerColumnsItemAddress) => void;
};

export type MillerColumnsColumnContextValue = {
  depth: number;
};

export type MillerColumnsItemContextValue = {
  selected: boolean;
  hasChildren: boolean;
};
