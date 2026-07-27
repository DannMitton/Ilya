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
	onsetDelta: number | undefined; // recognized - truth, whole notes; undefined if recognized.onset is null
	pitchDeltaSemitones: number | undefined; // recognized - truth; undefined if either side is a rest or recognized.midi is null
	durationDelta: number | undefined; // recognized - truth, whole notes; undefined if recognized.duration is null
	pitchMatch: boolean; // exact MIDI match (both notes, both defined, equal)
	rhythmMatch: boolean; // onset AND duration match within tolerance; false if either is null (fable-spec-e16-abstain-path item 5)
}

/**
 * One matched note/note pair whose durations disagree as exact rationals.
 * Additive instrument (2026-07-27): the pre-existing `rhythmMatch` /
 * `rhythmF1` figures compare durations within `ONSET_TOLERANCE` (0.2 whole
 * notes) and so cannot see a duration error smaller than that tolerance,
 * e.g. |1/8 - 1/12| ~= 0.042 (a triplet eighth read as a plain eighth).
 * This type and the `durationExact*` fields below sit BESIDE the existing
 * figures and change none of them.
 */
export interface DurationMismatch {
	truthId: string;
	recognizedId: string;
	truthDuration: { numerator: number; denominator: number };
	recognizedDuration: { numerator: number; denominator: number };
	measureIndex: number;
}

/**
 * A matched note/note pair where the reader abstained on duration rather
 * than guessing (fable-spec-e16-abstain-path, 2026-07-27, item 5, ratified).
 * Same shape as `DurationMismatch` plus `reason` (the recognized record's
 * `abstain.duration` string); `recognizedDuration` is always `null` here,
 * kept in the shape for symmetry with `DurationMismatch`. Scoped to matched
 * note/note pairs, same as `durationMismatches`. Excluded from BOTH
 * `durationExactMatches` and `durationMismatches` -- an abstention is
 * neither a match nor a wrong guess -- but the `durationExactRate`
 * denominator (`notePairs.length`) is unchanged, so an abstention costs the
 * rate exactly what a wrong guess would have cost, no more: honesty is
 * never penalized relative to guessing.
 */
export interface DurationAbstainedPair {
	truthId: string;
	recognizedId: string;
	truthDuration: { numerator: number; denominator: number };
	recognizedDuration: null;
	reason: string;
	measureIndex: number;
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

	/**
	 * Additive exact-rational duration instrument (2026-07-27). Computed
	 * over matched (truth.type === 'note' && recognized.type === 'note')
	 * pairs, the same scope `rhythmMatch` and `pitchMatch` already use.
	 * Equality is exact-rational (numerator x otherDenominator ===
	 * otherNumerator x denominator), never a float comparison, so a
	 * duration error below ONSET_TOLERANCE is still visible here even
	 * though it still counts as a rhythmMatch above.
	 */
	durationExactMatches: number;
	/** durationExactMatches / (count of matched note/note pairs, INCLUDING abstentions); 0 if there are none. */
	durationExactRate: number;
	/** Every matched note/note pair whose duration disagrees as an exact rational, for debugging. */
	durationMismatches: DurationMismatch[];

	/**
	 * Additive abstain-path instrument (fable-spec-e16-abstain-path,
	 * 2026-07-27, item 5, ratified). Count of matched note/note pairs where
	 * `recognized.duration` is `null`. durationAbstainedPairs.length.
	 */
	durationAbstentions: number;
	/** Every matched note/note pair where the reader abstained on duration, for debugging. */
	durationAbstainedPairs: DurationAbstainedPair[];
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
	if (note.onset === null) return measureStart; // defensive; callers guard against calling this on a null onset
	return measureStart + note.onset.numerator / note.onset.denominator;
}

function durationDecimal(d: { numerator: number; denominator: number }): number {
	return d.numerator / d.denominator;
}

/**
 * Build one matched pair. Shared by both the nearest-onset pass and the
 * order-based pass below (fable-spec-e16-abstain-path item 5): a `null`
 * onset or duration on the recognized side degrades the relevant delta to
 * `undefined` rather than throwing or coercing to NaN, `rhythmMatch` becomes
 * `false` (the reader does not claim the rhythm), and `pitchMatch` evaluates
 * normally (pitch is a separate facet, unaffected by a rhythm abstention).
 */
function buildPair(truth: GroundTruthNote, recognized: RecognizedNote, measureOffsets: Map<number, number>): MatchedPair {
	const hasPitch = truth.midi !== undefined && recognized.midi !== undefined && recognized.midi !== null;
	const pitchDeltaSemitones = hasPitch ? (recognized.midi as number) - (truth.midi as number) : undefined;

	const onsetDelta =
		recognized.onset !== null ? toAbsolute(recognized, measureOffsets) - truth.onsetAbsolute : undefined;

	const durationDelta =
		recognized.duration !== null ? durationDecimal(recognized.duration) - durationDecimal(truth.duration) : undefined;

	return {
		truth,
		recognized,
		onsetDelta,
		pitchDeltaSemitones,
		durationDelta,
		pitchMatch:
			truth.type === 'note' && recognized.type === 'note' && pitchDeltaSemitones !== undefined && pitchDeltaSemitones === 0,
		rhythmMatch:
			truth.type === 'note' &&
			recognized.type === 'note' &&
			onsetDelta !== undefined &&
			durationDelta !== undefined &&
			Math.abs(onsetDelta) <= ONSET_TOLERANCE &&
			Math.abs(durationDelta) <= ONSET_TOLERANCE
	};
}

