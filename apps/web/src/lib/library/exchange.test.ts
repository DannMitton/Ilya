/**
 * exchange.test.ts — N.67 step 5, the remainder.
 *
 * The defect this step closes is a SILENT OVERWRITE: before it, an import
 * called `library.save` on whatever the file held and never once asked whether
 * that id was already spoken for. So these tests are weighted toward the three
 * answers of design §5 doing exactly what they say, and toward "keep both"
 * producing a copy that is genuinely independent of the original.
 */
import { describe, it, expect, vi } from 'vitest';
import {
	exportBinder,
	importBinder,
	collisionName,
	keepBoth,
	libraryBinderName,
	binderFailureKey,
	importNoticeKey,
	type CollisionAnswer,
	type Collision,
	type ImportOutcome,
} from './exchange';
import { readBinder, type BinderSong } from './binder';
import { utf8 } from './zip-writer';
import { emptySongRecord, type SongRecord } from './types';
import { summarize, type SongSummary, type SourceBytes } from './driver';

const NOW = '2026-08-16T00:00:00.000Z';
const TODAY = '18 August 2026';

function record(id: string, over: Partial<SongRecord> = {}): SongRecord {
	return { ...emptySongRecord(id, NOW), ...over };
}

function source(songId: string, text: string, fileName = 'score.musicxml'): SourceBytes {
	const data = utf8(text);
	return {
		songId,
		fileName,
		bytes: data.buffer.slice(0) as ArrayBuffer,
		byteLength: data.byteLength,
		contentHash: 'hash',
		importedAt: NOW,
	};
}

function binderSong(rec: SongRecord, src: SourceBytes | null = null, name = ''): BinderSong {
	return { record: rec, source: src, name: name || rec.name };
}

/* ── Export ─────────────────────────────────────────────────────── */

describe('exportBinder', () => {
	function deps(over: Record<string, unknown> = {}) {
		return {
			ids: ['a'],
			openId: 'a',
			openRecord: record('a', { name: 'The open one', poem: 'live text' }),
			// N.67 step 6: the export takes the WHOLE load result, so an unreadable
			// record can carry its raw stored value into the binder beside it.
			load: async (id: string) => ({ record: record(id, { name: `Vault ${id}` }) }),
			loadSource: async () => null,
			appVersion: '2026a',
			exportedAt: NOW,
			today: TODAY,
			untitled: 'Untitled',
			...over,
		};
	}

	it('takes the OPEN song from the document, not from the vault', async () => {
		// The document holds edits the vault has not seen. Exporting the stored
		// copy would carry off a version the singer has already moved past.
		const result = await exportBinder(deps());

		expect(result.ok).toBe(true);
		if (!result.ok) return;
		const read = await readBinder(result.bytes, NOW);
		expect(read.ok).toBe(true);
		if (!read.ok) return;
		expect(read.songs[0].record.poem).toBe('live text');
		expect(read.songs[0].name).toBe('The open one');
	});

	it('takes every OTHER song from the vault', async () => {
		const result = await exportBinder(deps({ ids: ['a', 'b'] }));

		expect(result.ok).toBe(true);
		if (!result.ok) return;
		const read = await readBinder(result.bytes, NOW);
		expect(read.ok).toBe(true);
		if (!read.ok) return;
		expect(read.songs.map((s) => s.name)).toEqual(['The open one', 'Vault b']);
	});

	it('names a binder of ONE song after that song', async () => {
		const result = await exportBinder(deps());

		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.fileName).toBe('The open one.ilya');
		expect(result.songs).toBe(1);
	});

	it('names a binder of the LIBRARY after the tool and the day', async () => {
		// A binder of everything is not any song, so it cannot wear a song's name.
		const result = await exportBinder(deps({ ids: ['a', 'b', 'c'] }));

		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.fileName).toBe('Ilya, 18 August 2026.ilya');
		expect(result.songs).toBe(3);
	});

	it('routes the library binder’s name through the filesystem rules', async () => {
		expect(libraryBinderName('18/08/2026')).toBe('Ilya, 18/08/2026');
		const result = await exportBinder(deps({ ids: ['a', 'b'], today: '18/08/2026' }));

		expect(result.ok).toBe(true);
		if (!result.ok) return;
		// The slashes a filesystem refuses are gone, which they would not be had
		// the name bypassed `binderFileName`.
		expect(result.fileName).toBe('Ilya, 18 08 2026.ilya');
	});

	it('names an unnamed song rather than exporting a bare extension', async () => {
		const result = await exportBinder(
			deps({ openRecord: record('a'), ids: ['a'] }),
		);

		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.fileName).toBe('Untitled, 18 August 2026.ilya');
	});

	it('carries each song’s own score, and re-keys nothing', async () => {
		const result = await exportBinder(
			deps({
				ids: ['a', 'b'],
				loadSource: async (id: string) => source(id, `<score>${id}</score>`),
			}),
		);

		expect(result.ok).toBe(true);
		if (!result.ok) return;
		const read = await readBinder(result.bytes, NOW);
		expect(read.ok).toBe(true);
		if (!read.ok) return;
		expect(new TextDecoder().decode(read.songs[0].source!.bytes)).toBe('<score>a</score>');
		expect(new TextDecoder().decode(read.songs[1].source!.bytes)).toBe('<score>b</score>');
	});

	it('REPORTS a read that refused rather than throwing it at the caller', async () => {
		const result = await exportBinder(
			deps({
				ids: ['a', 'b'],
				load: async () => {
					throw new Error('the vault said no');
				},
			}),
		);

		expect(result).toEqual({ ok: false });
	});

	it('refuses to write a binder of nothing', async () => {
		expect(await exportBinder(deps({ ids: [] }))).toEqual({ ok: false });
	});
});

