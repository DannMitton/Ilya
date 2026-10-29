/**
 * The piano's upper staff, found inside homr's own box (N.135 stage 2b, brief r5
 * step 3; Dann 2026-10-28 15:57 and 16:00, `docs/memory/INBOX.md:467-468`).
 *
 * homr gives the piano's grand staff as ONE box, about fifteen staff spaces
 * tall (B01 page 1: box 3 runs 2585 to 3063 against 139 px for the voice
 * staff's box), and `staffIn` (`metre-windows.ts`) keeps the staff most of its
 * candidates fall on, which is often the lower. B is "the next staff below A in
 * the page's order" (`underlay-band.ts`), so B's top line was often the lower
 * piano staff's and the band ran over the upper one.
 *
 * B's top line is found in the ink instead, with the line finder `staffIn`
 * uses (`lineRows` and `fives`):
 *
 * 1. Search from A's bottom line plus `MARGIN` spaces down to the BOTTOM of the
 *    next box homr gave below A, or to the page's end where there is none,
 *    across the middle half of A's span, in strips two spaces wide.
 * 2. A group of five lines counts only where its lines are evenly spaced at a
 *    space within 0.8 to 1.25 of A's. Each strip gives its topmost such group.
 * 3. Across the strips that find a group, take the topmost top line that at
 *    least two strips share (within a tenth of a space), then the median of the
 *    top lines from it down to two spaces below it. Never the minimum, and
 *    never the median of every strip: the minimum follows a ledger line one
 *    space above the staff, and the median of all falls between the two piano
 *    staves where half the strips find the lower.
 * 4. Where no group is found, the top of homr's next box below A; where there
 *    is none, null, and the band runs `BELOW` spaces under A.
 *
 * Reads pixels; the arithmetic is `topFromColumns`, pure.
 */
import { fives, lineRows, type Grey } from './metre-windows';
import { MARGIN, type PlacedStaff } from './underlay-band';

/** A group counts at a space within these shares of A's. */
export const SPACE_MIN = 0.8;
export const SPACE_MAX = 1.25;
/** Two strips share a top line within this many spaces. */
export const SHARE = 0.1;
/** The median is taken over the top lines from the shared one down this many spaces. */
export const WITHIN = 2;

const median = (v: number[]): number => {
	const s = [...v].sort((a, b) => a - b);
	const m = s.length >> 1;
	return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

/** B's top line from the top line each strip found, in page pixels; null where none found. */
export function topFromColumns(tops: readonly number[], space: number): number | null {
	if (tops.length === 0) return null;
	const sorted = [...tops].sort((a, b) => a - b);
	const shared = sorted.find((v) => sorted.filter((u) => Math.abs(u - v) <= SHARE * space).length >= 2);
	// No two strips agree: the staff was found in one strip, or the strips disagree throughout; the topmost then stands.
	const from = shared ?? sorted[0];
	return median(sorted.filter((v) => v >= from - 1e-9 && v <= from + WITHIN * space));
}

/**
 * The top line of the staff below voice staff `a`, in page pixels: found in the
 * ink, else the top of homr's box `b`, else null (no staff below).
 */
export function topLineBelow(page: Grey, a: PlacedStaff, b: PlacedStaff | null): number | null {
	const space = a.staff.space;
	const bottom = a.staff.ls.reduce((m, l) => Math.max(m, l[4]), -Infinity);
	const start = Math.max(0, Math.ceil(bottom + MARGIN * space));
	const end = Math.min(page.height, b ? Math.ceil((b.box.cy + b.box.h / 2) * page.height) : page.height);
	const boxTop = b ? (b.box.cy - b.box.h / 2) * page.height : null;
	if (end - start < 5 * space) return boxTop;
	const span = a.staff.x1 - a.staff.x0;
	const from = Math.floor(a.staff.x0 + span / 4);
	const to = Math.ceil(a.staff.x0 + (3 * span) / 4);
	const strip = Math.max(8, Math.trunc(2 * space));
	const tops: number[] = [];
	for (let x = from; x + strip <= to; x += Math.max(1, Math.trunc(strip / 2))) {
		const group = fives(lineRows(page, x, x + strip, start, end, 0.5)).find((f) => f.s >= SPACE_MIN * space && f.s <= SPACE_MAX * space);
		if (group) tops.push(group.c[0]);
	}
	return topFromColumns(tops, space) ?? boxTop;
}
