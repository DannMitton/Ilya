/**
 * Triplets that homr read without their bracket: a check over homr's output.
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
 * Nothing else is changed: a bar with a chord, a grace note, a second voice
 * (`<backup>` or `<forward>`), or a tuplet other than 3 in the time of 2 is
 * left as homr wrote it, and so is every bar that adds up already.
 *
 * Each note made a triplet gains homr's own form,
 * `<time-modification><actual-notes>3</actual-notes><normal-notes>2</normal-notes></time-modification>`,
 * after its `<type>` and `<dot/>`, and its `<duration>` becomes two thirds of
 * what it was. Where two thirds of a duration is not a whole number of
 * divisions, every duration in the bar is first multiplied by 3 and the bar
 * opens with `<attributes><divisions>` three times the divisions in force;
 * the caller restores the divisions at the next bar. No `<tuplet>` bracket
 * start or stop is written, because where each group of three begins is not
 * read from the page.
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
const TWO_THIRDS: Frac = { n: 2, d: 3 };
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
	/** Which rule changed the bar, or null when it was left alone. */
	rule: 1 | 2 | 3 | null;
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
	tuplet: 'none' | '3:2' | 'other';
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
	let tuplet: Read['tuplet'] = 'none';
	if (tm !== undefined) {
		const actual = Number(/<actual-notes>\s*(\d+)/.exec(tm)?.[1]);
		const normal = Number(/<normal-notes>\s*(\d+)/.exec(tm)?.[1]);
		tuplet = actual === 3 && normal === 2 ? '3:2' : 'other';
		if (actual > 0 && normal > 0) written = mul(written, fr(normal, actual));
	}
	return { written, printed: base, dotted: dots > 0, tuplet };
}

/** True when `time` is a whole number of `span`s. */
const onMultipleOf = (time: Frac, span: Frac): boolean => (time.n * span.d) % (time.d * span.n) === 0;

/**
 * Rule 3: the first note of each run of three that is read as triplets, when
 * exactly one choice of runs makes the bar exactly `bar` long; else null.
 */
function onlyRunsThatFill(notes: readonly Read[], bar: Frac): number[] | null {
	const found: number[][] = [];
	const walk = (i: number, time: Frac, runs: number[]): void => {
		if (found.length > 1 || gt(time, bar)) return;
		if (i === notes.length) {
			if (runs.length > 0 && eq(time, bar)) found.push(runs);
			return;
		}
		walk(i + 1, add(time, notes[i].written), runs);
		const run = notes.slice(i, i + 3);
		if (run.length < 3) return;
		const value = run[0].printed;
		const isRun =
			run.every((r) => !r.dotted && eq(r.printed, value) && r.tuplet !== 'other') && run.some((r) => r.tuplet === 'none');
		const span = mul(value, { n: 2, d: 1 });
		if (isRun && onMultipleOf(time, span)) walk(i + 3, add(time, span), [...runs, i]);
	};
	walk(0, ZERO, []);
	return found.length === 1 ? found[0] : null;
}

const TRIPLET =
	'<time-modification><actual-notes>3</actual-notes><normal-notes>2</normal-notes></time-modification>';

/** The note with a 3:2 time-modification after its `<type>` and dots, and its duration scaled. */
function makeTriplet(note: string, scale: number): string {
	const dur = Number(/<duration>\s*(\d+)\s*<\/duration>/.exec(note)?.[1]);
	let out = note.replace(/<duration>\s*\d+\s*<\/duration>/, `<duration>${(dur * scale * 2) / 3}</duration>`);
	const after = /(<type>[^<]*<\/type>(?:\s*<dot\s*\/>)*)/;
	out = out.replace(after, `$1${TRIPLET}`);
	return out;
}

function scaleDuration(text: string, scale: number): string {
	if (scale === 1) return text;
	return text.replace(/<duration>\s*(\d+)\s*<\/duration>/, (_m, d) => `<duration>${Number(d) * scale}</duration>`);
}

/**
 * Applies the three rules to one bar's children (each child a whole element's
 * text, as `join-pages.ts` keeps them). `metre` is the metre in force in the
 * bar, `divisions` the divisions in force, and `statesMetre` whether the bar
 * states a `<time>` of its own.
 */
export function completeTriplets(
	children: readonly string[],
	metre: Metre | null,
	divisions: number | null,
	statesMetre: boolean,
): TripletResult {
	const unchanged: TripletResult = { children: [...children], rule: null, divisions: null };
	if (!metre || !divisions || statesMetre) return unchanged;
	const timed = children.filter((t) => TIMED.test(t));
	if (timed.length === 0 || timed.some((t) => !isNote(t))) return unchanged;
	if (timed.some((t) => /<chord\s*\/>|<grace[\s/>]/.test(t))) return unchanged;
	const reads = timed.map(readNote);
	if (reads.some((r) => r === null || r.tuplet === 'other')) return unchanged;
	const notes = reads as Read[];
	const bar = fr(metre.beats, metre.beatType);
	const total = notes.reduce((s, r) => add(s, r.written), ZERO);
	const plain = notes.filter((r) => r.tuplet === 'none');
	if (plain.length === 0) return unchanged;
	let rule: 1 | 2 | 3 | null = null;
	/** Which notes become triplets. */
	let change = notes.map((r) => r.tuplet === 'none');
	if (!plain.some((r) => r.dotted)) {
		if (plain.length === notes.length) {
			if (eq(total, mul(bar, THREE_HALVES))) rule = 1;
		} else if (gt(total, bar)) {
			const marked = notes.filter((r) => r.tuplet === '3:2').reduce((s, r) => add(s, r.written), ZERO);
			const rest = plain.reduce((s, r) => add(s, r.written), ZERO);
			if (eq(add(marked, mul(rest, TWO_THIRDS)), bar)) rule = 2;
		}
	}
	if (rule === null && gt(total, bar)) {
		const runs = onlyRunsThatFill(notes, bar);
		if (runs !== null) {
			rule = 3;
			change = notes.map((r, i) => r.tuplet === 'none' && runs.some((start) => i >= start && i < start + 3));
		}
	}
	if (rule === null) return unchanged;
	// Two thirds of each changed duration must be a whole number of divisions.
	const fits = timed.every((t, i) => {
		if (!change[i]) return true;
		const d = Number(/<duration>\s*(\d+)\s*<\/duration>/.exec(t)?.[1]);
		return Number.isInteger(d) && (d * 2) % 3 === 0;
	});
	const scale = fits ? 1 : 3;
	let k = 0;
	const out = children.map((t) => {
		if (!TIMED.test(t)) return t;
		const i = k++;
		return change[i] ? makeTriplet(t, scale) : scaleDuration(t, scale);
	});
	if (scale === 1) return { children: out, rule, divisions: null };
	const first = out.findIndex((t) => TIMED.test(t));
	out.splice(first, 0, `<attributes><divisions>${divisions * 3}</divisions></attributes>`);
	return { children: out, rule, divisions: divisions * 3 };
}
