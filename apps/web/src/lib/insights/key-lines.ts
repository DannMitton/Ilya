/**
 * The words of N.182's key lines (QUEUE row 71; brief r3, review A3 to A6, Dann
 * 2026-10-11 23:14 to 23:20 and 2026-11-01 22:39). PURE: a suggestion, the
 * singer's answers, and a way to name a key in; lines out. Every string is
 * PROPOSED and its French owed (`i18n.ts`, `insights.key.*`).
 *
 * WHAT A LINE SAYS: the key, the move, and only what differs from the key the
 * singer is reading in, for this singer (Dann's two tests: "no line that is
 * true of every key; no figure that does not help a decision"). So a part is
 * printed only where the key differs on it: its range, a passaggio share that
 * moved by the 10-point test or crossed zero, the sustained note, or the share
 * past the vowels' turn moved by the 10-point test (rule 6).
 *
 * WHAT A LINE NEVER SAYS (Dann 2026-10-11 23:19, 2026-11-01 22:39): a percent;
 * a pitch; a count of notes. A share is a plain fraction, or "some"; the
 * range is a passage named by its bars, the one or two that matter most and
 * "and elsewhere".
 *
 * HOW IT SAYS IT (rule 8): each challenge's part follows the singer's answer to
 * its own question (range above Q1, below Q2, passaggio time Q3, a sustained
 * note Q4). Points 1 to 2 add a clause of why; point 3 is the plain part;
 * points 4 to 5 take the terse form where one exists. The passaggi are named in
 * the Q7 register. The answers never change which keys are shown.
 */
import type { IntakeAnswers, KeyChoice } from '@ilya/score-parser';
import { t, type Language } from '$lib/i18n';
import { intakeBand, registerFor } from './comments';
import { BETTER_KEY_MIN_DROP } from './singer-page';
import { fractionOf } from './key-fractions';
import { MAX_NAMED_PASSAGES, type Beyond, type KeyOption, type KeySuggestion } from './key-suggest';

export interface KeyLine {
	text: string;
	/** The ruler's stop, when the page can open the ruler on it ("Try this key"). */
	stop?: KeyChoice;
}

export interface KeyWords {
	/** One to three lines to show, or none. */
	lines: KeyLine[];
	/** The one-line answer when no key is shown: suits, none better, or none workable. */
	note: string | null;
	/** "Show keys that reach higher", and the keys under it. */
	reveal: { label: string; lines: KeyLine[] } | null;
}

/** How a key is named: the key it lands in (the ruler's own naming), and the stop to try, when the score names its key. */
export type NameKey = (semitones: number) => { keyName?: string; stop?: KeyChoice };

const fill = (s: string, vars: Record<string, string | number>) =>
	Object.entries(vars).reduce((out, [k, v]) => out.replaceAll(`{${k}}`, String(v)), s);

/** An interval word starts lower case inside a sentence: English already does, French capitals do not. */
const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

/** "Down a whole tone", from the ruler's own interval words; the move from the key the singer is reading in. */
export function moveWords(semitones: number, language: Language): string {
	const a = t(`key.ruler.interval.${Math.abs(semitones)}`, language);
	return fill(t(semitones < 0 ? 'key.ruler.down' : 'key.ruler.up', language), { a: language === 'en' ? a : lowerFirst(a) });
}

/** How far past the range, in the ruler's interval words, or in semitones beyond a tritone. */
function reachWords(semitones: number, language: Language): string {
	return semitones <= 6 ? lowerFirst(t(`key.ruler.interval.${semitones}`, language)) : fill(t('insights.key.part.semitones', language), { n: semitones });
}

/** "bar 12", "bars 54 to 55": a passage by its bars. */
function passageWords(p: { from: string; to: string }, language: Language): string {
	return p.from === p.to ? fill(t('insights.key.where.bar', language), { n: p.from }) : fill(t('insights.key.where.bars', language), { from: p.from, to: p.to });
}

/** The one or two passages that matter most, by sung time, and "and elsewhere" when more stand out of range. */
export function whereWords(b: Beyond, language: Language): string {
	const named = b.passages.slice(0, MAX_NAMED_PASSAGES).map((p) => passageWords(p, language));
	const where = named.length === 2 ? fill(t('insights.key.where.and', language), { a: named[0], b: named[1] }) : named.join('');
	return b.passages.length > MAX_NAMED_PASSAGES ? fill(t('insights.key.where.elsewhere', language), { where }) : where;
}

const moved = (a: number | null, b: number | null) => a !== null && b !== null && Math.abs(a - b) >= BETTER_KEY_MIN_DROP - 1e-9;

function rangePart(side: 'above' | 'below', b: Beyond, reaches: boolean, language: Language, intake: IntakeAnswers | undefined): string {
	const T = (k: string) => t(k, language);
	const band = intakeBand(side === 'above' ? intake?.top : intake?.bottom);
	const where = whereWords(b, language);
	let text = band === 'points4to5' ? fill(T(`insights.key.terse.${side}`), { where }) : fill(T(`insights.key.part.${side}`), { where });
	if (reaches) text = fill(T('insights.key.part.by'), { part: text, interval: reachWords(b.semitones, language) });
	return band === 'points1to2' ? `${text}, ${T('insights.key.why.range')}` : text;
}

