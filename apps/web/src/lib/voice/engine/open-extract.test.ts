/**
 * The open picker (`open-extract.ts`), N.200 Step 3. What is pinned: it is agnostic (no vowel, no voice type, no table of expected
 * values reaches the choice), the switch selects it, a reading taken under it says so, and it reads synthetic fry with known resonances
 * (generator arguments, never a value a picker reported). The full synthetic gate, with its pre-registered bars, is
 * `tools/n200-score/synth-gate.run.ts`; these are the cases that stay in the web gate.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { synthFry, SYNTH_SR } from './fry-synth';
import { runCapture } from './analyze';
import { measurePicker } from '../chart/measure-switch';
import { readingTake } from '../takes';
import type { Vowel } from './types';

const BW = [60, 90, 120, 180, 250];
const strip = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

describe('the measure switch', () => {
	it('?measure=open selects the open picker, and nothing else does', () => {
		expect(measurePicker('?measure=open')).toBe('open');
		expect(measurePicker('?a=1&measure=open')).toBe('open');
		expect(measurePicker('')).toBe('shipped');
		expect(measurePicker('?measure=shipped')).toBe('shipped');
		expect(measurePicker('?measure=OPEN')).toBe('shipped');
	});
});

describe('the open picker is agnostic', () => {
	it('its source holds no per-vowel table, no vowel parameter, no voice type, and no IPA vowel letter in code', () => {
		const code = strip(readFileSync(join(__dirname, 'open-extract.ts'), 'utf8'));
		expect(code).not.toMatch(/MITTON/);
		expect(code).not.toMatch(/\bvowel\b/i);
		expect(code).not.toMatch(/voiceType|VoiceType/);
		expect(code).not.toMatch(/[iɪeɛaɑʌouɨ]'\s*[:\]]/); // no 'u': [...] table keys
		expect(code).not.toMatch(/\.\.\/(plausibility|stand-ins|voiceTypes)|\.\/(plausibility|stand-ins|voiceTypes)/);
	});

	it('gives the same reading whichever vowel is asked', () => {
		const y = synthFry({ formants: [270, 700, 2300, 3000, 3700], bandwidths: BW, rate: 50, jitter: 0.03, seed: 5 });
		const asked: Vowel[] = ['i', 'e', 'ɪ', 'ɨ', 'ɛ', 'a', 'ɑ', 'ʌ', 'o', 'u'];
		const outs = asked.map((v) => JSON.stringify(runCapture(y, SYNTH_SR, v, undefined, undefined, 'open')));
		expect(new Set(outs).size).toBe(1);
		expect(outs[0]).toContain('"picker":"open"');
	});
});

describe('a reading taken under the open picker says so', () => {
	it('carries picker: open on the reading, and the take record keeps it', () => {
		const y = synthFry({ formants: [650, 1050, 2500, 3300, 3900], bandwidths: BW, rate: 50, jitter: 0.03, seed: 9 });
		const o = runCapture(y, SYNTH_SR, 'ɑ', undefined, undefined, 'open');
		expect(o.outcome).toBe('reading');
		if (o.outcome !== 'reading') return;
		expect(o.formant.picker).toBe('open');
		const rec = readingTake({ vowel: 'ɑ', visible: 'zone', now: new Date('2026-11-15T00:00:00Z') }, o.formant);
		expect(rec.raw?.picker).toBe('open');
		const shipped = runCapture(y, SYNTH_SR, 'ɑ');
		if (shipped.outcome !== 'reading') throw new Error('no reading');
		expect(shipped.formant.picker).toBeUndefined();
		expect(readingTake({ vowel: 'ɑ', visible: 'zone' }, shipped.formant).raw?.picker).toBeUndefined();
	});
});

describe('a first resonance whose envelope peak the source pulls low (found in the browser run, N.200 Step 3)', () => {
	// fR1 300 Hz with a narrow bandwidth: the envelope's peak sits near 258 Hz, 14% under the closed-phase pole. A 12% match
	// refuses the pole and the picker took the 800 Hz pole as fR1. fR1's match has a wider arm (30%, the shipped picker's set-aside
	// tolerance) for a peak within 8 dB of the strongest, which the source's own peak near 200 Hz is not.
	it.each([1, 2, 3, 4])('reads fR1 300 and fR2 800 on take %i', (seed) => {
		const y = synthFry({ formants: [300, 800, 2500, 3500], bandwidths: [80, 100, 200, 250], rate: 70, jitter: 0.03, openMs: 5, roomRms: 0.0003, durationS: 3.5, seed: 100 + seed });
		const o = runCapture(y, SYNTH_SR, 'i', undefined, undefined, 'open');
		expect(o.outcome).toBe('reading');
		if (o.outcome !== 'reading') return;
		expect(Math.abs(o.formant.f1 - 300) / 300).toBeLessThan(0.10);
		expect(Math.abs((o.formant.f2 ?? 0) - 800) / 800).toBeLessThan(0.12);
	});
});

describe('the wider match does not let the source peak claim fR1 (treble [ɑ], found by the first widening)', () => {
	it('reads a treble [ɑ] 900/1400 on at least 8 of 9 takes (three rates, three levels)', () => {
		let good = 0;
		for (const rate of [35, 50, 70]) for (const levelDb of [0, -15, -30]) {
			const y = synthFry({ formants: [900, 1400, 2800, 3600, 4200], bandwidths: BW, rate, levelDb, jitter: 0.1, breath: 1, seed: 3000 + rate + levelDb });
			const o = runCapture(y, SYNTH_SR, 'ɑ', undefined, undefined, 'open');
			if (o.outcome === 'reading' && Math.abs(o.formant.f1 - 900) / 900 <= 0.10) good++;
		}
		expect(good).toBeGreaterThanOrEqual(8);
	});
});
