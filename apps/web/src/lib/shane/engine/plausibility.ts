/**
 * The plausibility guard (engine-spec amendment, LOCKED 2026-07-11).
 *
 * Motivation: a live capture extracted fR1 ≈ 1063 Hz for a sung [i] — not a
 * plausible [i] first resonance for any voice type — and only the general
 * confidence tier flagged it. This module gives the engine a vowel-aware
 * notion of "that number cannot be that vowel."
 *
 * Windows are Bozeman's boxed fR1:1fo bands, transcribed by Dann
 * (citation-grade, harmonic cross-checks) on 2026-07-11:
 *   - Soprano / Bass / Tenor-Mezzo: Bozeman, *Kinesthetic Voice Pedagogy*,
 *     2nd ed. (2021), Figures 8/9/10, pp. 75–77 (Fig 10 repeats p. 126).
 *   - Baritone: Bozeman, "Levels of Acoustic Registration" (downloadable
 *     PDF, kenbozeman.com/Pedagogic-Resources.php); chart absent from the
 *     book.
 * Full provenance, interpretive flags, and the harmonic cross-check record:
 * `bozeman-kvp2-fr1-transcription_2026-07-11.md`. Bozeman labels all values
 * approximate; the margin below absorbs that quantization deliberately.
 *
 * Design rulings (Kimi, 2026-07-11): tri-state result (`unchecked` is a
 * valid outcome, not an error); plausibility never demotes `confidence`
 * (orthogonal facts — the reading demotion to Provisional happens at the
 * wizard boundary); margin ±2 semitones PROVISIONAL, tightened only on
 * logged evidence (distance-to-edge is logged for every extraction, not
 * just failures); union bands are computed first, margin applied after
 * (margin-then-union would widen the guard twice).
 */

import type { CalibratedFormant, Vowel } from './types';
import { expectedF1 } from './derivations';

export type Plausibility = NonNullable<CalibratedFormant['plausibility']>;

/**
 * Voice-type buckets are routing keys to Bozeman value-sets, never labels
 * imposed on the singer (types.ts discipline; Kimi ruling 2026-07-11:
 * self-declaration is the only routing input, capture is never gated on
 * it, and absent a declaration the union bands apply).
 */
export type VoiceTypeBucket = 'soprano' | 'tenor-mezzo' | 'baritone' | 'bass' | 'union';

/** The six Bozeman-covered roster vowels. [ɔ] is charted by Bozeman but is
 * not in Shane's roster (Grayson's mono-phonemic /o/ ruling; see the
 * Story-of-o grounding memo, 2026-07-11). The other four roster vowels
 * ([ɨ] [ɪ] [a] [ʌ]) take anchor-derived windows below. */
type BozemanVowel = 'i' | 'e' | 'ɛ' | 'ɑ' | 'o' | 'u';

/** Core fR1 bands in Hz (A440 equal temperament), [floor, ceiling].
 * Note names in comments are the transcription record's ground truth. */
const CORE_BANDS: Record<Exclude<VoiceTypeBucket, 'union'>, Record<BozemanVowel, [number, number]>> = {
	soprano: {
		i: [329.63, 440.0], // E4–A4
		e: [493.88, 659.26], // B4–E5
		ɛ: [523.25, 698.46], // C5–F5
		ɑ: [587.33, 783.99], // D5–G5
		o: [493.88, 659.26], // B4–E5
		u: [349.23, 493.88] // F4–B4
	},
	'tenor-mezzo': {
		i: [293.66, 392.0], // D4–G4
		e: [493.88, 659.26], // B4–E5
		ɛ: [523.25, 698.46], // C5–F5
		ɑ: [587.33, 783.99], // D5–G5
		o: [440.0, 659.26], // A4–E5
		u: [329.63, 440.0] // E4–A4
	},
	baritone: {
		i: [293.66, 392.0], // D4–G4
		e: [440.0, 587.33], // A4–D5
		ɛ: [493.88, 659.26], // B4–E5
		ɑ: [523.25, 698.46], // C5–F5
		o: [440.0, 587.33], // A4–D5
		u: [293.66, 392.0] // D4–G4
	},
	bass: {
		i: [293.66, 329.63], // D4–E4
		e: [392.0, 493.88], // G4–B4
		ɛ: [493.88, 587.33], // B4–D5
		ɑ: [523.25, 698.46], // C5–F5
		o: [392.0, 493.88], // G4–B4
		u: [293.66, 349.23] // D4–F4
	}
};

