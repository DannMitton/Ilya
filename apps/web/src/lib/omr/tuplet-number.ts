/**
 * Printed tuplet numbers, looked for on the page (QUEUE rows 54 and 56).
 *
 * homr can read the notes under a printed tuplet number at their plain values
 * and leave the number out (Gurilyov, «Раскаяние», bar 25: four groups of
 * sixteenth triplets, each marked 3, read as sixteen plain sixteenths). Which
 * notes a number covers is printed only in the number, so this module looks
 * at the page for it, over a bar's notes whose places homr gives
 * (`<!-- imgpos -->`), and reads any number: 2 to 9, two digits, and n:m.
 *
 * How, in the order a reader's eye would go:
 *
 * 1. The staff space, from the staff lines beside the notes: the commonest
 *    distance between the thin black runs down a few columns.
 * 2. A band around the notes, seven staff spaces above and below them and
 *    eight beyond each side, with the thin long strokes taken out (staff
 *    lines, brackets, ledger and extender lines). A numeral's stroke across a
 *    staff line is thicker, so the numeral stays whole.
 * 3. The marks left the size of a printed numeral, grouped into words: marks
 *    side by side on one line, with a colon allowed between two numbers
 *    (`markWords`). A word is not taken where it is plainly something else:
 *    a word of the lyric (a letter beside it, or two within four spaces on its
 *    line), a sign (8va: smaller letters joined on its right), a letter with
 *    a dot over it, a mark between the staff's inner lines (where rests,
 *    accidentals, and notes stand), or one too near either end of the band to
 *    see beside.
 * 4. Each mark of a word read as a digit (`readDigit`, `tuplet-digits.ts`); a
 *    word of one mark is a tuplet number only as 2 to 9, and a 3 is also read
 *    by its shape (`isThree`: one mark at least a staff space tall that closes
 *    no loop, with two notches or more in its left edge and at most one in its
 *    right), where no known mark that is not a digit is nearer (`readWord`).
 * 5. A number is not a tuplet's where another numeral stands directly above
 *    or below it (a time signature, a chord's fingering, a continuo figure),
 *    or where its row holds other numerals than the same number
 *    (`lookOverNotes`).
 *
 * Tesseract (which Ilya loads for poems) was measured first, in row 54, and
 * read most italic 3s as 2 and the letter б as 6, so the marks are read here.
 *
 * A false number is worse than a missed one, so every rule above refuses
 * rather than guesses; anything refused leaves the bar as homr wrote it.
 */

import { readDigit, type MarkMask, type TemplateMark } from './tuplet-digits';

/** A greyscale page: one byte a pixel, 0 black, 255 white. */
export interface GreyPage {
	width: number;
	height: number;
	data: Uint8Array;
}

/** A mark the size of a numeral, found in the band. */
export interface Candidate {
	x0: number;
	y0: number;
	x1: number;
	y1: number;
}

/** What was looked at and what it gave, for the console and the tests. */
export interface Looked {
	/** The number printed, or null (none, or none clearly). */
	number: number | null;
	space: number | null;
	candidates: number;
}

const INK = 140;

/** The staff space near (x, y): the commonest distance between thin black runs in a few columns, or null. */
export function staffSpace(page: GreyPage, xs: readonly number[], y: number): number | null {
	const counts = new Map<number, number>();
	const top = Math.max(0, Math.round(y - 260));
	const bottom = Math.min(page.height - 1, Math.round(y + 260));
	for (const x0 of xs) {
		for (let dx = -24; dx <= 24; dx += 6) {
			const x = Math.round(x0 + dx);
			if (x < 0 || x >= page.width) continue;
			const starts: number[] = [];
			let run = 0;
			for (let yy = top; yy <= bottom; yy++) {
				const black = page.data[yy * page.width + x] < INK;
				if (black) run++;
				else {
					if (run > 0 && run <= 8) starts.push(yy - run);
					run = 0;
				}
			}
			for (let i = 1; i < starts.length; i++) {
				const d = starts[i] - starts[i - 1];
				if (d >= 8 && d <= 70) counts.set(d, (counts.get(d) ?? 0) + 1);
			}
		}
	}
	let best: number | null = null;
	let bestCount = 0;
	for (const [d, n] of counts) {
		const near = n + (counts.get(d - 1) ?? 0) + (counts.get(d + 1) ?? 0);
		if (near > bestCount) {
			bestCount = near;
			best = d;
		}
	}
	return bestCount >= 6 ? best : null;
}