/* ── Import ─────────────────────────────────────────────────────── */

describe('importBinder', () => {
	function vault(seed: SongRecord[] = []) {
		const songs = new Map(seed.map((r) => [r.id, r]));
		const sources = new Map<string, SourceBytes | null>();
		return {
			songs,
			sources,
			existing: (): SongSummary[] => [...songs.values()].map(summarize),
			save: async (rec: SongRecord, src: SourceBytes | null) => {
				songs.set(rec.id, rec);
				sources.set(rec.id, src);
				return { ok: true };
			},
		};
	}

	function ids(): () => string {
		let n = 0;
		return () => `new-${++n}`;
	}

	const never = async (): Promise<CollisionAnswer> => {
		throw new Error('should not have been asked');
	};

	it('imports a song the library does not have, with no prompt at all', async () => {
		const v = vault();
		const ask = vi.fn(never);

		const outcome = await importBinder({
			songs: [binderSong(record('fresh', { name: 'A new one' }), source('fresh', '<score/>'))],
			existing: v.existing(),
			save: v.save,
			ask,
			newId: ids(),
			openId: 'open',
		});

		expect(ask).not.toHaveBeenCalled();
		expect(outcome).toEqual({ added: 1, replaced: 0, skipped: 0, replacedOpen: false, failed: false });
		expect(v.songs.get('fresh')!.name).toBe('A new one');
		expect(v.sources.get('fresh')!.songId).toBe('fresh');
	});

	it('ASKS when the id is already in the library, and shows both songs', async () => {
		// This is the defect the step closes. Before it, the save below ran
		// unconditionally and the singer was never told.
		const mine = record('same', { name: 'Mine', updatedAt: '2026-08-01T00:00:00.000Z' });
		const v = vault([mine]);
		let seen: Collision | null = null;

		await importBinder({
			songs: [binderSong(record('same', { name: 'Theirs', updatedAt: '2026-08-17T00:00:00.000Z' }))],
			existing: v.existing(),
			save: v.save,
			ask: async (c) => {
				seen = c;
				return 'mine';
			},
			newId: ids(),
			openId: 'open',
		});

		expect(seen!.mine.updatedAt).toBe('2026-08-01T00:00:00.000Z');
		expect(seen!.incoming.record.updatedAt).toBe('2026-08-17T00:00:00.000Z');
		expect(seen!.mine.name).toBe('Mine');
	});

	it('"keep mine" writes NOTHING', async () => {
		const v = vault([record('same', { name: 'Mine', poem: 'the work I did' })]);
		const save = vi.fn(v.save);

		const outcome = await importBinder({
			songs: [binderSong(record('same', { name: 'Theirs', poem: 'not mine' }))],
			existing: v.existing(),
			save,
			ask: async () => 'mine',
			newId: ids(),
			openId: 'open',
		});

		expect(save).not.toHaveBeenCalled();
		expect(outcome.skipped).toBe(1);
		expect(v.songs.get('same')!.poem).toBe('the work I did');
	});

	it('"take the one in this file" overwrites the stored record', async () => {
		const v = vault([record('same', { name: 'Mine', poem: 'the work I did' })]);

		const outcome = await importBinder({
			songs: [binderSong(record('same', { name: 'Theirs', poem: 'not mine' }), source('same', '<new/>'))],
			existing: v.existing(),
			save: v.save,
			ask: async () => 'take',
			newId: ids(),
			openId: 'open',
		});

		expect(outcome.replaced).toBe(1);
		expect(outcome.added).toBe(0);
		expect(v.songs.get('same')!.poem).toBe('not mine');
		expect(new TextDecoder().decode(v.sources.get('same')!.bytes)).toBe('<new/>');
	});

	it('DELETES the stored score when the file’s copy has none', async () => {
		// `null` deletes the bytes and `undefined` leaves them. Handing the
		// second here would leave the old score attached to the new record,
		// which is exactly the chimera step 4a exists to prevent.
		const v = vault([record('same', { name: 'Mine' })]);
		let passed: SourceBytes | null | undefined = undefined;

		await importBinder({
			songs: [binderSong(record('same'), null)],
			existing: v.existing(),
			save: async (rec, src) => {
				passed = src;
				return v.save(rec, src);
			},
			ask: async () => 'take',
			newId: ids(),
			openId: 'open',
		});

		expect(passed).toBeNull();
	});

	it('owes a reload ONLY when the song taken over is the one you are in', async () => {
		const v = vault([record('open'), record('other')]);

		const away = await importBinder({
			songs: [binderSong(record('other', { name: 'Theirs' }))],
			existing: v.existing(),
			save: v.save,
			ask: async () => 'take',
			newId: ids(),
			openId: 'open',
		});
		expect(away.replacedOpen).toBe(false);

		const here = await importBinder({
			songs: [binderSong(record('open', { name: 'Theirs' }))],
			existing: v.existing(),
			save: v.save,
			ask: async () => 'take',
			newId: ids(),
			openId: 'open',
		});
		expect(here.replacedOpen).toBe(true);
	});

	it('never owes a reload for "keep mine" or "keep both", even on the open song', async () => {
		const v = vault([record('open', { name: 'Mine' })]);

		for (const answer of ['mine', 'both'] as CollisionAnswer[]) {
			const outcome = await importBinder({
				songs: [binderSong(record('open', { name: 'Mine' }))],
				existing: v.existing(),
				save: v.save,
				ask: async () => answer,
				newId: ids(),
				openId: 'open',
			});
			expect(outcome.replacedOpen).toBe(false);
		}
	});

	it('"keep both" re-ids the copy and numbers its name', async () => {
		const v = vault([record('same', { name: 'Kabalevsky, Сонет 90' })]);

		const outcome = await importBinder({
			songs: [
				binderSong(
					record('same', { name: 'Kabalevsky, Сонет 90', poem: 'incoming' }),
					source('same', '<score/>'),
				),
			],
			existing: v.existing(),
			save: v.save,
			ask: async () => 'both',
			newId: ids(),
			openId: 'open',
		});

		expect(outcome).toEqual({ added: 1, replaced: 0, skipped: 0, replacedOpen: false, failed: false });
		expect(v.songs.get('same')!.poem).toBe('');
		expect(v.songs.get('new-1')!.poem).toBe('incoming');
		expect(v.songs.get('new-1')!.name).toBe('Kabalevsky, Сонет 90 (2)');
	});

	it('"keep both" MOVES THE SOURCE’S OWN ID TOO', async () => {
		// `SourceBytes.songId` is the sources store's key. A copy whose bytes
		// still name the old song attaches its score to the wrong record, and
		// then both songs draw the same music.
		const v = vault([record('same', { name: 'Mine' })]);

		await importBinder({
			songs: [binderSong(record('same', { name: 'Mine' }), source('same', '<score/>'))],
			existing: v.existing(),
			save: v.save,
			ask: async () => 'both',
			newId: ids(),
			openId: 'open',
		});

		expect(v.sources.get('new-1')!.songId).toBe('new-1');
		// And the original's bytes were not touched on the way past.
		expect(v.sources.has('same')).toBe(false);
	});

	it('numbers past a name the library ALREADY had numbered', async () => {
		const v = vault([record('same', { name: 'Song' }), record('other', { name: 'Song (2)' })]);

		await importBinder({
			songs: [binderSong(record('same', { name: 'Song' }))],
			existing: v.existing(),
			save: v.save,
			ask: async () => 'both',
			newId: ids(),
			openId: 'open',
		});

		expect(v.songs.get('new-1')!.name).toBe('Song (3)');
	});

	it('leaves an UNNAMED copy unnamed, because there is nothing to number', async () => {
		const v = vault([record('same')]);

		await importBinder({
			songs: [binderSong(record('same'), null)],
			existing: v.existing(),
			save: v.save,
			ask: async () => 'both',
			newId: ids(),
			openId: 'open',
		});

		expect(v.songs.get('new-1')!.name).toBe('');
	});

	it('asks ONCE PER COLLIDING SONG, in manifest order', async () => {
		const v = vault([record('a', { name: 'A' }), record('b', { name: 'B' })]);
		const asked: string[] = [];

		const outcome = await importBinder({
			songs: [
				binderSong(record('a', { name: 'A' })),
				binderSong(record('fresh', { name: 'Fresh' })),
				binderSong(record('b', { name: 'B' })),
			],
			existing: v.existing(),
			save: v.save,
			ask: async (c) => {
				asked.push(c.mine.id);
				return 'mine';
			},
			newId: ids(),
			openId: 'open',
		});

		expect(asked).toEqual(['a', 'b']);
		expect(outcome).toEqual({ added: 1, replaced: 0, skipped: 2, replacedOpen: false, failed: false });
	});

	it('sees what THIS RUN has already added, not only what was there at the start', async () => {
		// A binder that carries the same song twice must collide with the copy
		// the first pass just wrote, not sail past it.
		const v = vault();
		const asked: string[] = [];

		await importBinder({
			songs: [binderSong(record('twice', { name: 'Twice' })), binderSong(record('twice', { name: 'Twice' }))],
			existing: v.existing(),
			save: v.save,
			ask: async (c) => {
				asked.push(c.mine.id);
				return 'both';
			},
			newId: ids(),
			openId: 'open',
		});

		expect(asked).toEqual(['twice']);
		expect(v.songs.get('new-1')!.name).toBe('Twice (2)');
	});

	it('a REFUSED WRITE is reported, and the songs after it still run', async () => {
		const v = vault();
		let calls = 0;

		const outcome = await importBinder({
			songs: [binderSong(record('a', { name: 'A' })), binderSong(record('b', { name: 'B' }))],
			existing: v.existing(),
			save: async (rec, src) => (++calls === 1 ? { ok: false } : v.save(rec, src)),
			ask: never,
			newId: ids(),
			openId: 'open',
		});

		expect(outcome.failed).toBe(true);
		expect(outcome.added).toBe(1);
		expect(v.songs.has('a')).toBe(false);
		expect(v.songs.has('b')).toBe(true);
	});

	it('a refused write does not make a later song think that name is taken', async () => {
		const v = vault();

		await importBinder({
			songs: [binderSong(record('a', { name: 'Song' })), binderSong(record('b', { name: 'Song' }))],
			existing: v.existing(),
			save: async (rec, src) => (rec.id === 'a' ? { ok: false } : v.save(rec, src)),
			ask: never,
			newId: ids(),
			openId: 'open',
		});

		// The singer's own duplicate names are never corrected (design §2.3), so
		// this is here to prove the FAILED write left no ghost behind, which it
		// would have done had the name been banked before the save landed.
		expect(v.songs.get('b')!.name).toBe('Song');
	});

	it('A DIALOG THAT FAILED IS NOT PERMISSION TO OVERWRITE', async () => {
		const v = vault([record('same', { name: 'Mine', poem: 'the work I did' })]);

		const outcome = await importBinder({
			songs: [binderSong(record('same', { poem: 'not mine' }))],
			existing: v.existing(),
			save: v.save,
			ask: async () => {
				throw new Error('the dialog fell over');
			},
			newId: ids(),
			openId: 'open',
		});

		expect(outcome.skipped).toBe(1);
		expect(v.songs.get('same')!.poem).toBe('the work I did');
	});

	it('never throws, whatever the vault and the dialog do', async () => {
		const outcome = await importBinder({
			songs: [binderSong(record('a')), binderSong(record('b'))],
			existing: [],
			save: async () => {
				throw new Error('boom');
			},
			ask: never,
			newId: ids(),
			openId: 'open',
		}).catch(() => 'THREW');

		expect(outcome).not.toBe('THREW');
	});
});

