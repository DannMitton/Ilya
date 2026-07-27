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
	/**
	 * MEASURE-LEVEL facets (fable-spec-e16-front3a_2026-07-27, revision 3,
	 * decision 8, ratified). Deliberately the SAME object on a new record
	 * type, not a second mechanism. `metre` when the measure's metre is
	 * unresolved; `sum` when the metre is known but the measure's duration
	 * sum is not, carrying either `empty_bar_no_events` (decision 7's
	 * printed-but-empty bar) or `contains_duration_abstention`;
	 * `beatBoundaries` when an irregular measure's grouping is unresolved.
	 */
	metre?: string;
	sum?: string;
	beatBoundaries?: string;
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

/**
 * One measure of the piece, on the MUSICAL axis (fable-spec-e16-front3a_2026-07-27,
 * revision 3, decisions 2, 6, and 8, ratified by Dann). `measureIndex` is
 * GLOBAL across the piece, not page-local: it is the envelope's
 * `measureIndexOffset` plus the page-local index, which is what cross-page
 * inheritance requires.
 *
 * A page is where a fact was OBSERVED, recorded in `printedAt`; it is never
 * where the fact lives. `source` is `printed` when this measure's own ink
 * carries the signature, `inherited` when it persists from an earlier measure
 * or page, and `null` when the metre is unresolved.
 */
export interface RecognizedMeasure {
	measureIndex: number;
	/** `null` when no printed signature reaches this measure by print or inheritance. */
	metre: { beats: number; beatType: number } | null;
	/** The measure's duration in whole notes. An X/Y signature gives X/Y directly. */
	measureDuration: { numerator: number; denominator: number } | null;
	classification: 'simple' | 'compound' | 'irregular' | null;
	/**
	 * INTERIOR beat boundaries only, as whole-note offsets from the measure
	 * start; the start and end are implicit. `null` for an irregular measure
	 * whose grouping is unresolved, which also sets `abstain.beatBoundaries`.
	 */
	beatBoundaries: Array<{ numerator: number; denominator: number }> | null;
	source: 'printed' | 'inherited' | null;
	printedAt: { page: number; measureIndex: number } | null;
	/**
	 * The measure-integrity flag, in its four ratified states: `false` passes
	 * (the emitted durations sum to the metre), `true` is a defect, `null` is
	 * a LEGAL PICKUP at the piece's own measure 0 (not a failure), and
	 * `'abstain'` is the fourth state, reused for all three abstention causes.
	 * Which cause applies is visible in `abstain`, never in this field.
	 */
	integrity: boolean | null | 'abstain';
	/** See `Abstain`. Absent means confidence on every facet present here. */
	abstain?: Abstain;
}

export interface RecognizedOutput {
	pieceId: string;
	clef?: { sign: string; line: number };
	keySignature?: { fifths: number; mode?: string };
	/** Representative tempo in BPM, if the engine detected one. A single number: engines are not expected to track mid-piece tempo changes in v1. */
	tempoBpm?: number;
	verses: RecognizedVerse[];
	/**
	 * ADDITIVE (decision 6, ratified). Absent on every archived output
	 * predating Front 3a, and the scorer's metre figures are inert when it is
	 * absent, which acceptance test A3 proves against the frozen close
	 * artifact. Confident note records are unaffected and stay byte-identical.
	 */
	measures?: RecognizedMeasure[];
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
