/**
 * scorer: score a recognizer's normalized output against ground truth, in
 * Fit units, per the brief's task 3.
 *
 * Four metric families:
 *   (a) note-level precision / recall / F1 on pitch and on rhythm
 *   (b) mean pitch / onset / duration shift, for matched notes
 *   (c) tessitura delta: (min, max, mean) pitch of the vocal line,
 *       recognized vs. truth
 *   (d) Alignment Error Rate (AlER): the fraction of syllables bound to
 *       the wrong note, among ground-truth syllables that had a chance to
 *       match at all (a syllable on a note the recognizer never proposed
 *       at all is an alignment failure too, and is counted as such, not
 *       silently excluded)
 *
 * Note-matching (documented per the brief's requirement to state the
 * choice): GREEDY NEAREST-ONSET, monotonic. Both sequences are walked
 * once, in onset order; for each ground-truth note, the closest
 * not-yet-used recognized note within `ONSET_TOLERANCE` whole notes is
 * taken, never matching out of order. This is simpler than full monotonic
 * DTW and was sufficient for both the perfect and corrupted self-test
 * fixtures (see `self-test.ts`); it will need revisiting once real OMR
 * output (which can insert/delete notes in bursts, not just singly) is
 * measured, and that revisiting is explicitly flagged as follow-on work
 * in the README rather than solved speculatively here.
 *
 * Known limitation (documented, not hidden): a recognizer's onset is
 * placed on the ground truth's own measure-duration timeline (see
 * `measureStartOffsets` in `ground-truth.ts`), which assumes the
 * recognizer's measure numbering agrees with the source's. Recovering
 * from a recognizer that miscounts measures (extra/missing barlines) is
 * out of scope for this scorer and is a real, separate OMR-evaluation
 * problem; note it rather than pretend it away.
 */

import type { GroundTruth, GroundTruthNote, GroundTruthVerse } from './ground-truth.ts';
function measureStartOffsets(measures: any[]): Map<number, number> {
  const offsets = new Map<number, number>(); let cumulative = 0;
  for (const m of measures) { offsets.set(m.index, cumulative); cumulative += m.expectedDuration.numerator / m.expectedDuration.denominator; }
  return offsets;
}
import type { RecognizedNote, RecognizedVerse } from './normalized-format.ts';

/** Whole notes. A quarter note is 0.25; this tolerates roughly a 32nd-note onset error before giving up on a match. */
const ONSET_TOLERANCE = 0.2;

export interface MatchedPair {
	truth: GroundTruthNote;
	recognized: RecognizedNote;
	onsetDelta: number; // recognized - truth, whole notes
	pitchDeltaSemitones: number | undefined; // recognized - truth; undefined if either side is a rest
	durationDelta: number; // recognized - truth, whole notes
	pitchMatch: boolean; // exact MIDI match (both notes, both defined, equal)
	rhythmMatch: boolean; // onset AND duration match within tolerance
}

export interface NoteScore {
	matchedCount: number;
	truthNoteCount: number; // ground truth 'note' events only (rests excluded from precision/recall denominators)
	recognizedNoteCount: number;
	unmatchedTruth: number; // missed notes (false negatives)
	unmatchedRecognized: number; // spurious notes (false positives)

	pitchPrecision: number;
	pitchRecall: number;
	pitchF1: number;

	rhythmPrecision: number;
	rhythmRecall: number;
	rhythmF1: number;

	meanPitchShiftSemitones: number | null; // over matched notes where both sides have pitch
	meanOnsetShiftWholeNotes: number | null;
	meanDurationShiftWholeNotes: number | null;
}

export interface TessituraStats {
	minMidi: number | null;
	maxMidi: number | null;
	meanMidi: number | null;
}

export interface TessituraDelta {
	truth: TessituraStats;
	recognized: TessituraStats;
	minDelta: number | null; // recognized - truth
	maxDelta: number | null;
	meanDelta: number | null;
}

export interface AlignmentErrorResult {
	/** Ground-truth syllables that had ANY chance of scoring (i.e. the note they sit on exists in ground truth). */
	syllableCount: number;
	/** Syllables whose ground-truth note matched a recognized note AND that recognized note carries the SAME syllable text. */
	correctlyAligned: number;
	/** syllableCount === 0 ? null : (syllableCount - correctlyAligned) / syllableCount */
	alignmentErrorRate: number | null;
}

export interface VerseScore {
	verseNumber: number;
	notes: NoteScore;
	tessitura: TessituraDelta;
	alignment: AlignmentErrorResult;
}

