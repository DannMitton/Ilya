// Row 57 r6 run 2, parity part 1: the TypeScript reader on the Python reader's own inputs.
// For every window of the 16 songs, the band and staff lines the Python reader used are handed to the app's
// metre-reader.ts in the browser (dev server, onnxruntime-web on WebAssembly), and its statement is compared
// with the Python reader's. Nothing in apps/ is changed by this script.
// Usage: node parity.mjs <out.json>
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
const require = createRequire(path.resolve(process.env.HOME, 'Desktop/ilya-rewrite/apps/web/package.json'));
const { chromium } = require('@playwright/test');
const P = path.resolve(process.env.HOME, 'Downloads/_code-metre-r6/parity');
const out = process.argv[2];
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await (await browser.newContext({ serviceWorkers: 'block' })).newPage();
page.on('console', (m) => { if (m.type() === 'error') console.log('console:', m.text()); });
await page.route('**/__r57p__/**', (r) => {
	const name = decodeURIComponent(new URL(r.request().url()).pathname.split('/__r57p__/')[1]);
	r.fulfill({ path: path.join(P, name) });
});
await page.goto('http://localhost:5173/');
const t0 = Date.now();
const res = await page.evaluate(async () => {
	const mr = await import('/src/lib/omr/metre-reader.ts');
	const mw = await import('/src/lib/omr/metre-windows.ts');
	const mm = await import('/src/lib/omr/metre-model.ts');
	const net = await mm.loadMetreNet();
	const meta = await (await fetch('/__r57p__/windows.json')).json();
	const bands = new Map();
	const rows = [];
	const tStart = performance.now();
	for (const w of meta.windows) {
		const s = meta.staves[w.staff];
		if (!bands.has(w.staff)) bands.set(w.staff, new Uint8Array(await (await fetch(`/__r57p__/bands/${w.staff}.bin`)).arrayBuffer()));
		const band = { width: s.width, height: s.height, data: bands.get(w.staff) };
		const staff = { xs: s.xs, ls: s.ls, space: s.space, x0: 0, x1: 0 };
		const win = { staff, box: 0, kind: 'start', x0: w.x0, x1: w.x1 };
		// the Python window's own places: np.arange(x0, x1, 0.2 * space) / space * space * k / 10
		const n = Math.ceil((w.x1 - w.x0) / (0.2 * w.space));
		const xs = [];
		for (let i = 0; i < n; i++) xs.push(((w.x0 + i * 0.2 * w.space) / w.space) * w.space * s.k / 10);
		const lines = (x) => mw.linesAt(staff, (x * 10) / s.k).map((l) => (l - s.y0) * s.k);
		const t = performance.now();
		const readings = await mr.readWindow(band, xs, (x) => lines(x).slice(1, 4), net.classify);
		const v = mr.decide(readings, band, lines, mm.METRE_SETTINGS, net.ref);
		rows.push({ id: w.id, py: w.said, ts: v.lab, why: v.lab ? null : v.why, truth: w.truth, ms: performance.now() - t, places: xs.length,
			base: Array.from(readings[4].probs) });
	}
	return { rows, ms: performance.now() - tStart };
});
console.log('minutes', ((Date.now() - t0) / 60000).toFixed(2));
fs.writeFileSync(out, JSON.stringify(res));
const agree = res.rows.filter((r) => r.py === r.ts).length;
console.log('windows', res.rows.length, 'agree', agree);
for (const r of res.rows) if (r.py !== r.ts) console.log(r.id, 'python', r.py, 'ts', r.ts, r.why ?? '', 'truth', r.truth);
await browser.close();
