/**
 * Shane engine schema.
 *
 * Source of record: shane-extraction-engine-spec_v1_2026-06-09.md §1. These
 * types are shared by the calibration UI now and the analytical engine later,
 * so they live at the engine boundary rather than inside the pacifier.
 */

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
