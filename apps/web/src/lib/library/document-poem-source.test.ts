/**
 * document-poem-source.test.ts: the document carries `poemSource` (poem library, build 1, step 4).
 *
 * The three places in `document.svelte.ts` that must name the field are its `$state`, `#snapshot`, and `#apply`.
 * Runes are inert under vitest, so the autosave effect does not run here; what is checked is that a loaded record
 * fills the field (`#apply`), that the record the document builds carries it (`#snapshot` through `toRecord`),
 * and that a record from another tab replaces it (`#apply` again).
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SongDocument } from './document.svelte';
import { LIBRARY_CHANNEL } from './channel';
import type { Library, SaveScheduler } from './library';
import { emptySongRecord, type LoadResult, type PoemSource, type SongRecord } from './types';

const NOW = '2026-11-03T00:00:00.000Z';
const REMOTE_AT = '2026-11-03T00:00:07.000Z';
const source: PoemSource = { id: '0127a63ffe', work: '0127a63f', poemHash: 'a97f2074', start: 0, end: 375, answered: false, edited: false };

const recordWith = (over: Partial<SongRecord> = {}): SongRecord => ({ ...emptySongRecord('song', NOW), poem: 'Дайте бокалы', ...over });

function libraryReturning(result: LoadResult): Library {
	return { lastSavedAt: null, load: vi.fn(async () => result) } as unknown as Library;
}
const idleScheduler = (): SaveScheduler => ({ schedule: () => {}, flush: async () => {}, isPending: () => false, dispose: () => {} });

const open: SongDocument[] = [];
const channels: BroadcastChannel[] = [];
afterEach(async () => {
	for (const doc of open.splice(0)) await doc.close();
	for (const channel of channels.splice(0)) channel.close();
});
const doc = (record: SongRecord, library: Library = libraryReturning({ record })): SongDocument => {
	const d = SongDocument.fromLoaded(library, { record }, idleScheduler);
	open.push(d);
	return d;
};

describe('SongDocument.poemSource', () => {
	it('is null for a song with none', () => {
		expect(doc(recordWith()).poemSource).toBeNull();
	});

	it('is filled from the loaded record (#apply)', () => {
		const d = doc(recordWith({ publishedPoem: 'Дайте бокалы!', poemSource: source }));
		expect(d.poemSource).toEqual(source);
		expect(d.publishedPoem).toBe('Дайте бокалы!');
	});

	it('is carried into the record the document builds (#snapshot), and out of it when null', () => {
		const d = doc(recordWith({ publishedPoem: 'Дайте бокалы!', poemSource: source }));
		expect(d.toRecord().poemSource).toEqual(source);

		d.poemSource = { ...source, answered: true, edited: true };
		expect(d.toRecord().poemSource).toEqual({ ...source, answered: true, edited: true });

		d.poemSource = null;
		expect('poemSource' in d.toRecord()).toBe(false);
	});

	it('is replaced by a record that arrives from another tab (#apply again)', async () => {
		const remote = recordWith({ publishedPoem: 'Дайте бокалы!', poemSource: { ...source, answered: true } });
		const d = doc(recordWith({ publishedPoem: 'Дайте бокалы!', poemSource: source }), libraryReturning({ record: remote }));
		expect(d.poemSource!.answered).toBe(false);

		const other = new BroadcastChannel(LIBRARY_CHANNEL);
		channels.push(other);
		other.postMessage({ songId: 'song', updatedAt: REMOTE_AT });
		await vi.waitFor(() => expect(d.poemSource!.answered).toBe(true));
	});
});
