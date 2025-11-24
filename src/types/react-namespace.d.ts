// Provide a small global namespace mapping so generated Next types
// that reference `React.ReactNode` resolve correctly in module files.
// This avoids the "'React' refers to a UMD global" build error.

declare global {
    // Re-export commonly used React types under the global `React` namespace
    // so generated type files that reference `React.ReactNode` compile.
    namespace React {
        type ReactNode = import('react').ReactNode;
        type ReactElement<
            P = any,
            T extends string | import('react').JSXElementConstructor<any> = any
        > = import('react').ReactElement<P, T>;
        type JSXElementConstructor<P = any> =
            import('react').JSXElementConstructor<P>;
        type PropsWithChildren<P> = import('react').PropsWithChildren<P>;
    }
}

export {};
