/**
 * WHICH BARS A SINGER IS ASKED TO CONFIRM. Corrections slice 1, QUEUE row 51.
 *
 * After a scan is read, some bars hold a different length from the metre in
 * force. This lists them, in order, each with its measure number as printed
 * and what it reads as against its metre, in the signature's beat unit
 * ("3 of 4"). It asks; it never repairs. The page is the authority, not the
 * arithmetic (Dann, 2026-10-08 15:50), so nothing here changes a note or
 * stores anything.
 *
 * THE ARITHMETIC IS `measureFill`'s, not a second copy of it. A bar is a
 * candidate exactly where `measureFill` returns a value. Then the bar rule
 * (Dann, 2026-10-05 00:52, OPEN.md N.178 item 22) sets some candidates aside:
 *
 *   1. A first bar shorter than its metre (an anacrusis).
 *   2. A last bar that, with the first, makes a whole bar.
 *   3. The same pair either side of a repeat sign: the bar before the sign
 *      and the bar after it, and the first and last bar of a repeated section.
 *
 * WHAT THE PARSER DOES NOT CARRY, so this does not apply it. `Measure` has
 * `repeatStart` and `repeatEnd` (`packages/score-parser/src/types.ts:273-274`),
 * and they are used here. It has no double bar: the MusicXML reader's
 * `barline` case reads only `<repeat>` and `<ending>`
 * (`musicxml-parser.ts:539-558`) and drops `<bar-style>`. So a pair either side
 * of a double bar that is not also a repeat sign is not set aside; those bars
 * are named. A double bar is never guessed.
 *
 * A pickup is the first bar, so rule 1 covers it, flagged `isPickup` or not.
 * A bar short on its own anywhere else is named: only a completing partner
 * excuses it. A metre change is honoured because each bar is read against its
 * own `Measure.timeSignature`, which the parser snapshots per measure.
 */

import type { ParsedScore, VocalLineEvent } from '@ilya/score-parser';
import { measureFill } from './entry';

/** One bar the singer is asked to confirm. */
export interface BarToConfirm {
	/** The bar's 0-based index, as `VocalLineEvent.measureIndex` names it. */
	measureIndex: number;
	/** The bar's number as printed (`Measure.number`; a pickup may be '0'). */
	number: string;
	/** What the bar holds, in the signature's own beat unit. May be fractional. */
	actual: number;
	/** What its metre asks for, in the same unit: the signature's numerator. */
	expected: number;
}

type Fill = { actual: number; expected: number };

// `measureFill` rounds `actual` to three decimals, so a sum of two rounded
// halves is only equal to the whole within that rounding.
const WHOLE_EPSILON = 0.002;

export function barsToConfirm(score: Pick<ParsedScore, 'measures' | 'vocalLine'>): BarToConfirm[] {
	const { measures, vocalLine } = score;
	if (!Array.isArray(measures) || !Array.isArray(vocalLine)) return [];

	const byBar = new Map<number, VocalLineEvent[]>();
	for (const ev of vocalLine) {
		const list = byBar.get(ev.measureIndex);
		if (list) list.push(ev);
		else byBar.set(ev.measureIndex, [ev]);
	}

	const fills = new Map<number, Fill>();
	const sigOf = new Map<number, { beats: number; beatType: number }>();
	for (const m of measures) {
		const here = byBar.get(m.index);
		if (!here) continue;
		const fill = measureFill(here, m.index, m.timeSignature);
		if (!fill) continue;
		fills.set(m.index, fill);
		sigOf.set(m.index, m.timeSignature);
	}
	if (fills.size === 0) return [];

	const short = (i: number): boolean => {
		const f = fills.get(i);
		return !!f && f.actual < f.expected;
	};
	/** Whole notes the bar holds, from `measureFill`'s own figure. */
	const wholes = (i: number): number => (fills.get(i) as Fill).actual / (sigOf.get(i) as { beatType: number }).beatType;
	const metreWholes = (i: number): number => {
		const s = sigOf.get(i) as { beats: number; beatType: number };
		return s.beats / s.beatType;
	};
	const completes = (a: number, b: number): boolean => {
		if (a === b || !short(a) || !short(b)) return false;
		const sum = wholes(a) + wholes(b);
		return Math.abs(sum - metreWholes(a)) < WHOLE_EPSILON || Math.abs(sum - metreWholes(b)) < WHOLE_EPSILON;
	};

	const order = measures.map((m) => m.index);
	const first = order[0];
	const lastWithEvents = [...order].reverse().find((i) => byBar.has(i));

	const setAside = new Set<number>();

	// 1. The first bar, if short.
	if (first !== undefined && short(first)) setAside.add(first);

	// 2 and 3. Pairs that make a whole bar.
	const pairs: Array<[number, number]> = [];
	if (first !== undefined && lastWithEvents !== undefined) pairs.push([first, lastWithEvents]);

	const position = new Map(order.map((idx, p) => [idx, p]));
	for (const m of measures) {
		const p = position.get(m.index) as number;
		// Across a repeat sign: the bar before it and the bar after it.
		if (m.repeatEnd && p + 1 < order.length) pairs.push([m.index, order[p + 1]]);
		if (m.repeatStart && p > 0) pairs.push([order[p - 1], m.index]);
	}
	// Within a repeated section: its first bar and the bar that carries the end repeat.
	let sectionStart = first;
	for (const m of measures) {
		if (m.repeatStart) sectionStart = m.index;
		if (m.repeatEnd && sectionStart !== undefined) {
			pairs.push([sectionStart, m.index]);
			const p = position.get(m.index) as number;
			if (p + 1 < order.length) sectionStart = order[p + 1];
		}
	}
	for (const [a, b] of pairs) {
		if (completes(a, b)) {
			setAside.add(a);
			setAside.add(b);
		}
	}

	const out: BarToConfirm[] = [];
	for (const m of measures) {
		const fill = fills.get(m.index);
		if (!fill || setAside.has(m.index)) continue;
		out.push({ measureIndex: m.index, number: m.number, actual: fill.actual, expected: fill.expected });
	}
	return out;
}
