import { ComponentProps, ReactNode } from "react";

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

export type MillerColumnsItemProps = ComponentProps<"div"> & {
  value: string;
  children: ReactNode;
};

export type MillerColumnsContextValue = {
  strip: HTMLElement | null;
  setStrip: (element: HTMLDivElement | null) => void;
};

export type MillerColumnsColumnContextValue = {
  depth: number;
};