/** A mark the size of a numeral, with its own pixels: `mask` is its box, one byte a pixel, 1 where it is ink. */
export interface Mark extends Candidate {
	mask: Uint8Array;
}

/** Marks side by side on one line, read together: a number of one or two digits, or two numbers either side of a colon. */
export interface Word {
	marks: Mark[];
	/** Where a colon stands between marks: the index of the mark after it, or -1. */
	colonBefore: number;
	x0: number;
	x1: number;
}

/**
 * The words of numeral-sized marks in the band around the notes (seven staff
 * spaces above and below them, and five beyond each side), and the centres of
 * the words that hold a mark of a digit's proportions, whatever they read as.
 *
 * A word is numeral-sized marks on one line, each within 0.6 of a space of
 * the next, with a colon (two small dots, one above the other) allowed
 * between two of them. A word beside a smaller letter on its line, or on a
 * line with two other letter-sized marks within four spaces, is a word of
 * the lyric and is left out.
 */
export function markWords(
	page: GreyPage,
	notes: readonly { x: number; y: number }[],
	space: number,
): { words: Word[]; centres: number[]; numerals: Candidate[] } {
	const xs = notes.map((n) => n.x);
	const ys = notes.map((n) => n.y);
	const minX = Math.min(...xs);
	const maxX = Math.max(...xs);
	const bx0 = Math.max(0, Math.round(minX - 8 * space));
	const bx1 = Math.min(page.width - 1, Math.round(maxX + 8 * space));
	const by0 = Math.max(0, Math.round(Math.min(...ys) - 7 * space));
	const by1 = Math.min(page.height - 1, Math.round(Math.max(...ys) + 7 * space));
	const w = bx1 - bx0 + 1;
	const h = by1 - by0 + 1;
	const ink = new Uint8Array(w * h);
	for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) ink[y * w + x] = page.data[(by0 + y) * page.width + bx0 + x] < INK ? 1 : 0;
	// Take out the thin long strokes (staff lines, brackets, ledger lines,
	// extender lines): ink in a horizontal run longer than one and a half
	// spaces whose own column of ink is no thicker than a staff line. A
	// numeral's stroke across a staff line is thicker, so it stays whole.
	const tall = new Uint8Array(w * h);
	for (let x = 0; x < w; x++) {
		let y = 0;
		while (y < h) {
			if (!ink[y * w + x]) {
				y++;
				continue;
			}
			let e = y;
			while (e < h && ink[e * w + x]) e++;
			for (let k = y; k < e; k++) tall[k * w + x] = Math.min(255, e - y);
			y = e;
		}
	}
	const thin = Math.max(2, Math.round(0.22 * space));
	const long = 1.5 * space;
	const cut: number[] = [];
	for (let y = 0; y < h; y++) {
		let x = 0;
		while (x < w) {
			if (!ink[y * w + x]) {
				x++;
				continue;
			}
			let e = x;
			while (e < w && ink[y * w + e]) e++;
			if (e - x > long) for (let k = x; k < e; k++) if (tall[y * w + k] <= thin) cut.push(y * w + k);
			x = e;
		}
	}
	for (const i of cut) ink[i] = 0;
	// The staff the notes stand on: five of the long thin strokes taken out, a space apart, nearest the notes.
	const cutRows = new Uint32Array(h);
	for (const i of cut) cutRows[Math.floor(i / w)]++;
	const lines: number[] = [];
	for (let y = 0; y < h; y++) {
		if (cutRows[y] < 0.4 * w) continue;
		let e = y;
		while (e + 1 < h && cutRows[e + 1] >= 0.4 * w) e++;
		lines.push((y + e) / 2 + by0);
		y = e;
	}
	const noteY = ys.reduce((a, b) => a + b, 0) / ys.length;
	let staff: { top: number; bottom: number } | null = null;
	for (let i = 0; i + 4 < lines.length; i++) {
		const five = lines.slice(i, i + 5);
		const gaps = five.slice(1).map((v, k) => v - five[k]);
		if (!gaps.every((g) => Math.abs(g - space) <= 0.25 * space)) continue;
		const top = five[0];
		const bottom = five[4];
		const dist = noteY < top ? top - noteY : noteY > bottom ? noteY - bottom : 0;
		if (!staff || dist < (noteY < staff.top ? staff.top - noteY : noteY > staff.bottom ? noteY - staff.bottom : 0)) staff = { top, bottom };
	}
	// Connected marks, eight neighbours.
	const label = new Int32Array(w * h);
	const boxes: Candidate[] = [];
	const counts: number[] = [];
	const stack: number[] = [];
	for (let i = 0; i < w * h; i++) {
		if (!ink[i] || label[i]) continue;
		const id = boxes.length + 1;
		const box = { x0: w, y0: h, x1: -1, y1: -1 };
		let n = 0;
		label[i] = id;
		stack.push(i);
		while (stack.length) {
			const p = stack.pop() as number;
			const px = p % w;
			const py = (p - px) / w;
			n++;
			if (px < box.x0) box.x0 = px;
			if (px > box.x1) box.x1 = px;
			if (py < box.y0) box.y0 = py;
			if (py > box.y1) box.y1 = py;
			for (let dy = -1; dy <= 1; dy++)
				for (let dx = -1; dx <= 1; dx++) {
					const qx = px + dx;
					const qy = py + dy;
					if (qx < 0 || qy < 0 || qx >= w || qy >= h) continue;
					const q = qy * w + qx;
					if (ink[q] && !label[q]) {
						label[q] = id;
						stack.push(q);
					}
				}
		}
		boxes.push(box);
		counts.push(n);
	}
	const bw = (b: Candidate) => b.x1 - b.x0 + 1;
	const bh = (b: Candidate) => b.y1 - b.y0 + 1;
	const numeral = boxes.map((b, i) => {
		const h0 = bh(b);
		const w0 = bw(b);
		if (h0 < 0.6 * space || h0 > 2.0 * space || w0 < 0.3 * space || w0 > 1.6 * space) return false;
		if (h0 / w0 < 0.9 || h0 / w0 > 4) return false;
		const density = counts[i] / (w0 * h0);
		if (density < 0.15 || density > 0.7) return false;
		return !(b.x0 === 0 || b.y0 === 0 || b.x1 === w - 1 || b.y1 === h - 1);
	});
	const dot = boxes.map((b) => bh(b) <= 0.45 * space && bw(b) <= 0.45 * space && bh(b) >= 0.1 * space);
	const order = boxes.map((_, i) => i).filter((i) => numeral[i]).sort((a, b) => boxes[a].x0 - boxes[b].x0);
	const used = new Set<number>();
	const words: Word[] = [];
	for (const first of order) {
		if (used.has(first)) continue;
		const members = [first];
		let colonBefore = -1;
		used.add(first);
		const h0 = bh(boxes[first]);
		const cy = (boxes[first].y0 + boxes[first].y1) / 2;
		const onLine = (j: number) => Math.abs((boxes[j].y0 + boxes[j].y1) / 2 - cy) <= 0.35 * h0 && bh(boxes[j]) >= 0.6 * h0 && bh(boxes[j]) <= 1.5 * h0;
		for (;;) {
			const last = boxes[members[members.length - 1]];
			const next = order.find((j) => !used.has(j) && onLine(j) && boxes[j].x0 > last.x1 && boxes[j].x0 - last.x1 < 0.6 * space);
			if (next !== undefined) {
				members.push(next);
				used.add(next);
				continue;
			}
			// A colon: two dots, one above the other, in a gap of up to 1.2 spaces, then a numeral.
			const after = order.find((j) => !used.has(j) && onLine(j) && boxes[j].x0 > last.x1 && boxes[j].x0 - last.x1 < 1.2 * space);
			if (colonBefore < 0 && after !== undefined) {
				const dots = boxes
					.map((b, k) => k)
					.filter((k) => dot[k] && boxes[k].x0 >= last.x1 && boxes[k].x1 <= boxes[after].x0 && Math.abs((boxes[k].y0 + boxes[k].y1) / 2 - cy) < 0.6 * h0);
				if (dots.length === 2 && Math.abs(boxes[dots[0]].x0 - boxes[dots[1]].x0) < 0.3 * space) {
					colonBefore = members.length;
					members.push(after);
					used.add(after);
					continue;
				}
			}
			break;
		}
		const x0 = Math.min(...members.map((m) => boxes[m].x0));
		const x1 = Math.max(...members.map((m) => boxes[m].x1));
		// Too near either end of the band to see the letters beside it: not taken (a number that
		// matters stands over the notes, eight spaces inside each end).
		if (x0 < 4 * space || x1 > w - 1 - 4 * space) continue;
		// A word of the lyric: a letter-sized mark (not numeral-sized and not a dot) on its line touching it,
		// or two letter-sized marks within four spaces.
		const bottom = Math.max(...members.map((m) => boxes[m].y1));
		const neighbours = boxes.flatMap((o, j) => {
			if (members.includes(j) || dot[j]) return [];
			const oh = bh(o);
			if (oh < 0.5 * h0 || oh > 1.5 * h0 || bw(o) > 2.5 * space) return [];
			// On its line: centred on it, or standing on its baseline.
			if (Math.abs((o.y0 + o.y1) / 2 - cy) > 0.35 * h0 && Math.abs(o.y1 - bottom) > 0.3 * h0) return [];
			return [o.x0 > x1 ? o.x0 - x1 : x0 > o.x1 ? x0 - o.x1 : 0];
		});
		if (neighbours.some((g) => g < 0.6 * space) || neighbours.filter((g) => g < 4 * space).length >= 2) continue;
		// A sign, not a number: smaller letters joined on its right (8va, 8vb, 15ma).
		const top = Math.min(...members.map((m) => boxes[m].y0));
		const signLetters = boxes.some(
			(o, j) => !members.includes(j) && !dot[j] && o.x0 > x1 && o.x0 - x1 < 0.4 * space && bh(o) >= 0.25 * h0 && bh(o) < 0.8 * h0 && o.y1 > top && o.y0 < top + 0.8 * h0,
		);
		if (signLetters) continue;
		// A letter with a dot over it (i, j, ё): a dot directly above, within 0.6 of a space. No digit has one.
		const round = (j: number) => {
			const ow = bw(boxes[j]);
			const oh = bh(boxes[j]);
			return ow >= 0.15 * space && oh >= 0.15 * space && ow / oh >= 0.6 && ow / oh <= 1.6 && counts[j] / (ow * oh) >= 0.5;
		};
		const dotted = boxes.some((o, j) => dot[j] && round(j) && (o.x0 + o.x1) / 2 >= x0 && (o.x0 + o.x1) / 2 <= x1 && o.y1 < top && top - o.y1 < 0.6 * space);
		if (dotted) continue;
		// Not between the staff's inner lines (from its second line to its fourth), where rests, accidentals and notes stand.
		const wy = (top + Math.max(...members.map((m) => boxes[m].y1))) / 2 + by0;
		if (staff && wy > staff.top + space && wy < staff.bottom - space) continue;
		const marks = members.map((i) => {
			const b = boxes[i];
			const w0 = bw(b);
			const h1 = bh(b);
			const mask = new Uint8Array(w0 * h1);
			for (let y = 0; y < h1; y++) for (let x = 0; x < w0; x++) mask[y * w0 + x] = label[(b.y0 + y) * w + b.x0 + x] === i + 1 ? 1 : 0;
			return { x0: b.x0 + bx0, y0: b.y0 + by0, x1: b.x1 + bx0, y1: b.y1 + by0, mask };
		});
		words.push({ marks, colonBefore, x0: x0 + bx0, x1: x1 + bx0 });
	}
	// Where a number could stand: the words left (not of the lyric) that hold a mark of a digit's
	// proportions (row 54's: 0.45 to 1.6 spaces wide, 0.9 to 2.8 times as tall as wide).
	const digitLike = (m: Mark) => {
		const mw = m.x1 - m.x0 + 1;
		const mh = m.y1 - m.y0 + 1;
		return mw >= 0.45 * space && mw <= 1.6 * space && mh / mw >= 0.9 && mh / mw <= 2.8;
	};
	const centres = words.filter((w) => w.marks.some(digitLike)).map((w) => (w.x0 + w.x1) / 2);
	// Every mark of a digit's proportions in the band, taken as a word or not: what the stack and row
	// tests look at (a bracket's hook or a stem is too narrow to be one).
	const numerals = order
		.map((i) => ({ x0: boxes[i].x0 + bx0, x1: boxes[i].x1 + bx0, y0: boxes[i].y0 + by0, y1: boxes[i].y1 + by0, mask: new Uint8Array(0) }))
		.filter(digitLike)
		.map(({ x0, x1, y0, y1 }) => ({ x0, x1, y0, y1 }));
	return { words, centres, numerals };
}

