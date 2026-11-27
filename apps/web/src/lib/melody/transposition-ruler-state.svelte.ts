/**
 * transposition-ruler-state.svelte.ts — the Transposition ruler's wiring, N.94 slices 1 and 2.
 *
 * ONE OBJECT, SHARED BY THE PLACES THAT TOUCH THE KEY: the page shell
 * builds it, the Piece band line opens it (`PieceKeyLine.svelte`), the
 * Markup pane draws the page in its key and floats the ruler
 * (`MarkupPane.svelte`, `TranspositionRuler.svelte`), or docks it on a phone
 * (`TranspositionDock.svelte`), and Insights reads the song in the chosen key
 * and opens the ruler on a key it recommends (`InsightsPane.svelte`, slice 2). It lives here rather
 * than as props and handlers in `+page.svelte` and `MarkupPane.svelte`
 * because both files sit at their size ceilings (`ARCHITECTURE.md` invariant
 * 12; the brief's addendum of 2026-09-28 21:40).
 *
 * THE TAP IS THE COMMIT (Dann 2026-11-26): `commit` writes the song's choice
 * and the selection in one step and leaves the ruler open. There is no preview
 * and no button to confirm one. Closing keeps what is stored; `undo` takes
 * back the last commit, one level, while the ruler is open (DESK DEFAULT). A
 * drag is held apart in `dragged`, which the page never draws, so the paper
 * redraws once, on lift.
 *
 * The choice is two numbers on the song (`SongRecord.transposition`), never
 * the transposed score (CONTRACT §6). The words and the numbers are
 * `transposition-ruler.ts`; this holds only state.
 */
