/**
 * QUEUE row 151. `fetch`, the caches, `check`, and the clock are injected, so these tests
 * do not prove the service worker path: `static/sw.js` answers a cache-busted
 * `/_app/version.json` from the network only, and whether that request rejects offline in
 * every browser is NOT ESTABLISHED here.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { t } from './i18n';
import { CACHE_PREFIX, FOREGROUND_CHECK_MS, refreshToNewVersion, startUpdateChecks, VERSION_PROBE_PATH } from './update-check';

const ROOT = join(__dirname, '../..');

class Target extends EventTarget {
	visibilityState = 'visible';
}

const rig = () => {
	const win = new EventTarget();
	const doc = new Target();
	let clock = 1_000_000;
	const check = vi.fn(async () => false);
	const stop = startUpdateChecks({ check, win, doc, now: () => clock });
	return { win, doc, check, stop, advance: (ms: number) => (clock += ms) };
};

describe('the polling timer is off', () => {
	it('svelte.config.js sets pollInterval to 0', async () => {
		const { default: config } = await import('../../svelte.config.js');
		expect(config.kit?.version?.pollInterval).toBe(0);
	});
});

describe('when a check runs', () => {
	it('on mount', () => {
		const { check } = rig();
		expect(check).toHaveBeenCalledTimes(1);
	});

	it('on return to the foreground, and not twice in one hour', () => {
		const { doc, check, advance } = rig();
		doc.visibilityState = 'hidden';
		doc.dispatchEvent(new Event('visibilitychange'));
		doc.visibilityState = 'visible';
		advance(FOREGROUND_CHECK_MS - 1);
		doc.dispatchEvent(new Event('visibilitychange'));
		expect(check).toHaveBeenCalledTimes(1);
		advance(1);
		doc.dispatchEvent(new Event('visibilitychange'));
		expect(check).toHaveBeenCalledTimes(2);
		advance(60_000);
		doc.dispatchEvent(new Event('visibilitychange'));
		expect(check).toHaveBeenCalledTimes(2);
	});

	it('not when the page goes to the background', () => {
		const { doc, check, advance } = rig();
		advance(FOREGROUND_CHECK_MS * 2);
		doc.visibilityState = 'hidden';
		doc.dispatchEvent(new Event('visibilitychange'));
		expect(check).toHaveBeenCalledTimes(1);
	});

	it('on the online event', () => {
		const { win, check } = rig();
		win.dispatchEvent(new Event('online'));
		expect(check).toHaveBeenCalledTimes(2);
	});

	it('stops listening when the page goes', () => {
		const { win, doc, check, stop, advance } = rig();
		stop();
		advance(FOREGROUND_CHECK_MS);
		doc.dispatchEvent(new Event('visibilitychange'));
		win.dispatchEvent(new Event('online'));
		expect(check).toHaveBeenCalledTimes(1);
	});

	it('survives a check that rejects', () => {
		const win = new EventTarget();
		const doc = new Target();
		const check = vi.fn(() => Promise.reject(new Error('x')));
		expect(() => startUpdateChecks({ check, win, doc })).not.toThrow();
	});
});

const cacheStore = (names: string[]) => {
	const deleted: string[] = [];
	return {
		deleted,
		keys: async () => names,
		delete: async (k: string) => (deleted.push(k), true)
	};
};

describe('Refresh', () => {
	it('keeps every cache and does not reload when the probe rejects', async () => {
		const store = cacheStore(['ilya-static-v1', 'other']);
		const reload = vi.fn();
		const out = await refreshToNewVersion({ fetch: () => Promise.reject(new TypeError('offline')), caches: store, reload });
		expect(out).toBe('offline');
		expect(store.deleted).toEqual([]);
		expect(reload).not.toHaveBeenCalled();
	});

	it('keeps every cache and does not reload when the probe answers not ok', async () => {
		const store = cacheStore(['ilya-static-v1']);
		const reload = vi.fn();
		const out = await refreshToNewVersion({ fetch: async () => ({ ok: false }), caches: store, reload });
		expect(out).toBe('offline');
		expect(store.deleted).toEqual([]);
		expect(reload).not.toHaveBeenCalled();
	});

	it('deletes only the ilya- caches, then reloads, when the probe answers ok', async () => {
		const store = cacheStore(['ilya-static-v1', 'ilya-static-v0', 'other']);
		const reload = vi.fn();
		const out = await refreshToNewVersion({ fetch: async () => ({ ok: true }), caches: store, reload });
		expect(out).toBe('reloaded');
		expect(store.deleted).toEqual(['ilya-static-v1', 'ilya-static-v0']);
		expect(store.deleted.every((k) => k.startsWith(CACHE_PREFIX))).toBe(true);
		expect(reload).toHaveBeenCalledTimes(1);
	});

	it('probes the version file with a query the worker has never cached, and a different one each time', async () => {
		const urls: string[] = [];
		const fetchStub = async (url: string) => (urls.push(url), { ok: true });
		let clock = 5;
		const env = { fetch: fetchStub, caches: cacheStore([]), reload: () => {}, now: () => clock++ };
		await refreshToNewVersion(env);
		await refreshToNewVersion(env);
		for (const u of urls) {
			expect(u.startsWith(`${VERSION_PROBE_PATH}?`)).toBe(true);
			expect(u).not.toBe(VERSION_PROBE_PATH);
		}
		expect(new Set(urls).size).toBe(2);
	});

	it('still reloads when CacheStorage refuses, because the host answered', async () => {
		const store = { keys: async () => { throw new Error('refused'); }, delete: async () => true };
		const reload = vi.fn();
		expect(await refreshToNewVersion({ fetch: async () => ({ ok: true }), caches: store, reload })).toBe('reloaded');
		expect(reload).toHaveBeenCalledTimes(1);
	});
});

describe('the worker side of the probe, read from static/sw.js', () => {
	const sw = readFileSync(join(ROOT, 'static/sw.js'), 'utf8');
	it('answers the version path network-first, falling back to a cache match on the same request', () => {
		expect(sw).toContain("url.pathname.endsWith('/_app/version.json')");
		expect(sw).toContain('event.respondWith(fetch(request).catch(() => caches.match(request)))');
	});
});

describe('the offline-Refresh string, ratified by Dann 2026-10-21 13:56 and 13:57', () => {
	it('reads as written in English', () => {
		expect(t('update.offline', 'en')).toBe('The new version could not be loaded. Check your connection, then press Refresh again.');
	});
	it('reads as written in French, with the typographic apostrophe', () => {
		expect(t('update.offline', 'fr')).toBe('La nouvelle version n’a pas pu être chargée. Vérifiez votre connexion, puis appuyez de nouveau sur Actualiser.');
	});
});
