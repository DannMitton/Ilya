/**
 * Shane engine schema.
 *
 * Source of record: shane-extraction-engine-spec_v1_2026-06-09.md §1. These
 * types are shared by the calibration UI now and the analytical engine later,
 * so they live at the engine boundary rather than inside the pacifier.
 */

import type { Pitch } from '@ilya/score-parser';

/** The ten Russian sung vowels (Mitton 2020, Fig 4.2). */
export type Vowel = 'i' | 'e' | 'ɪ' | 'ɨ' | 'ɛ' | 'a' | 'ɑ' | 'ʌ' | 'o' | 'u';

/**
 * Voice type is a routing key to Bozeman value-sets and type-aware logic, not a
 * label imposed on the singer. The exact bucket set is settled with the
 * voice-type and synthesis work; left open here rather than guessed.
 */
export type VoiceType = string;

/** A per-vowel formant reading with provenance (engine spec v1 §1). */
export interface CalibratedFormant {
	f1: number; // Hz
	f2?: number; // Hz, optional
	confidence: 'high' | 'medium' | 'low'; // fR1-primary
	f2Quality?: 'clear' | 'marginal' | 'absent'; // fR2 scored separately
	reading: 'captured' | 'estimated' | 'provisional';
	/**
	 * The plausibility guard's verdict (engine-spec amendment, 2026-07-11):
	 * a vowel-aware fR1 window check against Bozeman's published bands (or
	 * the singer's own anchors for the four Bozeman-absent vowels).
	 * Tri-state by ruling: `unchecked` is a valid outcome (window
	 * unavailable), not an error. Orthogonal to `confidence` (signal
	 * quality) by ruling — an implausible reading resolves to Provisional at
	 * the wizard boundary but its confidence is never touched. Optional:
	 * absent on values predating the guard and on derived/estimated values.
	 */
	plausibility?: 'plausible' | 'implausible' | 'unchecked';
	source:
		| 'measured-user'
		| 'derived-retracted-i'
		| 'derived-interpolated'
		| 'bozeman-table'
		| 'external-measurement';
}

/** A complete calibration profile (engine spec v1 §1). */
export interface VoiceProfile {
	presetId: string;
	isCalibrated: boolean;
	calibratedFormants?: Record<Vowel, CalibratedFormant>;
	calibrationDate?: Date;
	version: 1;
}

/**
 * The singer's typed voice characteristics (Kimi's Q5 ruling, 2026-07-13):
 * range, tessitura, and passaggio, captured typed-first through note
 * pickers — the capture machinery exists for verification, not discovery
 * (range extremes sung on demand invite pushing; tessitura is inherently
 * subjective; passaggio is pedagogical knowledge for most trained
 * singers). Every field optional: the wizard phase is skippable and never
 * a gate. `analyzeScore` integration treats incompleteness per dimension —
 * missing range/tessitura yields permissive defaults and an honest
 * "broad analysis" note; a blank passaggio simply means no positional
 * passaggio flagging (ruled copy pattern).
 *
 * `Pitch` is the score-parser's canonical spelled pitch (imported at the
 * top of this file), so the picker, the store, and the overlay engine
 * share one representation with no conversion seam.
 */
export interface VoiceCharacteristics {
	/** Lowest comfortable note (typed; optionally sung-verified). */
	rangeLow?: Pitch;
	/** Highest comfortable note (typed; optionally sung-verified). */
	rangeHigh?: Pitch;
	/** Tessitura floor: "where you live, not your edges" (ruled copy). */
	tessituraLow?: Pitch;
	/** Tessitura ceiling. */
	tessituraHigh?: Pitch;
	/** The primary passaggio (break) note; blank = no passaggio flagging. */
	passaggioPrimary?: Pitch;
	/** Optional second break (some voices carry two distinct breaks). */
	passaggioSecondary?: Pitch;
	/** Provenance of the values as a set (Kimi's ruled vocabulary). */
	source: 'declared-template' | 'manual' | 'sung-verified';
}
