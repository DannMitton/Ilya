/**
 * Which second look to keep (row 181, step 2).
 *
 * Each look (`underlay-looks.ts`) of a system gives rows and the reader's answer for them. A look passes where one of its
 * rows is Russian by the same test as the first look (`rowLanguage`, `underlay-language.ts`). Of those that pass, the one
 * whose Russian row holds the most dictionary words is kept; on a tie, the earlier look. `seatPage` seats a system from its
 * FIRST Russian row, so a look is scored by that row, the one that would be seated. None passes: the system stays unread.
 *
 * Pure. The dictionary is the page's (`Seams`).
 */
import type { Look } from './underlay-looks';
import { rowLanguage, wordKnown } from './underlay-language';
import { pageTokens, type RowLayout, type Seams, type WordBox } from './underlay-page';
import { rowWordSpans } from './underlay-tokens';

/** One look's rows and the reader's answer for each, keyed by the row's place in `layoutRows`. */
export interface LookRead {
	look: Look;
	layoutRows: readonly RowLayout[];
	reads: readonly (readonly WordBox[])[];
}

/** What a look came to: whether a row of it is Russian, and the dictionary words in the first such row. */
export interface LookScore {
	russian: boolean;
	known: number;
}

export function scoreLook(candidate: LookRead, seams: Seams): LookScore {
	for (const [i, row] of candidate.layoutRows.entries()) {
		const words = rowWordSpans(pageTokens(row, candidate.reads[i] ?? [])).map((w) => w.text);
		if (rowLanguage(words, seams.isWord) !== 'russian') continue;
		return { russian: true, known: words.filter((w) => wordKnown(w, seams.isWord) === true).length };
	}
	return { russian: false, known: 0 };
}

/** The index in `candidates` of the look to keep, or null where none passes. */
export function chooseLook(candidates: readonly LookRead[], seams: Seams): number | null {
	let best: number | null = null;
	let most = -1;
	candidates.forEach((c, i) => {
		const score = scoreLook(c, seams);
		if (score.russian && score.known > most) {
			best = i;
			most = score.known;
		}
	});
	return best;
}