/**
 * Greedy nearest-onset monotonic matching, PLUS an additive order-based pass
 * for null-onset measures (fable-spec-e16-abstain-path, 2026-07-27, item 5,
 * ratified). A duration abstention nulls its own onset and cascades `onset:
 * null` to every later record in the same measure (spec item 3), so
 * nearest-onset matching cannot locate any of them by position -- they are
 * not "near" any onset, they have none. Any measure whose RECOGNIZED records
 * include a null onset is pulled out of the nearest-onset pass entirely and
 * paired index-wise instead: truth sorted by onset, recognized in array
 * order (which is x order, as emitted). Excess on either side is missed or
 * spurious, same as the nearest-onset pass. This branch activates only on
 * records that cannot exist in any historical output (no confident record
 * ever carries a null onset), so every historical figure reproduces
 * byte-identically -- proven by acceptance test A2.
 *
 * Returns pairs plus the unmatched notes on each side.
 */
export function matchNotes(
	truthNotes: GroundTruthNote[],
	recognizedNotes: RecognizedNote[],
	measureOffsets: Map<number, number>
): { pairs: MatchedPair[]; unmatchedTruth: GroundTruthNote[]; unmatchedRecognized: RecognizedNote[] } {
	const nullOnsetMeasures = new Set<number>();
	for (const n of recognizedNotes) {
		if (n.onset === null) nullOnsetMeasures.add(n.measureIndex);
	}

	const truthNormal = truthNotes.filter((t) => !nullOnsetMeasures.has(t.measureIndex));
	const recNormal = recognizedNotes.filter((n) => !nullOnsetMeasures.has(n.measureIndex));

	const recWithAbs = recNormal.map((n) => ({ n, abs: toAbsolute(n, measureOffsets) })).sort((a, b) => a.abs - b.abs);

	const used = new Array(recWithAbs.length).fill(false);
	const pairs: MatchedPair[] = [];
	const unmatchedTruth: GroundTruthNote[] = [];

	let searchStart = 0;
	for (const truth of [...truthNormal].sort((a, b) => a.onsetAbsolute - b.onsetAbsolute)) {
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
			pairs.push(buildPair(truth, recWithAbs[bestIdx].n, measureOffsets));
			// Advance the search floor monotonically, but do not skip notes a later truth note might still need.
			searchStart = Math.max(searchStart, bestIdx);
		} else {
			unmatchedTruth.push(truth);
		}
	}

	const unmatchedRecognized = recWithAbs.filter((_, i) => !used[i]).map((r) => r.n);

	// Order-based pass, one null-onset measure at a time.
	for (const mi of nullOnsetMeasures) {
		const truthInM = [...truthNotes.filter((t) => t.measureIndex === mi)].sort((a, b) => a.onsetAbsolute - b.onsetAbsolute);
		const recInM = recognizedNotes.filter((n) => n.measureIndex === mi); // array order == x order, as emitted
		const n = Math.min(truthInM.length, recInM.length);
		for (let i = 0; i < n; i++) {
			pairs.push(buildPair(truthInM[i], recInM[i], measureOffsets));
		}
		if (truthInM.length > n) unmatchedTruth.push(...truthInM.slice(n));
		if (recInM.length > n) unmatchedRecognized.push(...recInM.slice(n));
	}

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

	// Additive exact-rational duration instrument. Scoped to matched
	// note/note pairs, same as pitchMatch/rhythmMatch above. Does not read
	// or write anything the existing figures below depend on.
	//
	// Abstain-path addition (fable-spec-e16-abstain-path item 5): a pair
	// whose recognized duration is null is neither a match nor a wrong
	// guess -- it goes to durationAbstainedPairs, not durationMismatches,
	// and is not counted in durationExactMatches. notePairs.length (the
	// durationExactRate denominator) is unchanged and still includes these
	// pairs, so an abstention costs the rate exactly what a wrong guess
	// would have cost, no more.
	const notePairs = pairs.filter((p) => p.truth.type === 'note' && p.recognized.type === 'note');
	const durationMismatches: DurationMismatch[] = [];
	const durationAbstainedPairs: DurationAbstainedPair[] = [];
	let durationExactMatches = 0;
	for (const p of notePairs) {
		const td = p.truth.duration;
		const rd = p.recognized.duration;
		if (rd === null) {
			durationAbstainedPairs.push({
				truthId: p.truth.id,
				recognizedId: p.recognized.id,
				truthDuration: { numerator: td.numerator, denominator: td.denominator },
				recognizedDuration: null,
				reason: p.recognized.abstain?.duration ?? 'unknown',
				measureIndex: p.recognized.measureIndex
			});
			continue;
		}
		const exact = td.numerator * rd.denominator === rd.numerator * td.denominator;
		if (exact) {
			durationExactMatches++;
		} else {
			durationMismatches.push({
				truthId: p.truth.id,
				recognizedId: p.recognized.id,
				truthDuration: { numerator: td.numerator, denominator: td.denominator },
				recognizedDuration: { numerator: rd.numerator, denominator: rd.denominator },
				measureIndex: p.recognized.measureIndex
			});
		}
	}
	const durationExactRate = safeDiv(durationExactMatches, notePairs.length);
	const durationAbstentions = durationAbstainedPairs.length;

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
		// Pairs with a null onset or null duration are excluded from the
		// respective shift mean (fable-spec-e16-abstain-path item 5): there
		// is no shift to measure when the reader did not claim a value.
		meanOnsetShiftWholeNotes: mean(pairs.map((p) => p.onsetDelta).filter((v): v is number => v !== undefined)),
		meanDurationShiftWholeNotes: mean(pairs.map((p) => p.durationDelta).filter((v): v is number => v !== undefined)),

		durationExactMatches,
		durationExactRate,
		durationMismatches,
		durationAbstentions,
		durationAbstainedPairs
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
	// `!= null` (not `!== undefined`) excludes both absent (rest) and
	// explicit `null` (pitch-abstained, fable-spec-e16-abstain-path item 7)
	// midi values -- a necessary consequence of `midi` becoming nullable in
	// normalized-format.ts, not a change to this function's own definition.
	// Zero live firings today (SOURCED), so this is dormant on every
	// acceptance test; left unfixed it would silently corrupt tessitura
	// stats (null coerces to 0 in Math.min/reduce) the day it is not.
	const truthMidis = truthNotes.map((n) => n.midi).filter((m): m is number => m != null);
	const recMidis = recognizedNotes.map((n) => n.midi).filter((m): m is number => m != null);
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

