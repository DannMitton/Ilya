/**
 * The row to seat in a system where no row passes `rowLanguage` (N.135, brief
 * `brief-n135-row-fallback_r3`, Phase 1 "DS", dictionary sewing).
 *
 * A publisher who sets wide-spaced syllables with low marks between them gives
 * a row the reader reads exactly and `rowLanguage` throws away: «ме ло чи» is
 * three tokens, none of them a word. Here the row's words are sewn, left to
 * right, by dynamic programming: from each position, 1 to `MAX_JOIN`
 * consecutive words are tried as one, a join of two or more allowed only where
 * the dictionary holds the joined word. The sewing with the most known letters
 * wins. The row qualifies when its sewn words hold at least `MIN_WORDS` words
 * of `MIN_LETTERS` letters or more and `rowLanguage` calls them Russian.
 *
 * The sewing is for this test only: the caller seats the row's tokens as they
 * are. The first qualifying row, top to bottom, is the one chosen. A row of
 * noise («і», «у», «т т ь») has no word the dictionary holds, so it never
 * qualifies.
 *
 * Whether the page is the piano alone is not known here: `applyUnderlay`
 * (`underlay-song.ts`) already drops a piano-only page's words.
 *
 * Pure.
 */
import { rowLanguage, wordKnown } from './underlay-language';

/** The most words joined into one. */
export const MAX_JOIN = 4;
/** A row qualifies with at least this many sewn words of `MIN_LETTERS` letters or more. */
export const MIN_WORDS = 3;

const letterCount = (word: string): number => [...word.replace(/[^\p{L}]/gu, '')].length;

/**
 * The row's words sewn by the dictionary: the sewing with the most known
 * letters; on a tie the one with more pieces, so a word the reader read whole
 * is never joined to its neighbour for nothing.
 */
export function sewByDictionary(words: readonly string[], isWord: (word: string) => boolean): string[] {
	const n = words.length;
	// best[i]: the best (known letters, pieces) for words[i..], and the length of the first piece that gives it.
	const best: { known: number; pieces: number; take: number }[] = Array.from({ length: n + 1 }, () => ({ known: 0, pieces: 0, take: 0 }));
	for (let i = n - 1; i >= 0; i--) {
		let chosen = { known: -1, pieces: -1, take: 1 };
		for (let k = 1; k <= Math.min(MAX_JOIN, n - i); k++) {
			const joined = words.slice(i, i + k).join('');
			const here = wordKnown(joined, isWord);
			if (k >= 2 && here !== true) continue;
			const known = (here === true ? letterCount(joined) : 0) + best[i + k].known;
			const pieces = 1 + best[i + k].pieces;
			if (known > chosen.known || (known === chosen.known && pieces > chosen.pieces)) chosen = { known, pieces, take: k };
		}
		best[i] = chosen;
	}
	const sewn: string[] = [];
	for (let i = 0; i < n; i += best[i].take) sewn.push(words.slice(i, i + best[i].take).join(''));
	return sewn;
}

/** The index of the first row, top to bottom, that qualifies once sewn; null where none does. */
export function fallbackRow(rows: readonly (readonly string[])[], isWord: (word: string) => boolean): number | null {
	for (const [r, words] of rows.entries()) {
		const sewn = sewByDictionary(words, isWord);
		const counted = sewn.filter((w) => wordKnown(w, isWord) !== null).length;
		if (counted >= MIN_WORDS && rowLanguage(sewn, isWord) === 'russian') return r;
	}
	return null;
}

