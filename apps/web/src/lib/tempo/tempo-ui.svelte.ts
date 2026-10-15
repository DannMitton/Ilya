/**
 * tempo-ui.svelte.ts — the tempo control's state, which Insights' sentence and
 * the Input band's TEMPO receipt both open and both read.
 *
 * ROW 48 (2026-10-15). A module-level instance, because the two openers sit in
 * parts of the page that share no parent short of the page itself, and
 * drilling the song, the score, and the open flag through the drawer's bands
 * would add props to files that are at their size ceilings. `+page.svelte`
 * calls `bind` once with closures over the song document and the score it
 * shows; nothing else writes to it.
 *
 * Under vitest the runes are inert (`document.svelte.ts` records why), so this
 * runs there as a plain class.
 */
import { resolveTempo, type ParsedScore, type TempoResolution } from '@ilya/score-parser';
import type { TempoChoice } from '$lib/library/types';
import { withSingerTempo } from './singer-tempo';

export class TempoUi {
	open = $state(false);

	#song: () => { tempo: TempoChoice | null } = () => ({ tempo: null });
	#score: () => ParsedScore | null | undefined = () => null;

	bind(song: () => { tempo: TempoChoice | null }, score: () => ParsedScore | null | undefined): void {
		this.#song = song;
		this.#score = score;
	}

	/** The score the tempo is read for, without the singer's tempo on it. */
	get score(): ParsedScore | null {
		return this.#score() ?? null;
	}

	get choice(): TempoChoice | null {
		return this.#song().tempo;
	}

	/** The tempo in force: the singer's, else a printed mark or word, else Ilya's estimate. Null with no score. */
	get current(): TempoResolution | null {
		const s = this.score;
		return s ? (resolveTempo(withSingerTempo(s, this.choice)) ?? null) : null;
	}

	/** What the tempo would be with no choice of the singer's: printed, or the estimate. */
	get withoutChoice(): TempoResolution | null {
		const s = this.score;
		return s ? (resolveTempo(s) ?? null) : null;
	}

	/** Sets the singer's tempo, or clears it with null ("Use Ilya's estimate"). */
	choose = (next: TempoChoice | null): void => {
		this.#song().tempo = next ? { ...next } : null;
	};

	openControl = (): void => {
		this.open = true;
	};

	closeControl = (): void => {
		this.open = false;
	};
}

export const tempoUi = new TempoUi();
