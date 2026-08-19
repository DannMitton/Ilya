/**
 * positive-control.test.ts — N.67 step 6, brief §3.8.
 *
 * **THE CONTROL, AND IT IS DELETED WITH THIS COMMENT IF IT EVER PASSES FOR THE
 * WRONG REASON.** The brief asked for proof that a corrupt record on the code
 * as it stood either vanished, crashed, or was silently overwritten, because if
 * the tree already handled it then §0.2 of the brief is partly wrong.
 *
 * IT WAS SILENTLY OVERWRITTEN. Three sites read a record, got the REBUILT
 * stand-in with the damage already removed, and wrote it straight back:
 * `backfillName` at boot (`index.ts`), `renameSong` (`songs.ts`), and the
 * document's autosave (`document.svelte.ts`). Each of them called
 * `library.save(loaded.record)`, and `loaded.record` is `validateRecord`'s
 * rebuild. The test below performs exactly that call, which is what those three
 * sites did, and measures what is left in the vault afterwards.
 *
 * The reconstruction is honest but it is a RECONSTRUCTION: the guards are in
 * the tree now, so the old path cannot be run through its own call sites any
 * more. What is run is the one line all three of them shared.
 */
import { describe, it, expect } from 'vitest';
import { Library, validateRecord } from './library';
import { createMemoryDriver } from './driver';
import type { SongRecord } from './types';

const NOW = '2026-08-18T00:00:00.000Z';

function damaged(): Record<string, unknown> {
	return {
		schema: 1,
		id: 'damaged',
		// Empty, which is what made `backfillName` fire on it at every boot.
		name: '',
		createdAt: '2026-08-01T00:00:00.000Z',
		updatedAt: '2026-08-02T00:00:00.000Z',
		poem: 42,
		metadata: { title: 'Сонет 90', composer: 'Кабалевский', poet: '', translator: '', opus: '', transcriber: '' },
		fromScore: [],
		glosses: [],
		openSyllabification: false,
		pairings: { 'ev-1': { syllable: 'я', vowel: 'a' } },
		source: null,
	};
}

describe('the positive control: what a corrupt record used to cost', () => {
	it('did not crash and did not vanish. It was quietly emptied and written back', async () => {
		const driver = createMemoryDriver([damaged() as unknown as SongRecord]);
		const library = new Library(driver);

		const loaded = await library.load('damaged');
		// No crash: the load reports rather than throws, which was already true
		// and is what kept the page rendering.
		expect(loaded.reason).toBe('malformed');

		// THE LINE ALL THREE OLD SITES SHARED.
		await library.save(loaded.record);

		const after = (await driver.load('damaged')).record as unknown as Record<string, unknown>;
		// The poem is gone from the vault, and nothing said so. The record still
		// exists, still opens, and is now permanently missing what it held.
		expect(after.poem).toBe('');
		// And it reads WHOLE afterwards, so nothing downstream could ever tell
		// that a song had been damaged: the evidence is destroyed with the work.
		expect(validateRecord(after, 'damaged', NOW).reason).toBeUndefined();
	});
});
