// Step 0c, metre reader on page 4: the tree's bandOf, placesOf, readWindow, decide, uncovered, and cutRatio,
// unchanged, in the browser with the shipped network, over the staves step0c-staves.mts wrote.
// Also the tree's readPageMetres as shipped, for the "before". Needs the dev server on :5173.
// usage: node step0c-metre.mjs <workdir>
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire('/Users/dannmitton/Desktop/ilya-rewrite/apps/web/package.json');
const { chromium } = require('@playwright/test');
const D = process.argv[2] + '/';
const browser = await chromium.launch();
const ctx = await browser.newContext({ serviceWorkers: 'block' });
await ctx.route('**/__m/p4.png', (r) => r.fulfill({ body: fs.readFileSync(D + 'nightingale-p4.png'), contentType: 'image/png' }));
const page = await ctx.newPage();
await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(3000);
const homr = JSON.parse(fs.readFileSync(D + 'step0c-p4.homrfull.json', 'utf8'));
const staves = JSON.parse(fs.readFileSync(D + 'step0c-p4.staves.json', 'utf8'));
const res = await page.evaluate(async ({ musicXml, boxes, staves }) => {
	const R = await import('/src/lib/omr/metre-reader.ts');
	const W = await import('/src/lib/omr/metre-windows.ts');
	const M = await import('/src/lib/omr/metre-model.ts');
	const bmp = await createImageBitmap(await (await fetch('/__m/p4.png')).blob());
	const c = new OffscreenCanvas(bmp.width, bmp.height);
	const x = c.getContext('2d'); x.drawImage(bmp, 0, 0);
	const rgba = x.getImageData(0, 0, c.width, c.height).data;
	const data = new Uint8Array(c.width * c.height);
	for (let i = 0; i < data.length; i++) data[i] = rgba[i * 4];
	const pg = { width: c.width, height: c.height, data };
	const net = await M.loadMetreNet();
	const shipped = await M.readPageMetres(pg, musicXml, boxes, net);
	const b64 = (u) => { let s = ''; for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode(...u.subarray(i, i + 0x8000)); return btoa(s); };
	const voice = M.voiceBoxes(musicXml, boxes, pg.height);
	const reads = [];
	const bands = {};
	for (const s of staves) {
		if (!s.st || !voice.includes(s.box)) continue;
		const { band, y0, k } = W.bandOf(pg, s.st);
		for (const [wi, win] of s.windows.entries()) {
			const w = { ...win, staff: s.st };
			const { xs, seats, lines } = W.placesOf(w, y0, k);
			if (!xs.length) continue;
			const readings = await R.readWindow(band, xs, seats, net.classify);
			const verdict = R.decide(readings, band, lines, M.METRE_SETTINGS, net.ref);
			const stated = readings.map((r) => R.state(R.candidates(r), M.METRE_SETTINGS.cut, M.METRE_SETTINGS.centre));
			const plain = stated[R.PLAIN];
			const e = { box: s.box, wi, kind: w.kind, x0: w.x0, x1: w.x1, verdict, courtesy: W.isCourtesyPlace(w), statedLabs: stated.map((g) => g?.lab ?? null) };
			if (plain) {
				const r = readings[R.PLAIN];
				const num = plain.lab !== 'C' && plain.lab !== 'cut';
				e.plain = { lab: plain.lab, marks: plain.marks, xs: r.xs };
				if (num) {
					e.uncovered = R.uncovered(band, lines, r.xs, plain.marks);
					e.uncoveredVoid = R.uncoveredVoid(e.uncovered, M.METRE_SETTINGS.tau);
				}
				// every plain mark's cutRatio, whatever it is: decide() itself calls it only for C and cut C
				e.cutRatio = plain.marks.map((m) => R.cutRatio(band, lines, r.xs, m));
			}
			if (wi === 0) bands[s.box] = { width: band.width, height: band.height, y0, k, data: b64(band.data), lines: Array.from({ length: Math.ceil(band.width / 10) }, (_, i) => lines(i)) };
			reads.push(e);
		}
	}
	return { shipped: { reads: shipped.reads.length, unfound: shipped.unfound, small: shipped.small }, voice, reads, bands, settings: M.METRE_SETTINGS };
}, { musicXml: homr.musicXml, boxes: homr.staves, staves });
fs.writeFileSync(D + 'step0c-p4.metre.json', JSON.stringify(res));
console.log('shipped readPageMetres:', JSON.stringify(res.shipped), 'voice boxes', res.voice.length);
console.log('windows read at the candidate staves:', res.reads.length);
for (const r of res.reads) if (r.plain || r.verdict.lab) console.log(`box ${r.box} win ${r.wi} ${r.kind} x ${r.x0}-${r.x1}: ${r.verdict.lab ?? 'nothing (' + r.verdict.why + ')'} plain ${r.plain?.lab} uncovered ${JSON.stringify(r.uncovered)} void ${r.uncoveredVoid} cutRatio ${r.cutRatio?.map((v) => v.toFixed(3))}`);
for (const r of res.reads) if (r.wi === 0 && !r.plain && !r.verdict.lab) console.log(`box ${r.box} start: nothing (${r.verdict.why}) readings ${r.statedLabs.join(' ')}`);
await browser.close();
