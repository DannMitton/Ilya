/**
 * reveal-scroll.ts: WHERE THE DRAWER SCROLLS WHEN THE SINGER ASKS FOR SOMETHING IT HOLDS.
 *
 * N.201 step 2 and amendment A9, in plain TypeScript so vitest can reach the
 * decision. `Drawer.svelte` measures the two rectangles and writes the
 * answer; nothing else here touches the DOM.
 *
 * THE DRAWER MOVES ONLY WHEN THE SINGER ASKS FOR SOMETHING IT HOLDS. N.108 §2
 * wrote "the drawer never scrolls itself" against movement the singer did not
 * ask for, and N.201 named the word tap as an ask. Dann 2026-11-16 20:13 ruled
 * the same for a link that opens a pane or a station ("yes": it brings what it
 * opens into view, so the singer does not hunt). The asks are: entering the
 * calibration takeover, a word tap, and such a link. Opening a station, a band,
 * or a pick still opens in place and never scrolls.
 */

/** The top and bottom of a box, in the same coordinate space (client). */
export interface Span {
	top: number;
	bottom: number;
}

/**
 * The scrollTop the Drawer's scroller should take after a word tap, or null
 * to leave it where it is.
 *
 * WORD TAP, PHONE: always the top. The tap closed the other bands, so ANALYSIS
 * is the first thing open, and the top is where its head is; run on every tap,
 * so a second tap that finds the singer scrolled down brings them back.
 *
 * DESKTOP, AND A LINK ON ANY SCREEN: nothing above the target closed, so it
 * may sit past the window's foot (a station under the VOICE pane's doors). Only
 * when the target is outside the window, align its top to the window's top
 * (`link` true: the desk rule on a phone too, DESK DEFAULT of brief r3).
 */
export function revealScrollTop(input: {
	phone: boolean;
	scrollTop: number;
	window: Span;
	head: Span | null;
	/** True for a link's target: the "only when outside the window" rule even on a phone. */
	link?: boolean;
}): number | null {
	if (input.phone && !input.link) return 0;
	const { head, window: win } = input;
	if (!head) return null;
	if (head.top >= win.top && head.bottom <= win.bottom) return null;
	return Math.max(0, input.scrollTop + (head.top - win.top));
}

/**
 * Whether a reveal cancels the takeover's queued scroll restore: only when a
 * restore is queued AND the reveal's target was found. A link whose target is
 * missing moves nothing, so it must not cancel the restore. (Lane 63, Step 2;
 * no path reaches a missing target today.)
 */
export function revealYieldsRestore(restoreQueued: boolean, targetFound: boolean): boolean {
	return restoreQueued && targetFound;
}
