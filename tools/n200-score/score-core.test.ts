/**
 * The scoring tool on synthetic fry with known resonances (`apps/web/src/lib/voice/engine/fry-synth.ts`). Every expected value is an
 * argument of the generator, never a value a picker reported. Run: see `vitest.config.ts`.
 */
import { describe, it, expect } from 'vitest';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { synthFry, SYNTH_SR, type FryCase } from '$lib/voice/engine/fry-synth';
import { wavBytes } from '$lib/voice/engine/capture-file';
import { decodeWav, scoreTake, scoreFolder, tableCsv, summaryText, kindOf, PICKERS, BURG_PY } from './score-core';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const BW = [60, 90, 120, 180, 250];
const CASES = {
	i: [290, 2150, 2750, 3300, 3900],
	u: [270, 700, 2300, 3000, 3700],
	ɑ: [650, 1050, 2500, 3300, 3900],
	o: [480, 830, 2500, 3200, 3800],
} as const;
const fry = (v: keyof typeof CASES, extra: Partial<FryCase> = {}) => synthFry({ formants: [...CASES[v]], bandwidths: BW, rate: 50, jitter: 0.03, seed: 11, ...extra });
const near = (list: number[], target: number, tol: number) => list.some((f) => Math.abs(f - target) / target <= tol);

describe('decodeWav', () => {
	it('inverts the recorder`s wavBytes to within one quantisation step', () => {
		const y = fry('ɑ', { durationS: 1 });
		const d = decodeWav(wavBytes(y, SYNTH_SR));
		expect(d.sr).toBe(SYNTH_SR);
		expect(d.y.length).toBe(y.length);
		let worst = 0;
		for (let i = 0; i < y.length; i++) worst = Math.max(worst, Math.abs(d.y[i] - y[i]));
		expect(worst).toBeLessThan(1 / 0x7fff);
	});
});

describe('scoreTake dumps every candidate', () => {
	for (const v of ['i', 'u', 'ɑ'] as const) {
		it(`[${v}] right vowel asked: the known fR1 and fR2 are among the envelope peaks or closed-phase poles`, () => {
			const row = scoreTake(fry(v), SYNTH_SR, v, { file: 'x.wav' });
			const c = row.candidates!;
			expect(c).toBeTruthy();
			const all = [...c.envelopePeaks.map((p) => p.f), ...(c.poles ?? []).map((p) => p.f)];
			expect(near(all, CASES[v][0], 0.10), `fR1 ${CASES[v][0]} among ${all.join(' ')}`).toBe(true);
			expect(near(all, CASES[v][1], 0.12), `fR2 ${CASES[v][1]} among ${all.join(' ')}`).toBe(true);
			expect(c.envelopePeaks.every((p) => typeof p.levelDb === 'number' && p.promDb >= 0.5)).toBe(true);
			expect(c.strongestDb).not.toBeNull();
			if (c.poles) expect(c.poles.every((p) => p.bw > 0)).toBe(true);
		});
	}
	it('has one entry per picker, carrying status and evidence marks', () => {
		const row = scoreTake(fry('i'), SYNTH_SR, 'i', { file: 'x.wav', sung: 'i' });
		expect(Object.keys(row.pickers)).toEqual(Object.keys(PICKERS));
		const p = row.pickers.shipped;
		expect(p.outcome).toBe('reading');
		expect(['captured', 'provisional']).toContain(p.reading);
		expect(p.method).not.toBeNull();
		expect(p.f1).toBeGreaterThan(150);
	});
});

describe('scoreFolder, on files in the recorder`s own format', () => {
	const dir = mkdtempSync(path.join(os.tmpdir(), 'n200-score-'));
	const put = (stem: string, v: keyof typeof CASES, asked: string, sung: string | null) => {
		const y = fry(v, { durationS: 3 });
		writeFileSync(path.join(dir, `${stem}.wav`), wavBytes(y, SYNTH_SR));
		writeFileSync(path.join(dir, `${stem}.json`), JSON.stringify({ file: `${stem}.wav`, samples: y.length, asked, vowel: asked, sung, build: 'abc12345', sampleRate: SYNTH_SR, outcome: { outcome: 'reading', formant: { f1: 123, f2: 456 }, guard: { segmentS: [0, 3] } } }));
	};
	put('ilya-capture-asked-i-sung-i-T1', 'i', 'i', 'i');
	put('ilya-capture-asked-i-sung-u-T2', 'u', 'i', 'u');
	put('ilya-capture-asked-ɑ-sung-unstated-T3', 'ɑ', 'ɑ', null);
	writeFileSync(path.join(dir, 'reference.csv'), 'file,fR1,fR2\nilya-capture-asked-i-sung-u-T2.wav,270,700\n');

	it('reads the asked and sung vowels, the build, and the recorded reading', () => {
		const rows = scoreFolder(dir, { burg: false });
		expect(rows.map((r) => [r.asked, r.sung, kindOf(r)])).toEqual([['i', 'i', 'right'], ['i', 'u', 'wrong'], ['ɑ', null, 'unstated']]);
		expect(rows.every((r) => r.build === 'abc12345')).toBe(true);
		expect(rows[0].recorded).toEqual({ f1: 123, f2: 456 });
	});

	it('takes a manual reference over Burg, and writes a table and a summary', () => {
		const rows = scoreFolder(dir, { burg: false });
		const wrong = rows.find((r) => kindOf(r) === 'wrong')!;
		expect(wrong.reference).toEqual({ f1: 270, f2: 700, source: 'manual' });
		const csv = tableCsv(rows).split('\n');
		expect(csv[0]).toMatch(/^file,asked,sung,kind,build,recorded_fR1,recorded_fR2,shipped_fR1,shipped_fR2,shipped_status/);
		expect(csv.filter(Boolean)).toHaveLength(4);
		const s = summaryText(rows);
		expect(s).toContain('Picker shipped');
		expect(s).toContain('wrong (1 takes)');
	});

	const haveBurg = existsSync(BURG_PY) && spawnSync('python3', ['-c', 'import numpy, scipy'], { encoding: 'utf8' }).status === 0;
	it.skipIf(!haveBurg)('reads an independent Burg reference near the generator`s own resonances', () => {
		const rows = scoreFolder(dir);
		const right = rows.find((r) => kindOf(r) === 'right')!;
		expect(right.reference.source).toBe('burg');
		expect(right.reference.f1).not.toBeNull();
		// Burg reads every frame, open phase included: a second opinion, so the bar here is wide (25%) and from the generator's argument.
		expect(Math.abs(right.reference.f1! - CASES.i[0]) / CASES.i[0]).toBeLessThan(0.25);
	});

	it('cleans up', () => { rmSync(dir, { recursive: true, force: true }); });
});
