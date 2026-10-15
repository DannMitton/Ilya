/**
 * tuplet-row.svelte.ts — the Correction Station's tuplet definition row.
 *
 * MOVED OUT OF `+page.svelte` by the audit's phase 4, slice 4, 2026-10-15
 * (`docs/sessions/brief-code-audit-correction-station_r2_2026-09-27.md`,
 * `code-audit-correction-station-map_r1_2026-09-27.md` §4). A move, not a
 * change: the two fields, the plain base, the fit test, and the three verbs
 * are the ones the page held at `14e2ff8` (`+page.svelte:1139-1168`).
 *
 * THE DURATION station is swapped in place for one definition row, and the
 * definition applies LIVE with no confirm, which is ruling 5 holding here as
 * it does on every other verb.
 *
 * ONE UNDO REVERSES THE WHOLE OPERATION, and that is what `#base` exists for.
 * Every nudge of a triangle re-applies the definition from the map as it
 * stood BEFORE the row was first applied, so ten nudges leave one change on
 * the stack rather than ten, and the pill reverses the tuplet rather than the
 * last nudge of it.
 *
 * `#base` IS A PLAIN FIELD, not `$state`, as it was a plain `let`: nothing
 * reads it for display, and making it reactive would only add re-runs. The
 * class holds none of the song's state; the page hands in what it reads and
 * the one function that writes the corrections, as `UndoHistory` is handed.
 */
import type { VocalLineEvent } from '@ilya/score-parser';
import type { CorrectionMap } from './correction';
import { applyTuplet, DEFAULT_TUPLET, tupletRun, type TupletDefinition } from './entry';
import type { UndoNote } from './undo-history.svelte';

export interface TupletRowDeps {
	corrections: () => CorrectionMap;
	setCorrections: (next: CorrectionMap) => void;
	/** The line as the page draws it, corrections applied. */
	line: () => readonly VocalLineEvent[];
	selectedEventId: () => string | null;
	inGap: () => boolean;
	pushUndo: (note: UndoNote) => void;
}

export class TupletRow {
	open = $state(false);
	/** The last definition, kept as the session default (Finale's own rule). */
	def = $state<TupletDefinition>({ ...DEFAULT_TUPLET });

	#base: CorrectionMap | null = null;
	readonly #deps: TupletRowDeps;

	constructor(deps: TupletRowDeps) {
		this.#deps = deps;
	}

	/** Whether the taken entry begins a run the definition's count fits. */
	get fits(): boolean {
		const id = this.#deps.selectedEventId();
		return !this.#deps.inGap() && !!id && tupletRun(this.#deps.line(), id, this.def.actualNotes).length > 0;
	}

	/* Arrow fields so the page can hand them to a component as they are. */

	openRow = (): void => {
		this.open = true;
		this.#base = null;
	};

	close = (): void => {
		this.open = false;
		this.#base = null;
	};

	apply = (next: TupletDefinition): void => {
		this.def = next;
		const id = this.#deps.selectedEventId();
		if (!id) return;
		const line = this.#deps.line();
		if (tupletRun(line, id, next.actualNotes).length === 0) return;
		if (this.#base === null) {
			this.#base = this.#deps.corrections();
			this.#deps.pushUndo({ kind: 'text', key: 'loupe.undo.tuplet' });
		}
		this.#deps.setCorrections(applyTuplet(this.#base, line, id, next));
	};
}
