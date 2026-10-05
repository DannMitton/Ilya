/**
 * joinPages, on homr-web's own MusicXML for the three pages of Tchaikovsky
 * Op. 38 No. 3, as homr-web 0.2.0-ilya.2 (model 465, OCR off) wrote them in
 * headless Chromium on 2026-10-05, through its Worker, from a 400 dpi
 * greyscale PNG of each page. The fixtures are that program's output, kept
 * unchanged; they are byte for byte the port's output under Node on the
 * same pages.
 *
 * The reference counts are those of the desk's converter
 * (`part22/in/tools/conv.py`) run on the same three files: 27, 35, and 37
 * bars (99 in all, every bar of the song), and 174 pitched notes on the first
 * part's first staff, leaving out chord notes and grace notes.
 *
 * The voice part of page 3 states a key of three sharps in its first bar and
 * two sharps again later on the page. The join keeps both, as it keeps any
 * key that differs from the one in force, so the joined part holds three
 * `<key>` elements.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { MusicXmlScoreParser } from '@ilya/score-parser';
import { parseXml, type MiniEl } from '$lib/score/ingestion/mini-dom';
import { joinPages, JoinPagesError } from './join-pages';

const fixture = (name: string) => readFileSync(new URL(`./fixtures/${name}`, import.meta.url), 'utf8');
const PAGES = ['tch-1.musicxml', 'tch-2.musicxml', 'tch-3.musicxml'].map(fixture);

const kids = (el: MiniEl, tag: string) => el.children.filter((c) => c.tagName === tag);
const text = (el: MiniEl, tag: string) => el.getElementsByTagName(tag)[0]?.textContent.trim() ?? null;

/** conv.py's count: pitched notes on staff 1 that are neither chord notes nor grace notes. */
function countLikeConv(part: MiniEl): number {
	return part
		.getElementsByTagName('note')
		.filter((n) => (text(n, 'staff') ?? '1') === '1')
		.filter((n) => n.getElementsByTagName('chord').length === 0 && n.getElementsByTagName('grace').length === 0)
		.filter((n) => n.getElementsByTagName('pitch').length > 0).length;
}

