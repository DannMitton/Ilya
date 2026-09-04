/**
 * clitic-seat.ts
 *
 * N.111: a vowelless clitic seated alone under a sung pitch.
 *
 * THE RULE, Dann 2026-09-03: "No vowelless word in Russian can carry a pitch
 * duration on its own. All vowelless clitics concatenate to their parent
 * syllables." Bar 8 of Musorgsky's *Without Sun* no. 1 is the case that
 * numbered the item: the printed score seats «в бью» together on one quarter,
 * and the engraved MusicXML seats «в» alone on it, because Finale needs a note
 * per syllable. Every syllable from there to the end of the piece is then one
 * note late, and until this file existed a singer had no way to say so.
 *
 * THE METHOD IS DANN'S, and it is why nothing here is a new phonological
 * predicate: the score's own words go back through the transcription pipeline
 * before placement, and the pipeline's slots are what get seated. The pipeline
 * already fuses a vowelless clitic into its host (`pipeline.ts:919-943` and
 * `:960-976`, mirrored by `buildSlotQueue` at `pairings.ts:179-214`), so the
 * seat is not a new rule; it is the existing rule reaching the path a score
 * that ARRIVES WITH WORDS takes. `isVowellessClitic` and the engine's clitic
 * tables are the only sources of "vowelless clitic" consulted here.
 *
 * WHAT IT DOES NOT DO. It never applies anything: `findCliticFolds` reports and
 * `applyCliticSeat` runs only on the singer's press (E.24 §6: do not silently
 * re-seat the text without showing it). It writes no `empty` pairing, so the
 * note left over at the end of a run is UNDECIDED (E.46). And it acts on ONE
 * divergence class: everything else the comparison finds (a count that differs
 * for another reason, a composer's elision, an engraver's hyphenation Ilya does
 * not share) is withheld exactly as `vowel-resolver.ts` withholds it today
 * (E.24 §7). One-vowel-per-note is not built.
 */

import { processText } from '$lib/pipeline';
import {
	cleanForAlignment,
	collectScoreWords,
	CYRILLIC_VOWEL,
	type ScoreWord,
} from './vowel-resolver';
import { buildSlotQueue, type PairingMap, type Slot } from './pairings';
import type { LineData, WordStackData } from '$lib/types';
import type { ParsedScore } from '@ilya/score-parser';

/**
 * U+00A0 NO-BREAK SPACE, the character `buildSlotQueue` puts between a clitic
 * and its host on the Cyrillic line (`pairings.ts:52-62`). Repeated rather than
 * imported because that constant is private to that module; it is asserted
 * against the queue's own output in `clitic-seat.test.ts`.
 */
const NBSP = '\u00A0';

/** One vowelless clitic the file seated alone, and the seat that repairs it. */
export interface CliticFold {
	/** The event whose cell carries the clitic by itself. */
	cliticEventId: string;
	/** The clitic as the FILE spells it, which is what the singer can see. */
	cliticText: string;
	/** The host's first cell, as the file spells it: `бью`. */
	hostText: string;
	/** What the queue holds for the two together: `в` + NBSP + `бью`. */
	fusedText: string;
	/**
	 * The rewrite, in vocal-line order and already paired with its slot: the
	 * clitic's own note takes the fused slot, and every note after it in the run
	 * takes the queue's next slot, so the tail closes up onto the note the
	 * clitic vacated. Its length is the number of notes the seat moves.
	 *
	 * The run ends where the file's cells and the queue re-align, at the next
	 * fold, or where the queue runs out; a note past the queue's end is left
	 * UNDECIDED rather than emptied.
	 */
	seat: ReadonlyArray<{ eventId: string; slot: Slot }>;
}

/** A word's cells against its slots, so a run's offset can be read off. */
interface Aligned {
	word: ScoreWord;
	/**
	 * The pipeline word or words this score word matched. Two where the
	 * pipeline split what the file printed in one run of cells: its
	 * hyphenated-particle expansion, and the clitic a correct engraving has
	 * ALREADY folded into its host's cell, which is the case this comparison
	 * has nothing to say about and must not lose its place over.
	 */
	pipelineWords: WordStackData[];
	/** Index into the flattened cell sequence of this word's first cell. */
	firstCell: number;
	/** Index into the queue of this word's first slot, or -1 when it owns none. */
	firstSlot: number;
	/** Index into the queue of this word's last slot, or -1 when it owns none. */
	lastSlot: number;
	/**
	 * Cells minus slots, accumulated through this word. Zero means the file and
	 * the queue agree to here; one means the file is one cell ahead, which is
	 * what a clitic seated alone does and what a run of this kind looks like.
	 */
	offset: number;
}