describe('keepBoth', () => {
	it('leaves the original completely alone', async () => {
		const original = record('same', { name: 'Song', poem: 'words' });
		const src = source('same', '<score/>');

		const [copy, copySource] = keepBoth({ record: original, source: src, name: 'Song' }, 'fresh', new Set(['Song']));

		expect(original.id).toBe('same');
		expect(src.songId).toBe('same');
		expect(copy.id).toBe('fresh');
		expect(copy.name).toBe('Song (2)');
		expect(copy.poem).toBe('words');
		expect(copySource!.songId).toBe('fresh');
	});

	it('falls back to the manifest’s name when the record carries none', async () => {
		const [copy] = keepBoth({ record: record('same'), source: null, name: 'From the manifest' }, 'fresh', new Set());

		expect(copy.name).toBe('From the manifest');
	});
});

/* ── What the singer is told ────────────────────────────────────── */

describe('binderFailureKey', () => {
	it('says the same sentence for the two "this is not an Ilya file" cases', () => {
		// To a singer they are one situation, and a file that is merely not a ZIP
		// must not be told it is damaged.
		expect(binderFailureKey('not-a-zip')).toBe('binder.err.notIlya');
		expect(binderFailureKey('not-a-binder')).toBe('binder.err.notIlya');
	});

	it('says the same sentence for "no songs" and "damaged"', () => {
		expect(binderFailureKey('no-songs')).toBe('binder.err.damaged');
		expect(binderFailureKey('malformed')).toBe('binder.err.damaged');
	});

	it('gives a newer schema its OWN sentence, because the file is fine', () => {
		expect(binderFailureKey('newer-schema')).toBe('binder.err.newer');
	});
});

