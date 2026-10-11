/**
 * Where a time signature can stand on the voice staff (QUEUE row 57), on the
 * page image homr read.
 *
 * Dann's placement rule (row 57 r4, "Dann's design"): a metre sits right of
 * the clef and key signature at a system's start, or right of a bar line mid
 * piece; look only there. homr gives each staff's box on the page
 * (`StaffBox`) but no staff lines and no bar lines, so both are found here
 * from the ink, inside the box, as round 4's harness found them
 * (`staff.py`, `windows.py`, in
 * `docs/sessions/measure-metre-r57-r6_2026-10-11/`):
 *
 * - the staff: five evenly spaced rows of ink, in strips 2 spaces wide
 *   (round 4's were 14, on deskewed pages), linked across the staff; its
 *   left and right ends where the five lines stop;
 * - a bar line: a thin stroke from the top line to the bottom line that does
 *   not go past the staff and has no notehead at an end;
 * - the windows: the system start, 15 spaces from the staff's left end, and
 *   after each bar line, 4.5 spaces or to the staff's end.
 *
 * Which staves are the voice's is homr's to say: a staff whose box holds a
 * note or rest of the first part (the part Ilya sings from). The page is not
 * deskewed, so the lines are followed along their slope.
 */
import type { Band } from './metre-reader';
import { SP } from './metre-reader';

/** A page image, greyscale, 0 black and 255 white. */
export interface Grey {
	width: number;
	height: number;
	data: Uint8Array;
}

/** homr's box for one staff, page-normalised (`third_party/homr-web/src/result.ts`, `StaffBox`). */
export interface StaffBoxLike {
	cx: number;
	cy: number;
	w: number;
	h: number;
	index: number;
}

const INK = 140;

/** A staff found in the ink: samples of its five lines along it, its space, and its ends. */
export interface Staff {
	xs: number[];
	ls: number[][];
	space: number;
	x0: number;
	x1: number;
}

/** A place to look. `x0` and `x1` are page pixels; `kind` is the system start or after a bar line. */
export interface MetreWindow {
	staff: Staff;
	box: number;
	kind: 'start' | 'bar';
	x0: number;
	x1: number;
	/** After the staff's last bar line, and how many spaces of staff follow it: a courtesy signature's place. */
	lastBar?: boolean;
	tail?: number;
}

function inkAt(g: Grey, x: number, y: number): boolean {
	return g.data[y * g.width + x] < INK;
}

/** Rows of ink across a strip: (centre, thickness) of each run of rows at least `frac` ink. */
function lineRows(g: Grey, x0: number, x1: number, y0: number, y1: number, frac: number): [number, number][] {
	const rows: [number, number][] = [];
	const n = y1 - y0;
	const on = new Uint8Array(n);
	for (let y = 0; y < n; y++) {
		let c = 0;
		for (let x = x0; x < x1; x++) if (inkAt(g, x, y0 + y)) c++;
		on[y] = c / (x1 - x0) >= frac ? 1 : 0;
	}
	let y = 0;
	while (y < n) {
		if (on[y]) {
			let e = y;
			while (e < n && on[e]) e++;
			rows.push([y0 + (y + e - 1) / 2, e - y]);
			y = e;
		} else y++;
	}
	return rows;
}

/** Five evenly spaced rows: each found staff as (line heights, space, thickness). */
function fives(rows: [number, number][]): { c: number[]; s: number; th: number }[] {
	const out: { c: number[]; s: number; th: number }[] = [];
	const used = new Set<number>();
	for (let i = 0; i < rows.length - 4; i++) {
		if (used.has(i)) continue;
		const c = [0, 1, 2, 3, 4].map((k) => rows[i + k][0]);
		const gaps = [1, 2, 3, 4].map((k) => c[k] - c[k - 1]);
		const s = gaps.reduce((t, v) => t + v, 0) / 4;
		if (s < 8 || s > 60) continue;
		if (gaps.every((d) => Math.abs(d - s) <= 0.18 * s)) {
			const th = Math.max(...[0, 1, 2, 3, 4].map((k) => rows[i + k][1]));
			if (th > 0.45 * s) continue;
			out.push({ c, s, th });
			for (let k = 0; k < 5; k++) used.add(i + k);
		}
	}
	return out;
}

