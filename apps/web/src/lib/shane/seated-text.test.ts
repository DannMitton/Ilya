/**
 * N.160 step 3: the stored seated text, and the heal that writes.
 *
 * THE THREE FREEZING PATHS of `memo-n160b-the-approach_r1_2026-09-21.md` s0,
 * each as the page composes them: the record's round trip through
 * `recordFromFields`, `validateRecord`, and `fieldsFromRecord`, then the
 * re-seat `transcribeText` runs (`seatedTextDiff` into `reseatByDiff`). The
 * page's own wiring is `+page.svelte`, which vitest cannot compile; the
 * browser walk covers it.
 *
 * The seats are placed from the fixture's engraved text on one line, as a
 * score that arrives with words seats them. The poem then becomes the same
 * words typed over four lines, with «непроглядная» and «безответная» whole.
 * Every address above line 0 dies in that change, so a re-seat that does not
 * run leaves most seats frozen, which `planHeal` counts.
 */

import { describe, expect, it } from 'vitest';
import { processText } from '$lib/pipeline';
import { emptyDiff } from '$lib/text-diff';
import type { LineData } from '$lib/types';
import { emptySongRecord, type SongRecord } from '$lib/library/types';
import { fieldsFromRecord, recordFromFields, validateRecord } from '$lib/library/library';
import { buildSlotQueue, firstPass, type PairingMap } from './pairings';
import { reseatByDiff } from './reseat';
import { seatedTextDiff } from './seated-text';
import { applyHeal, healLog, planHeal } from './heal';
import { wordGrid } from '$lib/pipeline';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { MusicXmlScoreParser } from '@ilya/score-parser';
import { parseXml } from './ingestion/mini-dom';
import { findCliticFolds, isCliticSeated, seatCliticFolds } from './clitic-seat';

const NOW = '2026-09-21T00:00:00.000Z';

function transcribe(text: string): LineData[] {
	return processText(text, { language: 'en' });
}

const ENGRAVED =
	'Комнатка тесная, тихая, милая; тень не проглядная, тень без ответная; ' +
	'дума глубокая, песня унылая; в бьющемся сердце надежда заветная,';

const TYPED = [
	'Комнатка тесная, тихая, милая;',
	'Тень непроглядная, тень безответная;',
	'Дума глубокая, песня унылая;',
	'В бьющемся сердце надежда заветная,',
].join('\n');

/** A song whose seats were placed from `poem`, one slot per note. */
function seatedSong(poem: string): { record: SongRecord; notes: string[] } {
	const queue = buildSlotQueue(transcribe(poem));
	const notes = queue.map((_, i) => `e${i}`);
	const record = { ...emptySongRecord('song', NOW), poem, pairings: firstPass(notes, queue) };
	return { record, notes };
}

/** A save and a load: what a reload does to the record. */
function reload(record: SongRecord): SongRecord {
	return validateRecord(JSON.parse(JSON.stringify(record)), record.id, NOW).record;
}

/** `transcribeText`'s re-seat, from the seated text to the poem. */
function transcribeSeats(map: PairingMap, notes: string[], seatedText: string, poem: string) {
	const lines = transcribe(poem);
	const { diff, before } = seatedTextDiff(seatedText, poem);
	const moved = reseatByDiff(map, notes, buildSlotQueue(lines), diff, before).map;
	return { map: moved, plan: planHeal(moved, lines, notes) };
}

function expectNothingFrozen(plan: ReturnType<typeof planHeal>) {
	expect(plan.counts.address).toBe(plan.seated);
	expect(plan.seated).toBeGreaterThan(0);
}

