/**
 * Triplets, and tuplets of any number, that homr read without their number: a check over homr's output.
 *
 * homr's transformer can read the notes under a bracketed 3 at their printed
 * shapes and leave out the 3. A half and a quarter under a 3 then come out as
 * a plain half and a plain quarter, three beats where the page has two, and
 * the bar no longer adds up to its metre. On *Sunless* 3 (Mussorgsky, IMSLP
 * 113877, PDF pages 5 to 8) homr read seven of the song's ten bars of
 * quarter-note triplets with no 3 at all, and in bars of eighth-note
 * triplets it marked the first triplets of a bar and not the last ones.
 *
 * Three rules, applied to one bar of the voice part at a time, and only where
 * the bar states no metre of its own (a printed change of metre is a reason
 * for a bar to be longer, so such a bar is left alone). The join counts a bar
 * as stating a metre wherever homr read a time signature in it, even one equal
 * to the metre in force: homr reads only a time signature's lower figure and
 * works out the upper one from the page's bar lengths, so a printed 3/2 can
 * come out as the 4/4 already in force (Kabalevsky op. 52 no. 9, bar 29):
 *
 * 1. A bar with no triplet in it, no dotted note, and written lengths that
 *    add up to exactly one and a half times the metre is read as triplets
 *    throughout. The reason a musician accepts: a bar cannot hold half as
 *    much again as its metre, and the one common way to print a whole bar of
 *    plain-looking halves, quarters, or eighths that fills the metre is under
 *    3s; a dotted note is left alone because dotted values under a 3 are rare
 *    and a dotted note is a sign of a longer metre instead.
 * 2. A bar that holds triplets and is too long is read with its other notes as
 *    triplets as well, when that, and nothing less, makes the bar exactly
 *    full. The reason: a run of triplets that homr marked runs on to the end
 *    of the bar on the page, and the bar adds up only if the rest of the run
 *    is triplets too.
 *
 * 3. A bar that is too long, and holds no other way to fill it, is read with
 *    runs of three notes as triplets when exactly one choice of such runs
 *    makes it exactly full. A run is three notes (or rests) side by side of
 *    one plain written value, none dotted, at least one of them not yet
 *    marked; it begins where the span of two such notes begins, counting
 *    from the start of the bar with the runs before it read as triplets.
 *    The reason a musician accepts: a bar cannot be longer than its metre; a
 *    3 that homr missed makes a bar too long by exactly a third of each run
 *    it covers; and a triplet fills the time of two of its notes, so it
 *    starts where two of them would. When two choices both fit, only the
 *    printed brackets could tell them apart, and they are not read here, so
 *    such a bar is left as homr wrote it. (Added on day 4, 2026-10-06, after
 *    *Sunless* 2, bar 9, where homr marked two of three quarter-note
 *    triplets and none of an eighth-note triplet before them.)
 *
 * Before the three rules, the page (QUEUE row 54, 2026-10-08; any number,
 * QUEUE row 56): where the caller can read the page image (`look`,
 * `tuplet-number.ts`), a bar that does not fit its metre is looked at once.
 * Each number read (n, and m where the page prints n:m) is matched to the run
 * of n notes of one plain value whose middle it stands over, within half a
 * note, and that run is made n in the space of m: the printed m, or else
 * `conventionalSpace` (a desk default, to be checked against Gould's Table
 * 2, p. 203). A bar too short is looked at too, because a missed duplet in
 * 6/8 leaves the bar short. Rules 2 and 3 work on any ratio (rule 3 on 3:2,
 * and on 2:3 and 4:3 in compound metre), and where the page has been read,
 * rule 3 chooses only among runs with a numeral-sized mark over their middle,
 * so where the page shows none (Gurilyov, bar 7, where homr read an eighth as
 * a quarter) rule 3 does not act, and where it reads three of four printed 3s
 * and shows the fourth (Gurilyov, bar 25) rule 3 completes the bar. A bar
 * with grace notes is left to the page, and to the rules only once the page
 * has been read. The reason: the goal is the rhythm the composer printed, not
 * a bar that adds up (Dann, 2026-10-08 15:50, `OPEN.md`, THE CORRECTIONS
 * REDESIGN, item 5).
 *
 * The bar check: whatever the page and the rules make of a bar is kept only
 * where the bar then fits its metre; otherwise the bar is left as homr wrote
 * it (the desk, row 56: "Where a read digit does not make the bar fit it,
 * change nothing").
 *
 * Nothing else is changed: a bar with a chord or a second voice (`<backup>`
 * or `<forward>`) is left as homr wrote it, and so is every bar that adds up
 * already.
 *
 * Each note made a tuplet gains homr's own form,
 * `<time-modification><actual-notes>n</actual-notes><normal-notes>m</normal-notes></time-modification>`,
 * after its `<type>` and `<dot/>`, and its `<duration>` becomes m/n of what
 * it was. Where that is not a whole number of divisions, every duration in
 * the bar is first multiplied by the least factor that makes it so, and the
 * bar opens with `<attributes><divisions>` that many times the divisions in
 * force; the caller restores the divisions at the next bar. No `<tuplet>`
 * bracket start or stop is written.
 *
 * Works on the text of one measure's children, as `join-pages.ts` does,
 * so it runs the same in the browser and in vitest.
 */

