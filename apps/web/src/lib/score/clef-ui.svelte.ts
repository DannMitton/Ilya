/**
 * clef-ui.svelte.ts: the Clef choice the Input band's receipt row reads and
 * writes, and the octave line's tap shares (QUEUE row 127).
 *
 * The same shape as `tempo-ui.svelte.ts`, for the same reason: the row sits in the
 * drawer, which has no song, and `+page.svelte` is at its ceiling, so the page
 * calls `bind` once with closures over the song, the score it shows, and the
 * singer's range. One state, two doors: the select and the octave line's tap both
 * write `SongRecord.octaveReading`.
 *
 * Under vitest the runes are inert (`document.svelte.ts` records why).
 */
import type { ParsedScore, Pitch } from '@ilya/score-parser';
import type { OctaveReading } from '$lib/library/types';
import { clefChoiceOf, readingClef, readingOf, type ClefChoice, type ClefReading } from './clef-choice';

type Range = { lowest: Pitch; highest: Pitch } | undefined;

export class ClefUi {
	#song: () => { octaveReading: OctaveReading | null } = () => ({ octaveReading: null });
	#score: () => ParsedScore | null | undefined = () => null;
	#range: () => Range = () => undefined;

	bind(song: () => { octaveReading: OctaveReading | null }, score: () => ParsedScore | null | undefined, range: () => Range): void {
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

	/** Whether the Clef row shows: a downward reading applies to a line printed in treble. */
	get shown(): boolean {
		return this.reading.shown;
	}

	choose = (next: ClefChoice): void => {
		this.#song().octaveReading = readingOf(next);
	};

	/** The octave line's tap: as written, or back to the default. From bass it goes to as written. */
	toggle = (): void => {
		this.#song().octaveReading = this.#song().octaveReading === 'as-written' ? null : 'as-written';
	};
}

export const clefUi = new ClefUi();
