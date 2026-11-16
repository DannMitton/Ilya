/**
 * The take line's arithmetic (N.203 lane 59 Step 3), kept out of the component so a test reads it without mounting anything. A line is a
 * list of named parts with weights; the take is in one of them, a fraction of the way through it. Lane 60's test fry reuses it with three
 * parts (Quiet, Breathe, Fry).
 */
export interface TakePart {
	id: string;
	label: string;
	/** Proportion of the whole line: 2, 4, 2, 4 for a vowel's take. */
	weight: number;
}

/** The vowel take's parts and weights (Dann 2026-11-15 18:54: Breathe = Shape, shorter; Sing = Fry, longer; DESK DEFAULT 2, 4, 2, 4 s). */
export const TAKE_WEIGHTS = { breathe: 2, sing: 4, shape: 2, fry: 4 } as const;
export type TakePartId = keyof typeof TAKE_WEIGHTS;
export const TAKE_PART_IDS: readonly TakePartId[] = ['breathe', 'sing', 'shape', 'fry'];

/** Where each part's fill stands, 0 to 1: full before the current part, `within` in it, empty after. */
export function partFills(parts: readonly TakePart[], current: string | null, within: number): number[] {
	const at = current === null ? -1 : parts.findIndex((p) => p.id === current);
	const w = Math.min(1, Math.max(0, within));
	return parts.map((_, i) => (at < 0 ? 0 : i < at ? 1 : i === at ? w : 0));
}

/** The whole line's progress, 0 to 100 (the progressbar's value). */
export function overallPercent(parts: readonly TakePart[], current: string | null, within: number): number {
	const total = parts.reduce((s, p) => s + p.weight, 0);
	const fills = partFills(parts, current, within);
	return Math.round((parts.reduce((s, p, i) => s + p.weight * fills[i], 0) / total) * 100);
}
