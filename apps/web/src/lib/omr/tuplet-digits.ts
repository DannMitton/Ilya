/**
 * Reading a printed digit (QUEUE row 56): which digit a mark on the page is,
 * or none.
 *
 * A mark is described the way a reader sees its shape: how many loops it
 * closes (8 closes two; 0, 6, 9, and most 4s one; 1, 2, 3, 5, 7 none), how
 * tall it is for its width, and where its ink lies, in a grid of zones over
 * its box. It is then compared with marks whose answer is known
 * (`TemplateMark`): the music fonts' own tuplet digits, rendered at several
 * sizes and degraded as scans are, and marks from opened scans that are not
 * digits at all (a letter of a sung word, a flag, a rest). The nearest of
 * those, with the same number of loops, gives the answer, and only when it is
 * a digit, near enough, and clearly nearer than the nearest mark that is not
 * a digit. A false digit is worse than a missed one, so anything less is no
 * answer.
 */

/** One mark: its box's width and height, and its ink, one byte a pixel (1 ink). */
export interface MarkMask {
	width: number;
	height: number;
	mask: Uint8Array;
}

/** What a mark looks like to the reader. */
export interface MarkFeatures {
	holes: number;
	/** log(height / width). */
	aspect: number;
	/** Ink share of each zone, GRID_W across by GRID_H down, row by row, relative to the mark's mean. */
	grid: number[];
	/** Strokes crossed along each of CROSS_ROWS rows, then each of CROSS_COLS columns, of the upright mark. */
	cross: number[];
	/** Where the loops sit, 0 at the top and 1 at the bottom (-1 with none): the mean height of their pixels. */
	loopAt: number;
}

/** A mark whose answer is known: a digit ('0' to '9', ':'), or '-' for a mark that is not one. */
export interface TemplateMark extends MarkFeatures {
	label: string;
}

export const GRID_W = 6;
export const GRID_H = 9;
export const CROSS_ROWS = 9;
export const CROSS_COLS = 5;

/** The loops a mark closes: background regions that do not reach its box's edge, at least 2 percent of it. */
export function holesOf(m: MarkMask): number {
	return loopsOf(m).count;
}

/** The loops a mark closes, and the mean height of their pixels (0 top, 1 bottom; -1 with none). */
export function loopsOf(m: MarkMask): { count: number; at: number } {
	const { width: w, height: h, mask } = m;
	const seen = new Uint8Array(w * h);
	const stack: number[] = [];
	let holes = 0;
	let ySum = 0;
	let yN = 0;
	for (let i = 0; i < w * h; i++) {
		if (mask[i] || seen[i]) continue;
		let edge = false;
		let n = 0;
		let ys = 0;
		seen[i] = 1;
		stack.push(i);
		while (stack.length) {
			const p = stack.pop() as number;
			const px = p % w;
			const py = (p - px) / w;
			n++;
			ys += py;
			if (px === 0 || py === 0 || px === w - 1 || py === h - 1) edge = true;
			if (px > 0 && !mask[p - 1] && !seen[p - 1]) (seen[p - 1] = 1), stack.push(p - 1);
			if (px < w - 1 && !mask[p + 1] && !seen[p + 1]) (seen[p + 1] = 1), stack.push(p + 1);
			if (py > 0 && !mask[p - w] && !seen[p - w]) (seen[p - w] = 1), stack.push(p - w);
			if (py < h - 1 && !mask[p + w] && !seen[p + w]) (seen[p + w] = 1), stack.push(p + w);
		}
		if (!edge && n >= 0.02 * w * h) {
			holes++;
			ySum += ys;
			yN += n;
		}
	}
	return { count: holes, at: yN > 0 ? ySum / yN / Math.max(1, h - 1) : -1 };
}

/** Ink runs along a line of the mask, ignoring gaps of one pixel. */
function runs(get: (i: number) => number, n: number): number {
	let count = 0;
	let inRun = false;
	let gap = 0;
	for (let i = 0; i < n; i++) {
		if (get(i)) {
			if (!inRun) count++;
			inRun = true;
			gap = 0;
		} else if (inRun && ++gap > 1) inRun = false;
	}
	return count;
}

/**
 * The mark with its slant taken out: each row moved sideways by the shear
 * its ink's second moments show, so an italic digit and an upright one are
 * compared upright. Cut to its new box.
 */
export function upright(m: MarkMask): MarkMask {
	const { width: w, height: h, mask } = m;
	let n = 0;
	let sx = 0;
	let sy = 0;
	for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (mask[y * w + x]) (n++, (sx += x), (sy += y));
	if (n === 0) return m;
	const cx = sx / n;
	const cy = sy / n;
	let mu11 = 0;
	let mu02 = 0;
	for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (mask[y * w + x]) ((mu11 += (x - cx) * (y - cy)), (mu02 += (y - cy) ** 2));
	const shear = mu02 > 0 ? mu11 / mu02 : 0;
	const xs: number[] = [];
	const ys: number[] = [];
	for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (mask[y * w + x]) (xs.push(Math.round(x - shear * (y - cy))), ys.push(y));
	const x0 = Math.min(...xs);
	const nw = Math.max(...xs) - x0 + 1;
	const out = new Uint8Array(nw * h);
	xs.forEach((x, i) => (out[ys[i] * nw + x - x0] = 1));
	return { width: nw, height: h, mask: out };
}