describe('joinPages on the three Tchaikovsky pages', () => {
	const joined = joinPages(PAGES);
	const doc = parseXml(joined);
	const root = doc.children[0];

	it('holds one part, the voice, and one score-part', () => {
		expect(root.tagName).toBe('score-partwise');
		expect(kids(root, 'part')).toHaveLength(1);
		const list = kids(root, 'part-list')[0];
		expect(kids(list, 'score-part')).toHaveLength(1);
		expect(text(list, 'part-name')).toBe('Voice');
	});

	it('has the 99 measures of the three pages, numbered 1 to 99 in order', () => {
		const measures = kids(kids(root, 'part')[0], 'measure');
		expect(measures).toHaveLength(99);
		expect(measures.map((m) => m.getAttribute('number'))).toEqual(
			Array.from({ length: 99 }, (_, i) => String(i + 1)),
		);
	});

	it('has the 174 voice notes the desk converter counts on the same files', () => {
		expect(countLikeConv(kids(root, 'part')[0])).toBe(174);
	});

	it('keeps every note element of the first part of each page, but for the rests of a bar in which the voice is silent', () => {
		const hasPitch = (m: MiniEl) => kids(m, 'note').some((n) => n.getElementsByTagName('pitch').length > 0);
		// What the pages hold in the bars where the voice sings: these must all arrive.
		const perPage = PAGES.map((p) => kids(kids(parseXml(p).children[0], 'part')[0], 'measure')
			.filter(hasPitch)
			.reduce((n, m) => n + kids(m, 'note').length, 0));
		const out = kids(kids(root, 'part')[0], 'measure').reduce((n, m) => n + kids(m, 'note').length, 0);
		expect(out).toBe(perPage.reduce((a, b) => a + b, 0));
	});

	it('leaves a bar in which the voice is silent empty, so Ilya counts it as silent and collapses a run of them', async () => {
		const measures = kids(kids(root, 'part')[0], 'measure');
		// The song opens with seven silent bars; the voice enters in bar 8.
		for (let i = 0; i < 7; i++) expect(kids(measures[i], 'note')).toHaveLength(0);
		expect(kids(measures[7], 'note').length).toBeGreaterThan(0);
		// No bar is left holding rests alone.
		for (const m of measures) {
			const notes = kids(m, 'note');
			if (notes.length > 0) expect(notes.some((n) => n.getElementsByTagName('pitch').length > 0)).toBe(true);
		}
		// Ilya's test for a silent bar is "the vocal line has no event in it" (`tacetRuns`).
		const result = await new MusicXmlScoreParser().parse({
			format: 'musicxml',
			data: doc as unknown as Document,
			sourcePath: 'tchaikovsky-op38-3.musicxml',
		});
		const score = result.score!;
		expect(score.measures).toHaveLength(99);
		const sung = new Set(score.vocalLine.map((ev) => ev.measureIndex));
		for (let i = 0; i < 7; i++) expect(sung.has(score.measures[i].index)).toBe(false);
		expect(sung.has(score.measures[7].index)).toBe(true);
	});

	it('states the key, metre, and clef of the first page once, drops later restatements and the writer\'s own metre, and keeps a changed key', () => {
		const measures = kids(kids(root, 'part')[0], 'measure');
		const first = measures[0];
		expect(text(first, 'fifths')).toBe('2');
		expect(text(first, 'beats')).toBe('3');
		expect(text(first, 'beat-type')).toBe('8');
		expect(text(first, 'sign')).toBe('G');
		// Page 3's voice part states three sharps in its first bar (bar 63) and two again at bar 71.
		const keyed = measures.filter((m) => m.getElementsByTagName('key').length > 0);
		expect(keyed.map((m) => `${m.getAttribute('number')}:${text(m, 'fifths')}`)).toEqual(['1:2', '63:3', '71:2']);
		// The writer's own metre (1/4, beside <divisions> on every page) is gone; the printed 3/8 is the only one.
		expect(root.getElementsByTagName('time')).toHaveLength(1);
		expect(root.getElementsByTagName('clef')).toHaveLength(1);
		// Each page keeps its own divisions: page 1 counts in 2, pages 2 and 3 in 4.
		expect(text(measures[0], 'divisions')).toBe('2');
		expect(text(measures[27], 'divisions')).toBe('4');
		expect(text(measures[62], 'divisions')).toBe('4');
	});

	it('parses with the score-parser Ilya ingests a dropped MusicXML file with', async () => {
		const result = await new MusicXmlScoreParser().parse({
			format: 'musicxml',
			data: doc as unknown as Document,
			sourcePath: 'tchaikovsky-op38-3.musicxml',
		});
		expect(result.errors.filter((e) => e.fatal)).toEqual([]);
		expect(result.score).toBeTruthy();
	});
});

