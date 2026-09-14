/**
 * score-seat.ts
 *
 * N.134: a score that arrives carrying words seats them on its own notes.
 *
 * RULED BY DANN 2026-09-14, in `docs/memory/PRODUCT.md`: *"this saves the user
 * the manual labour while they retain control of small inevitable fixes."* It
 * overturns the desk inference in `applyArrival` that held Ilya must not place
 * where the score already speaks. Ilya copies the mapping the file already
 * states, note by note. It does NOT count syllables from the top, which is what
 * `firstPass` does and why `firstPass` is not used here.
 *
 * INCREMENT 1 ONLY, a DESK DEFAULT in the brief: the poem box was EMPTY when
 * the score arrived, so the poem IS the score's words (`scoreWordsText`) and
 * the two texts align one to one. A singer's own different poem needs
 * alignment between two texts, which is increment 2 and is not built.
 *
 * WHAT THE FILE'S MAPPING IS, EXACTLY. `collectScoreWords` gives every score
 * word its cells (one per sung syllable, at that syllable's onset note) and its
 * slots (one per vowel-bearing syllable). The k-th slot of a word is the k-th
 * vowel-bearing cell of that word, by construction in `close()`. So the note a
 * nucleus goes on is that cell's own note: the note the file engraved the vowel
 * under. A melisma continuation note, and a note carrying a vowelless syllable
 * such as «сь», receive nothing, which is what `firstPass` and the clitic seat
 * leave on such notes too (E.46: Ilya never creates a melisma).
 *
 * WHAT IT REFUSES, and each refusal leaves notes undecided rather than guessed:
 *
 * - A word whose two counts disagree, the score's slots against the poem
 *   queue's slots for the same word. The brief's own instruction.
 * - The whole seat, where the two walks lose sync (`align` returns null) or the
 *   poem is not one line. The fill inserts no line breaks, so either means the
 *   poem is not the text this was built for.
 * - A note that already carries a decision, whoever made it.
 * - A slot some note already carries. That is what makes this safe to run
 *   after `seatCliticFolds` has seated its run: the fold's slots are already
 *   placed, so the note the fold left blank is never given a second copy of
 *   the piece's last syllable.
 *
 * THE CLITIC IS NOT THIS FILE'S BUSINESS. «в» owns no slot on either side, so
 * `бьющемся` counts 3 against 3 and its first slot, `в` + NBSP + `бью`, lands
 * on the `бью` note the file engraved. The ruled arrangement (Dann 2026-09-04,
 * the clitic's own note takes the fused slot and the tail closes up) is
 * `seatCliticFolds`', and the caller runs it first.
 *
 * NOTHING IS MUTATED. A new map is returned, matching `clitic-seat.ts`.
 */

import { align, carryPunctuation } from './clitic-seat';
import { buildSlotQueue, type PairingMap } from './pairings';
import { collectScoreWords, CYRILLIC_VOWEL } from './vowel-resolver';
import type { LineData } from '$lib/types';
import type { ParsedScore } from '@ilya/score-parser';

export interface ScoreSeatResult {
	map: PairingMap;
	/** Slots this pass wrote onto a note. */
	seated: number;
	/**
	 * Slots of words this pass refused because the two counts disagreed. A
	 * slot skipped because it or its note was already decided is not counted:
	 * it is placed, just not by this pass.
	 */
	withheld: number;
}

/** `"lineIndex-wordIndex-slotIndex"`, the queue's own identity for one slot. */
function slotKey(o: { lineIndex: number; wordIndex: number; slotIndex: number }): string {
	return `${o.lineIndex}-${o.wordIndex}-${o.slotIndex}`;
}

/**
 * Seat the poem's slots on the notes the score's own underlay names.
 *
 * @param lines the poem's transcription, `+page.svelte`'s `lines`, built from
 *   the text `scoreWordsText` gave the box
 */
export function seatScoreWords(
	parsed: ParsedScore,
	map: PairingMap,
	lines: readonly LineData[],
	verseNumber = 1,
): ScoreSeatResult {
	const words = collectScoreWords(parsed, verseNumber);
	if (words.length === 0 || lines.length !== 1) return { map, seated: 0, withheld: 0 };
	const queue = buildSlotQueue(lines);
	const rows = align(words, lines[0].words, queue);
	if (!rows) return { map, seated: 0, withheld: 0 };

	const next: PairingMap = { ...map };
	const placed = new Set<string>();
	for (const p of Object.values(map)) {
		if (p.kind === 'syllable') placed.add(slotKey(p.origin));
	}

	let seated = 0;
	let withheld = 0;
	for (const row of rows) {
		const nuclei = row.word.cells.filter((c) => CYRILLIC_VOWEL.test(c.text));
		const owned = row.firstSlot < 0 ? 0 : row.lastSlot - row.firstSlot + 1;
		if (owned !== row.word.slots.length || nuclei.length !== owned) {
			withheld += owned;
			continue;
		}
		for (let k = 0; k < owned; k++) {
			const slot = queue[row.firstSlot + k];
			const cell = nuclei[k];
			if (next[cell.eventId] !== undefined || placed.has(slotKey(slot.origin))) continue;
			next[cell.eventId] = {
				kind: 'syllable',
				// The file's own punctuation, where the text is the same word
				// (Dann 2026-09-04). This seat writes over the file's own cell, so
				// without it every comma the file printed would leave the page.
				cyrillic: carryPunctuation(slot.cyrillic, cell.text),
				ipa: slot.ipa,
				vowel: slot.vowel,
				origin: slot.origin,
			};
			placed.add(slotKey(slot.origin));
			seated++;
		}
	}
	return { map: next, seated, withheld };
}