/** A fraction of a whole note, kept in lowest terms. */
interface Frac {
	n: number;
	d: number;
}

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));
const fr = (n: number, d: number): Frac => {
	const g = gcd(n, d) || 1;
	return { n: n / g, d: d / g };
};
const add = (a: Frac, b: Frac): Frac => fr(a.n * b.d + b.n * a.d, a.d * b.d);
const mul = (a: Frac, b: Frac): Frac => fr(a.n * b.n, a.d * b.d);
const eq = (a: Frac, b: Frac): boolean => a.n * b.d === b.n * a.d;
const gt = (a: Frac, b: Frac): boolean => a.n * b.d > b.n * a.d;
const ZERO: Frac = { n: 0, d: 1 };
const THREE_HALVES: Frac = { n: 3, d: 2 };

const TYPE: Record<string, Frac> = {
	breve: { n: 2, d: 1 },
	whole: { n: 1, d: 1 },
	half: { n: 1, d: 2 },
	quarter: { n: 1, d: 4 },
	eighth: { n: 1, d: 8 },
	'16th': { n: 1, d: 16 },
	'32nd': { n: 1, d: 32 },
	'64th': { n: 1, d: 64 },
};

/** The metre in force, as MusicXML states it: `<beats>` over `<beat-type>`. */
export interface Metre {
	beats: number;
	beatType: number;
}

/** Reads `<time><beats>3</beats><beat-type>8</beat-type></time>`, or null. */
export function readMetre(time: string | null): Metre | null {
	if (!time) return null;
	const beats = Number(/<beats>\s*(\d+)\s*<\/beats>/.exec(time)?.[1]);
	const beatType = Number(/<beat-type>\s*(\d+)\s*<\/beat-type>/.exec(time)?.[1]);
	return beats > 0 && beatType > 0 ? { beats, beatType } : null;
}

/** What `completeTriplets` did to one bar. */
export interface TripletResult {
	/** The children, changed or not. */
	children: string[];
	/** Which rule changed the bar (`page`: a 3 printed over the notes), or null when it was left alone. */
	rule: 1 | 2 | 3 | 'page' | null;
	/** The divisions the bar now runs in, when they had to change; else null. */
	divisions: number | null;
}

const TIMED = /^<(note|backup|forward)[\s>]/;
const isNote = (t: string): boolean => /^<note[\s>]/.test(t);

interface Read {
	written: Frac;
	/** The value of the note's `<type>`, before dots and any tuplet. */
	printed: Frac;
	dotted: boolean;
	/** The tuplet the note is already marked with, n in the space of m, or null. */
	ratio: Ratio | null;
}

/** A tuplet: n notes in the space of m of the same written value. */
export interface Ratio {
	n: number;
	m: number;
}

