import { Ref } from "react";

// ---------------------------------------------------------------------------
// General types
// ---------------------------------------------------------------------------

export type PossibleRef<T> = Ref<T> | undefined;

export type AnyProps = Record<string, unknown>;

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
