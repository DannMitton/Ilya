/**
 * Fidelity tests for the readiness gate (item 1.4a).
 *
 * The rule these obey, from `claude/e22-the-sequence-to-done_2026-08-03.md` §5:
 * "published figures for the fry range only, since that is a property of
 * voices; noise floor and SNR by synthetic injection, a known signal plus known
 * noise." And Dann's standing condition: no acceptance test may take its
 * expected value from the mechanism under test.
 *
 * So every expected value below comes from exactly one of three places:
 *   1. Arithmetic. Scaling a buffer by g multiplies its power by g², so the
 *      band ratio must read 10·log10(g²) = 20·log10(g) dB. The mechanism is
 *      never consulted for that number.
 *   2. The construction parameter. A pulse train built at exactly 40 Hz must
 *      read back at 40 Hz; the rate is an input, not an output.
 *   3. The published range. 20-80 Hz with marginal bands below 25 and above 75,
 *      from `shane-calibration-wizard-spec_v1_2026-06-30.md` §2 Phase 1 and §4,
 *      which is a property of voices rather than of this code.
 *
 * Every fixture is deterministic: a fixed-seed xorshift, never Math.random, so
 * a failure is reproducible and a fixture is read rather than reconstructed.
 *
 * Mutation controls run against this file while it was written, recorded so a
 * later reader can re-run them:
 *   - Mutant A, `measureRoom` returns 20·log10 of the power ratio instead of
 *     10·log10 (the classic amplitude-versus-power slip).
 *   - Mutant B, `bandPower` returns 0 instead of null on a short buffer (the
 *     `detector.ts:24` shape, inventing a stand-in instead of abstaining).
 * The counts each produced are in the episode record.
 */

import { describe, it, expect } from 'vitest';
import {
	assessReadiness,
	bandPower,
	classifyFryRate,
	measureRoom,
	PSD_NPERSEG,
	ROOM_SNR_TOAST_DB
} from './readiness';

const SR = 48000;

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

/**
 * A synthetic vocal-fry pulse train: one exponentially decaying 600 Hz burst
 * per glottal pulse, at exactly `rateHz`. Not a claim about how a real fry
 * looks; it is a signal with a known inter-pulse rate, which is the only
 * property under test.
 */
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

function scaled(y: Float64Array, g: number): Float64Array {
	const out = new Float64Array(y.length);
	for (let i = 0; i < y.length; i++) out[i] = y[i] * g;
	return out;
}

function add(a: Float64Array, b: Float64Array): Float64Array {
	const out = new Float64Array(a.length);
	for (let i = 0; i < a.length; i++) out[i] = a[i] + b[i];
	return out;
}

describe('bandPower abstains rather than inventing', () => {
	it('returns null for a buffer shorter than one Welch segment', () => {
		// welchPSD averages zero segments here and returns an all-zero spectrum,
		// which would read as perfect silence. Abstaining is the honest answer.
		expect(bandPower(noise(PSD_NPERSEG - 1, 0.01), SR)).toBeNull();
	});

	it('returns null when the band contains no bins at this sample rate', () => {
		// Bin spacing at 48 kHz with a 2048-point segment is 23.4 Hz, so a
		// 1-2 Hz band holds nothing at all.
		expect(bandPower(noise(SR, 0.01), SR, 1, 2)).toBeNull();
	});

	it('returns a positive power for a buffer with energy in band', () => {
		const p = bandPower(noise(SR, 0.01), SR);
		expect(p).not.toBeNull();
		expect(p as number).toBeGreaterThan(0);
	});
});

describe('measureRoom: the SNR ratio, by known gain', () => {
	const quiet = noise(SR, 0.001);

	// The expected values here are arithmetic, not measurements: multiplying a
	// buffer by g multiplies its power by g², so the band ratio is exactly
	// 20·log10(g) dB whatever the buffer's contents.
	it.each([
		[1, 0],
		[2, 20 * Math.log10(2)],
		[10, 20],
		[100, 40]
	])('a gain of %s reads %s dB', (g, expectedDb) => {
		const room = measureRoom(quiet, scaled(quiet, g), SR);
		expect(room.snrDb).not.toBeNull();
		expect(room.snrDb as number).toBeCloseTo(expectedDb, 9);
	});

	it('identical buffers read exactly 0 dB', () => {
		expect(measureRoom(quiet, quiet, SR).snrDb).toBeCloseTo(0, 12);
	});

	it('a room ten times louder costs exactly 20 dB', () => {
		const signal = scaled(quiet, 30);
		const a = measureRoom(quiet, signal, SR).snrDb as number;
		const b = measureRoom(scaled(quiet, 10), signal, SR).snrDb as number;
		expect(a - b).toBeCloseTo(20, 9);
	});
});

