/**
 * WHAT ILYA CAN OFFER FOR A BAR TO CONFIRM. Corrections slice 2, QUEUE row 51.
 *
 * `barsToConfirm` names the bars whose written length differs from the metre in
 * force. This reads one of them and lists what Ilya could ask the singer about
 * it, in order of kind: one note's length ("Is the half note dotted in your
 * score?"), then a tuplet ("Does A or B match a triplet in your score?"), then
 * nothing. It asks; it never repairs. The page is the authority, not the
 * arithmetic (Dann, 2026-10-08 15:50), so this changes no note, stores nothing,
 * and carries no string a singer sees. `rejected` is plain words for a report.
 *
 * EQUALITY IS EXACT. Each event's `duration.fraction` is summed as a fraction
 * in lowest terms and compared with `beats/beatType`. No epsilon.
 *
 * KIND 1, ONE NOTE'S LENGTH. A candidate is one event (a note or a rest) that
 * carries no tuplet. Four changes, each tried alone: add a dot to an undotted
 * note; remove the dot from a note with exactly one; step the printed type one
 * rung longer or shorter along `TUPLET_VALUES`, stopping at `16th` and `whole`
 * (`stepValue` wraps, so it is not used). A change is a candidate where it
 * makes the bar equal its metre. An offer is made only where exactly one such
 * change exists (DESK DEFAULT: two or more ask the singer a question the page
 * cannot answer in one look); otherwise all are reported and none is offered.
 *
 * KIND 2, A TUPLET. A run is n consecutive events of one printed type, none
 * dotted, none under a tuplet, n being the ratio's n; a rest may stand in a
 * run. Its span is m of its notes, and it begins at a time from the bar's
 * start that is a whole number of spans, so no run straddles a beat. One run at
 * a time: a bar that fits only under two runs is not offered, and says so.
 * Ratios: 3:2 in any metre; 2:3 and 4:3 in compound metre; 4:3 in simple metre
 * only where `beats` is 3 (DESK DEFAULT, the desk's reading of Dann,
 * 2026-10-12 20:10: "it needs to know that triplets are not the only tuplets.
 * Quadruplets happen."; Dann may widen it). One or two runs fit: returned as A
 * and B, by start, then by n ascending. Three or more: none offered, all
 * reported.
 *
 * GRACE NOTES. `VocalLineEvent` has no grace field and the parsers drop grace
 * notes before the event list is built (`musicxml-parser.ts:706-708`,
 * `mnx-parser.ts:862-867`), so a grace note is never a candidate and never part
 * of the bar's sum, whatever its printed length.
 *
 * `kind` names the first kind that made an offer. Both kinds are reported side
 * by side where both made one, so a bar can carry `note` and `runs` together.
 */

import type { NoteBase, Pitch, VocalLineEvent, ParsedScore } from '@ilya/score-parser';
import type { Metre, Ratio } from '../omr/triplets';
import { durationFraction } from './correction';
import { TUPLET_VALUES } from './entry';
import type { BarToConfirm } from './bars-to-confirm';

export type BarChange = 'dot' | 'undot' | 'longer' | 'shorter';

export interface OfferedNote {
	/** The event's 0-based position among the bar's events, in `vocalLine` order. */
	index: number;
	/** Absent for a rest. */
	pitch?: Pitch;
	type: NoteBase;
	dots: number;
}

export interface OfferedRun {
	label: 'A' | 'B';
	/** The first event's 0-based position among the bar's events. */
	start: number;
	n: number;
	ratio: Ratio;
}

export interface BarOffers {
	kind: 'note' | 'tuplet' | 'none';
	note?: OfferedNote;
	change?: { what: BarChange; to: NoteBase; dots: number };
	runs?: OfferedRun[];
	/** Candidates set aside, and why, in plain words for the report, not for the singer. */
	rejected: string[];
}

interface Frac {
	n: number;
	d: number;
}

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
const frac = (n: number, d: number): Frac => {
	const g = gcd(Math.abs(n), d) || 1;
	return { n: n / g, d: d / g };
};
const add = (a: Frac, b: Frac): Frac => frac(a.n * b.d + b.n * a.d, a.d * b.d);
const sub = (a: Frac, b: Frac): Frac => frac(a.n * b.d - b.n * a.d, a.d * b.d);
const mul = (a: Frac, b: Frac): Frac => frac(a.n * b.n, a.d * b.d);
const equal = (a: Frac, b: Frac): boolean => a.n * b.d === b.n * a.d;
const ZERO: Frac = { n: 0, d: 1 };

/** The whole-note value of a printed type, undotted, via the app's own table. */
const valueOf = (base: NoteBase): Frac => {
	const f = durationFraction(base, 0);
	return { n: f.numerator, d: f.denominator };
};
const lengthOf = (base: NoteBase, dots: number): Frac => {
	const f = durationFraction(base, dots);
	return { n: f.numerator, d: f.denominator };
};

/** `triplets.ts:190`, copied: that file is being changed and is not imported from. */
const compound = (metre: Metre): boolean => metre.beats % 3 === 0 && metre.beats >= 6;

/** The ratios a run may read as, by metre (see the header). */
function ratiosFor(metre: Metre): Ratio[] {
	const out: Ratio[] = [{ n: 3, m: 2 }];
	if (compound(metre)) out.push({ n: 2, m: 3 }, { n: 4, m: 3 });
	else if (metre.beats === 3) out.push({ n: 4, m: 3 });
	return out;
}

const name = (e: VocalLineEvent): string => `${e.duration.base}${'.'.repeat(e.duration.dots)}${e.type === 'rest' ? ' rest' : ''}`;
const label = (r: { start: number; n: number; ratio: Ratio }): string => `${r.ratio.n}:${r.ratio.m} over events ${r.start} to ${r.start + r.n - 1}`;

