/**
 * copy-pdfjs-wasm.mjs — put pdf.js's own codec modules where the browser can
 * fetch them.
 *
 * N.96. `pdfjs-dist` 6.x decodes JBIG2, JPEG 2000, and ICC colour in
 * WebAssembly rather than in JavaScript. The worker fetches those modules at
 * decode time from whatever directory `getDocument`'s `wasmUrl` names, and
 * with no `wasmUrl` it builds the literal URL `"null" + "jbig2.wasm"`, fails
 * the fetch, fails the fallback `import()`, and paints NOTHING. A JBIG2 scan
 * then renders as a correctly sized, entirely white page with no error thrown
 * anywhere the app can see it. That is the whole of N.96.
 *
 * `page-pdf.ts` passes `wasmUrl: '/pdfjs-wasm/'`, which is this directory.
 *
 * THE COPIES ARE GENERATED, NEVER EDITED, AND NEVER COMMITTED, for
 * copy-reader.mjs's reason: `apps/web/static/pdfjs-wasm/` is gitignored,
 * because an untracked file blocks the ship script, and because a second copy
 * of a dependency's binaries in the repository is a copy that can drift from
 * the pinned version in the lockfile. `pdfjs-dist` is pinned exactly, so the
 * lockfile is the source of truth for these bytes.
 *
 * THE WHOLE DIRECTORY IS COPIED, not only `jbig2.*`. The other codecs fail the
 * identical way on the identical code path, so shipping a subset would leave
 * the same silent blank page waiting behind a JPEG 2000 scan. The LICENSE_*
 * files travel with the binaries they cover.
 *
 * IT FAILS LOUDLY, for stamp-sw.mjs's reason. A silent no-op here restores
 * N.96 in a build that otherwise looks healthy.
 */
import { copyFileSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const SOURCE = new URL('../node_modules/pdfjs-dist/wasm/', import.meta.url);
const DEST = new URL('../static/pdfjs-wasm/', import.meta.url);

/** Named rather than counted, so a file that disappears upstream is a failure
 * here and not a blank page in front of a singer. */
const REQUIRED = [
	'jbig2.wasm',
	'jbig2_nowasm_fallback.js',
	'openjpeg.wasm',
	'openjpeg_nowasm_fallback.js',
	'qcms_bg.wasm',
	'quickjs-eval.js',
	'quickjs-eval.wasm'
];

const fail = (why) => {
	console.error(`copy-pdfjs-wasm: ${why}`);
	process.exit(1);
};

let files;
try {
	files = readdirSync(SOURCE).filter((n) => !n.startsWith('.'));
} catch (err) {
	fail(
		`could not read ${fileURLToPath(SOURCE)}: ${err.message}. ` +
			'Install dependencies first; these bytes come from the pinned pdfjs-dist.'
	);
}
for (const name of REQUIRED) {
	if (!files.includes(name)) {
		fail(
			`${name} is missing from ${fileURLToPath(SOURCE)}. ` +
				'pdf.js fetches it by that exact name at decode time, so a build without ' +
				'it renders JBIG2 and JPEG 2000 pages blank with no error.'
		);
	}
}

// Rebuilt from scratch each time, so a file dropped upstream cannot linger here
// and go on being served after the dependency stops shipping it.
rmSync(DEST, { recursive: true, force: true });
mkdirSync(DEST, { recursive: true });

let bytes = 0;
for (const name of files) {
	const from = new URL(name, SOURCE);
	if (!statSync(from).isFile()) continue;
	copyFileSync(from, new URL(name, DEST));
	bytes += statSync(from).size;
}

console.log(`copy-pdfjs-wasm: ${files.length} files, ${bytes} bytes -> static/pdfjs-wasm/`);