function toAbsolute(note: RecognizedNote, offsets: Map<number, number>): number {
	const measureStart = offsets.get(note.measureIndex) ?? 0;
	return measureStart + note.onset.numerator / note.onset.denominator;
}

function durationDecimal(d: { numerator: number; denominator: number }): number {
	return d.numerator / d.denominator;
}

/** Greedy nearest-onset monotonic matching. Returns pairs plus the unmatched notes on each side. */
export function matchNotes(
	truthNotes: GroundTruthNote[],
	recognizedNotes: RecognizedNote[],
	measureOffsets: Map<number, number>
): { pairs: MatchedPair[]; unmatchedTruth: GroundTruthNote[]; unmatchedRecognized: RecognizedNote[] } {
	const recWithAbs = recognizedNotes
		.map((n) => ({ n, abs: toAbsolute(n, measureOffsets) }))
		.sort((a, b) => a.abs - b.abs);

	const used = new Array(recWithAbs.length).fill(false);
	const pairs: MatchedPair[] = [];
	const unmatchedTruth: GroundTruthNote[] = [];

	let searchStart = 0;
	for (const truth of [...truthNotes].sort((a, b) => a.onsetAbsolute - b.onsetAbsolute)) {
		let bestIdx = -1;
		let bestDist = Infinity;
		for (let i = searchStart; i < recWithAbs.length; i++) {
			if (used[i]) continue;
			const dist = Math.abs(recWithAbs[i].abs - truth.onsetAbsolute);
			// Once we are clearly past the tolerance window and moving away, stop scanning further.
			if (recWithAbs[i].abs > truth.onsetAbsolute + ONSET_TOLERANCE && dist > bestDist) break;
			if (dist <= ONSET_TOLERANCE && dist < bestDist) {
				bestDist = dist;
				bestIdx = i;
			}
		}
		if (bestIdx >= 0) {
			used[bestIdx] = true;
			const recognized = recWithAbs[bestIdx].n;
			const pitchDeltaSemitones =
				truth.midi !== undefined && recognized.midi !== undefined ? recognized.midi - truth.midi : undefined;
			const onsetDelta = recWithAbs[bestIdx].abs - truth.onsetAbsolute;
			const durationDelta = durationDecimal(recognized.duration) - durationDecimal(truth.duration);
			pairs.push({
				truth,
				recognized,
				onsetDelta,
				pitchDeltaSemitones,
				durationDelta,
				pitchMatch:
					truth.type === 'note' &&
					recognized.type === 'note' &&
					pitchDeltaSemitones !== undefined &&
					pitchDeltaSemitones === 0,
				rhythmMatch:
					truth.type === 'note' &&
					recognized.type === 'note' &&
					Math.abs(onsetDelta) <= ONSET_TOLERANCE &&
					Math.abs(durationDelta) <= ONSET_TOLERANCE
			});
			// Advance the search floor monotonically, but do not skip notes a later truth note might still need.
			searchStart = Math.max(searchStart, bestIdx);
		} else {
			unmatchedTruth.push(truth);
		}
	}

	const unmatchedRecognized = recWithAbs.filter((_, i) => !used[i]).map((r) => r.n);
	return { pairs, unmatchedTruth, unmatchedRecognized };
}

function safeDiv(numerator: number, denominator: number): number {
	return denominator === 0 ? 0 : numerator / denominator;
}

function mean(values: number[]): number | null {
	if (values.length === 0) return null;
	return values.reduce((a, b) => a + b, 0) / values.length;
}

export function scoreNotes(
	truthNotes: GroundTruthNote[],
	recognizedNotes: RecognizedNote[],
	measureOffsets: Map<number, number>
): { noteScore: NoteScore; pairs: MatchedPair[]; unmatchedTruth: GroundTruthNote[] } {
	const { pairs, unmatchedTruth, unmatchedRecognized } = matchNotes(truthNotes, recognizedNotes, measureOffsets);

	const truthNoteEvents = truthNotes.filter((n) => n.type === 'note');
	const recognizedNoteEvents = recognizedNotes.filter((n) => n.type === 'note');

	const pitchMatches = pairs.filter((p) => p.pitchMatch).length;
	const rhythmMatches = pairs.filter((p) => p.rhythmMatch).length;

	const noteScore: NoteScore = {
		matchedCount: pairs.length,
		truthNoteCount: truthNoteEvents.length,
		recognizedNoteCount: recognizedNoteEvents.length,
		unmatchedTruth: unmatchedTruth.length,
		unmatchedRecognized: unmatchedRecognized.length,

		pitchPrecision: safeDiv(pitchMatches, recognizedNoteEvents.length),
		pitchRecall: safeDiv(pitchMatches, truthNoteEvents.length),
		pitchF1: 0,

		rhythmPrecision: safeDiv(rhythmMatches, recognizedNoteEvents.length),
		rhythmRecall: safeDiv(rhythmMatches, truthNoteEvents.length),
		rhythmF1: 0,

		meanPitchShiftSemitones: mean(
			pairs.map((p) => p.pitchDeltaSemitones).filter((v): v is number => v !== undefined)
		),
		meanOnsetShiftWholeNotes: mean(pairs.map((p) => p.onsetDelta)),
		meanDurationShiftWholeNotes: mean(pairs.map((p) => p.durationDelta))
	};

	noteScore.pitchF1 = safeDiv(
		2 * noteScore.pitchPrecision * noteScore.pitchRecall,
		noteScore.pitchPrecision + noteScore.pitchRecall
	);
	noteScore.rhythmF1 = safeDiv(
		2 * noteScore.rhythmPrecision * noteScore.rhythmRecall,
		noteScore.rhythmPrecision + noteScore.rhythmRecall
	);

	return { noteScore, pairs, unmatchedTruth };
}

