// Augment the 'react' module to export permissive aliases used by
// Next's generated validator types (e.g. import("react").ReactNode).
// This avoids build-time type errors caused by mismatches between
// generated types and the installed @types/react shape.

declare module 'react' {
    // Keep these permissive to avoid causing downstream type errors
    // in generated files. They can be tightened if you standardize
    // the project's React types later.
    export type ReactNode = any;
    export type ReactElement = any;
    export type JSXElementConstructor<P = any> = any;
}

export {};
