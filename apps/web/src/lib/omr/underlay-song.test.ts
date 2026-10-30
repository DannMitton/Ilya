/**
 * applyUnderlay: each system that has a Russian row keeps its words; the rest
 * lose only themselves, and the SONG's bars of what was lost are named (brief r5
 * step 2). The rest of the proof, through the join, is in
 * `underlay-integration.test.ts`.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { applyUnderlay } from './underlay-song';
import { joinPages } from './join-pages';
import { measureCount, voiceNotes } from './underlay-prepare';
import type { SystemWords, UnderlayPage } from './underlay-page';

/** A page of `bars` bars, two notes each, numbered from 1 as homr numbers every page. */
const xml = (bars: number, tag = 'P') =>
	`<score-partwise><part id="P1">${Array.from({ length: bars }, (_, i) => `<measure number="${i + 1}"><note><pitch/></note><note><pitch/></note></measure>`).join('')}</part></score-partwise><!--${tag}-->`;
/** The same, a page of the piano alone: one part on two staves, every note on the lower. */
const pianoAlone = (bars: number) =>
	`<score-partwise><part id="P1"><staves>2</staves>${Array.from({ length: bars }, (_, i) => `<measure number="${i + 1}"><note><pitch/><staff>2</staff></note></measure>`).join('')}</part></score-partwise>`;
/** A page of a voice over a piano: the voice on one staff, the piano on two. */
const withPiano = (bars: number) =>
	`<score-partwise><part id="P1">${Array.from({ length: bars }, (_, i) => `<measure number="${i + 1}"><note><pitch/></note></measure>`).join('')}</part><part id="P2"><staves>2</staves><measure number="1"><note><pitch/><staff>2</staff></note></measure></part></score-partwise>`;

const stats = (unseated = 0) => ({ systems: 1, banded: 1, rows: 1, russianRows: 1, systemsRussian: 1, fallback: 0, tokens: 1, units: 1, cuts: { cut: 0, whole: 1, mismatched: 0 }, seated: 1, unseated, words: 1, known: 1, clitics: { folded: 0, left: 0, ownNote: 0 }, counted: { ownNote: [], manyVowels: { cut: [], merged: [] }, breaches: [] } });
const ok = (bars: [number, number] = [1, 2]): SystemWords => ({ written: true, bars, why: null });
const bare = (bars: [number, number], why = 'no Russian row'): SystemWords => ({ written: false, bars, why });
const page = (texts: string[], systems: SystemWords[] = [ok()], unseated = 0): UnderlayPage => ({
	systems,
	words: texts.map((text, i) => ({ syllables: [{ note: i, text, syllabic: 'single' as const, sustained: false }] })),
	stats: stats(unseated),
	ms: { prepare: 0, read: 0, seat: 0 },
});

