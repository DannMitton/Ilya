// Row 80: Tesseract (tesseract.js 7, best_int data) on a page image or a crop of it; every word's box (in page pixels),
// text, confidence, and script by Unicode range (Cyrillic or Latin letters, whichever are more).
// Usage: node ocr.mjs <png> <out.json> <tessdata dir> <langs, e.g. rus+eng+fra> <psm> [x0 y0]   (x0 y0: the crop's place on the page)
import { createRequire } from 'module'; import fs from 'fs'; import path from 'path';
const require = createRequire(path.resolve(process.env.HOME, 'Desktop/ilya-rewrite/apps/web/package.json'));
const { createWorker } = require('tesseract.js');
const [png, out, tessdata, langs, psm, ox = '0', oy = '0'] = process.argv.slice(2);
const worker = await createWorker(langs.split('+'), 1, { langPath: tessdata, cachePath: tessdata, gzip: true });
await worker.setParameters({ tessedit_pageseg_mode: psm, preserve_interword_spaces: '1' });
const { data } = await worker.recognize(png, {}, { blocks: true });
const words = [];
for (const b of data.blocks ?? []) for (const p of b.paragraphs) for (const l of p.lines) for (const w of l.words) {
	const cyr = (w.text.match(/[Ѐ-ӿ]/g) ?? []).length;
	const lat = (w.text.match(/[A-Za-zÀ-ɏ]/g) ?? []).length;
	words.push({ text: w.text, conf: Math.round(w.confidence), bbox: [w.bbox.x0 + +ox, w.bbox.y0 + +oy, w.bbox.x1 + +ox, w.bbox.y1 + +oy], script: cyr > lat ? 'cyr' : lat > cyr ? 'lat' : 'none' });
}
fs.writeFileSync(out, JSON.stringify(words));
await worker.terminate();
