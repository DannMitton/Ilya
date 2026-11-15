/**
 * reveal-scroll.ts: WHERE THE DRAWER SCROLLS WHEN A WORD TAP OPENS ANALYSIS.
 *
 * N.201 step 2 and amendment A9, in plain TypeScript so vitest can reach the
 * decision. `Drawer.svelte` measures the two rectangles and writes the
 * answer; nothing else here touches the DOM.
 *
 * THE ONE EXCEPTION TO "THE DRAWER NEVER SCROLLS ITSELF". The rule (N.108 §2)
 * stood against movement the singer did not ask for. A word tap is the
 * singer's own request to see that word's analysis, so the tap may bring
 * ANALYSIS into view and nothing else may.
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
 * PHONE: always the top. The tap closed the other bands, so ANALYSIS is the
 * first thing open, and the top is where its head is; run on every tap, so a
 * second tap that finds the singer scrolled down brings them back.
 *
 * DESKTOP: nothing closed, so ANALYSIS may sit under an open INPUT, past the
 * window's foot. Only when its head is outside the window, align the head to
 * the window's top.
 */
export function revealScrollTop(input: {
	phone: boolean;
	scrollTop: number;
	window: Span;
	head: Span | null;
}): number | null {
	if (input.phone) return 0;
	const { head, window: win } = input;
	if (!head) return null;
	if (head.top >= win.top && head.bottom <= win.bottom) return null;
	return Math.max(0, input.scrollTop + (head.top - win.top));
}
