import { useCallback, useState } from "react";

/**
 * Manages the controlled / uncontrolled state pair (`value` +
 * `defaultValue` + `onChange`) that almost every compound component in
 * this library exposes on its Root. Centralises the "is the consumer
 * driving this externally?" branch and the matching `useState`
 * fallback.
 *
 * Behaviour:
 *
 * - When `controlled` is `undefined`, the hook is **uncontrolled**: it
 *   holds an internal `useState` initialised from `defaultValue`.
 *   Calling the returned setter updates that internal state **and**
 *   notifies `onChange`.
 * - When `controlled` is anything other than `undefined`, the hook is
 *   **controlled**: the returned `value` is `controlled` directly,
 *   internal state is ignored, and the setter only notifies
 *   `onChange` (the consumer is expected to flip `controlled` on the
 *   next render).
 *
 * The setter does **not** dedupe — callers that need to skip
 * `onChange` when the value hasn't changed should add that check at
 * the call site (e.g. RadioGroup's `select`, Dropdown's `setOpen`).
 *
 * @example Boolean open/close state
 * ```ts
 * const [open, setOpen, isControlled] = useControllableState(
 *   controlledOpen, defaultOpen ?? false, onOpenChange,
 * );
 * ```
 *
 * @example Optional string value with no default
 * ```ts
 * const [value, setValue] = useControllableState<string>(
 *   controlledValue, undefined, onValueChange,
 * );
 * ```
 *
 * @param controlled - Consumer-supplied value, or `undefined` when the
 *   consumer wants the component to manage its own state.
 * @param defaultValue - Initial value when uncontrolled. Read once on
 *   mount; subsequent changes to this argument are ignored.
 * @param onChange - Optional notification fired whenever the setter is
 *   called, in both controlled and uncontrolled modes.
 *
 * @returns `[value, setValue, isControlled]`. `value` is `T` when a
 *   non-undefined `controlled` or `defaultValue` is supplied,
 *   otherwise `T | undefined`.
 */
export function useControllableState<T>(
  controlled: T | undefined,
  defaultValue: T,
  onChange?: (next: T) => void,
): readonly [T, (next: T) => void, boolean];
export function useControllableState<T>(
  controlled: T | undefined,
  defaultValue: T | undefined,
  onChange?: (next: T) => void,
): readonly [T | undefined, (next: T) => void, boolean];
export function useControllableState<T>(
  controlled: T | undefined,
  defaultValue: T | undefined,
  onChange?: (next: T) => void,
): readonly [T | undefined, (next: T) => void, boolean] {
  const isControlled = controlled !== undefined;
  const [uncontrolled, setUncontrolled] = useState<T | undefined>(defaultValue);
  const value = isControlled ? controlled : uncontrolled;

  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) {
        setUncontrolled(next);
      }
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  return [value, setValue, isControlled] as const;
}
