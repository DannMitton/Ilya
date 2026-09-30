/**
 * The capture hold's kind and its spoken announcement, lifted from
 * `CalibrationWizard.svelte` unchanged on 2026-09-30 to make room under its
 * line ceiling for "Keep my reading". The wizard still owns the hold's timing,
 * its banner, and its buttons.
 */
import type { CalibratedFormant } from './engine/types';

export type HoldKind = 'good' | 'provisional' | 'rolled-back' | 'implausible';

/**
 * The implausible hold outranks the ordinary provisional wording: same
 * Provisional resolution, but the copy names the mismatch (signed-off
 * re-prompt line, 2026-07-11) instead of the generic uncertainty wording.
 * Never a block: Continue stands.
 */
export function holdKindFor(effective: CalibratedFormant): HoldKind {
	if (effective.plausibility === 'implausible') return 'implausible';
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
		case 'implausible':
			return `${T('calib.capture.hold.implausiblePrefix')} ${spoken}. ${T('calib.capture.hold.tryAgain')}`;
		default:
			return T('calib.capture.hold.noted');
	}
}
