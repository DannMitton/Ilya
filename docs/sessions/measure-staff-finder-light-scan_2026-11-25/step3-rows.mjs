// Step 3: which row each system's words came from. The layout and tesseract's words captured by step3-e2e.mjs are put
// back through the app's own `seatPage` in the running app (its dictionary and engine, `loadSeams`): once over the
// whole page, which must give the run's own count, then once for each row on its own, which says whether `rowLanguage`
// calls that row Russian. A system is seated from its first Russian row; where none is, from the first row the
// dictionary sewing takes (`underlay-fallback.ts`). Needs the dev server on :5173.
// usage: node step3-rows.mjs <e2e .json>
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire('/Users/dannmitton/Desktop/ilya-rewrite/apps/web/package.json');
const { chromium } = require('@playwright/test');
const run = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const layout = run.answers.find((a) => a.layout).layout;
const blocks = run.answers.filter((a) => a.data?.blocks).map((a) => a.data.blocks);
const browser = await chromium.launch();
const ctx = await browser.newContext({ serviceWorkers: 'block' });
const page = await ctx.newPage();
await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(5000);
const out = await page.evaluate(async ({ layout, blocks }) => {
	const { seatPage } = await import('/src/lib/omr/underlay-page.ts');
	const { wordsOf } = await import('/src/lib/omr/underlay-recognize.ts');
	const { loadSeams } = await import('/src/lib/underlay-seams.ts');
	const seams = await loadSeams();
	const reads = blocks.map((b) => wordsOf(b));
	const whole = seatPage(layout, reads, seams);
	const systems = layout.systems.map((s, i) => {
		const rows = s.rows.map((r) => {
			const one = seatPage({ ...layout, systems: [{ ...s, rows: [{ ...r, id: 0 }] }] }, [reads[r.id]], seams);
			return { id: r.id, y: r.offsetY, text: reads[r.id].map((w) => w.text).join(' '), russian: one.stats.russianRows === 1, sewable: one.stats.fallback === 1, seats: one.stats.seated };
		});
		const alone = seatPage({ ...layout, systems: [s] }, reads, seams);
		return { rows, russianRows: alone.stats.russianRows, fallback: alone.stats.fallback, seated: alone.stats.seated, why: alone.systems[0]?.why ?? null };
	});
	return { whole: { rows: whole.stats.rows, systems: whole.stats.systems, seated: whole.stats.seated, unseated: whole.stats.unseated, russianRows: whole.stats.russianRows, fallback: whole.stats.fallback }, systems };
}, { layout, blocks });
console.log('whole page replayed:', JSON.stringify(out.whole));
out.systems.forEach((s, i) => {
	const from = s.rows.find((r) => r.russian) ?? s.rows.find((r) => r.sewable);
	console.log(`system ${i + 1}: ${s.seated} syllables seated, ${s.russianRows} Russian rows${s.fallback ? ', FALLBACK' : ''}; seated from row ${from ? s.rows.indexOf(from) + 1 : '-'} of ${s.rows.length} (y ${from?.y ?? '-'})`);
	s.rows.forEach((r, k) => console.log(`    ${k + 1} ${r.russian ? 'russian' : r.sewable ? 'sewable' : '      -'}  y ${r.y}  ${r.text.slice(0, 90)}`));
});
await browser.close();
