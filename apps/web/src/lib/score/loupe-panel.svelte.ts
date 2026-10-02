/**
 * loupe-panel.svelte.ts — the loupe's two modes and its panel.
 *
 * MOVED OUT OF `+page.svelte` by the calm-loupe brief, slice 1, 2026-09-28
 * (`docs/sessions/brief-code-calm-loupe_r1_2026-09-28.md`). The two fields
 * and the reset are the ones the page held at `9ebfdc0` (`+page.svelte:1356`
 * to `:1387`); `choose` and the two getters are this slice's.
 *
 * ── THE STATE ───────────────────────────────────────────────────────────
 * N.147, RULED BY DANN 2026-09-17: the panel's disclosure state lives "for
 * the session only, with no `localStorage` write" and "starts closed". It
 * lives on the page and not in `Loupe.svelte`, because `<Loupe>` is created
 * and destroyed on every raise and dismiss, so a field local to it would
 * reset every time the loupe closed.
 *
 * N.149. THE LOUPE'S TWO MODES. Syllables draws no carets; Corrections draws
 * them and holds the correction cells. RULED 2026-09-20: the loupe OPENS ON
 * SYLLABLES, and nothing remembers the last mode used. The panel resets with
 * the mode (desk, 2026-09-20, N.149 r2 5b): the pill's fill marks an open
 * panel, so a re-raise opens with the panel shut and neither half coloured.
 *
 * ── ONE CONDITION ───────────────────────────────────────────────────────
 * N.149 r2 5c, RULED BY DANN 2026-09-20 11:54: the carets and the pill's fill
 * are one condition, `mode === m && open`. `caretsShown` is that condition,
 * and the calm-loupe brief hangs two more things on it:
 *
 * - THE CURSOR STOPS ONLY WHERE THE SINGER CAN SEE A STOP (desk default,
 *   2026-09-28). With no carets drawn, the arrows move note to note.
 * - THE MUSIC KEYS DO NOTHING IN SYLLABLES MODE (desk default, 2026-09-27):
 *   Up, Down, `+`, `-`, the digits, `.`, and Delete. Left, Right, Escape,
 *   Undo, and Redo work in both. A shut panel counts as Syllables here, as
 *   it does for the carets: the correction cells are not on screen, so a
 *   key that changes the music would change it out of sight. CODE DEFAULT,
 *   put to the desk in the slice report.
 */
import type { LoupeMode } from './loupe';

export type { LoupeMode };

/* ── ONE KEY, ONE OWNER (calm-loupe slice 6) ─────────────────────────────
   FOUND BY THE DESK, 2026-09-28 (`memo-desk-calm-loupe-check_r1_2026-09-28.md`),
   and it is what Dann saw at 01:23: *"Arrow right exits us out of Corrections
   and seems to pull up Syllables."* A click on a mode pill left focus on the
   pill, so ArrowRight reached two handlers: the tablist's roving-tab handler
   (`handleModeKeydown`, `Loupe.svelte`) switched the tab, and the page's
   correction keys (`handleCorrectionKey`, `+page.svelte`) moved the cursor.
   MEASURED by the desk: one press flipped `aria-selected` to Syllables and
   moved the cursor; the next flipped it back and moved it again.

   DESK DEFAULT, under Dann's delegation of 2026-09-28 01:36, in two halves:
   a pointer click hands focus back, so the arrows drive the cursor; and a
   keyboard user who tabs onto the pills keeps the WAI-ARIA tabs pattern,
   because the page's handler leaves alone any key aimed inside a tablist. */

/** The page's correction keys stand down for a key aimed inside any of these. */
export const KEYS_OWNED_ELSEWHERE = 'input, textarea, select, [contenteditable="true"], [role="tablist"]';

/** Whether a keydown's target belongs to a field or a tablist, not to the cursor. */
export function keyOwnedElsewhere(target: EventTarget | null): boolean {
	const el = target as { closest?: (selector: string) => unknown } | null;
	return typeof el?.closest === 'function' && el.closest(KEYS_OWNED_ELSEWHERE) != null;
}

/**
 * Whether a click on a pill should hand focus back. A pointer click carries
 * `detail` of 1 or more; Enter or Space on a focused pill fires a click with
 * `detail` 0, and that keyboard user keeps focus on the tab.
 */
export function releasesFocus(click: Pick<MouseEvent, 'detail'>): boolean {
	return click.detail > 0;
}

export class LoupePanel {
	mode = $state<LoupeMode>('syllables');
	open = $state(false);

	/** Called when a press hides carets that were drawn (loupe remainder, item 5): the page moves a bar out of a gap. */
	readonly #onCaretsHidden: () => void;

	constructor(onCaretsHidden: () => void = () => {}) {
		this.#onCaretsHidden = onCaretsHidden;
	}

	/** The carets are drawn, the pill is filled, and the gaps are stops. */
	get caretsShown(): boolean {
		return this.mode === 'corrections' && this.open;
	}

	/** Whether pitch, duration, dot, and delete keys act. */
	get musicKeys(): boolean {
		return this.caretsShown;
	}

	/* The verbs are arrow fields so the page can hand them to `<Loupe>` as
	   they are, as `CorrectionCursor`'s are. */

	/**
	 * A press on a mode pill. Choosing a mode opens the panel, since a mode
	 * whose panel is shut is a label with nothing behind it.
	 *
	 * A SECOND PRESS ON THE FILLED PILL CLOSES THE PANEL. Dann's proposal,
	 * 2026-09-27 20:05, adopted by the calm-loupe brief. The mode stays, so
	 * the chevron reopens the same panel.
	 */
	choose = (m: LoupeMode): void => {
		const shown = this.caretsShown;
		if (this.mode === m && this.open) {
			this.open = false;
		} else {
			this.mode = m;
			this.open = true;
		}
		if (shown && !this.caretsShown) this.#onCaretsHidden();
	};

	/** The chevron. Its `aria-expanded` names this field. */
	toggle = (): void => {
		const shown = this.caretsShown;
		this.open = !this.open;
		if (shown && !this.caretsShown) this.#onCaretsHidden();
	};

	/** The loupe closed: back to Syllables, panel shut. */
	reset = (): void => {
		this.mode = 'syllables';
		this.open = false;
	};
}
