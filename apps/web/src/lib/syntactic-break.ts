/**
 * QUEUE row 139: THE # FOR A SYNTACTIC BREAK.
 *
 * A coach tells a singer there is no voicing between two words, and the singer types a # after the
 * first (Dann, 2026-10-19 23:54 and 23:59). The mark ends the word before it, stops regressive voicing
 * assimilation across that boundary as a punctuation mark does (`boundaries.ts`), takes no note of its
 * own, and never prints in the Russian. In the IPA alone it appears, as an enclitic grafted after its
 * parent syllable (Dann, 2026-10-20 00:01; and 2026-10-21 00:26: only in the IPA line).
 *
 * THE MARK IS A FIELD OF ITS OWN, `syntacticBreak`. It is never in `punctuation` (which prints under the
 * notes and is read by the clitic guards) and never in `cyrillic` (what was typed). `pipeline.ts` peels the
 * # off the typed tokens, so every reader of its output counts the same words, whether the # stood alone,
 * trailed its word («я#», the shape a score folds a bare # into), or led the next one.
 *
 * WHERE IT TAKES EFFECT (N.194 step 2, Dann 2026-10-21 02:18 and 02:19). The peel puts the field on the
 * word the # belongs to by position; `boundaries.ts` then moves it to the last word of that word's unit
 * (`text/syntactic-break-unit.ts`), because a break happens only at the end of a complete unit. The typed
 * text keeps the # where the singer put it, and Ilya never moves it there.
 */
import { WORD_TOKEN, GLUED_MARK } from './text/break-glue';

export const SYNTACTIC_BREAK = '#';

/**
 * Splits typed tokens (`tokenSpans`) into the words they hold and, for each, whether a # belongs to it and which
 * token it came from. `isWord` says what a token must be to count as a word (`pipeline.ts` drops punctuation alone).
 *
 * - A trailing # belongs to the word it trails («я#»), and so does one inside the word («ва#с»): a # with
 *   letters to its left is read, never rejected (Dann 02:19).
 * - A leading # or a token that is only #s belongs to the word before it («я #на», «я # на»).
 * - With no word before it, a # belongs to nothing and is dropped.
 * - A `\u00A0` standing immediately before a # goes with it («я\u00A0#», the form Ilya itself writes).
 */
export function peelSyntacticBreaks<T extends { text: string }>(
	tokens: readonly T[],
	isWord: (token: string) => boolean,
): { words: string[]; broken: boolean[]; source: T[] } {
	const words: string[] = [];
	const broken: boolean[] = [];
	const source: T[] = [];
	for (const tok of tokens) {
		const [, lead, core, trail] = /^(#*)(.*?)((?: *#)*)$/u.exec(tok.text)!;
		if (lead && words.length > 0) broken[words.length - 1] = true;
		if (core && isWord(core)) {
			words.push(core.replace(GLUED_MARK, ''));
			broken.push(trail !== '' || core.includes('#'));
			source.push(tok);
		} else if (trail && words.length > 0) broken[words.length - 1] = true;
	}
	return { words, broken, source };
}

/** A syllable's IPA with the mark grafted after it, when `word` ends in a syntactic break and this is its last syllable. */
export function graftBreak(word: { syntacticBreak?: boolean; syllables: readonly unknown[] }, k: number, ipa: string): string {
	return word.syntacticBreak && k === word.syllables.length - 1 ? ipa + SYNTACTIC_BREAK : ipa;
}

/** One typed token and where it sits in its line. */
export interface TokenSpan {
	text: string;
	start: number;
	end: number;
}

/**
 * A typed line's tokens with their offsets in that line, read off the UNTRIMMED line so a leading space keeps
 * them. A token is a run of non-space characters, plus a ` ` glued to a `#` (`break-glue.ts`), so the
 * glued form «я #» is one token here as it is everywhere Lyrics is split.
 */
export const tokenSpans = (line: string): TokenSpan[] =>
	[...line.matchAll(WORD_TOKEN)].map((m) => ({ text: m[0], start: m.index!, end: m.index! + m[0].length }));