describe('importNoticeKey', () => {
	function outcome(over: Partial<ImportOutcome> = {}): ImportOutcome {
		return { added: 0, replaced: 0, skipped: 0, replacedOpen: false, failed: false, ...over };
	}

	it('picks the singular on one and the plural on more', () => {
		expect(importNoticeKey(outcome({ added: 1 }))).toEqual({ key: 'binder.importedOne', count: 1 });
		expect(importNoticeKey(outcome({ added: 2 }))).toEqual({ key: 'binder.importedMany', count: 2 });
	});

	it('says NOTHING when nothing was added', () => {
		// "0 songs were added" is a sentence no singer needs, and English would
		// get the plural wrong there anyway.
		expect(importNoticeKey(outcome())).toBeNull();
		expect(importNoticeKey(outcome({ skipped: 3 }))).toBeNull();
	});

	it('does not count a song that was OVERWRITTEN as one that was added', () => {
		// Taking the file's copy adds nothing. The song it overwrote moves to the
		// top of the list, which is the change the singer can see.
		expect(importNoticeKey(outcome({ replaced: 2 }))).toBeNull();
		expect(importNoticeKey(outcome({ added: 1, replaced: 2 }))).toEqual({
			key: 'binder.importedOne',
			count: 1,
		});
	});
});

describe('collisionName, walk finding W1', () => {
	function collision(mine: Partial<SongSummary>): Collision {
		return {
			incoming: { record: record('same-id', { name: 'The file’s copy' }), source: null, name: 'The file’s copy' },
			mine: {
				id: 'same-id',
				name: '',
				createdAt: '2026-08-01T00:00:00.000Z',
				updatedAt: '2026-08-02T00:00:00.000Z',
				fingerprint: null,
				...mine,
			},
		};
	}

	it('names the song ALREADY IN THE LIBRARY, not the one in the file', () => {
		// They share an id, which is why they collided; they need not share a
		// name, and the singer is being asked what to do with theirs.
		expect(collisionName(collision({ name: 'Кабалевский, Сонет 90' }), 'Untitled')).toBe('Кабалевский, Сонет 90');
	});

	it('falls back to the placeholder the list already draws for an unnamed song', () => {
		// The dialog and the row behind it then say the same thing, which is the
		// whole point of naming it: two collisions in a row must read as two
		// questions rather than as one stubborn dialog.
		expect(collisionName(collision({}), 'Untitled')).toBe('Untitled, 2026-08-01');
		expect(collisionName(collision({}), 'Sans titre')).toBe('Sans titre, 2026-08-01');
	});
});