function median(v: number[]): number {
	const s = [...v].sort((a, b) => a - b);
	const m = s.length >> 1;
	return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

function interp(x: number, xs: readonly number[], ys: readonly number[]): number {
	if (x <= xs[0]) return ys[0];
	if (x >= xs[xs.length - 1]) return ys[ys.length - 1];
	let i = 1;
	while (xs[i] < x) i++;
	return ys[i - 1] + ((x - xs[i - 1]) * (ys[i] - ys[i - 1])) / (xs[i] - xs[i - 1]);
}

/** The five line heights at column x, interpolated between samples. */
export function linesAt(st: Staff, x: number): number[] {
	return [0, 1, 2, 3, 4].map((k) => interp(x, st.xs, st.ls.map((l) => l[k])));
}

/**
 * The five line heights beyond the staff's first or last sample, carried on
 * along the lines' slope over the nearest eight samples (least squares): on a
 * page that is not deskewed, holding them flat loses the lines within a few
 * spaces.
 */
export function linesBeyond(st: Staff, x: number): number[] {
	const n = st.xs.length;
	if (n < 2 || (x >= st.xs[0] && x <= st.xs[n - 1])) return linesAt(st, x);
	const idx = x < st.xs[0] ? [...Array(Math.min(8, n)).keys()] : [...Array(Math.min(8, n)).keys()].map((i) => n - 1 - i);
	const mx = idx.reduce((t, i) => t + st.xs[i], 0) / idx.length;
	return [0, 1, 2, 3, 4].map((k) => {
		const my = idx.reduce((t, i) => t + st.ls[i][k], 0) / idx.length;
		let num = 0;
		let den = 0;
		for (const i of idx) {
			num += (st.xs[i] - mx) * (st.ls[i][k] - my);
			den += (st.xs[i] - mx) ** 2;
		}
		return my + (den > 0 ? num / den : 0) * (x - mx);
	});
}

/** The staff's left and right ends: where all five lines stop being ink. */
function extent(g: Grey, st: Staff): void {
	const ok = (x: number) => {
		let hit = 0;
		for (const y of linesBeyond(st, x)) {
			const yi = Math.round(y);
			if (yi < 0 || yi >= g.height) continue;
			let any = false;
			for (let yy = Math.max(0, yi - 1); yy < Math.min(g.height, yi + 2); yy++) if (inkAt(g, x, yy)) any = true;
			if (any) hit++;
		}
		return hit >= 5;
	};
	const walk = (start: number, step: number) => {
		let x = start;
		let end = start;
		let miss = 0;
		while (step < 0 ? x > 0 : x < g.width - 1) {
			x += step;
			if (ok(x)) {
				end = x;
				miss = 0;
			} else if (++miss > 0.6 * st.space) break;
		}
		return end;
	};
	st.x0 = walk(Math.trunc(st.xs[0]), -1);
	st.x1 = walk(Math.trunc(st.xs[st.xs.length - 1]), 1);
}

/**
 * Strips are this many spaces wide. Round 4 used 14 on deskewed pages; the
 * page homr reads is not deskewed, and a strip that wide holds a tilted line
 * across several rows, so the line is lost (Kabalevsky no. 10, page 1, tilts
 * 2 degrees: 4 pixels across a strip of 4 spaces). Two spaces keep a line
 * within its rows at the tilts seen in run 2 of round 6.
 */
const STRIP_SPACES = 2;

/**
 * The staff inside homr's box: the five lines found in strips across it, as
 * staff.find_staves does a page, kept to the rows of the box and a quarter of
 * its height either side; or null.
 */
export function staffIn(g: Grey, box: StaffBoxLike): Staff | null {
	const bx0 = Math.max(0, Math.floor((box.cx - box.w / 2) * g.width));
	const bx1 = Math.min(g.width, Math.ceil((box.cx + box.w / 2) * g.width));
	const pad = (box.h * g.height) / 4;
	const y0 = Math.max(0, Math.floor((box.cy - box.h / 2) * g.height - pad));
	const y1 = Math.min(g.height, Math.ceil((box.cy + box.h / 2) * g.height + pad));
	const W = bx1 - bx0;
	const sp: number[] = [];
	for (let x = bx0 + Math.trunc(W / 4); x < bx0 + Math.trunc((3 * W) / 4); x += Math.max(1, Math.trunc(W / 20))) {
		for (const f of fives(lineRows(g, x, Math.min(bx1, x + Math.max(8, Math.trunc(W / 40))), y0, y1, 0.5))) sp.push(f.s);
	}
	if (sp.length === 0) return null;
	const space = median(sp);
	const strip = Math.max(8, Math.trunc(STRIP_SPACES * space));
	const per: { xc: number; c: number[]; s: number }[] = [];
	for (let x = bx0; x < bx1 - Math.trunc(strip / 2); x += Math.trunc(strip / 2)) {
		const xe = Math.min(bx1, x + strip);
		for (const f of fives(lineRows(g, x, xe, y0, y1, 0.5))) per.push({ xc: (x + xe) / 2, c: f.c, s: f.s });
	}
	// homr's box holds one staff, so its staff is the line most candidates
	// fall on: a Theil-Sen line through their middle lines, and the candidates
	// within half a space of it. In strips this narrow, rows of a word above
	// the staff can pass for lines; their candidates stand a space or more off
	// the line and are left out (Kabalevsky no. 10, page 1, "semplice").
	const ok = per.filter((p) => Math.abs(p.s - space) < 0.2 * space);
	if (ok.length < 4) return null;
	const slopes: number[] = [];
	for (let i = 0; i < ok.length; i++) {
		for (let j = i + 1; j < ok.length; j++) if (ok[j].xc !== ok[i].xc) slopes.push((ok[j].c[2] - ok[i].c[2]) / (ok[j].xc - ok[i].xc));
	}
	if (slopes.length === 0) return null;
	const slope = median(slopes);
	const at = median(ok.map((p) => p.c[2] - slope * p.xc));
	const keep = new Map<number, { xc: number; c: number[]; s: number }>();
	for (const p of ok) {
		const off = Math.abs(p.c[2] - (at + slope * p.xc));
		if (off >= 0.5 * space) continue;
		const prev = keep.get(p.xc);
		if (!prev || off < Math.abs(prev.c[2] - (at + slope * prev.xc))) keep.set(p.xc, p);
	}
	const sm = [...keep.values()].sort((a, b) => a.xc - b.xc);
	if (sm.length < 4) return null;
	const best: Staff = { xs: sm.map((p) => p.xc), ls: sm.map((p) => p.c), space: median(sm.map((p) => p.s)), x0: 0, x1: 0 };
	extent(g, best);
	return best;
}

interface BarStroke {
	x0: number;
	x1: number;
	w: number;
	above: number;
	below: number;
	headTop: number;
	headBot: number;
}

function meanInk(g: Grey, ya: number, yb: number, xa: number, xb: number): number {
	ya = Math.max(0, ya);
	yb = Math.min(g.height, yb);
	xa = Math.max(0, xa);
	xb = Math.min(g.width, xb);
	if (yb <= ya || xb <= xa) return NaN;
	let n = 0;
	for (let y = ya; y < yb; y++) for (let x = xa; x < xb; x++) if (inkAt(g, x, y)) n++;
	return n / ((yb - ya) * (xb - xa));
}

/** The staff's slope at column x: rows per column, from its middle line four spaces either side. */
function slopeAt(st: Staff, x: number): number {
	return (linesBeyond(st, x + 4 * st.space)[2] - linesBeyond(st, x - 4 * st.space)[2]) / (8 * st.space);
}

/**
 * Strokes from the top line to the bottom line, square to the staff
 * (staff.barlines). On a tilted page a bar line tilts with the staff, so the
 * stroke through column x at the middle line is followed to column
 * x - (y - middle) * slope at row y, and a row counts where the stroke has
 * ink within a pixel of that column (scanned bar lines here are 1 to 2
 * pixels wide, and the slope is known to about a pixel over a staff's
 * height). On a level page a stroke is still the column, a pixel either side.
 */
export function strokes(g: Grey, st: Staff, minFrac = 0.97): BarStroke[] {
	const sp = st.space;
	const cols: number[] = [];
	for (let x = st.x0; x <= st.x1; x++) {
		const L = linesBeyond(st, x);
		const t = Math.round(L[0]);
		const b = Math.round(L[4]);
		const s = slopeAt(st, x);
		let n = 0;
		for (let y = t; y <= b; y++) {
			const xx = Math.round(x - (y - L[2]) * s);
			if (y < 0 || y >= g.height) continue;
			for (let d = -1; d <= 1; d++) {
				if (xx + d >= 0 && xx + d < g.width && inkAt(g, xx + d, y)) {
					n++;
					break;
				}
			}
		}
		if (n / (b - t + 1) >= minFrac) cols.push(x);
	}
	const runs: [number, number][] = [];
	for (const x of cols) {
		const last = runs[runs.length - 1];
		if (last && x - last[1] <= 1) last[1] = x;
		else runs.push([x, x]);
	}
	const out: BarStroke[] = [];
	for (const run of runs) {
		// the pixel's tolerance widened the run a column each side
		const [a, b] = run[1] - run[0] >= 2 ? [run[0] + 1, run[1] - 1] : run;
		const w = b - a + 1;
		if (w > 1.2 * sp) continue;
		const L = linesBeyond(st, Math.trunc((a + b) / 2));
		const t = L[0];
		const bo = L[4];
		const s = slopeAt(st, Math.trunc((a + b) / 2));
		// columns at row y, carried along the tilt
		const at = (y: number) => Math.round(-(y - L[2]) * s);
		const ya = t - 0.575 * sp;
		const yb = bo + 0.575 * sp;
		const above = t - sp > 0 ? meanInk(g, Math.trunc(t - 0.9 * sp), Math.trunc(t - 0.25 * sp), a + at(ya), b + 1 + at(ya)) : 0;
		const below = bo + sp < g.height ? meanInk(g, Math.trunc(bo + 0.25 * sp), Math.trunc(bo + 0.9 * sp), a + at(yb), b + 1 + at(yb)) : 0;
		const head = (y: number) => {
			const ya = Math.trunc(y - 0.5 * sp);
			const yb = Math.trunc(y + 0.5 * sp);
			const d = at(y);
			const l = meanInk(g, ya, yb, Math.max(0, a + d - Math.trunc(1.2 * sp)), a + d - 1);
			const r = meanInk(g, ya, yb, b + d + 2, b + d + Math.trunc(1.2 * sp));
			// Python's max(l, r): r only when r > l, so an empty side (NaN) on the left wins, as in staff.py
			return r > l ? r : l;
		};
		out.push({ x0: a, x1: b, w, above, below, headTop: head(t), headBot: head(bo) });
	}
	return out;
}

export function isBar(b: BarStroke, sp: number): boolean {
	const heavy = b.w >= 0.35 * sp;
	return b.above < 0.25 && b.below < 0.25 && (heavy || (b.headTop < 0.3 && b.headBot < 0.3));
}

/** The bar lines of a staff, past the system's opening line, a double bar line's strokes as one (its right edge). */
export function barLines(g: Grey, st: Staff): { x0: number; x1: number }[] {
	const sp = st.space;
	const merged: { x0: number; x1: number }[] = [];
	for (const b of strokes(g, st)) {
		if (!isBar(b, sp) || b.x0 <= st.x0 + 1.5 * sp) continue;
		const last = merged[merged.length - 1];
		if (last && b.x0 - last.x1 <= 1.2 * sp) merged[merged.length - 1] = { x0: last.x0, x1: b.x1 };
		else merged.push({ x0: b.x0, x1: b.x1 });
	}
	return merged;
}

/** The windows of one voice staff: its start, and after each bar line. */
export function windowsOf(g: Grey, st: Staff, box: number): MetreWindow[] {
	const sp = st.space;
	const out: MetreWindow[] = [{ staff: st, box, kind: 'start', x0: Math.trunc(st.x0), x1: Math.trunc(st.x0 + 15 * sp) }];
	const bars = barLines(g, st);
	bars.forEach((b, j) => {
		out.push({
			staff: st,
			box,
			kind: 'bar',
			x0: Math.trunc(b.x1 + 1),
			x1: Math.trunc(Math.min(st.x1 + 0.5 * sp, b.x1 + 4.5 * sp)),
			lastBar: j === bars.length - 1,
			tail: (st.x1 - b.x1) / sp,
		});
	});
	return out;
}

/** A courtesy signature's place: after the staff's last bar line, with under six spaces of staff left. */
export function isCourtesyPlace(w: MetreWindow): boolean {
	return w.kind === 'bar' && w.lastBar === true && (w.tail ?? Infinity) < 6;
}

/**
 * OpenCV's INTER_AREA shrink, one axis: for each output pixel, the source
 * pixels it covers and their weights (cv2's computeResizeAreaTab).
 */
function areaTab(src: number, dst: number): { idx: number[]; w: number[] }[] {
	const scale = src / dst;
	const tab: { idx: number[]; w: number[] }[] = [];
	for (let d = 0; d < dst; d++) {
		const f1 = d * scale;
		const f2 = f1 + scale;
		const cell = Math.min(scale, src - f1);
		const s1 = Math.ceil(f1);
		const s2 = Math.floor(f2);
		const idx: number[] = [];
		const w: number[] = [];
		if (s1 - f1 > 1e-3) {
			idx.push(s1 - 1);
			w.push((s1 - f1) / cell);
		}
		for (let s = s1; s < s2; s++) {
			idx.push(s);
			w.push(1 / cell);
		}
		if (f2 - s2 > 1e-3 && s2 < src) {
			idx.push(s2);
			w.push(Math.min(Math.min(f2 - s2, 1), cell) / cell);
		}
		tab.push({ idx, w });
	}
	return tab;
}

/** Rounds as cv2 does when it writes a byte: to nearest, halves to even. */
function toByte(v: number): number {
	const r = Math.round(v);
	const even = Math.abs(v % 1) === 0.5 && r % 2 !== 0 ? r - 1 : r;
	return Math.max(0, Math.min(255, even));
}

/**
 * The staff's band at SP pixels a space: rows from five spaces above its top
 * line to five below its bottom line, at the window's middle, shrunk as
 * cv2.resize(INTER_AREA) shrinks (pages5.band). Returns the band, the page
 * row it starts at, and the scale.
 */
export function bandOf(g: Grey, st: Staff): { band: Band; y0: number; k: number } {
	const Lm = linesAt(st, (st.x0 + st.x1) / 2);
	const y0 = Math.max(0, Math.trunc(Lm[0] - 5 * st.space));
	const y1 = Math.min(g.height, Math.trunc(Lm[4] + 5 * st.space));
	const k = SP / st.space;
	const W = Math.trunc(g.width * k);
	const H = Math.trunc((y1 - y0) * k);
	const tx = areaTab(g.width, W);
	const ty = areaTab(y1 - y0, H);
	const tmp = new Float64Array((y1 - y0) * W);
	for (let y = 0; y < y1 - y0; y++) {
		const row = (y0 + y) * g.width;
		for (let x = 0; x < W; x++) {
			const t = tx[x];
			let v = 0;
			for (let n = 0; n < t.idx.length; n++) v += g.data[row + t.idx[n]] * t.w[n];
			tmp[y * W + x] = v;
		}
	}
	const data = new Uint8Array(W * H);
	for (let y = 0; y < H; y++) {
		const t = ty[y];
		for (let x = 0; x < W; x++) {
			let v = 0;
			for (let n = 0; n < t.idx.length; n++) v += tmp[t.idx[n] * W + x] * t.w[n];
			data[y * W + x] = toByte(v);
		}
	}
	return { band: { width: W, height: H, data }, y0, k };
}

/** A window's places, in spaces of the band, and its seat heights and staff lines in band pixels. */
export function placesOf(w: MetreWindow, y0: number, k: number): { xs: number[]; seats: (x: number) => number[]; lines: (x: number) => number[] } {
	const sp = w.staff.space;
	const xs: number[] = [];
	// np.arange(x0, x1, STEP * space) / space * space * k / SP
	const n = Math.max(0, Math.ceil((w.x1 - w.x0) / (0.2 * sp)));
	for (let i = 0; i < n; i++) xs.push(((w.x0 + i * 0.2 * sp) * k) / SP);
	const lines = (x: number) => linesBeyond(w.staff, (x * SP) / k).map((l) => (l - y0) * k);
	return { xs, seats: (x: number) => lines(x).slice(1, 4), lines };
}