/** What the shape of a mark says. */
export interface Shape {
	holes: number;
	openLeft: number;
	openRight: number;
}

/**
 * The shape of one mark: how many loops it closes, and how many times its
 * outline opens on the left and on the right (a run of rows, at least an
 * eighth of its height, whose ink starts past the middle from that side).
 */
export function shapeOf(mark: Mark): Shape {
	const w = mark.x1 - mark.x0 + 1;
	const h = mark.y1 - mark.y0 + 1;
	const m = mark.mask;
	// Loops: background regions that do not reach the box's edge, at least 2 percent of it.
	const seen = new Uint8Array(w * h);
	let holes = 0;
	const stack: number[] = [];
	for (let i = 0; i < w * h; i++) {
		if (m[i] || seen[i]) continue;
		let edge = false;
		let n = 0;
		seen[i] = 1;
		stack.push(i);
		while (stack.length) {
			const p = stack.pop() as number;
			const px = p % w;
			const py = (p - px) / w;
			n++;
			if (px === 0 || py === 0 || px === w - 1 || py === h - 1) edge = true;
			for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
				const qx = px + dx;
				const qy = py + dy;
				if (qx < 0 || qy < 0 || qx >= w || qy >= h) continue;
				const q = qy * w + qx;
				if (!m[q] && !seen[q]) {
					seen[q] = 1;
					stack.push(q);
				}
			}
		}
		if (!edge && n >= 0.02 * w * h) holes++;
	}
	// Where the ink begins in each row, from the left and from the right, as a share of the width.
	const lo = Math.round(h * 0.05);
	const hi = Math.round(h * 0.95);
	const edge = (fromLeft: boolean): number[] => {
		const raw: number[] = [];
		for (let y = lo; y < hi; y++) {
			let first = w;
			for (let k = 0; k < w; k++) {
				if (m[y * w + (fromLeft ? k : w - 1 - k)]) {
					first = k;
					break;
				}
			}
			raw.push(first / w);
		}
		return raw;
	};
	return { holes, openLeft: notches(edge(true)), openRight: notches(edge(false)) };
}

