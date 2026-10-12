/**
 * The words of N.182's key lines (QUEUE row 71). PURE: a suggestion, the
 * singer's answers, and a way to name a move in; lines out. Every string is
 * PROPOSED and its French owed (`i18n.ts`, `key.*`).
 *
 * WHAT A LINE SAYS: the key, the move, and only what differs from the written
 * key for this singer (Dann's two tests: "no line that is true of every key;
 * no figure that does not help a decision"). So a part is printed only where
 * the key differs from the written key on it: its range, a passaggio share
 * moved by the 10-point test or crossing zero, the held note, or the share
 * past the vowels' turn moved by the 10-point test (rule 6).
 *
 * HOW IT SAYS IT (rule 8): each challenge's part follows the singer's answer to
 * its own question (range above Q1, below Q2, passaggio time Q3, a held note
 * Q4). Points 1 to 2 add a clause of why; point 3 is the plain part; points 4
 * to 5 take the terse form where one exists. The passaggi are named in the Q7
 * register. The answers never change which keys are shown.
 */
import type { IntakeAnswers, KeyChoice } from '@ilya/score-parser';
import { t, type Language } from '$lib/i18n';
import { intakeBand, registerFor } from './comments';
import { BETTER_KEY_MIN_DROP, countWord, percent } from './singer-page';
import type { Beyond, KeyOption, KeySuggestion } from './key-suggest';

export interface KeyLine {
	text: string;
	stop?: KeyChoice;
}

export interface KeyWords {
	/** One to three lines to show, or none. */
	lines: KeyLine[];
	/** The one-line answer when no key is shown: none, none better, or none workable. */
	note: string | null;
	/** "Show keys that reach higher", and the keys under it. */
	reveal: { label: string; lines: KeyLine[] } | null;
}

/** How a move is named: the ruler's readout without "Ilya's recommendation", and the stop to try, when the score names its key. */
export type NameMove = (semitones: number) => { readout: string; stop?: KeyChoice };

const fill = (s: string, vars: Record<string, string | number>) =>
	Object.entries(vars).reduce((out, [k, v]) => out.replaceAll(`{${k}}`, String(v)), s);

/** "Down a whole tone", from the ruler's own interval words, for a page whose score names no key. */
export function moveWords(semitones: number, language: Language): string {
	const a = t(`key.ruler.interval.${Math.abs(semitones)}`, language);
	return fill(t(semitones < 0 ? 'key.ruler.down' : 'key.ruler.up', language), { a: language === 'en' ? a : a.charAt(0).toLowerCase() + a.slice(1) });
}

const moved = (a: number | null, b: number | null) => a !== null && b !== null && Math.abs(a - b) >= BETTER_KEY_MIN_DROP - 1e-9;

function rangePart(side: 'above' | 'below', b: Beyond, language: Language, intake: IntakeAnswers | undefined): string {
	const T = (k: string) => t(k, language);
	const band = intakeBand(side === 'above' ? intake?.top : intake?.bottom);
	// The ruler's interval words run to a tritone; a key six semitones away can reach farther past the range.
	const interval = b.semitones <= 6 ? t(`key.ruler.interval.${b.semitones}`, language).toLowerCase() : fill(T('key.part.semitones'), { n: b.semitones });
	if (band === 'points4to5') return fill(T(`key.terse.${side}`), { count: b.count, interval, bar: b.bar });
	const text = fill(T(b.count === 1 ? `key.part.${side}.one` : `key.part.${side}.many`), { count: countWord(b.count, language === 'fr' ? 'fr' : 'en'), interval, bar: b.bar });
	return band === 'points1to2' ? `${text}, ${T('key.why.range')}` : text;
}

/** The parts of one key's line: only what differs from the written key. */
export function keyParts(k: KeyOption, w: KeyOption, language: Language, intake: IntakeAnswers | undefined): string[] {
	const T = (key: string) => t(key, language);
	const register = registerFor(intake);
	const nouns = { primo: T(`key.noun.primo.${register}`), secondo: T(`key.noun.secondo.${register}`) };
	const passaggioWhy = intakeBand(intake?.passaggi) === 'points1to2' ? `, ${T('key.why.passaggio')}` : '';
	const heldWhy = intakeBand(intake?.sustained) === 'points1to2' ? `, ${T('key.why.held')}` : '';
	const parts: string[] = [];

	// Range: what this key does past the range, or that it is inside where the written key was not.
	const rangeChanged = k.set.range !== w.set.range || k.above?.semitones !== w.above?.semitones || k.below?.semitones !== w.below?.semitones;
	if (rangeChanged) {
		if (k.above) parts.push(rangePart('above', k.above, language, intake));
		if (k.below) parts.push(rangePart('below', k.below, language, intake));
		if (!k.above && !k.below) parts.push(T('key.part.inside'));
	}
	// Passaggio time: a share that moved by the 10-point test, or a challenge gained or lost.
	if (k.primoShare !== null && (k.set.primo !== w.set.primo || moved(k.primoShare, w.primoShare))) {
		parts.push((k.set.primo ? fill(T('key.part.primo'), { n: percent(k.primoShare), ...nouns }) : fill(T('key.part.primoNone'), nouns)) + passaggioWhy);
	}
	if (k.secondoShare !== null && (k.set.secondo !== w.set.secondo || moved(k.secondoShare, w.secondoShare))) {
		parts.push(k.set.secondo ? fill(T('key.part.secondo'), { n: percent(k.secondoShare), ...nouns }) : fill(T('key.part.secondoNone'), nouns));
	}
	if (k.set.held !== w.set.held) {
		parts.push(k.held ? fill(T('key.part.held'), { bar: k.held.bar, ...nouns }) + heldWhy : fill(T('key.part.heldNone'), nouns));
	}
	// Vowels past their turn: described, only where keys differ by the 10-point test (rule 6).
	if (moved(k.pastTurn, w.pastTurn)) parts.push(fill(T('key.part.turn'), { n: percent(k.pastTurn!) }));
	return parts;
}

/** Parts join with « ; » in both languages; the OQLF puts no space before it. */
function joinParts(parts: string[]): string {
	return parts.join('; ');
}

/** The key lines, the one-line answer, and the reveal. */
export function keyWords(s: KeySuggestion, nameMove: NameMove, language: Language, intake: IntakeAnswers | undefined): KeyWords {
	const T = (key: string) => t(key, language);
	const register = registerFor(intake);
	const line = (k: KeyOption): KeyLine => {
		const { readout, stop } = nameMove(k.semitones);
		const parts = keyParts(k, s.written, language, intake);
		return { text: parts.length ? fill(T('key.line'), { readout, parts: joinParts(parts) }) : `${readout}.`, ...(stop ? { stop } : {}) };
	};
	const lines = s.kind === 'keys' ? s.shown.map(line) : [];
	const note =
		s.kind === 'none'
			? fill(T('key.none'), { primo: T(`key.noun.primo.${register}`) })
			: s.kind === 'noneBetter'
				? T('key.noneBetter')
				: s.kind === 'noWorkable'
					? T('key.noWorkable')
					: null;
	let reveal: KeyWords['reveal'] = null;
	if (s.reveal.length > 0) {
		const up = s.reveal.some((k) => k.semitones > 0);
		const down = s.reveal.some((k) => k.semitones < 0);
		reveal = { label: T(up && down ? 'key.reveal.both' : up ? 'key.reveal.higher' : 'key.reveal.lower'), lines: s.reveal.map(line) };
	}
	return { lines, note, reveal };
}
