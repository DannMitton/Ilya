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
import { readFileSync, writeFileSync } from 'node:fs';

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

writeFileSync(swPath, sw.replaceAll('__BUILD_VERSION__', version));
console.log(`stamp-sw: CACHE_VERSION is now ilya-${version}`);