function readNote(note: string): Read | null {
	const type = /<type>\s*([^<\s]+)\s*<\/type>/.exec(note)?.[1];
	const base = type ? TYPE[type] : undefined;
	if (!base) return null;
	const dots = (note.match(/<dot\s*\/>/g) ?? []).length;
	let written = base;
	let part = base;
	for (let i = 0; i < dots; i++) {
		part = mul(part, { n: 1, d: 2 });
		written = add(written, part);
	}
	const tm = /<time-modification>([\s\S]*?)<\/time-modification>/.exec(note)?.[1];
	let ratio: Ratio | null = null;
	if (tm !== undefined) {
		const actual = Number(/<actual-notes>\s*(\d+)/.exec(tm)?.[1]);
		const normal = Number(/<normal-notes>\s*(\d+)/.exec(tm)?.[1]);
		if (!(actual > 0 && normal > 0)) return null;
		ratio = { n: actual, m: normal };
		written = mul(written, fr(normal, actual));
	}
	return { written, printed: base, dotted: dots > 0, ratio };
}

const sameRatio = (a: Ratio | null, b: Ratio | null): boolean => (a === null ? b === null : b !== null && a.n === b.n && a.m === b.m);
const TRIPLET_RATIO: Ratio = { n: 3, m: 2 };

/** True when `time` is a whole number of `span`s. */
const onMultipleOf = (time: Frac, span: Frac): boolean => (time.n * span.d) % (time.d * span.n) === 0;

/** True where the metre is compound: its beats a multiple of three, six or more (6/8, 9/8, 12/8, 6/4). */
export const compound = (metre: Metre): boolean => metre.beats % 3 === 0 && metre.beats >= 6;

/**
 * The space m that n notes of a tuplet fill, where the page prints n alone.
 * DESK DEFAULT, to be checked against Gould's Table 2 (p. 203), which this code
 * has not read: in simple metre, n in the space of the next lower power of two
 * (3:2, 5:4, 6:4, 7:4, 9:8, 10:8, 11:8, 12:8, 13:8, 14:8, 15:8), and no space for
 * a power of two itself (a duplet in simple metre is not a convention); in
 * compound metre, a duplet and a quadruplet in the space of three (2:3, 4:3),
 * and every other n as in simple metre.
 */
export function conventionalSpace(n: number, metre: Metre): number | null {
	if (n < 2) return null;
	if (compound(metre) && (n === 2 || n === 4)) return 3;
	if ((n & (n - 1)) === 0) return null;
	return 2 ** Math.floor(Math.log2(n));
}

/** n notes (or rests) side by side of one plain written value, none dotted, none already in another tuplet, at least one not yet marked. */
function isRun(run: readonly Read[], n: number, ratio: Ratio): boolean {
	if (run.length < n) return false;
	const value = run[0].printed;
	return (
		run.every((r) => !r.dotted && eq(r.printed, value) && (r.ratio === null || sameRatio(r.ratio, ratio))) &&
		run.some((r) => r.ratio === null)
	);
}

/**
 * Rule 3, for each ratio given: the first note and ratio of each run read as a
 * tuplet, when exactly one choice of runs makes the bar exactly `bar` long;
 * else null. A run of n in the space of m begins where the span of m of its
 * notes would begin.
 */
function onlyRunsThatFill(
	notes: readonly Read[],
	bar: Frac,
	ratios: readonly Ratio[],
	allowed: (start: number, ratio: Ratio) => boolean = () => true,
): { start: number; ratio: Ratio }[] | null {
	const found: { start: number; ratio: Ratio }[][] = [];
	const walk = (i: number, time: Frac, runs: { start: number; ratio: Ratio }[]): void => {
		if (found.length > 1 || gt(time, bar)) return;
		if (i === notes.length) {
			if (runs.length > 0 && eq(time, bar)) found.push(runs);
			return;
		}
		walk(i + 1, add(time, notes[i].written), runs);
		for (const ratio of ratios) {
			const run = notes.slice(i, i + ratio.n);
			if (!isRun(run, ratio.n, ratio) || !allowed(i, ratio)) continue;
			const span = mul(run[0].printed, { n: ratio.m, d: 1 });
			if (onMultipleOf(time, span)) walk(i + ratio.n, add(time, span), [...runs, { start: i, ratio }]);
		}
	};
	walk(0, ZERO, []);
	return found.length === 1 ? found[0] : null;
}

/**
 * What the page shows over the bar's notes (`tuplet-number.ts`), given the
 * notes' own text: each number read, with the space m where the page prints a
 * ratio, and `at`, where it stands, in notes (2 is over the third note, 2.5
 * halfway to the fourth); and `marksAt`, where every mark the size of a
 * numeral stands, whatever it reads as. Null where the page cannot be read.
 */
