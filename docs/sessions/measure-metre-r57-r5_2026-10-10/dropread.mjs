// Row 57 r5: read each song the way the drop box does, on the dev server, keeping each page's homr output.
// The app's own pieces run in the page: rasterizePdf (400 dpi), makeReader with the app's path choice and
// homr-web's createRecognizer, and joinLookingAtPages (decodeRegionInBrowser). The only addition is a wrapper
// round the recognizer that keeps what each page answered. Nothing in apps/ changes.
// Usage: node dropread.mjs <out dir> <song.pdf> ...
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
const require = createRequire(path.resolve(process.env.HOME, 'Desktop/ilya-rewrite/apps/web/package.json'));
const { chromium } = require('@playwright/test');

const [out, ...pdfs] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-unsafe-webgpu'] });
for (const pdf of pdfs) {
	const song = path.basename(pdf, '.pdf');
	const t0 = Date.now();
	const ctx = await browser.newContext();
	const page = await ctx.newPage();
	const logs = [];
	page.on('console', (m) => { if (/\[omr\]/.test(m.text())) logs.push(m.text()); });
	await page.route('**/__r57__/song.pdf', (r) => r.fulfill({ path: pdf, contentType: 'application/pdf' }));
	await page.goto('http://localhost:5173/');
	const res = await page.evaluate(async () => {
		const bytes = await (await fetch('/__r57__/song.pdf')).arrayBuffer();
		const file = new File([bytes], 'song.pdf', { type: 'application/pdf' });
		const { rasterizePdf } = await import('/src/lib/reader/page-pdf.ts');
		const hr = await import('/src/lib/omr/homr-reader.ts');
		const pc = await import('/src/lib/omr/path-choice.ts');
		const st = await import('/src/lib/omr/stamp.ts');
		const hw = await import('/@id/homr-web');
		const inks = await rasterizePdf(file);
		const images = inks.map((ink) => new Blob([ink], { type: 'image/png' }));
		const sizes = [];
		for (const b of images) { const bm = await createImageBitmap(b); sizes.push([bm.width, bm.height]); bm.close(); }
		const answers = [];
		let call = 0;
		const reader = hr.makeReader({
			choose: () => pc.choosePathFor(navigator.gpu),
			create: (prefer) => hw.createRecognizer({ baseUrl: hr.OMR_MODELS_BASE, model: st.OMR_MODEL, prefer, wasmPaths: hr.ORT_WASM_BASE }).then((rec) => new Proxy(rec, {
				get(t, k) {
					if (k === 'recognizePage') return async (img, opts) => {
						const r = await t.recognizePage(img, opts);
						answers.push({ image: call++ % images.length, ok: r.ok, error: r.ok ? null : r.error, staves: Array.isArray(r.staves) ? r.staves.length : null, musicXml: r.ok ? r.musicXml : null, backend: t.backend });
						return r;
					};
					const v = t[k]; return typeof v === 'function' ? v.bind(t) : v;
				},
			})),
			decode: hr.decodeRegionInBrowser,
		});
		const r = await reader.read(images);
		return { result: r, sizes, answers, version: hw.HOMR_VERSION, stamp: st.READER_STAMP };
	});
	res.minutes = (Date.now() - t0) / 60000;
	res.logs = logs;
	fs.writeFileSync(path.join(out, song + '.json'), JSON.stringify(res));
	console.log(song, res.result.ok ? 'ok' : res.result.error, res.result.backend, 'pages', res.result.pagesRead, '/', res.result.pages, res.version, res.minutes.toFixed(2), 'min');
	await ctx.close();
}
await browser.close();
