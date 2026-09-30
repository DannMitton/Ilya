/**
 * The [i] extractor on synthetic fry with known resonances
 * (`docs/sessions/brief-code-i-extractor_r1_2026-09-30.md`, steps 1 and 3).
 *
 * Dann's [i] fR1 read 1063 Hz (2026-09-02), 247 Hz (2026-09-28), and 186 Hz (2026-09-30):
 * one singer, one vowel, in fry. The brief asks for an instrument that needs no singer. It is
 * `fry-synth.ts`: glottal pulses at fry rates, with jitter, alternating periods, and breath
 * noise, through a cascade of resonators whose frequencies are the test's arguments. Every
 * expected value below is one of those arguments, never a value the extractor reported
 * (Dann's standing condition, `analyze.test.ts`).
 *
 * What the instrument showed before the fix, through `runCapture()`, over 36 takes per case
 * (three fry rates, three levels over 30 dB, four source types):
 *   - [i] at 290 Hz read 261 to 274 Hz, none within 5%; [i] at 250 Hz, 14 of 36 within 5%;
 *   - [u] at 270 Hz read 245 to 262 Hz, 3 of 36 within 5%;
 *   - [ɑ] at 650, 700, and 750 Hz, and [i] at 330 Hz, all within 5%.
 * The cause: the cepstral route reads the peak of source times tract, and a fry pulse's
 * open phase puts a dip in the source near a bass [i]'s or [u]'s first resonance
 * (`closed-phase.ts` says more). After the fix, all 36 of every case are within 5%.
 *
 * The full table, and the harder cases this file does not pin (a second pulse a few ms after
 * each main pulse, a microphone's low roll-off, mains hum), are in
 * `docs/sessions/report-code-i-extractor_r1_2026-09-30.md`.
 */
import { describe, it, expect } from 'vitest';
import { synthFry, SYNTH_SR, type FryCase } from './fry-synth';
import { runCapture } from './analyze';
import { ltasFormants, type ExtractTrace } from './extract';
import { wavBytes, captureFileEnabled } from './capture-file';

/** Bandwidths for five resonances: narrow at the bottom, as in a closed-glottis fry pulse. */
const BW = [60, 90, 120, 180, 250];
/** Bass values: fR1 per the brief (i 250 to 330, u about 270, ɑ 650 to 750); the rest as the brief sketches. */
const CASES: { name: string; vowel: 'i' | 'u' | 'ɑ'; formants: number[] }[] = [
	{ name: '[i] 250', vowel: 'i', formants: [250, 2000, 2700, 3300, 3900] },
	{ name: '[i] 290', vowel: 'i', formants: [290, 2150, 2750, 3300, 3900] },
	{ name: '[i] 330', vowel: 'i', formants: [330, 2300, 2800, 3400, 3900] },
	{ name: '[u] 270', vowel: 'u', formants: [270, 700, 2300, 3000, 3700] },
	{ name: '[ɑ] 650', vowel: 'ɑ', formants: [650, 1050, 2500, 3300, 3900] },
	{ name: '[ɑ] 750', vowel: 'ɑ', formants: [750, 1150, 2550, 3300, 3900] },
];
/** The brief's source variants: a clean train, jittered periods, alternating periods, and a noisy source. */
const SOURCES: Partial<FryCase>[] = [{ jitter: 0.02 }, { jitter: 0.12 }, { jitter: 0.05, diplo: 0.3 }, { jitter: 0.1, breath: 1 }];
const RATES = [35, 50, 70], LEVELS = [0, -15, -30];

function f1Of(y: Float64Array, vowel: 'i' | 'u' | 'ɑ', trace?: Partial<ExtractTrace>): number {
	const o = runCapture(y, SYNTH_SR, vowel, undefined, trace);
	if (o.outcome !== 'reading') throw new Error(`no reading: ${JSON.stringify(o).slice(0, 200)}`);
	return o.formant.f1;
}

describe('the instrument shows the defect it was built for', () => {
	// The positive control. If the synthetic fry were too kind, the cepstral route alone would
	// read it correctly and the tests below would prove nothing.
	it('the cepstral route alone reads a 290 Hz [i] more than 5% low', () => {
		const y = synthFry({ formants: CASES[1].formants, bandwidths: BW, rate: 50, jitter: 0.02, seed: 7 });
		const f1 = ltasFormants(y, SYNTH_SR, 'i').f1!;
		expect(f1).toBeLessThan(290 * 0.95);
	});
});

