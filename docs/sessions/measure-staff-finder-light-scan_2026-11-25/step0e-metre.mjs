// Step 0e, second half, browser: readPageMetres on the seven control pages before and after. The tree's
// readPageMetres cannot be handed a level, so its loop (metre-model.ts) is repeated here over the staves and windows
// step0e-staves.mts wrote, with the tree's voiceBoxes, bandOf, placesOf, readWindow, decide, and isCourtesyPlace and
// the shipped network. The repeated loop's "before" is checked window for window against the tree's own
// readPageMetres. Needs the dev server on :5173. usage: node step0e-metre.mjs <workdir>
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire('/Users/dannmitton/Desktop/ilya-rewrite/apps/web/package.json');
const { chromium } = require('@playwright/test');
const D = process.argv[2] + '/';
const staves = JSON.parse(fs.readFileSync(D + 'step0e-staves.json', 'utf8'));
let current = null;
const browser = await chromium.launch();
const ctx = await browser.newContext({ serviceWorkers: 'block' });
await ctx.route('**/__m/p.png**', (r) => r.fulfill({ body: fs.readFileSync(D + current + '.png'), contentType: 'image/png' }));
const page = await ctx.newPage();
await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(3000);
const result = {};
for (const name of Object.keys(staves)) {
	current = name;
	const homr = JSON.parse(fs.readFileSync(D + `step0e-${name}.homrfull.json`, 'utf8'));
	result[name] = await page.evaluate(async ({ name, musicXml, boxes, per }) => {
		const R = await import('/src/lib/omr/metre-reader.ts');
		const W = await import('/src/lib/omr/metre-windows.ts');
		const M = await import('/src/lib/omr/metre-model.ts');
		const bmp = await createImageBitmap(await (await fetch('/__m/p.png?' + name)).blob());
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
		for (const label of ['before', 'after']) {
			const reads = []; let unfound = 0, small = 0; const found = [];
			for (const i of voice) { const s = per[label][i]; if (s.st) found.push([i, s]); else unfound++; }
			const usual = found.map(([, s]) => s.st.space).sort((a, b) => a - b)[Math.floor(found.length / 2)] ?? 0;
			for (const [, s] of found) {
				if (s.st.space < 0.8 * usual) { small++; continue; }
				const { band, y0, k } = W.bandOf(pg, s.st);
				for (const win of s.windows) {
					const w = { ...win, staff: s.st };
					const { xs, seats, lines } = W.placesOf(w, y0, k);
					if (xs.length === 0) continue;
					const readings = await R.readWindow(band, xs, seats, net.classify);
					reads.push(row({ window: w, verdict: R.decide(readings, band, lines, M.METRE_SETTINGS, net.ref), courtesy: W.isCourtesyPlace(w) }));
				}
			}
			out[label] = { reads, unfound, small, space: usual };
		}
		return out;
	}, { name, musicXml: homr.musicXml, boxes: homr.staves, per: staves[name] });
	const r = result[name];
	console.log(`${name}: voice boxes ${r.voice.join(',')}; repeated loop equals the tree's readPageMetres at shipped constants: ${JSON.stringify(r.tree) === JSON.stringify({ reads: r.before.reads, unfound: r.before.unfound, small: r.before.small })}`);
}
fs.writeFileSync(D + 'step0e-metre.json', JSON.stringify(result));
await browser.close();