export interface PageReading {
	numbers: { n: number; m: number | null; at: number }[];
	marksAt: number[];
}
export type PageLook = (notes: readonly string[]) => PageReading | null;

/** The note with an n:m time-modification after its `<type>` and dots, and its duration scaled by `scale` and by m/n. */
function makeTuplet(note: string, scale: number, ratio: Ratio): string {
	const dur = Number(/<duration>\s*(\d+)\s*<\/duration>/.exec(note)?.[1]);
	let out = note.replace(/<duration>\s*\d+\s*<\/duration>/, `<duration>${(dur * scale * ratio.m) / ratio.n}</duration>`);
	const tm = `<time-modification><actual-notes>${ratio.n}</actual-notes><normal-notes>${ratio.m}</normal-notes></time-modification>`;
	out = out.replace(/(<type>[^<]*<\/type>(?:\s*<dot\s*\/>)*)/, `$1${tm}`);
	return out;
}

function scaleDuration(text: string, scale: number): string {
	if (scale === 1) return text;
	return text.replace(/<duration>\s*(\d+)\s*<\/duration>/, (_m, d) => `<duration>${Number(d) * scale}</duration>`);
}

/** The ratios rules 2 and 3 may read without the page: 3:2, and the duplet and quadruplet in compound metre. */
function ruleRatios(metre: Metre): Ratio[] {
	return compound(metre) ? [TRIPLET_RATIO, { n: 2, m: 3 }, { n: 4, m: 3 }] : [TRIPLET_RATIO];
}

/**
 * Applies the page and the three rules to one bar's children (each child a
 * whole element's text, as `join-pages.ts` keeps them). `metre` is the metre
 * in force in the bar, `divisions` the divisions in force, and `statesMetre`
 * whether the bar states a `<time>` of its own.
 */
