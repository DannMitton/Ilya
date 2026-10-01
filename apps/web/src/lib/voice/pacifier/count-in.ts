/**
 * The Pacifier's count-in: sing the vowel first, pause, then fry.
 *
 * Row 2d part 3, `docs/sessions/brief-code-sing-first-then-fry_r1_2026-09-30.md`.
 * The flow and its strings were RATIFIED by Dann 2026-09-30 21:00. His reason
 * (20:59): most singers are not comfortable going from modal singing straight
 * into fry, so they are given a moment between the two. The sung vowel sets the
 * vocal tract; nothing is captured until the fry step, and the live gate, the
 * sweep, and the engine are unchanged.
 *
 * Kept out of `Pacifier.svelte` so the order and the intervals are testable
 * without mounting the component.
 */

/** DESK DEFAULT 2026-09-30: one beat of the sung count. Was 700 ms. */
export const SING_BEAT_MS = 1000;
/** DESK DEFAULT 2026-09-30: the silent moment between the sung vowel and the fry. */
export const PAUSE_MS = 2000;

export type CountInStep = 'sing' | 'two' | 'one' | 'pause' | 'fry';

/** When each step fires, in ms from the tap. `fry` is where capture begins. */
export const COUNT_IN: readonly { at: number; step: CountInStep }[] = [
	{ at: 0, step: 'sing' },
	{ at: SING_BEAT_MS, step: 'two' },
	{ at: 2 * SING_BEAT_MS, step: 'one' },
	{ at: 3 * SING_BEAT_MS, step: 'pause' },
	{ at: 3 * SING_BEAT_MS + PAUSE_MS, step: 'fry' }
];

/**
 * Runs the count-in. The first step fires at once, as the tap's own answer;
 * the rest go through `after`, so whoever owns the timers can cancel them all.
 */
export function runCountIn(onStep: (step: CountInStep) => void, after: (ms: number, fn: () => void) => void): void {
	for (const { at, step } of COUNT_IN) {
		if (at === 0) onStep(step);
		else after(at, () => onStep(step));
	}
}

/**
 * What a singer's tap does to a vowel in a given state. One tap begins
 * (ratified 21:00; the arm step is gone). A tap during the sung count or the
 * pause cancels. A tap while the fry is being captured is ignored, as before;
 * Escape cancels it.
 */
export function tapAction(state: string): 'begin' | 'cancel' | 'ignore' {
	switch (state) {
		case 'preparing':
		case 'pausing':
			return 'cancel';
		case 'listening':
		case 'working':
			return 'ignore';
		default:
			return 'begin';
	}
}
