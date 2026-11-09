/**
 * Row 181 step 1 (review amendment 1): the extender rides with the reading. A scan read with an extender, stored, reopened:
 * the notes under the line are continuations on both paths (`isContinuation` on the scan path; `{ kind: 'melisma' }` on the
 * typed path), and an authored score's own `<extend>` is not read.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { MusicXmlScoreParser, type ScoreParser } from '@ilya/score-parser';
import { parseXml } from '$lib/score/ingestion/mini-dom';
import { ingestScoreFile, type IngestDeps } from '$lib/score/ingestion/ingest';
import { withExtenderMelismas } from '$lib/score/slur-seat';
import type { PairingMap } from '$lib/score/pairings';
import { EXTEND_FIELD, extenderMelismaIds, hasExtenders, markExtenders } from './extend-convention';
import { voiceNotes } from './underlay-prepare';
import { markUnreadBars } from './unread-bars';
import { writeLyrics, type Word } from './underlay-words';

const fixture = readFileSync(new URL('./fixtures/tch-3.musicxml', import.meta.url), 'utf8');
const sung = voiceNotes(fixture).filter((n) => !n.rest);
const syl = (k: number, text: string, sustained: boolean) => ({ note: sung[k].ordinal, text, syllabic: 'single' as const, sustained });
const one = (...s: ReturnType<typeof syl>[]): Word[] => s.map((y) => ({ syllables: [y] }));

const musicxmlParser: ScoreParser = {
	canParse: () => true,
	parse: (input) => new MusicXmlScoreParser().parse({ ...input, data: parseXml(input.data as string) as unknown as Document }),
};
const ingestDeps = { scoreReader: { convert: async () => { throw new Error('not reached'); }, dispose: () => {} }, musicxmlParser } as unknown as IngestDeps;
async function arrive(xml: string) {
	const out = await ingestScoreFile(new File([xml], 'song.musicxml', { type: 'application/vnd.recordare.musicxml+xml' }), ingestDeps);
	if (!out.ok) throw new Error('ingest failed');
	return out.ingested;
}

/**
 * Sung notes 2 and 5 carry a word; note 2's is sustained, so sung notes 3 and 4 (the bar 2 notes that follow it) are under its line.
 * In this fixture sung notes 0 and 1 are in bar 1 and note 2 follows two rests in bar 2: a line never runs across a rest.
 */
const written = markExtenders(writeLyrics(fixture, one(syl(2, 'Средь', true), syl(5, 'шум', false))));

describe('the writer', () => {
	it('writes <extend> inside the lyric of a sustained syllable and nowhere else', () => {
		const out = writeLyrics(fixture, one(syl(2, 'Средь', true), syl(5, 'шум', false)));
		expect(out.match(/<extend\b/g)).toHaveLength(1);
		expect(out.match(/<lyric[\s\S]*?<\/lyric>/g)?.map((l) => l.includes('<extend'))).toEqual([true, false]);
	});

	it('leaves the file as it was, byte for byte, once the lyric blocks are taken out', () => {
		const out = writeLyrics(fixture, one(syl(0, 'Средь', true)));
		expect(out.replace(/[ \t]*<lyric number="1">[\s\S]*?<\/lyric>\r?\n/, '')).toBe(fixture);
	});

	it('writes the field only when an <extend> is inside a lyric, and once', () => {
		expect(hasExtenders(written)).toBe(true);
		expect(written.match(new RegExp(EXTEND_FIELD, 'g'))).toHaveLength(1);
		expect(markExtenders(written)).toBe(written);
		const plain = writeLyrics(fixture, one(syl(0, 'Средь', false)));
		expect(markExtenders(plain)).toBe(plain);
		expect(hasExtenders(plain)).toBe(false);
	});

	it('shares the identification slot with the unread bars, each field intact', () => {
		const both = markExtenders(markUnreadBars(writeLyrics(fixture, one(syl(0, 'Средь', true))), [[4, 6]]));
		expect(both).toContain('ilya-words-unread-bars');
		expect(hasExtenders(both)).toBe(true);
	});
});