describe('applyUnderlay', () => {
	it('writes the words of every page, and says how many, with nothing to name where every system was written', () => {
		const out = applyUnderlay([xml(2, '1'), xml(2, '2')], [page(['а', 'б']), page(['в'])]);
		expect(out.written).toBe(true);
		expect(out.syllables).toBe(3);
		expect(out.xmls[0]).toContain('<text>а</text>');
		expect(out.xmls[1]).toContain('<text>в</text>');
		expect(out.line).toBe('3 syllables written on 2 of 2 pages');
		expect(out.unread).toEqual([]);
		expect(out.unreadBars).toEqual([]);
	});

	it('reports the unseated units', () => {
		expect(applyUnderlay([xml(2)], [page(['а'], [ok()], 4)]).line).toBe('1 syllables written on 1 of 1 pages, 4 units left unseated');
	});

	it('keeps the words of the pages that were read where another page took none, writing them into their own pages', () => {
		const out = applyUnderlay([xml(2, '1'), xml(2, '2')], [page(['а']), page([], [bare([1, 2])])]);
		expect(out.written).toBe(true);
		expect(out.xmls[0]).toContain('<text>а</text>');
		expect(out.xmls[1]).toBe(xml(2, '2'));
	});

	it('names the song\'s bars, not the page\'s, for a system unread on page 2 (mutant: page bars)', () => {
		// Page 1 has 8 bars; page 2\'s own bars 3 to 5 are the song\'s 11 to 13.
		const out = applyUnderlay([xml(8, '1'), xml(6, '2')], [page(['а']), page(['б'], [ok([1, 2]), bare([3, 5])])]);
		expect(out.unread).toEqual([{ page: 2, system: 2, bars: [11, 13], why: 'no Russian row' }]);
		expect(out.unreadBars).toEqual([[11, 13]]);
	});

	it('names the bars of a system with no band, and says so', () => {
		const out = applyUnderlay([xml(4)], [page(['а'], [ok([1, 2]), bare([3, 4], 'no band')])]);
		expect(out.unread).toEqual([{ page: 1, system: 2, bars: [3, 4], why: 'no band' }]);
	});

	it('joins ranges that touch: 44 to 46 and 47 to 51 make 44 to 51, and 44 to 46 and 48 to 51 stay two', () => {
		const first = applyUnderlay([xml(60)], [page(['а'], [ok([1, 2]), bare([44, 46]), bare([47, 51])])]);
		expect(first.unreadBars).toEqual([[44, 51]]);
		expect(first.unread).toHaveLength(2);
		const second = applyUnderlay([xml(60)], [page(['а'], [ok([1, 2]), bare([44, 46]), bare([48, 51])])]);
		expect(second.unreadBars).toEqual([[44, 46], [48, 51]]);
	});

	it('names no bar of a page of the piano alone, which the join takes the notes from', () => {
		const pages = [withPiano(4), withPiano(4), pianoAlone(5)];
		const out = applyUnderlay(pages, [page(['а']), page(['б'], [ok([1, 2]), bare([3, 4])]), page(['в'], [bare([1, 5])])]);
		expect(out.unread).toEqual([{ page: 2, system: 2, bars: [7, 8], why: 'no Russian row' }]);
		expect(out.unreadBars).toEqual([[7, 8]]);
	});

	it('counts nothing a page of the piano alone seated as a syllable of the song', () => {
		const pages = [withPiano(4), pianoAlone(5)];
		const out = applyUnderlay(pages, [page([], [bare([1, 2])]), page(['в', 'г'], [ok([1, 5])])]);
		expect(out.syllables).toBe(0);
		expect(out.written).toBe(false);
	});

	it('names every bar of its first part that holds a voice note for a page that answers null, unless it is a page of the piano alone', () => {
		const pages = [withPiano(4), withPiano(6), pianoAlone(5)];
		const out = applyUnderlay(pages, [page(['а']), null, null]);
		expect(out.unread).toEqual([{ page: 2, system: null, bars: [5, 10], why: 'page not read' }]);
		expect(out.unreadBars).toEqual([[5, 10]]);
		expect(out.xmls[1]).toBe(pages[1]);
	});

	it('names the bars of a page read with no system on it: nothing on it was read', () => {
		const out = applyUnderlay([xml(3), xml(3)], [page(['а']), { ...page([]), systems: [] }]);
		expect(out.unread).toEqual([{ page: 2, system: null, bars: [4, 6], why: 'no staff found' }]);
	});

	it('does not name a bar where no voice system was written: the song is told as it is today', () => {
		const out = applyUnderlay([xml(4), xml(4)], [page([], [bare([1, 4])]), null]);
		expect(out.written).toBe(false);
		expect(out.unreadBars).toEqual([]);
		expect(out.xmls).toEqual([xml(4), xml(4)]);
		expect(out.line).toContain('page 2 could not be read');
	});

	it('writes nothing where no page has a word', () => {
		const out = applyUnderlay([xml(2)], [page([])]);
		expect(out.written).toBe(false);
		expect(out.line).toBe('no voice staff with words was found, so nothing is written');
	});

	it('says in its line which parts took no words, by page, system, and song bars', () => {
		const out = applyUnderlay([xml(8, '1'), xml(6, '2')], [page(['а']), page(['б'], [ok([1, 2]), bare([3, 5])])]);
		expect(out.line).toBe('2 syllables written on 2 of 2 pages; no words in page 2 system 2 (bars 11 to 13, no Russian row)');
	});

	it('counts the unseated units of the pages that answered, written or not', () => {
		expect(applyUnderlay([xml(2), xml(2)], [page(['а'], [ok()], 2), null]).unseated).toBe(2);
	});

	it('leaves a page with no words as it is while it writes the others', () => {
		const out = applyUnderlay([xml(2, '1'), xml(2, '2')], [page([], [bare([1, 2])]), page(['в'])]);
		expect(out.written).toBe(true);
		expect(out.xmls[0]).toBe(xml(2, '1'));
	});
});

