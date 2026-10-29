/**
 * Fold the clitics the transcription knows (N.135 stage 2b, brief r5 step 4).
 *
 * Dann's ruling of 2026-10-28 (06:16, 06:19, 06:21): a syllable holds one vowel
 * and the vowel is its nucleus; a vowelless word is a clitic that joins its host
 * by its own rules; and Ilya's transcription already does this. Printed alone,
 * a «в» would take a note of its own. Here a vowelless word the transcription
 * calls a proclitic rides in the first printed token of the next word in the row
 * that has a vowel, and one it calls an enclitic rides in the last printed token
 * of the word before it. The rider joins its host with a no-break space, U+00A0,
 * as `buildSlotQueue` does (`score/pairings.ts`, `NBSP`): the third copy of that
 * space, beside `score/pairings.ts` and `score/clitic-seat.ts`. The unit keeps
 * the host token's own box.
 *
 * WHICH WORD IS A CLITIC is the transcription's call (`isProclitic` and
 * `isEnclitic`, `pipeline.ts`), passed in as `calls` by the factory
 * (`underlay-seams.ts`); `omr/` holds no clitic list and imports neither the
 * pipeline nor `score/`.
 *
 * WHICH LETTERS MAKE A WORD VOWELLESS is `VOWEL` (`underlay-units.ts`, with ѣ,
 * і, and ѵ, held equal to `score/vowel-resolver.ts`'s `CYRILLIC_VOWEL` by
 * `underlay-units.test.ts`), the set `cutUnits` already uses. It is not
 * `hasVowel` (`clitic-merge.ts`), which the pipeline uses at `pipeline.ts` for
 * the same question and which lacks those three letters: `omr/` cannot import
 * it, and the seats must agree with the cut beside them. They differ only for a
 * word whose only vowel letter is ѣ, і, or ѵ.
 *
 * A DELIBERATE DEPARTURE from `buildSlotQueue`, which also folds leftward any
 * vowelless word that is not a proclitic when a host precedes it in the line
 * (`pairings.ts`, `w.isEnclitic || (!w.isProclitic && lastInLine !== null)`):
 * here a vowelless word the transcription does not call a clitic stays a unit of
 * its own, because on a scan such a token is often a misread letter («т», «н»,
 * «Тът»). A proclitic with no host after it in the row, and an enclitic with
 * none before it, stay units of their own and are counted.
 *
 * Pure.
 */
import type { Token } from './underlay-seat';
import { VOWEL } from './underlay-units';

export const NBSP = ' ';

/** The transcription's call for a word. */
export type CliticCall = 'proclitic' | 'enclitic' | null;

/** A word of the row: its text, and the indices of the tokens that make it. */
export interface RowWord {
	text: string;
	tokens: number[];
}

export interface FoldCounts {
	/** Vowelless words folded into a host. */
	folded: number;
	/** Clitics the transcription called that had no host in the row, and stayed units of their own. */
	left: number;
}

/**
 * The row's units with its clitics folded. `origin[i]` is the token unit `i`
 * came from (`cutUnits`); `words` are the row's sewn words over the same tokens
 * and `calls` the transcription's call for each.
 */
export function foldClitics(units: readonly Token[], origin: readonly number[], words: readonly RowWord[], calls: readonly CliticCall[]): { units: Token[]; counts: FoldCounts } {
	const out = units.map((u) => ({ ...u }));
	const gone = new Set<number>();
	const counts: FoldCounts = { folded: 0, left: 0 };
	const unitsOf = (w: RowWord) => out.flatMap((_, i) => (w.tokens.includes(origin[i]) && !gone.has(i) ? [i] : []));
	const hasVowel = words.map((w) => VOWEL.test(w.text));
	const text = (w: RowWord) => unitsOf(w).map((i) => out[i].text).join('');
	const ride = (rider: RowWord, host: number, front: boolean) => {
		const into = unitsOf(words[host]);
		if (into.length === 0) return false;
		const at = front ? into[0] : into[into.length - 1];
		out[at].text = front ? `${text(rider)}${NBSP}${out[at].text}` : `${out[at].text}${NBSP}${text(rider)}`;
		for (const i of unitsOf(rider)) gone.add(i);
		counts.folded++;
		return true;
	};
	const vowelless = (i: number) => !hasVowel[i] && words[i].tokens.length > 0 && /\p{L}/u.test(words[i].text);
	// Enclitics first, left to right: «друг ж» rides in «друг».
	words.forEach((w, i) => {
		if (!vowelless(i) || calls[i] !== 'enclitic') return;
		const host = [...words.keys()].slice(0, i).reverse().find((k) => hasVowel[k] && unitsOf(words[k]).length > 0);
		if (host === undefined || !ride(w, host, false)) counts.left++;
	});
	// Proclitics, right to left, so that «в с силах» is built from the inside: «с силах», then «в с силах».
	for (let i = words.length - 1; i >= 0; i--) {
		if (!vowelless(i) || calls[i] !== 'proclitic') continue;
		const host = words.findIndex((_, k) => k > i && hasVowel[k] && unitsOf(words[k]).length > 0);
		if (host < 0 || !ride(words[i], host, true)) counts.left++;
	}
	return { units: out.filter((_, i) => !gone.has(i)), counts };
}
