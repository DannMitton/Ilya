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
 * A SYLLABLE HYPHEN IS FOLDED (row 108 B, after row 106): `-`, U+2010, and
 * U+2011 between two letters, the set row 106 made syllable hyphens
 * (`typed-hyphens.ts`). A typed division changes no word (`cleanWord` is letters
 * only) and is never coloured, so «Ком-нат-ка» holds the score's «Комнатка».
 *
 * A TYPED # IS FOLDED TOO (row 139): a coach's syntactic break is no word and no edit of one
 * (`syntactic-break.ts`), so «я# на правду» still holds the score's «я на правду», and the `from score` tag and
 * the score's own seat stay on. Case and punctuation are NOT folded. A capital the singer changed is an
 * edit, and the `from score` tag clears on it, as it does today.
 */
export function sameWords(a: string, b: string): boolean {
	return squash(a) === squash(b);
}

function squash(text: string): string {
	return text.replace(/(?<=\p{L})[-\u2010\u2011](?=\p{L})/gu, '').replace(/#/g, '').split(/\s+/).filter(Boolean).join(' ');
}
