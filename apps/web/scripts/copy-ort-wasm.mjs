/**
 * copy-ort-wasm.mjs: put onnxruntime-web's WebAssembly files where the score
 * reader fetches them.
 *
 * The score reader for a scan (`src/lib/omr/homr-reader.ts`) runs homr-web,
 * which runs its models with onnxruntime-web. onnxruntime fetches its
 * `.wasm` and the `.mjs` that loads it at run time from the folder named by
 * homr-web's `wasmPaths` option, which the reader sets to `/omr/ort/`, this
 * folder. Two pairs are copied: the plain WebAssembly build, and the `jsep`
 * build that onnxruntime uses for WebGPU.
 *
 * THE COPIES ARE GENERATED, NEVER EDITED, AND NEVER COMMITTED, for
 * copy-pdfjs-wasm.mjs's reason: `static/omr/` is git-ignored, and the
 * lockfile's onnxruntime-web is the source of truth for these bytes.
 *
 * IT FAILS LOUDLY, for copy-pdfjs-wasm.mjs's reason: a missing file here is a
 * scan that cannot be read, in a build that otherwise looks healthy.
 */
import { copyFileSync, existsSync, mkdirSync, realpathSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const fail = (why) => {
	console.error(`copy-ort-wasm: ${why}`);
	process.exit(1);
};

// onnxruntime-web is homr-web's dependency, not this app's, so it is looked
// for beside homr-web's real folder (pnpm's layout) and inside it (npm's
// layout when not hoisted). Neither package exports its package.json, so the
// folders are found by path rather than by `require.resolve`.
let ortDist;
try {
	const homrWeb = realpathSync(fileURLToPath(new URL('../node_modules/homr-web/', import.meta.url)));
	const candidates = [join(dirname(homrWeb), 'onnxruntime-web'), join(homrWeb, 'node_modules', 'onnxruntime-web')];
	const found = candidates.find((c) => existsSync(join(c, 'dist')));
	if (!found) throw new Error(`not in ${candidates.join(' or ')}`);
	ortDist = join(found, 'dist');
} catch (err) {
	fail(`could not find onnxruntime-web through homr-web: ${err.message}. Install dependencies first.`);
}

const DEST = fileURLToPath(new URL('../static/omr/ort/', import.meta.url));
const FILES = [
	'ort-wasm-simd-threaded.mjs',
	'ort-wasm-simd-threaded.wasm',
	'ort-wasm-simd-threaded.jsep.mjs',
	'ort-wasm-simd-threaded.jsep.wasm',
];

mkdirSync(DEST, { recursive: true });
for (const name of FILES) {
	try {
		copyFileSync(join(ortDist, name), join(DEST, name));
	} catch (err) {
		fail(`could not copy ${name} from ${ortDist}: ${err.message}`);
	}
}