/**
 * How many notches an edge profile has: peaks standing at least 0.12 of the
 * width above the lowest point on each side of them, with a dip of at least
 * 0.08 between one notch and the next.
 */
export function notches(edge: readonly number[]): number {
	const peaks: number[] = [];
	for (let i = 1; i < edge.length - 1; i++) {
		if (edge[i] < edge[i - 1] || edge[i] < edge[i + 1]) continue;
		if (peaks.length && peaks[peaks.length - 1] === i - 1 && edge[i] === edge[i - 1]) continue;
		const before = Math.min(...edge.slice(0, i));
		const after = Math.min(...edge.slice(i + 1));
		if (edge[i] - Math.max(before, after) >= 0.12) peaks.push(i);
	}
	const kept: number[] = [];
	for (const p of peaks) {
		const last = kept[kept.length - 1];
		if (last === undefined) {
			kept.push(p);
			continue;
		}
		const dip = Math.min(...edge.slice(last, p + 1));
		if (Math.min(edge[last], edge[p]) - dip >= 0.08) kept.push(p);
		else if (edge[p] > edge[last]) kept[kept.length - 1] = p;
	}
	return kept.length;
}

/**
 * A printed 3: one mark, at least a staff space tall, with no loop, two
 * notches or more on its left edge and at most one on its right (the waist of
 * some 3s). The printed tuplet 3s measured stand 1.1 to 1.83 spaces tall.
 */
