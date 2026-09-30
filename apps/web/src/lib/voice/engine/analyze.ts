import type { CalibratedFormant, Vowel, VoiceType } from './types';
import type { CaptureError } from './errors';
import { detect } from './detector';
import { guard, type GuardResult } from './guard';
import { extractFormants, type ExtractTrace } from './extract';

// SILENCE_RMS recalibrated 2026-07-01 on Dann's ACCEPT, from live iMac console
// evidence: a genuine fry capture at 30 cm with processing off measured RMS 0.008,
// under the old 0.01 floor, so a gate-passing capture would still have bounced as
// "no audio input." Spec amendment pending.
//
// 2026-09-30, the same defect again, on [i]: Dann's [a] read and his [i], sung
// into the same microphone, came back "No sound came through". A closed vowel's
// fry radiates less than an open one's, so [i] is the take most likely to sit
// under a fixed level floor, and the live gate had already accepted it. A level
// floor cannot tell a quiet voice from an empty room; the detector can, and it
// is level-free: eight regular pulses, a decay under 0.4, flatness under 0.3,
// and 12 dB of in-band SNR (`detector.ts`). So this check now catches only a
// dead input, a buffer at about -100 dBFS (RMS 1e-5), such as a muted
// interface delivering zeros, and everything else goes to `detect()`, which
// re-prompts an empty room as not-fry. The desk's call on Dann's "fix this".
const SILENCE_RMS = 1e-5, MIN_BUFFER_S = 0.5;

function f2Quality(f2: number | null, f1: number | null, prom: number, guardPassed: boolean): CalibratedFormant['f2Quality'] {
	if (f2 === null) return 'absent';
	const sep = f2 - (f1 ?? 0);
	if (prom >= 3 && sep >= 200 && guardPassed) return 'clear';
	if (prom >= 1.5 || sep >= 100) return 'marginal';
	return 'absent';
}

/**
 * §9 batch core: samples + vowel -> CalibratedFormant. Pure; the [ɨ] pass is separate.
 *
 * N.80: `outerGuard` carries the verdict the caller already computed on the WHOLE
 * capture, when `y` is only the best steady stretch of it. It exists for one field,
 * `fullWindow`. Re-running the guard on a 1.5 s slice would report `fullWindow: true`
 * for that slice and promote a sub-window take to `high`, which is a claim about
 * steadiness the singer never made. Absent the parameter the guard runs on `y` as
 * it always has, so every existing caller is unchanged.
 */
export function analyze(y: Float64Array, sr: number, vowel: Vowel, _voiceType?: VoiceType, outerGuard?: GuardResult, trace?: Partial<ExtractTrace>): CalibratedFormant {
	const det = detect(y, sr);
	const g = outerGuard ?? guard(y, sr);
	const ex = extractFormants(y, sr, vowel, trace);
	// Confidence tiers recalibrated 2026-07-01 on Dann's ACCEPT: the old flat
	// (snrDb < 20 -> low) rule stamped every real-room capture Provisional even
	// when the gate passed it. Graded on the same evidence as the c8 recalibration:
	// low under 12 dB, medium 12-18 dB, high above 18 dB. Spec amendment pending.
	// Item 1.4b: an unmeasurable SNR is neither low nor high. It cannot drag the
	// reading down to Provisional, because nothing was heard that was poor; and
	// it cannot clear the 18 dB bar for 'high', because nothing was heard that
	// was good. It lands in the honest middle, and the fact that the floor went
	// unmeasured travels on `noiseFloor` instead of being smuggled into a
	// quality grade.
	const snrLow = det.snrDb !== null && det.snrDb < 12;
	const snrHigh = det.snrDb !== null && det.snrDb > 18;
	const confidence: CalibratedFormant['confidence'] =
		g.reading === 'Provisional' || !det.accept || snrLow ? 'low'
		: snrHigh && g.fullWindow ? 'high'
		: 'medium';
	const reading: CalibratedFormant['reading'] = confidence === 'low' ? 'provisional' : 'captured';
	const out: CalibratedFormant = {
		f1: ex.f1 ?? 0,
		confidence, reading, source: 'measured-user',
		f2Quality: f2Quality(ex.f2, ex.f1, ex.f2Prom, g.reading === 'Captured'),
		noiseFloor: det.snrDb === null ? 'unmeasured' : 'measured',
	};
	if (ex.f2 !== null) out.f2 = ex.f2;
	return out;
}

export type CaptureOutcome =
	// `guard` is the stationarity verdict on the whole capture. It rides on the
	// outcome so `live.ts` can print it: which of the two routes to Provisional
	// fired was undiagnosable from the console before N.80.
	| { outcome: 'reading'; formant: CalibratedFormant; guard: GuardResult }
	| { outcome: 'reprompt'; reason: 'not-fry'; failed: string[]; guard: GuardResult }
	| { outcome: 'error'; error: CaptureError; guard?: GuardResult };

/** The capture pipeline: structural checks, the live gate, then the §9 core. */
/** `trace`, when passed, is filled with what the extractor saw and chose (the dev-only capture file). */
export function runCapture(y: Float64Array, sr: number, vowel: Vowel, voiceType?: VoiceType, trace?: Partial<ExtractTrace>): CaptureOutcome {
	const durMs = (y.length / sr) * 1000;
	if (durMs < MIN_BUFFER_S * 1000)
		return { outcome: 'error', error: { code: 'SAMPLE_TOO_SHORT', message: 'buffer too short', actualMs: durMs, minimumMs: MIN_BUFFER_S * 1000 } };
	let sum = 0; for (let i = 0; i < y.length; i++) sum += y[i] * y[i];
	if (Math.sqrt(sum / y.length) < SILENCE_RMS)
		return { outcome: 'error', error: { code: 'NO_AUDIO_INPUT', message: 'no audio input' } };
	// N.80. The live gate asks for one regular second; this pipeline used to ask
	// for a regular 3.5 s. A rounded [u] fry that holds for 1.5 s failed the
	// whole-buffer c5_cv and never reached the extractor. The guard already finds
	// the longest passing stretch of at least MIN_STABLE_S; nothing used it. Now
	// the detector and the extractor are shown that stretch instead of the whole
	// buffer. When the whole buffer passes, `segmentS` is the whole buffer and
	// this is the pipeline exactly as it was. When nothing passes, `segmentS` is
	// null and this is also the pipeline exactly as it was.
	const g = guard(y, sr);
	const yw = g.segmentS ? y.subarray(Math.round(g.segmentS[0] * sr), Math.round(g.segmentS[1] * sr)) : y;
	const det = detect(yw, sr);
	if (!det.accept) return { outcome: 'reprompt', reason: 'not-fry', failed: det.failed, guard: g };
	const cf = analyze(yw, sr, vowel, voiceType, g, trace);
	if (!cf.f1) return { outcome: 'error', error: { code: 'EXTRACTION_FAILED', message: 'no formants recovered' }, guard: g };
	return { outcome: 'reading', formant: cf, guard: g };
}
