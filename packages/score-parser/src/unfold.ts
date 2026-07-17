/**
 * Performance-order unfolding.
 *
 * Computes the sequence of source measures as actually sung, once forward and
 * backward repeats, first/second/N-th endings (voltas), and the da-capo / dal-segno
 * jump family are followed. The output keeps, for every sung measure, its source
 * index and its pass number, so a later stage can attach that pass's own verse text
 * and overlay (per-verse provenance).
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
 * Two layers, deliberately kept separate so increment 1 stays provably correct:
 *   - `unfoldRepeatsAndVoltas`: repeats and voltas, unchanged from increment 1.
 *   - `unfoldWithJumps` (increment 2): the jump family (D.C., D.S., To Coda, Fine),
 *     with simple repeats coexisting. Voltas combined with a jump are FLAGGED, not
 *     guessed, because the interaction is genuinely ambiguous (Sonnet memo, Q4/Q5).
 * `unfold` routes to the second only when a jump marker is present; otherwise the
 * first runs exactly as before.
 *
 * Everything outside the supported scope FLAGS and the caller falls back to
 * as-written order. We never emit a guessed order (the cardinal rule).
 *
 * Modelled on music21's repeat.Expander: linear simulation with a fail-loud result
 * rather than a best guess. Jump semantics are grounded in the reconfirmed Sonnet
 * repeat-unfolding memo (2026-07-16) and read from MusicXML `<sound>` only:
 *   - `dacapo` / `dalsegno` jumps fire the first time through;
 *   - `tocoda` fires on the da-capo / dal-segno return, not the first pass;
 *   - internal repeats are NOT re-taken after a jump (the documented convention);
 *   - `fine` ends the piece on the return.
 * Pass numbering on a return traversal is occurrence-count (a measure's pass is how
 * many times it has been sung so far). This is a JUDGEMENT, not a sourced fact; it is
 * consistent with increment 1 across the no-volta subset, which is all the jump path
 * admits. See the handover for the ruling hook.
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

	// ── Jump family (increment 2), read from MusicXML `<sound>` only ──────────────
	/** This measure is a segno destination; token from `<sound segno>`. */
	segno?: string;
	/** This measure is a coda destination; token from `<sound coda>`. */
	coda?: string;
	/** D.C.: on the first pass, jump to the top. From `<sound dacapo="yes">`. */
	daCapo?: boolean;
	/** D.S.: on the first pass, jump back to the matching segno. Token from `<sound dalsegno>`. */
	dalSegno?: string;
	/** To Coda: on the da-capo / dal-segno return, jump to the matching coda. Token from `<sound tocoda>`. */
	toCoda?: string;
	/** Fine: on the return, the piece ends here. From `<sound fine="yes">`. */
	fine?: boolean;
	/** `<repeat after-jump="yes">`: re-take this repeat on the jump pass. Not supported; flags. */
	afterJump?: boolean;
	/** A navigation `<sound>` carried `time-only`, overriding default jump timing. Not supported; flags. */
	timeOnly?: boolean;
	/**
	 * A printed jump mark (segno/coda glyph, or "D.C."/"D.S."/"To Coda"/"Fine" words)
	 * with no `<sound>` navigation to make it playable. The parser sets this; the
	 * unfolder flags it rather than guessing (the memo's most likely failure mode).
	 */
	jumpMarkWithoutSound?: boolean;
	/** Any jump control the parser recognised but could not structure. Flags as unsupported. */
	hasJump?: boolean;
}

/** One sung measure in performance order. */
export interface UnfoldedMeasure {
	/** 0-based source measure index. */
	source: number;
	/** 1-based pass: which time through the enclosing repeat (or, on a jump return, which sung occurrence). */
	pass: number;
}

/**
 * Why the order could not be computed, so the caller can fall back honestly.
 *   - 'unsupported': a construct this increment does not yet handle (a nested
 *     repeat, a volta combined with a jump, multiple jumps). Our roadmap gap,
 *     not the score's fault.
 *   - 'ambiguous': a malformed or genuinely ambiguous structure a human could fix
 *     by editing the score (a missing jump target, a mark with no playback data).
 *   - 'format-ceiling': reserved for the parser layer, where the source format itself
 *     cannot express the instruction (for example MNX and a coda jump). The unfolder
 *     never emits this; it is here so one result type serves both layers.
 */
