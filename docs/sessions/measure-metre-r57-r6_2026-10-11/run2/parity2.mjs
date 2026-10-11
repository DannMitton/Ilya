// Row 57 r6 run 2, parity part 2: the app's own path. For each page of the 16 songs, the page image homr read
// (kept by the "before" read), homr's staff boxes and MusicXML for that page, and the app's metre-model.ts
// readPageMetres: voice staves from homr's first part, staff lines and bar lines found in the ink, windows, the
// network on WebAssembly. Every window's place and statement is written out; matching to the Python reader's
// windows is done in match2.py. Nothing in apps/ is changed by this script.
// Usage: node parity2.mjs <out.json> [song ...]
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
const require = createRequire(path.resolve(process.env.HOME, 'Desktop/ilya-rewrite/apps/web/package.json'));
const { chromium } = require('@playwright/test');
const R = path.resolve(process.env.HOME, 'Downloads/_code-metre-r6/before');
const [out, ...only] = process.argv.slice(2);
const SONGS = only.length ? only : ['tch', 'sun1', 'sun4', 'sun5', 'sun6', 'k01', 'k02', 'k03', 'k04', 'k06', 'k07', 'k08', 'k09', 'k10', 'gur', 'varl'];
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await (await browser.newContext({ serviceWorkers: 'block' })).newPage();
page.on('console', (m) => { if (m.type() === 'error') console.log('console:', m.text()); });
await page.route('**/__r57q__/**', (r) => r.fulfill({ path: path.join(R, 'pages', decodeURIComponent(new URL(r.request().url()).pathname.split('/__r57q__/')[1])) }));
async function ready() {
	await page.goto('http://localhost:5173/');
	await page.waitForLoadState('networkidle');
	await page.waitForTimeout(2000);
	await page.evaluate(async () => {
		const mm = await import('/src/lib/omr/metre-model.ts');
		window.__net = await mm.loadMetreNet();
	});
}
await ready();
const all = {};
for (const song of SONGS) {
	const read = JSON.parse(fs.readFileSync(path.join(R, song + '.json'), 'utf8'));
	const pages = read.answers.filter((a) => a.ok).map((a) => ({ image: a.image, staves: a.staves, xml: a.musicXml }));
	const t0 = Date.now();
	let tries = 0;
	for (;;) { try {
	all[song] = await page.evaluate(async ({ song, pages }) => {
		const mm = await import('/src/lib/omr/metre-model.ts');
		const out = [];
		for (const p of pages) {
			const bm = await createImageBitmap(await (await fetch(`/__r57q__/${song}-${p.image + 1}.png`)).blob());
			const c = new OffscreenCanvas(bm.width, bm.height);
			const ctx = c.getContext('2d');
			ctx.drawImage(bm, 0, 0);
			const rgba = ctx.getImageData(0, 0, bm.width, bm.height).data;
			const data = new Uint8Array(bm.width * bm.height);
			for (let i = 0; i < data.length; i++) data[i] = rgba[i * 4];
			const grey = { width: bm.width, height: bm.height, data };
			const t = performance.now();
			const { reads, unfound, small } = await mm.readPageMetres(grey, p.xml, p.staves, window.__net);
			out.push({
				image: p.image, width: bm.width, height: bm.height, unfound, small, ms: performance.now() - t,
				voice: mm.voiceBoxes(p.xml, p.staves, bm.height),
				windows: reads.map((r) => ({
					box: r.window.box, kind: r.window.kind, x0: r.window.x0, x1: r.window.x1, space: r.window.staff.space,
					top: r.window.staff.ls.length ? undefined : null,
					lines: (() => { const s = r.window.staff; const x = r.window.x0; const i = s.xs.findIndex((v) => v >= x); const k = i < 0 ? s.xs.length - 1 : i; return s.ls[k]; })(),
					staffX0: r.window.staff.x0, staffX1: r.window.staff.x1,
					lab: r.verdict.lab, why: r.verdict.lab ? null : r.verdict.why, courtesy: r.courtesy,
				})),
			});
		}
		return out;
	}, { song, pages });
	break; } catch (e) { if (++tries > 2) throw e; console.log('retry', song, String(e).slice(0, 80)); await ready(); } }
	const n = all[song].reduce((t, p) => t + p.windows.length, 0);
	const ms = all[song].reduce((t, p) => t + p.ms, 0);
	console.log(song, 'pages', all[song].length, 'windows', n, 'stated', all[song].flatMap((p) => p.windows).filter((w) => w.lab).map((w) => w.lab).join(' '),
		'unfound', all[song].reduce((t, p) => t + p.unfound, 0), 'small', all[song].reduce((t, p) => t + p.small, 0), 'reader s', (ms / 1000).toFixed(1), 'wall min', ((Date.now() - t0) / 60000).toFixed(2));
	fs.writeFileSync(out, JSON.stringify(all));
}
await browser.close();
