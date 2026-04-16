import { Ref } from "react";

// ---------------------------------------------------------------------------
// General types
// ---------------------------------------------------------------------------

export type PossibleRef<T> = Ref<T> | undefined;

export type AnyProps = Record<string, unknown>;