/**
 * Every clitic fold in one score's underlay, in vocal-line order.
 *
 * `verseNumber` selects the verse, as `buildUnderlayResolvers` does. An empty
 * result is the ordinary case and carries no claim: a score with no lyrics, a
 * score whose words and the pipeline's do not align one to one, and a score
 * with no vowelless clitic all return nothing.
 */
export function findCliticFolds(parsed: ParsedScore, verseNumber = 1): CliticFold[] {
	const words = collectScoreWords(parsed, verseNumber);
	if (words.length === 0) return [];

	let lines: LineData[];
	try {
		// The SAME call `vowel-resolver.ts` makes in its move 2, on the same
		// reconstruction, so the two surfaces cannot disagree about the text.
		lines = processText(words.map((w) => w.raw).join(' '));
	} catch {
		// A pipeline failure proposes nothing. The page is what it was.
		return [];
	}
	// ONE LINE, because the input is one joined string with no break in it.
	// More than one would make `origin.wordIndex` ambiguous below, since that
	// ordinal is per line rather than per queue.
	if (lines.length > 1) return [];
	const pipelineWords = lines[0]?.words ?? [];
	const queue = buildSlotQueue(lines);
	const rows = align(words, pipelineWords, queue);
	// A WALK THAT LOST SYNC PROPOSES NOTHING. `vowel-resolver.ts` latches its
	// own fallback walk off at the first mismatch, "because its index is
	// meaningless afterwards"; this is stricter, because a cell index that is
	// meaningless is a note this item would re-seat wrongly.
	if (!rows) return [];
	const cells = words.flatMap((w) => w.cells);

	const folds: CliticFold[] = [];
	for (let k = 0; k < rows.length; k++) {
		const fold = foldAt(rows, k, queue, cells);
		if (fold) folds.push(fold);
	}
	return folds;
}

/**
 * Pair each score word with its pipeline word or words and its span of the
 * queue, or null where the walk lost sync.
 *
 * THE JOIN RULE IS THE RESOLVER'S, not a new one: one pipeline word, or two
 * where the two together clean to what the file printed
 * (`vowel-resolver.ts`'s move 3). That tolerance is what lets this run at all
 * on a CORRECTLY engraved score, where the engraver has already put «в бью» in
 * a single cell and the pipeline still reads two words there.
 */
function align(
	words: readonly ScoreWord[],
	pipelineWords: readonly WordStackData[],
	queue: readonly Slot[],
): Aligned[] | null {
	const firstSlot = new Map<number, number>();
	const lastSlot = new Map<number, number>();
	queue.forEach((s, i) => {
		if (!firstSlot.has(s.origin.wordIndex)) firstSlot.set(s.origin.wordIndex, i);
		lastSlot.set(s.origin.wordIndex, i);
	});
	const slotsOf = (index: number): number =>
		lastSlot.has(index) ? lastSlot.get(index)! - firstSlot.get(index)! + 1 : 0;

	const rows: Aligned[] = [];
	let cell = 0;
	let offset = 0;
	let j = 0;
	for (const w of words) {
		const one = pipelineWords[j];
		const two = pipelineWords[j + 1];
		let matched: number[] | null = null;
		if (one && cleanForAlignment(one.cleanWord) === w.clean) {
			matched = [j];
			j += 1;
		} else if (one && two && cleanForAlignment(one.cleanWord + two.cleanWord) === w.clean) {
			matched = [j, j + 1];
			j += 2;
		}
		if (!matched) return null;
		let owned = 0;
		for (const index of matched) owned += slotsOf(index);
		offset += w.cells.length - owned;
		const withSlots = matched.filter((index) => slotsOf(index) > 0);
		rows.push({
			word: w,
			pipelineWords: matched.map((index) => pipelineWords[index]),
			firstCell: cell,
			firstSlot: withSlots.length > 0 ? firstSlot.get(withSlots[0])! : -1,
			lastSlot: withSlots.length > 0 ? lastSlot.get(withSlots[withSlots.length - 1])! : -1,
			offset,
		});
		cell += w.cells.length;
	}
	// Pipeline words the walk never reached mean the two sides do not describe
	// the same text, whatever the prefix looked like.
	if (j !== pipelineWords.length) return null;
	return rows;
}

