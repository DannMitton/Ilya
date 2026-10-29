/**
 * copy-underlay-model.mjs: put the underlay reader's model and its tesseract.js
 * files where the page fetches them (N.135 stage 2b).
 *
 * NOT WIRED. It is not in `dev` or `build` in package.json, and no file it copies
 * is committed: Dann has not yet been told the bytes (`CONTRACT.md` §8, last
 * bullet; the stage 2b report lists them). Until it is wired, the page's fetch of
 * these files fails, the page answers null, and a scan is read as it was before
 * this stage. To wire it, add `&& node scripts/copy-underlay-model.mjs` after
 * `copy-metre-model.mjs` in both scripts.
 *
 * `/omr/` is git-ignored and never intercepted by the service worker
 * (`static/sw.js`), so the browser's own HTTP cache keeps these bytes, as it
 * keeps homr's and the metre network's. Three files go to `static/omr/models/underlay/`:
 *
 * - `rus_prereform_r2_29000.traineddata` (7,827,478 bytes, md5 2ff2af3e33461cd64e7d2015ef21d10d),
 *   from `omr-underlay/`, the source folder; it is the project's own model
 *   (row 82), the float form, not gzipped;
 * - `tesseract-core-simd-lstm.wasm.js` (3,899,472 bytes), the core named by file
 *   (`ENVIRONMENT.md`, "A FLOAT MODEL LOADS WHEN corePath NAMES THE SIMD CORE FILE"),
 *   from the installed `tesseract.js-core`;
 * - `worker.min.js` (111,307 bytes), from the installed `tesseract.js`, so that the
 *   worker script is the app's own and not a CDN's.
 *
 * IT FAILS LOUDLY, for copy-metre-model.mjs's reason: a missing file is a reader
 * that cannot load, in a build that otherwise looks healthy.
 */
import { copyFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DEST = fileURLToPath(new URL('../static/omr/models/underlay/', import.meta.url));
const MODEL = fileURLToPath(new URL('../omr-underlay/rus_prereform_r2_29000.traineddata', import.meta.url));
const require = createRequire(import.meta.url);
const tesseract = dirname(require.resolve('tesseract.js/package.json'));
const core = dirname(createRequire(join(tesseract, 'package.json')).resolve('tesseract.js-core/package.json'));

const FILES = [
	[MODEL, 'rus_prereform_r2_29000.traineddata'],
	[join(core, 'tesseract-core-simd-lstm.wasm.js'), 'tesseract-core-simd-lstm.wasm.js'],
	[join(tesseract, 'dist', 'worker.min.js'), 'worker.min.js'],
];

mkdirSync(DEST, { recursive: true });
for (const [from, name] of FILES) {
	try {
		copyFileSync(from, DEST + name);
	} catch (err) {
		console.error(`copy-underlay-model: could not copy ${name}: ${err.message}`);
		process.exit(1);
	}
}
