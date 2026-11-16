/**
 * The take's first eight seconds, before the fry: Breathe (2 s, silent), Sing (4 s, four soft ticks), Shape (2 s, silent). Then the fry
 * begins and the session listens. N.203 lane 59 Step 3, replacing the sung count of 2026-09-30 ("Three. Two. One.", then a 3 s pause).
 *
 * Dann's words: 2026-11-15 18:54, "Can the Breath and Keep the shape segments be the same shorter length while the Sing and Fry match a
 * lottle longer?" (DESK DEFAULT 2, 4, 2, 4 s); 2026-11-16 00:42, "The three two one coun tdown is misleading" (the spoken count leaves the
 * take; Breathe is silent and named). The sung vowel still sets the vocal tract; nothing is captured until the fry step.
 *
 * Kept out of the component so the order and the intervals are testable without mounting it.
 */

/** DESK DEFAULT 2026-11-16: the breath before the sung vowel. Silent. */
export const BREATHE_MS = 2000;
/** The sung vowel. Four soft ticks sound at the start of each of its seconds. */
export const SING_MS = 4000;
/** The silent moment between the sung vowel and the fry (was 3 s; the pause line is shorter now, "Stop. Hold that shape, silently."). */
export const SHAPE_MS = 2000;
/** One tick a second through Sing. */
export const TICK_MS = 1000;

export type CountInStep = 'breathe' | 'sing' | 'tick' | 'shape' | 'fry';

/** When each step fires, in ms from the tap. `fry` is where capture begins. A `tick` fires at the start of each second of Sing (2, 3, 4, and 5 s). */
export const COUNT_IN: readonly { at: number; step: CountInStep }[] = [
	{ at: 0, step: 'breathe' },
	{ at: BREATHE_MS, step: 'sing' },
	...[0, 1, 2, 3].map((k) => ({ at: BREATHE_MS + k * TICK_MS, step: 'tick' as const })),
	{ at: BREATHE_MS + SING_MS, step: 'shape' },
	{ at: BREATHE_MS + SING_MS + SHAPE_MS, step: 'fry' }
];

/**
 * Runs the count-in. The first step fires at once, as the tap's own answer; the rest go through `after`, so whoever owns the timers can
 * cancel them all.
 */
export function runCountIn(onStep: (step: CountInStep) => void, after: (ms: number, fn: () => void) => void): void {
	for (const { at, step } of COUNT_IN) {
		if (at === 0) onStep(step);
		else after(at, () => onStep(step));
	}
}