describe('fR1 lands within 5% of the known resonance, and holds across rate, level, and source', () => {
	for (const c of CASES) {
		it(`${c.name}: nine takes over three fry rates and 30 dB`, () => {
			const known = c.formants[0], got: number[] = [];
			let k = 0;
			for (const rate of RATES) for (const levelDb of LEVELS) {
				const src = SOURCES[k % SOURCES.length];
				const y = synthFry({ formants: c.formants, bandwidths: BW, rate, levelDb, durationS: 2.5, seed: 31 + 7 * k++, ...src });
				got.push(f1Of(y, c.vowel));
			}
			for (const f of got) expect(Math.abs(f - known) / known).toBeLessThanOrEqual(0.05);
			// Stable: the whole spread of nine takes fits inside the 5% tolerance.
			expect((Math.max(...got) - Math.min(...got)) / known).toBeLessThanOrEqual(0.05);
		}, 60000);
	}
});

describe('the closed phase gives way when it disagrees with the envelope', () => {
	// An [o] with every hard condition at once: a second pulse 5 ms after each main pulse, a
	// 150 Hz roll-off, hum, breath, 70 Hz, and 30 dB down. Measured while this was built: the
	// closed-phase fit read about 848 Hz here. The envelope's peak is within 5%, and it stands.
	it('an [o] at 450 Hz under every hard condition reads within 5%, the closed phase set aside', () => {
		const y = synthFry({ formants: [450, 800, 2400, 3100, 3800], bandwidths: BW, rate: 70, levelDb: -30, seed: 792,
			jitter: 0.1, breath: 1, pairMs: 5, pairRatio: 0.6, highpassHz: 150, humRms: 0.002 });
		const trace: Partial<ExtractTrace> = {};
		const o = runCapture(y, SYNTH_SR, 'o', undefined, trace);
		expect(o.outcome).toBe('reading');
		if (o.outcome !== 'reading') return;
		expect(trace.closedPhaseSetAside).toBe(true);
		expect(trace.chosen?.method).toBe('ltas');
		expect(Math.abs(o.formant.f1 - 450) / 450).toBeLessThanOrEqual(0.05);
	}, 30000);

	it('a take the closed phase reads is marked so, and the trace names the prior', () => {
		const y = synthFry({ formants: CASES[1].formants, bandwidths: BW, rate: 50, jitter: 0.05, durationS: 2.5, seed: 11 });
		const trace: Partial<ExtractTrace> = {};
		f1Of(y, 'i', trace);
		expect(trace.chosen?.method).toBe('closed-phase');
		expect(trace.closedPhaseSetAside).toBe(false);
		expect(trace.prior).toEqual([296, 1705]);
		expect(trace.closedPhase!.segments).toBeGreaterThan(20);
	}, 30000);
});

describe('the capture file', () => {
	it('writes a 16-bit mono WAV at the given rate, samples clipped and rounded', () => {
		const y = [0, 0.5, -0.5, 1, -1, 2, -2];
		const b = wavBytes(y, 48000), v = new DataView(b.buffer);
		const tag = (o: number) => String.fromCharCode(...b.slice(o, o + 4));
		expect([tag(0), tag(8), tag(12), tag(36)]).toEqual(['RIFF', 'WAVE', 'fmt ', 'data']);
		expect(v.getUint32(4, true)).toBe(36 + 2 * y.length);
		expect(v.getUint16(20, true)).toBe(1); // PCM
		expect(v.getUint16(22, true)).toBe(1); // mono
		expect(v.getUint32(24, true)).toBe(48000);
		expect(v.getUint16(34, true)).toBe(16);
		expect(v.getUint32(40, true)).toBe(2 * y.length);
		const s = Array.from({ length: y.length }, (_, i) => v.getInt16(44 + 2 * i, true));
		expect(s).toEqual([0, 16384, -16384, 32767, -32768, 32767, -32768]);
	});

	it('is off where there is no page address, whatever the build', () => {
		expect(captureFileEnabled()).toBe(false);
	});
});
