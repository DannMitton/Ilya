/**
 * notices.test.ts — N.67 step 6, the sweep.
 *
 * Design §4's failure handling is a set of rules about WHEN a sentence is
 * true, and every one of them lives in `notices.ts` for the reason the door's
 * rules live in `songs.ts`: runes are inert under this suite
 * (`docs/memory/ENVIRONMENT.md`), so a rule written in `+page.svelte` is a rule
 * no gate can reach.
 *
 * The two rules worth the most here are the ones a careless build gets wrong.
 * The eviction notice must appear ONCE PER DEVICE, which means a second boot
 * must be silent. And the partial-loss notice must not greet a first-time
 * singer with news of a loss they never had.
 */
import { describe, it, expect } from 'vitest';
import {
	bootNotices,
	drawerNotices,
	EVICTION_NOTICE_KEY,
	fillNotice,
	saveNotice,
	songNotice,
	type PointerState,
} from './notices';
import type { KeyValueStore } from './driver';

function fakeStore(seed: Record<string, string> = {}): KeyValueStore & { data: Record<string, string> } {
	const data = { ...seed };
	return {
		data,
		getItem: (key: string) => data[key] ?? null,
		setItem: (key: string, value: string) => {
			data[key] = value;
		},
		removeItem: (key: string) => {
			delete data[key];
		},
	};
}

const HEALTHY: PointerState = { stored: true, found: true, songCount: 3 };

function keys(lines: { key: string }[]): string[] {
	return lines.map((line) => line.key);
}

describe('the eviction notice, once per device', () => {
	it('appears when the origin is not persistent, and writes the flag as it decides', () => {
		const store = fakeStore();

		const lines = bootNotices({ loadFailure: null, persisted: false, pointer: HEALTHY }, store);

		expect(keys(lines)).toEqual(['storage.evictionRisk']);
		// Written at the moment it is DECIDED, not after it is drawn, so a singer
		// who reloads before reading it still sees it exactly once.
		expect(store.data[EVICTION_NOTICE_KEY]).toBe('1');
	});

	it('never appears a second time', () => {
		const store = fakeStore();
		bootNotices({ loadFailure: null, persisted: false, pointer: HEALTHY }, store);

		const second = bootNotices({ loadFailure: null, persisted: false, pointer: HEALTHY }, store);

		expect(second).toEqual([]);
	});

	it('stays quiet where the origin IS persistent, and where the browser will not say', () => {
		expect(bootNotices({ loadFailure: null, persisted: true, pointer: HEALTHY }, fakeStore())).toEqual([]);
		expect(bootNotices({ loadFailure: null, persisted: null, pointer: HEALTHY }, fakeStore())).toEqual([]);
	});

	it('repeats rather than vanishes when there is nowhere to keep the flag', () => {
		// A null store is a browser that would not answer. The honest consequence
		// of not being able to remember is a repeated sentence, never a withheld
		// warning about work that can be deleted.
		const first = bootNotices({ loadFailure: null, persisted: false, pointer: HEALTHY }, null);
		const second = bootNotices({ loadFailure: null, persisted: false, pointer: HEALTHY }, null);

		expect(keys(first)).toEqual(['storage.evictionRisk']);
		expect(keys(second)).toEqual(['storage.evictionRisk']);
	});
});

describe('no storage at all', () => {
	it('says so, and says nothing else', () => {
		const lines = bootNotices(
			{ loadFailure: 'no-storage', persisted: false, pointer: { stored: true, found: false, songCount: 2 } },
			fakeStore(),
		);

		// One absence, one sentence. A browser that can save nothing has nothing
		// to evict and no library to have lost a song from.
		expect(keys(lines)).toEqual(['storage.none']);
	});

	it('does not fire merely because the vault refused', () => {
		// The app falls back to localStorage when IndexedDB will not open, and
		// localStorage keeps a song perfectly well. Saying "nothing can be saved"
		// there would be a lie.
		expect(bootNotices({ loadFailure: 'malformed', persisted: true, pointer: HEALTHY }, fakeStore())).toEqual([]);
	});
});

