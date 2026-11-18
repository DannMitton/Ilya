/**
 * N.200 path picker, Step 4: how long `runCapture` takes under the shipped picker and under the path picker, at phone width, with the CPU
 * at its own speed (1x) and slowed by the browser's own throttle (4x, `Emulation.setCPUThrottlingRate`, after `poem-arias-time.test.ts`).
 *
 * WHAT THIS IS NOT: a phone. It is Chromium on the machine that runs the suite, not WebKit, and the throttle stands in for a phone's
 * slower processor without measuring any phone. The desk measures the time on Dann's iPhone with `analysisMs` in the recorder's sidecar.
 *
 * It times, per take and per picker, one `runCapture` call (the guard, the detector, and the picker, as the app runs them), on five
 * synthetic fry takes (`engine/fry-synth.ts`), and reports the median. For the path picker it also times Burg at each ceiling of the ladder
 * (`burgFrames`, per ceiling) and counts the frames of each ceiling. It reports; it asserts only that each call finishes in two minutes.
 * The bar the desk wrote first (Step 4): the median with `?measure=path` no more than 1,000 ms above the median with `?measure=shipped`, on the iPhone (the path picker is the default since lane 64).
 * Run: `playwright test --project=phone path-picker-time`; the lines are printed and written to `test-results/`.
 */
import { test, expect } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

test('runCapture under the shipped and the path picker, at phone width, 1x and 4x', async ({ page }) => {
	test.setTimeout(900_000);
	await page.goto('/');
	const client = await page.context().newCDPSession(page);
	const report: string[] = [];
	for (const rate of [1, 4]) {
		await client.send('Emulation.setCPUThrottlingRate', { rate });
		const out = await page.evaluate(async () => {
			const fry = await import(/* @vite-ignore */ '/src/lib/voice/engine/fry-synth.ts');
			const analyze = await import(/* @vite-ignore */ '/src/lib/voice/engine/analyze.ts');
			const pe = await import(/* @vite-ignore */ '/src/lib/voice/engine/path-extract.ts');
			const burg = await import(/* @vite-ignore */ '/src/lib/voice/engine/burg.ts');
			const BW = [60, 90, 120, 180, 250];
			const cases = [[270, 700, 2300, 3000, 3700], [650, 1050, 2500, 3300, 3900], [300, 800, 2500, 3500, 3900], [480, 830, 2500, 3200, 3800], [290, 2150, 2750, 3300, 3900]];
			const med = (v: number[]) => { const s = [...v].sort((a, b) => a - b); return s[s.length >> 1]; };
			const shipped: number[] = [], path: number[] = [], perCeiling: number[][] = pe.L15.map(() => []), frames: number[][] = pe.L15.map(() => []);
			const sr = fry.SYNTH_SR;
			cases.forEach((formants, i) => {
				// The app trims 0.5 s from each end of a 3 s sweep: a 2 s buffer is what `runCapture` sees (`engine/live.ts`).
				const y = fry.synthFry({ formants, bandwidths: BW, rate: 50, jitter: 0.03, seed: 20 + i, durationS: 2.0 });
				let t = performance.now(); analyze.runCapture(y, sr, 'ɑ', undefined, undefined, 'shipped'); shipped.push(Math.round(performance.now() - t));
				t = performance.now(); analyze.runCapture(y, sr, 'ɑ', undefined, undefined, 'path'); path.push(Math.round(performance.now() - t));
				pe.L15.forEach((c: number, k: number) => {
					const t1 = performance.now(); const fr = burg.burgFrames(y, sr, c); perCeiling[k].push(Math.round(performance.now() - t1)); frames[k].push(fr.length);
				});
			});
			return { shipped, path, perCeiling: perCeiling.map(med), frames: frames.map(med), ladder: pe.L15.map((c: number) => Math.round(c)) };
		});
		const m = (v: number[]) => { const s = [...v].sort((a, b) => a - b); return s[s.length >> 1]; };
		report.push(
			`CPU ${rate}x: runCapture shipped ${out.shipped.join(', ')} ms (median ${m(out.shipped)}); path ${out.path.join(', ')} ms (median ${m(out.path)}); path minus shipped ${m(out.path) - m(out.shipped)} ms`,
			`CPU ${rate}x: Burg ms per ceiling (median of 5 takes): ${out.ladder.map((c: number, k: number) => `${c} Hz ${out.perCeiling[k]} ms`).join('; ')}`,
			`CPU ${rate}x: frames per ceiling (a 2 s buffer): ${out.frames.join(', ')}`,
		);
		for (const ms of [...out.shipped, ...out.path]) expect(ms).toBeLessThan(120_000);
	}
	console.log(report.join('\n'));
	mkdirSync('test-results', { recursive: true });
	writeFileSync('test-results/path-picker-time.txt', report.join('\n') + '\n');
});
