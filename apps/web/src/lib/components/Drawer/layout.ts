/**
 * layout.ts — WHERE THE DESK ENDS AND THE PHONE BEGINS.
 *
 * N.108 increment 1a, ruled by Dann 2026-09-02 on his walk of `2c1cecf`:
 * "Desk, at every width where the 520 px drawer and the paper both fit: no
 * pull, no chevron, no collapsed state; the drawer is always present. Below
 * that width the layout is the phone's."
 *
 * SO THE BREAKPOINT IS NOT A ROUND NUMBER ANY MORE, IT IS AN ARITHMETIC. It
 * was 768, a number with no relation to anything this app draws; it is now
 * the sum of the three widths the desk has to hold side by side, and it moves
 * on its own if any of the three ever moves. Dann estimated "about 1340 px"
 * and asked for the measured figure. It is 1400.
 *
 * WHY EACH TERM IS WHAT IT IS:
 *
 * - `DRAWER_WIDTH` 520 is the drawer's ruled width (`+page.svelte`'s
 *   `drawerWidth`, which widens only for the Inspector and falls back here).
 * - `SHEET_WIDTH` 816 is `PAGE_SIZES.letter.width` in `$lib/page-config.ts`,
 *   which `TitlePage` sets as an inline pixel width. THE SHEET DOES NOT
 *   SHRINK ON THE DESK: `PageFit` scales only when `fit` is true, and `fit`
 *   is this very test, so above the breakpoint the page is 816 px or it is
 *   clipped. That is what "stop fitting" means and it is why the sum is
 *   exact rather than approximate.
 * - `DESK_PADDING` 32 is `.main-content`'s `padding: 2rem`, spent on both
 *   sides of the sheet.
 *
 * THE THREE NUMBERS ARE COPIED, NOT IMPORTED, and that is a real cost: this
 * file is plain TypeScript so vitest can reach it in the `node` environment,
 * and the two it would import from are a Svelte component's inline style and
 * a stylesheet's `2rem`. Neither can be read from here. The test beside this
 * file pins the sum, so a change to any of the three that forgets this file
 * fails a gate rather than a walk.
 *
 * THE CSS CANNOT IMPORT IT EITHER. Every `@media` that switches layout carries
 * `1399px` as a literal and names this file. There is no custom-media syntax
 * in the browsers this ships to.
 */

/** The drawer's ruled width on the desk. */
export const DRAWER_WIDTH = 520;

/** `PAGE_SIZES.letter.width`, which `TitlePage` sets in pixels. */
export const SHEET_WIDTH = 816;

/** `.main-content`'s `padding: 2rem`, one side. */
export const DESK_PADDING = 32;

/**
 * The narrowest viewport that holds the drawer and a whole sheet side by side.
 * At exactly this width both fit; one pixel less and the sheet is clipped.
 */
export const DESK_LAYOUT_MIN_WIDTH = DRAWER_WIDTH + SHEET_WIDTH + DESK_PADDING * 2;

/**
 * Whether this viewport gets the desk's layout.
 *
 * The one owner of the question. `+page.svelte`'s `checkMobile` calls it and
 * publishes the answer as `isMobile`, which every component that has to know
 * already reads; nothing else measures a width.
 */
export function isDeskLayout(viewportWidth: number): boolean {
	return viewportWidth >= DESK_LAYOUT_MIN_WIDTH;
}
