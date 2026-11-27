// Song3 page 6, in the browser: what `readPageMetres` reads on every box, for each column of step2-song3.json. The
// tree's `readPageMetres` cannot be handed another version's staves, so its loop is repeated here (as step0e-metre.mjs
// does) with the tree's voiceBoxes, bandOf, placesOf, readWindow, decide, isCourtesyPlace, and the shipped network.
// The repeated loop is checked window for window against the tree's own `readPageMetres` for the column the working
// tree is at (<treeColumn>). Needs the dev server on :5173.
// usage: node step2-song3-metre.mjs <workdir> <treeColumn>
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire('/Users/dannmitton/Desktop/ilya-rewrite/apps/web/package.json');
const { chromium } = require('@playwright/test');
const [W, treeColumn] = process.argv.slice(2);
const name = 'song3-p6';
const per = JSON.parse(fs.readFileSync(`${W}/step2-song3.json`, 'utf8'));
const homr = JSON.parse(fs.readFileSync(`${W}/step0e-${name}.homrfull.json`, 'utf8'));
const browser = await chromium.launch();
const ctx = await browser.newContext({ serviceWorkers: 'block' });
await ctx.route('**/__m/p.png**', (r) => r.fulfill({ body: fs.readFileSync(`${W}/${name}.png`), contentType: 'image/png' }));
const page = await ctx.newPage();
await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(3000);
const res = await page.evaluate(async ({ musicXml, boxes, per }) => {
	const R = await import('/src/lib/omr/metre-reader.ts');
	const Wm = await import('/src/lib/omr/metre-windows.ts');
	const M = await import('/src/lib/omr/metre-model.ts');
	const bmp = await createImageBitmap(await (await fetch('/__m/p.png')).blob());
	const c = new OffscreenCanvas(bmp.width, bmp.height);
	const x = c.getContext('2d'); x.drawImage(bmp, 0, 0);
	const rgba = x.getImageData(0, 0, c.width, c.height).data;
	const data = new Uint8Array(c.width * c.height);
	for (let i = 0; i < data.length; i++) data[i] = rgba[i * 4];
	const pg = { width: c.width, height: c.height, data };
	const net = await M.loadMetreNet();
	const row = (r) => ({ box: r.window.box, kind: r.window.kind, x0: r.window.x0, x1: r.window.x1, lab: r.verdict.lab, why: r.verdict.why ?? null, courtesy: r.courtesy });
	const tree = await M.readPageMetres(pg, musicXml, boxes, net);
	const voice = M.voiceBoxes(musicXml, boxes, pg.height);
	const out = { voice, tree: { reads: tree.reads.map(row), unfound: tree.unfound, small: tree.small } };
	for (const label of Object.keys(per)) {
		const reads = []; const unfound = [], small = []; const found = [];
		for (const i of voice) { const s = per[label].staves[i]; if (s.st) found.push([i, s]); else unfound.push(i); }
		const usual = found.map(([, s]) => s.st.space).sort((a, b) => a - b)[Math.floor(found.length / 2)] ?? 0;
		for (const [i, s] of found) {
			if (s.st.space < 0.8 * usual) { small.push(i); continue; }
			const { band, y0, k } = Wm.bandOf(pg, s.st);
			for (const win of s.windows) {
				const w = { ...win, staff: s.st };
				const { xs, seats, lines } = Wm.placesOf(w, y0, k);
				if (xs.length === 0) continue;
				const readings = await R.readWindow(band, xs, seats, net.classify);
				reads.push(row({ window: w, verdict: R.decide(readings, band, lines, M.METRE_SETTINGS, net.ref), courtesy: Wm.isCourtesyPlace(w) }));
			}
		}
		out[label] = { reads, unfound, small };
	}
	return out;
}, { musicXml: homr.musicXml, boxes: homr.staves, per });
const t = res[treeColumn];
console.log(`repeated loop equals the tree's readPageMetres on "${treeColumn}": ${JSON.stringify(res.tree.reads) === JSON.stringify(t.reads) && res.tree.unfound === t.unfound.length && res.tree.small === t.small.length}`);
for (const label of Object.keys(per)) {
	const r = res[label];
	console.log(`\n${label}: windows ${r.reads.length}; unfound boxes [${r.unfound}]; small boxes [${r.small}]; signatures stated ${r.reads.filter((q) => q.lab !== null && q.lab !== undefined && q.lab !== '').length}`);
	for (const i of res.voice) {
		const rows = r.reads.filter((q) => q.box === i);
		console.log(`  box ${i}: ${r.unfound.includes(i) ? 'unfound' : r.small.includes(i) ? 'small, not read' : rows.map((q) => `${q.kind}@${q.x0}-${q.x1} ${q.lab ?? '-'}${q.why ? ' (' + q.why + ')' : ''}${q.courtesy ? ' courtesy' : ''}`).join('; ') || 'no windows'}`);
	}
}
fs.writeFileSync(`${W}/step2-song3-metre.json`, JSON.stringify(res));
await browser.close();