export function isThree(shape: Shape, heightInSpaces: number): boolean {
	return heightInSpaces >= 1 && shape.holes === 0 && shape.openLeft >= 2 && shape.openRight <= 1;
}

/** A number read over notes: n, the space m where the page prints a ratio (n:m), and where it stands (its centre). */
export interface ReadNumber {
	n: number;
	m: number | null;
	x: number;
	y: number;
}

/** What the page shows over a bar's notes. */
export interface OverNotes {
	/** The numbers read, each clearly. */
	numbers: ReadNumber[];
	/** The centres of every mark there the size of a numeral, whatever it reads as. */
	centres: number[];
	space: number | null;
}

/** A mark as the digit reader takes it. */
const asMask = (m: Mark): MarkMask => ({ width: m.x1 - m.x0 + 1, height: m.y1 - m.y0 + 1, mask: m.mask });

/**
 * The number a word prints, or null. Each mark is read by `readDigit`
 * (`tuplet-digits.ts`). A word of one mark is a tuplet number only as 2 to 9
 * (a 0 or a 1 alone never is); a 3 is also read by row 54's shape (`isThree`),
 * and where the two readers disagree there is no answer. A word of two marks
 * is a number of two digits, 10 or more. A colon splits a word into n:m.
 */
export function readWord(word: Word, space: number, templates: readonly TemplateMark[]): { n: number; m: number | null } | null {
	const digits: string[] = [];
	for (const mark of word.marks) {
		const r = readDigit(asMask(mark), templates);
		const read = r.digit;
		// Row 54's shape is believed only where no known mark that is not a digit is nearer than the nearest digit.
		const three = isThree(shapeOf(mark), (mark.y1 - mark.y0 + 1) / space) && r.other > r.near;
		if (word.marks.length === 1 && read !== null && read !== '3' && three) return null;
		const d = word.marks.length === 1 && three ? '3' : read;
		if (d === null || d === ':') return null;
		// Only a 1 is more than 2.8 times as tall as it is wide.
		if (d !== '1' && (mark.y1 - mark.y0 + 1) / (mark.x1 - mark.x0 + 1) > 2.8) return null;
		digits.push(d);
	}
	const number = (ds: string[]) => (ds.length === 0 || ds.length > 2 || ds[0] === '0' ? null : Number(ds.join('')));
	const left = number(word.colonBefore < 0 ? digits : digits.slice(0, word.colonBefore));
	const right = word.colonBefore < 0 ? null : number(digits.slice(word.colonBefore));
	if (left === null || left < 2 || (word.colonBefore >= 0 && right === null)) return null;
	return { n: left, m: right };
}

