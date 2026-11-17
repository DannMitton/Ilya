/**
 * Test support for `burg.test.ts` and `tools/n200-score/burg-check.run.ts`: the known-pole records, the 13 takes, the reference
 * helper `tools/n200-score/burg_ref.py` (which imports `tools/i-extractor-check/burg.py` unedited), and Python's percentile rule.
 * Nothing in the app imports it.
 */
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { rng, synthFry, SYNTH_SR, type FryCase } from './fry-synth';
import { resampleTo } from './dsp';
import { wavBytes } from './capture-file';
import { cells, caseFor, PRIMARY } from '../../../../../../tools/n200-score/fidelity-set';

const ROOT = path.resolve(__dirname, '../../../../../..');
export const BURG_REF = path.join(ROOT, 'tools/n200-score/burg_ref.py');

/** Python with numpy and scipy, and `burg.py` present. NOT RUN where it is not. */
export const havePython = spawnSync('python3', ['-c', 'import numpy, scipy'], { encoding: 'utf8' }).status === 0;

export function withTmp<T>(f: (dir: string) => T): T {
	const dir = mkdtempSync(path.join(tmpdir(), 'ilya-burg-'));
	try { return f(dir); } finally { rmSync(dir, { recursive: true, force: true }); }
}

/** Test 2's filter: rate 10 kHz, poles and bandwidths (the desk's set). */
export const KNOWN_SR = 10000;
export const KNOWN_POLES = [{ f: 500, bw: 60 }, { f: 1500, bw: 90 }, { f: 2500, bw: 120 }, { f: 3500, bw: 150 }, { f: 4300, bw: 200 }];

/** A(z) of the known filter, a[0] = 1. */
export function knownA(): number[] {
	let a = [1];
	for (const p of KNOWN_POLES) {
		const r = Math.exp((-Math.PI * p.bw) / KNOWN_SR), th = (2 * Math.PI * p.f) / KNOWN_SR, q = [1, -2 * r * Math.cos(th), r * r];
		const next = new Array<number>(a.length + 2).fill(0);
		for (let i = 0; i < a.length; i++) for (let j = 0; j < 3; j++) next[i + j] += a[i] * q[j];
		a = next;
	}
	return a;
}

/**
 * Zero-mean uniform white noise (`rng(seed)`, mapped to [-1, 1)) through the known filter; the first 1,000 samples dropped, 80,000 kept
 * (8 s). Seeds 1 to 20 are the twenty records of Test 2.
 */
export function noiseRecord(seed: number, keep = 80000, drop = 1000): Float64Array {
	const a = knownA(), r = rng(seed), x = new Float64Array(keep + drop);
	for (let n = 0; n < x.length; n++) {
		let v = r() * 2 - 1;
		for (let k = 1; k < a.length && k <= n; k++) v -= a[k] * x[n - k];
		x[n] = v;
	}
	return x.slice(drop);
}

/** The impulse response of the same filter (reported, with no bar). */
export function impulseRecord(n = 6000): Float64Array {
	const a = knownA(), x = new Float64Array(n);
	for (let i = 0; i < n; i++) {
		let v = i === 0 ? 1 : 0;
		for (let k = 1; k < a.length && k <= i; k++) v -= a[k] * x[i - k];
		x[i] = v;
	}
	return x;
}

/** `burg.py`'s `burg()`, and the frequencies of its roots, on a signal. */
export function pyCoeffs(x: ArrayLike<number>, order: number, sr: number): { a: number[]; freqs: number[] } {
	return withTmp((dir) => {
		const f = path.join(dir, 'x.json');
		writeFileSync(f, JSON.stringify({ x: Array.from(x), order, sr }));
		const r = spawnSync('python3', ['-B', BURG_REF, 'coeffs', f], { encoding: 'utf8', maxBuffer: 1 << 26 });
		if (r.status !== 0) throw new Error(r.stderr);
		return JSON.parse(r.stdout);
	});
}

export interface Take { name: string; seed: number; y: Float64Array; truth: number[] }

/** The 13 takes: the Step 1 take (seed 4242) and cells 0, 4, 9, 12, 17, 21, 26, 30, 33, 38, 41, 47 of the rebuilt set, combination k = 0. */
export function thirteenTakes(): Take[] {
	const own: FryCase = { formants: [600, 1700, 2600, 3300, 3900], bandwidths: [90, 110, 160, 200, 250], rate: 50, jitter: 0.05, seed: 4242, durationS: 2.5 };
	const out: Take[] = [{ name: 'own-4242', seed: 4242, y: synthFry(own), truth: own.formants }];
	const cs = cells(PRIMARY);
	for (const idx of [0, 4, 9, 12, 17, 21, 26, 30, 33, 38, 41, 47]) {
		const c = caseFor(cs[idx], 0, PRIMARY);
		out.push({ name: `cell${idx}-${cs[idx].type}-${cs[idx].vowel}`, seed: c.seed, y: synthFry(c), truth: cs[idx].truth });
	}
	return out;
}

/** `burg.ts`'s own resampled signal at 10 kHz, rounded to 16 bits as `wavBytes` writes it, and read back as `burg.py` reads it (÷ 32768). */
export function rounded10k(y: Float64Array): { wav: Uint8Array; x: Float64Array; raw: Float64Array } {
	const raw = resampleTo(y, SYNTH_SR, 10000), wav = wavBytes(raw, 10000), v = new DataView(wav.buffer, wav.byteOffset);
	const x = new Float64Array(raw.length);
	for (let i = 0; i < x.length; i++) x[i] = v.getInt16(44 + 2 * i, true) / 32768;
	return { wav, x, raw };
}

/** numpy's default percentile (linear interpolation) of an unsorted list. */
export function percentile(v: number[], p: number): number {
	const s = [...v].sort((a, b) => a - b), k = ((s.length - 1) * p) / 100, lo = Math.floor(k), hi = Math.ceil(k);
	return s[lo] + (s[hi] - s[lo]) * (k - lo);
}
export const quartiles = (v: number[]) => [25, 50, 75].map((p) => percentile(v, p));
