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

import type { VoiceProfileSnapshot } from '@ilya/score-parser';
import { t, type Language } from '$lib/i18n';
import type { CalibratedFormant, VoiceCharacteristics, Vowel } from './engine/types';
import { DERIV_SOURCE, deriveFrom } from './engine/derivations';

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
 * @param formants the active voice's direct-sample formants (captured or
 *   provisional); a reading with no usable f1, or one the plausibility guard
 *   judged implausible, contributes no fR1 (§B.4). A derivable vowel absent
 *   from this map is derived from its anchors here, per snapshot and never
 *   stored (N.109).
 * @param characteristics the typed range/tessitura/passaggio, or undefined
 *   when the singer skipped the phase entirely.
 * @param label optional citation-block label (e.g. the voice name or type).
 */
export function buildVoiceProfileSnapshot(
	formants: Partial<Record<Vowel, CalibratedFormant>>,
	characteristics: VoiceCharacteristics | undefined,
	label?: string,
): AdaptedProfile {
	// fR1 per vowel from the measured formants. A vowel the singer never sang,
	// or a reading with no usable f1, contributes nothing: the engine already
	// omits any event whose vowel has no fR1, so silence here is honest.
	//
	// §B.4 RULED (Dann, 2026-07-15): the same silence extends to a reading the
	// plausibility guard judged IMPLAUSIBLE, and to nothing else. Fit will not
	// build acoustic marks on a number the engine has already decided cannot be
	// that vowel (the motivating class: fR1 ≈ 1063 Hz extracted for a sung [i]).
	//
	// What is deliberately NOT excluded, and why: `reading: 'provisional'` is a
	// SIGNAL-QUALITY verdict, not a physical one. analyze.ts:30-34 sets it from
	// `confidence === 'low'`, which means no stable window, a rejected detection,
	// or SNR under 12 dB. A noisy capture of an honest vowel is still an honest
	// vowel, and analyze.ts:26-29 records that real-room captures land there
	// routinely. Excluding on `reading` would silently drop good data for any
	// singer without a quiet room. Plausibility and confidence are orthogonal by
	// ruling (engine/types.ts), and only plausibility speaks to whether the
	// number can be the vowel.
	//
	// `plausibility` absent means the guard never ran (values predating it, or
	// derived values), which is `unchecked`, not a verdict. Unchecked is kept:
	// the guard's own tri-state ruling says absence of a window is not a failure.
	const fR1: Record<string, number> = {};
	for (const [vowel, formant] of Object.entries(formants) as [Vowel, CalibratedFormant | undefined][]) {
		if (
			formant &&
			typeof formant.f1 === 'number' &&
			formant.f1 > 0 &&
			formant.plausibility !== 'implausible'
		) {
			fR1[vowel] = formant.f1;
		}
	}

	// fR2 per vowel, for the higher-voice second-resonance work. Mirrors the
	// fR1 gating (a positive number, not judged implausible) plus the f2-specific
	// quality: an `absent` read contributes nothing. `marginal` is KEPT, parallel
	// to fR1 keeping `provisional` above (a signal-quality verdict, not a physical
	// one); tighten this to `clear`-only if smoke shows marginal fR2 misfiring. A
	// vowel with no usable fR2 is omitted, so any fR2-based mark degrades to
	// nothing rather than guessing. A low voice may populate fR2 no event reaches:
	// honest and inert.
	const fR2: Record<string, number> = {};
	for (const [vowel, formant] of Object.entries(formants) as [Vowel, CalibratedFormant | undefined][]) {
		if (
			formant &&
			typeof formant.f2 === 'number' &&
			formant.f2 > 0 &&
			formant.f2Quality !== 'absent' &&
			formant.plausibility !== 'implausible'
		) {
			fR2[vowel] = formant.f2;
		}
	}

	// N.109: the four derivable vowels reach the forecast too.
	//
	// The wizard's roster has always shown a derived fR1/fR2 for a challenging
	// vowel the singer never sang, greyed and labelled Estimated (Dann,
	// 2026-07-02). Its comment said the analysis layer used the same derive().
	// It did not: the two loops above read measured formants only, so a singer
	// who sang [i] and [u] saw an Estimated [ɨ] on the roster and got no
	// acoustic mark on a single [ɨ] in the score. The roster and the forecast
	// now read one anchor table and one usability gate (`deriveFrom`,
	// derivations.ts), so they cannot disagree, and the wizard's comment is
	// true.
	//
	// NOTHING IS WRITTEN TO THE STORED PROFILE. This is computed per snapshot,
	// from the sampled formants handed in. The standing rule holds unchanged:
	// the stored profile keeps only what was actually sung (Dann, 2026-07-02;
	// profileStore.ts's contract note), and a derived value is recomputed on
	// every render rather than persisted.
	//
	// A MEASURED READING ALWAYS WINS. Each channel is filled only where the
	// loops above left it empty, so a sung [ɨ] is never displaced by a derived
	// one. `deriveFrom` gates every anchor on a positive f1 and f2 and on the
	// plausibility guard's verdict, carrying §B.4 inward: Fit will not build a
	// derived value on a number the engine has already decided cannot be that
	// vowel. The derived fR2 is gated as the measured fR2 loop is — the derived
	// reading carries no f2Quality and no plausibility, both of which mean "not
	// assessed" and pass, so the live condition is a positive number.
	//
	// No anchor is itself derivable, and `formants` is the sampled map, so
	// nothing here derives from a derived value.
	for (const vowel of Object.keys(DERIV_SOURCE) as Vowel[]) {
		if (fR1[vowel] !== undefined && fR2[vowel] !== undefined) continue;
		const derived = deriveFrom(vowel, formants);
		if (!derived) continue;
		if (fR1[vowel] === undefined && typeof derived.f1 === 'number' && derived.f1 > 0) {
			fR1[vowel] = derived.f1;
		}
		if (fR2[vowel] === undefined && typeof derived.f2 === 'number' && derived.f2 > 0) {
			fR2[vowel] = derived.f2;
		}
	}

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
		...(Object.keys(fR2).length > 0 ? { fR2 } : {}),
		...(range ? { range } : {}),
		...(tessitura ? { tessitura } : {}),
		...(passaggio ? { passaggio } : {}),
		...(label !== undefined ? { label } : {}),
	};

	return {
		snapshot,
		completeness: completenessOf(snapshot),
	};
}

/**
 * The broad-analysis legend text (§B.5): the print-native disclosure shown
 * in the Fit page footer when acoustic marks render but a characteristics
 * dimension was left blank. Composed from localized parts so EN and FR share
 * one structure; the two-item join is language-specific (EN "and", FR "ni",
 * the idiomatic "sans X ni Y"). Returns '' when nothing is broad, so an empty
 * result reads as "no legend".
 */
export function composeBroadNote(c: AnalysisCompleteness, language: Language): string {
	const items: string[] = [];
	if (!c.range || !c.tessitura) items.push(t('fit.broad.itemRange', language));
	if (!c.passaggio) items.push(t('fit.broad.itemPassaggio', language));
	if (items.length === 0) return '';
	const list =
		items.length === 2 ? `${items[0]} ${t('fit.broad.join', language)} ${items[1]}` : items[0];
	return t('fit.broad.body', language).replace('{items}', list);
}
