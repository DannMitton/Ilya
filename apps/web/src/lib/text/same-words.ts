/**
 * N.135 STAGE 3. ARE THESE THE SAME WORDS, WHATEVER THE LINE BREAKS.
 *
 * The score's own words reach the field as one line (`scoreWordsText`,
 * `vowel-resolver.ts`), and four sites in `+page.svelte` ask whether the field
 * still holds exactly those words by string equality: the `from score` tag, the
 * score's own seat on a placing press, the waiting seat, and the first seat
 * after a transcription. Laying the Lyrics out in the poem's lines rewrites
 * the field's whitespace, and an equality that reads whitespace would turn all
 * four off and the score's own seating path (N.134, N.144) with them. So the
 * four go through this: same words in the same order, whitespace of any kind
 * and any width counting as one space. DESK DEFAULT (the review's amendment 3).
 *
 * Case, punctuation, and hyphens are NOT folded. A capital the singer changed
 * is an edit, and the `from score` tag clears on it, as it does today.
 */
export function sameWords(a: string, b: string): boolean {
	return squash(a) === squash(b);
}

function squash(text: string): string {
	return text.split(/\s+/).filter(Boolean).join(' ');
}