function tessituraOf(midiValues: number[]): TessituraStats {
	if (midiValues.length === 0) return { minMidi: null, maxMidi: null, meanMidi: null };
	return {
		minMidi: Math.min(...midiValues),
		maxMidi: Math.max(...midiValues),
		meanMidi: midiValues.reduce((a, b) => a + b, 0) / midiValues.length
	};
}

export function scoreTessitura(truthNotes: GroundTruthNote[], recognizedNotes: RecognizedNote[]): TessituraDelta {
	const truthMidis = truthNotes.map((n) => n.midi).filter((m): m is number => m !== undefined);
	const recMidis = recognizedNotes.map((n) => n.midi).filter((m): m is number => m !== undefined);
	const truth = tessituraOf(truthMidis);
	const recognized = tessituraOf(recMidis);
	return {
		truth,
		recognized,
		minDelta:
			truth.minMidi !== null && recognized.minMidi !== null ? recognized.minMidi - truth.minMidi : null,
		maxDelta:
			truth.maxMidi !== null && recognized.maxMidi !== null ? recognized.maxMidi - truth.maxMidi : null,
		meanDelta:
			truth.meanMidi !== null && recognized.meanMidi !== null ? recognized.meanMidi - truth.meanMidi : null
	};
}

/**
 * AlER: among ground-truth notes carrying a syllable for this verse, what
 * fraction did NOT end up correctly aligned? "Correctly aligned" means:
 * the ground-truth note matched a recognized note (by onset, via
 * `matchNotes`), AND that recognized note carries the identical syllable
 * text. A syllable on an unmatched (missed) ground-truth note counts as
 * misaligned, not excluded, since from Fit's perspective a dropped note
 * IS a lyric re-association failure too.
 */
export function scoreAlignment(
	pairs: MatchedPair[],
	unmatchedTruth: GroundTruthNote[]
): AlignmentErrorResult {
	const truthSyllableNotes = [...pairs.map((p) => p.truth), ...unmatchedTruth].filter(
		(n) => n.syllableText !== undefined
	);
	let correctlyAligned = 0;
	for (const pair of pairs) {
		if (pair.truth.syllableText === undefined) continue;
		if (pair.recognized.syllableText === pair.truth.syllableText) correctlyAligned++;
	}
	const syllableCount = truthSyllableNotes.length;
	return {
		syllableCount,
		correctlyAligned,
		alignmentErrorRate: syllableCount === 0 ? null : (syllableCount - correctlyAligned) / syllableCount
	};
}

export function scoreVerse(
	truth: GroundTruth,
	verseNumber: number,
	recognizedVerse: RecognizedVerse
): VerseScore {
	const truthVerse = truth.verses.find((v) => v.verseNumber === verseNumber);
	if (!truthVerse) {
		throw new Error(`scoreVerse: ground truth has no verse ${verseNumber} for ${truth.pieceId}`);
	}
	const measureOffsets = measureStartOffsets(
		// Reconstruct a minimal Measure-shaped array; measureStartOffsets only reads index + expectedDuration.
		truth.measureDurations as unknown as Parameters<typeof measureStartOffsets>[0]
	);

	const { noteScore, pairs, unmatchedTruth } = scoreNotes(truthVerse.notes, recognizedVerse.notes, measureOffsets);
	const tessitura = scoreTessitura(truthVerse.notes, recognizedVerse.notes);
	const alignment = scoreAlignment(pairs, unmatchedTruth);

	return { verseNumber, notes: noteScore, tessitura, alignment };
}