export interface UnfoldFlag {
	kind: 'unsupported' | 'ambiguous' | 'format-ceiling';
	/** Machine tag, e.g. 'jump-unsupported-v1', 'nested-repeat', 'volta-with-jump'. */
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

/** True when a measure carries any jump-family marker (structured or unstructured). */
function hasAnyJumpMarker(m: MeasureRepeatMarkers): boolean {
	return (
		m.daCapo === true ||
		m.dalSegno !== undefined ||
		m.toCoda !== undefined ||
		m.coda !== undefined ||
		m.segno !== undefined ||
		m.fine === true ||
		m.afterJump === true ||
		m.timeOnly === true ||
		m.jumpMarkWithoutSound === true ||
		m.hasJump === true
	);
}

/**
 * Compute performance order. Routes to the jump-aware simulation only when a jump
 * marker is present; otherwise runs the increment-1 repeats-and-voltas engine
 * unchanged. Returns a flag (not a guess) for anything outside scope; the caller
 * then uses `asWrittenOrder`.
 */
export function unfold(measures: MeasureRepeatMarkers[]): UnfoldResult {
	const n = measures.length;
	if (n === 0) return { ok: true, order: [] };

	let anyJump = false;
	for (let i = 0; i < n; i++) {
		if (hasAnyJumpMarker(measures[i])) {
			anyJump = true;
			break;
		}
	}
	if (!anyJump) return unfoldRepeatsAndVoltas(measures);
	return unfoldWithJumps(measures);
}

/**
 * Increment 1: repeats and voltas, no jumps. Unchanged. Callers reach it through
 * `unfold` when no jump marker is present.
 */
export function unfoldRepeatsAndVoltas(measures: MeasureRepeatMarkers[]): UnfoldResult {
	const n = measures.length;
	if (n === 0) return { ok: true, order: [] };

	// Pre-scan for constructs this increment does not handle, and for volta facts.
	let startRepeatCount = 0;
	let hasEndRepeat = false;
	let hasEndings = false;
	let maxEndingPass = 0;
	for (let i = 0; i < n; i++) {
		const m = measures[i];
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

/** Resolved, validated facts about the single supported jump in a score. */
interface JumpFacts {
	/** The origin measure index (where D.C./D.S. fires). */
	originIndex: number;
	/** Where the jump returns to: 0 for D.C., the segno index for D.S. */
	destIndex: number;
	/** The measure index carrying the To Coda mark, when this is an al-Coda jump. */
	toCodaIndex?: number;
	/** The coda destination measure index, when this is an al-Coda jump. */
	codaIndex?: number;
	/** The measure index carrying Fine, when this is an al-Fine jump. */
	fineIndex?: number;
}

/** True when a measure carries a jump the unfolder knows how to reason about. */
function structuredJump(m: MeasureRepeatMarkers): boolean {
	return (
		m.daCapo === true ||
		m.dalSegno !== undefined ||
		m.toCoda !== undefined ||
		m.coda !== undefined ||
		m.segno !== undefined ||
		m.fine === true
	);
}

/**
 * Validate that a jump-bearing score falls inside increment 2's supported scope, and
 * resolve the single jump's facts. Returns a flag for anything outside scope (never a
 * guess), or `{ facts }` for the supported case, or `{ noJumpEffect: true }` when the
 * only jump marker is inert (a lone segno destination with no D.S. to reach it).
 */
function validateJumpScope(
	measures: MeasureRepeatMarkers[]
): { flag: UnfoldFlag } | { facts: JumpFacts } | { noJumpEffect: true } {
	const n = measures.length;

	const daCapoAt: number[] = [];
	const dalSegnoAt: { index: number; token: string }[] = [];
	const segnoAt: { index: number; token: string }[] = [];
	const codaAt: { index: number; token: string }[] = [];
	const toCodaAt: { index: number; token: string }[] = [];
	const fineAt: number[] = [];
	let hasVolta = false;

	for (let i = 0; i < n; i++) {
		const m = measures[i];

		// An unstructured jump the parser flagged but could not resolve.
		if (m.hasJump && !structuredJump(m)) {
			return {
				flag: {
					kind: 'unsupported',
					code: 'jump-unsupported-v1',
					message: 'This score uses a jump (D.C., D.S., or coda) that is not yet unfolded.',
					at: i,
				},
			};
		}
		// A printed jump mark with no playback data: honest ambiguity, not a guess.
		if (m.jumpMarkWithoutSound) {
			return {
				flag: {
					kind: 'ambiguous',
					code: 'jump-mark-without-sound',
					message:
						'This score prints a jump instruction (D.C., D.S., To Coda, or Fine) with no playback data, so its performance order cannot be computed.',
					at: i,
				},
			};
		}
		if (m.afterJump) {
			return {
				flag: {
					kind: 'unsupported',
					code: 'after-jump-unsupported',
					message: 'This score re-takes a repeat after a jump (after-jump), which is not yet unfolded.',
					at: i,
				},
			};
		}
		if (m.timeOnly) {
			return {
				flag: {
					kind: 'unsupported',
					code: 'time-only-unsupported',
					message: 'This score overrides a jump’s timing (time-only), which is not yet unfolded.',
					at: i,
				},
			};
		}
		// A jump control sharing a barline with a repeat barline: order of operations is
		// genuinely underspecified (the memo's flagged unresolved case).
		if (
			(m.daCapo || m.dalSegno !== undefined || m.toCoda !== undefined || m.fine) &&
			(m.startRepeat || m.endRepeat)
		) {
			return {
				flag: {
					kind: 'ambiguous',
					code: 'jump-repeat-collision',
					message:
						'This score places a jump instruction on the same barline as a repeat, so the order of operations is ambiguous.',
					at: i,
				},
			};
		}

		if (m.endingPasses && m.endingPasses.length > 0) hasVolta = true;
		if (m.daCapo) daCapoAt.push(i);
		if (m.dalSegno !== undefined) dalSegnoAt.push({ index: i, token: m.dalSegno });
		if (m.segno !== undefined) segnoAt.push({ index: i, token: m.segno });
		if (m.coda !== undefined) codaAt.push({ index: i, token: m.coda });
		if (m.toCoda !== undefined) toCodaAt.push({ index: i, token: m.toCoda });
		if (m.fine) fineAt.push(i);
	}

	// Voltas combined with any jump: flagged, not guessed (interaction is ambiguous).
	if (hasVolta) {
		return {
			flag: {
				kind: 'unsupported',
				code: 'volta-with-jump',
				message: 'This score combines endings (voltas) with a jump, which is not yet unfolded together.',
			},
		};
	}

	const originCount = daCapoAt.length + dalSegnoAt.length;

	if (originCount === 0) {
		// No D.C./D.S. origin. To Coda, Coda, or Fine markers with nothing to trigger
		// them are malformed; a lone segno destination is simply inert.
		if (toCodaAt.length > 0 || codaAt.length > 0 || fineAt.length > 0) {
			return {
				flag: {
					kind: 'ambiguous',
					code: 'jump-marker-without-origin',
					message:
						'This score marks a Coda, To Coda, or Fine but has no Da Capo or Dal Segno to trigger it.',
				},
			};
		}
		return { noJumpEffect: true };
	}

	if (originCount > 1) {
		return {
			flag: {
				kind: 'unsupported',
				code: 'multiple-jumps',
				message: 'This score uses more than one Da Capo or Dal Segno, which is not yet unfolded.',
			},
		};
	}

	if (fineAt.length > 1) {
		return {
			flag: {
				kind: 'ambiguous',
				code: 'multiple-fine',
				message: 'This score marks Fine in more than one place, so where it ends is ambiguous.',
			},
		};
	}

	// Exactly one origin.
	const isDaCapo = daCapoAt.length === 1;
	const originIndex = isDaCapo ? daCapoAt[0] : dalSegnoAt[0].index;

	let destIndex: number;
	if (isDaCapo) {
		destIndex = 0;
	} else {
		// Dal Segno: need exactly one matching segno destination, before the origin.
		if (segnoAt.length === 0) {
			return {
				flag: {
					kind: 'ambiguous',
					code: 'jump-target-missing',
					message: 'This score has a Dal Segno but no matching segno sign to return to.',
					at: originIndex,
				},
			};
		}
		if (segnoAt.length > 1) {
			return {
				flag: {
					kind: 'unsupported',
					code: 'multiple-targets',
					message: 'This score has more than one segno sign, which is not yet unfolded.',
				},
			};
		}
		const token = dalSegnoAt[0].token;
		if (segnoAt[0].token !== token) {
			return {
				flag: {
					kind: 'ambiguous',
					code: 'jump-target-missing',
					message: 'This score’s Dal Segno names a segno sign that is not present.',
					at: originIndex,
				},
			};
		}
		destIndex = segnoAt[0].index;
		if (destIndex >= originIndex) {
			return {
				flag: {
					kind: 'ambiguous',
					code: 'segno-after-dalsegno',
					message: 'This score’s segno sign is not before its Dal Segno, so the jump cannot be followed.',
					at: originIndex,
				},
			};
		}
	}

	// Coda family: To Coda and Coda must appear together and match, or neither appear.
	let toCodaIndex: number | undefined;
	let codaIndex: number | undefined;
	if (toCodaAt.length > 0 || codaAt.length > 0) {
		if (toCodaAt.length > 1 || codaAt.length > 1) {
			return {
				flag: {
					kind: 'unsupported',
					code: 'multiple-targets',
					message: 'This score has more than one Coda or To Coda, which is not yet unfolded.',
				},
			};
		}
		if (toCodaAt.length !== 1 || codaAt.length !== 1) {
			return {
				flag: {
					kind: 'ambiguous',
					code: 'jump-target-missing',
					message: 'This score has a To Coda or a Coda but not both, so the coda jump cannot be followed.',
				},
			};
		}
		if (toCodaAt[0].token !== codaAt[0].token) {
			return {
				flag: {
					kind: 'ambiguous',
					code: 'jump-target-missing',
					message: 'This score’s To Coda names a Coda sign that is not present.',
					at: toCodaAt[0].index,
				},
			};
		}
		toCodaIndex = toCodaAt[0].index;
		codaIndex = codaAt[0].index;
		if (codaIndex <= toCodaIndex) {
			return {
				flag: {
					kind: 'ambiguous',
					code: 'coda-before-tocoda',
					message: 'This score’s Coda sign is not after its To Coda, so the coda jump cannot be followed.',
					at: toCodaIndex,
				},
			};
		}
	}

	// A jump cannot be both al Coda and al Fine.
	if (codaIndex !== undefined && fineAt.length > 0) {
		return {
			flag: {
				kind: 'ambiguous',
				code: 'fine-and-coda',
				message: 'This score marks both Fine and a Coda for one jump, so its ending is ambiguous.',
			},
		};
	}

	return {
		facts: {
			originIndex,
			destIndex,
			...(toCodaIndex !== undefined ? { toCodaIndex } : {}),
			...(codaIndex !== undefined ? { codaIndex } : {}),
			...(fineAt.length === 1 ? { fineIndex: fineAt[0] } : {}),
		},
	};
}

/**
 * Increment 2: the jump family, with simple repeats coexisting. Voltas are excluded
 * by `validateJumpScope` before we get here, so pass numbering is occurrence-count
 * (a measure's pass is how many times it has been sung so far), which coincides with
 * increment 1's span-pass across the no-volta subset.
 *
 * The simulation runs one forward traversal (repeats active) until the single
 * D.C./D.S. fires, then a return traversal (repeats suppressed) that ends at Fine,
 * jumps at To Coda, or runs to the end.
 */
export function unfoldWithJumps(measures: MeasureRepeatMarkers[]): UnfoldResult {
	const scope = validateJumpScope(measures);
	if ('flag' in scope) return { ok: false, flag: scope.flag };
	if ('noJumpEffect' in scope) return unfoldRepeatsAndVoltas(measures);
	const facts = scope.facts;

	const n = measures.length;
	const order: UnfoldedMeasure[] = [];
	const occ = new Map<number, number>();
	const push = (idx: number): void => {
		const p = (occ.get(idx) ?? 0) + 1;
		occ.set(idx, p);
		order.push({ source: idx, pass: p });
	};

	let i = 0;
	let returning = false; // are we on the post-jump return traversal?
	let consumedJump = false; // the single D.C./D.S. fires exactly once
	let spanStart = 0;
	let inSpan = false;
	let steps = 0;
	const maxSteps = n * 64 + 1000;

	while (i < n) {
		if (++steps > maxSteps) {
			return flag('ambiguous', 'runaway', 'The performance order did not resolve to a finite sequence.', i);
		}
		const m = measures[i];

		// Fine ends the return traversal: play the Fine measure, then stop.
		if (returning && m.fine) {
			push(i);
			break;
		}

		// Opening a repeat span (first traversal only; suppressed on the return).
		if (!returning && m.startRepeat) {
			if (inSpan && spanStart !== i) {
				return flag('unsupported', 'nested-repeat', 'Nested repeats are not yet unfolded.', i);
			}
			if (!inSpan) {
				inSpan = true;
				spanStart = i;
			}
		}

		push(i);

		// To Coda: on the return traversal only, jump forward to the coda destination.
		if (returning && m.toCoda !== undefined && facts.codaIndex !== undefined) {
			i = facts.codaIndex;
			continue;
		}

		// Backward repeat (first traversal only; suppressed on the return). The play
		// count is the occurrence count of this end-repeat measure.
		if (!returning && m.endRepeat) {
			const times = m.times ?? 2;
			const plays = occ.get(i) ?? 1;
			if (plays < times) {
				i = spanStart;
				continue;
			}
			inSpan = false;
			spanStart = 0;
			i++;
			continue;
		}

		// The single D.C./D.S. origin: fires once, on the first traversal.
		if (!returning && !consumedJump && (m.daCapo || m.dalSegno !== undefined)) {
			consumedJump = true;
			returning = true;
			inSpan = false;
			spanStart = 0;
			i = facts.destIndex;
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
	repeatAfterJump?: boolean;
	ending?: { passes: number[] };
	/** Jump-family navigation, populated by the parser from MusicXML `<sound>`. */
	jump?: {
		segno?: string;
		coda?: string;
		daCapo?: boolean;
		dalSegno?: string;
		toCoda?: string;
		fine?: boolean;
		timeOnly?: boolean;
		markWithoutSound?: boolean;
	};
	/** Legacy escape hatch for an unstructured jump signal. */
	hasJump?: boolean;
}

/** Bridge a parsed measure list to the unfolder's markers (naming differs by layer). */
export function markersFromMeasures(measures: MeasureLike[]): MeasureRepeatMarkers[] {
	return measures.map((m) => {
		const marker: MeasureRepeatMarkers = {};
		if (m.repeatStart) marker.startRepeat = true;
		if (m.repeatEnd) marker.endRepeat = true;
		if (m.repeatTimes !== undefined) marker.times = m.repeatTimes;
		if (m.repeatAfterJump) marker.afterJump = true;
		if (m.ending) marker.endingPasses = m.ending.passes;
		const j = m.jump;
		if (j) {
			if (j.segno !== undefined) marker.segno = j.segno;
			if (j.coda !== undefined) marker.coda = j.coda;
			if (j.daCapo) marker.daCapo = true;
			if (j.dalSegno !== undefined) marker.dalSegno = j.dalSegno;
			if (j.toCoda !== undefined) marker.toCoda = j.toCoda;
			if (j.fine) marker.fine = true;
			if (j.timeOnly) marker.timeOnly = true;
			if (j.markWithoutSound) marker.jumpMarkWithoutSound = true;
		}
		if (m.hasJump) marker.hasJump = true;
		return marker;
	});
}
