// Steps 1 and 2: the inputs for each swept page, in the work folder. Rasterizes the page with the tree's rasterizePdf,
// saves <name>.png and <name>.gray (the red channel, as the workers read it) and <name>.dim.json, runs homr on it
// (WASM), and saves <name>.homr.json (boxes) and step0e-<name>.homrfull.json (with the MusicXML voiceBoxes needs).
// A saved raster is never replaced: the fresh bytes and boxes are compared with it and the answers printed.
// Needs the dev server on :5173. usage: node step2-pages.mjs <workdir> <name> [<name> ...]
// where <name> is song<n>-p<page>, withoutsun-p<page>, or nightingale-p<page>.
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire('/Users/dannmitton/Desktop/ilya-rewrite/apps/web/package.json');
const { chromium } = require('@playwright/test');
const [W, ...names] = process.argv.slice(2);
const DL = process.env.HOME + '/Downloads/';
const pdfOf = (n) => {
	const [stem, p] = n.split('-p');
	const file = stem.startsWith('song') ? `${DL}_colleague-pages/run-2026-10-19/songs/${stem}.pdf`
		: stem === 'withoutsun' ? `${DL}IMSLP113877-PMLP232488-Mussorgsky_-_Without_Sun.pdf`
		: `${DL}IMSLP952372-PMLP60466-Nightingale.pdf`;
	return { file, page: Number(p) };
};
let current = null;
const browser = await chromium.launch();
const ctx = await browser.newContext({ serviceWorkers: 'block' });
await ctx.route('**/__m/p.png**', (r) => r.fulfill({ body: fs.readFileSync(`${W}/${current}.png`), contentType: 'image/png' }));
await ctx.route('**/__m/in.pdf**', (r) => r.fulfill({ body: fs.readFileSync(pdfOf(current).file), contentType: 'application/pdf' }));
const page = await ctx.newPage();
await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(3000);
for (const name of names) {
	current = name;
	const had = fs.existsSync(`${W}/${name}.png`);
	const b64 = await page.evaluate(async ({ name, pageNo }) => {
		const { rasterizePdf } = await import('/src/lib/reader/page-pdf.ts');
		const bytes = await (await fetch('/__m/in.pdf?' + name)).arrayBuffer();
		const pages = await rasterizePdf(new File([bytes], 'in.pdf', { type: 'application/pdf' }), pageNo, (_i, n) => n === pageNo);
		const png = new Uint8Array(pages[pages.length - 1]);
		let s = ''; for (let i = 0; i < png.length; i += 0x8000) s += String.fromCharCode(...png.subarray(i, i + 0x8000));
		return btoa(s);
	}, { name, pageNo: pdfOf(name).page });
	const fresh = Buffer.from(b64, 'base64');
	const same = had ? fresh.equals(fs.readFileSync(`${W}/${name}.png`)) : null;
	if (!had) fs.writeFileSync(`${W}/${name}.png`, fresh);
	const res = await page.evaluate(async (name) => {
		const saved = await (await fetch('/__m/p.png?' + name)).arrayBuffer();
		const bmp = await createImageBitmap(new Blob([saved], { type: 'image/png' }));
		const c = new OffscreenCanvas(bmp.width, bmp.height);
		const x = c.getContext('2d'); x.drawImage(bmp, 0, 0);
		const rgba = x.getImageData(0, 0, c.width, c.height).data;
		const g = new Uint8Array(c.width * c.height);
		for (let i = 0; i < g.length; i++) g[i] = rgba[i * 4];
		let s = ''; for (let i = 0; i < g.length; i += 0x8000) s += String.fromCharCode(...g.subarray(i, i + 0x8000));
		window.__rec ??= await (async () => {
			const { OMR_MODEL } = await import('/src/lib/omr/stamp.ts');
			const { OMR_MODELS_BASE, ORT_WASM_BASE } = await import('/src/lib/omr/homr-reader.ts');
			const { createRecognizer } = await import('/@id/homr-web');
			return createRecognizer({ baseUrl: OMR_MODELS_BASE, model: OMR_MODEL, prefer: 'wasm', wasmPaths: ORT_WASM_BASE });
		})();
		const r = await window.__rec.recognizePage(new Blob([saved], { type: 'image/png' }), { ocr: false });
		return { w: c.width, h: c.height, gray: btoa(s), r };
	}, name);
	const gray = Buffer.from(res.gray, 'base64');
	const hadGray = fs.existsSync(`${W}/${name}.gray`);
	const graySame = hadGray ? gray.equals(fs.readFileSync(`${W}/${name}.gray`)) : null;
	if (!hadGray) {
		fs.writeFileSync(`${W}/${name}.gray`, gray);
		fs.writeFileSync(`${W}/${name}.dim.json`, JSON.stringify({ w: res.w, h: res.h }));
	}
	const boxes = res.r.staves ?? [];
	const hadHomr = fs.existsSync(`${W}/${name}.homr.json`);
	const boxSame = hadHomr ? JSON.stringify(boxes) === JSON.stringify(JSON.parse(fs.readFileSync(`${W}/${name}.homr.json`, 'utf8')).staves ?? []) : null;
	if (!hadHomr) fs.writeFileSync(`${W}/${name}.homr.json`, JSON.stringify({ ok: res.r.ok, error: res.r.error, staves: boxes, backend: 'wasm' }, null, 1));
	fs.writeFileSync(`${W}/step0e-${name}.homrfull.json`, JSON.stringify(res.r, null, 1));
	const say = (v) => (v === null ? 'new' : v);
	console.log(`${name}: ${res.w}x${res.h}; raster equals saved ${say(same)}; gray equals saved ${say(graySame)}; homr ok ${res.r.ok}${res.r.error ? ' (' + res.r.error + ')' : ''}, boxes ${boxes.length}, equal to saved ${say(boxSame)}`);
}
await browser.close();
