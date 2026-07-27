/**
 * normalized-format: the recognizer-output schema real OMR engines will be
 * adapted INTO, so the scorer (and everything downstream of it) never
 * touches an engine's native output format. This is intentionally its own,
 * independent shape from `GroundTruth` (ground-truth.ts): a real OMR engine
 * (oemer, homr, SMT++, etc.) emits MusicXML-like per-measure structure with
 * its OWN note ids, so this schema mirrors "what a MusicXML-to-JSON adapter
 * would naturally produce" rather than reusing the product's internal
 * `ParsedScore` shape.
 *
 * A future engine adapter's whole job is: engine's native output -> this
 * shape. Nothing else in the harness needs to change when a new engine is
 * added (task brief, "engines plug in later without touching the scorer").
 */

/**
 * Facet-keyed abstention (fable-spec-e16-abstain-path, 2026-07-27, item 6,
 * ratified by Dann). THE single abstention shape, record-level, for the
 * whole reader: absence of this key means every facet on the record is
 * confident. When a facet abstains its own field is `null` and this object
 * names the facet and a machine-readable reason. A record may abstain on
 * several facets at once (e.g. `onset` cascading from a `duration`
 * abstention earlier in the same measure).
 */
export interface Abstain {
	onset?: string;
	duration?: string;
	pitch?: string;
}

export interface RecognizedNote {
	/** The recognizer's own id for this note (opaque; NOT compared to ground-truth ids). */
	id: string;
	type: 'note' | 'rest';
	measureIndex: number;
	/**
	 * Onset within the measure, in whole-note fraction units. `null` when a
	 * duration abstention earlier in the same measure broke the running
	 * onset sum (spec item 3); the next measure resets clean at the barline.
	 */
	onset: { numerator: number; denominator: number } | null;
	/**
	 * Duration in whole-note fraction units. `null` when the reader could
	 * not confidently read this note's duration (spec item 1/2) -- never a
	 * best guess plus a flag.
	 */
	duration: { numerator: number; denominator: number } | null;
	/** MIDI note number. Absent for rests; `null` when the reader abstained on this note's pitch (spec item 7). */
	midi?: number | null;
	/** Syllable text attached to this note by the recognizer's lyric-position layer, if any. */
	syllableText?: string;
	/** See `Abstain`. Absent means confidence on every facet present here. */
	abstain?: Abstain;
}

export interface RecognizedVerse {
	verseNumber: number;
	notes: RecognizedNote[];
}

export interface RecognizedOutput {
	pieceId: string;
	clef?: { sign: string; line: number };
	keySignature?: { fifths: number; mode?: string };
	/** Representative tempo in BPM, if the engine detected one. A single number: engines are not expected to track mid-piece tempo changes in v1. */
	tempoBpm?: number;
	verses: RecognizedVerse[];
}

/**
 * Recompute each note's absolute onset (in whole notes from the piece
 * start) from its `measureIndex` + within-measure `onset`, using the SAME
 * per-measure cumulative offsets the ground truth used. A recognizer
 * cannot be expected to know the ground truth's internal offsets, so the
 * scorer derives them the same way for both sides from measure structure
 * it is GIVEN (see `scorer.ts`): this file only defines the shape.
 */
export function noteOnsetFraction(note: RecognizedNote): number {
	return note.onset.numerator / note.onset.denominator;
}
