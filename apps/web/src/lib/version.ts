/**
 * The one home of Ilya's version (N.202; `docs/memory/PRODUCT.md`, "ILYA'S NAME AND ITS VERSION").
 *
 * The version is a year and a letter. The letter advances each time `main` moves, and at no other time. At a
 * release the desk changes the one line below. Import from components, `+page.svelte`, and tests only:
 * `library/binder.ts` and `library/exchange.ts` take their values as parameters.
 */

/** The version a singer reads: the footer of every page, a binder's manifest, and the citation. */
export const ILYA_VERSION = '2026b';

/**
 * The commit the bundle was built from (`vite.config.ts`). A bare read of `__ILYA_BUILD__` throws at import
 * wherever the constant is not defined (the root and package vitest configs, Playwright's own process), so it
 * is read through `typeof`.
 */
export const ILYA_BUILD: string = typeof __ILYA_BUILD__ === 'string' ? __ILYA_BUILD__ : 'unknown';

/** The version's year, its first four characters as a number. */
export const ILYA_VERSION_YEAR: number = Number(ILYA_VERSION.slice(0, 4));
