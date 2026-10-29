// Row 105: three framed rows read in Node (tesseract.js 7.0.0, simd-lstm core, PSM 7) with r3-30000, compared with the Chromium readings in ctl/ocr-r3-30000.
import { createRequire } from 'module'; import fs from 'fs'; import path from 'path';
const REPO = '/Users/dannmitton/Desktop/ilya-rewrite', M = REPO + '/docs/sessions/measure-row105-next-model_2026-10-27';
const require = createRequire(REPO + '/apps/web/package.json'); const P = `${REPO}/node_modules/.pnpm`;
const T = require(process.env.TJS);
const w = await T.createWorker(['rus_prereform'], 1, { langPath: process.env.HOME + '/Downloads/_desk-row105/serve/r3-30000', gzip: false, cacheMethod: 'none' });
await w.setParameters({ tessedit_pageseg_mode: '7', preserve_interword_spaces: '1' });
const picks = [['B03', 0], ['S', 5], ['U5', 10]]; let same = 0;
for (const [L, i] of picks) {
  const rows = fs.readFileSync(`${M}/n135-row117/harness/rows2/${L}.jsonl`, 'utf8').trim().split('\n').map((l) => JSON.parse(l)); const r = rows[i];
  const name = `${L}-${r.page}-s${r.system}-r${r.row}.png`; const { data } = await w.recognize(`${M}/ctl/framed/${name}`);
  const ch = JSON.parse(fs.readFileSync(`${M}/ctl/ocr-r3-30000/${L}-dfloat.json`, 'utf8'))[i]; const a = data.text.trim().replace(/\s+/g, ' '), b = ch.text.trim().replace(/\s+/g, ' ');
  console.log(name, a === b ? 'EQUAL' : 'DIFF', JSON.stringify(a).slice(0, 80), JSON.stringify(b).slice(0, 80)); if (a === b) same++;
}
console.log('equal', same, 'of', picks.length); await w.terminate();
