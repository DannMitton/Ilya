/**
 * The measurement seam: a parsed score to the four quantities the E.20
 * measurement layer computes, in one call, with every absence genuine.
 *
 * Composition only. Every number here is produced by a module in
 * `@ilya/score-parser` that owns it and is tested there; this file decides
 * nothing about music and nothing about phonology. What it does own is the
 * threading, and there is exactly one thing in that threading that can go
 * wrong quietly, so it is done in one place: **every call that needs a tempo
 * is given the SAME options object.** `secondsFor` and `totalFoldCycles`
 * each resolve the tempo internally, so handing them different options would
 * produce a seconds figure and a cycle count that silently disagreed about
 * what tempo the piece is in.
 *
 * ## What to pass
 *
 * Pass the PERFORMANCE-ORDER score (`scoreInPerformanceOrder(...).score`)
 * when the question is what the singer actually sings: repeats taken, the
 * D.C./D.S. family followed, material after a Fine absent. Pass the notated
 * score when the question is about the page. `aggregatePhonation`'s own
 * docstring states the same choice; this seam does not make it for you.
 *
 * ## Absence
 *
 * Every optional field is OMITTED rather than defaulted, and each omission
 * means one specific thing:
 *
 *   `tessitura` absent   nothing was sung, so there is no band to cut. Never
 *                        a zero-width band at a pitch that is never sung.
 *   `tempo` absent       the score states no tempo of any kind and the singer
 *                        set none. A fabricated bpm would make every figure
 *                        downstream of it a guess wearing a number's
 *                        confidence.
 *   `seconds` absent     either no tempo, or a tempo whose beat unit has no
 *                        known whole-note length. `tempo` can therefore be
 *                        present while `seconds` is absent, which is why the
 *                        two are separate fields rather than one nested.
 *   `foldCycles` absent  wherever `seconds` is.
 *   `byVowel` absent     no resolver was supplied, so no vowel was ever asked
 *                        for. Absent is not empty.
 *
 * ## Two limitations that travel with the result
 *
 * **The diction-mark fold is NOT applied here** (Dann's scope ruling,
 * 2026-08-02: wire additively first, fold next). `#` still occupies a
 * syllable slot, which puts every later syllable of that verse one note
 * late. That misalignment reaches `byVowel` and `byPitchByVowel` and NOTHING
 * else: `byPitch`, `total`, `tessitura`, `seconds`, and `foldCycles` never
 * consult a syllable, so they are unaffected. Read the per-vowel breakdown as
 * provisional until `foldDictionMarks` is in the resolver chain; the rest
 * stands.
 *
 * **`trust.untrustedQuavers` is included in the totals**, not excluded.
 * `aggregatePhonation` reports it rather than dropping it, because quietly
 * removing time from a total is a second unvouched claim on top of the first.
 * A surface that shows a total should be able to say how much of it sits in a
 * bar that closes under no metre.
 */

import {
	aggregatePhonation,
	pachecoTessitura,
	resolveTempo,
	secondsFor,
	totalFoldCycles,
	type FoldCycleResult,
	type ParsedScore,
	type PhonationTotals,
	type ResolveTempoOptions,
	type SecondsResult,
	type TempoResolution,
	type TessituraOptions,
	type TessituraResult,
	type VowelForEvent
} from '@ilya/score-parser';

export interface ScoreMetricsOptions {
	/**
	 * The operative sung vowel per event, normally `buildVowelResolver(...)`.
	 * Omit it and the per-vowel totals are absent rather than empty.
	 */
	vowelForEvent?: VowelForEvent;
	/**
	 * The singer's tempo override, if they have set one. Threaded to every
	 * tempo-consuming call so they cannot disagree.
	 */
	tempo?: ResolveTempoOptions;
	/** Pacheco margin and fallback controls. Defaults are the published rule. */
	tessitura?: TessituraOptions;
}

export interface ScoreMetrics {
	/** Always present: summing what is on the page needs no tempo and no singer. */
	phonation: PhonationTotals;
	/** Pacheco's half-maximum band. Absent when nothing was sung. */
	tessitura?: TessituraResult;
	/** The tempo in force, with provenance. Absent when the score states none. */
	tempo?: TempoResolution;
	/** Total sung time in seconds. Absent wherever a tempo is. */
	seconds?: SecondsResult;
	/** Nominal vocal-fold cycles over the whole line. Absent wherever `seconds` is. */
	foldCycles?: FoldCycleResult;
}

/**
 * Measure a parsed score.
 *
 * Note on cost: `totalFoldCycles` resolves the tempo once per distinct pitch,
 * so a call is O(distinct pitches) tempo resolutions rather than one. That is
 * the module's shape, not this seam's, and it is recorded here rather than
 * worked around because a caller putting this inside a `$derived` should know
 * it re-runs the whole aggregation on every dependency change.
 */
export function scoreMetrics(parsed: ParsedScore, options: ScoreMetricsOptions = {}): ScoreMetrics {
	const tempoOptions: ResolveTempoOptions = options.tempo ?? {};

	const phonation = aggregatePhonation(parsed, {
		...(options.vowelForEvent ? { vowelForEvent: options.vowelForEvent } : {})
	});

	const tessitura = pachecoTessitura(phonation.byPitch, options.tessitura ?? {});
	const tempo = resolveTempo(parsed, tempoOptions);
	const seconds = secondsFor(phonation.total, parsed, tempoOptions);
	const foldCycles = totalFoldCycles(phonation, parsed, tempoOptions);

	return {
		phonation,
		...(tessitura ? { tessitura } : {}),
		...(tempo ? { tempo } : {}),
		...(seconds ? { seconds } : {}),
		...(foldCycles ? { foldCycles } : {})
	};
}
