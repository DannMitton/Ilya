/**
 * bar-answers-record.test.ts: the song keeps what the singer answered about a bar (corrections slice 3, r2).
 *
 * Runes are inert under vitest (`library.ts`, the header), so the round trip runs the pure facade the document
 * runs: `fieldsFromRecord`, `recordFromFields`, then `validateRecord`. The document's own three sites (its
 * `$state`, `#snapshot`, `#apply`) are checked through `SongDocument.toRecord`, as `document-poem-source.test.ts`
 * does for `poemSource`. A record that loses the field there would lose every answer on the next autosave.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { fieldsFromRecord, recordFromFields, validateRecord, type Library, type SaveScheduler } from './library';
import { SongDocument } from './document.svelte';
import { emptySongRecord, type LoadResult, type SongRecord } from './types';
import type { BarAnswers } from '$lib/score/bar-answers';

const NOW = '2026-11-05T00:00:00.000Z';
const LATER = '2026-11-05T01:00:00.000Z';

const answers: BarAnswers = {
	bars: {
		'1': { kind: 'matches-print', fingerprint: '4/4|nquarter.0,nquarter.0,nquarter.0' },
		'7': { kind: 'changed', fingerprint: '3/4|nhalf.1' },
	},
};

/** A record as storage hands it back: through JSON, as IndexedDB's structured clone and localStorage both do. */
const reload = (record: SongRecord): SongRecord => {
	const result = validateRecord(JSON.parse(JSON.stringify(record)), 'x', LATER);
	expect(result.reason).toBeUndefined();
	return result.record;
};

describe('a reload keeps every answer', () => {
	it('is absent by default, loads as empty, and a song without one writes none back', () => {
		const record = emptySongRecord('x', NOW);
		const fields = fieldsFromRecord(record);

		expect(fields.barAnswers).toEqual({ bars: {} });
		expect('barAnswers' in recordFromFields(record, fields)).toBe(false);
	});

	it('round-trips write, validateRecord, read', () => {
		const base = emptySongRecord('x', NOW);
		const stored = recordFromFields(base, { ...fieldsFromRecord(base), barAnswers: answers });

		expect(stored.barAnswers).toEqual(answers);
		expect(fieldsFromRecord(reload(stored)).barAnswers).toEqual(answers);
	});

	it('keeps the put-away flag beside the answers, and keeps a put-away with no answers', () => {
		const base = emptySongRecord('x', NOW);
		const both = recordFromFields(base, { ...fieldsFromRecord(base), barAnswers: { ...answers, putAway: true } });
		expect(fieldsFromRecord(reload(both)).barAnswers).toEqual({ ...answers, putAway: true });

		const only = recordFromFields(base, { ...fieldsFromRecord(base), barAnswers: { bars: {}, putAway: true } });
		expect(fieldsFromRecord(reload(only)).barAnswers).toEqual({ bars: {}, putAway: true });
	});

	it('drops the field from the stored record once nothing is answered', () => {
		const record = { ...emptySongRecord('x', NOW), barAnswers: answers };
		const next = recordFromFields(record, { ...fieldsFromRecord(record), barAnswers: { bars: {} } });
		expect('barAnswers' in next).toBe(false);
	});

	it('copies rather than aliasing the record’s objects', () => {
		const record = { ...emptySongRecord('x', NOW), barAnswers: answers };
		const fields = fieldsFromRecord(record);
		expect(fields.barAnswers).not.toBe(record.barAnswers);
		expect(fields.barAnswers.bars['1']).not.toBe(record.barAnswers!.bars['1']);

		const stored = recordFromFields(record, fields);
		expect(stored.barAnswers).not.toBe(fields.barAnswers);
		expect(stored.barAnswers!.bars['1']).not.toBe(fields.barAnswers.bars['1']);
	});
});

