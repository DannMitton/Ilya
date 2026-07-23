/**
 * ground-truth: extract the E.16 harness's answer key from a corpus piece,
 * via the SAME parse path the product uses for `.musx`
 * (denigma -> MNX -> `MnxScoreParser`), reusing `sungVerseNumbers` from
 * `@ilya/score-parser` rather than re-deriving verse structure.
 *
 * Imports below are read-only relative imports into
 * `packages/score-parser/src` (no product code is modified). Only
 * `mnx-parser.ts` and `verses.ts` are imported directly: both have
 * type-only internal imports (verified, 2026-07-22), so they load under
 * Node's native TypeScript stripping with no build step and no dependency
 * on the rest of the package (`overlay-engine.ts`, for instance, has one
 * *value* import and was deliberately NOT pulled in; this file re-implements
 * the one trivial helper it would have needed, `pitchToMidi`, rather than
 * import a file with an extension-less specifier Node cannot resolve
 * un-transpiled).
 */

import { MnxScoreParser } from '../../../packages/score-parser/src/mnx-parser.ts';
import { sungVerseNumbers } from '../../../packages/score-parser/src/verses.ts';
import type {
	ParsedScore,
	ParseResult,
	VocalLineEvent,
	Pitch
} from '../../../packages/score-parser/src/types.ts';

export interface GroundTruthNote {
	id: string;
	type: 'note' | 'rest';
	measureIndex: number;
	/** Onset position within the measure, in whole-note fraction units (numerator/denominator). */
	onset: { numerator: number; denominator: number };
	/** Duration in whole-note fraction units. */
	duration: { numerator: number; denominator: number };
	/**
	 * Onset from the start of the piece, in whole notes, as a plain decimal
	 * (measure-cumulative `expectedDuration` + the within-measure onset
	 * fraction). This is the coordinate the scorer's note-matching walks;
	 * `measureIndex`/`onset` are kept alongside for readability and for a
	 * recognizer that prefers to report per-measure position.
	 */
	onsetAbsolute: number;
	/** MIDI note number. Absent for rests. */
	midi?: number;
	/** Syllable text for THIS verse on this note, if any (absent = melisma continuation or no lyrics). */
	syllableText?: string;
	syllableType?: 'whole' | 'start' | 'middle' | 'end';
}

export interface GroundTruthVerse {
	verseNumber: number;
	verseLabel?: string;
	notes: GroundTruthNote[];
}

export interface GroundTruth {
	pieceId: string;
	sourceMusxPath: string;
	parser: {
		warnings: number;
		errors: number;
		errorDetail: { code: string; message: string; fatal: boolean }[];
	};
	vocalPart: { partId: string; partName: string };
	clef?: { sign: string; line: number };
	keySignature?: { fifths: number; mode?: string };
	/** Real BPM from the source's own tempo markings; empty if the source carried none. */
	tempoMarkings: { measureIndex: number; bpm: number; text?: string }[];
	sungVerseNumbers: number[];
	verses: GroundTruthVerse[];
	/**
	 * Per-measure expected duration (whole-note units), so a consumer
	 * (the scorer) can place a recognizer's (measureIndex, onset) pairs on
	 * the same absolute timeline without re-invoking the score parser.
	 */
	measureDurations: { index: number; expectedDuration: { numerator: number; denominator: number } }[];
}

/** Diatonic step to semitone-above-C offset, natural (unaltered) pitch class. */
const STEP_SEMITONES: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

/** Same convention as the product: middle C (C4) = MIDI 60. */
export function pitchToMidi(pitch: Pitch): number {
	const base = STEP_SEMITONES[pitch.step];
	const alter = pitch.alter ?? 0;
	return (pitch.octave + 1) * 12 + base + alter;
}

function onsetOf(ev: VocalLineEvent): { numerator: number; denominator: number } {
	return ev.rhythmicPosition.fraction;
}