/** Citation attribution per bucket (test deliverable: every window constant
 * carries its source). */
export const BAND_SOURCES: Record<Exclude<VoiceTypeBucket, 'union'>, string> = {
	soprano: 'Bozeman, Kinesthetic Voice Pedagogy, 2nd ed. (2021), Fig. 8, p. 75',
	'tenor-mezzo': 'Bozeman, Kinesthetic Voice Pedagogy, 2nd ed. (2021), Fig. 10, pp. 77/126',
	baritone: 'Bozeman, "Levels of Acoustic Registration" (kenbozeman.com PDF; not printed in KVP2)',
	bass: 'Bozeman, Kinesthetic Voice Pedagogy, 2nd ed. (2021), Fig. 9, p. 76'
};

/** Union bands: computed from the core bands FIRST; the margin is applied
 * to the union floor/ceiling afterwards (ruled ordering). */
const UNION_BANDS: Record<BozemanVowel, [number, number]> = (() => {
	const out = {} as Record<BozemanVowel, [number, number]>;
	for (const v of ['i', 'e', 'ɛ', 'ɑ', 'o', 'u'] as BozemanVowel[]) {
		let lo = Infinity,
			hi = -Infinity;
		for (const bucket of Object.values(CORE_BANDS)) {
			lo = Math.min(lo, bucket[v][0]);
			hi = Math.max(hi, bucket[v][1]);
		}
		out[v] = [lo, hi];
	}
	return out;
})();

/** Margins, PROVISIONAL (ruled): evidence-first adjustment only, per the
 * fry-gate recalibration precedent. Expressed as ratios so they scale
 * across the range (a flat-Hz margin would be proportionally enormous at
 * bass [u] and trivial at soprano [ɑ]).
 *
 * ASYMMETRIC by Dann's direction (2026-07-11, same day as the ruling,
 * first field evidence): his own Captured bass [u] measured 255 Hz, an
 * honest reading 0.44 st below the ±2 st floor — a false-alarm class the
 * guard must not produce for darker voices. Floor widened 2 → 3 st;
 * ceiling stays 2 st (the motivating 1063 Hz [i] mis-extraction class is
 * a ceiling catch and is unaffected). Pedagogical asymmetry grounds it:
 * erring dark/closed is the safe direction (Grayson 2012, Appendix K,
 * pp. 396–397 — the Story-of-o grounding memo), so the floor can afford
 * generosity that the ceiling cannot. Kimi notified in the next relay. */
export const FLOOR_MARGIN_SEMITONES = 3;
export const CEILING_MARGIN_SEMITONES = 2;
const FLOOR_RATIO = Math.pow(2, FLOOR_MARGIN_SEMITONES / 12);
const CEILING_RATIO = Math.pow(2, CEILING_MARGIN_SEMITONES / 12);

/** Normalize a free-form declared voice type to a routing bucket. Unknown
 * or missing declarations route to the union bands — never a guess. */
export function bucketFor(voiceType?: string): VoiceTypeBucket {
	const t = (voiceType ?? '').trim().toLowerCase();
	if (t === 'soprano') return 'soprano';
	if (t === 'mezzo' || t === 'mezzo-soprano' || t === 'mezzo soprano' || t === 'tenor')
		return 'tenor-mezzo';
	if (t === 'baritone') return 'baritone';
	if (t === 'bass') return 'bass';
	return 'union';
}

export interface PlausibilityResult {
	plausibility: Plausibility;
	/** Guarded window (margin applied), Hz; absent when `unchecked`. */
	windowLow?: number;
	windowHigh?: number;
	/**
	 * Semitone headroom ABOVE the floor: positive = inside (this far above the
	 * floor), negative = breached the floor (this far below it).
	 * Semitone headroom BELOW the ceiling: positive = inside, negative =
	 * breached the ceiling.
	 * BOTH are logged for EVERY extraction (Kimi's ruling, 2026-07-11): the
	 * floor and ceiling margins now differ (3 vs 2 st), so a single
	 * nearest-edge number would lose the trail needed to tune each edge
	 * independently. The distribution of honest readings near each border is
	 * the evidence base for any future margin change.
	 */
	distanceToFloorSemitones?: number;
	distanceToCeilingSemitones?: number;
	anchorSource: 'bozeman' | 'anchors-derived' | null;
	voiceTypeBucket: VoiceTypeBucket;
}

