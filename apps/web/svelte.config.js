import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html',
			precompress: false,
			strict: true
		}),
		paths: {
			base: ''
		},
		version: {
			// No timer. `src/lib/update-check.ts` asks for a new deployment when Ilya opens,
			// when the page returns to the foreground, and when the browser comes back online.
			pollInterval: 0
		}
	}
};

export default config;
