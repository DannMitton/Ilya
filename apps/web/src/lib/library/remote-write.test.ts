/**
 * remote-write.test.ts — another tab's save must not overwrite an edit made
 * while it loads. Brief: `docs/sessions/brief-code-two-save-fixes_r1_2026-09-25.md`, fix 2.
 *
 * `#onRemoteWrite` asked `isPending()` once, awaited the load, and applied the
 * remote record without asking again. An edit made during the await had
 * scheduled a save; the apply then overwrote it, and the save wrote the
 * remote content. The singer's edit was lost without a notice.
 *
 * THE EDIT IS MODELLED, NOT RUN. Runes are inert under vitest
 * (`docs/memory/ENVIRONMENT.md`), so the autosave effect that turns an edit
 * into `schedule()` compiles to nothing here. The test sets the field and
 * calls `schedule()` itself, which is exactly the effect's output. The remote
 * message is real: it arrives on a second `BroadcastChannel`.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SongDocument } from './document.svelte';
import { LIBRARY_CHANNEL } from './channel';
import type { Library, SaveScheduler } from './library';
import { emptySongRecord, type LoadResult, type SongRecord } from './types';

const NOW = '2026-09-27T00:00:00.000Z';
const REMOTE_AT = '2026-09-27T00:00:07.000Z';

function record(poem: string): SongRecord {
	return { ...emptySongRecord('song', NOW), poem };
}

/** A library whose `load` resolves only when the test says so. */
function deferredLibrary() {
	let resolve: (result: LoadResult) => void = () => {};
	const load = vi.fn(() => new Promise<LoadResult>((r) => (resolve = r)));
	const library = { lastSavedAt: null, load } as unknown as Library;
	return { library, load, resolveLoad: (result: LoadResult) => resolve(result) };
}

/** The scheduler, reduced to the one answer the two-tab rule turns on. */
function fakeScheduler() {
	let pending = false;
	const scheduler: SaveScheduler = {
		schedule: () => void (pending = true),
		flush: async () => void (pending = false),
		isPending: () => pending,
		dispose: () => {},
	};
	return scheduler;
}

const open: SongDocument[] = [];
const channels: BroadcastChannel[] = [];

afterEach(async () => {
	for (const doc of open.splice(0)) await doc.close();
	for (const channel of channels.splice(0)) channel.close();
});

function announceFromAnotherTab() {
	const other = new BroadcastChannel(LIBRARY_CHANNEL);
	channels.push(other);
	other.postMessage({ songId: 'song', updatedAt: REMOTE_AT });
}

const settle = () => new Promise((r) => setTimeout(r, 0));

describe('a remote write arriving while this tab loads it', () => {
	it('keeps a local edit made during the load, and says so', async () => {
		const { library, load, resolveLoad } = deferredLibrary();
		const scheduler = fakeScheduler();
		const doc = SongDocument.fromLoaded(library, { record: record('старый текст') }, () => scheduler);
		open.push(doc);

		announceFromAnotherTab();
		await vi.waitFor(() => expect(load).toHaveBeenCalledTimes(1));

		// The singer types while the load is in flight: the edit, and the save
		// the autosave effect would schedule for it.
		doc.inputText = 'моя правка';
		scheduler.schedule();

		resolveLoad({ record: record('чужая правка') });
		await settle();

		expect(doc.inputText).toBe('моя правка');
		expect(doc.remoteChange).toEqual({ updatedAt: REMOTE_AT });
	});

	it('applies the remote record as before when nothing was edited', async () => {
		const { library, load, resolveLoad } = deferredLibrary();
		const scheduler = fakeScheduler();
		const doc = SongDocument.fromLoaded(library, { record: record('старый текст') }, () => scheduler);
		open.push(doc);

		announceFromAnotherTab();
		await vi.waitFor(() => expect(load).toHaveBeenCalledTimes(1));

		resolveLoad({ record: record('чужая правка') });
		await settle();

		expect(doc.inputText).toBe('чужая правка');
		expect(doc.remoteChange).toBeNull();
	});
});