/**
 * The fold at word `k`, or null.
 *
 * FIVE CONDITIONS, and every one of them is a reason a candidate is refused
 * rather than repaired:
 *
 * 1. The file gave this word exactly one cell, and that cell's Cyrillic carries
 *    no vowel. A vowel-bearing proclitic on its own note (на, за) fails here,
 *    which is the negative control this item is pinned against.
 * 2. The pipeline marks the word `isVowellessClitic`, which `pipeline.ts:927`
 *    and `:972` set only inside the proclitic and enclitic branches, off the
 *    engine's own tables. No predicate is hand-rolled.
 * 3. The direction is the table's, not a guess: `isProclitic` sends the clitic
 *    forward onto the next word's first slot, `isEnclitic` back onto the
 *    previous word's last slot.
 * 4. The queue actually fused it there. Where it did not, the two sides do not
 *    agree about this word and nothing is proposed.
 * 5. The file and the queue agreed up to this word (offset zero before it, one
 *    after). A region already diverged for another reason is the withheld
 *    class, and re-seating inside it would be a guess.
 */
function foldAt(
	rows: readonly Aligned[],
	k: number,
	queue: readonly Slot[],
	cells: readonly { eventId: string; text: string }[],
): CliticFold | null {
	const row = rows[k];
	const w = row.word;
	if (w.cells.length !== 1) return null;
	if (CYRILLIC_VOWEL.test(w.cells[0].text)) return null;
	// One pipeline word, or the file has already folded this cell and there is
	// nothing here to seat.
	if (row.pipelineWords.length !== 1) return null;
	const p = row.pipelineWords[0];
	if (!p?.isVowellessClitic) return null;

	const hostIndex = p.isProclitic ? k + 1 : p.isEnclitic ? k - 1 : -1;
	const host = rows[hostIndex];
	if (!host || host.firstSlot < 0) return null;

	const fusedSlotIndex = p.isProclitic ? host.firstSlot : host.lastSlot;
	const fused = queue[fusedSlotIndex];
	if (!fused) return null;
	const expected = p.isProclitic ? p.cleanWord + NBSP : NBSP + p.cleanWord;
	if (!fused.cyrillic.includes(expected)) return null;

	if ((rows[k - 1]?.offset ?? 0) !== 0) return null;
	if (row.offset !== 1) return null;

	// The run: while the file stays exactly one cell ahead of the queue, and no
	// further than the next fold's own clitic.
	let endCell = cells.length;
	for (let j = k + 1; j < rows.length; j++) {
		if (rows[j].offset !== 1) {
			endCell = rows[j].firstCell;
			break;
		}
	}

	const seat: Array<{ eventId: string; slot: Slot }> = [];
	for (let t = 0; row.firstCell + t < endCell && fusedSlotIndex + t < queue.length; t++) {
		seat.push({ eventId: cells[row.firstCell + t].eventId, slot: queue[fusedSlotIndex + t] });
	}
	if (seat.length === 0) return null;

	return {
		cliticEventId: w.cells[0].eventId,
		cliticText: w.cells[0].text,
		hostText: host.word.cells[0]?.text ?? '',
		fusedText: fused.cyrillic,
		seat,
	};
}

/**
 * Write one fold's seat over the pairing map.
 *
 * NOTHING IS MUTATED, matching `reconcilePairings`' habit of always handing
 * back a new object. Nothing outside the run is touched, so the singer's own
 * placements before the clitic survive, and the note past the queue's end keeps
 * no entry at all: undecided, never `empty`.
 */
export function applyCliticSeat(map: PairingMap, fold: CliticFold): PairingMap {
	const next: PairingMap = { ...map };
	for (const { eventId, slot } of fold.seat) {
		next[eventId] = {
			kind: 'syllable',
			cyrillic: slot.cyrillic,
			ipa: slot.ipa,
			vowel: slot.vowel,
			origin: slot.origin,
		};
	}
	return next;
}