describe('joinPages on small hand-built pages', () => {
	const page = (parts: string, list: string) =>
		`<?xml version="1.0"?><score-partwise version="4.0"><part-list>${list}</part-list>${parts}</score-partwise>`;
	const note = (step: string, extra = '') =>
		`<note><pitch><step>${step}</step><octave>4</octave></pitch><duration>2</duration>${extra}<type>quarter</type></note>`;
	const LIST = '<score-part id="P1"><part-name>Voice</part-name></score-part><score-part id="P2"><part-name>Piano</part-name></score-part>';

	it('keeps ties across the join of two pages', () => {
		const a = page(
			`<part id="P1"><measure number="1"><attributes><divisions>2</divisions><key><fifths>0</fifths></key><time><beats>2</beats><beat-type>4</beat-type></time><clef><sign>G</sign><line>2</line></clef></attributes>${note('C')}${note('D', '<tie type="start"/>')}</measure></part><part id="P2"><measure number="1">${note('E')}</measure></part>`,
			LIST,
		);
		const b = page(
			`<part id="P1"><measure number="1"><attributes><divisions>2</divisions></attributes>${note('D', '<tie type="stop"/>')}${note('E')}</measure></part>`,
			LIST,
		);
		const out = joinPages([a, b]);
		expect(out.match(/<tie type="start"\/>/g)).toHaveLength(1);
		expect(out.match(/<tie type="stop"\/>/g)).toHaveLength(1);
		expect(out).not.toContain('Piano');
		expect(out.match(/<measure number="2">/g)).toHaveLength(1);
	});

	it('keeps a change of key that a later page prints', () => {
		const attrs = (fifths: number) =>
			`<attributes><divisions>2</divisions><key><fifths>${fifths}</fifths></key><clef><sign>G</sign><line>2</line></clef></attributes>`;
		const a = page(`<part id="P1"><measure number="1">${attrs(2)}${note('C')}</measure></part>`, LIST);
		const b = page(`<part id="P1"><measure number="1">${attrs(-1)}${note('C')}</measure></part>`, LIST);
		const out = joinPages([a, b]);
		expect(out.match(/<fifths>/g)).toHaveLength(2);
		expect(out.match(/<clef>/g)).toHaveLength(1);
	});

	it('keeps the first staff only where the voice part has two', () => {
		const a = page(
			`<part id="P1"><measure number="1"><attributes><divisions>2</divisions><staves>2</staves><clef number="1"><sign>G</sign><line>2</line></clef><clef number="2"><sign>F</sign><line>4</line></clef></attributes>${note('C', '<staff>1</staff>')}<backup><duration>2</duration></backup>${note('A', '<staff>2</staff>')}</measure></part>`,
			LIST,
		);
		const out = joinPages([a]);
		expect(out).not.toContain('<staves>');
		expect(out).not.toContain('<backup>');
		expect(out).not.toContain('<step>A</step>');
		expect(out.match(/<clef/g)).toHaveLength(1);
		expect(out).toContain('<step>C</step>');
	});

	it('drops the metre the writer adds beside <divisions>, keeps a printed one, and keeps the imgpos comment in a note', () => {
		const writers = '<attributes><divisions>2</divisions><time><beats>1</beats><beat-type>4</beat-type></time></attributes>';
		const printed = (beats: number) =>
			`<attributes><clef number="1"><sign>G</sign><line>2</line></clef><key><fifths>0</fifths></key>${beats ? `<time><beats>${beats}</beats><beat-type>8</beat-type></time>` : ''}</attributes>`;
		const sung = note('C', '<!-- imgpos: 10, 20 -->');
		const a = page(`<part id="P1"><measure number="1">${writers}${printed(3)}${sung}</measure></part>`, LIST);
		const b = page(`<part id="P1"><measure number="1">${writers}${printed(0)}${sung}</measure></part>`, LIST);
		const c = page(`<part id="P1"><measure number="1">${writers}${printed(6)}${sung}</measure></part>`, LIST);
		const out = joinPages([a, b, c]);
		expect(out.match(/<beats>\d+<\/beats>/g)).toEqual(['<beats>3</beats>', '<beats>6</beats>']);
		expect(out).not.toContain('<beat-type>4</beat-type>');
		expect(out.match(/<!-- imgpos: 10, 20 -->/g)).toHaveLength(3);
		// A first page that prints no metre keeps the writer's, so the song has one.
		expect(joinPages([b])).toContain('<beats>1</beats>');
	});

	it('refuses a page with no part', () => {
		expect(() => joinPages(['<score-partwise version="4.0"><part-list/></score-partwise>'])).toThrow(JoinPagesError);
		expect(() => joinPages([])).toThrow(JoinPagesError);
	});
});
