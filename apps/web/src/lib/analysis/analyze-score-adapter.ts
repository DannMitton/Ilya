/**
 * The analysis adapter: the active voice's stored calibration to the overlay
 * engine's VoiceProfileSnapshot (E.5 slice 4).
 *
 * `analyzeScore` reads one minimal shape, `VoiceProfileSnapshot`
 * (analysis-types.ts): per-vowel fR1, plus an OPTIONAL singer range,
 * tessitura, and passaggio. The app stores those across two places: measured
 * resonances in `VoiceProfile.calibratedFormants` (engine/types.ts) and the
 * typed edges in `VoiceCharacteristics`, every field of which is optional
 * because the wizard's Voice characteristics phase is skippable (§A.31).
 * This adapter is the one seam that reconciles the two.
 *
 * Honesty model, Option A (Dann ruled 2026-07-15, replacing the earlier
 * sentinel-band design): **genuine absence, not a permissive default.** A
 * dimension the singer did not provide is simply omitted from the snapshot.
 * The overlay engine reads that absence directly (`profile.range === undefined`,
 * and so on) and skips the comparison rather than being handed inert bounds
 * engineered to never fire. `undefined` on `rangeStatus` or `inPassaggio`
 * means "not assessed"; it is never collapsed into a negative finding.
 *
 * Why this replaced the sentinel design: the sentinel bands' correctness
 * depended on a cross-module proof, pinned to a date, against
 * overlay-engine.ts's exact comparisons. Nothing enforced that proof; a
 * changed comparison there could make a sentinel start firing silently, and
 * the failure would look like a real analysis result rather than a bug.
 * Correct by construction (the type says "may be absent," the engine handles
 * absence) beats correct by cross-module audit.
 *
 * The COMPLETENESS descriptor is now derived from the snapshot, not tracked
 * in parallel (`completenessOf` below): the snapshot is the single truth,
 * and completeness is a view of it, so the two channels cannot disagree.
 */

import type { IntakeAnswers, VoiceProfileSnapshot } from '@ilya/score-parser';
import { t, type Language } from '$lib/i18n';
import type { CalibratedFormant, VoiceCharacteristics, Vowel } from '$lib/voice/engine/types';
import { resolveVowelValues } from '$lib/voice/engine/resolve-values';
import type { StandInReport } from '$lib/voice/engine/stand-ins';

// N.199 Step 1: the judging of unjudged readings moved with the value resolution, to `voice/engine/resolve-values.ts`.
// Kept exported here because the adapter's tests and the older notes name it by this module.
export { judgeUnchecked } from '$lib/voice/engine/resolve-values';

/**
 * Which analysis dimensions rest on real singer input. Derived from the
 * snapshot (`completenessOf`), never tracked independently of it.
 */
export interface AnalysisCompleteness {
	/** At least one measured fR1 is present, so acoustic marks can be forecast. */
	formants: boolean;
	/** Both range edges were provided. */
	range: boolean;
	/** Both tessitura edges were provided. */
	tessitura: boolean;
	/** Both passaggio edges were provided: the zona di passaggio needs primo and secondo (§B.3). */
	passaggio: boolean;
}

/** The adapter's result: the engine's snapshot plus the completeness signal. */
export interface AdaptedProfile {
	snapshot: VoiceProfileSnapshot;
	completeness: AnalysisCompleteness;
	/**
	 * QUEUE row 17: what the stand-ins did, absent when nothing is sung. `retake`
	 * lists sung vowels the fit left out (off its shape) or the guard failed,
	 * for the calibration summary to offer a retake; nothing draws it yet.
	 */
	standIns?: StandInReport;
	/**
	 * QUEUE row 166, internal word: no vowel is sung and every fR1 is a placeholder
	 * from the declared type's template (`hasPlaceholderProfile`). A view of
	 * `standIns`, computed per snapshot and never stored (`CONTRACT.md` §8, as
	 * `standIns` itself): it is false for a voice with any sung vowel, and for a
	 * voice whose type has no placeholder profile. The pages read it to say "not
	 * calibrated"; `completeness.formants` is true for it, because numbers exist.
	 */
	generic: boolean;
}

/**
 * True when any dimension the broad-analysis note tracks is a default rather
 * than real singer input. Formants are excluded: with no fR1 the engine
 * omits every event, so the render is notation-only and the note has nothing
 * to qualify.
 */
export function isBroadAnalysis(c: AnalysisCompleteness): boolean {
	return !(c.range && c.tessitura && c.passaggio);
}

/**
 * Completeness derived from the snapshot itself: the snapshot is the single
 * truth, and this is a view of it, so the two can never disagree (Option A,
 * replacing the earlier parallel-tracked completeness).
 */
export function completenessOf(s: VoiceProfileSnapshot): AnalysisCompleteness {
	return {
		formants: Object.keys(s.fR1).length > 0,
		range: s.range !== undefined,
		tessitura: s.tessitura !== undefined,
		passaggio: s.passaggio !== undefined,
	};
}

