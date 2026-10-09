/**
 * Reading a printed time signature from the page image (QUEUE row 57): at a
 * place on the voice's staff, the stacked pair of figures printed there
 * (upper over lower), C, or cut C, or nothing.
 *
 * The staff is found from the image itself: five long thin lines, a space
 * apart (`findStaff`). Its lines are taken out where they cross nothing
 * (`staffMarks`), so a figure drawn across them stays whole, and what is left
 * are the marks printed on the staff. A time signature's figures each fill
 * half the staff: the upper from the top line to the middle line, the lower
 * from the middle line to the bottom line, one above the other. C and cut C
 * stand on the middle line. Each mark is read by row 56's digit reader
 * (`readDigit`, `tuplet-digits.ts`) against known marks of its own: the
 * music fonts' time-signature figures, C, and cut C, drawn on a staff and
 * taken through the same steps, and the marks that also stand at a bar's
 * start and are not figures (clefs, accidentals, key signatures, rests,
 * noteheads, repeat dots).
 *
 * A pair is an answer only where every figure in it reads, and its lower
 * figure is 1, 2, 4, 8, 16, or 32. A false figure is worse than a missed one,
 * so anything less is no answer.
 */

import { distance, featuresOf, type MarkMask, type TemplateMark } from './tuplet-digits';
import type { GreyPage } from './tuplet-number';

const INK = 140;

/** A five-line staff on the page: its lines' heights, top first, the space between them, and a line's thickness. */
export interface Staff {
	lines: number[];
	space: number;
	thick: number;
}

/**
 * The staff whose lines cross the stretch from `x0` to `x1` nearest the
 * height `y`: five rows of ink across most of the stretch, evenly spaced. Null
 * where there is none.
 */
export function findStaff(page: GreyPage, x0: number, x1: number, y: number, reach = 600): Staff | null {
	const a = Math.max(0, Math.round(x0));
	const b = Math.min(page.width - 1, Math.round(x1));
	if (b - a < 10) return null;
	const top = Math.max(0, Math.round(y - reach));
	const bottom = Math.min(page.height - 1, Math.round(y + reach));
	const rows: { from: number; to: number }[] = [];
	let open = -1;
	for (let r = top; r <= bottom + 1; r++) {
		let ink = 0;
		if (r <= bottom) for (let x = a; x <= b; x++) if (page.data[r * page.width + x] < INK) ink++;
		const line = r <= bottom && ink >= 0.6 * (b - a + 1);
		if (line && open < 0) open = r;
		if (!line && open >= 0) {
			rows.push({ from: open, to: r - 1 });
			open = -1;
		}
	}
	let best: Staff | null = null;
	let bestDist = Infinity;
	for (let i = 0; i + 4 < rows.length; i++) {
		const five = rows.slice(i, i + 5);
		const centres = five.map((l) => (l.from + l.to) / 2);
		const gaps = centres.slice(1).map((c, k) => c - centres[k]);
		const space = gaps.reduce((s, g) => s + g, 0) / 4;
		if (space < 8 || !gaps.every((g) => Math.abs(g - space) <= 0.15 * space)) continue;
		const thick = Math.max(...five.map((l) => l.to - l.from + 1));
		if (thick > 0.4 * space) continue;
		const dist = y < centres[0] ? centres[0] - y : y > centres[4] ? y - centres[4] : 0;
		if (dist < bestDist) {
			bestDist = dist;
			best = { lines: centres, space, thick };
		}
	}
	return best;
}

/** A mark on the staff, its box in page pixels, its ink one byte a pixel over its box. */
export interface StaffMark {
	x0: number;
	y0: number;
	x1: number;
	y1: number;
	mask: Uint8Array;
	ink: number;
}

/**
 * The marks printed on the staff from `x0` to `x1`, from one and a half
 * spaces above its top line to one and a half below its bottom line, with
 * the staff lines taken out: in each column, a run of ink over a line no
 * taller than the line is the line alone, and is removed; a run that is
 * taller is a mark crossing the line, and stays.
 */
