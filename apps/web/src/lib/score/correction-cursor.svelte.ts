/**
 * correction-cursor.svelte.ts — where the Correction Station's bar stands.
 *
 * MOVED OUT OF `+page.svelte` by the audit's phase 4, slice 3, 2026-09-27
 * (`docs/sessions/brief-code-audit-correction-station_r2_2026-09-27.md`,
 * `code-audit-correction-station-map_r1_2026-09-27.md` §4). A move, not a
 * change: the two fields, the three states they make, and every write are
 * the ones the page held at `9ebfdc0` (`+page.svelte:786`, `:813-849`, and
 * `:1043-1057`).
 *
 * THE SEAM IS A CLASS WITH `$state` FIELDS, as slice 1's `UndoHistory` is.
 * The page, the loupe, the drawer, and the dock all read the selection
 * inside `$derived` and templates, so the fields have to stay reactive. The
 * line the bar walks is not the cursor's: it belongs to the song document's
 * corrections, so the page hands in `line` and the class never learns what
 * a correction is.
 *
 * `cursor` AND `inGap` ARE GETTERS, NOT `$derived` FIELDS. Runes are inert
 * under vitest (`document.svelte.ts` records why), and a getter reads the
 * same answer there and in the browser, where reading `$state` through it
 * is tracked like any other read. The page wraps each in its own `$derived`,
 * so what depends on them re-runs exactly when it did before the move.
 *
 * ── THE INSERTION BAR'S PLACE (N.92 slice 3) ────────────────────────────
 * Speedy's bar stands ON an entry or IN a gap between two of them, and
 * before that slice only the first of those existed. `selectedEventId` is
 * still the entry selection, because the drawer, the page's own mark, and
 * the keyboard all read it and none of them knows about gaps; `gapAfter` is
 * the second state and the two are mutually exclusive.
 *
 * `undefined` MEANS NOT IN A GAP, and `null` means the gap before the first
 * entry. Three states need three values, and collapsing the head gap into
 * "no gap" would make the one place a part can be extended from
 * unreachable.
 */
import type { VocalLineEvent } from '@ilya/score-parser';
import { stepCursor, type Cursor } from './entry';

export class CorrectionCursor {
	selectedEventId = $state<string | null>(null);
	gapAfter = $state<string | null | undefined>(undefined);

	readonly #line: () => readonly VocalLineEvent[];
	readonly #gapsAreStops: () => boolean;

	/**
	 * `line` returns the line as the page draws it, corrections applied.
	 * `gapsAreStops` answers whether the carets are drawn right now
	 * (`LoupePanel.caretsShown`); it defaults to always, the walk before the
	 * calm-loupe brief.
	 */
	constructor(line: () => readonly VocalLineEvent[], gapsAreStops: () => boolean = () => true) {
		this.#line = line;
		this.#gapsAreStops = gapsAreStops;
	}

	get cursor(): Cursor | null {
		return this.gapAfter !== undefined
			? { kind: 'gap', after: this.gapAfter }
			: this.selectedEventId
				? { kind: 'entry', id: this.selectedEventId }
				: null;
	}

	get inGap(): boolean {
		return this.gapAfter !== undefined;
	}

	/* The two verbs are arrow fields so the page can hand them to a
	   component as they are, without a wrapper to keep `this`. */

	/** The one function that writes `selectedEventId` and `gapAfter` together. */
	set = (next: Cursor | null): void => {
		if (!next) {
			this.selectedEventId = null;
			this.gapAfter = undefined;
			return;
		}
		if (next.kind === 'entry') {
			this.selectedEventId = next.id;
			this.gapAfter = undefined;
		} else {
			this.selectedEventId = null;
			this.gapAfter = next.after;
		}
	};

	/**
	 * The stepper, and the DRAWER's Previous and Next note.
	 *
	 * N.92 slice 3 moved it from `neighbourId` onto `stepCursor`, so it walks
	 * entry, gap, entry rather than note to note. Two things changed with it:
	 * a rest is now a place the bar can stand, because that slice converts one
	 * back to a note, and the gaps between entries are places, because that
	 * slice enters entries into them.
	 *
	 * THE CURSOR STOPS ONLY WHERE THE SINGER CAN SEE A STOP (calm-loupe
	 * brief, desk default 2026-09-28). With no carets drawn, a gap is walked
	 * past to the entry beyond it, and a walk from a gap lands on the next
	 * entry in that direction. At the end of the line the bar stays where it
	 * stood rather than landing in a gap nobody can see.
	 */
	move = (direction: 1 | -1): void => {
		const c = this.cursor;
		if (!c) return;
		const line = this.#line();
		let next = stepCursor(line, c, direction);
		if (!this.#gapsAreStops()) {
			while (next?.kind === 'gap') next = stepCursor(line, next, direction);
		}
		if (next) this.set(next);
	};
}