/**
 * Build the overlay-engine snapshot from the active voice's stored formants
 * and typed characteristics. Pure: no store reads, no DOM, deterministic, so
 * it is sandbox-testable the way `analyzeScore` is.
 *
 * @param sampled the active voice's direct-sample formants (captured or
 *   provisional); a reading with no usable f1, or one the plausibility guard
 *   judged implausible, contributes no fR1 (§B.4). A derivable vowel absent
 *   from this map is derived from its anchors here, per snapshot and never
 *   stored (N.109).
 * @param characteristics the typed range/tessitura/passaggio, or undefined
 *   when the singer skipped the phase entirely.
 * @param label optional citation-block label (e.g. the voice name or type).
 * @param intake N.172's answers, when the singer gave any; carried into the
 *   snapshot for the note comments (`comments.ts`), never read here.
 */
export function buildVoiceProfileSnapshot(
	sampled: Partial<Record<Vowel, CalibratedFormant>>,
	characteristics: VoiceCharacteristics | undefined,
	label?: string,
	intake?: IntakeAnswers,
	/** The declared voice type (Tier 1 id), which picks the stand-ins' starting staff (QUEUE row 17). */
	voiceType?: string,
): AdaptedProfile {
	// N.199 Step 1: the resolution of every vowel's fR1 and fR2 (judge, sung, derived, stand-in) is one function in
	// `voice/engine/resolve-values.ts`, shared with the calibration chart. The rules, and the rulings behind them
	// (QUEUE rows 11, 12, 17, 166; N.109; section B.4), are written there. This adapter asks for today's rule: stand-ins
	// for a voice that has sung nothing only when its declared type has a placeholder profile.
	const { fR1, fR2, fR1Source, fR2Source, generic, standIns } = resolveVowelValues(sampled, voiceType, { placeholders: 'declared-types' });

	const c = characteristics;
	const hasRange = c?.rangeLow !== undefined && c?.rangeHigh !== undefined;
	const hasTessitura = c?.tessituraLow !== undefined && c?.tessituraHigh !== undefined;
	const hasPassaggio = c?.passaggioPrimary !== undefined && c?.passaggioSecondary !== undefined;

	// A dimension the singer did not provide is simply omitted: genuine
	// absence, not a permissive default (Option A). The overlay engine reads
	// `profile.range === undefined`, and so on, directly.
	const range = hasRange ? { lowest: { ...c!.rangeLow! }, highest: { ...c!.rangeHigh! } } : undefined;

	const tessitura = hasTessitura ? { low: { ...c!.tessituraLow! }, high: { ...c!.tessituraHigh! } } : undefined;

	// §B.3 RULED (Dann, 2026-07-16): the zona di passaggio is derived only when
	// BOTH edges are declared. Primo and secondo are the lower and upper
	// boundaries of the zone (Miller, The Structure of Singing, pp. 116-117); a
	// single self-declared pitch is a boundary, not a zone. A lone edge yields
	// no passaggio, so `inPassaggio` stays `undefined` (not assessed), never a
	// point band that would read as a negative finding for every off-break note.
	// No width is inferred from one edge: individual variation is carried by
	// self-declaration, not a synthesized span.
	const passaggio = hasPassaggio
		? { primo: { ...c!.passaggioPrimary! }, secondo: { ...c!.passaggioSecondary! } }
		: undefined;

	const snapshot: VoiceProfileSnapshot = {
		fR1,
		fR1Source,
		...(Object.keys(fR2).length > 0 ? { fR2, fR2Source } : {}),
		...(range ? { range } : {}),
		...(tessitura ? { tessitura } : {}),
		...(passaggio ? { passaggio } : {}),
		...(label !== undefined ? { label } : {}),
		// N.172: the singer's own answers, carried as given. Nothing here reads them.
		...(intake !== undefined ? { intake: { ...intake, ...(intake.topics ? { topics: { ...intake.topics } } : {}) } } : {}),
	};

	return {
		snapshot,
		...(standIns ? { standIns } : {}),
		completeness: completenessOf(snapshot),
		generic,
	};
}

/**
 * The broad-analysis legend text (§B.5): the print-native disclosure shown
 * in the Markup page footer when acoustic marks render but a characteristics
 * dimension was left blank. Composed from localized parts so EN and FR share
 * one structure; the two-item join is language-specific (EN "and", FR "ni",
 * the idiomatic "sans X ni Y"). Returns '' when nothing is broad, so an empty
 * result reads as "no legend".
 *
 * QUEUE row 166: `placeholders` is `AdaptedProfile.generic`. The note's closing
 * sentence says the forecast reflects the singer's measured resonances, which a
 * placeholder voice has none of, so that voice gets the note without it
 * (`analysis.broad.body.generic`, RATIFIED by Dann 2026-11-10).
 */
export function composeBroadNote(c: AnalysisCompleteness, language: Language, placeholders = false): string {
	const items: string[] = [];
	if (!c.range || !c.tessitura) items.push(t('analysis.broad.itemRange', language));
	if (!c.passaggio) items.push(t('analysis.broad.itemPassaggio', language));
	if (items.length === 0) return '';
	const list =
		items.length === 2 ? `${items[0]} ${t('analysis.broad.join', language)} ${items[1]}` : items[0];
	return t(placeholders ? 'analysis.broad.body.generic' : 'analysis.broad.body', language).replace('{items}', list);
}
