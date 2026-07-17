/**
 * Performance-order unfolding (increment 1: repeats and voltas).
 *
 * Computes the sequence of source measures as actually sung, once forward and
 * backward repeats and first/second/N-th endings (voltas) are followed. The output
 * keeps, for every sung measure, its source index and its pass number, so a later
 * stage can attach that pass's own verse text and overlay (per-verse provenance).
 *
 * Source-agnostic by construction: it operates on structural markers, never on raw
 * MusicXML, MNX, or an image, so the same logic serves every ingestion front end,
 * including a future recognised PDF.
 *
 * Endings are modelled as per-measure pass membership (`endingPasses`), not as
 * start/stop edges: a measure carries the passes on which it sounds, and a measure
 * not played on the current pass is skipped. This handles one-bar endings (the same
 * measure opening and closing an ending) and multi-bar endings uniformly.
 *
 * Scope of this increment, deliberately narrow so it can be provably correct:
 *   - no repeats (identity order),
 *   - a simple repeat span, played `times` (default 2), including sequential
 *     non-nested spans and the implicit "repeat from the top" (a backward repeat
 *     with no forward repeat),
 *   - a single repeat span with two or more endings (voltas).
 * Everything else FLAGS and the caller falls back to as-written order. We never emit
 * a guessed order (the cardinal rule). Jumps (D.C., D.S., coda, fine) are the next
 * increment; here any jump marker flags as unsupported.
 *
 * Modelled on music21's repeat.Expander: linear simulation with a fail-loud result
 * rather than a best guess.
 */

/** A measure's structural markers relevant to performance order (source-agnostic). */
export interface MeasureRepeatMarkers {
	/** Forward repeat barline: the start of a repeated span. */
	startRepeat?: boolean;
	/** Backward repeat barline: the end of a repeated span. */
	endRepeat?: boolean;
	/** Total plays for a backward repeat with no voltas. Default 2. Ignored when voltas govern. */
	times?: number;
	/**
	 * Passes on which this measure sounds, when it is inside an ending (volta), e.g.
	 * [1] or [1, 2]. Absent means the measure plays on every pass.
	 */
	endingPasses?: number[];
	/** Any jump control (D.C., D.S., coda, fine) present. This increment flags these. */
	hasJump?: boolean;
}

/** One sung measure in performance order. */
export interface UnfoldedMeasure {
	/** 0-based source measure index. */
	source: number;
	/** 1-based pass: which time through the enclosing repeat produced this sung measure. */
	pass: number;
}

/**
 * Why the order could not be computed, so the caller can fall back honestly.
 *   - 'unsupported': a construct this increment does not yet handle (a jump, a nested
 *     repeat). Our roadmap gap, not the score's fault.
 *   - 'ambiguous': a malformed or genuinely ambiguous structure a human could fix by
 *     editing the score.
 *   - 'format-ceiling': reserved for the parser layer, where the source format itself
 *     cannot express the instruction (for example MNX and a coda jump). The unfolder
 *     never emits this; it is here so one result type serves both layers.
 */
export interface UnfoldFlag {
	kind: 'unsupported' | 'ambiguous' | 'format-ceiling';
	/** Machine tag, e.g. 'jump-unsupported-v1', 'nested-repeat', 'volta-without-repeat'. */
	code: string;
	/** Human, singer-facing sentence. */
	message: string;
	/** Source measure index where the trouble is, when known. */
	at?: number;
}

export type UnfoldResult =
	| { ok: true; order: UnfoldedMeasure[] }
	| { ok: false; flag: UnfoldFlag };

/** The honest fallback: play every source measure once, in written order. */
export function asWrittenOrder(measureCount: number): UnfoldedMeasure[] {
	const order: UnfoldedMeasure[] = [];
	for (let i = 0; i < measureCount; i++) order.push({ source: i, pass: 1 });
	return order;
}

function flag(kind: UnfoldFlag['kind'], code: string, message: string, at?: number): UnfoldResult {
	return { ok: false, flag: { kind, code, message, at } };
}

/**
 * Compute performance order for repeats and voltas. Returns a flag (not a guess) for
 * anything outside this increment's scope; the caller then uses `asWrittenOrder`.
 */