export function staffMarks(page: GreyPage, staff: Staff, x0: number, x1: number, splitMiddle = false): StaffMark[] {
	const { lines, space, thick } = staff;
	const bx0 = Math.max(0, Math.round(x0));
	const bx1 = Math.min(page.width - 1, Math.round(x1));
	const by0 = Math.max(0, Math.round(lines[0] - 1.5 * space));
	const by1 = Math.min(page.height - 1, Math.round(lines[4] + 1.5 * space));
	const w = bx1 - bx0 + 1;
	const h = by1 - by0 + 1;
	if (w <= 0 || h <= 0) return [];
	const ink = new Uint8Array(w * h);
	for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) ink[y * w + x] = page.data[(by0 + y) * page.width + bx0 + x] < INK ? 1 : 0;
	const before = ink.slice();
	const lineRows = lines.map((l) => l - by0);
	const most = thick + Math.max(2, Math.round(0.08 * space));
	for (let x = 0; x < w; x++) {
		let y = 0;
		while (y < h) {
			if (!ink[y * w + x]) {
				y++;
				continue;
			}
			let e = y;
			while (e < h && ink[e * w + x]) e++;
			if (e - y <= most && lineRows.some((l) => l >= y - 1 && l <= e)) for (let k = y; k < e; k++) ink[k * w + x] = 0;
			y = e;
		}
	}
	// The figures of a pair meet at the middle line: for them, the middle line is taken out whole.
	if (splitMiddle) {
		const mid = lineRows[2];
		for (let y = Math.max(0, Math.floor(mid - thick / 2)); y <= Math.min(h - 1, Math.ceil(mid + thick / 2)); y++) for (let x = 0; x < w; x++) ink[y * w + x] = 0;
	}
	// Connected parts, eight neighbours.
	const label = new Int32Array(w * h);
	const parts: { x0: number; y0: number; x1: number; y1: number; pixels: number[] }[] = [];
	const stack: number[] = [];
	for (let i = 0; i < w * h; i++) {
		if (!ink[i] || label[i]) continue;
		const part = { x0: w, y0: h, x1: -1, y1: -1, pixels: [] as number[] };
		label[i] = parts.length + 1;
		stack.push(i);
		while (stack.length) {
			const q0 = stack.pop() as number;
			const px = q0 % w;
			const py = (q0 - px) / w;
			part.pixels.push(q0);
			if (px < part.x0) part.x0 = px;
			if (px > part.x1) part.x1 = px;
			if (py < part.y0) part.y0 = py;
			if (py > part.y1) part.y1 = py;
			for (let dy = -1; dy <= 1; dy++)
				for (let dx = -1; dx <= 1; dx++) {
					const qx = px + dx;
					const qy = py + dy;
					if (qx < 0 || qy < 0 || qx >= w || qy >= h) continue;
					const q = qy * w + qx;
					if (ink[q] && !label[q]) {
						label[q] = parts.length + 1;
						stack.push(q);
					}
				}
		}
		parts.push(part);
	}
	// Parts of one mark that taking out a line parted again: parts whose boxes overlap, or that
	// meet across a staff line (not the middle line, where it was taken out on purpose) one over the other.
	const root = parts.map((_, i) => i);
	const find = (i: number): number => (root[i] === i ? i : (root[i] = find(root[i])));
	const across = lineRows.filter((_, k) => !(splitMiddle && k === 2));
	for (let i = 0; i < parts.length; i++)
		for (let j = i + 1; j < parts.length; j++) {
			const p = parts[i];
			const q = parts[j];
			const ox = Math.min(p.x1, q.x1) - Math.max(p.x0, q.x0) + 1;
			const oy = Math.min(p.y1, q.y1) - Math.max(p.y0, q.y0) + 1;
			const small = Math.min((p.x1 - p.x0 + 1) * (p.y1 - p.y0 + 1), (q.x1 - q.x0 + 1) * (q.y1 - q.y0 + 1));
			const overlap = ox > 0 && oy > 0 && ox * oy >= 0.3 * small;
			const [upper, lower] = p.y0 <= q.y0 ? [p, q] : [q, p];
			const meet =
				ox >= 0.5 * Math.min(p.x1 - p.x0 + 1, q.x1 - q.x0 + 1) &&
				lower.y0 - upper.y1 <= thick + 2 &&
				across.some((l) => l >= upper.y1 - 1 && l <= lower.y0 + 1);
			if (overlap || meet) root[find(i)] = find(j);
		}
	const groups = new Map<number, number[]>();
	parts.forEach((_, i) => groups.set(find(i), [...(groups.get(find(i)) ?? []), i]));
	const marks: StaffMark[] = [];
	for (const members of groups.values()) {
		const pixels = members.flatMap((k) => parts[k].pixels);
		if (pixels.length < 4) continue;
		const mx0 = Math.min(...members.map((k) => parts[k].x0));
		const mx1 = Math.max(...members.map((k) => parts[k].x1));
		const my0 = Math.min(...members.map((k) => parts[k].y0));
		const my1 = Math.max(...members.map((k) => parts[k].y1));
		const mw = mx1 - mx0 + 1;
		const mh = my1 - my0 + 1;
		const mask = new Uint8Array(mw * mh);
		for (const q of pixels) {
			const px = q % w;
			const py = (q - px) / w;
			mask[(py - my0) * mw + px - mx0] = 1;
		}
		// Line ink the mark rests on, put back: on a row where a line was taken out, a gap in the
		// mark of less than a third of a space, that was ink before, is the mark's own stroke along the line.
		const gap = Math.round(space / 3);
		for (let y = 0; y < mh; y++) {
			const row = my0 + y;
			let last = -1;
			for (let x = 0; x < mw; x++) {
				if (!mask[y * mw + x]) continue;
				if (last >= 0 && x - last > 1 && x - last - 1 <= gap) {
					let was = true;
					for (let k = last + 1; k < x && was; k++) was = before[row * w + mx0 + k] === 1 && ink[row * w + mx0 + k] === 0;
					if (was) for (let k = last + 1; k < x; k++) mask[y * mw + k] = 1;
				}
				last = x;
			}
		}
		marks.push({ x0: mx0 + bx0, y0: my0 + by0, x1: mx1 + bx0, y1: my1 + by0, mask, ink: pixels.length });
	}
	return marks.sort((p, q) => p.x0 - q.x0);
}