// ---------------------------------------------------------------------------
// Front 3a decision 6 (fable-spec-e16-front3a_2026-07-27, revision 3, ratified
// by Dann 2026-07-27): the metre figures, ADDITIVE. No existing field or
// definition changes; archived outputs, which lack `measures`, reproduce every
// historical figure byte-identically and report all-zero metre fields (A3).
//
// PROVENANCE NOTE (2026-07-27, close-out session): the Front 3a session's own
// scoreMetre() was written into its sandbox copy of this file and was NEVER
// delivered to tools/e16-harness/_rhythm_spike/ on Dann's Mac; the capsule has
// never tracked scorer_local.ts (only score_rng.ts), so the implementation was
// lost with that sandbox. This is a re-implementation from the spec's own
// definition, not a restore. It is validated by reproducing two independently
// recorded measured figures: piece 01 p1 judged=12 matched=1 accuracy=0.0833
// abstentions=0, and the close fixture judged=6 matched=6 accuracy=1.0000
// abstentions=0.
export interface MeasureMetreScore {
	metreMeasuresJudged: number;
	metreMatches: number;
	metreAccuracy: number;
	metreAbstentions: number;
}

export function scoreMetre(
	truthMeasureDurations: Array<{ index: number; expectedDuration: { numerator: number; denominator: number } }> | undefined,
	recognizedMeasures: Array<any> | undefined
): MeasureMetreScore {
	if (!recognizedMeasures || recognizedMeasures.length === 0 || !truthMeasureDurations) {
		return { metreMeasuresJudged: 0, metreMatches: 0, metreAccuracy: 0, metreAbstentions: 0 };
	}
	const truthByIndex = new Map<number, { numerator: number; denominator: number }>();
	for (const m of truthMeasureDurations) truthByIndex.set(m.index, m.expectedDuration);

	let judged = 0;
	let matches = 0;
	let abstentions = 0;
	for (const rm of recognizedMeasures) {
		const md = rm.measureDuration;
		if (md === null || md === undefined) {
			// The metre facet itself is unresolved for this measure (decision 8's
			// abstain.metre shape). Not judged; counted as an abstention.
			abstentions += 1;
			continue;
		}
		const t = truthByIndex.get(rm.measureIndex);
		if (t === undefined) continue;   // no truth for this index: not judgeable
		judged += 1;
		// Compare as rationals, not as reduced strings, so 3/4 and 6/8 do not
		// collide: measureDuration is X/Y in whole notes on both sides.
		if (md.numerator * t.denominator === t.numerator * md.denominator) matches += 1;
	}
	return {
		metreMeasuresJudged: judged,
		metreMatches: matches,
		metreAccuracy: judged === 0 ? 0 : matches / judged,
		metreAbstentions: abstentions
	};
}
