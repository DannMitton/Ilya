/**
 * undo-wiring.svelte.ts: what the page hands the named Undo, lifted out of
 * `+page.svelte` so the page has room for the lines the Loupe's break button
 * adds (N.194 r5, step 0; `brief-code-n194-loupe-break-button_r5_2026-10-25.md`).
 *
 * A MOVE, NOT A CHANGE. The state an entry saves and the order it is written
 * back in are the ones the page held at `54c01bc` (`+page.svelte:848-865`).
 * `doc` arrives as a getter because the page reassigns it on a song switch
 * (`switchSong`), and an entry must read and write whichever document is open.
 */
import type { SongDocument } from '$lib/library/document.svelte';
import type { CorrectionCursor } from './correction-cursor.svelte';
import { UndoHistory } from './undo-history.svelte';

export function createUndoHistory(
	doc: () => SongDocument,
	cursor: CorrectionCursor,
	/** The path that transcribes (`handleInput(text, 'paste')`): the one write of the Lyrics text that re-runs the pipeline and lets the seats follow. */
	writeText: (text: string) => void,
): UndoHistory {
	return new UndoHistory(
		(withText) => ({
			corrections: doc().corrections,
			pairings: doc().pairings,
			selected: cursor.selectedEventId,
			gapAfter: cursor.gapAfter,
			gapMeasure: cursor.gapMeasure,
			seatedText: doc().seatedText,
			...(withText ? { inputText: doc().inputText } : {}),
		}),
		(entry) => {
			doc().corrections = entry.corrections;
			doc().pairings = entry.pairings;
			doc().seatedText = entry.seatedText;
			cursor.selectedEventId = entry.selected;
			cursor.gapAfter = entry.gapAfter;
			cursor.gapMeasure = entry.gapMeasure;
			/* N.194. AFTER the pairings and the seated text are back, so the transcription this starts diffs the
			   restored seated text against the restored input and reseats nothing. Only an entry that carries the
			   text writes it; every other verb leaves what the singer typed. */
			if (entry.inputText !== undefined) writeText(entry.inputText);
		},
	);
}
