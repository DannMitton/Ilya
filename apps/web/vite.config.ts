import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		// Unit tests live under src/. The e2e/ folder is Playwright's;
		// excluding it keeps Vitest and Playwright in separate lanes.
		include: ['src/**/*.{test,spec}.{js,ts}'],
		exclude: ['e2e/**', 'node_modules/**']
	}
});
