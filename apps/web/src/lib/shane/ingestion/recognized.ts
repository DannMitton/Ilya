/**
 * The shape of `ro`, the E.16 page reader's recognized output, and the read
 * report the drawer declares.
 *
 * N.59. ONE definition, imported by both the Worker that produces it and the
 * converter that consumes it. `tools/e16-harness/src/normalized-format.ts` is
 * the cautionary tale: a hand-written mirror of `ro` kept by naming convention
 * only, which drifted until it declared `tempoBpm` and `syllableText` that the
 * Python never populates (E.57). This file is a type declaration for a JSON
 * payload that crosses a postMessage boundary, and nothing more.
 *
 * Verified against a real `ro` read out of `envelope.run` on 2026-08-16:
 * top-level keys are exactly `clef`, `keySignature`, `measures`, `pieceId`,
 * and `verses`; onsets and durations are `{numerator, denominator}` objects,
 * NOT pairs.
 */

/** A rational, exactly as the Python emits it. */
export interface RecognizedFraction {
	numerator: number;
	denominator: number;
}

/**
 * One event. `type` is `'note'` or `'rest'`. A key absent from `abstain` means
 * the reader was confident; the whole `abstain` object is absent on a fully
 * confident record, which is what makes step 4's byte-identity provable.
 */
export interface RecognizedNote {
	id: string;
	type: 'note' | 'rest';
	measureIndex: number;
	/** Null once a duration abstention has broken the measure's onset chain. */
	onset: RecognizedFraction | null;
	/** Null where the duration itself abstained. */
	duration: RecognizedFraction | null;
	/** Notes only. Null where the accidental engine abstained. */
	midi?: number | null;
	/**
	 * Ruling D, additive, present ONLY on a note whose pitch abstained: the
	 * geometric value before the nulling, so the converter has something to
	 * engrave rather than dropping the event and shifting every later syllable.
	 */
	midiAssumedNatural?: number | null;
	abstain?: {
		pitch?: string;
		duration?: string;
		onset?: string;
	};
}

export interface RecognizedMeasure {
	measureIndex: number;
	metre: { beats: number; beatType: number } | null;
	measureDuration: RecognizedFraction | null;
	classification?: string | null;
	beatBoundaries?: RecognizedFraction[];
	source?: string;
	printedAt?: { measureIndex: number; page: number } | null;
	integrity?: string | boolean;
	abstain?: { metre?: string; sum?: string };
}

export interface RecognizedOutput {
	pieceId: string;
	clef: { sign: string; line: number };
	keySignature: { fifths: number };
	verses: { verseNumber: number; notes: RecognizedNote[] }[];
	measures: RecognizedMeasure[];
}

/**
 * Everything the drawer declares on completion (Ruling D). NOTHING here is
 * drawn on the page: the E.47 strike stands, and a mark that appears on
 * everything says nothing.
 */
export interface ReadReport {
	pages: number;
	systems: number;
	staves: number;
	/** Staff-line spacing in pixels, per page. The retention floor is 20. */
	staffSpace: number[];
	notes: number;
	rests: number;
	measures: number;
	/** Per-measure counts, listed only where nonzero. */
	pitchSubstitutions: { measureIndex: number; count: number }[];
	durationSubstitutions: { measureIndex: number; count: number }[];
	/** Systems where the brace rule could not decide and took staff 0. */
	staffSelectionFallbacks: number;
	readSeconds: number;
}

/** The singer's answers, given in the uploader before the read (Ruling A). */
export interface PageReadConfig {
	clef: [string, number];
	key: number;
	octaveChange: number;
	pieceId: string;
}
