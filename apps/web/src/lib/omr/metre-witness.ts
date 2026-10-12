/**
 * Seen and summed (QUEUE row 57): which time signatures the reader saw on the
 * page are stated in the join, and why the others are not.
 *
 * The time-signature reader (`metre-model.ts`) says what each window of the
 * voice staff prints. A signature it sees is a proposal; the join states it
 * only when the bars it governs agree (Dann's design of 2026-10-02 01:06,
 * `OPEN.md` N.178 item 11: "the simple arithmetic of the contents of a
 * confirmed bar to weigh against that audition as a sanity check"). Neither
 * half decides alone.
 *
 * - **Where.** A window's statement belongs to the bar whose notes begin at or
 *   right of the window's left edge on that staff: of the page's bars with a
 *   note or rest on the staff, the one whose leftmost such note stands
 *   furthest left, not more than half a space before the window. A courtesy
 *   signature (after a staff's last bar line, `isCourtesyPlace`) is set aside:
 *   the next system restates it.
 * - **The span.** A proposal governs the bars from its own to the next
 *   proposal's, or to the song's end (persistence: a printed metre holds
 *   until the next is printed; Dann 2026-10-08 21:12, `OPEN.md`, METRE
 *   CHANGES, item 1).
 * - **The sums (witness 5, bounded; brief r6 section 1.7).** Of the bars it
 *   governs, the first four countable ones are summed; at least two must be
 *   countable, and every one must add up to the proposal. A bar is countable
 *   unless it holds no note and no rest, or it is short and is the song's
 *   first or last bar, or ends at or before a repeat or a double bar line
 *   (the anacrusis and the bar that completes it; Dann 2026-10-05 00:52,
 *   `OPEN.md` N.178 item 22). The sums are taken from the join's own bars,
 *   after the tuplet checks have run under the proposal (`triplets.ts`); a
 *   bar those checks changed from homr's notes alone is not counted
 *   (`witness`).
 * - **One bar between two printed signatures (the desk, 2026-10-11,
 *   DESK DEFAULT).** A change printed for one bar, where the next bar prints
 *   a return to the metre before it (Kabalevsky op. 52 no. 6, bars 20 to 22),
 *   governs one bar only; it is stated when that bar is countable and adds up
 *   to it. A return is a signature of the same length as the metre before.
 * - **A return the reader did not see (QUEUE row 77, 2026-10-11).** Where
 *   the first countable bars, two or more, add up to the proposal, and the
 *   next countable bar adds up to the metre in force before it, the change
 *   is printed for those bars only, and the page returns to the metre before
 *   it at that bar with a signature the reader did not see (Rimsky-Korsakov
 *   op. 8 no. 2, «Ночь»: two bars of 3/2 in C, twice; the reader saw both
 *   3/2s and neither C). The proposal is stated for those bars, and homr's
 *   metre takes over again at the return (`until`). A bar cannot add up to
 *   two metres of different lengths, so the bar names the return.
 *
 * Bar lengths are in quarter notes. Cut C is 2/2, four quarters.
 */

/** A window of the voice staff, read: where it is on its page image and what it states. */
export interface MetreSeen {
	/** Left edge, page pixels. */
	x0: number;
	/** The staff's top and bottom lines at the window, page pixels. */
	top: number;
	bottom: number;
	space: number;
	/** '3/4', 'C', 'cut', or null where the reader states nothing. */
	lab: string | null;
	/** Why nothing is stated, for the console. */
	why: string | null;
	courtesy: boolean;
	/** A system start, not a window after a bar line. */
	start: boolean;
}

/** A proposal placed on a bar of the join. */
export interface Proposal {
	/** 0-based bar of the joined song. */
	bar: number;
	lab: string;
	page: number;
}

