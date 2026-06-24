import type { CalibratedFormant, Vowel, VoiceType } from './types';
import type { CaptureError } from './errors';
import { detect } from './detector';
import { guard } from './guard';
import { extractFormants } from './extract';

const SILENCE_RMS = 0.01, MIN_BUFFER_S = 0.5;

function f2Quality(f2: number | null, f1: number | null, prom: number, guardPassed: boolean): CalibratedFormant['f2Quality'] {
	if (f2 === null) return 'absent';
	const sep = f2 - (f1 ?? 0);
	if (prom >= 3 && sep >= 200 && guardPassed) return 'clear';
	if (prom >= 1.5 || sep >= 100) return 'marginal';
	return 'absent';
}

/** §9 batch core: samples + vowel -> CalibratedFormant. Pure; the [ɨ] pass is separate. */
export function analyze(y: Float64Array, sr: number, vowel: Vowel, _voiceType?: VoiceType): CalibratedFormant {
	const det = detect(y, sr);
	const g = guard(y, sr);
	const ex = extractFormants(y, sr, vowel);
	const confidence: CalibratedFormant['confidence'] =
		g.reading === 'Provisional' ? 'low' : (det.snrDb < 20 || !det.accept) ? 'low' : g.fullWindow ? 'high' : 'medium';
	const reading: CalibratedFormant['reading'] = confidence === 'low' ? 'provisional' : 'captured';
	const out: CalibratedFormant = {
		f1: ex.f1 ?? 0,
		confidence, reading, source: 'measured-user',
		f2Quality: f2Quality(ex.f2, ex.f1, ex.f2Prom, g.reading === 'Captured'),
	};
	if (ex.f2 !== null) out.f2 = ex.f2;
	return out;
}

export type CaptureOutcome =
	| { outcome: 'reading'; formant: CalibratedFormant }
	| { outcome: 'reprompt'; reason: 'not-fry'; failed: string[] }
	| { outcome: 'error'; error: CaptureError };

/** The capture pipeline: structural checks, the live gate, then the §9 core. */
export function runCapture(y: Float64Array, sr: number, vowel: Vowel, voiceType?: VoiceType): CaptureOutcome {
	const durMs = (y.length / sr) * 1000;
	if (durMs < MIN_BUFFER_S * 1000)
		return { outcome: 'error', error: { code: 'SAMPLE_TOO_SHORT', message: 'buffer too short', actualMs: durMs, minimumMs: MIN_BUFFER_S * 1000 } };
	let sum = 0; for (let i = 0; i < y.length; i++) sum += y[i] * y[i];
	if (Math.sqrt(sum / y.length) < SILENCE_RMS)
		return { outcome: 'error', error: { code: 'NO_AUDIO_INPUT', message: 'no audio input' } };
	const det = detect(y, sr);
	if (!det.accept) return { outcome: 'reprompt', reason: 'not-fry', failed: det.failed };
	const cf = analyze(y, sr, vowel, voiceType);
	if (!cf.f1) return { outcome: 'error', error: { code: 'EXTRACTION_FAILED', message: 'no formants recovered' } };
	return { outcome: 'reading', formant: cf };
}
