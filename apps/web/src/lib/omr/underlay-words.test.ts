/**
 * sewWords and writeLyrics. The proof the brief asks for is the last describe:
 * a hand-made seat list on homr's reading of Tchaikovsky op. 38 no. 3
 * (`fixtures/tch-3.musicxml`, two parts, 88 voice notes, no lyrics) is written
 * as `<lyric>`, the parser then finds the lyric part, `no-lyrics-found` does
 * not fire, and `collectScoreWords` returns the seated words in order.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { MusicXmlScoreParser } from '@ilya/score-parser';
import { parseXml } from '$lib/score/ingestion/mini-dom';
import { collectScoreWords } from '$lib/score/vowel-resolver';
import { placeOf } from './join-pages';
import { kindOf, seatTokens, type NotePlace, type Seat, type Token } from './underlay-seat';
import { sewWords, writeLyrics, type Word } from './underlay-words';

/** A seat made by hand: a syllable on `note`, or a joint, extender, or mark. */
function seat(text: string, note: number | null = null, offset = 0): Seat {
	const kind = kindOf(text);
	return {
		token: 0,
		kind,
		text,
		x: 0,
		note: kind === 'syllable' ? note : null,
		offset: kind === 'syllable' && note !== null ? offset : null,
		by: kind === 'syllable' && note !== null ? 'monotone' : null,
		unseated: kind === 'syllable' && note === null,
		runTogether: false,
		shared: false,
	};
}

const shape = (words: Word[]) => words.map((w) => w.syllables.map((s) => [s.text, s.syllabic, s.note]));

describe('sewWords', () => {
	it('gives a word of one syllable the role single', () => {
		expect(shape(sewWords([seat('Средь', 0)]))).toEqual([[['Средь', 'single', 0]]]);
	});

	it('joins a token that ends in a hyphen to the next, and gives begin, middle, and end', () => {
		const words = sewWords([seat('шум-', 0), seat('но-', 1), seat('го', 2), seat('ба-', 3), seat('ла', 4)]);
		expect(shape(words)).toEqual([
			[['шум', 'begin', 0], ['но', 'middle', 1], ['го', 'end', 2]],
			[['ба', 'begin', 3], ['ла', 'end', 4]],
		]);
	});

	it('does not join two tokens with no hyphen between them', () => {
		expect(sewWords([seat('и', 0), seat('он', 1)])).toHaveLength(2);
	});

	it('joins the neighbours of a lone hyphen, whichever side the token\'s own hyphen is on', () => {
		expect(shape(sewWords([seat('су', 0), seat('-'), seat('е', 1)]))).toEqual([[['су', 'begin', 0], ['е', 'end', 1]]]);
		expect(shape(sewWords([seat('су', 0), seat('-е', 1)]))).toEqual([[['су', 'begin', 0], ['е', 'end', 1]]]);
		expect(shape(sewWords([seat('су-', 0), seat('-'), seat('е', 1)]))).toEqual([[['су', 'begin', 0], ['е', 'end', 1]]]);
	});

	it('ignores a lone hyphen before any syllable, and keeps the next word a word of its own', () => {
		expect(shape(sewWords([seat('-'), seat('Средь', 0)]))).toEqual([[['Средь', 'single', 0]]]);
	});

	it('carries a word across rows: a hyphen that ends one row joins the first token of the next', () => {
		const row1 = [seat('Ком-', 0), seat('нат-', 1)];
		const row2 = [seat('ка', 2), seat('тес', 3)];
		expect(shape(sewWords([...row1, ...row2]))).toEqual([
			[['Ком', 'begin', 0], ['нат', 'middle', 1], ['ка', 'end', 2]],
			[['тес', 'single', 3]],
		]);
	});

	it('keeps the print\'s punctuation, case, and old letters, and strips only the joining hyphens', () => {
		const words = sewWords([seat('Зву-', 0), seat('читъ!', 1), seat('гѣ,', 2), seat('–мир', 3)]);
		expect(shape(words)).toEqual([[['Зву', 'begin', 0], ['читъ!', 'end', 1]], [['гѣ,', 'begin', 2], ['мир', 'end', 3]]]);
	});

	it('marks a syllable an extender follows as sustained, and no other', () => {
		const words = sewWords([seat('ты', 0), seat('___'), seat('и', 1)]);
		expect(words.map((w) => w.syllables.map((s) => s.sustained))).toEqual([[true], [false]]);
	});

	it('does not let an extender break the word it stands in', () => {
		const words = sewWords([seat('зву-', 0), seat('___'), seat('чит', 1)]);
		expect(shape(words)).toEqual([[['зву', 'begin', 0], ['чит', 'end', 1]]]);
		expect(words[0].syllables.map((s) => s.sustained)).toEqual([true, false]);
	});

	it('drops a mark with no letter, and a syllable with no note', () => {
		expect(shape(sewWords([seat('Средь', 0), seat(','), seat('шум', null), seat('и', 1)]))).toEqual([
			[['Средь', 'single', 0]],
			[['и', 'single', 1]],
		]);
	});

	it('keeps, of two tokens on one note, the one nearer its head', () => {
		const words = sewWords([seat('су-', 3, 40), seat('е', 3, -6), seat('ты', 4)]);
		expect(shape(words)).toEqual([[['е', 'single', 3]], [['ты', 'single', 4]]]);
	});

	it('keeps the first of two tokens on one note when they are as near', () => {
		expect(shape(sewWords([seat('а', 3, 5), seat('б', 3, -5)]))).toEqual([[['а', 'single', 3]]]);
	});

	it('gives no words for no seats', () => {
		expect(sewWords([])).toEqual([]);
	});
});

