import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
plugins: [sveltekit()],
// Expose PUBLIC_-prefixed env vars on import.meta.env (alongside Vite's
// default VITE_). The Shane feature gate in $lib/wall reads
// import.meta.env.PUBLIC_INCLUDE_SHANE, which Vite only populates when the
// prefix is allowlisted here.
envPrefix: ['VITE_', 'PUBLIC_'],
test: {
// Unit tests live under src/. The e2e/ folder is Playwright's;
// excluding it keeps Vitest and Playwright in separate lanes.
include: ['src/**/*.{test,spec}.{js,ts}'],
exclude: ['e2e/**', 'node_modules/**']
}
});
