// Row 81, step 2: one Russian-only model on every row crop of a song, one line of text per row (PSM 7).
// Every word box (page pixels), text, and confidence. Language data stays outside the tree, one directory per model,
// read with gzip off and the cache off, so that two files named rus cannot collide (brief r2 section 2).
// Usage: node ocr-rows.mjs <letter> <rows.jsonl> <crop dir> <model dir> <lang: rus | Cyrillic> <out.json>
import { createRequire } from 'module'; import fs from 'fs'; import path from 'path';
const require = createRequire(path.resolve(process.env.HOME, 'Desktop/ilya-rewrite/apps/web/package.json'));
// TJS: a scratch copy of tesseract.js 7.0.0 whose getCore loads the core named by TCORE (the float tessdata_best files abort
// on the relaxed-SIMD core Node picks: "missing function: DotProductSSE"). Run with NODE_PATH at the pnpm store's tesseract.js deps.
const { createWorker } = require(process.env.TJS ?? 'tesseract.js');
const [L, rowsPath, crops, dir, lang, out] = process.argv.slice(2);
const rows = fs.readFileSync(rowsPath, 'utf8').trim().split('\n').map((l) => JSON.parse(l));
const worker = await createWorker([lang], 1, { langPath: dir, gzip: false, cacheMethod: 'none' });
await worker.setParameters({ tessedit_pageseg_mode: '7', preserve_interword_spaces: '1' });
const res = [];
for (const r of rows) {
	const png = `${crops}/${L}-${r.page}-s${r.system}-r${r.row}.png`;
	const { data } = await worker.recognize(png, {}, { blocks: true });
	const words = [];
	for (const b of data.blocks ?? []) for (const p of b.paragraphs) for (const l of p.lines) for (const w of l.words)
		words.push({ text: w.text, conf: Math.round(w.confidence), bbox: [w.bbox.x0 + r.x0, w.bbox.y0 + r.y0, w.bbox.x1 + r.x0, w.bbox.y1 + r.y0] });
	res.push({ page: r.page, system: r.system, row: r.row, text: data.text.trim(), words });
}
fs.writeFileSync(out, JSON.stringify(res));
console.log(L, lang, dir, rows.length, 'rows');
await worker.terminate();
