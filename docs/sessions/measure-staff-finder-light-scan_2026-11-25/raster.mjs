// Step 0a/0b raster: rasterize one PDF page with the app's own rasterizePdf, save the PNG,
// and (with --homr) run homr's recognizer on it and save its staff boxes.
// usage: node raster.mjs <pdf> <page> <outPrefix> [--homr]
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire('/Users/dannmitton/Desktop/ilya-rewrite/apps/web/package.json');
const { chromium } = require('@playwright/test');
const [pdf, pageStr, out, flag] = process.argv.slice(2);
const pageNo = Number(pageStr);
const browser = await chromium.launch();
const ctx = await browser.newContext();
await ctx.route('**/__pdf/in.pdf', (r) => r.fulfill({ body: fs.readFileSync(pdf), contentType: 'application/pdf' }));
const page = await ctx.newPage();
page.on('console', (m) => { const t = m.text(); if (!/BlurbComposer/.test(t)) console.error('[page]', t.slice(0, 200)); });
await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
await page.evaluate(async () => { for (const r of await navigator.serviceWorker?.getRegistrations?.() ?? []) await r.unregister(); });
const b64 = await page.evaluate(async ({ pageNo }) => {
	const { rasterizePdf } = await import('/src/lib/reader/page-pdf.ts');
	const bytes = await (await fetch('/__pdf/in.pdf')).arrayBuffer();
	const file = new File([bytes], 'in.pdf', { type: 'application/pdf' });
	const pages = await rasterizePdf(file, pageNo, (_i, n) => n === pageNo);
	const png = new Uint8Array(pages[pages.length - 1]);
	window.__png = png;
	let s = ''; for (let i = 0; i < png.length; i += 0x8000) s += String.fromCharCode(...png.subarray(i, i + 0x8000));
	return btoa(s);
}, { pageNo });
fs.writeFileSync(out + '.png', Buffer.from(b64, 'base64'));
console.log('wrote', out + '.png', fs.statSync(out + '.png').size);
if (flag === '--homr') {
	const res = await page.evaluate(async () => {
		const { OMR_MODEL } = await import('/src/lib/omr/stamp.ts');
		const { OMR_MODELS_BASE, ORT_WASM_BASE } = await import('/src/lib/omr/homr-reader.ts');
		const { createRecognizer } = await import('/@id/homr-web');
		const rec = await createRecognizer({ baseUrl: OMR_MODELS_BASE, model: OMR_MODEL, prefer: 'wasm', wasmPaths: ORT_WASM_BASE });
		const r = await rec.recognizePage(new Blob([window.__png], { type: 'image/png' }), { ocr: false });
		const o = { ok: r.ok, error: r.error, staves: r.staves, backend: rec.backend };
		await rec.dispose();
		return o;
	});
	fs.writeFileSync(out + '.homr.json', JSON.stringify(res, null, 1));
	console.log('homr', res.ok, res.error, Array.isArray(res.staves) ? res.staves.length + ' boxes' : res.staves, res.backend);
}
await browser.close();
