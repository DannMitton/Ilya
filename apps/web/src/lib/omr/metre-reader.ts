/**
 * Reading a printed time signature (QUEUE row 57): what one window of the
 * voice staff states, or nothing.
 *
 * A port of round 5's reader as round 6 ships it (`decode5.py`,
 * `reading5.py`, `checks5.py`, and run 1's guard, in
 * `docs/sessions/measure-metre-r57-r6_2026-10-11/`). A small network (network
 * A) names what stands at each of three seats, every fifth of a staff space
 * along the window: a digit in the upper or lower half of the staff, or C or
 * cut C on the middle line, or nothing. That is done nine times, with the
 * window's grid moved a tenth of a space either way and the page magnified
 * 0.95, 1, and 1.05 times. Each reading gives at most one statement; a
 * signature is stated only when all nine give the same one, and then only
 * when three checks on the plain reading pass, and, for a signature with a
 * rival of the same bar length, only when it beats that rival by a margin in
 * all nine.
 *
 * A false signature is worse than a missed one, so anything less states
 * nothing. This module never loads the network: the caller passes `classify`.
 */

/** A strip of the page at TEN pixels a staff space, greyscale, 0 black and 255 white. */
export interface Band {
	width: number;
	height: number;
	data: Uint8Array;
}

/** The network: for `n` crops of CROP by CROP ink (0 to 1), each crop's 13 class probabilities and 96 features. */
export type Classify = (ink: Float32Array, n: number) => Promise<{ probs: Float32Array; feats: Float32Array }>;

/** The settings run 1 set on the four tuning songs and the tuning renders. */
export interface MetreSettings {
	cut: number;
	centre: number;
	/** Unfamiliar shape: the greatest distance a stated mark may lie from the reference of its class. */
	dist: number;
	/** Uncovered ink: the run, in spaces, that voids a statement. */
	tau: number;
	/** C against cut C: a C above `cLow` or a cut C below `cutHigh` is void. */
	cLow: number;
	cutHigh: number;
	/** The same-length guard's margin. */
	margin: number;
}

/** The reference for unfamiliar shape: FEAT features a crop, float16 as read from the file, and each crop's class. */
export interface ShapeReference {
	feats: Float32Array;
	classes: Uint8Array;
}

export const SP = 10;
export const CROP = 32;
export const FEAT = 96;
export const CLASSES = 13;
/** Class indices: 0 to 9 the digits, then C, cut C, and nothing. */
export const C_SIGN = 10;
export const CUT_SIGN = 11;
export const NOTHING = 12;
export const STEP = 0.2;
const OFFSETS = [-0.1, 0, 0.1];
const SCALES = [0.95, 1, 1.05];
/** Readings in order: offsets outer, scales inner. The plain reading is the fifth. */
export const READINGS: readonly (readonly [number, number])[] = OFFSETS.flatMap((o) => SCALES.map((s) => [o, s] as const));
export const PLAIN = 4;
const LOWER_OK = new Set([1, 2, 4, 8, 16, 32]);
const PRES = 0.3;
const GAP = 0.8;
const NEAR = 0.45;
/** Features are kept for a place and seat where something is present at least this much. */
const KEEP_FEAT = 0.3;

/** The value as float16 holds it, back as a number: the Python reader stores probabilities and features so. */
export function toHalf(x: number): number {
	if (!Number.isFinite(x) || x === 0) return x;
	const a = Math.abs(x);
	if (a >= 65520) return Math.sign(x) * Infinity;
	const e = Math.max(Math.floor(Math.log2(a)), -14);
	const q = 2 ** (e - 10);
	let r = Math.round(a / q) * q;
	// round half to even, as numpy does
	const lo = Math.floor(a / q) * q;
	if (a - lo === q / 2) r = (Math.floor(a / q) % 2 === 0 ? lo : lo + q);
	return Math.sign(x) * r;
}

/**
 * Crops of CROP by CROP ink from the band, centred at (cx, cy) in its pixels,
 * the page magnified `s` times about each centre: output pixel i reads the
 * band at cx + (i - CROP/2) / s, bilinear, with ink 0 beyond the band. This is
 * PyTorch's grid_sample with align_corners false, as the Python reader cuts.
 */
