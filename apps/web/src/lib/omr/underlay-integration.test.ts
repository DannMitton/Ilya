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
import { MusicXmlScoreParser, type ScoreParser } from '@ilya/score-parser';
import { parseXml } from '$lib/score/ingestion/mini-dom';
import { collectScoreWords } from '$lib/score/vowel-resolver';
import { makeReader, type ReaderDeps } from './homr-reader';
import { measureCount, voiceNotes } from './underlay-prepare';
import { readUnreadBars } from './unread-bars';
import { restoreScan } from './restore';
import { readingFile } from './scan';
import { scanStamp } from './underlay-switch';
import { ingestScoreFile, noticeText, scanNotice, type IngestDeps } from '$lib/score/ingestion/ingest';
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
	systems: 1, banded: 1, rows: 1, russianRows: 1, systemsRussian: 1, tokens: 3, units: 3, cuts: { cut: 0, whole: 3, mismatched: 0 }, seated: 3, unseated, words: 3, known: 3, clitics: { folded: 0, left: 0 },
});

/**
 * A page whose one system holds all the page's voice notes: it wrote the first `texts.length` syllables on the first notes
 * (one word of one syllable each), or, with `written` false, took no words.
 */
function page(xml: string, texts: string[], written = true, unseated = 0): UnderlayPage {
	const notes = voiceNotes(xml).filter((x) => !x.rest);
	const words: Word[] = written ? texts.map((text, i) => ({ syllables: [{ note: notes[i].ordinal, text, syllabic: 'single', sustained: false }] })) : [];
	const bars = notes.map((n) => n.bar);
	return {
		systems: [{ written, bars: [Math.min(...bars), Math.max(...bars)], why: written ? null : 'no Russian row' }],
		words,
		stats: stats(unseated),
		ms: { prepare: 10, read: 20, seat: 1 },
	};
}

const WORDS = [['Средь', 'шумного'], ['бала', 'случайно'], ['в', 'тревоге']];
const answerAll: ReadUnderlay = async (_image, xml) => page(xml, WORDS[PAGES.indexOf(xml)]);

async function read(underlay: ReadUnderlay | undefined, n = 3, withStaves = true) {
	const result = await makeReader(deps(underlay, withStaves)).read(blobs(n));
	if (!result.ok) throw new Error(`${result.error}: ${result.log}`);
	return result.musicXml;
}

const musicxmlParser: ScoreParser = {
	canParse: () => true,
	parse: (input) => new MusicXmlScoreParser().parse({ ...input, data: parseXml(input.data as string) as unknown as Document }),
};
const ingestDeps = { scoreReader: { convert: async () => { throw new Error('not reached'); }, dispose: () => {} }, musicxmlParser } as unknown as IngestDeps;

