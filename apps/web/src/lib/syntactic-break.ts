/**
 * QUEUE row 139: THE # FOR A SYNTACTIC BREAK.
 *
 * A coach tells a singer there is no voicing between two words, and the singer types a # after the
 * first (Dann, 2026-10-19 23:54 and 23:59). The mark ends the word before it, stops regressive voicing
 * assimilation across that boundary as a punctuation mark does (`boundaries.ts`), takes no note of its
 * own, and never prints in the Russian. In the IPA alone it appears, as an enclitic grafted after its
 * parent syllable (Dann, 2026-10-20 00:01; and 2026-10-21 00:26: only in the IPA line).
 *
 * THE MARK IS A FIELD OF ITS OWN, `syntacticBreak` on the word before it. It is never in `punctuation`
 * (which prints under the notes and is read by the clitic guards) and never in `cyrillic` (what was
 * typed). `pipeline.ts` peels the # off the typed tokens, so every reader of its output counts the same
 * words, whether the # stood alone, trailed its word («я#», the shape a score folds a bare # into), or led
 * the next one.
 */

export const SYNTACTIC_BREAK = '#';

/**
 * Splits typed whitespace tokens into the words they hold and, for each, whether a # ends it.
 * `isWord` says what a token must be to count as a word (`pipeline.ts` drops punctuation alone).
 *
 * - A trailing # ends the word it trails («я#»).
 * - A leading # or a token that is only #s ends the word before it («я #на», «я # на»).
 * - With no word before it, a # ends nothing and is dropped.
 * - A # inside a word is ignored: a break is between words, and the Russian never prints it.
 */
export function peelSyntacticBreaks(tokens: readonly string[], isWord: (token: string) => boolean): { words: string[]; broken: boolean[] } {
	const words: string[] = [];
	const broken: boolean[] = [];
	for (const token of tokens) {
		const [, lead, core, trail] = /^(#*)(.*?)(#*)$/u.exec(token)!;
		if (lead && words.length > 0) broken[words.length - 1] = true;
		if (core && isWord(core)) {
			words.push(core.replace(/#/g, ''));
			broken.push(trail !== '');
		} else if (trail && words.length > 0) broken[words.length - 1] = true;
	}
	return { words, broken };
}

/** A syllable's IPA with the mark grafted after it, when `word` ends in a syntactic break and this is its last syllable. */
export function graftBreak(word: { syntacticBreak?: boolean; syllables: readonly unknown[] }, k: number, ipa: string): string {
	return word.syntacticBreak && k === word.syllables.length - 1 ? ipa + SYNTACTIC_BREAK : ipa;
}
