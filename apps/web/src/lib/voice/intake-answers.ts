/**
 * THE INTAKE'S ANSWERS, as data (N.203 lane 61, Step 1). `InsightsIntake.svelte` held one panel; it is two stations now, "Describe your
 * voice" (the five questions on how the voice is doing) and "What INSIGHTS shares, and how" (the topics, the acoustics question, and how
 * comments appear). Both write the WHOLE `intake` object (`setOwn({ intake })`), so the function that decides what is stored lives here, once:
 * two copies of `tidy` could store two shapes.
 *
 * The component holds no state; every write is `onchange(next)` with what these functions return. Pure, so each is tested without a browser.
 */
import type { IntakeAnswers, IntakePoint, IntakeTopic } from '@ilya/score-parser';

/** The scaled questions: `top` to `softHigh` are asked in "Describe your voice", `acoustics` in "What INSIGHTS shares, and how". */
export type Scaled = 'top' | 'bottom' | 'passaggi' | 'sustained' | 'softHigh' | 'acoustics';
export const BEFORE_TOPICS: Scaled[] = ['top', 'bottom', 'passaggi', 'sustained', 'softHigh'];
export const TOPICS: IntakeTopic[] = ['high', 'low', 'passaggi', 'sustained', 'softHigh', 'other'];
export const POINTS: IntakePoint[] = [1, 2, 3, 4, 5, 'not-sure'];

/** Drops empty members so a fully cleared panel stores nothing, and the members that equal their defaults. */
export function tidy(next: IntakeAnswers): IntakeAnswers | undefined {
	const out: IntakeAnswers = { ...next };
	for (const k of Object.keys(out) as (keyof IntakeAnswers)[]) if (out[k] === undefined) delete out[k];
	if (out.topics && Object.values(out.topics).every((on) => on !== false)) delete out.topics;
	if (out.suggestions === 'two') delete out.suggestions;
	if (out.imagery === true) delete out.imagery;
	return Object.keys(out).length > 0 ? out : undefined;
}

export function withPoint(value: IntakeAnswers | undefined, q: Scaled, p: IntakePoint | undefined): IntakeAnswers | undefined {
	return tidy({ ...(value ?? {}), [q]: p });
}

export function withTopic(value: IntakeAnswers | undefined, topic: IntakeTopic, on: boolean): IntakeAnswers | undefined {
	return tidy({ ...(value ?? {}), topics: { ...(value?.topics ?? {}), [topic]: on } });
}

export function withSuggestions(value: IntakeAnswers | undefined, n: 'two' | 'all'): IntakeAnswers | undefined {
	return tidy({ ...(value ?? {}), suggestions: n });
}

export function withImagery(value: IntakeAnswers | undefined, on: boolean): IntakeAnswers | undefined {
	return tidy({ ...(value ?? {}), imagery: on });
}