describe('the song\'s bars and the join\'s agree', () => {
	const fixture = (name: string) => readFileSync(new URL(`./fixtures/${name}.musicxml`, import.meta.url), 'utf8');
	const PAGES = ['tch-1', 'tch-2', 'tch-3'].map(fixture);

	it('numbers a bar of page 2 as the join numbers it: the same note stands in the joined bar of that number', () => {
		const joined = joinPages(PAGES);
		const second = voiceNotes(PAGES[1]).filter((n) => !n.rest && n.at);
		// The page\'s own bars 3 and 7, a bar that holds a note with a place on the page.
		for (const bar of [3, 7]) {
			const note = second.find((n) => n.bar === bar)!;
			const out = applyUnderlay(PAGES, [page(['а']), page([], [bare([bar, bar])]), page(['б'])]);
			const song = out.unread[0].bars[0];
			expect(song).toBe(measureCount(PAGES[0]) + bar);
			const m = new RegExp(`<measure number="${song}"[\\s\\S]*?</measure>`).exec(joined);
			expect(m?.[0]).toContain(`imgpos: ${note.at!.x}, ${note.at!.y}`);
		}
	});
});

describe('a page of the piano alone (brief r5 step 3)', () => {
	const fixture = (name: string) => readFileSync(new URL(`./fixtures/${name}.musicxml`, import.meta.url), 'utf8');
	/** tch-2 with its voice part taken out: homr's reading of a page that prints the piano alone. */
	const alone = fixture('tch-2')
		.replace(/<part id="P1">[\s\S]*?<\/part>\s*/, '')
		.replace(/<score-part id="P1">[\s\S]*?<\/score-part>\s*/, '')
		.replace(/id="P2"/g, 'id="P1"');
	const word = (note: number, text: string) => ({ syllables: [{ note, text, syllabic: 'single' as const, sustained: false }] });

	it('is read as a page with notes in its first part', () => {
		expect(voiceNotes(alone).filter((n) => !n.rest).length).toBeGreaterThan(10);
	});

	it('does not carry the words written on it into the joined MusicXML', () => {
		const pages = [fixture('tch-1'), alone];
		const piano = voiceNotes(alone).filter((n) => !n.rest);
		const voice = voiceNotes(pages[0]).filter((n) => !n.rest);
		const written = applyUnderlay(pages, [
			{ ...page([]), words: [word(voice[0].ordinal, 'голос')], systems: [ok()] },
			{ ...page([]), words: piano.slice(0, 3).map((n, i) => word(n.ordinal, `слово${i}`)), systems: [ok([1, 4])] },
		]);
		// The piano-alone page's words are written into its own page, as the reader leaves them...
		expect(written.xmls[1]).toContain('слово0');
		// ...and the join takes them out with its notes.
		const joined = joinPages(written.xmls);
		expect(joined).toContain('голос');
		expect(joined).not.toContain('слово');
	});
});
