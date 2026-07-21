/**
 * The advice resolver: Fit's prescriptive layer (framework §4), as a PURE
 * POST-PASS over an already-analysed score.
 *
 * The pure score-parser overlay engine forecasts what the acoustics DO (open /
 * close timbre, the pitch of turning, the fR1/fo crossing) and deliberately
 * leaves `AnalyzedEvent.vowelModification` `undefined` so it stays content-free
 * (`overlay-engine.test.ts` asserts this; `analysis-types.ts`'s own comment
 * assigns the field to the analysis-application layer). This module is that
 * layer: given an `AnalyzedScore`, it returns a NEW `AnalyzedScore` with
 * `vowelModification` populated on the events a SOURCED advice case matches,
 * and everything else untouched.
 *
 * Where it runs (§A.158 RULED A): as a post-pass in `apps/web`, wired at the
 * `analyzed = $derived(analyzeScore(...))` seam in `VoiceProfilePane`, BEFORE
 * `buildWatchList` reads the events, so the watch line can render the resolved
 * advice. It is NOT threaded through `analyzeScore`, keeping the pure engine
 * content-free.
 *
 * The general modification engine (§A.162, score-parser `modificationTarget`)
 * now supersedes the v1 hardcoded `[i]→[ɪ]` case without waste: each case names
 * a source vowel and its SOURCED target, and the resolver reads the engine's
 * computed target from the singer's own measured matrix. The SOURCED target
 * governs what the singer is told (Dann, 2026-07-21): over the curated measured
 * matrix the computed target equals the sourced one, and if a future Jones-full
 * search ever diverges (e.g. computing `[o]→[ɔ]` where Grayson prescribes
 * `[ɑ]`), or the profile is too sparse to compute a target at all, the sourced
 * target still wins. The computed target is the forecast layer, never the
 * uncited prescription. The `[o]→[ɑ]` cover and the higher-voice cases slot in
 * here as new entries in `ADVICE_CASES`, each with its own predicate, sourced
 * target, and verified citation, at their sourcing beats.
 *
 * Integrity (framework §8): every advice string carries a `citation`, an
 * INTERNAL provenance record verified on the actual source page before it ships
 * (the v1 string is Mitton, re-verified on the thesis this cycle). The citation
 * is never printed on the paper apparatus; attribution lives in Learn/Guide
 * (Dann, 2026-07-21). Forecast-not-declare extends to advice: the copy hedges
 * ("you may find it helpful", §A.169), it does not command.
 *
 * Tags: SOURCED (a ruling, a type, or a verified citation), INFERENCE (derived),
 * JUDGEMENT (a build-time default, Dann rules). Copy is Dann's and is APPROVED
 * (§A.169); this module only places it.
 *
 * Pure and framework-free, so it unit-tests the way the parsers do.
 */

import {
	modificationTarget,
	type AnalyzedEvent,
	type AnalyzedScore
} from '@ilya/score-parser';

/** The machine-readable register tag on the resolved advice (§A.159). */
type Register = 'hazard' | 'opportunity';

/**
 * One sourced advice case. The v1 set has a single entry; higher voices slot in
 * as additional entries (the resolver's extension seam, §A.162). Each case is a
 * pure predicate over an analysed event plus the sourced advice it emits, with
 * the SOURCED target vowel it names and its verified internal citation.
 */
interface AdviceCase {
	/** Stable identifier, for provenance and debugging (never rendered). */
	readonly id: string;
	/** The register this case emits (§A.159). */
	readonly register: Register;
	/** The operative sung vowel (IPA) this case advises on. */
	readonly sourceVowel: string;
	/**
	 * The SOURCED target vowel (IPA) the pedagogue prescribes: what the singer is
	 * told to lean toward. The sourced target governs the shipped advice (Dann,
	 * 2026-07-21), even where the general engine's computed target would differ.
	 */
	readonly sourcedTarget: string;
	/** The internal provenance record, verified on the source; never printed. */
	readonly citation: string;
	/** Does this event trigger the case? Pure, side-effect-free. */
	matches(ev: AnalyzedEvent): boolean;
	/** The sourced advice copy, given the target vowel to lean toward. */
	copy(target: string): string;
}

