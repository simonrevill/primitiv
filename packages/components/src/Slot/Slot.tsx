/**
 * Slot — a React composition utility following the Radix UI asChild pattern.
 *
 * When a component renders `<Slot {...ownProps}>{child}</Slot>`, the child
 * element is cloned with ownProps merged in:
 * - Event handlers are **composed** (child's handler runs first, then Slot's).
 * - `style` objects are shallow-merged (child wins on collisions).
 * - `className` strings are concatenated.
 * - All other props default to the child's value, with Slot providing the
 *   fallback when the child doesn't specify one.
 * - Refs from both sides are composed via `composeRefs`.
 *
 * This file is intentionally self-contained — no external dependencies
 * beyond React itself.
 */

import {
  forwardRef,
  isValidElement,
  cloneElement,
  Children,
  Ref,
  HTMLAttributes,
  ReactNode,
  MutableRefObject,
} from "react";

// ---------------------------------------------------------------------------
// composeRefs
// ---------------------------------------------------------------------------

type PossibleRef<T> = Ref<T> | undefined;

function setRef<T>(ref: PossibleRef<T>, value: T) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref !== null && ref !== undefined) {
    (ref as MutableRefObject<T>).current = value;
  }
}

export function composeRefs<T>(...refs: PossibleRef<T>[]) {
  return (node: T) => refs.forEach((ref) => setRef(ref, node));
}

// ---------------------------------------------------------------------------
// mergeProps — follows Radix's composition rules exactly
// ---------------------------------------------------------------------------

type AnyProps = Record<string, unknown>;

function getRef(element: React.ReactElement): PossibleRef<unknown> {
  // React 19 exposes ref via props; React ≤18 via element.ref
  const { props, ref } = element as React.ReactElement & {
    ref?: PossibleRef<unknown>;
  };
  return (props as AnyProps).ref !== undefined
    ? (props as AnyProps).ref as PossibleRef<unknown>
    : ref;
}

function mergeProps(slotProps: AnyProps, childProps: AnyProps): AnyProps {
  // Child props override by default; event handlers and style/className are
  // special-cased.
  const merged = { ...childProps };

  for (const key in childProps) {
    const slotVal = slotProps[key];
    const childVal = childProps[key];
    const isEventHandler = /^on[A-Z]/.test(key);

    if (isEventHandler) {
      if (slotVal && childVal) {
        // Both sides provide a handler — compose: child first, then slot.
        merged[key] = (...args: unknown[]) => {
          (childVal as (...a: unknown[]) => unknown)(...args);
          (slotVal as (...a: unknown[]) => unknown)(...args);
        };
      } else if (slotVal) {
        merged[key] = slotVal;
      }
    } else if (key === "style") {
      merged[key] = { ...(slotVal as object), ...(childVal as object) };
    } else if (key === "className") {
      merged[key] = [slotVal, childVal].filter(Boolean).join(" ");
    }
  }

  return { ...slotProps, ...merged };
}

// ---------------------------------------------------------------------------
// Slot component
// ---------------------------------------------------------------------------

interface SlotProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

export const Slot = forwardRef<HTMLElement, SlotProps>(
  ({ children, ...slotProps }, forwardedRef) => {
    if (Children.count(children) !== 1 || !isValidElement(children)) {
      throw new Error("Slot requires exactly one React element child.");
    }

    const childRef = getRef(children);
    const composedRef = forwardedRef
      ? composeRefs(forwardedRef, childRef)
      : childRef;

    return cloneElement(children, {
      ...mergeProps(slotProps as AnyProps, children.props as AnyProps),
      ref: composedRef,
    } as AnyProps);
  },
);

Slot.displayName = "Slot";
