/**
 * The capture hold's kind and its spoken announcement, lifted from
 * `CalibrationWizard.svelte` unchanged on 2026-09-30 to make room under its
 * line ceiling for "Keep my reading". The wizard still owns the hold's timing,
 * its banner, and its buttons.
 */
import type { CalibratedFormant } from './engine/types';

export type HoldKind = 'good' | 'provisional' | 'rolled-back';

/**
 * No question during capture (Dann, 2026-09-30 12:43; brief
 * `brief-code-calibration-first-moments_r1_2026-09-30.md`): a take judged
 * `implausible` holds and advances as its confidence alone earns, the same as
 * a good take. The guard's demotion to Provisional is not shown here; the
 * summary's one note carries the verdict (`outside.ts`). The implausible hold,
 * its wait, and its Keep button are gone.
 */
export function holdKindFor(effective: CalibratedFormant): HoldKind {
	if (effective.plausibility === 'implausible' && !effective.plausibilityOverride)
		return effective.confidence === 'low' ? 'provisional' : 'good';
	return effective.reading === 'captured' ? 'good' : 'provisional';
}

/**
 * The hold's text for the persistent hidden live region (Kimi's review,
 * 2026-07-11). `spoken` is the vowel's speakable name, never the raw glyph.
 */
export function holdAnnouncement(kind: HoldKind, spoken: string, T: (key: string) => string): string {
	switch (kind) {
		case 'good':
			return `${spoken}${T('calib.capture.hold.captured')}`;
		case 'rolled-back':
			return T('calib.capture.hold.rolledBack');
		default:
			return T('calib.capture.hold.noted');
	}
}
