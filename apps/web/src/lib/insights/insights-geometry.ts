/**
 * WHERE A CLOSED DISCLOSURE LANDS, AND WHAT IT COSTS THE PAGE IT LANDS ON (lane 80, QUEUE row 202; Dann 2026-11-21: one frame for the content of TEXT, MELODY,
 * and INSIGHTS, so the clear space above the footer is the frame's `HEADER_GAP` and no longer INSIGHTS' own 40).
 *
 * "N more observations" and "Show keys that reach higher" are SCREEN-ONLY and closed by default. A closed one is never a block of its own to the paginator
 * (`printed` leaves it out); it rides on the page with the part of the block before it that ends that block. Until this lane that cost was paid out of a 40 px
 * clear space. With the clear space at 16 a closed summary line landed on or past the footer's hairline, so the page it lands on is charged for it.
 *
 * Print hides the disclosures and keeps the screen's pages (QUEUE row 96), so the charge is made on screen and in print alike. Pure.
 */
import type { Segment } from './paginate';

/** A closed screen-only block, and what it costs the page it rides on: its closed height and the gap before it. */
export interface Rider {
	block: number;
	charge: number;
}

/** The page and segment a closed screen-only block rides in: with the part of the block before it that ends that block. */
export function ridingSegment(pages: readonly (readonly Segment[])[], block: number, heights: readonly number[]): { page: number; segment: Segment } | null {
	for (let n = 0; n < pages.length; n++)
		for (const segment of pages[n]) if (segment.blocks.includes(block - 1) && !(segment.cuts?.[block - 1] && segment.cuts[block - 1][1] < (heights[block - 1] ?? 0))) return { page: n, segment };
	return null;
}

/**
 * Pages in which each rider's charge is taken from the room of the page it lands on. A rider's page is known only once the pages are cut, and cutting depends
 * on the room, so the cut is repeated with the reserve each pass found; the reserve of a page only grows, so it settles (at most `PASSES`, then the last cut stands).
 */
export function chargeRiders(run: (reserve: (page: number) => number) => Segment[][], riders: readonly Rider[], heights: readonly number[]): Segment[][] {
	const PASSES = 6;
	let reserve: number[] = [];
	let pages = run((n) => reserve[n] ?? 0);
	for (let pass = 0; pass < PASSES && riders.length > 0; pass++) {
		const want: number[] = [];
		for (const r of riders) {
			const at = ridingSegment(pages, r.block, heights);
			if (at) want[at.page] = (want[at.page] ?? 0) + r.charge;
		}
		const next = Array.from({ length: Math.max(reserve.length, want.length) }, (_, n) => Math.max(reserve[n] ?? 0, want[n] ?? 0));
		if (next.every((v, n) => v === (reserve[n] ?? 0))) break;
		reserve = next;
		pages = run((n) => reserve[n] ?? 0);
	}
	return pages;
}