describe('the partial-loss oddity', () => {
	it('fires when a stored pointer names a song the vault does not hold', () => {
		const lines = bootNotices(
			{ loadFailure: null, persisted: true, pointer: { stored: true, found: false, songCount: 2 } },
			fakeStore(),
		);

		expect(keys(lines)).toEqual(['storage.partialLoss']);
	});

	it('stays quiet on a pointer this boot minted', () => {
		const lines = bootNotices(
			{ loadFailure: null, persisted: true, pointer: { stored: false, found: false, songCount: 2 } },
			fakeStore(),
		);

		expect(lines).toEqual([]);
	});

	it('stays quiet on an empty vault, because a wipe and a first visit look the same', () => {
		// Design §4's own honesty: a wiped origin is indistinguishable from a
		// first visit. With no other song to prove the vault works, the absence
		// of this one is a guess, and a singer who opened Ilya once and typed
		// nothing must not be told their songs are gone.
		const lines = bootNotices(
			{ loadFailure: null, persisted: true, pointer: { stored: true, found: false, songCount: 0 } },
			fakeStore(),
		);

		expect(lines).toEqual([]);
	});
});

describe('what a failed save says', () => {
	it('appends the figures where the browser gave numbers', () => {
		const lines = saveNotice('quota-exceeded', { usage: 1024 * 1024, quota: 1024 * 1024 * 1024, persisted: true });

		// `formatBytes` keeps one decimal below ten, so exactly one mebibyte reads
		// "1.0 MB". Asserted as it actually renders rather than as it reads in
		// prose: the figure the singer sees is the thing under test.
		expect(lines).toEqual([
			{ key: 'storage.quotaFull' },
			{ key: 'storage.quotaNumbers', args: ['1.0 MB', '1.0 GB'] },
		]);
	});

	it('says nothing about size where the browser would not say', () => {
		// "Storage: undefined of undefined used" is worse than a notice that says
		// nothing about size at all.
		expect(saveNotice('quota-exceeded', { persisted: null })).toEqual([{ key: 'storage.quotaFull' }]);
		expect(saveNotice('quota-exceeded', { usage: 5, persisted: null })).toEqual([{ key: 'storage.quotaFull' }]);
	});

	it('keeps the generic sentence for a write that refused for any other reason', () => {
		expect(saveNotice('write-failed', { persisted: null })).toEqual([{ key: 'storage.saveFailed.generic' }]);
	});

	it('says nothing at all when nothing failed', () => {
		expect(saveNotice(null, { persisted: null })).toEqual([]);
	});
});

describe('what a failed load says', () => {
	it('names the record that could not be read, and the one from a newer Ilya', () => {
		expect(songNotice('malformed')).toEqual({ key: 'song.unreadable' });
		expect(songNotice('newer-schema')).toEqual({ key: 'song.newerIlya' });
	});

	it('leaves no-storage to the boot notice, so one absence gets one sentence', () => {
		expect(songNotice('no-storage')).toBeNull();
	});

	it('says nothing on a load that came back whole', () => {
		expect(songNotice(null)).toBeNull();
	});
});

describe('the drawer, in order', () => {
	it('lets a failed save speak over a failed load', () => {
		// Both at once would read as two losses rather than one.
		const lines = drawerNotices({
			boot: [],
			saveFailure: 'write-failed',
			loadFailure: 'malformed',
			reading: { persisted: null },
		});

		expect(keys(lines)).toEqual(['storage.saveFailed.generic']);
	});

	it('never says the same sentence twice', () => {
		// **FOUND ON THE WALK, 2026-08-18.** A browser with no storage at all
		// reports `no-storage` at boot AND on the first write, so `storage.none`
		// arrived twice. The template keyed its `{#each}` on the notice key, two
		// identical keys threw `each_key_duplicate`, and the notice region died in
		// exactly the state it exists to describe.
		const lines = drawerNotices({
			boot: [{ key: 'storage.none' }],
			saveFailure: 'no-storage',
			loadFailure: 'no-storage',
			reading: { persisted: null },
		});

		expect(keys(lines)).toEqual(['storage.none']);
	});

	it('puts the browser-wide sentences before the song-level one', () => {
		const lines = drawerNotices({
			boot: [{ key: 'storage.evictionRisk' }],
			saveFailure: null,
			loadFailure: 'malformed',
			reading: { persisted: null },
		});

		expect(keys(lines)).toEqual(['storage.evictionRisk', 'song.unreadable']);
	});
});

describe('filling the slots', () => {
	it('fills every %s in order, which one replace() call does not', () => {
		expect(fillNotice('Storage: %s of %s used.', ['1 MB', '1 GB'])).toBe('Storage: 1 MB of 1 GB used.');
	});

	it('leaves a string with no slots alone', () => {
		expect(fillNotice('Nothing can be saved in this browsing mode.')).toBe(
			'Nothing can be saved in this browsing mode.',
		);
	});
});
