import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { defaultClientConditions } from 'vite';

export default defineConfig({
plugins: [sveltekit()],
// Expose PUBLIC_-prefixed env vars on import.meta.env (alongside Vite's
// default VITE_). The Markup and Insights gate in $lib/wall reads
// import.meta.env.PUBLIC_INCLUDE_MARKUP_INSIGHTS, which Vite only populates
// when the prefix is allowlisted here.
envPrefix: ['VITE_', 'PUBLIC_'],
// The score reader for a scan (src/lib/omr/) runs homr-web, as its README's
// "Bundlers" section says Vite's dev server needs: homr-web and
// onnxruntime-web are not pre-bundled (pre-bundled, homr-web's Worker URL
// answers 404 and onnxruntime looks for its .wasm in the wrong folder), and
// OpenCV.js, a UMD bundle reached only from homr-web's Worker, is.
optimizeDeps: {
exclude: ['homr-web', 'onnxruntime-web'],
include: ['homr-web > @techstark/opencv-js']
},
// homr-web's Worker imports its modules lazily, which Vite's default worker
// format (iife) cannot bundle: `vite build` stops with "Invalid value "iife"
// for option "worker.format"". Every Worker in this app is already started
// with { type: 'module' } (reader/page-reader.ts, reader/score-reader.ts), so
// the ES format is what they run as in the browser.
worker: { format: 'es' },
// onnxruntime-web's default entry (ort.bundle.min.mjs) inlines its Emscripten
// glue and holds new URL('ort-wasm-simd-threaded.jsep.wasm', import.meta.url),
// which makes Vite emit a second 27 MB copy of the engine under
// _app/immutable/workers/assets/. The code never loads that copy: both
// readers point wasmPaths at /omr/ort/ (omr/homr-reader.ts, omr/metre-model.ts),
// where scripts/copy-ort-wasm.mjs puts the one copy that is used. This export
// condition selects ort.min.mjs, which carries no such URL and imports the
// engine from wasmPaths.
resolve: { conditions: ['onnxruntime-web-use-extern-wasm', ...defaultClientConditions] },
test: {
// Unit tests live under src/. The e2e/ folder is Playwright's;
// excluding it keeps Vitest and Playwright in separate lanes.
include: ['src/**/*.{test,spec}.{js,ts}'],
exclude: ['e2e/**', 'node_modules/**']
}
});
