// Step 5b/6 helper: one model on every PNG in a folder (PSM 7), text only, through tesseract.js. Usage: node ocr-images.mjs <png dir> <model dir> <lang> <out.json>
import { createRequire } from 'module'; import fs from 'fs'; import path from 'path';
const require = createRequire(path.resolve(process.env.HOME, 'Desktop/ilya-rewrite/apps/web/package.json'));
const { createWorker } = require(process.env.TJS ?? 'tesseract.js');
const [dir, mdir, lang, out] = process.argv.slice(2);
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.png')).sort();
const worker = await createWorker([lang], 1, { langPath: mdir, gzip: false, cacheMethod: 'none' });
await worker.setParameters({ tessedit_pageseg_mode: '7', preserve_interword_spaces: '1' });
const res = {};
for (const f of files) { const { data } = await worker.recognize(path.join(dir, f)); res[f.slice(0, -4)] = data.text.trim(); }
fs.writeFileSync(out, JSON.stringify(res)); console.log(files.length, 'images'); await worker.terminate();