const note = (extra = '') => `      <note${extra}>\n        <pitch><step>C</step><octave>4</octave></pitch>\n        <duration>4</duration>\n        <!-- imgpos: 10, 20 -->\n      </note>\n`;
const rest = `      <note>\n        <rest />\n        <duration>4</duration>\n      </note>\n`;
const score = (voice: string, piano = note()) =>
	`<score-partwise>\n  <part-list>\n    <score-part id="P1"><part-name>Voice</part-name></score-part>\n  </part-list>\n  <part id="P1">\n    <measure number="1">\n${voice}    </measure>\n  </part>\n  <part id="P2">\n    <measure number="1">\n${piano}    </measure>\n  </part>\n</score-partwise>\n`;
const syl = (n: number, text: string, syllabic: 'single' | 'begin' | 'middle' | 'end' = 'single') => ({ note: n, text, syllabic, sustained: false });
const one = (...s: ReturnType<typeof syl>[]): Word[] => s.map((x) => ({ syllables: [x] }));
/** The ordinals, over every note of the file in document order, of the notes that hold a lyric. */
const withLyric = (xml: string): number[] =>
	[...xml.matchAll(/<note[\s>][\s\S]*?<\/note>/g)].flatMap((m, i) => (/<lyric[\s>]/.test(m[0]) ? [i] : []));