/** One share's part: a fraction, "some" when it is too small for one, or "nothing"; a challenge gained, lost, or moved by the 10-point test. */
function sharePart(which: 'primo' | 'secondo', k: KeyOption, w: KeyOption, noun: string, language: Language): string | null {
	const share = which === 'primo' ? k.primoShare : k.secondoShare;
	const before = which === 'primo' ? w.primoShare : w.secondoShare;
	const has = which === 'primo' ? k.set.primo : k.set.secondo;
	const had = which === 'primo' ? w.set.primo : w.set.secondo;
	if (share === null || (has === had && !moved(share, before))) return null;
	const T = (key: string) => t(key, language);
	const base = `insights.key.part.${which}`;
	if (!has) return fill(T(`${base}None`), { [which]: noun });
	const fraction = fractionOf(share);
	return fraction ? fill(T(base), { fraction: T(`insights.key.fraction.${fraction}`), [which]: noun }) : fill(T(`${base}Some`), { [which]: noun });
}

/**
 * The parts of one key's line: only what differs from the key read. A key
 * beyond the range margin (`reaches`, the reveal) always says where and how
 * far it reaches, because that is what the reveal is for.
 */
export function keyParts(k: KeyOption, w: KeyOption, language: Language, intake: IntakeAnswers | undefined): string[] {
	const T = (key: string) => t(key, language);
	const register = registerFor(intake);
	const primo = T(`insights.key.noun.primo.${register}`);
	const secondo = T(`insights.key.noun.secondo.${register}`);
	const why = (q: IntakeAnswers['passaggi'], key: string) => (intakeBand(q) === 'points1to2' ? `, ${T(key)}` : '');
	const reaches = !k.workable;
	const parts: string[] = [];

	// Range: what this key does past the range, or that it is inside where the key read was not.
	const rangeChanged = reaches || k.set.range !== w.set.range || k.above?.semitones !== w.above?.semitones || k.below?.semitones !== w.below?.semitones;
	if (rangeChanged) {
		if (k.above) parts.push(rangePart('above', k.above, reaches, language, intake));
		if (k.below) parts.push(rangePart('below', k.below, reaches, language, intake));
		if (!k.above && !k.below) parts.push(T('insights.key.part.inside'));
	}
	// Passaggio time: a challenge gained or lost, or a share moved by the 10-point test.
	const primoPart = sharePart('primo', k, w, primo, language);
	if (primoPart) parts.push(primoPart + (k.set.primo ? why(intake?.passaggi, 'insights.key.why.passaggio') : ''));
	const secondoPart = sharePart('secondo', k, w, secondo, language);
	if (secondoPart) parts.push(secondoPart + (k.set.secondo ? why(intake?.passaggi, 'insights.key.why.passaggio') : ''));
	if (k.set.sustained !== w.set.sustained) {
		parts.push(
			k.sustained
				? fill(T('insights.key.part.sustained'), { bar: k.sustained.bar, secondo }) + why(intake?.sustained, 'insights.key.why.sustained')
				: fill(T('insights.key.part.sustainedNone'), { secondo }),
		);
	}
	// Vowels past their turn: described, only where keys differ by the 10-point test and the share can be said as a fraction (rule 6).
	if (moved(k.pastTurn, w.pastTurn) && k.pastTurn !== null) {
		const fraction = fractionOf(k.pastTurn);
		if (fraction) parts.push(fill(T('insights.key.part.turn'), { fraction: T(`insights.key.fraction.${fraction}`) }));
	}
	return parts;
}

/** The key lines, the one-line answer, and the reveal. */
export function keyWords(s: KeySuggestion, nameKey: NameKey, language: Language, intake: IntakeAnswers | undefined): KeyWords {
	const T = (key: string) => t(key, language);
	const register = registerFor(intake);
	const line = (k: KeyOption): KeyLine => {
		const { keyName, stop } = nameKey(k.semitones);
		const move = moveWords(k.semitones, language);
		const readout = keyName ? fill(T('key.ruler.readout'), { interval: move, key: keyName }) : move;
		const parts = keyParts(k, s.written, language, intake);
		return { text: parts.length ? fill(T('insights.key.line'), { readout, parts: parts.join('; ') }) : `${readout}.`, ...(stop ? { stop } : {}) };
	};
	const lines = s.kind === 'keys' ? s.shown.map(line) : [];
	let note: string | null = null;
	if (s.kind === 'suits') {
		const w = s.written.set;
		note =
			w.primo !== undefined
				? fill(T('insights.key.suits.primo'), { primo: T(`insights.key.noun.primo.${register}`) })
				: w.secondo !== undefined
					? fill(T('insights.key.suits.secondo'), { secondo: T(`insights.key.noun.secondo.${register}`) })
					: T('insights.key.suits.range');
	} else if (s.kind === 'noneBetter') note = T('insights.key.noneBetter');
	else if (s.kind === 'noWorkable') note = T('insights.key.noWorkable');
	let reveal: KeyWords['reveal'] = null;
	if (s.reveal.length > 0) {
		const up = s.reveal.some((k) => k.semitones > 0);
		const down = s.reveal.some((k) => k.semitones < 0);
		reveal = { label: T(up && down ? 'insights.key.reveal.both' : up ? 'insights.key.reveal.higher' : 'insights.key.reveal.lower'), lines: s.reveal.map(line) };
	}
	return { lines, note, reveal };
}
