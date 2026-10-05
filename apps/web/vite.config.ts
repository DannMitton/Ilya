import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

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
test: {
// Unit tests live under src/. The e2e/ folder is Playwright's;
// excluding it keeps Vitest and Playwright in separate lanes.
include: ['src/**/*.{test,spec}.{js,ts}'],
exclude: ['e2e/**', 'node_modules/**']
}
});
