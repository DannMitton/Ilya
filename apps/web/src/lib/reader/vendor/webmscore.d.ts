/**
 * Types for the vendored webmscore browser build (./webmscore.js).
 *
 * The vendored file's default export is webmscore's WebMscoreW class, which
 * implements the same API as the package's own WebMscore class (upstream
 * declares this with an `@implements` contract in worker-helper.js), so the
 * installed package's type declarations are reused verbatim rather than
 * redeclared and left to drift.
 */
export { default } from 'webmscore';

/**
 * The three runtime assets (lib.wasm, lib.data, lib.mem.wasm) as
 * Vite-resolved URLs, exported so the facade can warm the HTTP cache.
 */
export declare const WEBMSCORE_ASSET_URLS: readonly [string, string, string];