/** Where a mark stands on the staff: as the upper figure, the lower figure, a sign on the middle line, or none of these. */
export type Seat = 'upper' | 'lower' | 'sign' | null;

/** Where a mark of a figure's size stands, or null for a mark of another size or place. */
export function seatOf(m: StaffMark, staff: Staff): Seat {
	const { lines, space } = staff;
	const h = m.y1 - m.y0 + 1;
	const w = m.x1 - m.x0 + 1;
	const cy = (m.y0 + m.y1) / 2;
	if (w < 0.25 * space || w > 2.4 * space) return null;
	if (h >= 1.4 * space && h <= 2.7 * space) {
		if (Math.abs(cy - lines[1]) <= 0.45 * space && m.y0 >= lines[0] - 0.6 * space && m.y1 <= lines[2] + 0.6 * space) return 'upper';
		if (Math.abs(cy - lines[3]) <= 0.45 * space && m.y0 >= lines[2] - 0.6 * space && m.y1 <= lines[4] + 0.6 * space) return 'lower';
	}
	if (h >= 1.5 * space && h <= 4.8 * space && w >= 0.9 * space && Math.abs(cy - lines[2]) <= 0.5 * space) return 'sign';
	return null;
}

const asMask = (m: StaffMark): MarkMask => ({ width: m.x1 - m.x0 + 1, height: m.y1 - m.y0 + 1, mask: m.mask });

/** A time signature read on the page: its figures, or C or cut C, and where it stands across the page. */
export type Signature = { x: number; beats: number; beatType: number; sign: null } | { x: number; beats: number; beatType: number; sign: 'C' | 'cut' };

/** The lower figures a time signature prints. */
const LOWER = [1, 2, 4, 8, 16, 32];

/** How near the nearest known mark must be, and how much nearer than the nearest with another answer. JUDGEMENT, set on row 57's examples. */
export const MAX_DISTANCE = 0.6;
export const MIN_MARGIN = 1.5;
export const OTHER_MARGIN = 1.5;

/**
 * What one mark reads as: '0' to '9', 'C', or 'cut', or null. The nearest
 * known mark gives the answer only when it is near enough, and the nearest
 * known mark with any other answer (another figure, or a mark that is not
 * one) is clearly farther.
 */
export function readMark(
	m: MarkMask,
	templates: readonly TemplateMark[],
	maxDistance = MAX_DISTANCE,
	minMargin = MIN_MARGIN,
	otherMargin = OTHER_MARGIN,
): string | null {
	const f = featuresOf(m);
	const best = new Map<string, number>();
	for (const t of templates) {
		const d = distance(f, t);
		if (d < (best.get(t.label) ?? Infinity)) best.set(t.label, d);
	}
	const ranked = [...best].filter(([l]) => l !== '-').sort((a, b) => a[1] - b[1]);
	if (ranked.length === 0) return null;
	const [label, near] = ranked[0];
	const answer = ranked[1]?.[1] ?? Infinity;
	const other = best.get('-') ?? Infinity;
	return near <= maxDistance && answer > near * minMargin && other > near * otherMargin ? label : null;
}