describe('the reader, through the ingestion that every MusicXML passes', () => {
	it('names the notes the line sustains: those after the sustained syllable up to the next lyric', async () => {
		const ingested = await arrive(written);
		const warning = ingested.result.warnings.find((w) => w.code === 'extender-notes');
		const events = ingested.result.score.vocalLine.filter((e) => e.type === 'note');
		expect(warning?.eventIds).toEqual([events[3].id, events[4].id]);
	});

	it('stops a line at the rest after it: a syllable sustained on the last note before a rest sustains nothing', async () => {
		const stopped = markExtenders(writeLyrics(fixture, one(syl(0, 'Средь', true))));
		const events = (await arrive(stopped)).result.score.vocalLine.filter((e) => e.type === 'note');
		// Sung note 1 follows it in the same bar; the rest of the next bar ends the line, and note 2 carries no lyric but is not reached.
		expect((await arrive(stopped)).result.warnings.find((w) => w.code === 'extender-notes')?.eventIds).toEqual([events[1].id]);
	});

	it('is read again, the same, when the stored reading is reopened (the second opening of the song)', async () => {
		const first = (await arrive(written)).result.warnings.find((w) => w.code === 'extender-notes');
		const second = (await arrive(written)).result.warnings.find((w) => w.code === 'extender-notes');
		expect(second?.eventIds).toEqual(first?.eventIds);
	});

	it('does not read an authored score\'s <extend>: no field, no warning', async () => {
		const authored = writeLyrics(fixture, one(syl(2, 'Средь', true), syl(5, 'шум', false)));
		expect(hasExtenders(authored)).toBe(false);
		expect((await arrive(authored)).result.warnings.some((w) => w.code === 'extender-notes')).toBe(false);
	});

	it('marks nothing across a rest, and names no note a tie already continues', () => {
		const events = [
			{ id: 'a', type: 'note' as const, measureIndex: 0 },
			{ id: 'b', type: 'note' as const, measureIndex: 0, tied: { type: 'stop' as const } },
			{ id: 'r', type: 'rest' as const, measureIndex: 0 },
			{ id: 'c', type: 'note' as const, measureIndex: 0 },
		];
		const note = (lyric: string, rest = false) => `<note>${rest ? '<rest/>' : '<pitch><step>C</step><octave>4</octave></pitch>'}${lyric}</note>`;
		const xml = `<score-partwise><identification><miscellaneous><miscellaneous-field name="${EXTEND_FIELD}">1</miscellaneous-field></miscellaneous></identification><part id="P1"><measure number="1">${note('<lyric><syllabic>single</syllabic><text>ты</text><extend type="start"/></lyric>')}${note('')}${note('', true)}${note('')}</measure></part></score-partwise>`;
		expect(extenderMelismaIds(xml, events)).toEqual({ ids: [], unaligned: 0 });
	});

	it('counts a bar it could not line up with the events, so a loss is reported and never silent', () => {
		const xml = `<score-partwise><identification><miscellaneous><miscellaneous-field name="${EXTEND_FIELD}">1</miscellaneous-field></miscellaneous></identification><part id="P1"><measure number="1"><note><pitch><step>C</step><octave>4</octave></pitch><lyric><text>ты</text><extend type="start"/></lyric></note><note><pitch><step>D</step><octave>4</octave></pitch></note></measure></part></score-partwise>`;
		const got = extenderMelismaIds(xml, [{ id: 'a', type: 'note', measureIndex: 0 }]);
		expect(got).toEqual({ ids: [], unaligned: 1 });
	});
});

describe('the typed path', () => {
	it('seats the notes under the line as melismas, over an empty map, and never over a decision already there', async () => {
		const ingested = await arrive(written);
		const ids = ingested.result.warnings.find((w) => w.code === 'extender-notes')?.eventIds ?? [];
		expect(ids).toHaveLength(2);
		const seated = withExtenderMelismas({}, ingested.result.warnings);
		expect(seated).toEqual({ [ids[0]]: { kind: 'melisma' }, [ids[1]]: { kind: 'melisma' } });
		const held: PairingMap = { [ids[0]]: { kind: 'empty' } };
		expect(withExtenderMelismas(held, ingested.result.warnings)[ids[0]]).toEqual({ kind: 'empty' });
	});

	it('returns the map itself where the song has no extender', async () => {
		const ingested = await arrive(writeLyrics(fixture, one(syl(0, 'Средь', false))));
		const map: PairingMap = {};
		expect(withExtenderMelismas(map, ingested.result.warnings)).toBe(map);
	});
});
