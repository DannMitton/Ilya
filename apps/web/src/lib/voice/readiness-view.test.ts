/**
 * The test fry's verdict (N.203 lane 60, Step 4), on fixtures at the level of `assessReadiness`: one-second windows at 48 kHz, every one deterministic
 * (a fixed-seed generator, never Math.random). Silence, white-noise bursts, bursts low-passed at 300 Hz, clicks at 40 Hz low-passed at 800 Hz (the
 * hardest case: refused by flatness alone), and the repository's own `synthFry`. EVERY FIXTURE IS SYNTHETIC: whether a recorded rustle of clothes is refused
 * is NOT ESTABLISHED by this file (Dann rustles on purpose on his iPhone, the brief's section 7).
 */
import { describe, expect, it } from 'vitest';
import { assessReadiness } from './engine/readiness';
import { SYNTH_SR, synthFry, rng } from './engine/fry-synth';
import { fryView } from './readiness-view';

const SR = SYNTH_SR;
const room = (n: number, amp: number, seed: number) => { const r = rng(seed); const x = new Float64Array(n); for (let i = 0; i < n; i++) x[i] = (r() * 2 - 1) * amp; return x; };
const lowpass = (x: Float64Array, hz: number) => { const a = Math.exp(-2 * Math.PI * hz / SR); const y = new Float64Array(x.length); let p = 0; for (let i = 0; i < x.length; i++) { p = (1 - a) * x[i] + a * p; y[i] = p; } return y; };
const rescale = (x: Float64Array, peak: number) => { let m = 0; for (const v of x) m = Math.max(m, Math.abs(v)); const g = peak / (m || 1); return x.map((v) => v * g); };
const QUIET = room(SR, 0.003, 11);

/** White noise in bursts: 80 ms on, 120 ms off. */
const bursts = (seed: number) => { const x = new Float64Array(SR); const r = rng(seed); for (let i = 0; i < SR; i++) if (i % 9600 < 3840) x[i] = (r() * 2 - 1) * 0.3; return x; };
/** Clicks at 40 Hz, low-passed at 800 Hz: periodic, so the pulse count is right and only the spectrum is wrong. */
const clicks = () => { const x = new Float64Array(SR); for (let i = 0; i < SR; i += SR / 40) x[Math.round(i)] = 1; return rescale(lowpass(x, 800), 0.3); };
const FRY = synthFry({ formants: [270, 700, 2300, 3000, 3700], bandwidths: [60, 90, 120, 150, 200], rate: 45, jitter: 0.03, durationS: 1.5, seed: 7 }).subarray(0, SR);

const cases: [string, Float64Array, boolean][] = [
	['silence', room(SR, 0.003, 12), false],
	['white-noise bursts', bursts(21), false],
	['bursts low-passed at 300 Hz', rescale(lowpass(bursts(22), 300), 0.3), false],
	['clicks at 40 Hz low-passed at 800 Hz', clicks(), false],
	['synthetic fry (`synthFry`)', FRY, true]
];

describe('the test fry accepts only what is heard AND accepted', () => {
	for (const [name, fry, accepted] of cases) {
		it(`${name}: ${accepted ? 'accepted' : 'refused'}`, () => {
			const r = assessReadiness(QUIET, fry, SR);
			const v = fryView({ result: r }, '2026-11-16T00:00:00.000Z');
			expect(v?.kind, `${name}: heard ${r.fryHeard}, accepted ${r.fryAccepted}, failed [${r.fryFailed.join(', ')}]`).toBe(accepted ? 'accepted' : 'refused');
		});
	}
	it('every refused fixture names at least one failed condition, or was not heard', () => {
		for (const [name, fry, accepted] of cases) {
			if (accepted) continue;
			const r = assessReadiness(QUIET, fry, SR);
			expect(r.fryFailed.length > 0 || r.fryHeard === false, name).toBe(true);
		}
	});
});

describe('the four outcomes', () => {
	const at = '2026-11-16T00:00:00.000Z';
	const result = (over: object) => ({ room: { noiseFloor: 1, signal: 10, snrDb: 10, lively: false }, fryHeard: true, fryRateHz: 48, fryRange: 'clear', fryAccepted: true, fryFailed: [], fryUndecided: [], ...over }) as never;
	it('(a) no microphone, by each of the three codes', () => {
		for (const code of ['MIC_NOT_FOUND', 'MIC_PERMISSION_DENIED', 'NO_AUDIO_INPUT'] as const) expect(fryView({ error: { code, message: '' } }, at)?.kind).toBe('no-mic');
	});
	it('(b) the driver’s timeout, which is what silence gives, is a refusal that records nothing measured', () => {
		const v = fryView({ error: { code: 'EXTRACTION_FAILED', message: '', cause: { reason: 'readiness-timeout', failed: [] } } }, at)!;
		expect([v.kind, v.record.measured]).toEqual(['refused', false]);
	});
	it('a cancel says nothing and records nothing', () => {
		expect(fryView({ error: { code: 'CANCELLED', message: '' } }, at)).toBeUndefined();
	});
	it('(c) a result heard but not accepted, or accepted but not heard, or unmeasurable, is refused; the room is kept and the rate is not', () => {
		for (const over of [{ fryAccepted: false }, { fryHeard: false }, { fryHeard: null }]) {
			const v = fryView({ result: result(over) }, at)!;
			expect(v.kind).toBe('refused');
			expect(v.record).toMatchObject({ measured: true, roomSnrDb: 10, fryRateHz: null, fryRange: 'not-measured' });
		}
	});
	it('(d) accepted keeps the rate, and is marginal when the range says so', () => {
		const ok = fryView({ result: result({}) }, at)!;
		expect(ok).toMatchObject({ kind: 'accepted', marginal: false, record: { fryRateHz: 48, fryRange: 'clear' } });
		expect(fryView({ result: result({ fryRange: 'marginal', fryRateHz: 22 }) }, at)).toMatchObject({ kind: 'accepted', marginal: true });
		expect(fryView({ result: result({ fryRange: 'out-of-range', fryRateHz: 15 }) }, at)).toMatchObject({ kind: 'accepted', marginal: true });
	});
});
