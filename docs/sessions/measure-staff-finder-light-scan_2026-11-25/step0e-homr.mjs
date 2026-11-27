// Step 0e needs homr's MusicXML for the control pages, which step 0a's harness did not keep. For each page named:
// rasterize it again with the tree's rasterizePdf, say whether the bytes equal the saved raster's, run homr on the
// saved raster, say whether its boxes equal the saved ones, and write step0e-<name>.homrfull.json.
// Needs the dev server on :5173. usage: node step0e-homr.mjs <workdir> <name> [<name> ...]
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
	const res = await page.evaluate(async ({ name, pageNo }) => {
		const { rasterizePdf } = await import('/src/lib/reader/page-pdf.ts');
		const bytes = await (await fetch('/__m/in.pdf?' + name)).arrayBuffer();
		const pages = await rasterizePdf(new File([bytes], 'in.pdf', { type: 'application/pdf' }), pageNo, (_i, n) => n === pageNo);
		const fresh = new Uint8Array(pages[pages.length - 1]);
		const saved = new Uint8Array(await (await fetch('/__m/p.png?' + name)).arrayBuffer());
		const same = fresh.length === saved.length && fresh.every((v, i) => v === saved[i]);
		window.__rec ??= await (async () => {
			const { OMR_MODEL } = await import('/src/lib/omr/stamp.ts');
			const { OMR_MODELS_BASE, ORT_WASM_BASE } = await import('/src/lib/omr/homr-reader.ts');
			const { createRecognizer } = await import('/@id/homr-web');
			return createRecognizer({ baseUrl: OMR_MODELS_BASE, model: OMR_MODEL, prefer: 'wasm', wasmPaths: ORT_WASM_BASE });
		})();
		const r = await window.__rec.recognizePage(new Blob([saved], { type: 'image/png' }), { ocr: false });
		return { same, r };
	}, { name, pageNo: pdfOf(name).page });
	fs.writeFileSync(`${W}/step0e-${name}.homrfull.json`, JSON.stringify(res.r, null, 1));
	const savedBoxes = JSON.parse(fs.readFileSync(`${W}/${name}.homr.json`, 'utf8')).staves;
	console.log(`${name}: fresh raster equals saved bytes ${res.same}; homr ok ${res.r.ok}, boxes ${res.r.staves?.length}, equal to saved ${JSON.stringify(res.r.staves) === JSON.stringify(savedBoxes)}`);
}
await browser.close();
