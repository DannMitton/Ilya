/**
 * replace-seat.ts
 *
 * N.157: replacing a score re-derives the seats.
 *
 * A singer corrects a score in their engraving program (adds a note the
 * engraver missed, fixes a word's spelling or punctuation) and drops the
 * corrected file onto the song. Before this module `mergeOnUpload` returned
 * the existing map untouched, so every seat kept the text it was made with,
 * the added note drew nothing, and the Markup page kept the old text while the
 * Transcription page showed the new. This is the pass that runs on a
 * replacement, after `rekeyOnArrival` and `mergeOnUpload`.
 *
 * DESK DEFAULT, 2026-10-15: a placement whose note or word is gone from the
 * new file is KEPT and counted, never deleted. The singer's hand placements
 * are not touched.
 *
 * THE FOUR RULES, in order:
 *
 * 1. Split the map into LIVE and ORPHANED. Live: the entry's event id is a
 *    sung note of the replacement. Orphaned: the rest. Orphans are set aside.
 * 2. Refresh the live seats' text with `refreshPairings`. A seat whose
 *    `origin.word` still matches the slot at its origin reads that slot's
 *    Cyrillic and IPA, punctuation included. A seat whose word differs is left
 *    exactly as stored, because a different word at the same position is a
 *    different decision. No punctuation rule is written here: the period is
 *    already in the slot text.
 * 3. Seat the notes the new file adds with `seatScoreWords`. It refuses a note
 *    that already carries a decision and a slot some note already holds, so it
 *    writes only onto notes that hold nothing, and only where the file's word
 *    matches the poem's. The orphans are not in the map it is given, so a slot
 *    an orphan held can be seated again on the note the file now names for it:
 *    that is what makes a moved note draw again. Where `align` returns null (a
 *    file word that no longer matches the poem) it seats nothing.
 * 4. Put the orphans back under their old ids, and count them.
 *
 * NOTHING IS MUTATED. A new map is returned.
 *
 * WITH AN EMPTY `lines` (the dictionary still loading) rule 2 refreshes
 * nothing and rule 3 seats nothing; the split and the count still happen.
 * The fresh-map path's `scoreSeatWaiting` does not cover a replacement.
 */

import { buildSlotQueue, refreshPairings, type PairingMap } from './pairings';
import { seatScoreWords } from './score-seat';
import type { LineData } from '$lib/types';
import type { ParsedScore } from '@ilya/score-parser';

export interface ReplaceSeatResult {
	map: PairingMap;
	/** Live seats whose text rule 2 brought forward. */
	refreshed: number;
	/** Slots rule 3 wrote onto a note. */
	seated: number;
	/** Entries whose note the replacement no longer has: kept, and counted. */
	orphaned: number;
}

/**
 * @param map the song's placements, after `rekeyOnArrival` and `mergeOnUpload`
 * @param parsed the replacement score
 * @param lines the poem's transcription, `+page.svelte`'s `lines`
 */
export function reseatOnReplace(
	map: PairingMap,
	parsed: ParsedScore,
	lines: readonly LineData[],
): ReplaceSeatResult {
	const sung = new Set(parsed.vocalLine.filter((ev) => ev.type !== 'rest').map((ev) => ev.id));
	const live: PairingMap = {};
	const orphans: PairingMap = {};
	for (const [id, pairing] of Object.entries(map)) (sung.has(id) ? live : orphans)[id] = pairing;

	const refreshedLive = refreshPairings(live, buildSlotQueue(lines));
	const refreshed = Object.keys(live).filter((id) => refreshedLive[id] !== live[id]).length;
	const { map: seatedLive, seated } = seatScoreWords(parsed, refreshedLive, lines);

	return {
		map: { ...seatedLive, ...orphans },
		refreshed,
		seated,
		orphaned: Object.keys(orphans).length,
	};
}
