/**
 * copy-underlay-model.mjs: put the underlay reader's model and its tesseract.js
 * files where the page fetches them (N.135 stage 2b).
 *
 * WIRED: `dev` and `build` in package.json run it after `copy-metre-model.mjs`
 * (a unit test, `src/lib/omr/underlay-wired.test.ts`, fails if either lacks it), so
 * the three files below are served, and the page's fetch of them succeeds. Before
 * this, none was built into the site, and every scan was read with no words and no
 * error. The model itself is committed (`omr-underlay/`); the other two files and
 * the licences are copied from the installed packages.
 *
 * `/omr/` is git-ignored and never intercepted by the service worker
 * (`static/sw.js`), so the browser's own HTTP cache keeps these bytes, as it
 * keeps homr's and the metre network's. Five files go to `static/omr/models/underlay/`:
 *
 * - `rus_prereform_r2_29000.traineddata` (7,827,478 bytes, md5 2ff2af3e33461cd64e7d2015ef21d10d),
 *   from `omr-underlay/`, the source folder; it is the project's own model
 *   (row 82), the float form, not gzipped;
 * - `tesseract-core-simd-lstm.wasm.js` (3,899,472 bytes), the core named by file
 *   (`ENVIRONMENT.md`, "A FLOAT MODEL LOADS WHEN corePath NAMES THE SIMD CORE FILE"),
 *   from the installed `tesseract.js-core`;
 * - `worker.min.js` (111,307 bytes), from the installed `tesseract.js`, so that the
 *   worker script is the app's own and not a CDN's;
 * - `LICENSE-tesseract.js.txt` and `LICENSE-tesseract.js-core.txt`, each package's own
 *   licence file, copied as it is, because Ilya serves those two packages' code
 *   from its own origin (both state Apache-2.0).
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
	[join(tesseract, 'LICENSE.md'), 'LICENSE-tesseract.js.txt'],
	[join(core, 'LICENSE'), 'LICENSE-tesseract.js-core.txt'],
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