export function cut(band: Band, cx: readonly number[], cy: readonly number[], s: number): Float32Array {
	const { width: W, height: H, data } = band;
	const out = new Float32Array(cx.length * CROP * CROP);
	const ink = (x: number, y: number) => (x < 0 || y < 0 || x >= W || y >= H ? 0 : 1 - data[y * W + x] / 255);
	for (let n = 0; n < cx.length; n++) {
		const base = n * CROP * CROP;
		for (let i = 0; i < CROP; i++) {
			const py = cy[n] + (i - CROP / 2) / s;
			const y0 = Math.floor(py);
			const fy = py - y0;
			for (let j = 0; j < CROP; j++) {
				const px = cx[n] + (j - CROP / 2) / s;
				const x0 = Math.floor(px);
				const fx = px - x0;
				out[base + i * CROP + j] =
					(1 - fy) * ((1 - fx) * ink(x0, y0) + fx * ink(x0 + 1, y0)) + fy * ((1 - fx) * ink(x0, y0 + 1) + fx * ink(x0 + 1, y0 + 1));
			}
		}
	}
	return out;
}

/** One reading of a window: at each place, each seat's probabilities, and the features kept. */
export interface Reading {
	xs: number[];
	/** probs[(i * 3 + seat) * CLASSES + class] */
	probs: Float32Array;
	feats: Map<string, Float32Array>;
}

/**
 * The nine readings of a window. `xs` are the places in spaces of the band
 * (band pixels over SP); `seats(x)` gives the three seat heights, in band
 * pixels, at place x.
 */
export async function readWindow(band: Band, xs: readonly number[], seats: (x: number) => readonly number[], classify: Classify): Promise<Reading[]> {
	const out: Reading[] = [];
	for (const [off, s] of READINGS) {
		const at = xs.map((x) => x + off);
		const cx: number[] = [];
		const cy: number[] = [];
		for (const x of at) {
			const ys = seats(x);
			for (let q = 0; q < 3; q++) {
				cx.push(x * SP);
				cy.push(ys[q]);
			}
		}
		const { probs, feats } = await classify(cut(band, cx, cy, s), cx.length);
		const P = new Float32Array(probs.length);
		for (let k = 0; k < probs.length; k++) P[k] = toHalf(probs[k]);
		const kept = new Map<string, Float32Array>();
		for (let n = 0; n < cx.length; n++) {
			if (1 - P[n * CLASSES + NOTHING] >= KEEP_FEAT) {
				const f = new Float32Array(FEAT);
				for (let k = 0; k < FEAT; k++) f[k] = toHalf(feats[n * FEAT + k]);
				kept.set(`${Math.floor(n / 3)},${n % 3}`, f);
			}
		}
		out.push({ xs: at, probs: P, feats: kept });
	}
	return out;
}

/** A mark: its seat, its place index, its class, its confidence, and its refined place (an index, fractional). */
export type Mark = [seat: number, index: number, cls: number, conf: number, at: number];
type Peak = [index: number, cls: number, conf: number, at: number];

export interface Candidate {
	/** The signature, as '3/4', 'C', or 'cut'; '?' where no answer can come of it. */
	lab: string;
	x: number;
	conf: number;
	off: number;
	marks: Mark[];
	/** Filled for the plain reading: unfamiliar shape's distance, uncovered ink, C against cut C. */
	dist?: number;
	unc?: [number, number][] | null;
	cr?: number;
}

function seatColumn(r: Reading, seat: number, cls: readonly number[]): { pres: Float32Array; sub: Float32Array[] } {
	const n = r.xs.length;
	const pres = new Float32Array(n);
	const sub: Float32Array[] = [];
	for (let i = 0; i < n; i++) {
		const row = new Float32Array(cls.length);
		let t = 0;
		for (let k = 0; k < cls.length; k++) {
			row[k] = r.probs[(i * 3 + seat) * CLASSES + cls[k]];
			t += row[k];
		}
		pres[i] = t;
		sub.push(row);
	}
	return { pres, sub };
}

/** The marks at one seat: the places where the classes' summed probability peaks, as decode5.peaks. */
export function peaks(r: Reading, seat: number, cls: readonly number[]): Peak[] {
	const { pres, sub } = seatColumn(r, seat, cls);
	const order = [...pres.keys()].sort((a, b) => pres[b] - pres[a] || a - b);
	const out: [number, number, number][] = [];
	for (const i of order) {
		if (pres[i] < PRES) break;
		let clash = false;
		for (const [j] of out) {
			const dd = Math.abs(i - j) * STEP;
			if (dd < NEAR) {
				clash = true;
				break;
			}
			if (dd < GAP) {
				const [a, b] = i < j ? [i, j] : [j, i];
				let min = Infinity;
				for (let k = a; k <= b; k++) min = Math.min(min, pres[k]);
				if (min >= 0.6 * Math.min(pres[i], pres[j])) {
					clash = true;
					break;
				}
			}
		}
		if (clash) continue;
		let arg = 0;
		for (let k = 1; k < cls.length; k++) if (sub[i][k] > sub[i][arg]) arg = k;
		out.push([i, cls[arg], sub[i][arg]]);
	}
	const ref: Peak[] = out.map(([i, c, q]) => {
		const a = Math.max(0, i - 2);
		const b = Math.min(pres.length, i + 3);
		let w = 0;
		let wx = 0;
		for (let k = a; k < b; k++) {
			w += pres[k];
			wx += k * pres[k];
		}
		return [i, c, q, wx / w];
	});
	return ref.sort((p, q) => p[0] - q[0] || p[1] - q[1] || p[2] - q[2] || p[3] - q[3]);
}

