/**
 * WHAT ILYA KEEPS OF EACH TAKE (N.199 Step 5; `?calibrate=new` only). Per voice, for every take on the new capture screen: when, how
 * it ended, the engine's raw reading with its `confidence` and `f2Quality` (absent on a failed take, which has no numbers), the declared
 * voice type at the time, and what the singer could see (`hidden | zone`; Phase 2 adds `live`). It answers a question the desk has:
 * does showing a zone change what a singer sings (brief section 4, item 6). It is a measurement, never shown to the singer, and never
 * a judgement of a take.
 *
 * Written the way `recordReadiness` writes (`CalibrationWizard.svelte`), never through `persist()`, which moves the calibration date.
 * Fifty takes a vowel, the oldest dropped. Start over clears it. A full store drops it before it refuses the profile (`saveStore`).
 * Duplicating a voice copies formants only, so a copy keeps none of it.
 */
import type { CaptureError } from './engine/errors';
import type { CalibratedFormant, Vowel } from './engine/types';

export const MAX_TAKES_PER_VOWEL = 50;

export type TakeOutcome = 'captured' | 'provisional' | 'rolled-back' | 'failed' | 'cancelled';
export type TakeVisibility = 'hidden' | 'zone';

export interface TakeRecord {
	/** ISO 8601, when the take ended. */
	at: string;
	vowel: Vowel;
	outcome: TakeOutcome;
	/** The session's error code, for a failed take. */
	errorCode?: string;
	/** The engine's reading as it came, before the guard: absent on a failed or cancelled take. */
	raw?: { f1: number; f2?: number; confidence: CalibratedFormant['confidence']; f2Quality?: CalibratedFormant['f2Quality'] };
	/** The declared voice type at the time; null when none. */
	voiceType: string | null;
	visible: TakeVisibility;
}

const rawOf = (f: CalibratedFormant): NonNullable<TakeRecord['raw']> => ({
	f1: f.f1,
	...(typeof f.f2 === 'number' ? { f2: f.f2 } : {}),
	confidence: f.confidence,
	...(f.f2Quality ? { f2Quality: f.f2Quality } : {})
});

interface Context {
	vowel: Vowel;
	voiceType?: string;
	visible: TakeVisibility;
	now?: Date;
}

/** The record for a take that ended with a reading: Captured, or Provisional by the engine's own reading. */
export function readingTake(c: Context, formant: CalibratedFormant, rolledBack = false): TakeRecord {
	return {
		at: (c.now ?? new Date()).toISOString(),
		vowel: c.vowel,
		outcome: rolledBack ? 'rolled-back' : formant.reading === 'provisional' ? 'provisional' : 'captured',
		raw: rawOf(formant),
		voiceType: c.voiceType ?? null,
		visible: c.visible
	};
}

/** The record for a take that ended without one: a cancel, or a failure with the session's code. */
export function failedTake(c: Context, error: CaptureError): TakeRecord {
	return {
		at: (c.now ?? new Date()).toISOString(),
		vowel: c.vowel,
		outcome: error.code === 'CANCELLED' ? 'cancelled' : 'failed',
		...(error.code === 'CANCELLED' ? {} : { errorCode: error.code }),
		voiceType: c.voiceType ?? null,
		visible: c.visible
	};
}

/** The takes with `rec` added and no vowel over `MAX_TAKES_PER_VOWEL`: the oldest of that vowel dropped. A new array. */
export function appendTake(takes: readonly TakeRecord[] | undefined, rec: TakeRecord, max = MAX_TAKES_PER_VOWEL): TakeRecord[] {
	const out = [...(takes ?? []), rec];
	let over = out.filter((t) => t.vowel === rec.vowel).length - max;
	return over <= 0 ? out : out.filter((t) => !(t.vowel === rec.vowel && over-- > 0));
}

/** Adds a take to a voice's record (in place, as `recordReadiness` writes). */
export function addTake(voice: { takes?: TakeRecord[] }, rec: TakeRecord): void {
	voice.takes = appendTake(voice.takes, rec);
}
