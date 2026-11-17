/**
 * Burg's method against known answers (N.200 path picker, Step 1). Expected values come from the arguments of the test signal,
 * never from the code under test, except the second test, which compares against `tools/i-extractor-check/burg.py`.
 */
import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { burgCoefficients, burgFrames, polesOf } from './burg';
import { synthFry, SYNTH_SR } from './fry-synth';
import { wavBytes } from './capture-file';
import { median } from './dsp';

describe('burgCoefficients: known poles', () => {
	/* KNOWN FAILING, and kept failing on purpose (`it.fails`). The brief's bar is 1 Hz and it is not loosened. Measured: the largest
	   error is 15 Hz (the 4300 Hz pole), 2.2 Hz on the 500 Hz pole, and the recovered bandwidths are 8 to 31 Hz against 60 to 150 Hz.
	   `tools/i-extractor-check/burg.py`'s own `burg()` gives the same frequencies on the same signal (502.2115 Hz), so this is how
	   Burg's method treats a decaying impulse response (the backward error of a causal decaying signal cannot be predicted by the
	   same coefficients), not a slip in this file. Step 1 stopped here, as the brief says; see `report-code-n200-path-step1_r1_2026-11-17.md`.
	   When the desk rules on the bar, change this to `it`. */
	it.fails('recovers the poles of a tenth-order all-pole filter from its unwindowed impulse response, to 1 Hz', () => {
		const sr = 10000;
		const truth = [{ f: 500, bw: 60 }, { f: 1500, bw: 80 }, { f: 2500, bw: 100 }, { f: 3500, bw: 120 }, { f: 4300, bw: 150 }];
		// A(z) = Π (1 - 2 r cos θ z^-1 + r² z^-2), multiplied out.
		let a = [1];
		for (const p of truth) {
			const r = Math.exp((-Math.PI * p.bw) / sr), th = (2 * Math.PI * p.f) / sr, q = [1, -2 * r * Math.cos(th), r * r];
			const next = new Array<number>(a.length + 2).fill(0);
			for (let i = 0; i < a.length; i++) for (let j = 0; j < 3; j++) next[i + j] += a[i] * q[j];
			a = next;
		}
		const x = new Float64Array(6000);
		for (let n = 0; n < x.length; n++) {
			let v = n === 0 ? 1 : 0;
			for (let k = 1; k < a.length && k <= n; k++) v -= a[k] * x[n - k];
			x[n] = v;
		}
		const got = polesOf(burgCoefficients(x, 10), sr);
		expect(got).toHaveLength(5);
		got.forEach((p, i) => { expect(Math.abs(p.f - truth[i].f)).toBeLessThan(1); });
	});
});

describe('burgFrames against tools/i-extractor-check/burg.py', () => {
	const py = path.resolve(__dirname, '../../../../../../tools/i-extractor-check/burg.py');
	const have = spawnSync('python3', ['-c', 'import numpy, scipy'], { encoding: 'utf8' }).status === 0 && existsSync(py);
	// NOT RUN where Python lacks numpy or scipy (the brief's instruction), reported by vitest as skipped.
	const check = (which: 'f1' | 'f2') => {
		const y = synthFry({ formants: [600, 1700, 2600, 3300, 3900], bandwidths: [90, 110, 160, 200, 250], rate: 50, jitter: 0.05, seed: 4242, durationS: 2.5 });
		const dir = mkdtempSync(path.join(tmpdir(), 'ilya-burg-'));
		try {
			const wav = path.join(dir, 'take.wav');
			writeFileSync(wav, wavBytes(y, SYNTH_SR));
			const r = spawnSync('python3', [py, wav, '--json'], { encoding: 'utf8' });
			expect(r.status).toBe(0);
			const ref = JSON.parse(r.stdout) as { f1: number[]; f2: number[] };
			const frames = burgFrames(y, SYNTH_SR, 5000);
			const f1 = median(frames.filter((f) => f.poles.length >= 1).map((f) => f.poles[0].f));
			const f2 = median(frames.filter((f) => f.poles.length >= 2).map((f) => f.poles[1].f));
			const [a, b] = which === 'f1' ? [f1, ref.f1[1]] : [f2, ref.f2[1]];
			expect(Math.abs(a - b) / b).toBeLessThan(0.03);
		} finally { rmSync(dir, { recursive: true, force: true }); }
	};
	it.skipIf(!have)('agrees on the median fR1 within 3 percent at a 5000 Hz ceiling', () => check('f1'));
	/* KNOWN FAILING (`it.fails`), bar not loosened: on this take the second pole is a spurious one that flickers between 700 and 1000 Hz,
	   and the medians differ by 6.3 percent (burg.ts 849 Hz, burg.py 904 Hz). On 12 other takes of the set the fR1 medians agree within
	   1.6 percent on all, and the fR2 medians within 1.2 percent on 9 of 12 and not on 3 (see the Step 1 report). */
	it.skipIf(!have).fails('agrees on the median fR2 within 3 percent at a 5000 Hz ceiling', () => check('f2'));
});
