/**
 * copy-heif-wasm.mjs: put the HEIF decoder's WebAssembly where the browser can
 * fetch it, with its licence beside it.
 *
 * Row 113. A HEIC photograph is decoded by libheif-js (libheif and the libde265
 * HEVC decoder, LGPL-3.0) when the browser cannot decode it. `heic-decode.ts`
 * fetches `/heif/libheif.wasm` at that moment and no other, so this directory
 * is read only by a singer who opens a HEIC. The binary is its own file, never
 * inlined, so the LGPL's replacement condition holds and the lazy load works.
 *
 * Never under `/omr/`: the service worker declines to cache that prefix
 * (static/sw.js), and this file should be cached after its first use.
 *
 * THE COPIES ARE GENERATED, NEVER EDITED, AND NEVER COMMITTED, for
 * copy-pdfjs-wasm.mjs's reason: `apps/web/static/heif/` is gitignored, and
 * `libheif-js` is pinned exactly, so the lockfile is the source of truth for
 * these bytes. The licence travels with the binary it covers.
 *
 * IT FAILS LOUDLY. A build without the binary would send every HEIC photograph
 * to the "cannot open" message with nothing in the build to say why.
 */
import { copyFileSync, mkdirSync, rmSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const SOURCE = new URL('../node_modules/libheif-js/libheif-wasm/', import.meta.url);
const DEST = new URL('../static/heif/', import.meta.url);

/** Source name to served name. Named rather than counted, so a file that
 * disappears upstream is a failure here and not a missing decoder at run time. */
const REQUIRED = [
	['libheif.wasm', 'libheif.wasm'],
	['LICENSE', 'LICENSE-libheif.txt']
];

const fail = (why) => {
	console.error(`copy-heif-wasm: ${why}`);
	process.exit(1);
};

for (const [name] of REQUIRED) {
	try {
		if (!statSync(new URL(name, SOURCE)).isFile()) throw new Error('not a file');
	} catch (err) {
		fail(
			`${name} is missing from ${fileURLToPath(SOURCE)} (${err.message}). ` +
				'Install dependencies first; these bytes come from the pinned libheif-js.'
		);
	}
}

// Rebuilt from scratch each time, so nothing lingers after the dependency drops it.
rmSync(DEST, { recursive: true, force: true });
mkdirSync(DEST, { recursive: true });

let bytes = 0;
for (const [from, to] of REQUIRED) {
	copyFileSync(new URL(from, SOURCE), new URL(to, DEST));
	bytes += statSync(new URL(to, DEST)).size;
}

console.log(`copy-heif-wasm: ${REQUIRED.length} files, ${bytes} bytes -> static/heif/`);
