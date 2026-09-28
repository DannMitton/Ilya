/**
 * press-and-hold.ts — the Correction Station's press-and-hold repeat.
 *
 * MOVED OUT OF `+page.svelte` by the audit's phase 4, slice 2, 2026-09-27
 * (`docs/sessions/brief-code-audit-correction-station_r2_2026-09-27.md`,
 * `code-audit-correction-station-map_r1_2026-09-27.md` §4). A move, not a
 * change: the two delays, the three ending events, the disabled guard, and
 * the order of every call are the ones the page held at `eab54f9`
 * (`+page.svelte:1196-1240`).
 *
 * A PLAIN MODULE, NOT A `.svelte.ts` ONE. The timers are not state anything
 * renders, so nothing here needs a rune, and the page keeps no `$state` for
 * it. A factory rather than module-level `let`s, so each page (and each test)
 * holds its own timers.
 *
 * ── PRESS AND HOLD REPEATS (N.92 slice 3) ───────────────────────────────
 * From the ruled gesture table: holding a stepper arrow or a pitch verb
 * repeats it while held, and NOTHING ELSE takes a hold. The table reserves
 * press-and-hold on the page and on the loupe deliberately, because the
 * platform trains it for text selection and for context menus.
 *
 * THE FIRST FIRE IS THE CLICK'S, not the hold's. The hold starts repeating
 * only after 400 ms, so an ordinary tap is a tap and never a tap plus a
 * repeat. 110 ms between repeats is about nine a second, which walks a
 * line at reading speed without outrunning the eye.
 *
 * IT ENDS ON ANYTHING. `pointerup`, `pointercancel`, and `pointerleave`
 * all stop it, because a repeat that outlives the finger is the worst
 * failure this can have: it would run to the end of the part.
 */

export const HOLD_DELAY = 400;
export const HOLD_EVERY = 110;

export interface PressAndHold {
	/** Wraps a verb as a `pointerdown` handler that repeats it while held. */
	onhold: (fire: () => void) => (e: PointerEvent) => void;
	/** Ends any hold in flight. `dismissLoupe` calls it. */
	stopHold: () => void;
}

export function createPressAndHold(): PressAndHold {
	let holdTimer: ReturnType<typeof setTimeout> | null = null;
	let holdBeat: ReturnType<typeof setInterval> | null = null;

	function stopHold(): void {
		if (holdTimer !== null) clearTimeout(holdTimer);
		if (holdBeat !== null) clearInterval(holdBeat);
		holdTimer = null;
		holdBeat = null;
	}

	function onhold(fire: () => void) {
		return (e: PointerEvent) => {
			stopHold();
			const target = e.currentTarget as HTMLElement | null;
			if (!target || (target as HTMLButtonElement).disabled) return;
			const end = () => {
				stopHold();
				target.removeEventListener('pointerup', end);
				target.removeEventListener('pointercancel', end);
				target.removeEventListener('pointerleave', end);
			};
			target.addEventListener('pointerup', end);
			target.addEventListener('pointercancel', end);
			target.addEventListener('pointerleave', end);
			holdTimer = setTimeout(() => {
				holdBeat = setInterval(fire, HOLD_EVERY);
			}, HOLD_DELAY);
		};
	}

	return { onhold, stopHold };
}
