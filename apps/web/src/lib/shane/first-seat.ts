/**
 * N.145, "close the gap." Whether a poem that has just finished its first
 * transcription over an attached score should be seated onto it at once.
 *
 * THE GAP THIS ANSWERS. `+page.svelte`'s `transcribeText` diffs a poem's
 * first run as unchanged: `prevGrid.length === 0` hands `emptyDiff()` to
 * `reseatAcross`, and `emptyDiff`'s own doc comment says why (`text-diff.ts`,
 * "the identity diff, for a text that did not change and for a first run").
 * `reseatAcross` returns at once on `diff.unchanged`. So a score dropped
 * before any poem existed, followed by the singer's first paste or the
 * first typing pause, used to draw the score and the transcription side by
 * side with nothing joining them: no note held a syllable until some other
 * action ran. `applyArrival` already answers the mirror case, a score
 * arriving onto a poem that is already there (`mergeOnUpload`, then a
 * lyric-bearing score's own seat where the field holds its words verbatim).
 * This is that same question asked from the other arrival order.
 *
 * ONLY A MAP WITH NO SYLLABLE IN IT QUALIFIES, and that is deliberate,
 * matching this file's own reading of the brief's wording rather than a
 * stricter "map must be wholly empty." The merge rule stays "an upload
 * never destroys placements; only the singer does, on purpose"
 * (`pairings.ts`), so once a note holds a syllable — placed by this rule,
 * by hand, or by N.112's own diff-based `reseatAcross` — a later edit must
 * never be swept back through this path. It fires once, on the map exactly
 * as it stood before any note had a syllable, and never again for that
 * score. A map that holds only `{ kind: 'melisma' }` or `{ kind: 'empty' }`
 * decisions and no `'syllable'` one still qualifies: neither is a syllable
 * placement this rule could destroy, and both are decisions a singer could
 * only have made by hand on a note the poem has not yet reached.
 */

import type { PairingMap } from './pairings';

/**
 * @param pairings the song's current placements
 * @param hasScore whether a score is attached to the open song at all
 */
export function shouldSeatFirstTranscription(pairings: PairingMap, hasScore: boolean): boolean {
	if (!hasScore) return false;
	return !Object.values(pairings).some((p) => p.kind === 'syllable');
}