describe('N.160 step 3, the seated text', () => {
	it('control: re-seating from an empty session grid, as before, freezes the seats', () => {
		const { record, notes } = seatedSong(ENGRAVED);
		const lines = transcribe(TYPED);
		const moved = reseatByDiff(record.pairings, notes, buildSlotQueue(lines), emptyDiff(), []).map;
		const plan = planHeal(moved, lines, notes);
		expect(plan.counts.address).toBeLessThan(plan.seated);
	});

	it('path 1, Clear then a new poem: the seated text outlives the Clear and the seats follow', () => {
		const { record, notes } = seatedSong(ENGRAVED);
		// Clear: the poem empties, and the seats and their text stay.
		const cleared = recordFromFields(record, { ...fieldsFromRecord(record), inputText: '' });
		expect(cleared.poem).toBe('');
		expect(cleared.seatedText).toBe(ENGRAVED);
		expect(cleared.pairings).toBe(record.pairings);
		// A reload between the Clear and the paste changes nothing.
		const fields = fieldsFromRecord(reload(cleared));
		expect(fields.seatedText).toBe(ENGRAVED);
		// The paste: the first transcription re-seats from the seated text.
		const { plan } = transcribeSeats(fields.pairings, notes, fields.seatedText, TYPED);
		expectNothingFrozen(plan);
	});

	it('path 2, a reload inside the typing pause: the saved poem is newer than its seats, and they catch up', () => {
		const { record, notes } = seatedSong(ENGRAVED);
		// Typed and autosaved, but the pause had not ended, so no re-seat ran.
		const typed = recordFromFields(record, { ...fieldsFromRecord(record), inputText: TYPED });
		expect(typed.poem).toBe(TYPED);
		expect(typed.seatedText).toBe(ENGRAVED);
		// The reload, then the first transcription of the new session.
		const fields = fieldsFromRecord(reload(typed));
		const { plan } = transcribeSeats(fields.pairings, notes, fields.seatedText, fields.inputText);
		expectNothingFrozen(plan);
	});

	it('path 3, an edit while the dictionary loads: the first transcription diffs from the seated text', () => {
		const { record, notes } = seatedSong(ENGRAVED);
		// Loaded clean: no seated text is stored, and the page reads the poem.
		expect('seatedText' in record).toBe(false);
		const fields = fieldsFromRecord(reload(record));
		expect(fields.seatedText).toBe(ENGRAVED);
		// The singer edits before any transcription; the autosave keeps the seats' text.
		const edited = { ...fields, inputText: TYPED };
		expect(recordFromFields(record, edited).seatedText).toBe(ENGRAVED);
		// The dictionary lands, and the one transcription re-seats.
		const { plan } = transcribeSeats(edited.pairings, notes, edited.seatedText, edited.inputText);
		expectNothingFrozen(plan);
	});

	it('a song whose seats describe its poem never carries the field, and its record round-trips byte for byte', () => {
		const { record } = seatedSong(ENGRAVED);
		const back = recordFromFields(record, fieldsFromRecord(record));
		expect(JSON.stringify(back)).toBe(JSON.stringify(record));
		expect('seatedText' in back).toBe(false);
		// And once the seats catch up with the poem, the field goes away again.
		const behind = recordFromFields(record, { ...fieldsFromRecord(record), inputText: TYPED });
		const caughtUp = recordFromFields(behind, { ...fieldsFromRecord(behind), seatedText: TYPED });
		expect('seatedText' in caughtUp).toBe(false);
	});

	it('an older Ilya record, or a malformed field, loads', () => {
		const { record } = seatedSong(ENGRAVED);
		expect(validateRecord({ ...record, seatedText: 'x' }, 'song', NOW).record.seatedText).toBe('x');
		const bad = validateRecord({ ...record, seatedText: 7 }, 'song', NOW);
		expect(bad.reason).toBe('malformed');
		expect(bad.record.pairings).toEqual(record.pairings);
		expect(wordGrid('')).toEqual([]);
		expect(seatedTextDiff('', TYPED).diff.unchanged).toBe(true);
	});
});

