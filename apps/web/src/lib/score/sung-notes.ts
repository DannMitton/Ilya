/**
 * The two pure walks over a vocal line that decide which notes may begin a syllable and which a printed slur continues, in a
 * LEAF module: they import nothing but a type. They lived in `pairings.ts` and `slur-seat.ts`, which load `vowel-resolver.ts` and
 * so `$lib/pipeline`; the arrival seam (`ingestion/`) reads them, and round 2 of cloud-lane-88 (fix 5) moved them here so the seam
 * does not pull the pipeline in. Both original modules re-export them, so no caller changes. The code is moved, not altered.
 */
import type { SlurEnd } from '@ilya/score-parser';

/**
 * The minimal shape N.142's predicate needs from an event: enough to tell a
 * rest from a note and a tie's continuation from its onset. A local,
 * structural type rather than an import of `VocalLineEvent`, because this
 * file's own rule (above) is that it never touches `VocalLineEvent`; any
 * caller's real parsed or corrected events satisfy this shape without a cast.
 */
export interface TieAwareEvent {
	id: string;
	type: 'note' | 'rest';
	tied?: { type: 'start' | 'continue' | 'stop' | 'let-ring' };
}

/**
 * The ids of notes that may begin a NEW syllable, in document order.
 *
 * N.142, Dann 2026-09-15: "a note either begins a syllable or continues
 * one," and a tie's continuation is one note WRITTEN TWICE, not a new
 * sounded event, so it can never begin one. A rest is excluded as it always
 * was; a tie's continuation is now excluded the same way.
 *
 * READS THE PREVIOUS NOTE'S `tied.type`, NOT THE NOTE'S OWN. A hand
 * correction writes `tied: { type: 'start' }` (or deletes `tied`) only onto
 * the note the correction is keyed on (`correction.ts`'s `amend`); it never
 * writes `'continue'` or `'stop'` onto the note that follows. Deciding from
 * the note's own field would miss a tie the singer just added (the
 * following note carries no `tied` at all) and would wrongly still exclude
 * a note whose tie the singer just removed (the following note still
 * carries the reader's stale `'stop'`). Tracking the state forward, note by
 * note, reads correctly in both cases because it never consults the field
 * this walk is about to overwrite for the note in hand.
 *
 * A REST DOES NOT RESET THE TIE STATE. A tie cannot sound across a rest in
 * valid notation, so this only matters for malformed input, and the correct
 * behaviour for a walk is to skip over it rather than invent a rule for data
 * that should not exist.
 *
 * `let-ring` IS NOT A CONTINUATION (spec, "THE SHAPE OF THE FIX"): it is l.v.
 * notation, not a note written twice, and it neither excludes the note that
 * carries it nor propagates to the note after.
 */
export function syllableTargetIds(events: readonly TieAwareEvent[]): string[] {
	const out: string[] = [];
	let continuesTie = false;
	for (const ev of events) {
		if (ev.type === 'rest') continue;
		if (!continuesTie) out.push(ev.id);
		continuesTie = ev.tied?.type === 'start' || ev.tied?.type === 'continue';
	}
	return out;
}

export interface SlurAwareEvent extends TieAwareEvent {
	slurs?: readonly SlurEnd[];
}

/**
 * Every note after the first under one printed slur, in document order. Only a
 * `start` end with a `partnerEventId` opens a span, and its span runs to the
 * partner, inclusive; a rest inside it is skipped and does not break the slur.
 * Overlapping or nested spans take the union; a note is counted once. The start
 * note is not a continuation.
 */
export function slurContinuationIds(events: readonly SlurAwareEvent[]): Set<string> {
	const indexOf = new Map(events.map((ev, i) => [ev.id, i] as const));
	const out = new Set<string>();
	events.forEach((ev, i) => {
		for (const end of ev.slurs ?? []) {
			if (end.type !== 'start' || end.partnerEventId === undefined) continue;
			const to = indexOf.get(end.partnerEventId);
			if (to === undefined || to <= i) continue;
			for (let k = i + 1; k <= to; k++) if (events[k].type !== 'rest') out.add(events[k].id);
		}
	});
	return out;
}
