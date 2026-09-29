/**
 * transposition-ruler-state.svelte.ts — the Transposition ruler's wiring, N.94 slice 1.
 *
 * ONE OBJECT, SHARED BY THE THREE PLACES THAT TOUCH THE KEY: the page shell
 * builds it, the Piece band line opens it (`PieceKeyLine.svelte`), and the
 * Markup pane draws the page in its key and floats the ruler
 * (`MarkupPane.svelte`, `TranspositionRuler.svelte`). It lives here rather
 * than as props and handlers in `+page.svelte` and `MarkupPane.svelte`
 * because both files sit at their size ceilings (`ARCHITECTURE.md` invariant
 * 12; the brief's addendum of 2026-09-28 21:40).
 *
 * The choice is two numbers on the song (`SongRecord.transposition`), never
 * the transposed score (CONTRACT §6). The words and the numbers are
 * `transposition-ruler.ts`; this holds only state.
 */
import { untrack } from 'svelte';
import type { KeyChoice, ParsedScore } from '@ilya/score-parser';
import type { Language } from '$lib/i18n';
import { appliedChoice, drawInKey, pageHeader, printedKey, type NamedKey, type RulerOpening } from './transposition-ruler';

/**
 * Built during the page shell's initialisation, because the two effects need
 * a component: leaving Markup closes the ruler, and so does a switch of song
 * (`song` returns a new document then; nothing else reassigns it).
 */
export function transpositionRulerState(
	song: () => { transposition?: KeyChoice | null },
	score: () => ParsedScore | undefined,
	inMarkup: () => boolean,
	toMarkup: () => void,
) {
	let open = $state(false);
	/** Where the ruler opened and what is selected now; null while it is closed. */
	let ruler = $state<RulerOpening | null>(null);
	/** The printed key, when the ruler can offer anything for it (`printedKey`). */
	const printed = $derived(printedKey(score()?.keySignatures[0]?.signature));
	/** The song's stored choice, applied only when the printed key offers it. */
	const choice = $derived(appliedChoice(song().transposition, printed));
	/** The key the page draws: the selection while the ruler is open (ruling 12), else the song's. */
	const drawn = $derived(open && ruler ? ruler.selected : choice);

	$effect(() => {
		if (!inMarkup()) open = false;
	});
	$effect(() => {
		void song();
		untrack(() => (open = false));
	});

	return {
		get open() {
			return open;
		},
		get ruler() {
			return ruler;
		},
		get printed() {
			return printed;
		},
		get choice() {
			return choice;
		},
		/** A tap on a stop: the page redraws in it at once (ruling 12). */
		select(stop: KeyChoice): void {
			if (ruler) ruler.selected = { semitones: stop.semitones, fifths: stop.fifths };
		},
		/** "Try another key": bring Markup forward and float the ruler over it. */
		tryAnother(): void {
			if (!inMarkup()) toMarkup();
			open = true;
		},
		/** "Use this key", or "As printed" with null. */
		use(next: KeyChoice | null): void {
			song().transposition = next;
			open = false;
		},
		close(): void {
			open = false;
		},
		/**
		 * Called from the pane's effect: computes where the ruler opens once
		 * per opening (or new printed key), untracked, so sliding does not
		 * re-run the search. Cancel then restores the page by construction,
		 * because `drawn` falls back to the song's choice.
		 */
		prepare(opening: (printed: NamedKey) => RulerOpening | null): void {
			const key = open ? printed : null;
			untrack(() => (ruler = key ? opening(key) : null));
		},
		/** The score the page draws, from the printed reading (`drawInKey`). */
		draw(reading: ParsedScore): ParsedScore {
			return drawInKey(reading, printed, drawn);
		},
		/** The page's header line (ruling 13), or undefined as printed. */
		header(language: Language): string | undefined {
			return (printed && pageHeader(drawn, printed, language)) || undefined;
		},
	};
}

export type TranspositionRulerState = ReturnType<typeof transpositionRulerState>;
