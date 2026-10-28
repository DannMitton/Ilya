/**
 * stamp-sw.mjs — give every build its own service worker.
 *
 * N.72. `static/sw.js` is copied verbatim by the static adapter, so nothing in
 * the normal build pipeline can vary it. This runs after `vite build` and
 * replaces `__BUILD_VERSION__` with SvelteKit's own per-build version, which it
 * already writes to `_app/version.json`.
 *
 * IT FAILS LOUDLY ON PURPOSE. If this silently did nothing, every deploy would
 * ship the placeholder, the bytes would be identical again, and N.72 would be
 * back while the build looked perfectly healthy. A broken build is a far
 * cheaper failure than a beta nobody can update.
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';

const BUILD = new URL('../build/', import.meta.url);
const swPath = new URL('sw.js', BUILD);
const versionPath = new URL('_app/version.json', BUILD);

const fail = (why) => {
	console.error(`stamp-sw: ${why}`);
	process.exit(1);
};

let version;
try {
	version = JSON.parse(readFileSync(versionPath, 'utf8')).version;
} catch (err) {
	fail(`could not read ${versionPath.pathname}: ${err.message}`);
}
if (typeof version !== 'string' || version === '') fail('version.json carried no version');

let sw;
try {
	sw = readFileSync(swPath, 'utf8');
} catch (err) {
	fail(`could not read ${swPath.pathname}: ${err.message}`);
}
if (!sw.includes('__BUILD_VERSION__')) {
	fail('sw.js carries no __BUILD_VERSION__ placeholder, so nothing was stamped');
}

// Row 113. The HEIC decoder's two hashed chunks, found by what they contain, so
// the service worker can cache them in the background (static/sw.js).
if (!sw.includes('/*__HEIF_CHUNKS__*/')) fail('sw.js carries no __HEIF_CHUNKS__ placeholder');
const immutable = new URL('_app/immutable/', BUILD);
const chunks = [];
const walk = (dir) => {
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const here = new URL(entry.name + (entry.isDirectory() ? '/' : ''), dir);
		if (entry.isDirectory()) walk(here);
		else if (entry.name.endsWith('.js')) {
			const text = readFileSync(here, 'utf8');
			// the glue defines HeifDecoder; heic-decode.ts holds the wasm URL
			if (text.includes('HeifDecoder') || text.includes('/heif/libheif.wasm')) {
				chunks.push(here.pathname.slice(BUILD.pathname.length - 1));
			}
		}
	}
};
walk(immutable);
// The chunks they import statically ("./name.js", which includes the dynamic import of
// the glue), because offline an import whose dependency was never cached fails whole.
for (let i = 0; i < chunks.length; i++) {
	const text = readFileSync(new URL('.' + chunks[i], BUILD), 'utf8');
	const dir = chunks[i].slice(0, chunks[i].lastIndexOf('/') + 1);
	for (const [, name] of text.matchAll(/"\.\/([A-Za-z0-9_-]+\.js)"/g)) {
		if (!chunks.includes(dir + name)) chunks.push(dir + name);
	}
}
if (chunks.length < 2) fail(`expected the glue chunk and the heic-decode chunk, found ${chunks.length}: ${chunks.join(', ')}`);

writeFileSync(
	swPath,
	sw.replaceAll('__BUILD_VERSION__', version).replace('/*__HEIF_CHUNKS__*/', chunks.map((c) => `'${c}'`).join(','))
);
console.log(`stamp-sw: decoder chunks cached in the background: ${chunks.join(', ')}`);
console.log(`stamp-sw: CACHE_VERSION is now ilya-${version}`);