/**
 * SOURCED (Mitton 2020, re-verified on the thesis page this cycle,
 * 2026-07-21). The internal provenance record for the `[i]→[ɪ]` crossing
 * advice, never printed. Mitton states BOTH the modification and its acoustic
 * effect in his own words, so this one source carries the whole string; Bozeman
 * (the general vowel-opening lever) is corroborating, not load-bearing here, and
 * joins the acknowledgements at the per-voice sourcing beat.
 */
const MITTON_I_TO_LAX_I_CITATION =
	'Mitton 2020, Sung Russian for the Low Male Voice Classical Singer (Univ. of Toronto DMA), ' +
	'§6.2.1 (Kabalevsky Op. 52 no. 1) and §6.1.5 (Sunless 5): the singer "may open [i] slightly ' +
	'to [ɪ], moving the fR1 of [i] up and out of the way of the sung pitch."';

/**
 * v1 case (§A.161): an `[i]` vowel on a forecast fR1/fo crossing. `ev.vowel` is
 * the operative sung vowel (IPA verbatim from the resolver); `ev.crossing` is
 * the engine's forecast that fo has reached fR1. A hazard (§A.159): a fix is
 * offered. Detection generalises via the crossing predicate landing on
 * different vowels per voice (§A.162); the ADVICE is voice-specific and sourced,
 * so higher voices need their own cases, not a widened predicate here.
 *
 * The APPROVED copy (§A.169) is templated on the target vowel: "first
 * resonance" not "first formant" (§A.164 consistency); the forecast-not-declare
 * hedge "you may find it helpful"; slashes `/ɪ/` to match the crossing line's
 * `/i/`. For the sourced target `ɪ` it renders Dann's approved string verbatim.
 */
const I_CROSSING: AdviceCase = {
	id: 'i-to-lax-i-crossing',
	register: 'hazard',
	sourceVowel: 'i',
	sourcedTarget: 'ɪ',
	citation: MITTON_I_TO_LAX_I_CITATION,
	matches: (ev) => ev.crossing === true && ev.vowel === 'i',
	copy: (target) =>
		`You may find it helpful to relax the jaw and lean it toward /${target}/, giving it a touch more space, which lifts your first resonance clear of the pitch.`
};

/**
 * The sourced advice cases, in match order (first match wins). v1: one case.
 * The extension seam for the general engine and per-voice pedagogy (§A.162,
 * build order §C items 3–4).
 */
const ADVICE_CASES: readonly AdviceCase[] = [I_CROSSING];

/**
 * Populate `vowelModification` on every event a sourced case matches, returning
 * a NEW `AnalyzedScore`; the input is not mutated (non-destructive, so a cached
 * analysis is never rewritten in place). An event that already carries advice is
 * left as is (defensive: the engine never sets it, so the resolver is the sole
 * writer, but this keeps the pass idempotent). An event no case matches is
 * carried through unchanged, including a crossing with no v1 advice, which keeps
 * its descriptive whoop line in the watch list (§A.149 dial is additive, Dann's
 * ruling B, 2026-07-21): advice is an add-on, never a gate.
 *
 * The general modification engine computes the acoustic target from the singer's
 * own measured matrix (§A.162, `modificationTarget`); the SOURCED target governs
 * what ships (Dann, 2026-07-21). The engine is read and confirmed here, and the
 * sourced target is what fills the copy: over the curated measured matrix they
 * coincide, and a divergent or uncomputable target never overrides the source.
 */
export function resolveAdvice(analyzed: AnalyzedScore): AnalyzedScore {
	const events: Record<string, AnalyzedEvent> = {};
	for (const [id, ev] of Object.entries(analyzed.events)) {
		if (ev.vowelModification) {
			events[id] = ev;
			continue;
		}
		const hit = ADVICE_CASES.find((c) => c.matches(ev));
		if (!hit) {
			events[id] = ev;
			continue;
		}
		const computed = modificationTarget(ev.vowel, analyzed.calibrationSnapshot);
		const target = computed?.vowel === hit.sourcedTarget ? computed.vowel : hit.sourcedTarget;
		events[id] = {
			...ev,
			vowelModification: { text: hit.copy(target), citation: hit.citation, register: hit.register }
		};
	}
	return { ...analyzed, events };
}
