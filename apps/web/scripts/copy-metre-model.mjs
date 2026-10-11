/**
 * copy-metre-model.mjs: put the time-signature reader's network where the
 * score reader fetches it (QUEUE row 57).
 *
 * The network that reads a printed time signature (`src/lib/omr/metre-model.ts`)
 * is fetched from `/omr/models/metre/`, beside homr's models, only when a
 * window of the voice staff is read. `/omr/` is git-ignored and never
 * intercepted by the service worker, so the browser's own HTTP cache keeps
 * these bytes, as it keeps homr's. The network is this project's own, trained
 * for row 57 (`docs/sessions/report-code-the-metre-seen-and-summed_r6-run1_2026-10-11.md`),
 * so its files are committed in `omr-metre/`, the source of truth, and copied
 * here at `dev` and `build`.
 *
 * IT FAILS LOUDLY, for copy-ort-wasm.mjs's reason: a missing file here is a
 * metre that cannot be read, in a build that otherwise looks healthy.
 */
import { copyFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const SRC = fileURLToPath(new URL('../omr-metre/', import.meta.url));
const DEST = fileURLToPath(new URL('../static/omr/models/metre/', import.meta.url));
const FILES = ['metre-a-r6.onnx', 'metre-a-r6-ref.f16', 'metre-a-r6-ref.cls'];

mkdirSync(DEST, { recursive: true });
for (const name of FILES) {
	try {
		copyFileSync(SRC + name, DEST + name);
	} catch (err) {
		console.error(`copy-metre-model: could not copy ${name}: ${err.message}`);
		process.exit(1);
	}
}
