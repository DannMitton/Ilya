/**
 * poem-or-score — the whole N.146 decision, as one branch table.
 *
 * `OPEN.md` N.146: "Ilya tries the likelier reading first and falls back
 * silently: staves found, read the score; the score read yields no sung
 * line, read the page as a poem; no staves, take the text layer, and with
 * none, read the page as a picture." This function is that sentence.
 *
 * EVERY FIELD HERE IS AN OUTCOME ALREADY REACHED, NEVER A TRIGGER TO REACH
 * ONE. `take()` in `ScoreUploader.svelte` owns the order attempts run in and
 * stops running them once it has an answer (there is no reason to run OCR
 * once a text layer already answered, or to read a page as a score the
 * light check never flagged); this only says what a given set of outcomes
 * adds up to, which is what makes it cheap to test exhaustively without a
 * PDF, a picture, or a page reader anywhere nearby.
 *
 * N.146 step 2: an OCR reading must also pass `ocr-guard.ts`'s
 * `passesRussianGuard` before it can become a poem -- Dann's ruling that
 * Ilya refuses a reading that is mostly not Russian words. The text-layer
 * path is not guarded: a PDF's own text is what its author typed, not a
 * machine's guess at it.
 */

import { passesRussianGuard } from './ocr-guard';

export interface PoemOrScoreOutcome {
	/** Did `staff-detect.ts`'s light check find staves on this page? */
	stavesFound: boolean;
	/** Did reading it as a score find a sung line? `null` where the score was
	 *  never attempted, because `stavesFound` was false. */
	sungLineFound: boolean | null;
	/** A PDF's own text layer (`extractPdfText`), '' where it carried none.
	 *  `null` for a picture, which has no text layer to extract. */
	textLayer: string | null;
	/** What OCR recognised (`readPictureAsPoem`'s Russian reader), '' where it
	 *  found nothing, was never run, or failed outright. */
	ocrText: string;
}

export type PoemOrScoreResult =
	| { kind: 'score' }
	| { kind: 'poem'; source: 'textLayer' | 'ocr'; text: string }
	/** Neither reading answered: no staves worth a sung line, no text layer,
	 *  and OCR found nothing either. `take()` shows the existing page-read
	 *  refusal for this, coining nothing new. */
	| { kind: 'unreadable' };

export function decidePoemOrScore(
	outcome: PoemOrScoreOutcome,
	isKnownWord: (token: string) => boolean
): PoemOrScoreResult {
	if (outcome.stavesFound && outcome.sungLineFound) return { kind: 'score' };

	const textLayer = outcome.textLayer;
	if (textLayer !== null && textLayer.trim() !== '') {
		return { kind: 'poem', source: 'textLayer', text: textLayer };
	}
	if (outcome.ocrText.trim() !== '' && passesRussianGuard(outcome.ocrText, isKnownWord)) {
		return { kind: 'poem', source: 'ocr', text: outcome.ocrText };
	}
	return { kind: 'unreadable' };
}
