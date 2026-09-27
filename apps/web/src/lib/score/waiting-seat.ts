/**
 * N.161b, "the waiting seat." What `+page.svelte`'s `transcribeText` does
 * when it spends `scoreSeatWaiting`: the score's own seat for a poem box the
 * score filled while the dictionary was still loading (N.134).
 *
 * THE WINDOW IS REAL, reproduced 2026-09-21 on the engraved Sunless no. 1 with
 * the dictionary held: the loupe's syllable row draws the score's own queue
 * (`slotQueue` falls back to `scoreTextQueue`), a singer can place by hand,
 * and the old spend, `seatFilledPoem`, re-ran the clitic fold over the run
 * and put «в бью» back on the note they had just decided.
 *
 * WHY NOT GATE IT LIKE ITS THREE SIBLINGS. The seat only waits where the map
 * was empty before the merge, so `shouldFoldOnArrival` said yes and the fold
 * ALREADY RAN, whole, at arrival. The map therefore always holds the fold's
 * run by the time this is spent, and a "no syllable placed" gate would refuse
 * every fold-bearing score, leaving everything before the clitic unplaced
 * even when nobody touched a note.
 *
 * SO: THE WORDS INTO EMPTY NOTES, AND THE FOLD ONLY FROM NOTHING.
 * `seatScoreWords` never overwrites a decided note and never seats a slot
 * twice, so a hand placement survives it. The fold runs only where the map
 * holds no syllable (`first-seat.ts`, "the fold runs only where placements are
 * built from nothing"), and then FIRST, the order `applyArrival` measured
 * (`score-seat.test.ts`). A partial fold is never run: the fold is whole at
 * arrival or not at all here.
 */

import { seatCliticFolds } from './clitic-seat';
import { shouldFoldOnArrival } from './first-seat';
import type { PairingMap } from './pairings';
import { seatScoreWords } from './score-seat';
import type { LineData } from '$lib/types';
import type { ParsedScore } from '@ilya/score-parser';

/**
 * @param parsed the score whose seat was waiting
 * @param pairings the song's placements as they stand when the dictionary lands
 * @param lines the poem's transcription, built from the text the score filled
 */
export function seatWaitingScore(
	parsed: ParsedScore,
	pairings: PairingMap,
	lines: LineData[],
): PairingMap {
	const folded = shouldFoldOnArrival(pairings) ? seatCliticFolds(parsed, pairings) : pairings;
	return seatScoreWords(parsed, folded, lines).map;
}
