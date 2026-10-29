/**
 * The language of a text row, with no poem to compare it to (N.135, stage 2a).
 *
 * Decision 1 of the stage 1 harness (4.3): "Dictionary witness". A row is
 * Russian where at least `RUSSIAN_SHARE` of its sewn words of two or more
 * letters are entries of the dictionary (half in the harness, three in ten
 * since brief r5 step 1). The singer gives no poem (Dann 2026-10-01 23:06),
 * so the row is judged by its own words.
 *
 * The dictionary is passed in as a function, on the pattern of
 * `unknownWordShare(text, isKnownWord)` in `score/ingestion/ocr-guard.ts`:
 * `pipeline.ts` names itself the only importer of `@ilya/dictionary`, and the
 * ratchets breach a relative import into `packages/`. The caller hands in
 * `isKnownWord` from `pipeline.ts`.
 *
 * Modernizing is the caller's too. The harness modernized each word with
 * `modernisePreReform` before the lookup, so a pre-reform «міръ» counted as
 * «мир». Here that belongs in `isWord`, where the dictionary is: try the word as
 * read, then its modern form.
 */

/** The row is in Russian, or in something else (another language, a tempo mark, a piano head). */
export type RowLanguage = 'russian' | 'other';

/** A word counts toward the decision with this many letters or more. */
export const MIN_LETTERS = 2;
/**
 * A row is Russian where this share of its counted words, or more, are entries.
 * 0.5 until brief r5 step 1: a replay on a fresh capture of the 18 build songs
 * (`report-desk-n135-a2-fixes-18-songs_r1_2026-10-28.md`) read right 1,514 to
 * 1,836 of 2,538 at 0.3, with the long-dash limit (`underlay-tokens.ts`) left as built.
 */
export const RUSSIAN_SHARE = 0.3;

/** Letters only, lower-cased: «Ты,» is «ты». */
function lettersOf(word: string): string {
	return word.replace(/[^\p{L}]/gu, '').toLowerCase();
}

/**
 * Whether the dictionary holds the word: null for a word of fewer than
 * `MIN_LETTERS` letters, which counts toward nothing; else true or false.
 * `isWord` is asked for the word's letters in lower case, and, where the word
 * holds a ё, again with it written е.
 */
export function wordKnown(word: string, isWord: (word: string) => boolean): boolean | null {
	const letters = lettersOf(word);
	if ([...letters].length < MIN_LETTERS) return null;
	return isWord(letters) || (letters.includes('ё') && isWord(letters.replace(/ё/g, 'е')));
}

/**
 * `words` are the row's sewn words, as read (`sewWords`, joined). A row with
 * no word of two letters or more is `other`: there is nothing to witness.
 */
export function rowLanguage(words: string[], isWord: (word: string) => boolean): RowLanguage {
	let counted = 0;
	let known = 0;
	for (const word of words) {
		const here = wordKnown(word, isWord);
		if (here === null) continue;
		counted++;
		if (here) known++;
	}
	return counted > 0 && known >= RUSSIAN_SHARE * counted ? 'russian' : 'other';
}
