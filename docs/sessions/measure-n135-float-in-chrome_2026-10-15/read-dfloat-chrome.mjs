// Desk, 2026-10-15 night: reader (dfloat), the float form of rus_prereform r2 (md5 2ff2af3e…), read through tesseract.js 7.0.0's
// real browser createWorker in headless Chromium 141 on the simd-lstm core (corePath naming the file), PSM 7, on stage 1's R2 crops.
// Writes ocr2/<L>-dfloat.json in ocr-rows.mjs's shape (page, system, row, text, words[text, conf, bbox in page pixels]).
// Usage: node read-dfloat-chrome.mjs <harness dir> <crops2 dir> <model dir>  [songs...]
import { createRequire } from 'module'; import fs from 'fs'; import path from 'path'; import http from 'http';
const HOME = process.env.HOME, REPO = `${HOME}/ilya-merge9`;
const require = createRequire(path.resolve(REPO, 'apps/web/package.json')); const { chromium } = require('@playwright/test');
const P = `${REPO}/node_modules/.pnpm`, TJS = `${P}/tesseract.js@7.0.0/node_modules/tesseract.js/dist`, CORE = `${P}/tesseract.js-core@7.0.0/node_modules/tesseract.js-core`;
const [H, CR, MD, ...songsArg] = process.argv.slice(2);
const SONGS = songsArg.length ? songsArg : ['U1', 'U4', 'U5', 'U6', 'P', 'B01', 'B02', 'B03', 'B04', 'B06', 'B07', 'B08', 'B09', 'B10', 'S', 'T', 'K', 'M'];
const routes = { '/lib/': TJS, '/core/': CORE, '/lang/': MD, '/crops/': CR };
const server = http.createServer((req, res) => {
	const u = decodeURIComponent(req.url.split('?')[0]);
	if (u === '/index.html') { res.setHeader('content-type', 'text/html'); return res.end('<!doctype html><script src="/lib/tesseract.min.js"></script><body>x'); }
	for (const [pre, dir] of Object.entries(routes)) if (u.startsWith(pre)) {
		const f = path.join(dir, u.slice(pre.length)); if (!fs.existsSync(f)) break;
		const b = fs.readFileSync(f); res.setHeader('access-control-allow-origin', '*');
		res.setHeader('content-type', f.endsWith('.js') ? 'application/javascript' : f.endsWith('.wasm') ? 'application/wasm' : f.endsWith('.png') ? 'image/png' : 'application/octet-stream'); return res.end(b);
	}
	res.statusCode = 404; res.end('no');
});
await new Promise((r) => server.listen(0, r)); const port = server.address().port, base = `http://localhost:${port}`;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', headless: true });
const page = await (await browser.newContext()).newPage(); const errs = [];
page.on('pageerror', (e) => errs.push(String(e).slice(0, 300)));
await page.goto(`${base}/index.html`);
const init = await page.evaluate(async ({ base }) => {
	const t0 = performance.now();
	window.W = await Tesseract.createWorker(['rus_prereform'], 1, { workerPath: `${base}/lib/worker.min.js`, corePath: `${base}/core/tesseract-core-simd-lstm.wasm.js`, langPath: `${base}/lang`, gzip: false, cacheMethod: 'none', workerBlobURL: false });
	await window.W.setParameters({ tessedit_pageseg_mode: '7', preserve_interword_spaces: '1' });
	return (performance.now() - t0) / 1000;
}, { base });
console.log('worker loaded on simd-lstm core in', init.toFixed(2), 's; chromium', browser.version());
for (const L of SONGS) {
	const rows = fs.readFileSync(`${H}/rows2/${L}.jsonl`, 'utf8').trim().split('\n').map((l) => JSON.parse(l));
	const t0 = Date.now(); const res = [];
	for (const r of rows) {
		const name = `${L}-${r.page}-s${r.system}-r${r.row}.png`;
		if (!fs.existsSync(`${CR}/${name}`)) { console.log('MISSING crop', name); res.push({ page: r.page, system: r.system, row: r.row, text: '', words: [] }); continue; }
		const out = await page.evaluate(async ({ base, name }) => {
			try {
				const { data } = await window.W.recognize(`${base}/crops/${name}`, {}, { blocks: true });
				const words = [];
				for (const b of data.blocks ?? []) for (const p of b.paragraphs) for (const l of p.lines) for (const w of l.words) words.push({ text: w.text, conf: Math.round(w.confidence), bbox: [w.bbox.x0, w.bbox.y0, w.bbox.x1, w.bbox.y1] });
				return { text: data.text.trim(), words };
			} catch (e) { return { text: '', words: [], error: String(e && e.message || e).slice(0, 200) }; }
		}, { base, name });
		if (out.error) console.log('  row error', name, out.error);
		res.push({ page: r.page, system: r.system, row: r.row, text: out.text, words: out.words.map((w) => ({ text: w.text, conf: w.conf, bbox: [w.bbox[0] + r.x0, w.bbox[1] + r.y0, w.bbox[2] + r.x0, w.bbox[3] + r.y0] })) });
	}
	const secs = (Date.now() - t0) / 1000;
	fs.writeFileSync(`${H}/ocr2/${L}-dfloat.json`, JSON.stringify(res));
	fs.writeFileSync(`${H}/ocr2/${L}-dfloat.time.json`, JSON.stringify({ seconds: secs, rows: rows.length, core: 'tesseract-core-simd-lstm (Chromium 141, headless)' }));
	console.log(L, rows.length, 'rows', secs.toFixed(1), 's');
}
if (errs.length) console.log('page errors:', errs.slice(0, 5));
await page.evaluate(() => window.W.terminate()); await browser.close(); server.close();
