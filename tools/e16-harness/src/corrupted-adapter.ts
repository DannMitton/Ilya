/**
 * corrupted-adapter: the scorer's negative control. Starts from the SAME
 * perfect echo as `stub-adapter.ts`, then applies three deliberate,
 * independent corruptions the brief's self-test requires:
 *
 *   1. DROP a note (a middle note in the sequence, not first/last, so it
 *      does not also change tessitura range) -> pitch/rhythm RECALL must
 *      fall (a truth note now has nothing to match).
 *   2. SHIFT a pitch by a fixed, audible amount (+2 semitones on a
 *      different note) -> pitch PRECISION must fall on that note, and the
 *      mean pitch shift must move away from 0 in the correct (positive)
 *      direction.
 *   3. MIS-ATTACH a syllable: swap the syllable text of two adjacent
 *      syllable-bearing notes -> AlER must become nonzero, since a
 *      "recognized" note now carries text that belongs to its neighbour.
 *
 * Each corruption targets a DIFFERENT note, chosen deterministically (by
 * position, not randomly: this file must produce the same fixture on
 * every run so the self-test is reproducible) so the three effects can be
 * verified independently rather than one corruption masking another.
 */

import type { GroundTruth } from './ground-truth.ts';
import type { RecognizedOutput } from './normalized-format.ts';
import { stubAdapt } from './stub-adapter.ts';

const PITCH_SHIFT_SEMITONES = 2;

export function corruptedAdapt(truth: GroundTruth): RecognizedOutput {
	const perfect = stubAdapt(truth);

	const corrupted: RecognizedOutput = {
		...perfect,
		verses: perfect.verses.map((v) => ({ verseNumber: v.verseNumber, notes: v.notes.map((n) => ({ ...n })) }))
	};

	for (const verse of corrupted.verses) {
		const notes = verse.notes;
		if (notes.length < 6) continue; // too short to safely corrupt without edge effects; leave as a perfect echo

		// 1. Drop a middle note (roughly 1/3 of the way through).
		const dropIndex = Math.floor(notes.length / 3);
		notes.splice(dropIndex, 1);

		// 2. Shift a pitch on a different note (roughly 2/3 of the way through,
		// re-indexed after the splice above so it does not land on the same note).
		const shiftIndex = Math.min(Math.floor((notes.length * 2) / 3), notes.length - 1);
		const shiftTarget = notes[shiftIndex];
		if (shiftTarget.midi !== undefined) {
			shiftTarget.midi = shiftTarget.midi + PITCH_SHIFT_SEMITONES;
		}

		// 3. Mis-attach a syllable: swap the syllable text between two adjacent
		// syllable-bearing notes near the start (distinct from the drop/shift
		// targets above so the three corruptions are independently visible).
		const syllableIndices = notes
			.map((n, i) => (n.syllableText !== undefined ? i : -1))
			.filter((i) => i >= 0 && i !== dropIndex && i !== shiftIndex);
		if (syllableIndices.length >= 2) {
			const [i, j] = syllableIndices;
			const tmp = notes[i].syllableText;
			notes[i].syllableText = notes[j].syllableText;
			notes[j].syllableText = tmp;
		}
	}

	return corrupted;
}