/** The features of a mark: its loops, then, upright, its shape of box and its ink by zone, relative to its own mean ink. */
export function featuresOf(raw: MarkMask): MarkFeatures {
	const loops = loopsOf(raw);
	const holes = loops.count;
	const m = upright(raw);
	const { width: w, height: h, mask } = m;
	const grid: number[] = [];
	for (let gy = 0; gy < GRID_H; gy++) {
		const y0 = Math.floor((gy * h) / GRID_H);
		const y1 = Math.max(y0 + 1, Math.floor(((gy + 1) * h) / GRID_H));
		for (let gx = 0; gx < GRID_W; gx++) {
			const x0 = Math.floor((gx * w) / GRID_W);
			const x1 = Math.max(x0 + 1, Math.floor(((gx + 1) * w) / GRID_W));
			let ink = 0;
			for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) ink += mask[y * w + x];
			grid.push(ink / ((x1 - x0) * (y1 - y0)));
		}
	}
	const mean = grid.reduce((a, b) => a + b, 0) / grid.length || 1;
	const cross: number[] = [];
	for (let r = 0; r < CROSS_ROWS; r++) {
		const y = Math.min(h - 1, Math.round(((r + 0.5) * h) / CROSS_ROWS));
		cross.push(runs((x) => mask[y * w + x], w));
	}
	for (let c = 0; c < CROSS_COLS; c++) {
		const x = Math.min(w - 1, Math.round(((c + 0.5) * w) / CROSS_COLS));
		cross.push(runs((y) => mask[y * w + x], h));
	}
	return { holes, aspect: Math.log(h / w), grid: grid.map((g) => g / mean), cross, loopAt: loops.at };
}

/** How unlike two marks are: the grid's root-mean-square difference, plus their difference in shape of box. Infinite where their loops differ. */
export function distance(a: MarkFeatures, b: MarkFeatures): number {
	if (a.holes !== b.holes) return Number.POSITIVE_INFINITY;
	let s = 0;
	for (let i = 0; i < a.grid.length; i++) s += (a.grid[i] - b.grid[i]) ** 2;
	let c = 0;
	for (let i = 0; i < a.cross.length; i++) c += Math.abs(a.cross[i] - b.cross[i]);
	return CROSS_WEIGHT * (c / a.cross.length) + GRID_WEIGHT * Math.sqrt(s / a.grid.length) + 0.15 * Math.abs(a.aspect - b.aspect) + Math.abs(a.loopAt - b.loopAt);
}

/** How much the strokes crossed and the ink by zone count in the distance. */
export const CROSS_WEIGHT = 1;
export const GRID_WEIGHT = 0.5;

/** How near the nearest digit must be, and how much nearer than the nearest mark that is not a digit. Set on row 56's examples. */
export const MAX_DISTANCE = 0.6;
export const MIN_MARGIN = 1.8;

/** What the reader makes of one mark. */
export interface DigitRead {
	/** The digit read, or null. */
	digit: string | null;
	/** The nearest known mark's answer and distance, and the nearest non-digit's distance. */
	nearest: string | null;
	near: number;
	other: number;
}

/** Reads one mark against the known marks. */
export function readDigit(m: MarkMask, templates: readonly TemplateMark[], maxDistance = MAX_DISTANCE, minMargin = MIN_MARGIN): DigitRead {
	const f = featuresOf(m);
	let best: TemplateMark | null = null;
	let near = Number.POSITIVE_INFINITY;
	let other = Number.POSITIVE_INFINITY;
	for (const t of templates) {
		const d = distance(f, t);
		if (t.label === '-') {
			if (d < other) other = d;
		} else if (d < near) {
			near = d;
			best = t;
		}
	}
	const digit = best !== null && near <= maxDistance && other > near * minMargin ? best.label : null;
	return { digit, nearest: best?.label ?? null, near, other };
}

/** A template as `tuplet-digit-templates.json` keeps it: grid in twentieths, aspect and loop height in hundredths. */
export interface PackedTemplate {
	l: string;
	h: number;
	a: number;
	at: number;
	g: number[];
	c: number[];
}

/** The templates, unpacked. */
export function unpack(packed: readonly PackedTemplate[]): TemplateMark[] {
	return packed.map((t) => ({ label: t.l, holes: t.h, aspect: t.a / 100, loopAt: t.at / 100, grid: t.g.map((v) => v / 20), cross: t.c }));
}

/**
 * The known marks Ilya reads digits against (QUEUE row 56): the tuplet digits
 * 0 to 9 of nine music fonts (Bravura, Leland, Finale Maestro, Petaluma,
 * Sebastian, and Finale Broadway, Ash, Jazz, and Legacy), each rendered at a
 * staff space of 28 pixels, clean and in five degradations (540); and 861
 * marks that are not digits: 137 cut from opened scans, 384 letters (а, б,
 * в, з, и, к, о, с, у, ч, э, я and their capitals, in Times New Roman and
 * Georgia, upright, bold, and italic, clean and blurred), and 340 music signs
 * (rests, accidentals, flags, p, m, f, fermata, turn, and trill) from ten music
 * fonts, clean and blurred. Loaded only when a bar is in doubt.
 */
export async function loadTemplates(): Promise<TemplateMark[]> {
	const packed = (await import('./tuplet-digit-templates.json')).default as PackedTemplate[];
	return unpack(packed);
}
