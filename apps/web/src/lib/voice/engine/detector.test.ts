/**
 * Fidelity tests for the Pulse-Register Detector's abstention (item 1.4b).
 *
 * These are the FIRST tests `detector.ts` has ever had. They are scoped to the
 * 1.4b change and make no attempt to pin the eight conditions themselves, whose
 * thresholds were recalibrated on live-room evidence (2026-07-01) and belong to
 * a separate item.
 *
 * The rule they obey, from `claude/e22-the-sequence-to-done_2026-08-03.md` §3,
 * Fable's resize of this item: "a fixture at a sample rate low enough to
 * collapse the noise band". And Dann's standing condition: no acceptance test
 * may take its expected value from the mechanism under test.
 *
 * So the collapse point is derived, not observed. `detector.ts` forms its noise
 * band as [5000, hiNoise] with hiNoise = min(sr/2 - 200, 10000). The band is
 * empty exactly when hiNoise < 5000, which is exactly when sr < 10400. That is
 * arithmetic done here, on paper, and the fixtures below sit either side of it:
 * 8000 and 10000 Hz collapse, 11025 Hz and up do not. The knife edge at 10400
 * itself is deliberately NOT asserted, because whether a bin lands exactly on
 * 5000 Hz depends on the FFT's bin spacing at that rate, and pinning a
 * floating-point coincidence would be a test of nothing.
 *
 * Mutation controls run against this file while it was written:
 *   - Mutant A, restore `if (!noise.length) return 60;`, the shipped defect.
 *   - Mutant B, `const c8 = snr === null ? false : snr >= 12`, treating an
 *     undecidable condition as a failed one.
 * The counts each produced are in the episode record.
 */

import { describe, it, expect } from 'vitest';
import { detect } from './detector';
import { analyze } from './analyze';

/** Deterministic uniform noise. xorshift32, fixed seed, so fixtures never drift. */
function noise(n: number, amp: number, seed = 0x5ade1a7): Float64Array {
	let s = (seed || 1) >>> 0;
	const out = new Float64Array(n);
	for (let i = 0; i < n; i++) {
		s ^= s << 13;
		s >>>= 0;
		s ^= s >>> 17;
		s ^= s << 5;
		s >>>= 0;
		out[i] = ((s / 0xffffffff) * 2 - 1) * amp;
	}
	return out;
}

/** A pulse train at exactly `rateHz`. The carrier sits under 4 kHz so the
 *  fixture is identical in kind at every sample rate tested, including 8 kHz. */
function fryPulses(n: number, sr: number, rateHz: number, amp: number): Float64Array {
	const out = new Float64Array(n);
	const period = sr / rateHz;
	const tau = 0.004;
	const carrier = 600;
	const burst = Math.floor(0.02 * sr);
	for (let k = 0; Math.round(k * period) < n; k++) {
		const start = Math.round(k * period);
		for (let i = 0; i < burst && start + i < n; i++) {
			const t = i / sr;
			out[start + i] += amp * Math.exp(-t / tau) * Math.sin(2 * Math.PI * carrier * t);
		}
	}
	return out;
}

/** One second of clean synthetic fry at `sr`. */
function sample(sr: number, rateHz = 40): Float64Array {
	const pulses = fryPulses(sr, sr, rateHz, 0.2);
	const bed = noise(sr, 0.0005);
	const out = new Float64Array(sr);
	for (let i = 0; i < sr; i++) out[i] = pulses[i] + bed[i];
	return out;
}

/** Sample rates below the derived 10400 Hz collapse point. */
const COLLAPSED = [8000, 10000];
/** Sample rates above it, including both rates the engine's FFT assumes. */
const MEASURABLE = [11025, 16000, 44100, 48000];

describe('the noise band collapses where the arithmetic says it does', () => {
	it.each(COLLAPSED)('abstains at %s Hz, below the 10400 Hz collapse point', (sr) => {
		expect(detect(sample(sr), sr).snrDb).toBeNull();
	});

	it.each(MEASURABLE)('measures at %s Hz, above it', (sr) => {
		const snr = detect(sample(sr), sr).snrDb;
		expect(snr).not.toBeNull();
		expect(Number.isFinite(snr as number)).toBe(true);
	});

	it('never reports the 60 dB that used to stand in for the missing band', () => {
		// The regression pin for the exact defect. Before item 1.4b this read 60
		// at every collapsed rate, and 60 clears c8's 12 dB threshold, so the
		// condition passed on a number nobody measured.
		for (const sr of COLLAPSED) expect(detect(sample(sr), sr).snrDb).not.toBe(60);
	});
});

describe('an undecidable condition is disclosed, never assumed', () => {
	it.each(COLLAPSED)('names c8_snr as undecided at %s Hz', (sr) => {
		const det = detect(sample(sr), sr);
		expect(det.undecided).toContain('c8_snr');
	});

	it.each(COLLAPSED)('does not report c8_snr as a failure at %s Hz', (sr) => {
		// The distinction the whole item exists for: a condition we could not
		// evaluate must never reach a singer as a fault in their voice.
		expect(detect(sample(sr), sr).failed).not.toContain('c8_snr');
	});

	it.each(COLLAPSED)('does not block the capture at %s Hz', (sr) => {
		// Refusing every capture forever on a device whose sample rate collapses
		// the band is not a product. Disclosure is the fix, not refusal.
		expect(detect(sample(sr), sr).accept).toBe(true);
	});

	it.each(MEASURABLE)('leaves undecided empty at %s Hz', (sr) => {
		expect(detect(sample(sr), sr).undecided).toEqual([]);
	});

	it('keeps failed and undecided disjoint at every rate tested', () => {
		for (const sr of [...COLLAPSED, ...MEASURABLE]) {
			const det = detect(sample(sr), sr);
			const overlap = det.failed.filter((f) => det.undecided.includes(f));
			expect(overlap).toEqual([]);
		}
	});
});

describe('a condition that was evaluated and failed is still a failure', () => {
	it('refuses a 15 Hz train, which is outside the 20-80 Hz band, and says why', () => {
		// The negative control. If abstention had swallowed real failures too,
		// this would come back accepted.
		const det = detect(sample(48000, 15), 48000);
		expect(det.accept).toBe(false);
		expect(det.failed).toContain('c3_ipi');
		expect(det.undecided).toEqual([]);
	});
});

describe('the abstention reaches the reading a singer keeps', () => {
	// Deliberately NOT asserted here: the confidence tier. On this fixture the
	// stationarity guard resolves to Provisional on its own, so a confidence
	// assertion would be reading an interaction the fixture does not control,
	// which is the failure mode the no-expected-value-from-the-mechanism rule
	// exists to stop. What is asserted is the propagation, which is the change.
	it('marks the noise floor unmeasured when the band collapsed', () => {
		const sr = 8000;
		expect(analyze(sample(sr), sr, 'a').noiseFloor).toBe('unmeasured');
	});

	it('marks it measured when the band was formed', () => {
		const sr = 48000;
		expect(analyze(sample(sr), sr, 'a').noiseFloor).toBe('measured');
	});
});