/** A word of one or two figures side by side in one seat: the number it prints, or null where any figure does not read. */
function readFigures(marks: readonly StaffMark[], templates: readonly TemplateMark[], tuning: Tuning): number | null {
	let s = '';
	for (const m of marks) {
		const d = readMark(asMask(m), templates, tuning.maxDistance, tuning.minMargin, tuning.otherMargin);
		if (d === null || !/^[0-9]$/.test(d)) return null;
		// A 1 is a narrow upright stroke: a mark read as one that is not twice as tall as it is wide is two figures run together.
		if (d === '1' && m.y1 - m.y0 + 1 < 2 * (m.x1 - m.x0 + 1)) return null;
		s += d;
	}
	if (s === '' || s.length > 2 || s[0] === '0') return null;
	return Number(s);
}

/** The reader's thresholds. */
export interface Tuning {
	maxDistance: number;
	minMargin: number;
	otherMargin: number;
}

/**
 * Every time signature printed on the staff from `x0` to `x1`: each pair of
 * figure words, one in the upper seat over one in the lower seat, and each C
 * or cut C on the middle line. A pair is kept only where both words read and
 * the lower is 1, 2, 4, 8, 16, or 32.
 */
export function readSignatures(
	page: GreyPage,
	staff: Staff,
	x0: number,
	x1: number,
	templates: readonly TemplateMark[],
	tuning: Tuning = { maxDistance: MAX_DISTANCE, minMargin: MIN_MARGIN, otherMargin: OTHER_MARGIN },
): Signature[] {
	const marks = staffMarks(page, staff, x0, x1, true);
	const { space } = staff;
	const seats = marks.map((m) => seatOf(m, staff));
	const words = (seat: Seat) => {
		const out: StaffMark[][] = [];
		marks.forEach((m, i) => {
			if (seats[i] !== seat) return;
			const last = out[out.length - 1];
			const prev = last?.[last.length - 1];
			if (prev && m.x0 - prev.x1 < 0.6 * space && last.length < 2) last.push(m);
			else out.push([m]);
		});
		return out;
	};
	const span = (w: readonly StaffMark[]) => ({ a: Math.min(...w.map((m) => m.x0)), b: Math.max(...w.map((m) => m.x1)) });
	// A word is whole only where no other mark stands in its half of the staff right beside it
	// (a figure of 12 that was not seated would leave the 1 to be read alone).
	const whole = (w: readonly StaffMark[], from: number, to: number) => {
		const { a, b } = span(w);
		return !marks.some((m) => {
			if (w.includes(m) || m.y1 - m.y0 + 1 < 0.6 * space) return false;
			const inHalf = Math.min(m.y1, to) - Math.max(m.y0, from) >= 0.5 * (m.y1 - m.y0 + 1);
			const gap = m.x0 > b ? m.x0 - b : a > m.x1 ? a - m.x1 : 0;
			return inHalf && gap < 0.4 * space;
		});
	};
	const found: Signature[] = [];
	const lowers = words('lower');
	for (const up of words('upper')) {
		const u = span(up);
		// The lower word stands centred under the upper.
		const low = lowers.find((l) => {
			const v = span(l);
			return Math.abs((u.a + u.b) / 2 - (v.a + v.b) / 2) <= 0.3 * Math.max(u.b - u.a, v.b - v.a) + 0.2 * space;
		});
		if (!low) continue;
		if (!whole(up, staff.lines[0], staff.lines[2]) || !whole(low, staff.lines[2], staff.lines[4])) continue;
		// One narrow stroke over another is a bar line or a stem cut at the middle line, not two figures 1.
		const narrow = (w: readonly StaffMark[]) => w.length === 1 && w[0].x1 - w[0].x0 + 1 < 0.5 * space;
		if (narrow(up) && narrow(low)) continue;
		const beats = readFigures(up, templates, tuning);
		const beatType = readFigures(low, templates, tuning);
		if (beats === null || beatType === null || !LOWER.includes(beatType)) continue;
		const v = span(low);
		found.push({ x: (Math.min(u.a, v.a) + Math.max(u.b, v.b)) / 2, beats, beatType, sign: null });
	}
	// C and cut C cross the middle line, so they are found with it left in.
	for (const m of staffMarks(page, staff, x0, x1)) {
		if (seatOf(m, staff) !== 'sign') continue;
		const d = readMark(asMask(m), templates, tuning.maxDistance, tuning.minMargin, tuning.otherMargin);
		if (d === 'C') found.push({ x: (m.x0 + m.x1) / 2, beats: 4, beatType: 4, sign: 'C' });
		if (d === 'cut') found.push({ x: (m.x0 + m.x1) / 2, beats: 2, beatType: 2, sign: 'cut' });
	}
	return found.sort((p, q) => p.x - q.x);
}