describe('measureRoom: the toast flag never claims what was not measured', () => {
	const quiet = noise(SR, 0.001);

	it('is lively below the threshold', () => {
		// Gain chosen so the ratio lands 1 dB under the placeholder threshold.
		const room = measureRoom(quiet, scaled(quiet, Math.pow(10, (ROOM_SNR_TOAST_DB - 1) / 20)), SR);
		expect(room.snrDb as number).toBeCloseTo(ROOM_SNR_TOAST_DB - 1, 9);
		expect(room.lively).toBe(true);
	});

	it('is not lively above the threshold', () => {
		const room = measureRoom(quiet, scaled(quiet, Math.pow(10, (ROOM_SNR_TOAST_DB + 1) / 20)), SR);
		expect(room.lively).toBe(false);
	});

	it('abstains, and is not lively, when the quiet second is unmeasurable', () => {
		// The negative control that matters: an absent measurement must not
		// produce a toast about the singer's room.
		const room = measureRoom(noise(PSD_NPERSEG - 1, 0.001), noise(SR, 0.5), SR);
		expect(room.noiseFloor).toBeNull();
		expect(room.snrDb).toBeNull();
		expect(room.lively).toBe(false);
	});
});

describe('classifyFryRate against the published range', () => {
	// 20-80 Hz, marginal below ~25 and above ~75: wizard spec §2 Phase 1, §4.
	it.each([
		[15, 'out-of-range'],
		[19.9, 'out-of-range'],
		[20, 'marginal'],
		[22, 'marginal'],
		[24.9, 'marginal'],
		[25, 'clear'],
		[50, 'clear'],
		[75, 'clear'],
		[75.1, 'marginal'],
		[80, 'marginal'],
		[80.1, 'out-of-range'],
		[120, 'out-of-range']
	])('%s Hz reads %s', (rate, verdict) => {
		expect(classifyFryRate(rate as number)).toBe(verdict);
	});

	it('abstains when no rate was recovered', () => {
		expect(classifyFryRate(null)).toBe('not-measured');
		expect(classifyFryRate(NaN)).toBe('not-measured');
	});
});

describe('assessReadiness end to end, on synthetic audio', () => {
	const quiet = noise(SR, 0.0005);

	// The expected rate is the construction parameter, not a reading. The
	// tolerance covers the envelope peak-picker's sample-level placement only.
	it.each([
		[40, 'clear'],
		[22, 'marginal'],
		[15, 'out-of-range']
	])('recovers a %s Hz pulse train and calls it %s', (rate, verdict) => {
		const fry = add(fryPulses(SR, SR, rate as number, 0.2), noise(SR, 0.0005));
		const result = assessReadiness(quiet, fry, SR);
		expect(result.fryRateHz).not.toBeNull();
		expect(result.fryRateHz as number).toBeCloseTo(rate as number, 0);
		expect(result.fryRange).toBe(verdict);
	});

	it('known signal plus known noise: the SNR rises with the signal and 10x approaches 20 dB', () => {
		// The ceiling is arithmetic: with the noise held fixed, multiplying the
		// pulse amplitude by ten can raise the band ratio by at most 20 dB, and
		// the residual noise can only hold it below that. So the step must land
		// in (0, 20], and well inside it once the pulse dominates.
		const n = noise(SR, 0.0005, 987654321);
		const quiet0 = noise(SR, 0.0005, 987654321);
		const soft = assessReadiness(quiet0, add(fryPulses(SR, SR, 40, 0.02), n), SR).room.snrDb as number;
		const loud = assessReadiness(quiet0, add(fryPulses(SR, SR, 40, 0.2), n), SR).room.snrDb as number;
		const louder = assessReadiness(quiet0, add(fryPulses(SR, SR, 40, 2), n), SR).room.snrDb as number;
		expect(soft).toBeGreaterThan(0);
		expect(loud).toBeGreaterThan(soft);
		expect(louder).toBeGreaterThan(loud);
		expect(louder - loud).toBeGreaterThan(15);
		expect(louder - loud).toBeLessThanOrEqual(20.0000001);
	});

	it('carries the detector conditions without acting on them', () => {
		// The readiness gate flags and does not block, so an out-of-band fry
		// still yields a range verdict rather than an absence.
		const result = assessReadiness(quiet, add(fryPulses(SR, SR, 15, 0.2), noise(SR, 0.0005)), SR);
		expect(result.fryRange).toBe('out-of-range');
		expect(Array.isArray(result.fryFailed)).toBe(true);
	});
});
