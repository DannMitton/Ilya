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

/**
 * Where the boxes came from, counted for the console (row 181 B0 step 3): `placed` pieces put where their own vowel's ink is,
 * `fallbackNoMatch` tokens whose letter boxes were missing or did not match the token's letters (the letter share stands), and
 * `fallbackNoVowel` pieces that hold no vowel letter (the letter share stands). On row 114 f1 the desk's measure gave 0 fallbacks.
 */
export interface VowelBoxCounts {
	placed: number;
	fallbackNoMatch: number;
	fallbackNoVowel: number;
}

export const noVowelBoxes = (): VowelBoxCounts => ({ placed: 0, fallbackNoMatch: 0, fallbackNoVowel: 0 });

/**
 * A token's letter boxes, one for each of its letters in order, where they are the token's own: the reader's boxes that hold a letter
 * (a box of a mark is dropped), each of one letter only, the letters equal to the token's, case folded. Null where the token has no
 * boxes or they do not match. WHAT IT CHECKS: that the boxes are this token's letters. WHY: a position comes from the ink and only
 * from ink known to be the letter's (`CONTRACT.md` §0.2); a box set that dropped or added a letter would put a vowel under the wrong
 * letter's ink. WHAT FOLLOWS when it fails: the caller keeps the letter share and counts the token (`fallbackNoMatch`).
 */
export function letterBoxes(token: Token): { c: string; x0: number; x1: number }[] | null {
	if (!token.syms) return null;
	const want = Array.from(token.text).filter((c) => LETTER.test(c)).map((c) => c.toLowerCase());
	const have = token.syms.filter((y) => Array.from(y.c).some((c) => LETTER.test(c)));
	if (have.length !== want.length) return null;
	for (const [i, y] of have.entries()) {
		const ls = Array.from(y.c).filter((c) => LETTER.test(c));
		if (ls.length !== 1 || ls[0].toLowerCase() !== want[i]) return null;
	}
	return have;
}

export interface CutCounts {
	/** Tokens cut into two or more pieces. */
	cut: number;
	/** Tokens left whole: one vowel or none. */
	whole: number;
	/** Tokens with two vowels or more that stayed whole because the cut did not add up to them. */
	mismatched: number;
}

/** The units of a row: the tokens, with those of two vowels or more cut. */
export function cutUnits(tokens: readonly Token[], cut: (word: string) => string[]): { units: Token[]; counts: CutCounts; origin: number[]; boxes: VowelBoxCounts } {
	const boxes = noVowelBoxes();
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
		// EACH PIECE IS PLACED WHERE ITS OWN VOWEL'S INK IS (row 181 B0; Dann 2026-11-05 00:32 and 00:35, `OPEN.md`, "THE VOWEL IS THE
		// NUCLEUS"; `CONTRACT.md` §0.2: a position comes from evidence, never from an arbitrary rule). WHAT IT CHECKS: that the token's
		// letter boxes (`letterBoxes`) are its letters; then the piece takes the box of the first vowel letter in it. WHY: the letter
		// share put a piece a share of the way along the word's box, which on a long vowel or a wide consonant is not where the vowel
		// is, so a syllable under a melisma landed on the neighbouring note. WHAT FOLLOWS when it fails: the letter share stands, and
		// is counted (`fallbackNoMatch` for a token whose boxes do not match, `fallbackNoVowel` for a piece with no vowel letter).
		// RELATION: `seatTokens` is unchanged and takes these boxes as it took the shares; one vowel per note is still checked by
		// `assertVowelPerNote`, which this adds no path around.
		const own = letterBoxes(token);
		if (!own) boxes.fallbackNoMatch++;
		const letters = Array.from(word);
		let first = 0;
		let x = token.x0;
		pieces.forEach((_, p) => {
			const width = ((token.x1 - token.x0) * lengths[p]) / letterAt.length;
			const vowelAt = own ? letters.findIndex((l, k) => k >= first && k < first + lengths[p] && VOWEL.test(l)) : -1;
			if (own && vowelAt < 0) boxes.fallbackNoVowel++;
			if (own && vowelAt >= 0) boxes.placed++;
			units.push({ text: p < pieces.length - 1 ? `${text[p]}-` : text[p], x0: own && vowelAt >= 0 ? own[vowelAt].x0 : x, x1: own && vowelAt >= 0 ? own[vowelAt].x1 : x + width });
			origin.push(at);
			x += width;
			first += lengths[p];
		});
	}
	return { units, counts, origin, boxes };
}
