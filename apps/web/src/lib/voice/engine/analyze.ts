import type { CalibratedFormant, Vowel, VoiceType } from './types';
import type { CaptureError } from './errors';
import { detect } from './detector';
import { guard, type GuardResult } from './guard';
import { extractFormants, type ExtractTrace, type ExtractResult } from './extract';
import { extractOpen, COMB_MAX, PROM_DB } from './open-extract';

/**
 * Which picker reads the resonances (N.200 Step 3). `shipped` is the picker the app has used, which looks for the asked vowel's
 * expected peaks (`extract.ts`, `MITTON`). `open` takes no vowel (`open-extract.ts`). `?measure=open` selects it
 * (`chart/measure-switch.ts`); a reading taken under it carries `picker: 'open'`.
 */
export type Picker = 'shipped' | 'open';

function extractWith(picker: Picker, y: Float64Array, sr: number, vowel: Vowel, trace?: Partial<ExtractTrace>): ExtractResult {
	return picker === 'open' ? extractOpen(y, sr, trace) : extractFormants(y, sr, vowel, trace);
}

/**
 * Row 2d, 2026-09-30. What makes a take Provisional is now evidence that its reading
 * is poor, and nothing else. Dann's 19:36 walk read well on all nine vowels, and the
 * guard still stamped seven of them Provisional: `rate_cv` on nearly every take (real
 * fry's pulse rate wanders, and the detector already judges the rhythm), and `fr1_cv`
 * on [i], [ɑ], and [o] from `coarseFormants`, the per-frame estimator the closed-phase
 * reading replaced because it cannot read a closed vowel. On his files the guard's
 * coarse fR1 track scatters from 120 to 311 Hz on an [i] the reading puts at 273.
 *
 * So the question is asked of the reading itself: read fR1 from each half of the
 * stretch the extractor saw, with the same extractor, and require the halves to agree.
 * A vowel that moved, or a reading one half of the take cannot reproduce, splits the
 * halves. The guard still chooses the stretch (`segmentS`) and still decides `high`
 * (`fullWindow`); its verdict no longer makes a take Provisional on its own.
 *
 * JUDGEMENT: 8%, the same number the guard held its coarse fR1 track to
 * (`T_FR1_CV`, `guard.ts:4`), now applied to the reading. Dann's nine takes split
 * by 0.5% to 3.9%; a take whose vowel changes at mid-take splits by far more.
 */
const T_HALVES_F1 = 0.08;

/**
 * fR1 and fR2 read from each half of the analysed stretch, with the picker the reading used, and whether the halves agree.
 * `spread2` and `steady2` (N.200 Step 3, item 9) are the same for fR2; `steady2` is null when either half gave no fR2.
 */
export interface Steadiness {
	halvesF1: [number | null, number | null];
	/** |a - b| over their mean, three places; null when either half gave no fR1. */
	spread: number | null;
	steady: boolean;
	halvesF2: [number | null, number | null];
	spread2: number | null;
	steady2: boolean | null;
}

/** JUDGEMENT, illustrative: fR2 is read from a weaker peak than fR1, so its halves are held to a wider bar. */
const T_HALVES_F2 = 0.12;

export function f1Steadiness(y: Float64Array, sr: number, vowel: Vowel, picker: Picker = 'shipped'): Steadiness {
	const mid = y.length >> 1;
	const ra = extractWith(picker, y.subarray(0, mid), sr, vowel), rb = extractWith(picker, y.subarray(mid), sr, vowel);
	const a = ra.f1, b = rb.f1;
	const spread = a && b ? Math.abs(a - b) / ((a + b) / 2) : null;
	const a2 = ra.f2, b2 = rb.f2;
	const spread2 = a2 && b2 ? Math.abs(a2 - b2) / ((a2 + b2) / 2) : null;
	return {
		halvesF1: [a, b], spread: spread === null ? null : Math.round(spread * 1000) / 1000, steady: spread !== null && spread < T_HALVES_F1,
		halvesF2: [a2, b2], spread2: spread2 === null ? null : Math.round(spread2 * 1000) / 1000, steady2: spread2 === null ? null : spread2 < T_HALVES_F2
	};
}

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
 * fR2's quality under the open picker, from evidence alone: `clear` needs both estimators, a split-half steady fR2, a prominence of at
 * least `PROM_DB`, a gap of 200 Hz from fR1, and no unresolved neighbour above it (R2 and R3 merged is `marginal`; resolved is
 * `clear`, N.200 Step 3 item 6). Today no reader tells `clear` from `marginal` (`resolve-values.ts` excludes only `absent`).
 */