describe('writeLyrics', () => {
	it('adds one lyric number 1 with syllabic and text, laid out as the note is', () => {
		const out = writeLyrics(score(note()), one(syl(0, 'Средь')));
		expect(out).toBe(
			score(
				`      <note>\n        <pitch><step>C</step><octave>4</octave></pitch>\n        <duration>4</duration>\n        <!-- imgpos: 10, 20 -->\n` +
					`        <lyric number="1">\n          <syllabic>single</syllabic>\n          <text>Средь</text>\n        </lyric>\n      </note>\n`,
			),
		);
	});

	it('writes the syllabic role it is given', () => {
		const xml = score(note() + note() + note());
		const out = writeLyrics(xml, [{ syllables: [syl(0, 'шум', 'begin'), syl(1, 'но', 'middle'), syl(2, 'го', 'end')] }]);
		expect([...out.matchAll(/<syllabic>(\w+)<\/syllabic>\s*<text>([^<]*)<\/text>/g)].map((m) => [m[1], m[2]])).toEqual([
			['begin', 'шум'],
			['middle', 'но'],
			['end', 'го'],
		]);
	});

	it('writes into a note with no line breaks inside it without adding any', () => {
		const xml = `<score-partwise><part id="P1"><measure number="1"><note><pitch><step>C</step><octave>4</octave></pitch></note></measure></part></score-partwise>`;
		expect(writeLyrics(xml, one(syl(0, 'ты')))).toBe(
			`<score-partwise><part id="P1"><measure number="1"><note><pitch><step>C</step><octave>4</octave></pitch><lyric number="1"><syllabic>single</syllabic><text>ты</text></lyric></note></measure></part></score-partwise>`,
		);
	});

	it('keeps the line ending the file uses', () => {
		const crlf = score(note()).replace(/\n/g, '\r\n');
		const out = writeLyrics(crlf, one(syl(0, 'ты')));
		expect(out.replace(/\r\n/g, '')).not.toContain('\n');
		expect(out.replace(/[ \t]*<lyric number="1">[\s\S]*?<\/lyric>\r\n/, '')).toBe(crlf);
	});

	it('counts a rest in the note numbering and writes no lyric on it', () => {
		const xml = score(rest + note() + note());
		const out = writeLyrics(xml, one(syl(0, 'нет'), syl(2, 'да')));
		expect(withLyric(out)).toEqual([2]);
		expect(out).not.toContain('нет');
	});

	it('counts a note that has attributes', () => {
		const out = writeLyrics(score(note(' default-x="12"') + note()), one(syl(1, 'вторая')));
		expect(withLyric(out)).toEqual([1]);
	});

	it('leaves a note that already has a lyric as it is', () => {
		const held = score(`      <note>\n        <pitch><step>C</step><octave>4</octave></pitch>\n        <lyric number="1"><text>было</text></lyric>\n      </note>\n`);
		expect(writeLyrics(held, one(syl(0, 'стало')))).toBe(held);
	});

	it('writes the voice, which is the first part, and leaves the second part alone', () => {
		const xml = score(note());
		// The piano part holds one note of its own, numbered after the voice's; asking for it writes nothing.
		expect(writeLyrics(xml, one(syl(1, 'рояль')))).toBe(xml);
		const out = writeLyrics(xml, one(syl(0, 'голос')));
		expect(out.slice(out.indexOf('<part id="P2"'))).toBe(xml.slice(xml.indexOf('<part id="P2"')));
	});

	it('writes the old letters as read: no modernizing', () => {
		const words = ['гѣ', 'міръ', 'ѳома', 'ѵмнъ', 'читъ!'];
		const out = writeLyrics(score(words.map(() => note()).join('')), one(...words.map((w, i) => syl(i, w))));
		expect([...out.matchAll(/<text>([^<]*)<\/text>/g)].map((m) => m[1])).toEqual(words);
	});

	it('escapes what XML cannot hold', () => {
		const out = writeLyrics(score(note()), one(syl(0, 'a&b<c>')));
		expect(out).toContain('<text>a&amp;b&lt;c&gt;</text>');
	});

	it('writes the first of two syllables given for one note', () => {
		const out = writeLyrics(score(note()), one(syl(0, 'первый'), syl(0, 'второй')));
		expect(out).toContain('первый');
		expect(out).not.toContain('второй');
	});

	it('returns the file itself, the same string, where there is nothing to write', () => {
		const xml = score(note());
		expect(writeLyrics(xml, [])).toBe(xml);
		expect(writeLyrics('<score-partwise></score-partwise>', one(syl(0, 'ты')))).toBe('<score-partwise></score-partwise>');
		expect(writeLyrics(xml, one(syl(9, 'ты')))).toBe(xml);
	});
});

