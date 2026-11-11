/**
 * ROW 182, step 7: how long the match takes at phone width, with the arias in the library (Fable's amendment 9).
 *
 * The matcher runs where it is called, on the main thread, with no worker (`poem-offer.svelte.ts`, `matchPoem`). The library's letters grew
 * from 19,547 to 71,041, so a long Lyrics takes longer. This loads the app's own `poem-match.ts` and the shipped file in the phone
 * project's browser (390 x 844, touch) and times `matchPoem` on the longest aria's Lyrics and on the longest text in the library, against
 * the 14 first poems alone (before, named by id: lane 45's 224 harvested poems carry no `kind` either) and the full library (after). It reports; it asserts only that each match finishes in a minute.
 *
 * WHAT THIS IS NOT: a phone. It is Chromium on the machine that runs the suite, with the CPU slowed by the browser's own throttle (4x, then
 * `Emulation.setCPUThrottlingRate`), which stands in for a phone's slower processor and is not a measurement of any phone.
 * Run: `playwright test --project=phone poem-arias-time`; the timings are printed as one line each and written to `test-results/`.
 */
import { test, expect } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { waitForDictionary } from '../e2e/helpers';

test('the match time on the longest aria and the longest text, before (the 14 first poems) and after (the whole library), at phone width', async ({ page }) => {
	test.setTimeout(240_000);
	await page.goto('/');
	await waitForDictionary(page);
	const client = await page.context().newCDPSession(page);
	const report: string[] = [];
	for (const rate of [1, 4]) {
		await client.send('Emulation.setCPUThrottlingRate', { rate });
		const out = await page.evaluate(async () => {
			const match = await import(/* @vite-ignore */ '/src/lib/text/poem-match.ts');
			const manifest = await (await fetch('/data/dictionary-manifest.json')).json();
			const library = await (await fetch(`/data/${manifest.poemFiles[0]}`)).json();
			const FIRST_FOURTEEN = ['0127a63ffe', '21568f1c1e', '298e556367', '2ba9040d8c', '307359f1d3', '36f13ef599', '419e40dd3c', '56eb0aac20', '6b51c54db7', '7b9b662ad7', '87376c1710', 'c1964bc3bd', 'c8f80d24ec', 'cb6998d772'];
			const poems = { version: 1, entries: library.entries.filter((e: { id: string }) => FIRST_FOURTEEN.includes(e.id)) };
			const longest = (entries: { textModern: string }[]) => entries.reduce((a, b) => (b.textModern.length > a.textModern.length ? b : a));
			const aria = longest(library.entries.filter((e: { kind?: string }) => e.kind === 'libretto'));
			const text = longest(library.entries);
			const time = (lyrics: string, lib: unknown): number => {
				const t = performance.now();
				match.matchPoem(lyrics, lib);
				return Math.round(performance.now() - t);
			};
			return {
				entries: library.entries.length,
				ariaLetters: match.foldLetters(aria.textModern).length,
				textLetters: match.foldLetters(text.textModern).length,
				ariaBefore: time(aria.textModern, poems),
				ariaAfter: time(aria.textModern, library),
				textBefore: time(text.textModern, poems),
				textAfter: time(text.textModern, library),
			};
		});
		report.push(
			`CPU ${rate}x: longest aria (${out.ariaLetters} letters) ${out.ariaBefore} ms against 14 poems, ${out.ariaAfter} ms against ${out.entries} entries; longest text (${out.textLetters} letters) ${out.textBefore} ms, ${out.textAfter} ms`,
		);
		for (const ms of [out.ariaBefore, out.ariaAfter, out.textBefore, out.textAfter]) expect(ms).toBeLessThan(60_000);
	}
	console.log(report.join('\n'));
	mkdirSync('test-results', { recursive: true });
	writeFileSync('test-results/poem-arias-time.txt', report.join('\n') + '\n');
});