describe('N.160 step 3, the heal that writes', () => {
	/* Dann's direction: seats placed from the whole words, a poem that now
	   has them split, and no re-seat between (a song frozen before the seated
	   text existed). */
	const frozen = () => {
		const { record, notes } = seatedSong(TYPED);
		return { map: record.pairings, notes, lines: transcribe(ENGRAVED) };
	};

	it('writes the anchor and joined seats, and a re-plan then finds every one at its address', () => {
		const { map, notes, lines } = frozen();
		const plan = planHeal(map, lines, notes);
		expect(plan.counts.anchor + plan.counts.joined).toBeGreaterThan(0);
		const { map: healed, wrote } = applyHeal(map, plan, lines);
		expect(wrote.length).toBe(plan.counts.anchor + plan.counts.joined);
		const after = planHeal(healed, lines, notes);
		expect(after.counts.address).toBe(after.seated);
		// Nothing but the written seats changed.
		const written = new Set(wrote.map((c) => c.eventId));
		for (const id of Object.keys(map)) {
			if (!written.has(id)) expect(healed[id]).toBe(map[id]);
		}
		expect(Object.keys(healed).sort()).toEqual(Object.keys(map).sort());
		// Written text is the poem's own syllable: the split word now draws «не».
		const ne = wrote.find((c) => c.word === 'непроглядная' && c.from.slot === 0)!;
		expect(healed[ne.eventId]).toMatchObject({ kind: 'syllable', cyrillic: 'не' });
	});

	it('leaves a rejected or unfound seat exactly as it is, and hands back the same map when it writes nothing', () => {
		const { record, notes } = seatedSong('Комнатка тесная,\nночь и мгла');
		const lines = transcribe('Комнатка тесная, день и свет');
		const plan = planHeal(record.pairings, lines, notes);
		expect(plan.counts.rejected + plan.counts.unfound).toBeGreaterThan(0);
		const { map, wrote } = applyHeal(record.pairings, plan, lines);
		expect(wrote).toHaveLength(0);
		expect(map).toBe(record.pairings);
		expect(healLog('song', plan, wrote)).toEqual([]);

		// A clean song: nothing to repair, the same map, no log.
		const clean = seatedSong(ENGRAVED);
		const cleanLines = transcribe(ENGRAVED);
		const none = applyHeal(clean.record.pairings, planHeal(clean.record.pairings, cleanLines, clean.notes), cleanLines);
		expect(none.map).toBe(clean.record.pairings);
	});

	it('logs what it wrote, per song, in the dry run format', () => {
		const { map, notes, lines } = frozen();
		const plan = planHeal(map, lines, notes);
		const { wrote } = applyHeal(map, plan, lines);
		const log = healLog('song-1', plan, wrote);
		expect(log[0]).toBe(
			`[Ilya] N.160 heal, song song-1: wrote ${wrote.length} of ${plan.seated} seated = ` +
				`${plan.counts.anchor} anchor + ${plan.counts.joined} joined; left 0 rejected + 0 unfound as they were.`,
		);
		expect(log.find((l) => l.startsWith('[Ilya] N.160 heal, wrote joined ('))).toMatch(
			/«непроглядная» 1-1\.0 -> 0-5\.0 by|«непроглядная» 1-1\.0 -> 0-5\.0/,
		);
		const listed = log.slice(1).flatMap((l) => l.split(': ').slice(1).join(': ').split(' | '));
		expect(listed).toHaveLength(wrote.length);
	});
});

describe('N.160 step 3, the clitic seat recognizes a healed note', () => {
	it('«В бью» from a capitalized poem is the fold\'s «в бью», so a reload rewrites nothing', async () => {
		const xml = readFileSync(
			fileURLToPath(new URL('./ingestion/fixtures/sunless-01-engraved.musicxml', import.meta.url)),
			'utf8',
		);
		const parsed = (
			await new MusicXmlScoreParser().parse({
				format: 'musicxml',
				data: parseXml(xml) as unknown as Document,
				sourcePath: 'sunless-01-engraved.musicxml',
			})
		).score;
		const [fold] = findCliticFolds(parsed, 1);
		expect(fold.seat[0].cyrillic).toBe('в\u00a0бью');
		const seated = seatCliticFolds(parsed, {});
		const healed: PairingMap = {
			...seated,
			[fold.cliticEventId]: { ...seated[fold.cliticEventId], cyrillic: 'В\u00a0бью' } as PairingMap[string],
		};
		expect(isCliticSeated(healed, fold)).toBe(true);
		expect(seatCliticFolds(parsed, healed)).toBe(healed);
		// Control: a different text on that note is still not the fold's seat.
		const other: PairingMap = {
			...seated,
			[fold.cliticEventId]: { ...seated[fold.cliticEventId], cyrillic: 'на' } as PairingMap[string],
		};
		expect(isCliticSeated(other, fold)).toBe(false);
	});
});
