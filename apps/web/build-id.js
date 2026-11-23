// One function, two readers: `vite.config.ts` stamps it into the bundle as `__ILYA_BUILD__`, and `svelte.config.js` sets
// `kit.version.name` to it. This is plain JavaScript because `svelte.config.js` is loaded by Node, which does not load `.ts`.
import { execSync } from 'node:child_process';

/**
 * THE RECORDER'S BUILD FLAG (N.200 Step 1). `__ILYA_RECORDER__` is true on the development server, and in a build only when
 * `PUBLIC_RECORDER=1` is set for that build AND the build is not Vercel's production environment. Everywhere else it is the
 * literal `false`, so the bundler drops `engine/capture-file.ts` and the three calls in `engine/live.ts` from the singers'
 * bundle. `vercel.json` sets the variable for one branch only. `__ILYA_BUILD__` is the commit the bundle was built from,
 * stamped into every recording, because the service worker can serve a stale page (`static/sw.js`, `networkFirstPage`).
 *
 * The same value is SvelteKit's `kit.version.name`. Left unset, SvelteKit falls back to `Date.now()`, which is written into
 * `build/_app/version.json` and hashed into a chunk name, so two builds of one commit differed in every entry chunk.
 *
 * @returns {string}
 */
export function buildId() {
	if (process.env.VERCEL_GIT_COMMIT_SHA) return process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 8);
	try {
		return execSync('git rev-parse --short=8 HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
	} catch {
		return 'unknown';
	}
}
