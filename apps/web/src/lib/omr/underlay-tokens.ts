/**
 * Tokens from a reader's word boxes (N.135 stage 2b; stage 2a review
 * amendments 4 and 9).
 *
 * `splitTokens` is the stage 1 harness's `tokens_of`
 * (`docs/sessions/measure-n135-underlay-harness_2026-10-15/score44.py`, lines
 * 21 to 30, with `common2.py`'s `split_internal`): a word box that holds a
 * non-letter between letters, a hyphen or the period or dash a reader gives
 * where the print has a short underscore, is split there into one token for
 * each part, the box shared among the parts by their letters. This is what
 * raised reader (a) from 1,391 to 1,761 of 2,538 syllables right in the
 * harness's own count (`report-code-n135-underlay-harness_r1_2026-10-15.md`,
 * 4.2), so the measured numbers rest on it.
 *
 * Two departures, both so that `sewWords` can read the result:
 *
 * - The harness dropped the non-letter run. Here every part but the last keeps
 *   a hyphen at its end, so that «су-е» gives «су-» and «е» and the two sew
 *   into one word.
 * - A token with no letter is kept (a lone hyphen, an extender, a mark),
 *   because `seatTokens` and `sewWords` read it; the harness dropped it. A lone
 *   long dash, wider than half the row's ink height, is a mark and not a joint
 *   (stage 2a review, amendment 9): it becomes a token with no text, which
 *   `kindOf` reads as a mark.
 *
 * `rowWords` sews a row's tokens into the words `rowLanguage` judges.
 *
 * Pure.
 */
import { kindOf, type Seat, type Token } from './underlay-seat';
import { sewWords } from './underlay-words';

/** A run of non-letters (and no mark) between two letters. */
const INTERNAL = /(?<=[\p{L}\p{M}])[^\p{L}\p{M}]+(?=[\p{L}\p{M}])/u;
const LETTER = /\p{L}/gu;

export interface SplitOptions {
	/** The row's ink height in the pixels the boxes are in; absent, no dash is called a mark. */
	inkHeight?: number;
}

const letters = (s: string): number => (s.match(LETTER) ?? []).length;

/** The tokens of a row, in x order: see the header. */
export function splitTokens(tokens: readonly Token[], options: SplitOptions = {}): Token[] {
	const out: Token[] = [];
	for (const token of [...tokens].sort((a, b) => a.x0 - b.x0)) {
		const text = token.text.trim();
		if (letters(text) === 0) {
			const longDash = options.inkHeight !== undefined && kindOf(text) === 'joint' && token.x1 - token.x0 > 0.5 * options.inkHeight;
			out.push({ ...token, text: longDash ? '' : text });
			continue;
		}
		const parts = text.split(INTERNAL).filter((p) => p !== '');
		if (parts.length === 1) {
			out.push({ ...token, text });
			continue;
		}
		const total = parts.reduce((n, p) => n + letters(p), 0);
		let x = token.x0;
		parts.forEach((p, i) => {
			const width = ((token.x1 - token.x0) * letters(p)) / total;
			out.push({ text: i < parts.length - 1 ? `${p}-` : p, x0: x, x1: x + width });
			x += width;
		});
	}
	return out;
}

/** Seats for words only: each syllable token on a note of its own, as `sewWords` reads a seat. */
function asSeats(tokens: readonly Token[]): Seat[] {
	return [...tokens]
		.sort((a, b) => a.x0 + a.x1 - (b.x0 + b.x1))
		.map((t, i) => {
			const kind = kindOf(t.text);
			return {
				token: i,
				kind,
				text: t.text,
				x: (t.x0 + t.x1) / 2,
				note: kind === 'syllable' ? i : null,
				offset: null,
				by: null,
				unseated: false,
				runTogether: false,
				shared: false,
			};
		});
}

/** The words a row's tokens make: a hyphen joins, a lone hyphen joins its neighbours, and the joins' text is the word. */
export function rowWords(tokens: readonly Token[]): string[] {
	return sewWords(asSeats(tokens)).map((w) => w.syllables.map((s) => s.text).join(''));
}
