/**
 * Tests for the voice profile's save reporting (N.27).
 *
 * `saveStore` used to return `void` and swallow every throw, so a full quota
 * refused the voice and the singer was never told. It now returns an
 * `Outcome` and publishes the reason to `profileSave.failure`. These pin each
 * branch, and that it never throws.
 *
 * NO DOM HERE. `apps/web` runs vitest in node, so `window.localStorage` is a
 * fake on `globalThis`. The runes field holds its value under vitest, as
 * `reading-wait.test.ts` relies on. `DOMException` exists in the node test
 * runtime (`library/driver.test.ts` builds one the same way).
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { saveStore, type ProfileStore } from './profileStore';
import { profileSave } from './profile-save.svelte';

const STORE: ProfileStore = { version: 2, activeId: null, voices: [] };

function stubStorage(setItem: (key: string, value: string) => void) {
	vi.stubGlobal('window', { localStorage: { setItem, getItem: () => null, removeItem: () => {} } });
}

afterEach(() => {
	vi.unstubAllGlobals();
	profileSave.failure = null;
});

describe('saveStore', () => {
	it('returns ok and clears the failure when the write lands', () => {
		profileSave.failure = 'quota-exceeded';
		const written: string[] = [];
		stubStorage((_key, value) => written.push(value));

		expect(saveStore(STORE)).toEqual({ ok: true });
		expect(profileSave.failure).toBeNull();
		expect(written).toHaveLength(1);
	});

	it('reports quota-exceeded when setItem throws a QuotaExceededError', () => {
		stubStorage(() => {
			throw new DOMException('full', 'QuotaExceededError');
		});

		expect(saveStore(STORE)).toEqual({ ok: false, reason: 'quota-exceeded' });
		expect(profileSave.failure).toBe('quota-exceeded');
	});

	it('reports a quota failure by the legacy code 22 too', () => {
		const err = new DOMException('full');
		Object.defineProperty(err, 'code', { value: 22 });
		stubStorage(() => {
			throw err;
		});

		expect(saveStore(STORE)).toEqual({ ok: false, reason: 'quota-exceeded' });
	});

	it('reports write-failed for any other throw, and does not throw itself', () => {
		stubStorage(() => {
			throw new Error('something else');
		});

		expect(() => saveStore(STORE)).not.toThrow();
		expect(saveStore(STORE)).toEqual({ ok: false, reason: 'write-failed' });
		expect(profileSave.failure).toBe('write-failed');
	});

	it('reports write-failed when the store cannot be serialized', () => {
		stubStorage(() => {});
		const circular: any = { version: 2, activeId: null, voices: [] };
		circular.self = circular;

		expect(saveStore(circular)).toEqual({ ok: false, reason: 'write-failed' });
	});

	it('reports no-storage where there is no window', () => {
		// node has no `window`: nothing is stubbed.
		expect(saveStore(STORE)).toEqual({ ok: false, reason: 'no-storage' });
		expect(profileSave.failure).toBe('no-storage');
	});

	it('reports no-storage where localStorage itself throws', () => {
		vi.stubGlobal('window', {
			get localStorage(): Storage {
				throw new Error('blocked');
			},
		});

		expect(saveStore(STORE)).toEqual({ ok: false, reason: 'no-storage' });
	});
});
