/**
 * QUEUE row 151: when Ilya asks the host for a new build, and what the Refresh button does.
 *
 * `svelte.config.js` sets `pollInterval` to 0, so the framework arms no timer
 * (`@sveltejs/kit/src/runtime/client/utils.js`, `if (interval)` before each `setTimeout`).
 * The check is called from here instead: when Ilya opens, when the page comes back to the
 * foreground (at most once an hour), and when the browser reports it is online.
 *
 * `check` and the browser objects are arguments so the tests inject them.
 */

export const FOREGROUND_CHECK_MS = 60 * 60 * 1000;

/** The worker answers this path network-first and has no cached copy of a new query (`static/sw.js`). */
export const VERSION_PROBE_PATH = '/_app/version.json';

/** The prefix `static/sw.js` filters on in its own activate handler. */
export const CACHE_PREFIX = 'ilya-';

export interface UpdateCheckEnv {
	/** `updated.check` from `$app/state`. */
	check: () => Promise<unknown>;
	/** The window: `online` is heard here. */
	win: Pick<EventTarget, 'addEventListener' | 'removeEventListener'>;
	/** The document: `visibilitychange` is heard here. */
	doc: Pick<EventTarget, 'addEventListener' | 'removeEventListener'> & { visibilityState: string };
	now?: () => number;
}

/** Runs the first check now and arms the other two triggers. Returns the function that disarms them. */
export function startUpdateChecks({ check, win, doc, now = Date.now }: UpdateCheckEnv): () => void {
	let last = now();
	const run = () => {
		last = now();
		// `updated.check` never rejects; the catch keeps a replacement from raising on the page.
		void Promise.resolve(check()).catch(() => {});
	};
	const onVisibility = () => {
		if (doc.visibilityState === 'visible' && now() - last >= FOREGROUND_CHECK_MS) run();
	};
	run();
	doc.addEventListener('visibilitychange', onVisibility);
	win.addEventListener('online', run);
	return () => {
		doc.removeEventListener('visibilitychange', onVisibility);
		win.removeEventListener('online', run);
	};
}

export interface RefreshEnv {
	fetch?: (url: string, init?: RequestInit) => Promise<{ ok: boolean }>;
	caches?: Pick<CacheStorage, 'keys' | 'delete'>;
	reload?: () => void;
	now?: () => number;
}

/**
 * N.54: `location.reload()` alone lands the singer back on the OLD build, because the worker
 * serves the shell stale-while-revalidate. Dropping its caches sends the reload to the network,
 * and with no network that leaves nothing to serve. So the caches go only after a probe of the
 * host succeeds. The probe carries a query the worker has never cached: every other GET is
 * answered `cached || networkFetch`, and a plain `fetch('/')` would succeed offline from the
 * cached shell. Returns 'offline' when the probe failed, and nothing was deleted.
 */
export async function refreshToNewVersion(env: RefreshEnv = {}): Promise<'reloaded' | 'offline'> {
	const doFetch = env.fetch ?? ((url, init) => fetch(url, init));
	const cacheStore = env.caches ?? (typeof caches === 'undefined' ? undefined : caches);
	const reload = env.reload ?? (() => location.reload());
	const stamp = (env.now ?? Date.now)();
	try {
		const res = await doFetch(`${VERSION_PROBE_PATH}?refresh=${stamp}`, { cache: 'no-store' });
		if (!res.ok) return 'offline';
	} catch {
		return 'offline';
	}
	try {
		const keys = (await cacheStore?.keys()) ?? [];
		await Promise.all(keys.filter((k) => k.startsWith(CACHE_PREFIX)).map((k) => cacheStore!.delete(k)));
	} catch {
		// No CacheStorage, or it refused. The host answered, so reload anyway: no worse than before.
	}
	reload();
	return 'reloaded';
}