/** Marks no farther than 1.6 spaces apart, in runs. */
function group(pk: Peak[]): Peak[][] {
	const gs: Peak[][] = [];
	for (const q of pk) {
		const last = gs[gs.length - 1];
		if (last && (q[0] - last[last.length - 1][0]) * STEP <= 1.6) last.push(q);
		else gs.push([q]);
	}
	return gs;
}

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

/** Every candidate signature in one reading, as decode5.candidates. */
export function candidates(r: Reading): Candidate[] {
	const up = peaks(r, 0, DIGITS);
	const lo = peaks(r, 2, DIGITS);
	const mid = peaks(r, 1, [C_SIGN, CUT_SIGN]);
	const out: Candidate[] = [];
	const usedU = new Set<number>();
	for (const gl of group(lo)) {
		const xl0 = gl[0][0];
		const xl1 = gl[gl.length - 1][0];
		const gus = group(up.filter((q) => xl0 - 1.3 / STEP <= q[0] && q[0] <= xl1 + 1.3 / STEP));
		if (gus.length !== 1) {
			out.push({ lab: '?', x: r.xs[xl0], conf: 0, off: 0, marks: [] });
			continue;
		}
		const gu = gus[0];
		for (const q of gu) usedU.add(q[0]);
		const top = Number(gu.map((q) => q[1]).join(''));
		const bot = Number(gl.map((q) => q[1]).join(''));
		const logic = top >= 1 && LOWER_OK.has(bot) && gu.length <= 2 && gl.length <= 2;
		const mean = (g: Peak[]) => g.reduce((t, q) => t + q[3], 0) / g.length;
		const off = Math.abs(mean(gu) - mean(gl)) * STEP;
		const marks: Mark[] = [...gu.map((q): Mark => [0, q[0], q[1], q[2], q[3]]), ...gl.map((q): Mark => [2, q[0], q[1], q[2], q[3]])];
		out.push({
			lab: logic ? `${top}/${bot}` : '?',
			x: r.xs[xl0],
			conf: Math.min(...[...gu, ...gl].map((q) => q[2])),
			off,
			marks,
		});
	}
	for (const q of up) if (!usedU.has(q[0])) out.push({ lab: '?', x: r.xs[q[0]], conf: 0, off: 0, marks: [] });
	for (const q of mid) {
		if ([...up, ...lo].some((u) => Math.abs(u[0] - q[0]) * STEP < 1.0)) continue;
		out.push({ lab: q[1] === C_SIGN ? 'C' : 'cut', x: r.xs[q[0]], conf: q[2], off: 0, marks: [[1, q[0], q[1], q[2], q[3]]] });
	}
	return out;
}

/** One reading's statement, or null: exactly one sure candidate, and no unsure one within three spaces of it. */
export function state(cands: readonly Candidate[], cutAt: number, centre: number): Candidate | null {
	const good: Candidate[] = [];
	const unsure: Candidate[] = [];
	for (const c of cands) (c.lab !== '?' && c.conf >= cutAt && c.off <= centre ? good : unsure).push(c);
	if (good.length !== 1) return null;
	const g = good[0];
	if (unsure.some((u) => Math.abs(u.x - g.x) < 3)) return null;
	return g;
}

// ---- the checks (checks5.py), on the plain reading, in the band ----

/** Python's round: halves to even. */
function roundHalfEven(x: number): number {
	const r = Math.round(x);
	return Math.abs(x % 1) === 0.5 && r % 2 !== 0 ? r - 1 : r;
}

function markX(xs: readonly number[], at: number): number {
	const i = Math.floor(at);
	if (i >= xs.length - 1) return xs[xs.length - 1];
	if (at <= 0) return xs[0];
	return xs[i] + (at - i) * (xs[i + 1] - xs[i]);
}

