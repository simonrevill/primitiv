import { createContext, useContext, type Context } from "react";

/**
 * Creates a React context paired with a strict consumer hook that throws
 * a clear error if a sub-component is rendered outside the matching
 * Provider. Centralises the boilerplate every compound component in this
 * library would otherwise duplicate.
 *
 * @param errorMessage - Error thrown by the hook when no Provider is
 *   above it in the tree. Make this consumer-actionable, e.g.
 *   `"Tabs.Trigger must be rendered as a child of Tabs.Root"`.
 * @param displayName - Optional. Sets `Context.displayName` for nicer
 *   React DevTools output.
 *
 * @returns A tuple `[Context, useStrictContext]`. `Context` is the
 *   regular React context (use `Context.Provider` to provide a value).
 *   `useStrictContext` returns the value, narrowed to non-null.
 *
 * @example
 * ```ts
 * type FooContextValue = { count: number };
 *
 * export const [FooContext, useFooContext] =
 *   createStrictContext<FooContextValue>(
 *     "Foo sub-components must be rendered inside <Foo.Root>.",
 *     "FooContext",
 *   );
 * ```
 */
export function createStrictContext<T>(
  errorMessage: string,
  displayName?: string,
): readonly [Context<T | null>, () => T] {
  const Ctx = createContext<T | null>(null);

  if (displayName !== undefined) {
    Ctx.displayName = displayName;
  }

  function useStrictContext(): T {
    const value = useContext(Ctx);
    if (value === null) {
      throw new Error(errorMessage);
    }
    return value;
  }

  return [Ctx, useStrictContext] as const;
}
