/**
 * QUEUE row 163 step 1. `static/sw.js` is run in a stub scope: the page is fetched from the network first
 * while online and served from the stored copy offline or after the wait; everything else stays
 * stale-while-revalidate. A stub proves the worker's logic, not Chrome's or Vercel's behaviour.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const SW = readFileSync(join(__dirname, '../../static/sw.js'), 'utf8');

type Handler = (event: { request: Request; respondWith: (p: Promise<Response>) => void; waitUntil: (p: Promise<unknown>) => void }) => void;

function boot(fetchImpl: (req: Request) => Promise<Response>, stored: Record<string, string> = {}) {
	const handlers: Record<string, Handler> = {};
	const store = new Map<string, Response>(Object.entries(stored).map(([k, v]) => [k, new Response(v)]));
	const key = (r: Request | string) => new URL(typeof r === 'string' ? r : r.url, 'https://ilya.test').pathname;
	const cache = {
		match: async (r: Request | string) => store.get(key(r))?.clone(),
		put: async (r: Request, res: Response) => void store.set(key(r), res),
		addAll: async () => {},
		add: async () => {},
	};
	const scope = {
		addEventListener: (type: string, h: Handler) => void (handlers[type] = h),
	};
	const caches = { open: async () => cache, keys: async () => [], delete: async () => true, match: async () => undefined };
	new Function('self', 'caches', 'fetch', SW)(scope, caches, fetchImpl);
	const ask = (req: Request) => {
		let answer: Promise<Response> | undefined;
		const waits: Promise<unknown>[] = [];
		handlers.fetch({ request: req, respondWith: (p) => (answer = p), waitUntil: (p) => waits.push(p) });
		return { answer, waits };
	};
	return { ask, store };
}

/** A same-origin reply: a real `fetch` types it 'basic', which the worker requires before it stores one. */
const basic = (body: string) => Object.defineProperty(new Response(body), 'type', { value: 'basic' });

const page = (path: string, mode: RequestMode = 'navigate') => {
	const r = new Request(`https://ilya.test${path}`);
	Object.defineProperty(r, 'mode', { value: mode });
	return r;
};

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe('the page is fetched from the network first', () => {
	it('answers a navigation from the network while online, and stores it', async () => {
		const { ask, store } = boot(async () => basic('new page'), { '/': 'old page' });
		const { answer } = ask(page('/'));
		expect(await (await answer)!.text()).toBe('new page');
		await vi.advanceTimersByTimeAsync(0);
		expect(await store.get('/')!.text()).toBe('new page');
	});

	it('answers from the stored page when the network fails', async () => {
		const { ask } = boot(async () => { throw new TypeError('offline'); }, { '/': 'old page' });
		expect(await (await ask(page('/')).answer)!.text()).toBe('old page');
	});

	it('answers an unstored path from the stored shell when offline', async () => {
		const { ask } = boot(async () => { throw new TypeError('offline'); }, { '/': 'old page' });
		expect(await (await ask(page('/library')).answer)!.text()).toBe('old page');
	});

	it('serves the stored page after 3 s and still lets the late fetch update it', async () => {
		let release!: (r: Response) => void;
		const { ask, store } = boot(() => new Promise<Response>((res) => (release = res)), { '/': 'old page' });
		const { answer } = ask(page('/'));
		await vi.advanceTimersByTimeAsync(3000);
		expect(await (await answer)!.text()).toBe('old page');
		release(basic('new page'));
		await vi.advanceTimersByTimeAsync(0);
		expect(await store.get('/')!.text()).toBe('new page');
	});

	it('holds the worker open for a fetch that loses the race', async () => {
		const { ask } = boot(async () => basic('new page'), {});
		expect(ask(page('/')).waits).toHaveLength(1);
	});

	it('waits for the network when nothing is stored', async () => {
		const { ask } = boot(async () => new Response('first visit'), {});
		const { answer } = ask(page('/'));
		await vi.advanceTimersByTimeAsync(3500);
		expect(await (await answer)!.text()).toBe('first visit');
	});
});

describe('everything else is unchanged', () => {
	it('serves a stored script stale-while-revalidate', async () => {
		const fetchSpy = vi.fn(async () => new Response('new script'));
		const { ask } = boot(fetchSpy, { '/_app/immutable/entry/start.x.js': 'old script' });
		expect(await (await ask(page('/_app/immutable/entry/start.x.js', 'cors')).answer)!.text()).toBe('old script');
		expect(fetchSpy).toHaveBeenCalledTimes(1);
	});
});

describe('what the build stamps is still there', () => {
	it('carries both placeholders scripts/stamp-sw.mjs requires, and neither skipWaiting nor clients.claim as code', () => {
		expect(SW).toContain('__BUILD_VERSION__');
		expect(SW).toContain('/*__HEIF_CHUNKS__*/');
		const code = SW.replace(/\/\/.*$/gm, '');
		expect(code).not.toMatch(/skipWaiting|clients\.claim/);
	});
});