/** Unfamiliar shape: the mean distance to the five nearest reference crops of the mark's class. */
export function nnDist(ref: ShapeReference, f: Float32Array | undefined, cls: number, k = 5): number {
	if (!f) return Infinity;
	const d: number[] = [];
	for (let n = 0; n < ref.classes.length; n++) {
		if (ref.classes[n] !== cls) continue;
		let t = 0;
		for (let j = 0; j < FEAT; j++) {
			const v = ref.feats[n * FEAT + j] - f[j];
			t += v * v;
		}
		d.push(Math.sqrt(t));
	}
	if (d.length === 0) return Infinity;
	d.sort((a, b) => a - b);
	const near = d.slice(0, k);
	return near.reduce((t, v) => t + v, 0) / near.length;
}

/** Column ink of the upper and lower seat rows over [x0, x1), staff-line rows left out, as checks5.profiles. */
function profiles(band: Band, L: readonly number[], x0: number, x1: number): { pu: Float64Array; pl: Float64Array; a: number } {
	const { width: W, height: H, data } = band;
	const a = Math.max(0, Math.trunc(x0));
	const b = Math.min(W, Math.trunc(x1));
	if (b <= a) return { pu: new Float64Array(0), pl: new Float64Array(0), a };
	const rows = (t: number, u: number) => {
		const r: number[] = [];
		for (let y = Math.ceil(t); y <= Math.floor(u); y++) if (y >= 0 && y < H && Math.min(...L.map((l) => Math.abs(y - l))) > 1.2) r.push(y);
		return r;
	};
	const prof = (rs: number[]) => {
		const p = new Float64Array(b - a);
		if (rs.length === 0) return p;
		for (let x = a; x < b; x++) {
			let n = 0;
			for (const y of rs) if (data[y * W + x] < 128) n++;
			p[x - a] = n / rs.length;
		}
		return p;
	};
	return { pu: prof(rows(L[0], L[2])), pl: prof(rows(L[2], L[4])), a };
}

/** Uncovered ink: (left, right) runs, each (upper, lower) in spaces of full-seat ink, or null. */
export function uncovered(band: Band, lines: (x: number) => readonly number[], xs: readonly number[], marks: readonly Mark[]): [number, number][] | null {
	const xm = marks.filter((m) => m[0] === 0 || m[0] === 2).map((m) => markX(xs, m[4]) * SP);
	if (xm.length === 0) return null;
	const c = xm.reduce((t, v) => t + v, 0) / xm.length;
	const L = lines(c / SP);
	const { pu, pl, a } = profiles(band, L, Math.min(...xm) - 2.6 * SP, Math.max(...xm) + 2.6 * SP);
	const both = pu.map((v, i) => Math.max(v, pl[i]));
	const cov = new Uint8Array(both.length);
	for (const x of xm) {
		const i0 = roundHalfEven(x - a);
		for (const step of [-1, 1]) {
			let i = i0;
			let miss = 0;
			while (i >= 0 && i < both.length && Math.abs(i - i0) <= 1.2 * SP) {
				if (both[i] > 0.02) {
					cov[i] = 1;
					miss = 0;
				} else {
					miss++;
					if (miss > 1) break;
				}
				i += step;
			}
		}
	}
	const on = [...cov.keys()].filter((i) => cov[i]);
	if (on.length === 0) return null;
	const s0 = on[0];
	const s1 = on[on.length - 1];
	const res: [number, number][] = [];
	for (const [start, step] of [[s0 - 1, -1], [s1 + 1, 1]]) {
		const m: number[] = [];
		for (const p of [pu, pl]) {
			let tot = 0;
			let gap = 0;
			let i = start;
			while (i >= 0 && i < p.length && Math.abs(i - start) <= 1.6 * SP) {
				if (p[i] > 0.02) {
					tot += p[i];
					gap = 0;
				} else {
					gap++;
					if (gap >= 0.25 * SP) break;
				}
				i += step;
			}
			m.push(tot / SP);
		}
		res.push([m[0], m[1]]);
	}
	return res;
}

export function uncoveredVoid(unc: [number, number][] | null | undefined, tau: number): boolean {
	if (!unc) return false;
	return unc.some(([mu, ml]) => Math.max(mu, ml) >= tau && Math.min(mu, ml) < tau / 3);
}

