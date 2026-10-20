/**
 * A printed slur over the voice is a melisma Ilya OBSERVES (QUEUE row 149; Dann
 * 2026-10-20 03:35 and 03:37).
 *
 * Dann's ruling E.46 stands: Ilya never creates a melisma. A printed slur is
 * evidence, and the first seating may observe it, by his option 1: only where
 * doing so makes the notes and the poem's syllables come out even. Where the
 * counts disagree (a phrasing slur over a syllabic passage, as some editions
 * print), the seating is today's, one syllable per note.
 *
 * THE FIRST SEATING ONLY. `mergeOnUpload` runs `firstPass` into an empty map for a
 * score that carries no words of its own (a wordless score with a typed poem).
 * A score with its own words goes to `seatScoreWords`, which copies the file's
 * cells and so already honours its melismas. The other readers of
 * `syllableTargetIds` (`+page.svelte`'s `eventIds`, `old-reader-seats.ts`,
 * `placement-scope.ts`, `heal.ts`) keep it: none of them is a first seating.
 *
 * PURE. `syllableTargetIds` is unchanged; these sit beside it.
 */
import type { SlurEnd } from '@ilya/score-parser';
import { mergeOnUpload, syllableTargetIds, type MergeResult, type Pairing, type PairingMap, type Slot, type TieAwareEvent } from './pairings';

export interface SlurAwareEvent extends TieAwareEvent {
	slurs?: readonly SlurEnd[];
}

export interface ObservedTargets {
	/** The notes that may begin a syllable: today's, or today's less the slur continuations. */
	targetIds: string[];
	/** `{ kind: 'melisma' }` for each slur continuation observed; empty where the gate did not pass. */
	marks: Record<string, Pairing>;
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

/**
 * The count gate (Dann's option 1). T is today's syllable targets and C the slur
 * continuations among them; when the poem's slot count equals T minus C, the
 * seating uses T minus C and each continuation is a melisma; otherwise T, as today.
 * The gate is taken over the whole song, once per seating, and reads only the queue
 * handed to `mergeOnUpload`.
 */
export function observedTargets(events: readonly SlurAwareEvent[], queue: readonly Slot[]): ObservedTargets {
	const targets = syllableTargetIds(events);
	const continuations = slurContinuationIds(events);
	const observed = targets.filter((id) => continuations.has(id));
	if (observed.length === 0 || queue.length !== targets.length - observed.length) return { targetIds: targets, marks: {} };
	const marks: Record<string, Pairing> = {};
	for (const id of observed) marks[id] = { kind: 'melisma' };
	return { targetIds: targets.filter((id) => !continuations.has(id)), marks };
}

/** The marks written after `firstPass`, never over a note that already carries a decision. */
export function withObservedMelismas(map: PairingMap, marks: Record<string, Pairing>): PairingMap {
	const next: PairingMap = { ...map };
	for (const [id, p] of Object.entries(marks)) if (next[id] === undefined) next[id] = p;
	return next;
}

/**
 * `mergeOnUpload` at the two first seatings (`+page.svelte`), with the observed
 * targets. The marks are written only where `firstPass` ran (`proposed`), so a
 * song that already has placements, or a score that speaks for itself, is untouched.
 */
export function mergeOnUploadObserving(
	existing: PairingMap,
	events: readonly SlurAwareEvent[],
	queue: readonly Slot[],
	scoreCarriesNoLyrics: boolean,
): MergeResult {
	const observed = observedTargets(events, queue);
	const merged = mergeOnUpload(
		existing,
		events.filter((ev) => ev.type !== 'rest').map((ev) => ev.id),
		observed.targetIds,
		queue,
		scoreCarriesNoLyrics,
	);
	return merged.proposed ? { ...merged, map: withObservedMelismas(merged.map, observed.marks) } : merged;
}