function openF2Quality(ex: ExtractResult, st: Steadiness): CalibratedFormant['f2Quality'] {
	if (ex.f2 === null) return 'absent';
	const sep = ex.f2 - (ex.f1 ?? 0), ev = ex.evidence;
	if (ev?.fR2 === 'both' && st.steady2 !== false && ex.f2Prom >= PROM_DB && sep >= 200 && !ev.f2Merged) return 'clear';
	return 'marginal';
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
export function analyze(y: Float64Array, sr: number, vowel: Vowel, _voiceType?: VoiceType, outerGuard?: GuardResult, trace?: Partial<ExtractTrace>, picker: Picker = 'shipped'): CalibratedFormant {
	return grade(y, sr, vowel, outerGuard, trace, picker).formant;
}

function grade(y: Float64Array, sr: number, vowel: Vowel, outerGuard?: GuardResult, trace?: Partial<ExtractTrace>, picker: Picker = 'shipped'): { formant: CalibratedFormant; steadiness: Steadiness } {
	const det = detect(y, sr);
	const g = outerGuard ?? guard(y, sr);
	const ex = extractWith(picker, y, sr, vowel, trace);
	const st = f1Steadiness(y, sr, vowel, picker);
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
	// The open picker's status comes from the measurement's own evidence, never from an expected value (N.200 Step 3): besides the
	// evidence above, both estimators must have seen fR1, the envelope must not show the source (comb), and no rival for "lowest" may
	// be as strong as the chosen peak.
	const ev = ex.evidence;
	const evidencePoor = picker === 'open' && !!ev && (ev.fR1 !== 'both' || ev.comb > COMB_MAX || ev.runnerUp);
	const confidence: CalibratedFormant['confidence'] =
		!st.steady || !det.accept || snrLow || evidencePoor ? 'low'
		: snrHigh && g.fullWindow ? 'high'
		: 'medium';
	const reading: CalibratedFormant['reading'] = confidence === 'low' ? 'provisional' : 'captured';
	const out: CalibratedFormant = {
		f1: ex.f1 ?? 0,
		confidence, reading, source: 'measured-user',
		f2Quality: picker === 'open' ? openF2Quality(ex, st) : f2Quality(ex.f2, ex.f1, ex.f2Prom, g.reading === 'Captured'),
		noiseFloor: det.snrDb === null ? 'unmeasured' : 'measured',
	};
	if (ex.f2 !== null) out.f2 = ex.f2;
	if (picker === 'open') out.picker = 'open';
	return { formant: out, steadiness: st };
}

export type CaptureOutcome =
	// `guard` is the stationarity verdict on the whole capture. It rides on the
	// outcome so `live.ts` can print it: which of the two routes to Provisional
	// fired was undiagnosable from the console before N.80.
	// `steadiness` is the split-half fR1 check that decides Provisional (row 2d).
	| { outcome: 'reading'; formant: CalibratedFormant; guard: GuardResult; steadiness: Steadiness }
	| { outcome: 'reprompt'; reason: 'not-fry'; failed: string[]; guard: GuardResult }
	| { outcome: 'error'; error: CaptureError; guard?: GuardResult };

/** The capture pipeline: structural checks, the live gate, then the §9 core. */
/** `trace`, when passed, is filled with what the extractor saw and chose (the dev-only capture file). */
export function runCapture(y: Float64Array, sr: number, vowel: Vowel, _voiceType?: VoiceType, trace?: Partial<ExtractTrace>, picker: Picker = 'shipped'): CaptureOutcome {
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
	const { formant: cf, steadiness } = grade(yw, sr, vowel, g, trace, picker);
	if (!cf.f1) return { outcome: 'error', error: { code: 'EXTRACTION_FAILED', message: 'no formants recovered' }, guard: g };
	return { outcome: 'reading', formant: cf, guard: g, steadiness };
}