describe('from homr\'s reading of Tchaikovsky op. 38 no. 3 to the words the parser reads', () => {
	const fixture = readFileSync(fileURLToPath(new URL('./fixtures/tch-3.musicxml', import.meta.url)), 'utf8');

	/** The notes of the first part, in document order: ordinal, whether a rest, bar, and the page x of its head. */
	function voiceNotes(xml: string) {
		const start = xml.indexOf('<part id="P1"');
		const part = xml.slice(start, xml.indexOf('</part>', start));
		const out: { ordinal: number; rest: boolean; lyric: boolean; bar: number; x: number | null }[] = [];
		let bar = 0;
		for (const m of part.matchAll(/<measure number="(\d+)"|<note[\s>][\s\S]*?<\/note>/g)) {
			if (m[1] !== undefined) bar = Number(m[1]);
			else out.push({ ordinal: out.length, rest: /<rest[\s/>]/.test(m[0]), lyric: /<lyric[\s>]/.test(m[0]), bar, x: placeOf(m[0])?.x ?? null });
		}
		return out;
	}

	const notes = voiceNotes(fixture);
	const pitched = notes.filter((n) => !n.rest);
	const parse = async (xml: string) =>
		new MusicXmlScoreParser().parse({ format: 'musicxml', data: parseXml(xml) as unknown as Document, sourcePath: 'tch-3.musicxml' });

	// «Средь шумного бала, и гѣ звучитъ!» as the print divides it, on the first ten sung notes.
	const at = (k: number) => pitched[k].ordinal;
	const seats: Seat[] = [
		seat('Средь', at(0)),
		seat('шум-', at(1)),
		seat('но', at(2)),
		seat('-'),
		seat('го', at(3)),
		seat('ба', at(4)),
		seat('-'),
		seat('ла,', at(5)),
		seat('и', at(6)),
		seat('гѣ', at(7)),
		seat('зву-', at(8)),
		seat('читъ!', at(9)),
		seat('___'),
	];
	const seated = ['Средь', 'шумного', 'бала,', 'и', 'гѣ', 'звучитъ!'];

	it('is a reading of two parts with 88 voice notes and no lyrics', () => {
		expect(notes).toHaveLength(88);
		expect(pitched.length).toBeGreaterThanOrEqual(10);
		expect(fixture).not.toContain('<lyric');
	});

	it('adds nothing but the lyrics: taking them out gives the file back byte for byte', async () => {
		const out = writeLyrics(fixture, sewWords(seats));
		expect(out.match(/<lyric number="1">/g)).toHaveLength(10);
		expect(out.replace(/[ \t]*<lyric number="1">[\s\S]*?<\/lyric>\r?\n/g, '')).toBe(fixture);
		expect(out.length).toBeGreaterThan(fixture.length);
	});

	it('puts each syllable on the note it was seated on, and on no rest', () => {
		const out = writeLyrics(fixture, sewWords(seats));
		const written = voiceNotes(out);
		expect(written.filter((n) => n.lyric).map((n) => n.ordinal)).toEqual(pitched.slice(0, 10).map((n) => n.ordinal));
		expect(written.filter((n) => n.rest && n.lyric)).toEqual([]);
	});

	it('makes the parser find the lyric part, where it found none before', async () => {
		const before = await parse(fixture);
		expect(before.warnings.map((w) => w.code)).toContain('no-lyrics-found');

		const after = await parse(writeLyrics(fixture, sewWords(seats)));
		expect(after.warnings.map((w) => w.code)).not.toContain('no-lyrics-found');
		expect(after.warnings.map((w) => w.code)).not.toContain('multiple-vocal-parts');
		expect(after.score.vocalPart.partId).toBe('P1');
	});

	it('gives collectScoreWords the seated words, in order', async () => {
		const { score: parsed } = await parse(writeLyrics(fixture, sewWords(seats)));
		expect(collectScoreWords(parsed, 1).map((w) => w.raw)).toEqual(seated);
	});

	it('seats a syllable on the event of its own note', async () => {
		const { score: parsed } = await parse(writeLyrics(fixture, sewWords(seats)));
		const words = collectScoreWords(parsed, 1);
		const sung = parsed.vocalLine.filter((e) => e.type !== 'rest');
		expect(words.flatMap((w) => w.cells.map((c) => c.eventId))).toEqual(sung.slice(0, 10).map((e) => e.id));
	});

	it('goes from boxes to lyrics: seatTokens, sewWords, writeLyrics, and the parser', async () => {
		// Ten tokens, each box centred 9 px right of its note's head, with the print's hyphens as separate tokens.
		const places: NotePlace[] = pitched.slice(0, 10).map((n) => ({ id: n.ordinal, x: n.x as number, bar: n.bar }));
		const texts = ['Средь', 'шум-', 'но-', 'го', 'ба-', 'ла,', 'и', 'гѣ', 'зву-', 'читъ!'];
		const tokens: Token[] = texts.map((text, k) => ({ text, x0: places[k].x - 11, x1: places[k].x + 29 }));
		const { score: parsed } = await parse(writeLyrics(fixture, sewWords(seatTokens(tokens, places, 'monotone'))));
		expect(collectScoreWords(parsed, 1).map((w) => w.raw)).toEqual(seated);
	});
});