export function completeTriplets(
	children: readonly string[],
	metre: Metre | null,
	divisions: number | null,
	statesMetre: boolean,
	look?: PageLook,
): TripletResult {
	const unchanged: TripletResult = { children: [...children], rule: null, divisions: null };
	if (!metre || !divisions || statesMetre) return unchanged;
	const timed = children.filter((t) => TIMED.test(t));
	if (timed.length === 0 || timed.some((t) => !isNote(t))) return unchanged;
	if (timed.some((t) => /<chord\s*\/>/.test(t))) return unchanged;
	// Grace notes take no time: the page may still mark the notes around them; rules 1 to 3 leave such a bar alone.
	const grace = timed.map((t) => /<grace[\s/>]/.test(t));
	const hasGrace = grace.some(Boolean);
	const sounding = timed.filter((_, i) => !grace[i]);
	const reads = sounding.map(readNote);
	if (reads.some((r) => r === null)) return unchanged;
	let notes = reads as Read[];
	const bar = fr(metre.beats, metre.beatType);
	let total = notes.reduce((s, r) => add(s, r.written), ZERO);
	// A bar that fits its metre is left alone. One too short is looked at on the page only (a duplet missed in 6/8 leaves the bar short); the rules act on one too long.
	if (notes.every((r) => r.ratio !== null) || eq(total, bar) || (!gt(total, bar) && !look)) return unchanged;
	let rule: 1 | 2 | 3 | 'page' | null = null;
	/** The ratio each note is made, by the page first, then by a rule. */
	const byPage: (Ratio | null)[] = notes.map(() => null);
	const reading = look ? look(sounding) : null;
	if (reading) {
		for (const number of [...reading.numbers].sort((a, b) => a.at - b.at)) {
			const m = number.m ?? conventionalSpace(number.n, metre);
			if (m === null) continue;
			const ratio = { n: number.n, m };
			// The run of n notes the number stands over: its middle nearest the number, within half a note.
			let best = -1;
			let bestOff = Number.POSITIVE_INFINITY;
			let tie = false;
			for (let s0 = 0; s0 + ratio.n <= notes.length; s0++) {
				if (byPage.slice(s0, s0 + ratio.n).some((r) => r !== null)) continue;
				if (!isRun(notes.slice(s0, s0 + ratio.n), ratio.n, ratio)) continue;
				const off = Math.abs(number.at - (s0 + (ratio.n - 1) / 2));
				if (off > 0.5 + 1e-9) continue;
				if (Math.abs(off - bestOff) < 1e-9) tie = true;
				else if (off < bestOff) ((best = s0), (bestOff = off), (tie = false));
			}
			if (best < 0 || tie) continue;
			for (let k = best; k < best + ratio.n; k++) if (notes[k].ratio === null) byPage[k] = ratio;
		}
		if (byPage.some((r) => r !== null)) {
			rule = 'page';
			notes = notes.map((r, i) => {
				const ratio = byPage[i];
				return ratio ? { ...r, written: mul(r.written, fr(ratio.m, ratio.n)), ratio } : r;
			});
			total = notes.reduce((s, r) => add(s, r.written), ZERO);
		}
	}
	const plain = notes.filter((r) => r.ratio === null);
	let change: (Ratio | null)[] = byPage.slice();
	// Grace notes keep the rules off a bar unless the page has been read over it.
	if ((!hasGrace || reading !== null) && plain.length > 0 && gt(total, bar)) {
		let completed: 1 | 2 | 3 | null = null;
		if (!plain.some((r) => r.dotted)) {
			const marked = notes.filter((r) => r.ratio !== null);
			if (marked.length === 0) {
				if (eq(total, mul(bar, THREE_HALVES))) {
					completed = 1;
					change = notes.map(() => TRIPLET_RATIO);
				}
			} else if (marked.every((r) => sameRatio(r.ratio, marked[0].ratio))) {
				const ratio = marked[0].ratio as Ratio;
				const sum = marked.reduce((s, r) => add(s, r.written), ZERO);
				const rest = plain.reduce((s, r) => add(s, r.written), ZERO);
				if (eq(add(sum, mul(rest, fr(ratio.m, ratio.n))), bar)) {
					completed = 2;
					change = notes.map((r, i) => byPage[i] ?? (r.ratio === null ? ratio : null));
				}
			}
		}
		if (completed === null) {
			// Where the page has been read over the bar, rule 3 chooses only among runs with
			// a mark the size of a numeral over their middle, where a printed number stands.
			const marked = (start: number, ratio: Ratio) =>
				reading === null || reading.marksAt.some((a) => Math.abs(a - (start + (ratio.n - 1) / 2)) <= 0.6);
			const runs = onlyRunsThatFill(notes, bar, ruleRatios(metre), marked);
			if (runs !== null) {
				completed = 3;
				change = notes.map((r, i) => {
					if (byPage[i]) return byPage[i];
					const run = runs.find((x) => i >= x.start && i < x.start + x.ratio.n);
					return run && r.ratio === null ? run.ratio : null;
				});
			}
		}
		if (completed !== null) rule = completed;
	}
	if (rule === null) return unchanged;
	// The bar check: whatever the page and the rules make of the bar is kept only where it then fits the metre.
	const after = notes.reduce((s, r, i) => add(s, change[i] && !byPage[i] ? mul(r.written, fr(change[i]!.m, change[i]!.n)) : r.written), ZERO);
	if (!eq(after, bar)) return unchanged;
	// Each changed duration times m/n must be a whole number of divisions: else every duration is multiplied first.
	let scale = 1;
	sounding.forEach((t, i) => {
		const ratio = change[i];
		if (!ratio) return;
		const d = Number(/<duration>\s*(\d+)\s*<\/duration>/.exec(t)?.[1]);
		const need = ratio.n / gcd(d * ratio.m, ratio.n);
		scale = (scale * need) / gcd(scale, need);
	});
	let k = 0;
	const out = children.map((t) => {
		if (!TIMED.test(t)) return t;
		if (/<grace[\s/>]/.test(t)) return t;
		const i = k++;
		const ratio = change[i];
		return ratio ? makeTuplet(t, scale, ratio) : scaleDuration(t, scale);
	});
	if (scale === 1) return { children: out, rule, divisions: null };
	const first = out.findIndex((t) => TIMED.test(t));
	out.splice(first, 0, `<attributes><divisions>${divisions * scale}</divisions></attributes>`);
	return { children: out, rule, divisions: divisions * scale };
}
