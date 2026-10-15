// N.135 stage 1, 4.5: does each Tesseract reader load through the real tesseract.js createWorker (7.0.0, its browser bundle) in headless Chrome, which core does it pick, how long, how many bytes?
// A scratch static server (this script) serves the package's own dist/ and tesseract.js-core files and each model from ~/Downloads/_desk-n135/models; nothing is served from the tree but node_modules.
// Usage: node chrome-load.mjs  -> chrome-load.json, printed lines
import { createRequire } from 'module'; import fs from 'fs'; import path from 'path'; import http from 'http';
const HOME = process.env.HOME, REPO = `${HOME}/Desktop/ilya-rewrite`; const here = path.dirname(new URL(import.meta.url).pathname);
const require = createRequire(path.resolve(REPO, 'apps/web/package.json')); const { chromium } = require('@playwright/test');
const P = `${REPO}/node_modules/.pnpm`, TJS = `${P}/tesseract.js@7.0.0/node_modules/tesseract.js/dist`, CORE = `${P}/tesseract.js-core@7.0.0/node_modules/tesseract.js-core`, M = `${HOME}/Downloads/_desk-n135/models`, CR = `${HOME}/Downloads/_desk-n135/crops2`;
const routes = { '/lib/': TJS, '/core/': CORE, '/lang/a/': `${M}/a`, '/lang/c/': `${M}/c`, '/lang/e/': `${M}/eng`, '/crops/': CR };
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
const browser = await chromium.launch({ channel: 'chrome', headless: true }); const results = [];
const samples = ['U1-1-s1-r1.png', 'B01-1-s1-r1.png', 'U6-2-s1-r1.png'].filter((f) => fs.existsSync(`${CR}/${f}`));
const cases = [
	{ name: '(a) rus 4.0.0_best_int, gz as the app fetches it', lang: 'rus', dir: 'a', gzip: true },
	{ name: '(c) Cyrillic best (float), uncompressed', lang: 'Cyrillic', dir: 'c', gzip: false },
	{ name: '(c) Cyrillic best (float), gzip', lang: 'Cyrillic', dir: 'c', gzip: true },
	{ name: '(e) eng (Homebrew 5.5.3 file), uncompressed', lang: 'eng', dir: 'e', gzip: false }
];
for (const c of cases) {
	const page = await (await browser.newContext()).newPage(); const reqs = []; const msgs = [];
	page.on('request', (r) => { if (/tesseract-core|traineddata/.test(r.url())) reqs.push(r.url().replace(base, '')); });
	page.on('console', (m) => msgs.push(m.type() + ': ' + m.text().slice(0, 200))); page.on('pageerror', (e) => msgs.push('pageerror: ' + String(e).slice(0, 300)));
	for (const k of Object.keys(served)) delete served[k];
	await page.goto(`${base}/index.html`);
	const r = await page.evaluate(async ({ base, c, samples }) => {
		const out = { init: null, error: null, rows: [] }; const t0 = performance.now();
		try {
			const worker = await Tesseract.createWorker([c.lang], 1, { workerPath: `${base}/lib/worker.min.js`, corePath: `${base}/core`, langPath: `${base}/lang/${c.dir}`, gzip: c.gzip, cacheMethod: 'none', workerBlobURL: false });
			await worker.setParameters({ tessedit_pageseg_mode: '7', preserve_interword_spaces: '1' }); out.init = (performance.now() - t0) / 1000;
			for (const s of samples) { const t1 = performance.now(); const { data } = await worker.recognize(`${base}/crops/${s}`); out.rows.push({ s, seconds: (performance.now() - t1) / 1000, text: data.text.trim().slice(0, 100) }); }
			await worker.terminate();
		} catch (e) { out.error = String(e && e.message || e).slice(0, 400); }
		return out;
	}, { base, c, samples });
	results.push({ case: c.name, ...r, requested: reqs, bytes: { ...served }, console: msgs.slice(0, 6) });
	console.log(c.name, r.error ? 'FAILED: ' + r.error : `loaded in ${r.init?.toFixed(1)} s`, '| core:', reqs.filter((x) => x.includes('core')).join(','), '| model:', reqs.filter((x) => x.includes('traineddata')).join(','));
	await page.context().close();
}
fs.writeFileSync(`${here}/chrome-load.json`, JSON.stringify(results, null, 1)); await browser.close(); server.close();
