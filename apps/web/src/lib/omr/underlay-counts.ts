/**
 * Two vowels or more in one seated unit: COUNTED, never repaired (N.135 stage 2b
 * r5, step 7C; `CONTRACT.md` §0.1: a second vowel under one note would shift every
 * later note, a cascade nothing here may start). The desk designs any repair from
 * these counts.
 *
 * The two places such a unit arises are kept apart:
 * - `cut`: a unit with two vowel letters or more that `cutUnits` could not divide
 *   (the engine's cut failed or did not add up, `underlay-units.ts`), counted on
 *   the units before seating;
 * - `merged`: two tokens seated on one note, which `oneToANote`
 *   (`underlay-words.ts`) joins into one syllable, counted on the seats `seatPage`
 *   hands to `sewWords`.
 * Each entry has the unit's text, its box, and how many free noteheads lie
 * between the box's x0 and x1.
 *
 * Pure.
 */
import type { NotePlace, Seat, Token } from './underlay-seat';
import { VOWEL } from './underlay-units';

const VOWELS = new RegExp(VOWEL.source, 'giu');

export interface ManyVowels {
	text: string;
	x0: number;
	x1: number;
	/** Free noteheads with x from `x0` to `x1`. */
	notesBetween: number;
}

export interface ManyVowelCounts {
	cut: ManyVowels[];
	merged: ManyVowels[];
}

const vowelsIn = (text: string): number => (text.match(VOWELS) ?? []).length;

/** The x of each free note: not tied into, not under an extender, as `seatTokens` takes them. */
export function freeNoteXs(notes: readonly NotePlace[]): number[] {
	return notes.filter((n) => !n.tiedInto && !n.underExtender).map((n) => n.x).sort((a, b) => a - b);
}

const between = (free: readonly number[], x0: number, x1: number): number => free.filter((x) => x >= x0 && x <= x1).length;

/** Units of two vowels or more, before seating. */
export function manyVowelsInUnits(units: readonly Token[], free: readonly number[]): ManyVowels[] {
	return units.filter((u) => vowelsIn(u.text) >= 2).map((u) => ({ text: u.text, x0: u.x0, x1: u.x1, notesBetween: between(free, u.x0, u.x1) }));
}

/** Notes that two seated tokens share, where the joined text holds two vowels or more. */
export function manyVowelsMerged(units: readonly Token[], seats: readonly Seat[], free: readonly number[]): ManyVowels[] {
	const onNote = new Map<number, Seat[]>();
	for (const s of seats) {
		if (s.kind !== 'syllable' || s.note === null) continue;
		const list = onNote.get(s.note);
		if (list) list.push(s);
		else onNote.set(s.note, [s]);
	}
	const out: ManyVowels[] = [];
	for (const group of onNote.values()) {
		if (group.length < 2) continue;
		const sorted = [...group].sort((a, b) => a.x - b.x);
		const text = sorted.map((s) => s.text).join('');
		if (vowelsIn(text) < 2) continue;
		const boxes = group.map((s) => units[s.token]);
		const x0 = Math.min(...boxes.map((b) => b.x0));
		const x1 = Math.max(...boxes.map((b) => b.x1));
		out.push({ text, x0, x1, notesBetween: between(free, x0, x1) });
	}
	return out;
}