/** A fraction, in lowest terms. */
export interface Q {
	n: number;
	d: number;
}

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));
const q = (n: number, d: number): Q => {
	const g = gcd(n, d) || 1;
	return d < 0 ? { n: -n / g, d: -d / g } : { n: n / g, d: d / g };
};
const qAdd = (a: Q, b: Q): Q => q(a.n * b.d + b.n * a.d, a.d * b.d);
export const qEq = (a: Q, b: Q): boolean => a.n * b.d === b.n * a.d;
const qLt = (a: Q, b: Q): boolean => a.n * b.d < b.n * a.d;

/** A signature's bar length in quarters. Cut C is 2/2. */
export function lengthOf(lab: string): Q {
	if (lab === 'C' || lab === 'cut') return q(4, 1);
	const [t, b] = lab.split('/').map(Number);
	return q(4 * t, b);
}

/** The MusicXML `<time>` for a signature. */
export function timeElement(lab: string): string {
	if (lab === 'C') return '<time symbol="common"><beats>4</beats><beat-type>4</beat-type></time>';
	if (lab === 'cut') return '<time symbol="cut"><beats>2</beats><beat-type>2</beat-type></time>';
	const [t, b] = lab.split('/');
	return `<time><beats>${t}</beats><beat-type>${b}</beat-type></time>`;
}

/** A `<time>` element's signature, or null. */
export function labelOf(time: string | null): string | null {
	if (!time) return null;
	const sym = /symbol="(common|cut)"/.exec(time)?.[1];
	if (sym) return sym === 'common' ? 'C' : 'cut';
	const t = /<beats>\s*(\d+)\s*<\/beats>\s*<beat-type>\s*(\d+)\s*<\/beat-type>/.exec(time);
	return t ? `${t[1]}/${t[2]}` : null;
}

const imgpos = /imgpos:\s*(\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?)/g;

/**
 * The bar of the page (0-based among `measures`, homr's first part) that a
 * window's statement belongs to, or null. After a bar line: the bar whose
 * leftmost note on the staff stands furthest left at or right of the window
 * (w5map.first_bar in round 5). At a system start: the first bar, in order,
 * with a note or rest on the staff, because every bar of the system stands
 * right of its start, and homr places a whole rest anywhere in its bar
 * (Kabalevsky op. 52 no. 6, page 1: bar 1's rest stands right of bar 2's).
 */
export function barOfWindow(measures: readonly string[], w: MetreSeen): number | null {
	let best: [number, number] | null = null;
	measures.forEach((m, i) => {
		let mx = Infinity;
		for (const p of m.matchAll(imgpos)) {
			const x = Number(p[1]);
			const y = Number(p[2]);
			if (y >= w.top - 4 * w.space && y <= w.bottom + 4 * w.space) mx = Math.min(mx, x);
		}
		if (mx === Infinity || mx < w.x0 - 0.5 * w.space) return;
		if (w.start ? !best : !best || mx < best[0]) best = [mx, i];
	});
	return best ? (best as [number, number])[1] : null;
}

/** What witness 5 needs of one joined bar. */
export interface BarFacts {
	len: Q;
	notes: number;
	/** The bar ends at or holds a double bar line or a repeat. */
	breaks: boolean;
	/** The bar holds a repeat sign: a short bar before it completes an anacrusis. */
	repeat: boolean;
}

const BREAK = /<bar-style>\s*(light-light|light-heavy|heavy-light|heavy-heavy)\s*<\/bar-style>|<repeat[\s/>]/;

/**
 * Each joined bar's length and notes, as round 5's w5map.bars counts them:
 * the voice's notes and rests on voice 1, not grace notes, cue notes, or the
 * later notes of a chord, by their `<duration>` over the divisions in force.
 */