describe('a damaged answer field', () => {
	it('is reported malformed when the field is not an object', () => {
		for (const bad of ['yes', 7, [], true, null]) {
			const result = validateRecord({ barAnswers: bad }, 'x', NOW);
			expect(result.reason, JSON.stringify(bad)).toBe('malformed');
			expect(result.record.barAnswers).toBeUndefined();
		}
	});

	it('drops one answer that is not well formed and keeps the rest, without calling the song malformed (amendment 1)', () => {
		const result = validateRecord(
			{
				barAnswers: {
					bars: {
						'1': { kind: 'matches-print', fingerprint: '4/4|a' },
						'2': { kind: 'surprise', fingerprint: '4/4|b' },
						'3': { kind: 'changed' },
						'4': { kind: 'changed', fingerprint: 7 },
						'5': { kind: 'changed', fingerprint: '' },
						'6': 'changed',
						'x': { kind: 'changed', fingerprint: '4/4|c' },
						'1.5': { kind: 'changed', fingerprint: '4/4|d' },
						'-1': { kind: 'changed', fingerprint: '4/4|e' },
						'8': { kind: 'changed', fingerprint: '4/4|f' },
					},
				},
			},
			'x',
			NOW,
		);

		expect(result.reason).toBeUndefined();
		expect(result.record.barAnswers).toEqual({
			bars: { '1': { kind: 'matches-print', fingerprint: '4/4|a' }, '8': { kind: 'changed', fingerprint: '4/4|f' } },
		});
	});

	it('carries no field when every answer inside is dropped, and still does not call the song malformed', () => {
		const result = validateRecord({ barAnswers: { bars: { '1': { kind: 'nope', fingerprint: 'x' } } } }, 'x', NOW);
		expect(result.reason).toBeUndefined();
		expect(result.record.barAnswers).toBeUndefined();
	});

	it('drops a bars map that is not an object and a put-away that is not true, keeping what is sound', () => {
		const odd = validateRecord({ barAnswers: { bars: 'many', putAway: 'yes' } }, 'x', NOW);
		expect(odd.reason).toBeUndefined();
		expect(odd.record.barAnswers).toBeUndefined();

		const kept = validateRecord({ barAnswers: { bars: [], putAway: true } }, 'x', NOW);
		expect(kept.reason).toBeUndefined();
		expect(kept.record.barAnswers).toEqual({ bars: {}, putAway: true });
	});

	it('does not disturb the rest of the record', () => {
		const result = validateRecord({ poem: 'Я тебя любил', barAnswers: 'broken' }, 'x', NOW);
		expect(result.reason).toBe('malformed');
		expect(result.record.poem).toBe('Я тебя любил');
	});
});

describe('SongDocument carries the field (amendment 2)', () => {
	const recordWith = (over: Partial<SongRecord> = {}): SongRecord => ({ ...emptySongRecord('song', NOW), poem: 'Я тебя любил', ...over });
	const library = (record: SongRecord): Library => ({ lastSavedAt: null, load: vi.fn(async (): Promise<LoadResult> => ({ record })) }) as unknown as Library;
	const idle = (): SaveScheduler => ({ schedule: () => {}, flush: async () => {}, isPending: () => false, dispose: () => {} });
	const open: SongDocument[] = [];
	afterEach(async () => {
		for (const d of open.splice(0)) await d.close();
	});
	const doc = (record: SongRecord): SongDocument => {
		const d = SongDocument.fromLoaded(library(record), { record }, idle);
		open.push(d);
		return d;
	};

	it('is filled from the loaded record (#apply)', () => {
		expect(doc(recordWith({ barAnswers: answers })).barAnswers).toEqual(answers);
		expect(doc(recordWith()).barAnswers).toEqual({ bars: {} });
	});

	it('is carried into the record the document builds (#snapshot), so autosave does not strip it', () => {
		const d = doc(recordWith({ barAnswers: answers }));
		expect(d.toRecord().barAnswers).toEqual(answers);

		d.barAnswers = { bars: { '2': { kind: 'changed', fingerprint: '4/4|nhalf.0' } } };
		expect(d.toRecord().barAnswers).toEqual({ bars: { '2': { kind: 'changed', fingerprint: '4/4|nhalf.0' } } });

		d.barAnswers = { bars: {} };
		expect('barAnswers' in d.toRecord()).toBe(false);
	});
});
