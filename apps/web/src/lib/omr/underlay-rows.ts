/**
 * The text rows of a band under a voice staff (N.135, stage 2a).
 *
 * A band is the strip of the page between a voice staff and the next staff
 * (`systems` of the stage 1 harness: from 1.5 staff spaces under the staff's
 * bottom line to 1.5 under the next staff's top). The words printed under the
 * notes sit in it as one row, or two where the print sets a second language
 * beneath the first. `cutRows` finds those rows in the band's grey pixels.
 *
 * Two rules, both measured in stage 1
 * (`docs/sessions/report-code-n135-underlay-harness_r1_2026-10-15.md`, 4.1):
 *
 * - R1, row 81's rule (`rows.py`): a pixel is ink where it is darker than the
 *   paper tone less 60; a line of the band is a text line where its ink pixels
 *   exceed 2 percent of the band's width; lines less than 0.3 staff space apart
 *   merge; a run under 0.4 staff space drops; a row is padded by 0.3 staff
 *   space on each side.
 * - R2, the harness's addition (`rowsys2.py`): R1 merged the Russian row with
 *   the German row under it on 26 of the 57 Sunless Russian rows, and with the
 *   piano's upper reach on 17 more rows. A row whose core is taller than 1.6
 *   staff spaces is therefore split at the valleys of its ink profile.
 *
 * `cutRows` says where the ink is. It does not say what the ink is: a row may
 * hold a tempo mark or a piano head, and the caller decides that
 * (`underlay-language.ts`).
 *
 * Pure: pixels in, boxes out. No DOM, no canvas.
 */

/** A greyscale band, one byte per pixel, row-major, 0 black to 255 white. */
export interface GreyBandLike {
	width: number;
	height: number;
	data: ArrayLike<number>;
	/**
	 * The paper tone, where the caller measured it on the whole page. The
	 * harness did (the median of a grid over the page); without it, `cutRows`
	 * takes the median of the same grid over the band itself, which reads dark
	 * where the band is mostly ink.
	 */
	paper?: number;
}

/**
 * One text row. `y0` and `y1` are band rows, `y0` inclusive and `y1`
 * exclusive, so `crop(0, y0, width, y1)` is the row with its padding. `core`
 * is the first and last band row that holds ink, both inclusive.
 */
export interface RowBox {
	y0: number;
	y1: number;
	core: [number, number];
}

/** Ink is darker than the paper tone less this much. */
export const INK_BELOW_PAPER = 60;
/** A text line has ink on more than this share of the band's width. */
export const LINE_SHARE = 0.02;
/** Lines closer than this many staff spaces are one row. */
export const MERGE_GAP = 0.3;
/** A run shorter than this many staff spaces is not a row. */
export const MIN_ROW = 0.4;
/** Padding on each side of a row's core, in staff spaces. */
export const PAD = 0.3;
/** A core taller than this many staff spaces is looked at for a valley. */
export const SPLIT_ABOVE = 1.6;
/** A valley is not searched this close, in staff spaces, to either end of a core. */
export const VALLEY_EDGE = 0.7;
/** A valley is real where its ink is under this share of the smaller peak beside it. */
export const VALLEY_RATIO = 0.45;
/** A core is split again at most this many times (to four pieces). */
export const SPLIT_DEPTH = 3;
/** The paper tone is sampled on a grid of this many pixels. */
const PAPER_GRID = 37;

/** The median, taking the mean of the middle two where the count is even (numpy's). */
function median(values: number[]): number {
	const sorted = [...values].sort((a, b) => a - b);
	const n = sorted.length;
	return n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
}

function paperOf(band: GreyBandLike): number {
	if (band.paper !== undefined) return band.paper;
	const sample: number[] = [];
	for (let y = 0; y < band.height; y += PAPER_GRID) {
		for (let x = 0; x < band.width; x += PAPER_GRID) sample.push(band.data[y * band.width + x]);
	}
	return sample.length ? median(sample) : 255;
}

/** The ink pixels in each line of the band. */
function inkProfile(band: GreyBandLike): number[] {
	const ink = paperOf(band) - INK_BELOW_PAPER;
	const profile = new Array<number>(band.height).fill(0);
	for (let y = 0; y < band.height; y++) {
		let count = 0;
		for (let x = 0; x < band.width; x++) if (band.data[y * band.width + x] < ink) count++;
		profile[y] = count;
	}
	return profile;
}

/** `profile[from..to]`, smoothed by a moving mean whose ends see zeros beyond the slice. */
function smoothed(profile: number[], from: number, to: number, space: number): number[] {
	const size = Math.max(3, Math.trunc(0.08 * space)) | 1;
	const half = (size - 1) / 2;
	const out: number[] = [];
	for (let i = from; i <= to; i++) {
		let sum = 0;
		for (let j = i - half; j <= i + half; j++) if (j >= from && j <= to) sum += profile[j];
		out.push(sum / size);
	}
	return out;
}

/** A core cut at the valleys of its ink: the (first, last) line of each piece. */
function splitAtValleys(profile: number[], from: number, to: number, space: number, depth = 0): Array<[number, number]> {
	const height = to - from + 1;
	if (height <= SPLIT_ABOVE * space || depth >= SPLIT_DEPTH) return [[from, to]];
	const low = Math.trunc(VALLEY_EDGE * space);
	const high = height - low;
	if (high <= low) return [[from, to]];
	const smooth = smoothed(profile, from, to, space);
	let valley = low;
	for (let i = low + 1; i < high; i++) if (smooth[i] < smooth[valley]) valley = i;
	const left = valley > 0 ? Math.max(...smooth.slice(0, valley)) : 0;
	const right = Math.max(...smooth.slice(valley));
	if (smooth[valley] < VALLEY_RATIO * Math.min(left, right)) {
		return [
			...splitAtValleys(profile, from, from + valley, space, depth + 1),
			...splitAtValleys(profile, from + valley + 1, to, space, depth + 1),
		];
	}
	return [[from, to]];
}

/**
 * The text rows of a band, top to bottom. `staffSpace` is the staff space of
 * the voice staff above the band, in the band's pixels. Band rows count from 0
 * at the band's top.
 */
export function cutRows(band: GreyBandLike, staffSpace: number): RowBox[] {
	const profile = inkProfile(band);
	const lineMin = LINE_SHARE * band.width;
	const on = profile.map((count) => count > lineMin);

	const runs: Array<[number, number]> = [];
	for (let y = 0; y < band.height; y++) {
		if (!on[y]) continue;
		const last = runs[runs.length - 1];
		if (last && y - last[1] - 1 < MERGE_GAP * staffSpace) last[1] = y;
		else runs.push([y, y]);
	}

	const rows: RowBox[] = [];
	for (const [first, last] of runs) {
		if (last - first + 1 < MIN_ROW * staffSpace) continue;
		for (const [from, to] of splitAtValleys(profile, first, last, staffSpace)) {
			let a = from;
			while (a <= to && !on[a]) a++;
			let z = to;
			while (z >= a && !on[z]) z--;
			if (a > to) continue;
			rows.push({
				y0: Math.max(0, Math.trunc(a - PAD * staffSpace)),
				y1: Math.min(band.height, Math.trunc(z + 1 + PAD * staffSpace)),
				core: [a, z],
			});
		}
	}
	return rows;
}
