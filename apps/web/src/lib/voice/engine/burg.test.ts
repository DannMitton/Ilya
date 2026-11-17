/**
 * Burg's method (N.200 path picker, Step 1, as amended by the desk's r2 of 2026-11-17). Three tests.
 *  1. Identity: `burg.ts` is the recursion of `tools/i-extractor-check/burg.py`'s `burg()`.
 *  2. Known poles: that recursion recovers the poles of a known filter from noise through it.
 *  3. Against `burg.py`: the same frames, and then the whole pipeline.
 * None is checked against Burg's pages (NOT ESTABLISHED, see `burg.ts`). Tests 1 and 3 are NOT RUN (skipped) where Python lacks numpy or scipy.
 */
import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { burgCoefficients, burgFrames, polesOf, gaussianWindow, PREEMPH_HZ } from './burg';
import { BURG_REF, KNOWN_POLES, KNOWN_SR, havePython, noiseRecord, pyCoeffs, rounded10k, thirteenTakes, quartiles, withTmp } from '../../../../../../tools/n200-score/burg-fixtures';
import { synthFry, SYNTH_SR } from './fry-synth';
import { wavBytes } from './capture-file';
import { median } from './dsp';

const BURG_PY = path.resolve(__dirname, '../../../../../../tools/i-extractor-check/burg.py');
const SLOW = 180_000;

describe('Test 1: burg.ts is the recursion of burg.py', () => {
	const check = (x: Float64Array, sr: number) => {
		const mine = burgCoefficients(x, 10), py = pyCoeffs(x, 10, sr);
		expect(mine).toHaveLength(py.a.length);
		mine.forEach((v, i) => expect(Math.abs(v - py.a[i])).toBeLessThan(1e-9));
		const f = polesOf(mine, sr).map((p) => p.f);
		expect(f).toHaveLength(py.freqs.length);
		f.forEach((v, i) => expect(Math.abs(v - py.freqs[i])).toBeLessThan(0.01));
	};
	it.skipIf(!havePython)('coefficients to 1e-9 and roots to 0.01 Hz on the Test 2 record of seed 1', () => check(noiseRecord(1), KNOWN_SR), SLOW);
	it.skipIf(!havePython)('and on one windowed frame of a fry-synth take', () => {
		const y = synthFry({ formants: [600, 1700, 2600, 3300, 3900], bandwidths: [90, 110, 160, 200, 250], rate: 50, jitter: 0.05, seed: 4242, durationS: 2.5 });
		const { x } = rounded10k(y);
		const alpha = Math.exp((-2 * Math.PI * PREEMPH_HZ) / 10000), n = 500, w = gaussianWindow(n), s = 5000, fr = new Float64Array(n);
		for (let i = 0; i < n; i++) fr[i] = (x[s + i] - alpha * x[s + i - 1]) * w[i];
		check(fr, 10000);
	}, SLOW);
});

describe('Test 2: known poles from noise through a known filter', () => {
	/* DESK DEFAULT bar, 1 percent of each pole's frequency on every one of 20 records (seeds 1 to 20 of `noiseRecord`: `rng(seed)` uniform noise,
	   mapped to [-1, 1), through the filter, 1,000 samples dropped, 80,000 kept). The desk measured at most 0.48 percent over 400 records. The
	   recursion and the roots only: no resampling, no pre-emphasis, no window. */
	it('every pole within 1 percent of its true frequency on all 20 records', () => {
		for (let seed = 1; seed <= 20; seed++) {
			const got = polesOf(burgCoefficients(noiseRecord(seed), 10), KNOWN_SR);
			expect(got, `seed ${seed}`).toHaveLength(5);
			got.forEach((p, i) => expect(Math.abs(p.f - KNOWN_POLES[i].f) / KNOWN_POLES[i].f, `seed ${seed}, pole ${KNOWN_POLES[i].f} Hz`).toBeLessThan(0.01));
		}
	}, SLOW);
});

describe('Test 3: against burg.py, on 13 takes', () => {
	const py = (args: string[]) => {
		const r = spawnSync('python3', ['-B', ...args], { encoding: 'utf8' });
		if (r.status !== 0) throw new Error(r.stderr);
		return JSON.parse(r.stdout);
	};
	it.skipIf(!havePython)('item 1, the same input: equal frame counts, and the quartiles of F1 and F2 within 0.1 Hz, on every take', () => {
		const misses: string[] = [];
		for (const t of thirteenTakes()) {
			const { wav, x } = rounded10k(t.y);
			withTmp((dir) => {
				const f = path.join(dir, 'take.wav');
				writeFileSync(f, wav);
				const ref = py([BURG_REF, 'frames', f]);
				const frames = burgFrames(x, 10000, 5000);
				const f1 = quartiles(frames.filter((fr) => fr.poles.length >= 1).map((fr) => fr.poles[0].f));
				const f2 = quartiles(frames.filter((fr) => fr.poles.length >= 2).map((fr) => fr.poles[1].f));
				if (frames.length !== ref.frames) misses.push(`seed ${t.seed}: frames ${frames.length} vs ${ref.frames}`);
				for (let i = 0; i < 3; i++) {
					if (Math.abs(f1[i] - ref.f1[i]) > 0.1) misses.push(`seed ${t.seed}: F1 q${i} ${f1[i]} vs ${ref.f1[i]}`);
					if (Math.abs(f2[i] - ref.f2[i]) > 0.1) misses.push(`seed ${t.seed}: F2 q${i} ${f2[i]} vs ${ref.f2[i]}`);
				}
			});
		}
		expect(misses).toEqual([]);
	}, SLOW);

	it.skipIf(!havePython)('item 2, the whole pipeline at 5000 Hz (burg.py fixed ceiling, :28): fR1 medians within 3 percent on every take', () => {
		const misses: string[] = [];
		for (const t of thirteenTakes()) {
			withTmp((dir) => {
				const f = path.join(dir, 'take.wav');
				writeFileSync(f, wavBytes(t.y, SYNTH_SR));
				const ref = py([BURG_PY, f, '--json']);
				const m = median(burgFrames(t.y, SYNTH_SR, 5000).filter((fr) => fr.poles.length >= 1).map((fr) => fr.poles[0].f));
				if (Math.abs(m - ref.f1[1]) / ref.f1[1] >= 0.03) misses.push(`seed ${t.seed}: fR1 ${m.toFixed(1)} vs ${ref.f1[1].toFixed(1)}`);
			});
		}
		expect(misses).toEqual([]);
	}, SLOW);
});