/**
 * Cumulative whole-note offset at the START of each measure, keyed by
 * measure index. Exported so `scorer.ts` can place a recognizer's own
 * (measureIndex, onset) pairs on the SAME absolute timeline as ground
 * truth, under the documented assumption that the recognizer's measure
 * numbering lines up with the source's (see `scorer.ts` for the caveat).
 */
export function measureStartOffsets(measures: ParsedScore['measures']): Map<number, number> {
	const offsets = new Map<number, number>();
	let cumulative = 0;
	for (const m of measures) {
		offsets.set(m.index, cumulative);
		cumulative += m.expectedDuration.numerator / m.expectedDuration.denominator;
	}
	return offsets;
}

function verseNotesFor(
	verseNumber: number,
	vocalLine: VocalLineEvent[],
	measureOffsets: Map<number, number>
): GroundTruthNote[] {
	const notes: GroundTruthNote[] = [];
	for (const ev of vocalLine) {
		const onset = onsetOf(ev);
		const measureStart = measureOffsets.get(ev.measureIndex) ?? 0;
		const base: GroundTruthNote = {
			id: ev.id,
			type: ev.type,
			measureIndex: ev.measureIndex,
			onset,
			duration: ev.duration.fraction,
			onsetAbsolute: measureStart + onset.numerator / onset.denominator,
			midi: ev.pitch ? pitchToMidi(ev.pitch) : undefined
		};

		const syl = ev.syllable;
		if (syl) {
			if (syl.versesInfo && syl.versesInfo.length > 0) {
				const entry = syl.versesInfo.find((v) => v.verseNumber === verseNumber);
				if (entry) {
					base.syllableText = entry.text;
					base.syllableType = entry.type;
				}
			} else if (syl.verseNumber === verseNumber) {
				base.syllableText = syl.text;
				base.syllableType = syl.type;
			}
		}
		notes.push(base);
	}
	return notes;
}

/**
 * Extract ground truth from MNX JSON text (already converted from `.musx`
 * by `denigma-convert.ts`). Ground truth is per verse, per the brief: a
 * strophic piece's verse 2, 3, ... get their own note+syllable sequences
 * over the SAME notes, differing only in syllable text (§A.73 in the
 * product's own docs: "each verse sings the same notes with different
 * text").
 */
export async function extractGroundTruth(
	pieceId: string,
	sourceMusxPath: string,
	mnxJsonText: string
): Promise<GroundTruth> {
	const parser = new MnxScoreParser();
	const result: ParseResult = await parser.parse({
		format: 'mnx',
		data: JSON.parse(mnxJsonText)
	});

	const score: ParsedScore = result.score;
	const verseNumbers = sungVerseNumbers(score);
	const measureOffsets = measureStartOffsets(score.measures);

	const verses: GroundTruthVerse[] = verseNumbers.map((verseNumber) => {
		// Find a verseLabel from any syllable that carries one for this verse.
		let verseLabel: string | undefined;
		for (const ev of score.vocalLine) {
			if (ev.syllable?.verseNumber === verseNumber && ev.syllable.verseLabel) {
				verseLabel = ev.syllable.verseLabel;
				break;
			}
		}
		return {
			verseNumber,
			verseLabel,
			notes: verseNotesFor(verseNumber, score.vocalLine, measureOffsets)
		};
	});

	return {
		pieceId,
		sourceMusxPath,
		parser: {
			warnings: result.warnings.length,
			errors: result.errors.length,
			errorDetail: result.errors.map((e) => ({ code: e.code, message: e.message, fatal: e.fatal }))
		},
		vocalPart: { partId: score.vocalPart.partId, partName: score.vocalPart.partName },
		clef: score.clefs && score.clefs.length > 0 ? score.clefs[0].clef : undefined,
		keySignature: score.keySignatures[0]?.signature,
		tempoMarkings: score.tempoMarkings.map((t) => ({
			measureIndex: t.measureIndex,
			bpm: t.bpm,
			text: t.text
		})),
		sungVerseNumbers: verseNumbers,
		measureDurations: score.measures.map((m) => ({ index: m.index, expectedDuration: m.expectedDuration })),
		verses
	};
}
