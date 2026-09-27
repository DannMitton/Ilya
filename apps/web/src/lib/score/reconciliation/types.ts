/**
 * Fit reconciliation shell: the divergence data model (piece 1 of 4).
 *
 * The two-witness problem (kimi-brief-lyric-reconciliation; Dann's rulings and
 * Kimi's Q1-Q6, both binding; handover v39 §A.36). A singer brings two witnesses
 * of one text: the poem, authoritative for language, in Ilya's Transcription tab,
 * and the score underlay, primary for sung substance, dropped into Fit. Where the
 * two diverge, the divergence is information, recorded as apparatus, never
 * silently resolved.
 *
 * This module is the SHELL only. The alignment engine that detects and locates
 * divergences waits for the research pass (handover §A.38). These types describe
 * what that engine will produce, and what the drawer and the Paper footnotes will
 * render.
 *
 * Naming: "divergence" here is textual, and is distinct from the acoustic [ɨ]
 * formant divergence in engine/divergence.ts. The two concepts never meet; this
 * module keeps the word scoped.
 *
 * Two shipped invariants are load-bearing in these shapes:
 *   - Honest absence (§A.56): an undefined Reconciliation means NOT ASSESSED, and
 *     the drawer says nothing. A Reconciliation with an empty divergences array
 *     means assessed and agreeing, and the drawer says "Score and poem agree".
 *     These are different states, and the type keeps them apart.
 *   - Derive, never re-encode (§A.56, §A.57): the "N places" summary count is
 *     derived from divergences.length where it is rendered, never stored here.
 */

/** The two textual witnesses of one text (Kimi Q1). */
export type Witness = 'score' | 'ilya';

/**
 * The disparity taxonomy (brief §3). Each class carries a fixed treatment, routed
 * in piece 2:
 *   - orthographic-trivia: casing, punctuation, or е printed for ё. Auto-reconciled
 *     toward Ilya's form with quiet provenance; never interrupts.
 *   - probable-error: a non-dictionary word one edit from a dictionary word in the
 *     other witness. Flagged with a navigate-only suggestion, never auto-corrected;
 *     the singer decides (Kimi Q3).
 *   - intentional-variance: a substituted word, an omitted stanza, or text re-set to
 *     different music. The score stands for analysis; the divergence renders as
 *     apparatus (Kimi Q4, Q5).
 */
export type DisparityClass =
	| 'orthographic-trivia'
	| 'probable-error'
	| 'intentional-variance';

/** The treatment a class routes to (piece 2). */
export type Treatment = 'auto-reconciled' | 'flagged' | 'witnessed';

/** Sub-kinds of intentional variance (Kimi Q4, Q5). */
export type VarianceKind =
	| 'substitution' // the composer set a different word
	| 'omission' // the composer omits a stanza or line ("Composer omits stanza 3.")
	| 'recurrence'; // the same text re-set to different music ("also at m. 8")

/** The singer's disposition on a flagged probable error (Kimi Q3). */
export type ErrorDisposition = 'pending' | 'opened-in-ilya' | 'kept-score';

/** Where a divergence sits, for footnote measure numbers and drawer navigation. */
export interface DivergenceLocation {
	/** 1-based measure number, for the footnote and the drawer line. */
	measure: number;
	/** Word index in the aligned sequence, for navigate-to-word; absent for a whole-stanza omission. */
	wordIndex?: number;
	/** For a recurrence, the other measures where the same text is set. */
	alsoAt?: number[];
}

/** A flagged probable error and the singer's disposition (Kimi Q3, navigate-only). */
export interface ProbableError {
	/** The nearer dictionary form the other witness offers. */
	suggestion: string;
	/** Which witness holds the suggested form. */
	suggestionFrom: Witness;
	/** Pending, navigated to Ilya, or kept as the score reads (which records it as intentional). */
	disposition: ErrorDisposition;
}

/** What was quietly folded toward Ilya, kept for provenance (orthographic trivia). */
export interface TriviaProvenance {
	kind: 'yo-restored' | 'casing' | 'punctuation' | 'hyphenation';
}

/** One recorded divergence between the two witnesses. */
export interface Divergence {
	/** Stable id: footnote numbering and the drawer-to-footnote cross-reference key off it. */
	id: string;
	class: DisparityClass;
	treatment: Treatment;
	/** The underlay as the composer set it. Absent when the score omits the text. */
	scoreReads?: string;
	/** The poem word or line from Ilya. Absent when the score adds text the poem lacks. */
	ilyaReads?: string;
	location: DivergenceLocation;
	/** Present only for class 'intentional-variance'. */
	variance?: VarianceKind;
	/** Present only for class 'probable-error'. */
	error?: ProbableError;
	/** Present only for class 'orthographic-trivia'. */
	provenance?: TriviaProvenance;
}

/**
 * The result of one reconciliation pass over the two witnesses.
 *
 * Undefined (no value of this type at all) is the not-assessed state, and is the
 * honest default before any pass runs; it is never a Reconciliation with an empty
 * array. An empty divergences array is the assessed-and-agreeing state.
 */
export interface Reconciliation {
	/** Every recorded divergence, in reading order. Empty means the witnesses agree. */
	divergences: Divergence[];
	/** Verse analysed (Kimi Q5): the analysis uses verse 1. */
	analysedVerse: number;
	/** Total verses banked upstream; the print footer reads "Analysis: verse 1 of N." */
	totalVerses: number;
}
