/**
 * verify-words.ts: WHICH WORDS THE PAGE LABELS "verify", in plain TypeScript.
 *
 * N.201 step 4 and amendment A7. The closed ANALYSIS band says how many words
 * carry the VERIFY label. That is a new number with one existing predicate:
 * `WordStack.svelte` drew the label for `stressSource === 'inferred'`, not a
 * clitic, not a Latin word. The predicate moved here, so the stack's label
 * and the band's count call one function and cannot disagree. The count reads
 * the lines the page draws (`effectiveLines` in `+page.svelte`), so it follows
 * the witness the singer is shown, and it is the same on MELODY.
 */
import type { LineData, WordStackData } from '$lib/types';
import { displayedWords } from './shown-ipa';

/** A clitic has no independent stress, so it is never verified on its own. */
export function isCliticWord(word: WordStackData): boolean {
	return word.stressSource === 'clitic' || word.isProclitic || word.isEnclitic;
}

/**
 * Whether the stack draws the dashed VERIFY box and its label. A Latin word
 * has no Russian stress to verify (`latin.ts`).
 */
export function isVerifyWord(word: WordStackData): boolean {
	return word.stressSource === 'inferred' && !isCliticWord(word) && !word.latin;
}

/** How many words the page draws with the VERIFY label. Zero draws no line. */
export function countVerifyWords(lines: readonly Pick<LineData, 'words'>[]): number {
	let n = 0;
	for (const line of lines) {
		for (const word of displayedWords(line.words)) if (isVerifyWord(word)) n++;
	}
	return n;
}
