/**
 * The capture's count-in: sing the vowel first, pause, then fry.
 *
 * Row 2d part 3, `docs/sessions/brief-code-sing-first-then-fry_r1_2026-09-30.md`.
 * The flow and its strings were RATIFIED by Dann 2026-09-30 21:00. His reason
 * (20:59): most singers are not comfortable going from modal singing straight
 * into fry, so they are given a moment between the two. The sung vowel sets the
 * vocal tract; nothing is captured until the fry step, and the live gate, the
 * sweep, and the engine are unchanged.
 *
 * Kept out of the component so the order and the intervals are testable
 * without mounting it.
 */

/** DESK DEFAULT 2026-09-30: one beat of the sung count. Was 700 ms. */
export const SING_BEAT_MS = 1000;
/**
 * DESK DEFAULT 2026-09-30: the silent moment between the sung vowel and the fry. Was 2000 ms; 3000 ms from N.199 Step 7 (DESK DEFAULT 2026-11-13,
 * Dann's to strike) so the 13-word pause line, "Stop singing, but maintain the shape of your vocal tract for that vowel.", can be read. Every singer's count-in
 * is six seconds at the ship (the wheel's re-export, `pacifier/count-in.ts`, went with the wheel in N.199 Step 8).
 */
export const PAUSE_MS = 3000;

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