/** C against cut C: ink in a narrow column through the sign's middle, just above and below the staff. */
export function cutRatio(band: Band, lines: (x: number) => readonly number[], xs: readonly number[], mark: Mark): number {
	const { width: W, height: H, data } = band;
	const x = markX(xs, mark[4]) * SP;
	const L = lines(x / SP);
	const a = Math.max(0, Math.trunc(x - 1.5));
	const b = Math.min(W, Math.trunc(x + 2.5));
	const mean = (y0: number, y1: number): number | null => {
		y0 = Math.max(0, Math.min(H, y0));
		y1 = Math.max(0, Math.min(H, y1));
		if (y1 <= y0 || b <= a) return null;
		let n = 0;
		for (let y = y0; y < y1; y++) for (let xx = a; xx < b; xx++) if (data[y * W + xx] < 128) n++;
		return n / ((y1 - y0) * (b - a));
	};
	const up = mean(Math.max(0, Math.trunc(L[0] - 7)), Math.max(0, Math.trunc(L[0] - 2)));
	const dn = mean(Math.min(H, Math.trunc(L[4] + 3)), Math.min(H, Math.trunc(L[4] + 8)));
	const vals = [up, dn].filter((v): v is number => v !== null);
	return vals.length ? vals.reduce((t, v) => t + v, 0) / vals.length : 0;
}

// ---- the same-length guard ----

/** The bar length in quarters. Cut C is 2/2. */
export function lengthOf(lab: string): number {
	if (lab === 'C' || lab === 'cut') return 4;
	const [t, b] = lab.split('/').map(Number);
	return (4 * t) / b;
}

/** Signatures of the same length and the same marks: C against cut C; figures with as many digits a seat. */
export function rivals(lab: string): string[] {
	if (lab === 'C') return ['cut'];
	if (lab === 'cut') return ['C'];
	const [t, b] = lab.split('/');
	const len = (4 * Number(t)) / Number(b);
	const out: string[] = [];
	for (const b2 of [...LOWER_OK].sort((p, q) => p - q)) {
		const t2 = (len * b2) / 4;
		if (!Number.isInteger(t2) || t2 < 1) continue;
		if (String(t2).length === t.length && String(b2).length === b.length && !(String(t2) === t && String(b2) === b)) out.push(`${t2}/${b2}`);
	}
	return out;
}

function classesOf(lab: string): [number, number][] {
	if (lab === 'C') return [[1, C_SIGN]];
	if (lab === 'cut') return [[1, CUT_SIGN]];
	const [t, b] = lab.split('/');
	return [...[...t].map((c): [number, number] => [0, Number(c)]), ...[...b].map((c): [number, number] => [2, Number(c)])];
}

/** The least, over the readings' statements and every rival, of the stated class's probability less the rival's, where they differ. */
export function margin(readings: readonly Reading[], stated: readonly Candidate[], lab: string): number | null {
	const rv = rivals(lab);
	if (rv.length === 0) return null;
	let m = Infinity;
	const mine = classesOf(lab);
	readings.forEach((r, k) => {
		for (const other of rv) {
			const theirs = classesOf(other);
			mine.forEach(([seat, a], n) => {
				const b = theirs[n][1];
				if (a === b) return;
				const i = stated[k].marks[n][1];
				const p = r.probs.subarray((i * 3 + seat) * CLASSES, (i * 3 + seat + 1) * CLASSES);
				m = Math.min(m, p[a] - p[b]);
			});
		}
	});
	return m;
}

/** Why a window states nothing, for the console; or the signature. */
export type Verdict = { lab: string } | { lab: null; why: string };

/** The window's statement from its nine readings. */
export function decide(
	readings: readonly Reading[],
	band: Band,
	lines: (x: number) => readonly number[],
	settings: MetreSettings,
	ref: ShapeReference | null,
): Verdict {
	const stated: Candidate[] = [];
	for (const r of readings) {
		const g = state(candidates(r), settings.cut, settings.centre);
		if (!g) return { lab: null, why: 'a reading states nothing' };
		stated.push(g);
	}
	const lab = stated[0].lab;
	if (stated.some((g) => g.lab !== lab)) return { lab: null, why: 'the readings disagree' };
	const plain = stated[PLAIN];
	const r = readings[PLAIN];
	if (ref) {
		const d = Math.max(...plain.marks.map((m) => nnDist(ref, r.feats.get(`${m[1]},${m[0]}`), m[2])));
		if (d > settings.dist) return { lab: null, why: `unfamiliar shape (${lab})` };
	}
	if (lab === 'C' || lab === 'cut') {
		const cr = cutRatio(band, lines, r.xs, plain.marks[0]);
		if (lab === 'C' && cr > settings.cLow) return { lab: null, why: 'C with a stroke through it' };
		if (lab === 'cut' && cr < settings.cutHigh) return { lab: null, why: 'cut C without its stroke' };
	} else if (uncoveredVoid(uncovered(band, lines, r.xs, plain.marks), settings.tau)) {
		return { lab: null, why: `uncovered ink beside ${lab}` };
	}
	const m = margin(readings, stated, lab);
	if (m !== null && m < settings.margin) return { lab: null, why: `${lab} too near its same-length rival` };
	return { lab };
}