/** Looks over a bar's notes for printed tuplet numbers. */
export function lookOverNotes(page: GreyPage, notes: readonly { x: number; y: number }[], templates: readonly TemplateMark[]): OverNotes {
	if (notes.length === 0) return { numbers: [], centres: [], space: null };
	const y = notes.reduce((s, n) => s + n.y, 0) / notes.length;
	const space = staffSpace(page, notes.map((n) => n.x), y);
	if (space === null) return { numbers: [], centres: [], space: null };
	const { words, centres, numerals } = markWords(page, notes, space);
	const box = (w: Word) => ({ x0: w.x0, x1: w.x1, y0: Math.min(...w.marks.map((k) => k.y0)), y1: Math.max(...w.marks.map((k) => k.y1)) });
	const numbers: ReadNumber[] = [];
	for (const word of words) {
		const read = readWord(word, space, templates);
		if (!read) continue;
		// A tuplet number stands alone: a numeral-sized mark directly above or below it, read or not,
		// makes it a figure of a stack (a time signature, a chord's fingering, a continuo figure).
		const b = box(word);
		const own = (c: Candidate) => word.marks.some((m) => m.x0 === c.x0 && m.y0 === c.y0);
		const stacked = numerals.some((c) => {
			if (own(c)) return false;
			const overlap = Math.min(b.x1, c.x1) - Math.max(b.x0, c.x0);
			const gap = c.y0 > b.y1 ? c.y0 - b.y1 : b.y0 > c.y1 ? b.y0 - c.y1 : 0;
			return overlap >= 0.4 * Math.min(b.x1 - b.x0, c.x1 - c.x0) && gap < space;
		});
		if (stacked) continue;
		// A tuplet number shares its row only with the same number (3, 3, 3 over successive groups); a row
		// of other numeral-sized marks within four spaces, read or not, is fingering or figures.
		const cy = (b.y0 + b.y1) / 2;
		const mixed = numerals.some((c) => {
			if (own(c)) return false;
			const dx = c.x0 > b.x1 ? c.x0 - b.x1 : b.x0 > c.x1 ? b.x0 - c.x1 : 0;
			if (dx > 4 * space || Math.abs((c.y0 + c.y1) / 2 - cy) > space) return false;
			// The same number over the next group is allowed; anything else, read or not, is not.
			const same = words.find((o) => o !== word && o.marks.some((m) => m.x0 === c.x0 && m.y0 === c.y0));
			const other = same ? readWord(same, space, templates) : null;
			return !other || other.n !== read.n;
		});
		if (mixed) continue;
		numbers.push({ ...read, x: (b.x0 + b.x1) / 2, y: (b.y0 + b.y1) / 2 });
	}
	return { numbers, centres, space };
}

/**
 * Row 54's question, kept: is a 3 printed over the middle of these three
 * notes (between the halfway points to its neighbours, with 0.3 of a space to
 * spare)? `candidates` counts the numeral-sized marks over the group.
 */
export function lookForTupletNumber(page: GreyPage, notes: readonly { x: number; y: number }[], templates: readonly TemplateMark[] = []): Looked {
	const over = lookOverNotes(page, notes, templates);
	if (over.space === null) return { number: null, space: null, candidates: 0 };
	const xs = notes.map((n) => n.x).sort((a, b) => a - b);
	const [lo, hi] = xs.length === 3 ? [(xs[0] + xs[1]) / 2, (xs[1] + xs[2]) / 2] : [xs[0], xs[xs.length - 1]];
	const pad = 0.3 * over.space;
	const within = (x: number) => x >= lo - pad && x <= hi + pad;
	const threes = over.numbers.filter((n) => n.n === 3 && within(n.x));
	return { number: threes.length === 1 ? 3 : null, space: over.space, candidates: over.centres.filter(within).length };
}
