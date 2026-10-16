// Desk, 2026-10-15: does the float form of rus_prereform r2 (md5 2ff2af3e…) load in headless Chromium through
// tesseract.js 7.0.0's real browser createWorker when corePath names the SIMD core file (getCore.js:21-22
// takes a corePath ending in "js" as the file itself)? Cases: the directory (expect the relaxed core and an
// abort), the simd-lstm file, the plain lstm file. Output: float-in-chrome.json and printed lines.
import { createRequire } from 'module'; import fs from 'fs'; import path from 'path'; import http from 'http';
const HOME = process.env.HOME, REPO = `${HOME}/ilya-merge9`; const here = path.dirname(new URL(import.meta.url).pathname);
const require = createRequire(path.resolve(REPO, 'apps/web/package.json')); const { chromium } = require('@playwright/test');
const P = `${REPO}/node_modules/.pnpm`, TJS = `${P}/tesseract.js@7.0.0/node_modules/tesseract.js/dist`, CORE = `${P}/tesseract.js-core@7.0.0/node_modules/tesseract.js-core`;
const routes = { '/lib/': TJS, '/core/': CORE, '/lang/dfloat/': `${here}/lang/dfloat`, '/crops/': `${here}/crops` };
const served = {};
const server = http.createServer((req, res) => {
	const u = decodeURIComponent(req.url.split('?')[0]);
	if (u === '/index.html') { res.setHeader('content-type', 'text/html'); return res.end('<!doctype html><script src="/lib/tesseract.min.js"></script><body>x'); }
	for (const [pre, dir] of Object.entries(routes)) if (u.startsWith(pre)) {
		const f = path.join(dir, u.slice(pre.length)); if (!fs.existsSync(f)) break;
		const b = fs.readFileSync(f); served[u] = b.length; res.setHeader('access-control-allow-origin', '*');
		res.setHeader('content-type', f.endsWith('.js') ? 'application/javascript' : f.endsWith('.wasm') ? 'application/wasm' : f.endsWith('.png') ? 'image/png' : 'application/octet-stream'); return res.end(b);
	}
	res.statusCode = 404; res.end('no');
});
await new Promise((r) => server.listen(0, r)); const port = server.address().port, base = `http://localhost:${port}`;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', headless: true }); const results = [];
const samples = ['U1-1-s1-r1.png', 'B01-1-s1-r1.png', 'U6-2-s1-r1.png'];
const cases = [
	{ name: 'float, corePath = directory (tesseract.js picks)', corePath: `${base}/core` },
	{ name: 'float, corePath = tesseract-core-simd-lstm.wasm.js', corePath: `${base}/core/tesseract-core-simd-lstm.wasm.js` },
	{ name: 'float, corePath = tesseract-core-lstm.wasm.js (no SIMD)', corePath: `${base}/core/tesseract-core-lstm.wasm.js` }
];
console.log('chromium', browser.version());
for (const c of cases) {
	const page = await (await browser.newContext()).newPage(); const reqs = []; const msgs = [];
	page.on('request', (r) => { if (/tesseract-core|traineddata/.test(r.url())) reqs.push(r.url().replace(base, '')); });
	page.on('console', (m) => msgs.push(m.type() + ': ' + m.text().slice(0, 200))); page.on('pageerror', (e) => msgs.push('pageerror: ' + String(e).slice(0, 300)));
	for (const k of Object.keys(served)) delete served[k];
	await page.goto(`${base}/index.html`);
	const r = await Promise.race([page.evaluate(async ({ base, c, samples }) => {
		const out = { init: null, error: null, rows: [] }; const t0 = performance.now();
		try {
			const worker = await Tesseract.createWorker(['rus_prereform'], 1, { workerPath: `${base}/lib/worker.min.js`, corePath: c.corePath, langPath: `${base}/lang/dfloat`, gzip: false, cacheMethod: 'none', workerBlobURL: false });
			await worker.setParameters({ tessedit_pageseg_mode: '7', preserve_interword_spaces: '1' }); out.init = (performance.now() - t0) / 1000;
			for (const s of samples) { const t1 = performance.now(); const { data } = await worker.recognize(`${base}/crops/${s}`); out.rows.push({ s, seconds: (performance.now() - t1) / 1000, text: data.text.trim().slice(0, 100) }); }
			await worker.terminate();
		} catch (e) { out.error = String(e && e.message || e).slice(0, 400); }
		return out;
	}, { base, c, samples }), new Promise((res) => setTimeout(() => res({ init: null, error: 'TIMEOUT 120 s', rows: [] }), 120000))]);
	results.push({ case: c.name, ...r, requested: reqs, bytes: { ...served }, console: msgs.slice(0, 8) });
	console.log(c.name, '->', r.error ? 'FAILED: ' + r.error : `loaded in ${r.init?.toFixed(2)} s`, '| core:', reqs.filter((x) => x.includes('core')).join(','), '| model:', reqs.filter((x) => x.includes('traineddata')).join(','));
	for (const row of r.rows) console.log('   ', row.s, row.seconds.toFixed(2) + ' s', JSON.stringify(row.text));
	if (r.error) console.log('    console:', msgs.slice(0, 4).join(' || '));
	await page.context().close();
}
fs.writeFileSync(`${here}/float-in-chrome.json`, JSON.stringify(results, null, 1)); await browser.close(); server.close();