async function arrive(f: File) {
	const out = await ingestScoreFile(f, ingestDeps);
	if (!out.ok) throw new Error('ingest failed');
	return out.ingested;
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

/** Page `i`'s voice notes' first and last bar (homr's, from 1), and the song's: those plus the bars of the pages before it. */
function barsOfPage(i: number): { page: [number, number]; song: [number, number] } {
	const bars = voiceNotes(PAGES[i]).filter((n) => !n.rest).map((n) => n.bar);
	const before = PAGES.slice(0, i).reduce((n, xml) => n + measureCount(xml), 0);
	const page: [number, number] = [Math.min(...bars), Math.max(...bars)];
	return { page, song: [page[0] + before, page[1] + before] };
}

describe('a system that cannot be read loses only itself (brief r5 step 2)', () => {
	it('writes the words of the pages that passed where one page took none, and carries the SONG bars of that page in the joined file', async () => {
		const log = vi.spyOn(console, 'info').mockImplementation(() => {});
		const second: ReadUnderlay = async (_i, xml) => page(xml, WORDS[PAGES.indexOf(xml)], PAGES.indexOf(xml) !== 1);
		const joined = await read(second);
		expect(joined.match(/<lyric number="1">/g)).toHaveLength(4);
		const { page: own, song } = barsOfPage(1);
		expect(own[0]).toBe(1);
		expect(song[0]).toBeGreaterThan(own[0]);
		expect(readUnreadBars(joined)).toEqual([song]);
		const text = log.mock.calls.map((c) => String(c[0])).join('\n');
		expect(text).toContain(`no words in page 2 system 1 (bars ${song[0]} to ${song[1]}, no Russian row)`);
	});

	it('writes the words of the pages that answered where one page answers null, and names that page\'s bars', async () => {
		const log = vi.spyOn(console, 'info').mockImplementation(() => {});
		const nullThird: ReadUnderlay = async (_i, xml) => (PAGES.indexOf(xml) === 2 ? null : page(xml, WORDS[PAGES.indexOf(xml)]));
		const joined = await read(nullThird);
		expect(joined.match(/<lyric number="1">/g)).toHaveLength(4);
		expect(readUnreadBars(joined)).toEqual([barsOfPage(2).song]);
		expect(log.mock.calls.map((c) => String(c[0])).join('\n')).toContain('page 3 (bars');
	});

	it('is told as the song is told today where no page took a word: no bars ride in the file', async () => {
		vi.spyOn(console, 'info').mockImplementation(() => {});
		const none: ReadUnderlay = async (_i, xml) => page(xml, WORDS[PAGES.indexOf(xml)], false);
		const joined = await read(none);
		expect(joined).toBe(await read(undefined));
		expect(readUnreadBars(joined)).toEqual([]);
	});

	it('carries the bars through a parse as a warning, and the banner key and text follow', async () => {
		vi.spyOn(console, 'info').mockImplementation(() => {});
		const second: ReadUnderlay = async (_i, xml) => page(xml, WORDS[PAGES.indexOf(xml)], PAGES.indexOf(xml) !== 1);
		const { song } = barsOfPage(1);
		const got = await arrive(readingFile(new File([''], 'song.pdf'), await read(second)));
		const w = got.result.warnings.find((x) => x.code === 'words-partly-read');
		expect(w?.bars).toEqual([song]);
		expect(got.result.warnings.map((x) => x.code)).not.toContain('no-lyrics-found');
		const notice = scanNotice(got.result.warnings, got.provenance, got.result.score.source.origin, 'song.pdf');
		expect(notice).toEqual({ key: 'upload.banner.wordsPartlyRead', arg: `${song[0]}-${song[1]}` });
		expect(noticeText(notice!.key, 'en', notice!.arg)).toContain(`it could not read the words in bars ${song[0]} to ${song[1]}.`);
	});

	it('returns the banner when the song is reopened from its kept reading: the bars ride with the reading, beside its stamp', async () => {
		vi.spyOn(console, 'info').mockImplementation(() => {});
		const second: ReadUnderlay = async (_i, xml) => page(xml, WORDS[PAGES.indexOf(xml)], PAGES.indexOf(xml) !== 1);
		const { song } = barsOfPage(1);
		const first = await restoreScan(new File([], 'a.pdf'), 'pdf', null, async () => ({ ok: true, musicXml: await read(second), pagesRead: 3, pages: 3, backend: 'wasm', durationMs: 1 }), undefined, scanStamp('?words=read'));
		expect(first).toMatchObject({ ok: true, from: 'homr' });
		const kept = first.ok ? first.reading! : null;
		// Reopened: nothing is read, the stored text is ingested again.
		const again = await restoreScan(new File([], 'a.pdf'), 'pdf', kept, async () => { throw new Error('not read again'); }, undefined, scanStamp('?words=read'));
		expect(again).toMatchObject({ ok: true, from: 'kept' });
		const got = await arrive(readingFile(new File([''], 'song.pdf'), again.ok ? again.musicXml : ''));
		expect(got.result.warnings.find((x) => x.code === 'words-partly-read')?.bars).toEqual([song]);
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
		expect(lines.some((l) => l.includes('so nothing is written'))).toBe(true);
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
