import { useCallback, useRef, useState, type RefObject } from "react";

type UseCollectionOptions = {
  /**
   * Whether to update the `keys` state when a registered item is
   * unregistered (the registrar is called with a `null` value). Defaults to
   * `true`.
   *
   * Set to `false` for collections that may unmount after a render-time
   * throw (such as Accordion's trigger validation): in that flow, an effect
   * cleanup running outside React's `act()` and updating state would surface
   * as a "setState outside act" warning and mask the original error. With
   * `false`, the ref is still updated — the validation effect that reads
   * the ref still works — but the keys array stays stable until the next
   * mount.
   */
  updateKeysOnCleanup?: boolean;
};

/**
 * Manages a registry of mounted child elements (or any per-key value)
 * inside a compound component. Used by Roots that need to know which
 * Triggers / Items currently exist — for roving tabindex, for keyboard
 * navigation, and for validating consumer-supplied `value` against
 * registered keys.
 *
 * Returns a stable `register(key, value | null)` callback (call with
 * `null` to unregister), a `RefObject` exposing the live `Map` (for
 * imperative reads inside event handlers, where you want the latest
 * value without rendering), and a `keys` array tracked as React state
 * (so consumers re-render whenever items mount or unmount).
 *
 * @example Inside a Root hook
 * ```ts
 * const { register, itemsRef, keys } = useCollection<string, HTMLButtonElement>();
 *
 * // Inside a Trigger's effect:
 * useEffect(() => {
 *   register(value, ref.current);
 *   return () => register(value, null);
 * }, [value, register]);
 *
 * // Imperatively focus the first registered trigger:
 * keys[0] && itemsRef.current.get(keys[0])?.focus();
 * ```
 */
export function useCollection<K, V>(
  options: UseCollectionOptions = {},
): {
  register: (key: K, value: V | null) => void;
  itemsRef: RefObject<Map<K, V>>;
  keys: K[];
} {
  const { updateKeysOnCleanup = true } = options;
  const itemsRef = useRef<Map<K, V>>(new Map());
  const [keys, setKeys] = useState<K[]>([]);

  const register = useCallback(
    (key: K, value: V | null) => {
      if (value !== null) {
        itemsRef.current.set(key, value);
        setKeys(Array.from(itemsRef.current.keys()));
      } else {
        itemsRef.current.delete(key);
        if (updateKeysOnCleanup) {
          setKeys(Array.from(itemsRef.current.keys()));
        }
      }
    },
    [updateKeysOnCleanup],
  );

  return { register, itemsRef, keys };
}
