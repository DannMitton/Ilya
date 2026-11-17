/**
 * The numbers for the Step 1 report (desk amendment r2, 2026-11-17). Not a gate. Prints, never asserts.
 *   pnpm --filter @ilya/web exec vitest run --config ../../tools/n200-score/vitest.config.ts burg-check.run.ts
 * Writes nothing into the repository.
 */
import { test } from 'vitest';
import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { burgCoefficients, burgFrames, polesOf } from '$lib/voice/engine/burg';
import { BURG_REF, KNOWN_POLES, KNOWN_SR, impulseRecord, noiseRecord, rounded10k, thirteenTakes, withTmp, quartiles } from '$lib/voice/engine/burg-fixtures';
import { wavBytes } from '$lib/voice/engine/capture-file';
import { SYNTH_SR } from '$lib/voice/engine/fry-synth';
import { median } from '$lib/voice/engine/dsp';

const BURG_PY = path.resolve(__dirname, '../i-extractor-check/burg.py');
const py = (args: string[]) => {
	const r = spawnSync('python3', ['-B', ...args], { encoding: 'utf8' });
	if (r.status !== 0) throw new Error(`python3 ${args.join(' ')}: ${r.stderr}`);
	return JSON.parse(r.stdout);
};

test('Step 1 numbers', () => {
	const out: string[] = [];
	// Test 2: largest error per pole over the 20 records.
	const worst = KNOWN_POLES.map(() => 0);
	for (let seed = 1; seed <= 20; seed++) polesOf(burgCoefficients(noiseRecord(seed), 10), KNOWN_SR).forEach((p, i) => { worst[i] = Math.max(worst[i], Math.abs(p.f - KNOWN_POLES[i].f)); });
	out.push('TEST 2 largest error over 20 records (Hz, percent): ' + KNOWN_POLES.map((p, i) => `${p.f}: ${worst[i].toFixed(2)} Hz ${(100 * worst[i] / p.f).toFixed(3)}%`).join('; '));
	out.push('IMPULSE RESPONSE (reported, no bar): ' + polesOf(burgCoefficients(impulseRecord(), 10), KNOWN_SR).map((p, i) => `${KNOWN_POLES[i].f}->${p.f.toFixed(2)} (err ${(p.f - KNOWN_POLES[i].f).toFixed(2)} Hz, bw ${p.bw.toFixed(1)} vs ${KNOWN_POLES[i].bw})`).join('; '));
	// Test 3.
	out.push('TEST 3 item 1 (same input): per take, frames and largest quartile difference in Hz (F1, F2)');
	for (const t of thirteenTakes()) {
		const { wav, x } = rounded10k(t.y);
		withTmp((dir) => {
			const f = path.join(dir, 'take.wav'); writeFileSync(f, wav);
			const lo = 1.15 * t.truth[0], hi = 0.85 * t.truth[1];
			const ref = py([BURG_REF, 'frames', f, '--between', String(lo), String(hi)]);
			const fr = burgFrames(x, 10000, 5000);
			const q1 = quartiles(fr.filter((a) => a.poles.length >= 1).map((a) => a.poles[0].f)), q2 = quartiles(fr.filter((a) => a.poles.length >= 2).map((a) => a.poles[1].f));
			const d1 = Math.max(...q1.map((v, i) => Math.abs(v - ref.f1[i]))), d2 = Math.max(...q2.map((v, i) => Math.abs(v - ref.f2[i])));
			out.push(`  seed ${t.seed} ${t.name}: frames ${fr.length}/${ref.frames}; max |dq| F1 ${d1.toExponential(2)} F2 ${d2.toExponential(2)}`);
		});
	}
	out.push('TEST 3 item 2 (whole pipeline, ceiling 5000 Hz = burg.py :28). fR1 bar 3 percent; fR2 reported, no bar. "between" = share of frames with a pole strictly between 1.15 x truth fR1 and 0.85 x truth fR2 (the desk to confirm this reading of "between F1 and F2").');
	for (const t of thirteenTakes()) {
		withTmp((dir) => {
			const f = path.join(dir, 'take.wav'); writeFileSync(f, wavBytes(t.y, SYNTH_SR));
			const ref = py([BURG_PY, f, '--json']);
			const fr = burgFrames(t.y, SYNTH_SR, 5000);
			const m1 = median(fr.filter((a) => a.poles.length >= 1).map((a) => a.poles[0].f)), m2 = median(fr.filter((a) => a.poles.length >= 2).map((a) => a.poles[1].f));
			const d1 = (100 * (m1 - ref.f1[1])) / ref.f1[1], d2 = (100 * (m2 - ref.f2[1])) / ref.f2[1];
			let line = `  seed ${t.seed} ${t.name}: fR1 ts ${m1.toFixed(1)} py ${ref.f1[1].toFixed(1)} (${d1.toFixed(2)}%) ${Math.abs(d1) < 3 ? 'in' : 'OUT'}; fR2 ts ${m2.toFixed(1)} py ${ref.f2[1].toFixed(1)} (${d2.toFixed(2)}%)`;
			if (Math.abs(d1) >= 3 || Math.abs(d2) >= 3) {
				const lo = 1.15 * t.truth[0], hi = 0.85 * t.truth[1];
				const tsBetween = fr.filter((a) => a.poles.some((p) => p.f > lo && p.f < hi)).length / fr.length;
				const pyRef = py([BURG_REF, 'frames', f, '--between', String(lo), String(hi)]);
				line += `\n      outside 3%: share of frames with a pole between: ts ${(100 * tsBetween).toFixed(1)}% py ${(100 * pyRef.between / pyRef.frames).toFixed(1)}%`;
				const { raw } = rounded10k(t.y);
				const a48 = path.join(dir, 'a.f64'), b10 = path.join(dir, 'b.f64');
				writeFileSync(a48, Buffer.from(new Float64Array(t.y).buffer)); writeFileSync(b10, Buffer.from(new Float64Array(raw).buffer));
				line += `\n      level ts minus scipy by 1 kHz band to 5 kHz (dB): ${py([BURG_REF, 'resample', a48, b10]).bands_db_ts_minus_scipy.map((v: number) => v.toFixed(2)).join(', ')}`;
			}
			out.push(line);
		});
	}
	console.log('\n' + out.join('\n'));
});
