/**
 * barline-record.test.ts: the song keeps the singer's barlines and time signatures (QUEUE row 138, B4).
 *
 * Both are `NoteCorrection` fields, so they ride `SongRecord.corrections`, which `validateRecord` keeps whole
 * (`library.ts`, `isStringRecord`). This pins what Fable's review left NOT ESTABLISHED (finding 7): a record that carries
 * only a mark is not dropped, and the marks, the split notes, and the ties "Rebar the notes" writes survive a save and
 * load and a binder out and in. Runes are inert under vitest (`library.ts`, the header), so the round trip runs the pure
 * facade the document runs.
 */
import { describe, expect, it } from 'vitest';
import { fieldsFromRecord, recordFromFields, validateRecord } from './library';
import { exportBinder } from './exchange';
import { readBinder } from './binder';
import { emptySongRecord } from './types';
import type { CorrectionMap } from '$lib/score/correction';

const NOW = '2026-11-10T00:00:00.000Z';
const LATER = '2026-11-10T01:00:00.000Z';

/** What a time signature change with "Rebar the notes" leaves in the map: marks, a split note, its entered remainder, a tie. */
const marks: CorrectionMap = {
	'm0-0-1': { timeSignature: { beats: 3, beatType: 4, through: 'end' } },
	'm0-1-2': { base: 'quarter', dots: 0, tied: 'start' },
	'hand:1': { entered: { after: 'm0-1-2' }, base: 'quarter', dots: 0, type: 'note', pitch: { step: 'G', alter: 0, octave: 4 }, barline: 'before' },
	'm1-0-1': { barline: 'none' },
};

const reload = (record: unknown) => {
	const result = validateRecord(JSON.parse(JSON.stringify(record)), 'x', LATER);
	expect(result.reason).toBeUndefined();
	return result.record;
};

describe('a reload keeps every mark', () => {
	it('keeps a record that carries only a barline, only a time signature, and the split notes and ties beside them', () => {
		const base = emptySongRecord('x', NOW);
		const stored = recordFromFields(base, { ...fieldsFromRecord(base), corrections: marks });
		expect(stored.corrections).toEqual(marks);
		expect(fieldsFromRecord(reload(stored)).corrections).toEqual(marks);
	});

	it('survives a binder out and in', async () => {
		const record = { ...emptySongRecord('a', NOW), name: 'Marked', corrections: marks };
		const result = await exportBinder({
			ids: ['a'], openId: 'a', openRecord: record, load: async () => ({ record }), loadSource: async () => null,
			appVersion: '2026a', exportedAt: NOW, today: '10 November 2026', untitled: 'Untitled',
		});
		expect(result.ok).toBe(true);
		if (!result.ok) return;
		const read = await readBinder(result.bytes, NOW);
		expect(read.ok).toBe(true);
		if (!read.ok) return;
		expect(read.songs[0].record.corrections).toEqual(marks);
	});

	it('a song with no marks writes the same record it always did', () => {
		const base = emptySongRecord('x', NOW);
		const plain: CorrectionMap = { 'm0-0-1': { dots: 1 } };
		const stored = recordFromFields(base, { ...fieldsFromRecord(base), corrections: plain });
		expect(JSON.stringify(stored.corrections)).toBe('{"m0-0-1":{"dots":1}}');
	});
});