export function barFacts(measures: readonly string[]): BarFacts[] {
	let div: number | null = null;
	return measures.map((m) => {
		let len = q(0, 1);
		let notes = 0;
		// the divisions in force where each note stands: a bar can restate them before its notes (`triplets.ts`)
		const parts = m.split(/(?=<note[\s>])|(?=<attributes>)/);
		for (const p of parts) {
			const d = /^<attributes>[\s\S]*?<divisions>\s*(\d+)\s*<\/divisions>/.exec(p);
			if (d) div = Number(d[1]);
			if (!/^<note[\s>]/.test(p)) continue;
			const note = p.slice(0, p.indexOf('</note>') + 7);
			if (/<grace[\s/>]|<chord[\s/>]|<cue[\s/>]/.test(note)) continue;
			const v = /<voice>\s*(\d+)\s*<\/voice>/.exec(note);
			if (v && v[1] !== '1') continue;
			const du = /<duration>\s*(\d+)\s*<\/duration>/.exec(note);
			if (du && div) {
				len = qAdd(len, q(Number(du[1]), div));
				notes++;
			}
		}
		return { len, notes, breaks: BREAK.test(m), repeat: /<repeat[\s/>]/.test(m) };
	});
}

/** Round 5's countable bar (w5.countable). */
export function countable(bars: readonly BarFacts[], i: number, L: Q): boolean {
	const b = bars[i];
	if (b.notes === 0) return false;
	if (qLt(b.len, L)) {
		if (i === 0 || i === bars.length - 1) return false;
		if (b.breaks) return false;
		if (i + 1 < bars.length && bars[i + 1].repeat) return false;
	}
	return true;
}

/** The verdict on one proposal, with its reason for the console. */
export interface Verdict {
	stated: boolean;
	why: string;
	/** Where a stated proposal ends early: the bar of a return the reader did not see. */
	until?: number;
}

/**
 * Witness 5 on one proposal: `span` the bars it governs, `before` the metre in
 * force before it, `next` the next proposal's signature when that proposal is
 * on the very next bar, and `guessed` the bars the tuplet checks changed under
 * the proposal from homr's notes alone (rules 1 to 3 of `triplets.ts`), which
 * are not counted for it or against it (DESK DEFAULT, run 3 of round 6): run
 * under a signature two thirds as long as the page's, rule 1 reads every bar
 * as triplets and the bars then add up to it, so a wrong proposal would pass.
 * A bar changed because a printed number was read counts.
 */
export function witness(
	bars: readonly BarFacts[],
	span: readonly number[],
	lab: string,
	before: string | null,
	next: string | null,
	guessed: ReadonlySet<number> = new Set(),
): Verdict {
	const L = lengthOf(lab);
	const counted = span.filter((i) => countable(bars, i, L) && !guessed.has(i));
	const show = (i: number) => `bar ${i + 1} holds ${bars[i].len.n}/${bars[i].len.d}`;
	if (span.length === 1 && next !== null && before !== null && qEq(lengthOf(next), lengthOf(before))) {
		if (counted.length === 1 && qEq(bars[span[0]].len, L)) return { stated: true, why: `one bar, between printed signatures, adds up to ${lab}` };
		return { stated: false, why: counted.length === 0 ? `its one bar cannot be counted` : `${show(span[0])} quarters, not ${L.n}/${L.d}` };
	}
	const first = counted.slice(0, 4);
	if (first.length < 2) return { stated: false, why: `${first.length} countable bar${first.length === 1 ? '' : 's'} before the next signature, not 2` };
	const off = first.find((i) => !qEq(bars[i].len, L));
	if (off !== undefined) {
		const summed = counted.slice(0, counted.indexOf(off));
		if (summed.length >= 2 && before !== null && !qEq(lengthOf(before), L) && qEq(bars[off].len, lengthOf(before))) {
			return { stated: true, why: `${summed.length} bars add up to ${lab}; ${show(off)} quarters, the metre before it: a return not seen`, until: off };
		}
		return { stated: false, why: `${show(off)} quarters, not ${L.n}/${L.d}` };
	}
	return { stated: true, why: `${first.length} bars add up to ${lab}` };
}