export function offersForABar(score: Pick<ParsedScore, 'measures' | 'vocalLine'>, bar: BarToConfirm): BarOffers {
	const rejected: string[] = [];
	const none = (): BarOffers => ({ kind: 'none', rejected });

	const measure = score.measures.find((m) => m.index === bar.measureIndex);
	const metre = measure?.timeSignature;
	if (!metre || !(metre.beats > 0) || !(metre.beatType > 0)) {
		rejected.push(`bar ${bar.number}: no metre in force, so nothing to compare against`);
		return none();
	}
	const events = score.vocalLine.filter((e) => e.measureIndex === bar.measureIndex);
	if (events.some((e) => !e.duration.fraction || !(e.duration.fraction.denominator > 0))) {
		rejected.push(`bar ${bar.number}: an event has no length, so the bar cannot be summed`);
		return none();
	}
	const lens: Frac[] = events.map((e) => frac(e.duration.fraction.numerator, e.duration.fraction.denominator));
	const total = lens.reduce(add, ZERO);
	const expected = frac(metre.beats, metre.beatType);

	// ── Kind 1: one note's length ────────────────────────────────────
	type Candidate = { index: number; what: BarChange; to: NoteBase; dots: number };
	const fits: Candidate[] = [];
	events.forEach((e, index) => {
		if (e.duration.tuplet) {
			rejected.push(`event ${index} (${name(e)}) already carries a tuplet, so its length is not offered`);
			return;
		}
		const { base, dots } = e.duration;
		const tries: Candidate[] = [];
		if (dots === 0) tries.push({ index, what: 'dot', to: base, dots: 1 });
		if (dots === 1) tries.push({ index, what: 'undot', to: base, dots: 0 });
		const rung = TUPLET_VALUES.indexOf(base);
		if (rung >= 0 && rung + 1 < TUPLET_VALUES.length) tries.push({ index, what: 'longer', to: TUPLET_VALUES[rung + 1], dots });
		if (rung > 0) tries.push({ index, what: 'shorter', to: TUPLET_VALUES[rung - 1], dots });
		for (const t of tries) {
			if (equal(add(sub(total, lens[index]), lengthOf(t.to, t.dots)), expected)) fits.push(t);
		}
	});
	const describe = (c: Candidate): string => `${c.what} event ${c.index} (${name(events[c.index])}) to ${c.to}${'.'.repeat(c.dots)}`;

	let note: OfferedNote | undefined;
	let change: BarOffers['change'];
	if (fits.length === 1) {
		const c = fits[0];
		const e = events[c.index];
		note = { index: c.index, ...(e.type === 'note' && e.pitch ? { pitch: e.pitch } : {}), type: e.duration.base, dots: e.duration.dots };
		change = { what: c.what, to: c.to, dots: c.dots };
	} else if (fits.length > 1) {
		rejected.push(`${fits.length} single-note changes make the bar fit, so none is offered: ${fits.map(describe).join('; ')}`);
	}

	// ── Kind 2: a tuplet ─────────────────────────────────────────────
	interface Run extends Omit<OfferedRun, 'label'> {
		/** What the bar's length changes by if this run is read as a tuplet. */
		delta: Frac;
		span: Frac;
		at: Frac;
	}
	const eligible = (e: VocalLineEvent): boolean => !e.duration.tuplet && e.duration.dots === 0;
	const starts: Frac[] = [];
	let clock = ZERO;
	for (const len of lens) {
		starts.push(clock);
		clock = add(clock, len);
	}

	// A whole number of spans from the bar's start, so the run straddles no beat.
	const aligned = (at: Frac, span: Frac): boolean => (at.n * span.d) % (at.d * span.n) === 0;
	const shaped: Run[] = [];
	for (const ratio of ratiosFor(metre)) {
		for (let i = 0; i + ratio.n <= events.length; i++) {
			const slice = events.slice(i, i + ratio.n);
			const base = slice[0].duration.base;
			if (!slice.every((e) => eligible(e) && e.duration.base === base)) continue;
			const span = mul(valueOf(base), frac(ratio.m, 1));
			const written = slice.reduce((s, _e, k) => add(s, lens[i + k]), ZERO);
			shaped.push({ start: i, n: ratio.n, ratio, span, at: starts[i], delta: sub(span, written) });
		}
	}
	shaped.sort((a, b) => a.start - b.start || a.n - b.n);
	const runs = shaped.filter((r) => aligned(r.at, r.span));

	const single = runs.filter((r) => equal(add(total, r.delta), expected));
	let offeredRuns: OfferedRun[] | undefined;
	if (single.length === 1 || single.length === 2) {
		offeredRuns = single.map((r, k) => ({ label: k === 0 ? 'A' : 'B', start: r.start, n: r.n, ratio: r.ratio }));
	} else if (single.length > 2) {
		rejected.push(`${single.length} tuplet runs fit, so none is offered: ${single.map(label).join('; ')}`);
	} else {
		// One run at a time. Say so where two runs together would have fitted.
		const pair = runs.some((a) =>
			shaped.some((b) => b.start >= a.start + a.n && aligned(add(b.at, a.delta), b.span) && equal(add(add(total, a.delta), b.delta), expected)),
		);
		if (pair) rejected.push('the bar fits only under two tuplet runs together, so no tuplet is offered');
	}

	if (note) return { kind: 'note', note, change, ...(offeredRuns ? { runs: offeredRuns } : {}), rejected };
	if (offeredRuns) return { kind: 'tuplet', runs: offeredRuns, rejected };
	return none();
}
