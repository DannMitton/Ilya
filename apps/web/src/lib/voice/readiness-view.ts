/**
 * WHAT THE TEST FRY SAYS (N.203 lane 60, Step 4; Dann 2026-11-16 00:31 to 00:35: "Ilya is accepting anything as that test input", "I was silent
 * during the green abr. SUffling of clothes and hands"). One pure function from a finished run to one of four outcomes, so the verdict is tested
 * without mounting the wizard (the tree has no DOM test environment).
 *
 * THE RULE: accept only when `fryHeard === true` AND `fryAccepted === true`. `fryAccepted` is the detector's own verdict, the same one the
 * vowel take gates on (`engine/live.ts`), so a fry this test accepts is a fry the vowels accept. It is not enough alone: the detector once
 * accepted a window of a silent room (`live.ts`, the presence veto's comment), so the room ratio must have heard something too. `fryHeard ===
 * null` (an unmeasurable ratio) is NOT acceptance here, though `assessReadiness` does not veto on it: a test that asks "did the microphone
 * hear you" cannot answer yes to "could not tell".
 *
 * THE FOUR OUTCOMES: (a) no microphone; (b) the driver's `readiness-timeout`, which is what silence gives; (c) a result that is not
 * heard-and-accepted; (d) accepted. Silence and a rustle are both "no fry": the singer's next step is the same.
 *
 * WHAT IS STORED: (c) keeps the room's values and records `fryRateHz: null` and `fryRange: 'not-measured'`, so a rustle's rate is never stored as
 * the voice's. (a) and (b) record that nothing was measured, as the built error path did.
 */
import type { CaptureError } from './engine/errors';
import type { ReadinessResult } from './engine/readiness';
import type { ReadinessRecord } from './profileStore';

export type FryView =
	| { kind: 'no-mic'; record: ReadinessRecord }
	| { kind: 'refused'; why: 'timeout' | 'not-heard'; record: ReadinessRecord }
	| { kind: 'accepted'; marginal: boolean; record: ReadinessRecord };

const MIC_CODES = ['MIC_NOT_FOUND', 'MIC_PERMISSION_DENIED', 'NO_AUDIO_INPUT'];

const NOT_MEASURED = (at: string): ReadinessRecord => ({ measuredAt: at, measured: false, roomSnrDb: null, roomLively: false, fryRateHz: null, fryRange: 'not-measured' });

/** Heard AND accepted. */
export const fryAccepted = (r: ReadinessResult): boolean => r.fryHeard === true && r.fryAccepted === true;

/** A finished run's view; `undefined` for a cancel (the singer leaving: nothing to say and nothing to record). */
export function fryView(run: { result?: ReadinessResult; error?: CaptureError }, at: string): FryView | undefined {
	const { result, error } = run;
	if (error) {
		if (error.code === 'CANCELLED') return undefined;
		if (MIC_CODES.includes(error.code)) return { kind: 'no-mic', record: NOT_MEASURED(at) };
		return { kind: 'refused', why: 'timeout', record: NOT_MEASURED(at) };
	}
	if (!result) return undefined;
	if (fryAccepted(result)) {
		return {
			kind: 'accepted',
			marginal: result.fryRange === 'marginal' || result.fryRange === 'out-of-range',
			record: { measuredAt: at, measured: true, roomSnrDb: result.room.snrDb, roomLively: result.room.lively, fryRateHz: result.fryRateHz, fryRange: result.fryRange }
		};
	}
	return {
		kind: 'refused',
		why: 'not-heard',
		record: { measuredAt: at, measured: true, roomSnrDb: result.room.snrDb, roomLively: result.room.lively, fryRateHz: null, fryRange: 'not-measured' }
	};
}