import { untrack } from 'svelte';
import type { KeyChoice, ParsedScore } from '@ilya/score-parser';
import type { Language } from '$lib/i18n';
import {
	appliedChoice,
	drawInKey,
	homeStop,
	isHome,
	pageHeader,
	printedKey,
	readout,
	sameKey,
	stopForSuggestion,
	stopKey,
	type NamedKey,
	type RulerOpening,
} from './transposition-ruler';
import { keyName } from '$lib/analysis/watchlist';

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
	/** True on a phone, where the ruler docks at the bottom edge (plate 4). */
	phone: () => boolean,
) {
	let open = $state(false);
	/** A key "Try this key" asked for, which the next opening commits. */
	let requested: KeyChoice | null = null;
	/** Where the ruler opened and what is selected now; null while it is closed. */
	let ruler = $state<RulerOpening | null>(null);
	/** The node under a drag, which feeds the readout and nothing else. */
	let dragged = $state<KeyChoice | null>(null);
	/** What the last commit replaced, for `undo`. */
	let before = $state.raw<{ stored: KeyChoice | null; selected: KeyChoice } | null>(null);
	/** The printed key, when the ruler can offer anything for it (`printedKey`). */
	const printed = $derived(printedKey(score()?.keySignatures[0]?.signature));
	/** The song's stored choice, applied only when the printed key offers it. */
	const choice = $derived(appliedChoice(song().transposition, printed));
	/** The key the page draws: the selection while the ruler is open (ruling 12), else the song's. */
	const drawn = $derived(open && ruler ? ruler.selected : choice);

	/** Closed: the stored choice stands; the drag, Undo, and any asked-for key go. */
	function close(): void {
		open = false;
		requested = null;
		dragged = null;
		before = null;
	}

	$effect(() => {
		if (!inMarkup()) untrack(close);
	});
	$effect(() => {
		void song();
		untrack(close);
	});

	/** Bring Markup forward and float the ruler over it. */
	function show(): void {
		if (!inMarkup()) toMarkup();
		open = true;
	}

	/** Writes the stop to the song and to the selection, together. */
	function commit(stop: KeyChoice): void {
		dragged = null;
		if (!ruler || !printed) return;
		const selected = { semitones: stop.semitones, fifths: stop.fifths };
		const stored = song().transposition;
		// A commit that changes nothing leaves Undo pointing at the last one that did.
		if (!sameKey(ruler.selected, selected) || !sameKey(choice ?? homeStop(printed), selected)) {
			before = { stored: stored ? { ...stored } : null, selected: { ...ruler.selected } };
		}
		ruler.selected = selected;
		song().transposition = isHome(selected, printed) ? null : { ...selected };
	}

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
		get phone() {
			return phone();
		},
		get dragged() {
			return dragged;
		},
		get canUndo() {
			return open && before !== null;
		},
		/** A tap, an arrow key, or a chip: the page redraws in it at once (ruling 12). */
		commit,
		/** The node a drag is over; null drops it without a change. */
		drag(stop: KeyChoice | null): void {
			dragged = stop;
		},
		/** The drag's release commits the node it holds. */
		lift(): void {
			if (dragged) commit(dragged);
		},
		/** Restores the choice and the selection the last commit replaced. */
		undo(): void {
			if (!ruler || !before) return;
			ruler.selected = before.selected;
			song().transposition = before.stored;
			before = null;
		},
		/** "Try another key": the ruler opens on the song's own key. */
		tryAnother(): void {
			requested = null;
			show();
		},
		/**
		 * The stop for the watch list's first suggested key, which it computed
		 * against the page as drawn (`stopForSuggestion`). Null when it named
		 * no key (a source with no mode) or the ruler cannot offer it.
		 */
		stopFor(tr: { semitones: number[]; keys?: { fifths: number }[] } | undefined): KeyChoice | null {
			const fifths = tr?.keys?.[0]?.fifths;
			return printed && fifths !== undefined ? stopForSuggestion(printed, choice, tr!.semitones[0], fifths) : null;
		},
		/** "Try this key" (Insights): Markup comes forward and `stop` is committed, with Undo (DESK DEFAULT). */
		tryKey(stop: KeyChoice): void {
			requested = stop;
			show();
		},
		/** The Piece band's "As printed" (null): writes the choice and closes. */
		use(next: KeyChoice | null): void {
			song().transposition = next;
			close();
		},
		close,
		/**
		 * Called from the pane's effect: computes where the ruler opens once
		 * per opening (or new printed key), untracked, so a commit does not
		 * re-run the search.
		 *
		 * IT OPENS ON THE SONG'S OWN KEY, the printed one when there is none, and
		 * not on Ilya's pick: opening on the pick would be a commit the singer did
		 * not make (DESK DEFAULT). A key asked for by "Try this key" is committed
		 * as the stop the opening landed on, which is the cleaner twin.
		 */
		prepare(opening: (printed: NamedKey, requested: KeyChoice | null) => RulerOpening | null): void {
			const key = open ? printed : null;
			untrack(() => {
				dragged = null;
				before = null;
				ruler = key ? opening(key, requested) : null;
				if (!ruler || !key) return;
				const asked = requested ? ruler.selected : null;
				requested = null;
				ruler.selected = choice ?? homeStop(key);
				if (asked) commit(asked);
			});
		},
		/** The score the page draws, from the printed reading (`drawInKey`). */
		draw(reading: ParsedScore): ParsedScore {
			return drawInKey(reading, printed, drawn);
		},
		/** The ruler's readout for `stop` as Ilya's pick ("Down a whole tone · C minor · Ilya's recommendation"), or undefined as printed (QUEUE row 66). */
		readoutFor(stop: KeyChoice, language: Language): string | undefined {
			return printed ? readout(stop, printed, stop, language) : undefined;
		},
		/** The key `stop` lands in, named ("C minor", « do mineur »), or undefined as printed (QUEUE row 66). */
		keyNameFor(stop: KeyChoice, language: Language): string | undefined {
			return printed ? keyName(stopKey(stop, printed), language) : undefined;
		},
		/** The page's header line (ruling 13), or undefined as printed. */
		header(language: Language): string | undefined {
			return (printed && pageHeader(drawn, printed, language)) || undefined;
		},
	};
}

export type TranspositionRulerState = ReturnType<typeof transpositionRulerState>;
