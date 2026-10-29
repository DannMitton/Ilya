/**
 * The hybrid cut (N.135 stage 2b, configuration C2 of the desk's lever 2
 * measure): a token that holds two or more vowel letters is cut into the
 * engine's own syllables, each placed inside the token's box in proportion to
 * its letters; a token with one vowel or none stays whole.
 *
 * The engine's cut, `GraysonEngine.syllabify` (`packages/phonology/src/engine.ts`),
 * is passed in as `cut`, never imported here (stage 2a review, amendment 4):
 * the engine lowercases and drops punctuation, so each piece's text is taken
 * from the token itself, with its capitals and its marks. Every piece but the
 * last ends in a hyphen, so that `sewWords` joins them into the word the print
 * has; a hyphen at the token's end or start stays where it was.
 *
 * Where the engine's pieces do not add up to the token's letters, the token
 * stays whole and is counted. Pure.
 */
import type { Token } from './underlay-seat';

/**
 * The vowel letters, as `CYRILLIC_VOWEL` in `score/vowel-resolver.ts` has them
 * (ѣ, і, and ѵ included). A second copy: `underlay-units.test.ts` holds the
 * two equal.
 */
export const VOWEL = /[аеёиоуыэюяѣіѵ]/iu;
const VOWELS = /[аеёиоуыэюяѣіѵ]/giu;
const LETTER = /\p{L}/u;

export interface CutCounts {
	/** Tokens cut into two or more pieces. */
	cut: number;
	/** Tokens left whole: one vowel or none. */
	whole: number;
	/** Tokens with two vowels or more that stayed whole because the cut did not add up to them. */
	mismatched: number;
}

/** The units of a row: the tokens, with those of two vowels or more cut. */
export function cutUnits(tokens: readonly Token[], cut: (word: string) => string[]): { units: Token[]; counts: CutCounts; origin: number[] } {
	const units: Token[] = [];
	/** For each unit, the index of the token it came from. */
	const origin: number[] = [];
	const counts: CutCounts = { cut: 0, whole: 0, mismatched: 0 };
	for (const [at, token] of tokens.entries()) {
		const chars = Array.from(token.text);
		const letterAt = chars.flatMap((c, i) => (LETTER.test(c) ? [i] : []));
		const word = letterAt.map((i) => chars[i]).join('');
		if ((word.match(VOWELS) ?? []).length < 2) {
			units.push(token);
			origin.push(at);
			if (letterAt.length > 0) counts.whole++;
			continue;
		}
		let pieces: string[] = [];
		try {
			pieces = cut(word);
		} catch {
			pieces = [];
		}
		const lengths = pieces.map((p) => Array.from(p).length);
		if (pieces.length < 2 || lengths.some((n) => n === 0) || pieces.join('') !== word.toLowerCase() || lengths.reduce((a, b) => a + b, 0) !== letterAt.length) {
			units.push(token);
			origin.push(at);
			counts.mismatched++;
			continue;
		}
		counts.cut++;
		// Letter k of the token belongs to the piece whose cumulative length passes it; marks go with the letter before them,
		// and any before the first letter with the first piece.
		const pieceOfLetter: number[] = [];
		lengths.forEach((n, p) => {
			for (let i = 0; i < n; i++) pieceOfLetter.push(p);
		});
		const text = pieces.map(() => '');
		let seen = -1;
		chars.forEach((c, i) => {
			if (letterAt.includes(i)) seen++;
			text[pieceOfLetter[Math.max(0, seen)]] += c;
		});
		let x = token.x0;
		pieces.forEach((_, p) => {
			const width = ((token.x1 - token.x0) * lengths[p]) / letterAt.length;
			units.push({ text: p < pieces.length - 1 ? `${text[p]}-` : text[p], x0: x, x1: x + width });
			origin.push(at);
			x += width;
		});
	}
	return { units, counts, origin };
}
