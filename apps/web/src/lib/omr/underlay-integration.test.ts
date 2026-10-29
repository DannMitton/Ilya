/**
 * The underlay through the reader (N.135 stage 2b): `makeReader` with a fake
 * recognizer that answers with real homr readings (the fixtures), and a fake
 * `ReadUnderlay` that returns a fixed seat list. The joined MusicXML then
 * carries the `<lyric>`s, `no-lyrics-found` does not fire, and
 * `collectScoreWords` returns the words in order; and where a page does not
 * pass, does not answer, or throws, the song is joined exactly as it is with no
 * underlay reader at all.
 */
import { readFileSync } from 'node:fs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Recognizer } from 'homr-web';
import { MusicXmlScoreParser } from '@ilya/score-parser';
import { parseXml } from '$lib/score/ingestion/mini-dom';
import { collectScoreWords } from '$lib/score/vowel-resolver';
import { makeReader, type ReaderDeps } from './homr-reader';
import { voiceNotes } from './underlay-prepare';
import type { ReadUnderlay, UnderlayPage } from './underlay-page';
import type { Word } from './underlay-words';

const xmlOf = (name: string) => readFileSync(new URL(`./fixtures/${name}.musicxml`, import.meta.url), 'utf8');
const PAGES = ['tch-1', 'tch-2', 'tch-3'].map(xmlOf);
const STAVES = [{ cx: 0.5, cy: 0.2, w: 0.8, h: 0.05, index: 0 }];
const blobs = (n: number) => Array.from({ length: n }, () => new Blob(['png'], { type: 'image/png' }));

/** A recognizer that answers page i with PAGES[i], and the staff boxes. */
function recognizer(withStaves = true): Recognizer {
	let i = 0;
	return {
		backend: 'wasm',
		backendReason: 'test',
		recognizePage: async () => ({ ok: true, musicXml: PAGES[i++], ...(withStaves ? { staves: STAVES } : {}) }),
		dispose: async () => {},
	} as unknown as Recognizer;
}

function deps(underlay?: ReadUnderlay, withStaves = true): ReaderDeps {
	return { choose: async () => ({ prefer: 'wasm-threads', reason: null }), create: async () => recognizer(withStaves), ...(underlay ? { underlay } : {}) };
}

const stats = (unseated = 0) => ({
	systems: 1, banded: 1, rows: 1, russianRows: 1, systemsRussian: 1, tokens: 3, units: 3, cuts: { cut: 0, whole: 3, mismatched: 0 }, seated: 3, unseated, words: 3, known: 3,
});

/** The first `n` pitched notes of a page, sung the given syllables: one word of one syllable each. */
function page(xml: string, texts: string[], passes = true, unseated = 0): UnderlayPage {
	const notes = voiceNotes(xml).filter((x) => !x.rest);
	const words: Word[] = texts.map((text, i) => ({ syllables: [{ note: notes[i].ordinal, text, syllabic: 'single', sustained: false }] }));
	return { passes, why: passes ? null : 'no Russian row in system 1', words, stats: stats(unseated), ms: { prepare: 10, read: 20, seat: 1 } };
}

const WORDS = [['Средь', 'шумного'], ['бала', 'случайно'], ['в', 'тревоге']];
const answerAll: ReadUnderlay = async (_image, xml) => page(xml, WORDS[PAGES.indexOf(xml)]);

async function read(underlay: ReadUnderlay | undefined, n = 3, withStaves = true) {
	const result = await makeReader(deps(underlay, withStaves)).read(blobs(n));
	if (!result.ok) throw new Error(`${result.error}: ${result.log}`);
	return result.musicXml;
}

async function parse(musicXml: string) {
	return new MusicXmlScoreParser().parse({ format: 'musicxml', data: parseXml(musicXml) as unknown as Document, sourcePath: 'song.musicxml' });
}

afterEach(() => vi.restoreAllMocks());