export function unfold(measures: MeasureRepeatMarkers[]): UnfoldResult {
	const n = measures.length;
	if (n === 0) return { ok: true, order: [] };

	// Pre-scan for constructs this increment does not handle, and for volta facts.
	let startRepeatCount = 0;
	let hasEndRepeat = false;
	let hasEndings = false;
	let maxEndingPass = 0;
	for (let i = 0; i < n; i++) {
		const m = measures[i];
		if (m.hasJump) {
			return flag(
				'unsupported',
				'jump-unsupported-v1',
				'This score uses a jump (D.C., D.S., or coda) that is not yet unfolded.',
				i
			);
		}
		if (m.startRepeat) startRepeatCount++;
		if (m.endRepeat) hasEndRepeat = true;
		if (m.endingPasses && m.endingPasses.length > 0) {
			hasEndings = true;
			for (const p of m.endingPasses) if (p > maxEndingPass) maxEndingPass = p;
		}
	}

	if (hasEndings) {
		// Voltas: this increment supports exactly one explicit repeat span carrying them.
		if (startRepeatCount !== 1) {
			return flag(
				'unsupported',
				'volta-multi-span',
				'This score combines endings with more than one repeat span, which is not yet unfolded.'
			);
		}
		if (!hasEndRepeat) {
			return flag(
				'ambiguous',
				'volta-without-repeat',
				'This score has endings but no repeat barline to govern them.'
			);
		}
		if (maxEndingPass < 2) {
			return flag(
				'ambiguous',
				'ending-pass-degenerate',
				'An ending is marked but no ending plays on a second pass.'
			);
		}
	}

	const order: UnfoldedMeasure[] = [];
	let i = 0;
	let spanStart = 0; // where the active repeat returns to; 0 means the top
	let pass = 1; // current pass of the active span
	let inExplicitSpan = false;
	let steps = 0;
	const maxSteps = n * 64 + 1000; // runaway guard; a real piece never approaches this

	while (i < n) {
		if (++steps > maxSteps) {
			return flag('ambiguous', 'runaway', 'The repeat structure did not resolve to a finite order.', i);
		}
		const m = measures[i];

		// Volta skip: a measure not played on this pass is skipped entirely, including
		// any backward repeat it carries.
		if (m.endingPasses && m.endingPasses.length > 0 && !m.endingPasses.includes(pass)) {
			i++;
			continue;
		}

		// Opening an explicit repeat span. Re-entry via jump-back keeps the same span.
		if (m.startRepeat) {
			if (inExplicitSpan && spanStart !== i) {
				return flag('unsupported', 'nested-repeat', 'Nested repeats are not yet unfolded.', i);
			}
			if (!inExplicitSpan) {
				inExplicitSpan = true;
				spanStart = i;
				pass = 1;
			}
		}

		order.push({ source: i, pass });

		if (m.endRepeat) {
			const numPasses = hasEndings ? maxEndingPass : m.times ?? 2;
			if (pass < numPasses) {
				pass++;
				i = spanStart;
				continue;
			}
			// Span exhausted: leave it and reset the baseline for any later sequential span.
			inExplicitSpan = false;
			spanStart = 0;
			pass = 1;
			i++;
			continue;
		}

		i++;
	}

	return { ok: true, order };
}

/**
 * The measure fields the unfolder needs. `ParsedScore`'s `Measure` satisfies this
 * structurally, so the adapter below decouples the unfolder from the full score type
 * and stays sandbox-testable in isolation.
 */
export interface MeasureLike {
	repeatStart?: boolean;
	repeatEnd?: boolean;
	repeatTimes?: number;
	ending?: { passes: number[] };
	/** Reserved for the jump increment; the parser does not populate it yet. */
	hasJump?: boolean;
}

/** Bridge a parsed measure list to the unfolder's markers (naming differs by layer). */
export function markersFromMeasures(measures: MeasureLike[]): MeasureRepeatMarkers[] {
	return measures.map((m) => {
		const marker: MeasureRepeatMarkers = {};
		if (m.repeatStart) marker.startRepeat = true;
		if (m.repeatEnd) marker.endRepeat = true;
		if (m.repeatTimes !== undefined) marker.times = m.repeatTimes;
		if (m.ending) marker.endingPasses = m.ending.passes;
		if (m.hasJump) marker.hasJump = true;
		return marker;
	});
}
