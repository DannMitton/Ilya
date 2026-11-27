// Step 0c, browser half. Page 4's saved raster (step 0a) through the tree's own modules:
// homr's MusicXML and boxes (needs the dev server on :5173), and hasStaves / routePdf.
// usage: node step0c-browser.mjs <p4.png> <score.pdf> <outPrefix>
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire('/Users/dannmitton/Desktop/ilya-rewrite/apps/web/package.json');
const { chromium } = require('@playwright/test');
const [png, pdf, out] = process.argv.slice(2);
const browser = await chromium.launch();
const ctx = await browser.newContext({ serviceWorkers: 'block' });
await ctx.route('**/__m/p4.png', (r) => r.fulfill({ body: fs.readFileSync(png), contentType: 'image/png' }));
await ctx.route('**/__m/in.pdf', (r) => r.fulfill({ body: fs.readFileSync(pdf), contentType: 'application/pdf' }));
const page = await ctx.newPage();
await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(3000);

// hasStaves: the tree's function, on every page's raster as rasterizePdf makes it; then routePdf's own answer.
const staves = await page.evaluate(async () => {
	const { rasterizePdf } = await import('/src/lib/reader/page-pdf.ts');
	const { hasStaves, detectStavesLight } = await import('/src/lib/reader/staff-detect.ts');
	const { routePdf } = await import('/src/lib/score/ingestion/first-staved-page.ts');
	const bytes = await (await fetch('/__m/in.pdf')).arrayBuffer();
	const file = new File([bytes], 'in.pdf', { type: 'application/pdf' });
	const inks = await rasterizePdf(file, 6);
	inks.push(await (await fetch('/__m/p4.png')).arrayBuffer());
	const per = [];
	for (let i = 0; i < inks.length; i++) {
		const bmp = await createImageBitmap(new Blob([inks[i]], { type: 'image/png' }));
		const c = new OffscreenCanvas(bmp.width, bmp.height);
		const x = c.getContext('2d', { willReadFrequently: true });
		x.drawImage(bmp, 0, 0);
		const { data, width, height } = x.getImageData(0, 0, c.width, c.height);
		const same = i === 3 ? new Uint8Array(inks[3]).every((v, k) => v === new Uint8Array(inks[6])[k]) : undefined;
		// the quantity detectStavesLight gates on (rows over 0.4 ink at < 128), counted beside its answer
		let over = 0, max = 0;
		for (let y = 0; y < height; y++) {
			let d = 0;
			for (let xx = 0; xx < width; xx++) if (data[(y * width + xx) * 4] < 128) d++;
			const f = d / width;
			if (f > max) max = f;
			if (f > 0.4) over++;
		}
		per.push({ page: i < 6 ? i + 1 : 'saved p4 png', width, height, hasStaves: await hasStaves(inks[i]), light: detectStavesLight(data, width, height), rowsOverGate: over, maxRowFrac: +max.toFixed(3), sameBytesAsSaved: same });
		bmp.close();
	}
	const r = await routePdf(file);
	return { per, route: r && r.route };
});
console.log(JSON.stringify(staves, null, 1));
fs.writeFileSync(out + '.hasstaves.json', JSON.stringify(staves, null, 1));

if (!fs.existsSync(out + '.homrfull.json')) {
	const res = await page.evaluate(async () => {
		const { OMR_MODEL } = await import('/src/lib/omr/stamp.ts');
		const { OMR_MODELS_BASE, ORT_WASM_BASE } = await import('/src/lib/omr/homr-reader.ts');
		const { createRecognizer } = await import('/@id/homr-web');
		const rec = await createRecognizer({ baseUrl: OMR_MODELS_BASE, model: OMR_MODEL, prefer: 'wasm', wasmPaths: ORT_WASM_BASE });
		const blob = new Blob([await (await fetch('/__m/p4.png')).arrayBuffer()], { type: 'image/png' });
		const r = await rec.recognizePage(blob, { ocr: false });
		await rec.dispose();
		return r;
	});
	fs.writeFileSync(out + '.homrfull.json', JSON.stringify(res, null, 1));
	console.log('homr keys', Object.keys(res), res.ok, res.staves?.length);
}
await browser.close();