describe('the words ride through the join', () => {
	it('joins a song with no underlay reader exactly as before, and the parser finds no lyrics in it', async () => {
		const plain = await read(undefined);
		expect(plain).not.toContain('<lyric');
		expect((await parse(plain)).warnings.map((w) => w.code)).toContain('no-lyrics-found');
	});

	it('writes the words of every page into the joined MusicXML, in the order of the song', async () => {
		const joined = await read(answerAll);
		expect(joined.match(/<lyric number="1">/g)).toHaveLength(6);
		const { score, warnings } = await parse(joined);
		expect(warnings.map((w) => w.code)).not.toContain('no-lyrics-found');
		expect(collectScoreWords(score, 1).map((w) => w.raw)).toEqual(WORDS.flat());
	});

	it('changes nothing else in the joined file: taking the lyrics out gives the join of the pages as they were', async () => {
		const plain = await read(undefined);
		const joined = await read(answerAll);
		expect(joined.replace(/[ \t]*<lyric number="1">[\s\S]*?<\/lyric>\r?\n/g, '')).toBe(plain);
	});

	it('puts a syllable on the note of its ordinal in its own page', async () => {
		const joined = await read(answerAll, 1);
		const { score } = await parse(joined);
		const sung = score.vocalLine.filter((e) => e.type !== 'rest');
		const words = collectScoreWords(score, 1);
		expect(words.flatMap((w) => w.cells.map((c) => c.eventId))).toEqual(sung.slice(0, 2).map((e) => e.id));
	});
});

describe('where the words are not written, the song is joined as it was', () => {
	it('writes nothing where one page of the song does not pass', async () => {
		const plain = await read(undefined);
		const log = vi.spyOn(console, 'info').mockImplementation(() => {});
		const second: ReadUnderlay = async (_i, xml) => page(xml, WORDS[PAGES.indexOf(xml)], PAGES.indexOf(xml) !== 1);
		expect(await read(second)).toBe(plain);
		expect(log.mock.calls.map((c) => String(c[0])).join('\n')).toContain('page 2 does not pass (no Russian row in system 1), so the words are not written');
	});

	it('writes nothing where one page answers null', async () => {
		const plain = await read(undefined);
		const log = vi.spyOn(console, 'info').mockImplementation(() => {});
		const nullSecond: ReadUnderlay = async (_i, xml) => (PAGES.indexOf(xml) === 2 ? null : page(xml, WORDS[PAGES.indexOf(xml)]));
		expect(await read(nullSecond)).toBe(plain);
		expect(log.mock.calls.map((c) => String(c[0])).join('\n')).toContain('page 3 could not be read');
	});

	it('writes nothing, and says why in one console line, where the reader throws', async () => {
		const plain = await read(undefined);
		const log = vi.spyOn(console, 'info').mockImplementation(() => {});
		const throwing: ReadUnderlay = () => {
			throw new Error('the model did not load');
		};
		expect(await read(throwing)).toBe(plain);
		const lines = log.mock.calls.map((c) => String(c[0]));
		expect(lines.filter((l) => l.includes('the model did not load'))).toHaveLength(3);
		expect(lines.some((l) => l.includes('the words are not written'))).toBe(true);
	});

	it('writes nothing where the reader rejects', async () => {
		const plain = await read(undefined);
		vi.spyOn(console, 'info').mockImplementation(() => {});
		expect(await read(async () => Promise.reject(new Error('a fetch failed')))).toBe(plain);
	});

	it('writes nothing where homr gave no staff boxes to read the underlay by', async () => {
		let called = 0;
		const counting: ReadUnderlay = async (_i, xml) => (called++, page(xml, ['х']));
		vi.spyOn(console, 'info').mockImplementation(() => {});
		expect(await read(counting, 3, false)).toBe(await read(undefined, 3, false));
		expect(called).toBe(0);
	});

	it('writes nothing where no page found a voice staff with words', async () => {
		vi.spyOn(console, 'info').mockImplementation(() => {});
		const empty: ReadUnderlay = async (_i, xml) => ({ ...page(xml, []), words: [] });
		expect(await read(empty)).toBe(await read(undefined));
	});

	it('does not call the underlay reader where there is none', async () => {
		expect(await read(undefined, 1)).toBe(await read(undefined, 1));
	});
});

describe('the report of a read', () => {
	it('says how many syllables were written and how many units were left unseated', async () => {
		const log = vi.spyOn(console, 'info').mockImplementation(() => {});
		const unseated: ReadUnderlay = async (_i, xml) => page(xml, WORDS[PAGES.indexOf(xml)], true, 2);
		await read(unseated);
		expect(log.mock.calls.map((c) => String(c[0])).join('\n')).toContain('6 syllables written on 3 of 3 pages, 6 units left unseated');
	});
});