const st = (a: number, b: number) => 12 * Math.log2(a / b);

/**
 * The guard. Pure: no side effects, no confidence opinion, no blocking.
 * `anchorF1s` are the singer's own stored fR1s (only sung readings are ever
 * stored, so estimated values cannot leak in here; Provisional anchors
 * still feed the guard per the derived-preview ruling of 2026-07-11).
 */
export function checkPlausibility(
	f1: number,
	vowel: Vowel,
	voiceType?: string,
	anchorF1s?: Partial<Record<Vowel, number>>
): PlausibilityResult {
	const voiceTypeBucket = bucketFor(voiceType);

	let coreLo: number | undefined, coreHi: number | undefined;
	let anchorSource: PlausibilityResult['anchorSource'] = null;

	if (vowel in UNION_BANDS) {
		const bands = voiceTypeBucket === 'union' ? UNION_BANDS : CORE_BANDS[voiceTypeBucket];
		[coreLo, coreHi] = bands[vowel as BozemanVowel];
		anchorSource = 'bozeman';
	} else {
		// Anchor-derived window: centre from the singer's own anchors via the
		// derivation ratios (single-sourced in derivations.ts). Margin applies
		// around the centre — there is no band edge to scale (ruled
		// clarification, 2026-07-11).
		const centre = expectedF1(vowel, anchorF1s ?? {});
		if (centre === null || !isFinite(centre) || centre <= 0) {
			// `unchecked` is a valid, expected outcome, not an error (ruled).
			// Non-normative note: in v1 it covers both missing anchors and any
			// roster/window mismatch, resolving to the same enum value.
			return { plausibility: 'unchecked', anchorSource: null, voiceTypeBucket };
		}
		coreLo = centre;
		coreHi = centre;
		anchorSource = 'anchors-derived';
	}

	const windowLow = coreLo! / FLOOR_RATIO;
	const windowHigh = coreHi! * CEILING_RATIO;
	const inside = f1 >= windowLow && f1 <= windowHigh;
	// Both edge distances (Kimi's ruling): floor headroom = st above the floor,
	// ceiling headroom = st below the ceiling. Positive inside, negative when
	// that edge is breached. Keeping both preserves a separate tuning trail per
	// edge now that the margins differ.
	const distanceToFloorSemitones = st(f1, windowLow); // + = above floor
	const distanceToCeilingSemitones = st(windowHigh, f1); // + = below ceiling

	return {
		plausibility: inside ? 'plausible' : 'implausible',
		windowLow: Math.round(windowLow * 100) / 100,
		windowHigh: Math.round(windowHigh * 100) / 100,
		distanceToFloorSemitones: Math.round(distanceToFloorSemitones * 100) / 100,
		distanceToCeilingSemitones: Math.round(distanceToCeilingSemitones * 100) / 100,
		anchorSource,
		voiceTypeBucket
	};
}

/**
 * The structured console-evidence event (ruled schema, Kimi 2026-07-11):
 * one per extraction, giving the raw number, the applied window, the delta
 * in semitones, and a session id for retrieving audio for manual audit.
 * Emission happens at the wizard boundary, which knows `rePromptShown`.
 */
export interface PlausibilityEvent {
	vowel: Vowel;
	declaredVoiceType: string | null;
	extractedFR1: number;
	windowLow: number | null;
	windowHigh: number | null;
	distanceToFloorSemitones: number | null;
	distanceToCeilingSemitones: number | null;
	plausibility: Plausibility;
	rePromptShown: boolean;
	anchorSource: 'bozeman' | 'anchors-derived' | null;
	sessionId: string;
}

export function buildPlausibilityEvent(
	vowel: Vowel,
	f1: number,
	result: PlausibilityResult,
	rePromptShown: boolean,
	sessionId: string,
	declaredVoiceType?: string
): PlausibilityEvent {
	return {
		vowel,
		declaredVoiceType: declaredVoiceType ?? null,
		extractedFR1: Math.round(f1 * 10) / 10,
		windowLow: result.windowLow ?? null,
		windowHigh: result.windowHigh ?? null,
		distanceToFloorSemitones: result.distanceToFloorSemitones ?? null,
		distanceToCeilingSemitones: result.distanceToCeilingSemitones ?? null,
		plausibility: result.plausibility,
		rePromptShown,
		anchorSource: result.anchorSource,
		sessionId
	};
}