/**
 * Every time signature on one voice staff across the page: the staff found
 * near `y` from `probeX` (a note of the staff), then followed across the
 * page in stretches of twelve spaces, eight apart, each read by
 * `readSignatures`. Null where no staff is found there.
 */
export function readAlongStaff(
	page: GreyPage,
	y: number,
	probeX: number,
	templates: readonly TemplateMark[],
	tuning: Tuning = { maxDistance: MAX_DISTANCE, minMargin: MIN_MARGIN, otherMargin: OTHER_MARGIN },
): { space: number; signatures: Signature[] } | null {
	const probe = findStaff(page, probeX - 60, probeX + 60, y, 400) ?? findStaff(page, probeX - 200, probeX + 200, y, 400);
	if (!probe) return null;
	const space = probe.space;
	let centre = (probe.lines[0] + probe.lines[4]) / 2;
	const signatures: Signature[] = [];
	for (let x = 0; x < page.width; x += 8 * space) {
		const staff = findStaff(page, x, x + 12 * space, centre, 3 * space);
		if (!staff || Math.abs(staff.space - space) > 0.15 * space) continue;
		centre = (staff.lines[0] + staff.lines[4]) / 2;
		for (const s of readSignatures(page, staff, x, Math.min(page.width - 1, x + 12 * space), templates, tuning))
			if (!signatures.some((o) => Math.abs(o.x - s.x) < space)) signatures.push(s);
	}
	return { space, signatures: signatures.sort((a, b) => a.x - b.x) };
}

/** One of homr's systems on a page: its bars (counted from 0 on the page) and the places of their notes. */
export interface PageSystem {
	bars: { measure: number; xs: number[]; ys: number[] }[];
}

/** The voice's systems on one page of homr's MusicXML: its first part, broken where homr prints a new system. */
export function systemsOf(pageXml: string): PageSystem[] {
	const part = /<part id="([^"]*)">([\s\S]*?)<\/part>/.exec(pageXml)?.[2];
	if (!part) return [];
	const systems: PageSystem[] = [];
	let i = 0;
	for (const m of part.matchAll(/<measure[\s>][\s\S]*?<\/measure>|<measure[^>]*\/>/g)) {
		if (i === 0 || /<print\s[^>]*new-system="yes"/.test(m[0])) systems.push({ bars: [] });
		// The voice's own notes: staff 1, or no staff named.
		const notes = [...m[0].matchAll(/<note[\s>][\s\S]*?<\/note>/g)].map((n) => n[0]).filter((n) => !/<staff>\s*[2-9]/.test(n));
		const at = notes.flatMap((n) => {
			const p = /imgpos:\s*(\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?)/.exec(n);
			return p ? [{ x: Number(p[1]), y: Number(p[2]) }] : [];
		});
		systems[systems.length - 1].bars.push({ measure: i, xs: at.map((p) => p.x), ys: at.map((p) => p.y) });
		i++;
	}
	return systems;
}

/**
 * The bar a signature read at `x` on a system stands at the start of: the
 * first bar whose first note lies after it, where the bar before it on the
 * system (if any) ends before it. Null where no bar fits (a signature after the
 * system's last note is a courtesy for the next system, and is not this one's).
 */
export function barAt(system: PageSystem, x: number): number | null {
	const placed = system.bars.filter((b) => b.xs.length > 0);
	for (let j = 0; j < placed.length; j++) {
		const prev = placed[j - 1];
		if (Math.min(...placed[j].xs) > x && (!prev || Math.max(...prev.xs) < x)) return placed[j].measure;
	}
	return null;
}
