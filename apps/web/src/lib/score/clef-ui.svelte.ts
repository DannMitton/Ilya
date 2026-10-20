/**
 * clef-ui.svelte.ts: the Clef choice the Input band's row, the chip on Markup's
 * page 1, and the clef button share (QUEUE rows 127 and 144).
 *
 * The same shape as `tempo-ui.svelte.ts`, for the same reason: the row sits in the
 * drawer, which has no song, and `+page.svelte` is at its ceiling, so the page
 * calls `bind` once with closures over the song, the score it shows, and the
 * singer's range. One state, every door: the select, the chip, the clef button's
 * menu, and the octave line's tap all write `SongRecord.octaveReading`.
 *
 * Under vitest the runes are inert (`document.svelte.ts` records why).
 */
import type { ParsedScore, Pitch } from '@ilya/score-parser';
import type { OctaveReading } from '$lib/library/types';
import { clefChoiceOf, clefOptions, readingClef, readingOf, type ClefChoice, type ClefOptions, type ClefReading } from './clef-choice';

type Range = { lowest: Pitch; highest: Pitch } | undefined;
type Song = { octaveReading: OctaveReading | null; clefChipShown: boolean };

/** The ratified string behind each choice (`upload.ask.clef*` and `octave.*`; none is new). */
export const CLEF_CHOICE_KEY: Record<ClefChoice, string> = {
	range: 'octave.toForRange',
	ottava: 'upload.ask.clefTrebleOttava',
	bass: 'upload.ask.clefBass',
	'as-written': 'octave.toAsWritten',
};

export class ClefUi {
	#song: () => Song = () => ({ octaveReading: null, clefChipShown: false });
	#score: () => ParsedScore | null | undefined = () => null;
	#range: () => Range = () => undefined;
	/** The score the chip was last raised for, so a different song starts clean. */
	#chipScore: ParsedScore | null | undefined = undefined;

	/** The chip is up now. */
	chipOpen = $state(false);
	/** The menu (or the phone's sheet) is open, from the clef button. */
	menuOpen = $state(false);

	bind(song: () => Song, score: () => ParsedScore | null | undefined, range: () => Range): void {
		this.#song = song;
		this.#score = score;
		this.#range = range;
	}

	get choice(): ClefChoice {
		return clefChoiceOf(this.#song().octaveReading);
	}

	get reading(): ClefReading {
		return readingClef(this.#score(), this.#range(), this.#song().octaveReading);
	}

	/** The choices to offer on this song, and which is in force. */
	get menu(): ClefOptions {
		return clefOptions(this.#score(), this.#range(), this.#song().octaveReading);
	}

	/** The reading's sentence: a ratified `octave.*` string key. */
	get sentenceKey(): string {
		const shift = this.reading.shift;
		return shift < 0 ? 'octave.readLower' : shift > 0 ? 'octave.readHigher' : 'octave.asWrittenState';
	}

	/** Whether the Clef row, the chip, and the clef button show: the score has a voice line. */
	get shown(): boolean {
		return this.reading.shown;
	}

	choose = (next: ClefChoice): void => {
		this.#song().octaveReading = readingOf(next);
		this.chipOpen = false;
		this.menuOpen = false;
	};

	/**
	 * Raises the chip the first time a song is drawn in Markup, and stores that it was shown with the
	 * song. A different score than the last call starts clean. Returns whether the chip is up.
	 */
	raiseChip = (): boolean => {
		const score = this.#score();
		if (score !== this.#chipScore) {
			this.#chipScore = score;
			this.chipOpen = false;
			this.menuOpen = false;
		}
		const song = this.#song();
		if (this.shown && !song.clefChipShown && !this.chipOpen) {
			song.clefChipShown = true;
			this.chipOpen = true;
		}
		return this.chipOpen;
	};

	dismissChip = (): void => {
		this.chipOpen = false;
	};

	openMenu = (): void => {
		this.chipOpen = false;
		this.menuOpen = true;
	};

	closeMenu = (): void => {
		this.menuOpen = false;
	};

	/** The octave line's tap: as written, or back to the default. From any explicit choice it goes to as written. */
	toggle = (): void => {
		this.#song().octaveReading = this.#song().octaveReading === 'as-written' ? null : 'as-written';
	};
}

export const clefUi = new ClefUi();
