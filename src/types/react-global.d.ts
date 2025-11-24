// Provide a permissive global `React` binding so generated Next.js types
// referencing `React.ReactNode` resolve during build.
// This is intentionally permissive to avoid mismatches between module
// and global React type shapes in generated files.

declare const React: any;
declare namespace React {
    // Provide minimal aliases used by Next's generated types
    type ReactNode = any;
    type ReactElement = any;
}

export {};
