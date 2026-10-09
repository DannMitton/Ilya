/**
 * The printed tuplet number, looked for on the page (QUEUE row 54).
 *
 * homr can read the notes under a printed 3 at their plain values and leave
 * the 3 out (Gurilyov, «Раскаяние», bar 25: four groups of sixteenth
 * triplets, each marked 3, read as sixteen plain sixteenths). Which notes the
 * 3 covers is printed only in the 3, so this module looks at the page for it,
 * over one group of notes whose places homr gives (`<!-- imgpos -->`).
 *
 * How, in the order a reader's eye would go:
 *
 * 1. The staff space, from the staff lines beside the group: the commonest
 *    distance between the thin black runs down a few columns.
 * 2. A band around the group, seven staff spaces above and below its notes,
 *    with the thin long strokes taken out (staff lines, brackets, ledger and
 *    extender lines). A numeral's stroke across a staff line is thicker, so
 *    the numeral stays whole.
 * 3. The marks left in the band the size of a printed numeral, over the
 *    group, and not a letter of a sung word (no mark of its height on its
 *    line beside it, and not two within four spaces).
 * 4. The shape of each such mark: a printed 3 is one mark at least a staff
 *    space tall that closes no loop, with two notches or more in its left
 *    edge and at most one in its right. That leaves out a 2, 5, 6, 7, 8, 9,
 *    a rest, a flag, and the letters я, б, у, and е.
 *
 * Tesseract (which Ilya loads for poems) was measured first, on the same
 * marks, and read most italic 3s as 2 and the letter б as 6, so the shape is
 * read here instead (QUEUE row 54's report).
 *
 * A false 3 is worse than a missed one, so the answer is 3 only where exactly
 * one mark reads as one; anything else is `null`, and the caller leaves the
 * bar as it was. Only 3 is read: 5 and 6 are not.
 */

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
	shapes: Shape[];
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

/**
 * The marks the size of a numeral in the band around the notes, centred on
 * them and not on a line of letters (a sung word is a row of letter-sized
 * marks of one height side by side; a tuplet number stands by itself).
 */
export function numeralMarks(page: GreyPage, notes: readonly { x: number; y: number }[], space: number): Mark[] {
	const xs = notes.map((n) => n.x);
	const ys = notes.map((n) => n.y);
	const minX = Math.min(...xs);
	const maxX = Math.max(...xs);
	// Wide enough to see the letters of a word on either side of the group.
	const bx0 = Math.max(0, Math.round(minX - 5 * space));
	const bx1 = Math.min(page.width - 1, Math.round(maxX + 5 * space));
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
	const mid = (minX + maxX) / 2 - bx0;
	const reach = 0.5 * (maxX - minX) + 0.8 * space;
	const out: Mark[] = [];
	boxes.forEach((b, i) => {
		const h0 = bh(b);
		const w0 = bw(b);
		if (h0 < 0.6 * space || h0 > 2.0 * space || w0 < 0.45 * space || w0 > 1.6 * space) return;
		if (h0 / w0 < 0.9 || h0 / w0 > 2.8) return;
		const density = counts[i] / (w0 * h0);
		if (density < 0.15 || density > 0.65) return;
		if (b.x0 === 0 || b.y0 === 0 || b.x1 === w - 1 || b.y1 === h - 1) return;
		// Over the group: for three notes, over the middle one (between the
		// halfway points to its neighbours), where a group's number is printed;
		// so a neighbouring group's number is not taken for this one's.
		const cx = (b.x0 + b.x1) / 2 + bx0;
		if (notes.length === 3) {
			const [a1, a2, a3] = [...xs].sort((p, q) => p - q);
			if (cx < (a1 + a2) / 2 - 0.3 * space || cx > (a2 + a3) / 2 + 0.3 * space) return;
		} else if (Math.abs((b.x0 + b.x1) / 2 - mid) > reach) return;
		// Not a letter of a word: no mark of about its height on its line
		// touching it (within 0.6 of a space), and not two within four spaces.
		const cy = (b.y0 + b.y1) / 2;
		const gaps = boxes.flatMap((o, j) => {
			if (j === i) return [];
			const oh = bh(o);
			if (oh < 0.5 * h0 || oh > 1.5 * h0 || bw(o) > 2.5 * space) return [];
			if (Math.abs((o.y0 + o.y1) / 2 - cy) > 0.35 * h0) return [];
			return [o.x0 > b.x1 ? o.x0 - b.x1 : b.x0 > o.x1 ? b.x0 - o.x1 : 0];
		});
		if (gaps.some((g) => g < 0.6 * space) || gaps.filter((g) => g < 4 * space).length >= 2) return;
		const mask = new Uint8Array(w0 * h0);
		for (let y = 0; y < h0; y++) for (let x = 0; x < w0; x++) mask[y * w0 + x] = label[(b.y0 + y) * w + b.x0 + x] === i + 1 ? 1 : 0;
		out.push({ x0: b.x0 + bx0, y0: b.y0 + by0, x1: b.x1 + bx0, y1: b.y1 + by0, mask });
	});
	return out;
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

/**
 * Looks for a printed tuplet number over `notes` (homr's places for one group
 * of notes, on this page): 3, or null where none is printed or none reads
 * clearly (two marks that both read as 3 are not clear either).
 */
export function lookForTupletNumber(page: GreyPage, notes: readonly { x: number; y: number }[]): Looked {
	if (notes.length === 0) return { number: null, space: null, candidates: 0, shapes: [] };
	const y = notes.reduce((s, n) => s + n.y, 0) / notes.length;
	const space = staffSpace(page, notes.map((n) => n.x), y);
	if (space === null) return { number: null, space: null, candidates: 0, shapes: [] };
	const marks = numeralMarks(page, notes, space);
	const shapes = marks.map(shapeOf);
	const threes = marks.filter((m, i) => isThree(shapes[i], (m.y1 - m.y0 + 1) / space)).length;
	return { number: threes === 1 ? 3 : null, space, candidates: marks.length, shapes };
}
